"""
Reviews swipe-card stack — the specific UX we just fixed.

Verifies:
  - Section + heading render
  - Aggregate "X.X★ · N Reviews" badge present
  - Arrow buttons advance the counter by exactly one
  - The bug from the last patch does NOT recur (one click ≠ N cards gone)
  - Restart button reappears once the deck is empty
"""

import re
import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import wait_for, wait_present, dismiss_cookie_banner


def _scroll_into_reviews(driver):
    """Scroll the swipe stack into view so the section paints.

    Uses staged scrolls so every Reveal section above the target gets
    its IntersectionObserver triggered (Reveal starts at opacity-0, and
    Selenium's visibility checks fail until the observer fires).
    """
    dismiss_cookie_banner(driver)
    for y in (1000, 2000, 3000, 4000, 5000):
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(0.2)
    # Anchor on the unique "kirana" word — disambiguates from the
    # distributor-strip heading "Trusted in homes across Northeast India".
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//h2[contains(., 'kirana shelves')]")
        )
    )
    # Give the swipe stack a tick to mount (it's a "use client" child)
    time.sleep(0.4)


def _counter(driver) -> tuple[int, int] | None:
    """Read the 'X of N' counter under the stack.

    Uses JS textContent because the counter sits inside a Reveal whose
    opacity may be transiently 0 — Selenium's `.text` would return ''.
    """
    candidates = driver.find_elements(
        By.XPATH, "//div[contains(@class, 'uppercase') and contains(@class, 'tracking-')]"
    )
    for el in candidates:
        text = driver.execute_script("return arguments[0].textContent;", el) or ""
        m = re.search(r"(\d+)\s+of\s+(\d+)", text)
        if m:
            return int(m.group(1)), int(m.group(2))
    return None


@pytest.mark.smoke
def test_reviews_heading_and_badge(driver, base_url):
    driver.get(base_url)
    _scroll_into_reviews(driver)
    heading = driver.find_element(By.XPATH, "//h2[contains(., 'kirana shelves')]")
    # textContent bypasses the Reveal opacity-0 visibility gate
    text = driver.execute_script("return arguments[0].textContent;", heading)
    assert "kirana shelves" in (text or ""), f"unexpected heading: {text!r}"

    # Aggregate badge contains "Reviews" label
    reviews_label = wait_present(
        driver,
        (By.XPATH, "//div[contains(translate(., 'REVIEWS', 'reviews'), 'reviews')][contains(@class, 'uppercase')]"),
    )
    assert reviews_label is not None


def test_counter_starts_at_one(driver, base_url):
    driver.get(base_url)
    _scroll_into_reviews(driver)
    counter = _counter(driver)
    assert counter is not None, "Counter not found"
    current, total = counter
    assert current == 1, f"Counter should start at 1, got {current}"
    assert total >= 1, f"Total should be >= 1, got {total}"


@pytest.mark.interactive
def test_right_arrow_swipes_exactly_one_card(driver, base_url):
    """
    Regression test for the cascade bug. Click ▶ once → counter goes
    from N to N+1, and crucially NOT to N+2 (which is what the buggy
    version did because the new front card consumed the same command).
    """
    driver.get(base_url)
    _scroll_into_reviews(driver)
    before = _counter(driver)
    assert before is not None
    if before[1] <= 1:
        pytest.skip("Need at least 2 reviews to test arrow behaviour")

    right = driver.find_element(
        By.CSS_SELECTOR, "button[aria-label='Next (swipe right)']"
    )
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", right)
    right.click()
    # Wait for the fly-out animation (280ms) + a small buffer for React state to settle
    time.sleep(0.6)

    after = _counter(driver)
    assert after is not None, "Counter disappeared after click"
    expected = (before[0] + 1, before[1])
    assert after == expected, \
        f"One click should advance by exactly 1: was {before}, now {after}"


@pytest.mark.interactive
def test_left_arrow_also_advances_only_one(driver, base_url):
    driver.get(base_url)
    _scroll_into_reviews(driver)
    before = _counter(driver)
    assert before is not None
    if before[1] <= 1:
        pytest.skip("Need at least 2 reviews to test arrow behaviour")

    left = driver.find_element(
        By.CSS_SELECTOR, "button[aria-label='Previous (swipe left)']"
    )
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", left)
    left.click()
    time.sleep(0.6)

    after = _counter(driver)
    assert after == (before[0] + 1, before[1])


@pytest.mark.interactive
def test_clicking_through_to_empty_state_shows_restart(driver, base_url):
    """Burn through every card and verify the Restart deck button appears."""
    driver.get(base_url)
    _scroll_into_reviews(driver)
    counter = _counter(driver)
    if counter is None:
        pytest.skip("Counter unavailable")
    total = counter[1]
    if total > 12:
        pytest.skip("Too many cards to burn through quickly")

    right = driver.find_element(
        By.CSS_SELECTOR, "button[aria-label='Next (swipe right)']"
    )
    for _ in range(total):
        # Re-fetch because the button may briefly disable during flight
        right = driver.find_element(
            By.CSS_SELECTOR, "button[aria-label='Next (swipe right)']"
        )
        # Skip if it's disabled (mid-flight) — give it a beat
        if right.get_attribute("disabled") is not None:
            time.sleep(0.4)
        try:
            right.click()
        except Exception:
            time.sleep(0.3)
        time.sleep(0.4)

    # Empty-state heading
    restart_btn = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//button[contains(., 'Restart deck')]")
        )
    )
    assert restart_btn.is_displayed()


@pytest.mark.interactive
def test_restart_brings_back_the_deck(driver, base_url):
    """After empty state + Restart, counter should be back to 1 of N."""
    driver.get(base_url)
    _scroll_into_reviews(driver)
    counter = _counter(driver)
    if counter is None:
        pytest.skip("Counter unavailable")
    total = counter[1]
    if total > 12:
        pytest.skip("Too many cards to burn through quickly")

    for _ in range(total):
        try:
            right = driver.find_element(
                By.CSS_SELECTOR, "button[aria-label='Next (swipe right)']"
            )
            if right.get_attribute("disabled") is None:
                right.click()
        except Exception:
            pass
        time.sleep(0.4)

    restart = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Restart deck')]"))
    )
    restart.click()
    time.sleep(0.4)
    after = _counter(driver)
    assert after == (1, total), f"Expected (1, {total}), got {after}"
