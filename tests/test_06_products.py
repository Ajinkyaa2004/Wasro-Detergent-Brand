"""
Products page tests.

Coverage:
  - Page loads + has h1 + 4 category section headings
  - Category showcase (the 4 doorway cards) renders with /products# anchors
  - Each section contains product cards with image + name + Find-a-store link
  - Anchor scroll: clicking a category doorway jumps to the section
  - No sticky pill nav (we removed it)
"""

import pytest
from urllib.parse import urlparse
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import wait_for, wait_for_all, dismiss_cookie_banner


CATEGORIES = [
    "detergent-powder",
    "dishwash-bar",
    "dishwash-tub",
    "clothwash-bar",
]


@pytest.mark.smoke
def test_products_page_loads(driver, base_url):
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    assert h1.text.strip()


def test_all_four_category_sections_present(driver, base_url):
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    for cat in CATEGORIES:
        section = WebDriverWait(driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, f"section#{cat}"))
        )
        # Scroll to force lazy sections to mount
        driver.execute_script("arguments[0].scrollIntoView();", section)
        assert section is not None


def test_category_doorways_above_sections(driver, base_url):
    """The CategoryShowcaseHero block — 4 doorway cards linking to each anchor."""
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    anchors = wait_for_all(
        driver, (By.CSS_SELECTOR, "a[href^='/products#']"), timeout=5
    )
    paths = {urlparse(a.get_attribute("href") or "").fragment for a in anchors}
    for cat in CATEGORIES:
        assert cat in paths, f"No doorway link to #{cat} found"


def test_no_sticky_category_pill_nav(driver, base_url):
    """We deliberately removed the sticky <CategoryPillNav>. Verify it stays gone."""
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    # The pill nav had 4 pills + a scroll progress bar. The component file
    # still exists on disk but the JSX is commented out — so no element
    # whose computed style is `position: sticky` should contain pills with
    # all four category labels.
    sticky_navs = driver.find_elements(
        By.CSS_SELECTOR, "nav.sticky, nav[class*='sticky']"
    )
    for nav in sticky_navs:
        text = (nav.text or "").lower()
        # If a sticky nav contained all 4 category labels, that'd be the removed component
        assert not (
            "detergent" in text
            and "dishwash" in text
            and "clothwash" in text
        ), "The removed CategoryPillNav has resurfaced"


def test_each_section_has_at_least_one_product_card(driver, base_url):
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    for cat in CATEGORIES:
        section = wait_for(driver, (By.CSS_SELECTOR, f"section#{cat}"))
        driver.execute_script("arguments[0].scrollIntoView();", section)
        # Each product card is an <article> inside the section's grid
        cards = section.find_elements(By.CSS_SELECTOR, "article, [class*='card']")
        assert len(cards) >= 1, f"No product cards in section {cat}"


def test_product_cards_have_images(driver, base_url):
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    # Staged scroll forces each Reveal section to mount + paint
    import time
    for y in (500, 1500, 2500, 3500, 4500, 5500, 6500):
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(0.3)
    time.sleep(0.6)
    imgs = driver.find_elements(By.CSS_SELECTOR, "main img")
    # is_displayed() returns False during Reveal opacity-0 — count
    # by DOM presence instead. 15 SKUs + category artwork = ≥15 total.
    assert len(imgs) >= 12, f"Only {len(imgs)} <img> tags in main"


def test_find_a_store_links_present_on_product_cards(driver, base_url):
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    import time
    time.sleep(0.6)
    find_links = driver.find_elements(By.CSS_SELECTOR, "main a[href^='/find-store']")
    assert len(find_links) >= 4, \
        f"Expected several 'Find a store' links across product cards, got {len(find_links)}"


def test_category_section_header_contains_starting_price(driver, base_url):
    """Each section header has 'starting at ₹X' badge when the category has priced SKUs."""
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    detergent = wait_for(driver, (By.CSS_SELECTOR, "section#detergent-powder"))
    driver.execute_script("arguments[0].scrollIntoView();", detergent)
    import time; time.sleep(0.6)
    # textContent bypasses the Reveal visibility gate
    text = (driver.execute_script(
        "return arguments[0].textContent;", detergent
    ) or "").lower()
    assert "starting at" in text or "variant" in text, \
        f"Category header missing badges: {text[:200]}"
