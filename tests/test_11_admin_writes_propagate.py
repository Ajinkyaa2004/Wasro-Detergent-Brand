"""
End-to-end write-through verification.

For each admin section, we:
  1. Snapshot the current state of the relevant public page
  2. Log into /admin, navigate to the editor, change ONE field to a
     marker string + Save
  3. Hard-reload the public page and assert the marker appears
  4. Go back to the editor, restore the original value + Save

If the marker doesn't appear, either:
  - `revalidatePath` is missing on the action
  - the public page isn't `force-dynamic`
  - Upstash isn't wired (writes go to in-memory and the public side
    reads the persisted-on-disk default)

Skip-don't-break philosophy: these are the only tests that DO write
to Upstash. They're marked `@pytest.mark.write` so they can be skipped
in normal CI runs (`pytest -m "not write"`) — pass `-m write` or pass
nothing to include them in a full pre-launch sweep.
"""

import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import wait_for, dismiss_cookie_banner


pytestmark = pytest.mark.write


MARKER = "WASRO-QA-MARKER-X92Z"


def _wait_for_save_success(driver, timeout: int = 12):
    """Editor success banner contains a green check + a confirmation line.
    All editors render `state.ok === true` with copy that includes
    'Saved' or 'now shows'.
    """
    WebDriverWait(driver, timeout).until(
        lambda d: any(
            "saved" in (e.text or "").lower() or "now shows" in (e.text or "").lower()
            for e in d.find_elements(By.CSS_SELECTOR, "form svg + span, form span")
        )
    )


def _save(driver):
    """Find and JS-click the form's Save button. Bypass coords-based
    interactability since the floating WhatsApp button can intercept."""
    btn = driver.find_element(
        By.XPATH, "//form//button[@type='submit'][contains(., 'Save')]"
    )
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn)
    driver.execute_script("arguments[0].click();", btn)


def _reload_public(driver, base_url, path):
    """Hard-reload the public page so cache headers can't paper over the
    revalidation. We pass a random query suffix to be extra-sure."""
    driver.get(f"{base_url}{path}?qa={int(time.time())}")
    dismiss_cookie_banner(driver)


def _page_text(driver):
    return (driver.execute_script("return document.body.textContent;") or "")


# -------------------------------------------------------------------------
# Hero content — change the brand-chip text and verify it shows on home
# -------------------------------------------------------------------------

def test_hero_content_chip_propagates(logged_in_driver, base_url):
    driver = logged_in_driver

    # 1. Snapshot current chip text
    driver.get(f"{base_url}/admin/hero-content")
    chip_input = wait_for(
        driver, (By.CSS_SELECTOR, "input[name='chipText']"), timeout=10,
    )
    original = chip_input.get_attribute("value") or ""

    # 2. Change to marker + save
    chip_input.clear()
    chip_input.send_keys(MARKER)
    _save(driver)
    _wait_for_save_success(driver)

    # 3. Verify on home
    _reload_public(driver, base_url, "/")
    # Give force-dynamic + revalidatePath a tick
    time.sleep(0.8)
    text = _page_text(driver)
    try:
        assert MARKER in text, "Hero chip change did NOT propagate to home page"
    finally:
        # 4. Always restore
        driver.get(f"{base_url}/admin/hero-content")
        restore = wait_for(driver, (By.CSS_SELECTOR, "input[name='chipText']"))
        restore.clear()
        restore.send_keys(original)
        _save(driver)
        try:
            _wait_for_save_success(driver, timeout=8)
        except Exception:
            pass


# -------------------------------------------------------------------------
# Headlines — rotating hero words
# -------------------------------------------------------------------------

def test_headlines_propagate(logged_in_driver, base_url):
    driver = logged_in_driver
    driver.get(f"{base_url}/admin/headlines")
    # The headline editor uses a textarea OR multiple inputs depending on
    # implementation — find the first text input under the form
    fields = wait_for(
        driver,
        (By.CSS_SELECTOR, "form input[type='text'], form textarea"),
        timeout=10,
    )
    original = fields.get_attribute("value") or ""

    fields.clear()
    fields.send_keys(MARKER)
    _save(driver)
    _wait_for_save_success(driver)

    _reload_public(driver, base_url, "/")
    time.sleep(0.8)
    text = _page_text(driver)
    try:
        # CyclingHeadline rotates words — at first paint only one is shown.
        # The full word list is in DOM as React state though, so search
        # the full server-rendered HTML.
        page_source = driver.page_source
        assert MARKER in page_source, "Headline change did NOT propagate"
    finally:
        # Restore
        driver.get(f"{base_url}/admin/headlines")
        f = wait_for(driver, (By.CSS_SELECTOR, "form input[type='text'], form textarea"))
        f.clear()
        f.send_keys(original)
        _save(driver)
        try:
            _wait_for_save_success(driver, timeout=8)
        except Exception:
            pass


# -------------------------------------------------------------------------
# FAQs — show on /about
# -------------------------------------------------------------------------

def test_faqs_propagate(logged_in_driver, base_url):
    driver = logged_in_driver
    driver.get(f"{base_url}/admin/faqs")
    # First question field
    first_q = wait_for(
        driver,
        (By.XPATH, "(//form//input[@type='text'])[1]"),
        timeout=10,
    )
    original = first_q.get_attribute("value") or ""
    first_q.clear()
    first_q.send_keys(f"{MARKER} sample question?")
    _save(driver)
    _wait_for_save_success(driver)

    _reload_public(driver, base_url, "/about")
    time.sleep(0.8)
    try:
        page_source = driver.page_source
        assert MARKER in page_source, "FAQ change did NOT propagate to /about"
    finally:
        driver.get(f"{base_url}/admin/faqs")
        first_q = wait_for(driver, (By.XPATH, "(//form//input[@type='text'])[1]"))
        first_q.clear()
        first_q.send_keys(original)
        _save(driver)
        try:
            _wait_for_save_success(driver, timeout=8)
        except Exception:
            pass


# -------------------------------------------------------------------------
# Reviews — first review's name appears on home
# -------------------------------------------------------------------------

def test_reviews_propagate(logged_in_driver, base_url):
    driver = logged_in_driver
    driver.get(f"{base_url}/admin/reviews")
    name_input = wait_for(
        driver,
        (By.XPATH, "(//form//input[@type='text'])[1]"),
        timeout=10,
    )
    original = name_input.get_attribute("value") or ""
    name_input.clear()
    name_input.send_keys(MARKER)
    _save(driver)
    _wait_for_save_success(driver)

    _reload_public(driver, base_url, "/")
    time.sleep(0.8)
    try:
        page_source = driver.page_source
        assert MARKER in page_source, "Review name change did NOT propagate to home"
    finally:
        driver.get(f"{base_url}/admin/reviews")
        n = wait_for(driver, (By.XPATH, "(//form//input[@type='text'])[1]"))
        n.clear()
        n.send_keys(original)
        _save(driver)
        try:
            _wait_for_save_success(driver, timeout=8)
        except Exception:
            pass


# -------------------------------------------------------------------------
# Storage backend health — fail loudly if we're on in-memory in prod
# -------------------------------------------------------------------------

def test_admin_dashboard_reports_persistent_storage(logged_in_driver, base_url):
    """The dashboard surfaces an amber 'In-memory storage only' banner
    when Upstash env vars are missing. We assert the green
    'Persistent storage connected' panel is showing instead.

    If this fails on prod, EVERY admin edit will silently disappear on
    the next cold start. Highest-stakes test in the suite."""
    driver = logged_in_driver
    driver.get(f"{base_url}/admin")
    text = _page_text(driver).lower()
    assert "persistent storage connected" in text, (
        "/admin dashboard says storage is NOT persistent. "
        "Admin writes WILL be lost on cold start. "
        "Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN."
    )
    assert "in-memory storage only" not in text, (
        "Dashboard surfacing the 'in-memory' warning banner."
    )
