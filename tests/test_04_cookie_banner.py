"""
Cookie banner contract (DPDP Act):

  - First visit  -> banner shows
  - Accept       -> banner disappears, localStorage = 'accepted'
  - Reject       -> banner disappears, localStorage = 'rejected'
  - Dismiss (X)  -> banner disappears, localStorage stays empty
                    (banner returns on next page load)
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import wait_for, sweep_splash


STORAGE_KEY = "wasro_cookie_consent"


def _consent(driver):
    return driver.execute_script(
        f"return window.localStorage.getItem('{STORAGE_KEY}');"
    )


def _wait_banner(driver, timeout=10):
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located(
            (By.CSS_SELECTOR, "div[role='dialog'][aria-label='Cookie consent']")
        )
    )


def _banner_gone(driver, timeout=5):
    return WebDriverWait(driver, timeout).until_not(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, "div[role='dialog'][aria-label='Cookie consent']")
        )
    )


@pytest.mark.smoke
def test_banner_shows_on_first_visit(driver, base_url):
    driver.get(base_url)
    # Don't pre-set consent — we want to see the banner appear.
    # Sweep ONLY the splash overlay so it doesn't intercept clicks on
    # the cookie banner buttons.
    sweep_splash(driver)
    banner = _wait_banner(driver)
    assert banner.is_displayed()
    assert _consent(driver) is None, "Storage should be empty before user choice"


def test_accept_persists_consent(driver, base_url):
    driver.get(base_url)
    sweep_splash(driver)
    _wait_banner(driver)
    accept = driver.find_element(
        By.XPATH, "//div[@role='dialog']//button[normalize-space()='Accept']"
    )
    accept.click()
    _banner_gone(driver)
    assert _consent(driver) == "accepted"


def test_reject_persists_consent(driver, base_url):
    driver.get(base_url)
    sweep_splash(driver)
    _wait_banner(driver)
    reject = driver.find_element(
        By.XPATH,
        "//div[@role='dialog']//button[contains(normalize-space(), 'Reject')]",
    )
    reject.click()
    _banner_gone(driver)
    assert _consent(driver) == "rejected"


def test_dismiss_does_not_persist(driver, base_url):
    driver.get(base_url)
    sweep_splash(driver)
    _wait_banner(driver)
    # Dismiss is the X button, aria-label 'Dismiss cookie banner for now'
    x_btn = driver.find_element(
        By.CSS_SELECTOR,
        "div[role='dialog'] button[aria-label='Dismiss cookie banner for now']",
    )
    x_btn.click()
    _banner_gone(driver)
    assert _consent(driver) is None, "Dismiss must NOT set the consent key"


def test_banner_stays_hidden_after_accept_across_pages(driver, base_url):
    driver.get(base_url)
    sweep_splash(driver)
    _wait_banner(driver)
    driver.find_element(
        By.XPATH, "//div[@role='dialog']//button[normalize-space()='Accept']"
    ).click()
    _banner_gone(driver)

    # Navigate elsewhere — banner must NOT reappear
    driver.get(f"{base_url}/products")
    # Give the client component a tick to mount
    import time
    time.sleep(0.5)
    banners = driver.find_elements(
        By.CSS_SELECTOR, "div[role='dialog'][aria-label='Cookie consent']"
    )
    visible = [b for b in banners if b.is_displayed()]
    assert not visible, "Banner re-appeared after consent was accepted"


def test_banner_links_to_privacy(driver, base_url):
    driver.get(base_url)
    sweep_splash(driver)
    _wait_banner(driver)
    privacy_links = driver.find_elements(
        By.CSS_SELECTOR, "div[role='dialog'] a[href='/privacy']"
    )
    assert privacy_links, "Banner should link to Privacy Policy"
