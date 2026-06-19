"""
Admin panel:
  - /admin redirects to login when unauthenticated
  - Wrong password is rejected
  - Right password lands on the dashboard
  - All 9 editor sections are reachable from the sidebar AND the
    dashboard cards
  - Sign-out kicks us back to login

We deliberately do NOT click any Save buttons in the editors — that
would write to Upstash and mutate production data. Tests stop at "page
rendered + form is fillable".
"""

import pytest
from urllib.parse import urlparse
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import wait_for, wait_for_all, dismiss_cookie_banner


EDITOR_PAGES = [
    "/admin/offer",
    "/admin/hero-content",
    "/admin/featured",
    "/admin/pricing",
    "/admin/headlines",
    "/admin/why-us",
    "/admin/faqs",
    "/admin/reviews",
]


@pytest.mark.admin
@pytest.mark.smoke
def test_admin_root_redirects_to_login_when_unauth(driver, base_url):
    driver.get(f"{base_url}/admin")
    WebDriverWait(driver, 10).until(EC.url_contains("/admin/login"))
    assert "/admin/login" in driver.current_url


def _login_submit(driver):
    """Click the submit button INSIDE the login form, not the
    admin-layout Sign-out button (both have type=submit).

    JS-click bypasses Selenium's coords-based click which can be
    intercepted by the floating WhatsApp button or a still-visible
    cookie banner under full-suite timing."""
    form = driver.find_element(By.XPATH, "//form[.//input[@name='password']]")
    btn = form.find_element(By.CSS_SELECTOR, "button[type='submit']")
    driver.execute_script("arguments[0].click();", btn)


@pytest.mark.admin
def test_login_form_renders(driver, base_url):
    driver.get(f"{base_url}/admin/login")
    dismiss_cookie_banner(driver)
    pwd = wait_for(driver, (By.CSS_SELECTOR, "form input[name='password']"))
    form = driver.find_element(By.XPATH, "//form[.//input[@name='password']]")
    submit = form.find_element(By.CSS_SELECTOR, "button[type='submit']")
    assert pwd.is_displayed() and submit.is_displayed()


@pytest.mark.admin
def test_login_wrong_password_rejected(driver, base_url):
    driver.get(f"{base_url}/admin/login")
    dismiss_cookie_banner(driver)
    pwd = wait_for(driver, (By.CSS_SELECTOR, "form input[name='password']"))
    pwd.send_keys("definitely-not-the-real-password")
    _login_submit(driver)
    import time
    time.sleep(1.5)
    assert "/admin/login" in driver.current_url, \
        "Wrong password should keep us on /admin/login"


@pytest.mark.admin
@pytest.mark.smoke
def test_login_correct_password_redirects_to_dashboard(driver, base_url, admin_password):
    driver.get(f"{base_url}/admin/login")
    dismiss_cookie_banner(driver)
    pwd = wait_for(driver, (By.CSS_SELECTOR, "form input[name='password']"))
    pwd.send_keys(admin_password)
    _login_submit(driver)
    WebDriverWait(driver, 15).until(
        lambda d: "/admin/login" not in d.current_url and "/admin" in d.current_url
    )
    assert "/admin/login" not in driver.current_url


@pytest.mark.admin
def test_dashboard_has_all_editor_cards(logged_in_driver, base_url):
    driver = logged_in_driver
    driver.get(f"{base_url}/admin")
    cards = wait_for_all(driver, (By.CSS_SELECTOR, "main a[href^='/admin/']"))
    hrefs = {urlparse(a.get_attribute("href") or "").path for a in cards}
    for page in EDITOR_PAGES:
        assert page in hrefs, f"Dashboard missing card for {page}; have {hrefs}"


@pytest.mark.admin
def test_sidebar_has_all_editor_links(logged_in_driver, base_url):
    driver = logged_in_driver
    driver.get(f"{base_url}/admin")
    sidebar = wait_for(driver, (By.CSS_SELECTOR, "nav[aria-label='Admin sections']"))
    anchors = sidebar.find_elements(By.TAG_NAME, "a")
    hrefs = {urlparse(a.get_attribute("href") or "").path for a in anchors}
    for page in EDITOR_PAGES:
        assert page in hrefs, f"Sidebar missing {page}; have {hrefs}"


@pytest.mark.admin
@pytest.mark.parametrize("page", EDITOR_PAGES)
def test_each_editor_page_loads(logged_in_driver, base_url, page):
    driver = logged_in_driver
    driver.get(f"{base_url}{page}")
    h1 = wait_for(driver, (By.TAG_NAME, "h1"), timeout=10)
    assert h1.text.strip(), f"{page}: h1 is empty"
    # A form or a save button should exist on every editor
    saves = driver.find_elements(By.XPATH, "//button[contains(., 'Save')]")
    assert saves, f"{page}: no Save button visible"


@pytest.mark.admin
def test_view_site_link_in_admin_top_bar(logged_in_driver, base_url):
    driver = logged_in_driver
    driver.get(f"{base_url}/admin")
    view_links = driver.find_elements(
        By.XPATH, "//header//a[contains(., 'View site')]"
    )
    # The button text is hidden on small screens — fall back to a 'target=_blank' href='/'
    home_links = driver.find_elements(
        By.CSS_SELECTOR, "header a[href='/'][target='_blank']"
    )
    assert view_links or home_links, "View site link missing from admin top bar"


@pytest.mark.admin
def test_sign_out_returns_to_login(logged_in_driver, base_url):
    driver = logged_in_driver
    driver.get(f"{base_url}/admin")
    dismiss_cookie_banner(driver)
    # Sign-out is a form-submit button INSIDE the admin layout's <header>.
    # JS-click guards against the floating WhatsApp / cookie banner
    # intercepting the coords-based selenium click.
    btn = wait_for(
        driver,
        (By.XPATH, "//header//button[@type='submit']"),
    )
    driver.execute_script("arguments[0].click();", btn)
    WebDriverWait(driver, 10).until(EC.url_contains("/admin/login"))
    assert "/admin/login" in driver.current_url
