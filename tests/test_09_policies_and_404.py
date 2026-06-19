"""
Legal/policy pages + branded 404.
"""

import pytest
from selenium.webdriver.common.by import By

from conftest import wait_for, dismiss_cookie_banner


POLICY_PAGES = [
    ("/privacy", ["Privacy Policy", "Privacy"]),
    ("/terms", ["Terms", "Conditions"]),
    ("/shipping", ["Shipping", "Delivery"]),
    ("/returns", ["Returns", "Refund"]),
]


@pytest.mark.smoke
@pytest.mark.parametrize("path,expected_terms", POLICY_PAGES)
def test_policy_page_renders(driver, base_url, path, expected_terms):
    driver.get(f"{base_url}{path}")
    dismiss_cookie_banner(driver)
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    h1_text = h1.text
    assert any(term in h1_text for term in expected_terms), \
        f"{path}: h1={h1_text!r} doesn't contain any of {expected_terms}"


@pytest.mark.parametrize("path,_", POLICY_PAGES)
def test_policy_page_has_substantial_content(driver, base_url, path, _):
    driver.get(f"{base_url}{path}")
    dismiss_cookie_banner(driver)
    body = driver.find_element(By.TAG_NAME, "main").text
    # Looser sanity floor: real policy text is ≥ 500 chars
    assert len(body) >= 500, f"{path} content is too short ({len(body)} chars)"


@pytest.mark.parametrize("path,_", POLICY_PAGES)
def test_policy_pages_have_last_updated(driver, base_url, path, _):
    driver.get(f"{base_url}{path}")
    dismiss_cookie_banner(driver)
    text = driver.find_element(By.TAG_NAME, "main").text.lower()
    assert "last updated" in text, f"{path} missing 'Last updated' timestamp"


# -------------------------------------------------------------------------
# 404
# -------------------------------------------------------------------------

@pytest.mark.smoke
def test_404_page_renders_branded(driver, base_url):
    driver.get(f"{base_url}/this-page-definitely-does-not-exist-12345")
    dismiss_cookie_banner(driver)
    # Branded heading from app/not-found.tsx
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    assert "washed away" in h1.text.lower() or "404" in driver.page_source or "not found" in h1.text.lower()


def test_404_has_four_exit_ramps(driver, base_url):
    """Home, Products, Find a Store, WhatsApp — all four CTAs present."""
    driver.get(f"{base_url}/oops-not-here")
    dismiss_cookie_banner(driver)
    # Wait for the page
    wait_for(driver, (By.TAG_NAME, "h1"))
    text = driver.find_element(By.TAG_NAME, "main").text.lower()
    assert "home" in text
    assert "products" in text or "browse" in text
    assert "find a store" in text or "store" in text
    # WhatsApp CTA
    wa = driver.find_elements(By.CSS_SELECTOR, "a[href*='wa.me']")
    assert wa, "404 should have a WhatsApp CTA"


def test_404_does_not_index(driver, base_url):
    """robots meta should noindex this page."""
    driver.get(f"{base_url}/yet-another-404")
    metas = driver.find_elements(By.CSS_SELECTOR, "meta[name='robots']")
    robots_content = (metas[0].get_attribute("content") if metas else "").lower()
    assert "noindex" in robots_content, f"404 should noindex; got {robots_content!r}"
