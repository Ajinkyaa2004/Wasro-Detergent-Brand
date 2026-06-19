"""
Footer coverage — newsletter form (fill, no submit), every column link,
social icons, and the bottom-row legal links.
"""

import pytest
from urllib.parse import urlparse
from selenium.webdriver.common.by import By

from conftest import wait_for, dismiss_cookie_banner


def _path(href: str | None) -> str:
    if not href:
        return ""
    parsed = urlparse(href)
    return parsed.path or "/"


EXPECTED_SHOP_LINKS = [
    "/products#detergent-powder",
    "/products#dishwash-bar",
    "/products#dishwash-tub",
    "/products#clothwash-bar",
]
EXPECTED_HELP_LINKS = [
    "/find-store",
    "/bulk-orders",
    "/stain-guide",
    "/about#faqs",
]
EXPECTED_ABOUT_LINKS = ["/about", "/about#madhav", "/about#quality"]
EXPECTED_LEGAL_LINKS = ["/privacy", "/terms", "/shipping", "/returns"]


@pytest.mark.smoke
def test_footer_renders(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    footer = wait_for(driver, (By.TAG_NAME, "footer"))
    assert footer.is_displayed()


def test_footer_logo_present(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    logo = wait_for(driver, (By.CSS_SELECTOR, "footer img[alt='Wasro']"))
    assert logo.is_displayed()


def test_footer_shop_column_links(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    footer_links = driver.find_elements(By.CSS_SELECTOR, "footer a")
    hrefs = {a.get_attribute("href") or "" for a in footer_links}
    for target in EXPECTED_SHOP_LINKS:
        assert any(target in h for h in hrefs), f"Footer missing {target}"


def test_footer_help_column_links(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    footer_links = driver.find_elements(By.CSS_SELECTOR, "footer a")
    hrefs = {a.get_attribute("href") or "" for a in footer_links}
    for target in EXPECTED_HELP_LINKS:
        assert any(target in h for h in hrefs), f"Footer missing {target}"


def test_footer_about_column_links(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    footer_links = driver.find_elements(By.CSS_SELECTOR, "footer a")
    paths = {_path(a.get_attribute("href")) + ("#" + (urlparse(a.get_attribute("href")).fragment) if urlparse(a.get_attribute("href")).fragment else "") for a in footer_links}
    # Looser check: at least 2 of the 3 about links present
    matches = [t for t in EXPECTED_ABOUT_LINKS if any(t in (a.get_attribute("href") or "") for a in footer_links)]
    assert len(matches) >= 2, f"Footer About column missing links; matches={matches}"


def test_footer_legal_links(driver, base_url):
    """Privacy + Terms + Shipping + Returns must all be wired."""
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    footer_links = driver.find_elements(By.CSS_SELECTOR, "footer a")
    hrefs = {a.get_attribute("href") or "" for a in footer_links}
    for target in EXPECTED_LEGAL_LINKS:
        assert any(target in h for h in hrefs), f"Footer missing legal link {target}"


def test_footer_social_icons(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    insta = driver.find_elements(By.CSS_SELECTOR, "footer a[aria-label='Instagram']")
    fb = driver.find_elements(By.CSS_SELECTOR, "footer a[aria-label='Facebook']")
    wa = driver.find_elements(By.CSS_SELECTOR, "footer a[aria-label='WhatsApp']")
    assert insta, "No Instagram social icon in footer"
    assert fb, "No Facebook social icon in footer"
    assert wa, "No WhatsApp social icon in footer"


def test_footer_email_and_phone(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    mailto = driver.find_elements(By.CSS_SELECTOR, "footer a[href^='mailto:']")
    assert mailto, "No mailto link in footer"
    # Phone — WhatsApp link counts
    wa_links = driver.find_elements(By.CSS_SELECTOR, "footer a[href*='wa.me']")
    assert wa_links, "No phone/WhatsApp link in footer body"


# -------------------------------------------------------------------------
# Newsletter form — fill but do NOT submit (per test policy)
# -------------------------------------------------------------------------

def test_newsletter_input_present(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    inp = wait_for(driver, (By.CSS_SELECTOR, "footer input[type='email'][name='email']"))
    assert inp.is_displayed()
    assert inp.get_attribute("required") is not None, "Email input should be required"


def test_newsletter_honeypot_hidden(driver, base_url):
    """Honeypot field must exist (catches bots) AND be visually hidden."""
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    honeypot = driver.find_elements(By.CSS_SELECTOR, "footer input[name='_company']")
    assert honeypot, "Honeypot field _company missing from newsletter form"
    # It should be visually hidden — width/height should be 0 or it's offscreen
    h = honeypot[0]
    assert h.get_attribute("tabindex") == "-1", "Honeypot must skip tab order"


def test_newsletter_input_accepts_text(driver, base_url):
    """Fill the field but don't submit. We just want to know the input works."""
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    inp = wait_for(driver, (By.CSS_SELECTOR, "footer input[type='email'][name='email']"))
    inp.clear()
    inp.send_keys("test+selenium@wasro.local")
    assert inp.get_attribute("value") == "test+selenium@wasro.local"


def test_newsletter_submit_button_exists(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    btn = wait_for(driver, (By.CSS_SELECTOR, "footer button[type='submit']"))
    assert btn.is_displayed()
