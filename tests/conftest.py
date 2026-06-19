"""
Shared pytest fixtures for the Wasro Selenium test suite.

Fixtures provided:
  - base_url           : root URL for the site under test (env-overridable)
  - admin_password     : password fed into /admin/login
  - driver             : headless Chrome WebDriver, fresh per test
  - mobile_driver      : same, but with iPhone 13 viewport
  - logged_in_driver   : driver that has authenticated to /admin

Conventions:
  - Each test gets a fresh driver -> no cross-test localStorage/cookie bleed.
  - A failed test auto-saves a screenshot under tests/screenshots/.
  - All waits use WebDriverWait + EC, never time.sleep, to avoid flakiness.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

ROOT = Path(__file__).parent
SCREENSHOTS = ROOT / "screenshots"
SCREENSHOTS.mkdir(exist_ok=True)


# -------------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------------

@pytest.fixture(scope="session")
def base_url() -> str:
    """Site under test. Defaults to local dev — override with WASRO_BASE_URL."""
    return os.getenv("WASRO_BASE_URL", "http://localhost:3000").rstrip("/")


@pytest.fixture(scope="session")
def admin_password() -> str:
    # No real password baked in — provide it via the WASRO_ADMIN_PASSWORD
    # env var when running the admin/write tests, e.g.
    #   WASRO_ADMIN_PASSWORD=... ./run.sh -m admin
    return os.getenv("WASRO_ADMIN_PASSWORD", "")


# -------------------------------------------------------------------------
# Driver fixtures
# -------------------------------------------------------------------------

def _build_chrome(window_size: str = "1440,900", mobile: bool = False) -> webdriver.Chrome:
    opts = Options()
    # `--headless=new` is the modern, more accurate headless mode (matches
    # real Chrome rendering better than the legacy `--headless`).
    if os.getenv("WASRO_HEADED") != "1":
        opts.add_argument("--headless=new")
    opts.add_argument(f"--window-size={window_size}")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--lang=en-IN")
    opts.add_experimental_option("excludeSwitches", ["enable-logging"])
    if mobile:
        # Use deviceMetrics instead of deviceName — the "iPhone 13" preset
        # was removed from recent Chromium versions and now raises
        # InvalidArgumentException. Explicit metrics work on every version.
        opts.add_experimental_option(
            "mobileEmulation",
            {
                "deviceMetrics": {"width": 390, "height": 844, "pixelRatio": 3.0},
                "userAgent": (
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) "
                    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 "
                    "Mobile/15E148 Safari/604.1"
                ),
            },
        )
    driver = webdriver.Chrome(options=opts)
    driver.set_page_load_timeout(45)
    return driver


@pytest.fixture
def driver(request):
    """Fresh desktop Chrome per test. Auto-screenshots on failure."""
    drv = _build_chrome()
    yield drv
    # Capture a screenshot if the test failed (set by hookimpl below)
    if getattr(request.node, "rep_call", None) and request.node.rep_call.failed:
        path = SCREENSHOTS / f"{request.node.name}.png"
        try:
            drv.save_screenshot(str(path))
            print(f"\n[screenshot saved] {path}", file=sys.stderr)
        except Exception:
            pass
    drv.quit()


@pytest.fixture
def mobile_driver(request):
    """Mobile-viewport Chrome (iPhone 13 emulation)."""
    drv = _build_chrome(mobile=True)
    yield drv
    if getattr(request.node, "rep_call", None) and request.node.rep_call.failed:
        path = SCREENSHOTS / f"{request.node.name}-mobile.png"
        try:
            drv.save_screenshot(str(path))
        except Exception:
            pass
    drv.quit()


@pytest.fixture
def logged_in_driver(driver, base_url, admin_password):
    """
    Driver authenticated to /admin via the password form.

    Note: /admin/login still renders the root layout (Navbar + admin
    layout's Sign-out button), so `button[type=submit]` would match
    the wrong button. We scope to the login form specifically.
    """
    driver.get(f"{base_url}/admin/login")
    # Remove the cookie banner BEFORE we try to click — it can otherwise
    # intercept the form submit under full-suite load.
    dismiss_cookie_banner(driver)
    wait = WebDriverWait(driver, 10)
    # Wait for the password input — it lives inside the login form
    pwd_input = wait.until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, "form input[name='password']")
        )
    )
    pwd_input.send_keys(admin_password)
    # Submit the SAME form (not the admin top-bar's Sign-out button)
    form = pwd_input.find_element(By.XPATH, "./ancestor::form")
    submit = form.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit.click()
    # Wait for redirect to /admin dashboard (URL must NOT contain /login)
    wait.until(lambda d: "/admin/login" not in d.current_url and "/admin" in d.current_url)
    return driver


# -------------------------------------------------------------------------
# Helpers exposed to tests via `pytest.helpers`-style mixins.
# We just attach to the module so tests can `from conftest import ...`.
# -------------------------------------------------------------------------

def wait_for(driver: webdriver.Chrome, locator, timeout: int = 10):
    """Shortcut: WebDriverWait + visibility_of_element_located."""
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located(locator)
    )


def wait_for_all(driver: webdriver.Chrome, locator, timeout: int = 10):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_all_elements_located(locator)
    )


def wait_present(driver: webdriver.Chrome, locator, timeout: int = 10):
    """
    DOM-presence wait — does NOT require the element to be visible.

    Use for content existence checks inside Reveal-wrapped sections.
    The Reveal component starts at opacity-0 and animates to opacity-1
    on intersection; `visibility_of_element_located` would time out
    during that brief opacity-0 window even though the node exists.
    """
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located(locator)
    )


def text_of(driver: webdriver.Chrome, locator, timeout: int = 10) -> str:
    """Return the JS textContent (bypasses Selenium's visibility filter)."""
    el = wait_present(driver, locator, timeout)
    return driver.execute_script("return arguments[0].textContent || '';", el).strip()


def sweep_splash(driver: webdriver.Chrome) -> None:
    """
    Remove the splash overlay WITHOUT touching the cookie banner.

    Use this in tests that need to interact with elements the splash
    would intercept (z-100) but want the cookie banner to stay
    interactive — e.g. the cookie-banner tests themselves.

    Pre-seeds the splash sessionStorage flag so any subsequent mounts
    skip showing, then CSS-hides any splash already in the DOM.
    """
    driver.execute_script(
        """
        try { window.sessionStorage.setItem('wasro_splash_seen', '1'); } catch(e) {}
        const hide = (el) => {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            el.style.visibility = 'hidden';
        };
        document.querySelectorAll('div[data-testid="wasro-splash"]').forEach(hide);
        document.body.style.overflow = '';
        """
    )


def dismiss_cookie_banner(driver: webdriver.Chrome) -> None:
    """
    Clear any overlays the test doesn't care about:
      - Cookie consent banner (localStorage + DOM removal)
      - First-visit splash screen (sessionStorage + DOM removal)

    Both components read storage in a `useEffect` that runs ONCE on
    mount. Setting storage AFTER `driver.get(...)` doesn't dismiss
    already-rendered overlays — they read storage as `null` during
    mount and stay visible. We therefore also physically remove the
    DOM nodes so they can't intercept clicks during the test.

    Safe to call on any page (no-ops if neither overlay is present).
    The function name predates the splash; kept for backward-compat
    with the rest of the suite.
    """
    driver.execute_script(
        """
        // Persist cookie + splash flags so the respective `useEffect`s
        // read "seen" on mount and skip rendering. This is the cleanest
        // route — no DOM-removal race, no MutationObserver hacks.
        try { window.localStorage.setItem('wasro_cookie_consent', 'accepted'); } catch(e) {}
        try { window.sessionStorage.setItem('wasro_splash_seen', '1'); } catch(e) {}

        // Belt-and-braces: also hide any overlays that already mounted
        // before we got to set the flags. CSS-hide rather than DOM
        // removal so React's reconciliation doesn't crash with
        // `removeChild: not a child of this node`.
        const hide = (el) => {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            el.style.visibility = 'hidden';
        };
        document.querySelectorAll(
            'div[data-testid="wasro-splash"], '
            + 'div[role="dialog"][aria-label="Cookie consent"]'
        ).forEach(hide);
        // Splash component locks body scroll; restore it.
        document.body.style.overflow = '';
        """
    )


# -------------------------------------------------------------------------
# Hook for screenshot-on-failure
# -------------------------------------------------------------------------

@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)
