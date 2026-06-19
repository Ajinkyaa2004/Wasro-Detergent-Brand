"""
Splash-screen contract (v2 — first-visit-per-session gate):

  - First visit to '/'  →  splash mounts and is visible
  - Returning visit (same sessionStorage)  →  splash never mounts
  - Click anywhere      →  splash dismisses + storage flag is set
  - Auto-dismiss        →  splash gone by ~3.5s
  - Deep link to non-home  →  splash never shows
  - Splash sits above cookie banner (z-100 > z-60)
  - **Body scroll is restored after dismiss** (mobile regression test)

We deliberately do NOT use the conftest `dismiss_cookie_banner` here —
it pre-seeds the cookie key but we want a true first-paint experience
for these tests.
"""

import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


SPLASH_SELECTOR = (By.CSS_SELECTOR, "div[data-testid='wasro-splash']")
STORAGE_KEY = "wasro_splash_seen"


def _wait_splash_visible(driver, timeout=4):
    WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located(SPLASH_SELECTOR)
    )


def _wait_splash_gone(driver, timeout=6):
    """Splash exit budget: 0.35s children + 0.9s bg fade ≈ 1.25s total
    after dismiss. Default 6s timeout covers click + full exit + buffer."""
    WebDriverWait(driver, timeout).until_not(
        EC.presence_of_element_located(SPLASH_SELECTOR)
    )


def _flag(driver):
    return driver.execute_script(
        f"return window.sessionStorage.getItem('{STORAGE_KEY}');"
    )


def _body_overflow(driver):
    return driver.execute_script(
        "return getComputedStyle(document.body).overflow;"
    )


@pytest.mark.smoke
def test_first_visit_shows_splash(driver, base_url):
    driver.get(base_url)
    _wait_splash_visible(driver)
    # Before any interaction, storage flag has NOT been set
    assert _flag(driver) is None


def test_splash_has_logo_and_tagline(driver, base_url):
    driver.get(base_url)
    splash = WebDriverWait(driver, 4).until(
        EC.visibility_of_element_located(SPLASH_SELECTOR)
    )
    img = splash.find_element(By.CSS_SELECTOR, "img[alt='Wasro']")
    assert img is not None
    time.sleep(1.4)  # let the tagline reveal land
    text = driver.execute_script("return arguments[0].textContent;", splash) or ""
    assert "Trusted Clean" in text, f"Tagline not found: {text[:100]}"


def test_click_dismisses_and_sets_storage(driver, base_url):
    driver.get(base_url)
    splash = WebDriverWait(driver, 4).until(
        EC.visibility_of_element_located(SPLASH_SELECTOR)
    )
    driver.execute_script("arguments[0].click();", splash)
    _wait_splash_gone(driver, timeout=5)
    assert _flag(driver) == "1"


def test_auto_dismisses_within_budget(driver, base_url):
    """Splash budget: 2.6s visible + 1.25s staggered exit = ~3.85s.
    Wait 5.5s buffer."""
    driver.get(base_url)
    _wait_splash_visible(driver)
    time.sleep(5.5)
    splashes = driver.find_elements(*SPLASH_SELECTOR)
    visible = [s for s in splashes if s.is_displayed()]
    assert not visible, "Splash did not auto-dismiss within 5.5s"
    assert _flag(driver) == "1"


def test_second_visit_same_tab_skips_splash(driver, base_url):
    driver.get(base_url)
    _wait_splash_visible(driver)
    # Dismiss
    driver.execute_script(
        "document.querySelector(\"div[data-testid='wasro-splash']\").click();"
    )
    _wait_splash_gone(driver)

    # Reload — splash must NOT appear
    driver.get(base_url)
    time.sleep(1.0)
    splashes = driver.find_elements(*SPLASH_SELECTOR)
    visible = [s for s in splashes if s.is_displayed()]
    assert not visible, "Splash reappeared in the same tab session"


def test_deep_link_to_products_never_shows_splash(driver, base_url):
    driver.get(f"{base_url}/products")
    time.sleep(1.0)
    splashes = driver.find_elements(*SPLASH_SELECTOR)
    assert not splashes, "Splash leaked into /products (should be home-only)"


def test_deep_link_to_find_store_never_shows_splash(driver, base_url):
    driver.get(f"{base_url}/find-store")
    time.sleep(1.0)
    splashes = driver.find_elements(*SPLASH_SELECTOR)
    assert not splashes, "Splash leaked into /find-store (should be home-only)"


def test_splash_above_cookie_banner(driver, base_url):
    driver.get(base_url)
    splash = WebDriverWait(driver, 4).until(
        EC.visibility_of_element_located(SPLASH_SELECTOR)
    )
    z_index = driver.execute_script(
        "return getComputedStyle(arguments[0]).zIndex;", splash
    )
    assert int(z_index) >= 100, f"Splash z-index too low: {z_index}"


def test_escape_key_dismisses_splash(driver, base_url):
    driver.get(base_url)
    _wait_splash_visible(driver)
    body = driver.find_element(By.TAG_NAME, "body")
    body.send_keys(Keys.ESCAPE)
    _wait_splash_gone(driver, timeout=5)
    assert _flag(driver) == "1"


# -------------------------------------------------------------------------
# Mobile scroll regression — the v1 splash leaked body.overflow:hidden
# after dismiss, breaking scroll on mobile until the page was reloaded.
# Run on both desktop and mobile viewports.
# -------------------------------------------------------------------------

def test_body_scroll_restored_after_click_dismiss(driver, base_url):
    driver.get(base_url)
    splash = WebDriverWait(driver, 4).until(
        EC.visibility_of_element_located(SPLASH_SELECTOR)
    )
    # While splash is up, body.overflow should be 'hidden'
    assert _body_overflow(driver) == "hidden"
    # Dismiss
    driver.execute_script("arguments[0].click();", splash)
    _wait_splash_gone(driver)
    # After dismiss, body.overflow must be restored (no leak)
    overflow = _body_overflow(driver)
    assert overflow in ("visible", "auto", ""), \
        f"body.overflow leaked: {overflow!r}"


def test_body_scroll_restored_after_auto_dismiss(driver, base_url):
    driver.get(base_url)
    _wait_splash_visible(driver)
    # Auto-dismiss budget bumped to cover staggered exit (3.85s total)
    time.sleep(5.5)
    overflow = _body_overflow(driver)
    assert overflow in ("visible", "auto", ""), \
        f"body.overflow leaked after auto-dismiss: {overflow!r}"


@pytest.mark.mobile
def test_body_scroll_restored_on_mobile_viewport(mobile_driver, base_url):
    """Regression: v1 left body.overflow:hidden after splash dismiss on
    mobile, making the entire site unscrollable. The fix is a separate
    useEffect keyed on `show`."""
    mobile_driver.get(base_url)
    splash = WebDriverWait(mobile_driver, 4).until(
        EC.visibility_of_element_located(SPLASH_SELECTOR)
    )
    mobile_driver.execute_script("arguments[0].click();", splash)
    _wait_splash_gone(mobile_driver)
    overflow = mobile_driver.execute_script(
        "return getComputedStyle(document.body).overflow;"
    )
    assert overflow in ("visible", "auto", ""), \
        f"Mobile body.overflow leaked: {overflow!r}"
    # And actually verify scroll works by scrolling and reading scrollY
    mobile_driver.execute_script("window.scrollTo(0, 600);")
    time.sleep(0.3)
    scroll_y = mobile_driver.execute_script("return window.scrollY;")
    assert scroll_y > 50, f"Mobile page did not scroll after splash: scrollY={scroll_y}"
