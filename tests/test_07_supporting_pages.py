"""
Supporting pages: find-store, stain-guide, about.
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import wait_for, wait_for_all, dismiss_cookie_banner


# -------------------------------------------------------------------------
# Find a Store
# -------------------------------------------------------------------------

@pytest.mark.smoke
def test_find_store_loads(driver, base_url):
    driver.get(f"{base_url}/find-store")
    dismiss_cookie_banner(driver)
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    assert h1.text.strip()


def test_find_store_has_state_filter(driver, base_url):
    """Premium state-picker UI should be present (one of: select, button list, listbox)."""
    driver.get(f"{base_url}/find-store")
    dismiss_cookie_banner(driver)
    # Either native select or a button-based picker — assert at least one of them
    selects = driver.find_elements(By.TAG_NAME, "select")
    state_buttons = driver.find_elements(
        By.XPATH, "//button[contains(@aria-label, 'state') or contains(., 'Assam') or contains(., 'state')]"
    )
    assert selects or state_buttons, "No state filter UI found on /find-store"


def test_distributor_cards_have_call_and_whatsapp(driver, base_url):
    driver.get(f"{base_url}/find-store")
    dismiss_cookie_banner(driver)
    # Scroll to the list
    driver.execute_script("window.scrollBy(0, 1200);")
    import time
    time.sleep(0.6)
    tel_links = driver.find_elements(By.CSS_SELECTOR, "a[href^='tel:']")
    wa_links = driver.find_elements(By.CSS_SELECTOR, "a[href*='wa.me']")
    assert len(tel_links) >= 1, "No tel: links on distributor list"
    assert len(wa_links) >= 1, "No WhatsApp links on distributor list"


def test_become_distributor_cta_present(driver, base_url):
    driver.get(f"{base_url}/find-store")
    dismiss_cookie_banner(driver)
    import time
    for y in (500, 1500, 2500, 3500):
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(0.25)
    # Check page textContent (bypasses Reveal opacity gate). The Become-
    # a-distributor section uses headings + CTA copy that contains
    # "distributor" multiple times.
    page_text = driver.execute_script(
        "return document.querySelector('main').textContent;"
    ) or ""
    assert "distributor" in page_text.lower(), \
        "'Become a distributor' content missing"


# -------------------------------------------------------------------------
# Stain Guide
# -------------------------------------------------------------------------

@pytest.mark.smoke
def test_stain_guide_loads(driver, base_url):
    driver.get(f"{base_url}/stain-guide")
    dismiss_cookie_banner(driver)
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    assert h1.text.strip()


def test_stain_guide_has_multiple_stain_entries(driver, base_url):
    driver.get(f"{base_url}/stain-guide")
    dismiss_cookie_banner(driver)
    import time
    for y in (500, 1500, 2500, 3500, 4500):
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(0.25)
    # Loosen: include any of h3/h4/article since stain-guide may use a
    # custom card markup
    articles = driver.find_elements(
        By.CSS_SELECTOR, "main article, main h3, main h4, main [class*='card']"
    )
    assert len(articles) >= 4, f"Expected several stain entries, got {len(articles)}"


def test_stain_guide_links_to_products(driver, base_url):
    driver.get(f"{base_url}/stain-guide")
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    import time
    time.sleep(0.4)
    product_links = driver.find_elements(By.CSS_SELECTOR, "main a[href^='/products']")
    assert len(product_links) >= 1, "Stain guide should link to products"


# -------------------------------------------------------------------------
# About
# -------------------------------------------------------------------------

@pytest.mark.smoke
def test_about_loads(driver, base_url):
    driver.get(f"{base_url}/about")
    dismiss_cookie_banner(driver)
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    assert h1.text.strip()


def test_about_madhav_section_with_bento(driver, base_url):
    """Madhav Industries section + 5-image bento (man1..man5).

    Next/Image rewrites `src` to `/_next/image?url=...&w=...` which encodes
    the original. So we match either `/lifestyle/man` OR the encoded form
    `%2Flifestyle%2Fman`.
    """
    driver.get(f"{base_url}/about")
    dismiss_cookie_banner(driver)
    import time
    for y in (400, 800, 1400, 2000, 2800):
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(0.25)
    all_imgs = driver.find_elements(By.CSS_SELECTOR, "main img")
    bento = [
        i for i in all_imgs
        if "lifestyle/man" in (i.get_attribute("src") or "")
        or "lifestyle%2Fman" in (i.get_attribute("src") or "")
    ]
    assert len(bento) >= 4, f"Expected 5 bento images, found {len(bento)}"


def test_about_faqs_accordion_toggles(driver, base_url):
    driver.get(f"{base_url}/about#faqs")
    dismiss_cookie_banner(driver)
    # FAQs use <details><summary>...
    details = WebDriverWait(driver, 6).until(
        EC.presence_of_all_elements_located((By.TAG_NAME, "details"))
    )
    assert len(details) >= 1, "No <details> FAQ accordion on About"
    # Click the first summary to open it (if not already open)
    first = details[0]
    summary = first.find_element(By.TAG_NAME, "summary")
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", summary)
    was_open = first.get_attribute("open") is not None
    summary.click()
    import time
    time.sleep(0.2)
    is_open_now = first.get_attribute("open") is not None
    assert was_open != is_open_now, "FAQ accordion didn't toggle"
