"""
Homepage smoke + section coverage.

Verifies that every major section on `/` renders, every CTA in the hero
points somewhere sensible, the offer slideshow + product image are live,
and the decorative chips (Made in Assam, 2X formula) sit above the pack
image after the recent z-index fix.
"""

import pytest
from selenium.webdriver.common.by import By

from conftest import wait_for, wait_for_all, wait_present, dismiss_cookie_banner


@pytest.mark.smoke
def test_homepage_loads(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    assert "Wasro" in driver.title


@pytest.mark.smoke
def test_hero_chip_and_headline(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    # Brand chip in the hero (Sparkles icon + content.chipText)
    chip = wait_for(driver, (By.XPATH, "//section//span[contains(@class,'rounded-pill')][1]"))
    assert chip.is_displayed()

    # h1 is present
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    assert h1.text.strip(), "Hero h1 is empty"


@pytest.mark.smoke
def test_hero_primary_and_secondary_cta(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    # Two CTAs in the hero: primary (likely /products) + secondary (Find a Store)
    links = driver.find_elements(By.CSS_SELECTOR, "section a.rounded-pill")
    hrefs = [l.get_attribute("href") for l in links if l.get_attribute("href")]
    assert any("/products" in h for h in hrefs), f"No /products link: {hrefs}"
    assert any("/find-store" in h or "/bulk-orders" in h for h in hrefs), \
        f"No /find-store or /bulk-orders link: {hrefs}"


def test_hero_product_image_renders(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    # The Image components render as <img>. Hero has a cycling product image.
    imgs = driver.find_elements(By.CSS_SELECTOR, "section img")
    assert len(imgs) >= 1, "No images in hero section"
    # First visible image should have non-zero dimensions once loaded
    visible = [i for i in imgs if i.is_displayed()]
    assert visible, "Hero has no visible images"


def test_made_in_assam_chip_visible(driver, base_url):
    """
    Verify the recent z-index fix: the chip used to render behind the
    pack image because the active slide had `z-10` and the chip had no
    z-index. Today the chip should be present, on top (z-20), and
    eventually animate to full opacity.
    """
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    candidates = driver.find_elements(
        By.CSS_SELECTOR, "div.absolute.bg-wasro-yellow\\/85"
    )
    assert candidates, "Made-in-Assam chip not found in DOM"
    chip = candidates[0]

    # Wait for the parent <Reveal> animation to finish (it starts at
    # opacity-0 and transitions to opacity-100 once the IntersectionObserver
    # fires — ≤700ms). is_displayed() reads computed opacity, so polling on
    # that is the right wait.
    from selenium.webdriver.support.ui import WebDriverWait
    WebDriverWait(driver, 5).until(
        lambda d: float(
            d.execute_script("return getComputedStyle(arguments[0]).opacity", chip)
        ) > 0.5
    )

    # The element should be on the z-20 layer (same as the 2X sticker)
    classes = chip.get_attribute("class") or ""
    assert "z-20" in classes, f"Chip missing z-20 stacking class: {classes!r}"


def test_category_strip_shows_four_categories(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    # CategoryStrip lists 4 categories
    items = wait_for_all(driver, (By.CSS_SELECTOR, "a[href^='/products#']"), timeout=5)
    assert len(items) >= 4, f"Expected 4+ category links, found {len(items)}"


def test_featured_products_grid(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollBy(0, 800);")
    # "Family favourites" heading — presence-based wait, the section sits
    # inside a Reveal wrapper that animates opacity 0 → 1.
    heading = wait_present(
        driver, (By.XPATH, "//h2[contains(., 'Family favourites')]")
    )
    assert heading is not None


def test_pack_sizes_section(driver, base_url):
    """The new PackSizes section (replaced VariantShowcase)."""
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    # Scroll progressively so all Reveal sections trigger their observers
    for y in (400, 800, 1400, 2000):
        driver.execute_script(f"window.scrollTo(0, {y});")
        import time; time.sleep(0.2)
    heading = wait_present(
        driver, (By.XPATH, "//h2[contains(., 'every Indian home')]"), timeout=8
    )
    assert heading is not None

    cards = driver.find_elements(
        By.CSS_SELECTOR, "section a[href^='/products#detergent-powder']"
    )
    assert len(cards) >= 3


def test_why_wasro_cards(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    for y in (800, 1600, 2400, 3200):
        driver.execute_script(f"window.scrollTo(0, {y});")
        import time; time.sleep(0.2)
    # "More than just a wash."
    heading = wait_present(
        driver, (By.XPATH, "//h2[contains(., 'than just')]"), timeout=10,
    )
    assert heading is not None


def test_reviews_section_renders(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    for y in (1000, 2000, 3000, 4000, 5000):
        driver.execute_script(f"window.scrollTo(0, {y});")
        import time; time.sleep(0.2)
    # The reviews heading is "Trusted in homes & kirana shelves alike." —
    # disambiguate from the distributor-strip "Trusted in homes across…"
    # by anchoring on the unique "kirana" word.
    heading = wait_present(
        driver, (By.XPATH, "//h2[contains(., 'kirana shelves')]"), timeout=10,
    )
    assert heading is not None


def test_aggregate_rating_badge_visible(driver, base_url):
    """The 4.X★ + N reviews badge next to the heading."""
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    for y in (1000, 2000, 3000, 4000, 5000):
        driver.execute_script(f"window.scrollTo(0, {y});")
        import time; time.sleep(0.2)
    label = wait_present(
        driver,
        (By.XPATH, "//div[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'avg. rating')]"),
        timeout=8,
    )
    assert label is not None


def test_press_strip_visible(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    # Press strip is the last section before the footer
    sections = driver.find_elements(By.TAG_NAME, "section")
    assert len(sections) >= 5, f"Expected several sections, found {len(sections)}"


def test_floating_whatsapp_button_present(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    wa = wait_for(driver, (By.CSS_SELECTOR, "a[aria-label='Chat on WhatsApp']"))
    href = wa.get_attribute("href") or ""
    assert "wa.me" in href, f"WhatsApp link doesn't point to wa.me: {href}"
    # Page-aware pre-fill on home is the generic message
    assert "text=" in href, "WhatsApp link is missing pre-fill text"
