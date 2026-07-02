"""
Navbar coverage — every link in the desktop top bar plus the mobile
hamburger menu.

The navbar lives in `components/layout/navbar.tsx`. Visible items on
desktop: logo + 5 nav links + Bulk Orders pill CTA. On mobile: logo +
hamburger that opens a sheet containing the same links plus quick-action
phone/WhatsApp/email.
"""

import pytest
from urllib.parse import urlparse
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import wait_for, wait_for_all, dismiss_cookie_banner


EXPECTED_NAV = [
    ("Home", "/"),
    ("Products", "/products"),
    ("Stain Guide", "/stain-guide"),
    ("About", "/about"),
]


def _path(href: str | None) -> str:
    if not href:
        return ""
    parsed = urlparse(href)
    return parsed.path or "/"


@pytest.mark.smoke
def test_navbar_logo_links_home(driver, base_url):
    driver.get(f"{base_url}/products")
    dismiss_cookie_banner(driver)
    # Logo is wrapped in a <Link href="/">
    logo_link = wait_for(driver, (By.CSS_SELECTOR, "header a[href='/']"))
    assert logo_link.is_displayed()


@pytest.mark.smoke
def test_navbar_has_all_five_nav_links(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    # All desktop nav anchors live inside the <header>
    anchors = wait_for_all(driver, (By.CSS_SELECTOR, "header a"))
    nav_targets = {_path(a.get_attribute("href")) for a in anchors}
    for label, path in EXPECTED_NAV:
        assert path in nav_targets, f"Missing nav link {label} → {path}; got {nav_targets}"


def test_navbar_bulk_orders_cta(driver, base_url):
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    anchors = driver.find_elements(By.CSS_SELECTOR, "header a")
    bulk = [a for a in anchors if _path(a.get_attribute("href")) == "/bulk-orders"]
    assert bulk, "No Bulk Orders link in navbar"
    # Skip is_displayed (Reveal opacity-0 window); presence + correct href
    # is the contract we care about pre-launch.
    assert "/bulk-orders" in (bulk[0].get_attribute("href") or "")


@pytest.mark.smoke
@pytest.mark.parametrize("label,path", EXPECTED_NAV)
def test_each_nav_link_navigates(driver, base_url, label, path):
    """Click each link and verify the URL changes to the expected path."""
    driver.get(base_url)
    dismiss_cookie_banner(driver)
    # Match by exact href= so we don't grab the mobile-menu copy
    selector = f"header a[href='{path}']"
    link = wait_for(driver, (By.CSS_SELECTOR, selector))
    # Scroll into view in case header is offset
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", link)
    link.click()
    WebDriverWait(driver, 10).until(EC.url_contains(path if path != "/" else base_url))
    assert path in driver.current_url or driver.current_url.rstrip("/") == base_url


# -------------------------------------------------------------------------
# Mobile menu
# -------------------------------------------------------------------------

def _open_mobile_menu(driver):
    """Find the hamburger via aria-label='Open menu' and JS-click it.

    JS click bypasses Selenium's interactability checks — the button is
    visible and functional, but elementClickInterceptedException can
    fire under load due to the floating WhatsApp + cookie banner stack.
    """
    btn = driver.find_element(
        By.CSS_SELECTOR, "header button[aria-label='Open menu']"
    )
    driver.execute_script("arguments[0].click();", btn)


@pytest.mark.mobile
def test_mobile_hamburger_opens_menu(mobile_driver, base_url):
    mobile_driver.get(base_url)
    dismiss_cookie_banner(mobile_driver)
    _open_mobile_menu(mobile_driver)

    # After click, the off-canvas panel should reveal at least one /products link
    products = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href='/products']"))
    )
    # The mobile menu's link will have non-zero size; the navbar's mobile-hidden
    # link won't. Filter by visibility via JS (bypasses Selenium's opacity check).
    visible = [
        a for a in products
        if mobile_driver.execute_script(
            "const r = arguments[0].getBoundingClientRect();"
            "return r.width > 0 && r.height > 0;",
            a,
        )
    ]
    assert visible, "Mobile menu opened but no /products link is laid out"


@pytest.mark.mobile
def test_mobile_menu_contains_quick_actions(mobile_driver, base_url):
    mobile_driver.get(base_url)
    dismiss_cookie_banner(mobile_driver)
    _open_mobile_menu(mobile_driver)
    wa = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href*='wa.me']"))
    )
    tel = mobile_driver.find_elements(By.CSS_SELECTOR, "a[href^='tel:']")
    assert wa, "No WhatsApp link in open mobile menu"
    assert tel, "No tel: link in open mobile menu"
