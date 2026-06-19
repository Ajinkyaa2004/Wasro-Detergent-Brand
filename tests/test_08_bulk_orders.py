"""
Bulk Orders page + form.

Form fields are filled with test data, then we VERIFY but do NOT submit
(per the test policy — submitting would email Harshit and burn an
Upstash write).

Coverage:
  - Page loads + key sections (hero, buyer types, 3-step process)
  - Form has all required fields with correct types
  - Required fields actually have the `required` attribute
  - Filling each input persists the value
  - Submit button exists and is enabled when fields are valid
"""

import pytest
from selenium.webdriver.common.by import By

from conftest import wait_for, dismiss_cookie_banner


REQUIRED_FIELDS = [
    ("name", "text"),
    ("phone", "tel"),
    ("email", "email"),
    ("city", "text"),
    ("buyer_type", None),  # select
    ("quantity", "text"),
]

OPTIONAL_FIELDS = [
    ("business", "text"),
    ("message", None),  # textarea
]


@pytest.mark.smoke
def test_bulk_orders_page_loads(driver, base_url):
    driver.get(f"{base_url}/bulk-orders")
    dismiss_cookie_banner(driver)
    h1 = wait_for(driver, (By.TAG_NAME, "h1"))
    assert h1.text.strip()


def test_bulk_orders_has_buyer_types_grid(driver, base_url):
    driver.get(f"{base_url}/bulk-orders")
    dismiss_cookie_banner(driver)
    # 6 buyer-type cards listed in the page copy
    page = driver.find_element(By.TAG_NAME, "main").text.lower()
    assert "kirana" in page or "retail" in page
    assert "hostel" in page or "school" in page
    assert "distributor" in page


def test_bulk_form_has_all_required_fields(driver, base_url):
    driver.get(f"{base_url}/bulk-orders")
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    import time
    time.sleep(0.4)
    for name, _ in REQUIRED_FIELDS:
        if name == "buyer_type":
            el = driver.find_element(By.CSS_SELECTOR, f"select[name='{name}']")
        else:
            el = driver.find_element(By.CSS_SELECTOR, f"input[name='{name}'], textarea[name='{name}']")
        assert el.get_attribute("required") is not None, \
            f"{name!r} should be required"


@pytest.mark.parametrize("name,expected_type", [(n, t) for n, t in REQUIRED_FIELDS if t])
def test_required_fields_have_correct_input_type(driver, base_url, name, expected_type):
    driver.get(f"{base_url}/bulk-orders")
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    import time
    time.sleep(0.3)
    el = driver.find_element(By.CSS_SELECTOR, f"input[name='{name}']")
    assert el.get_attribute("type") == expected_type, \
        f"{name!r} expected type={expected_type}, got {el.get_attribute('type')}"


def test_fill_form_with_test_data_no_submit(driver, base_url):
    """Fill every field with test data and verify the values stick.
    We do NOT click submit."""
    driver.get(f"{base_url}/bulk-orders")
    dismiss_cookie_banner(driver)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    import time
    time.sleep(0.4)

    test_data = {
        "name": "SELENIUM TEST — IGNORE",
        "business": "Test Kirana Pvt Ltd",
        "phone": "+91 90000 00000",
        "email": "test+selenium@wasro.local",
        "city": "Guwahati",
        "quantity": "200 packs of 1kg powder",
        "message": "This is an automated test. Do not action.",
    }
    for name, value in test_data.items():
        el = driver.find_element(
            By.CSS_SELECTOR, f"input[name='{name}'], textarea[name='{name}']"
        )
        el.clear()
        el.send_keys(value)
        actual = el.get_attribute("value")
        assert actual == value, f"{name!r}: expected {value!r}, got {actual!r}"

    # Buyer-type select
    from selenium.webdriver.support.ui import Select
    sel = Select(driver.find_element(By.CSS_SELECTOR, "select[name='buyer_type']"))
    sel.select_by_visible_text("Kirana / retail shop")
    assert sel.first_selected_option.text == "Kirana / retail shop"


def test_submit_button_exists_but_not_clicked(driver, base_url):
    driver.get(f"{base_url}/bulk-orders")
    dismiss_cookie_banner(driver)
    # Staged scroll to trigger Reveal animations on form
    import time
    for y in (500, 1500, 2500, 3500):
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(0.25)
    btn = driver.find_element(By.CSS_SELECTOR, "form button[type='submit']")
    # Skip is_displayed (Reveal opacity-0 transient state); is_enabled is
    # the meaningful check — disabled button = bug.
    assert btn.is_enabled(), "Submit button should be enabled when idle"
    # textContent confirms it's the right button
    text = driver.execute_script("return arguments[0].textContent;", btn) or ""
    assert "Send" in text or "Submit" in text, f"Unexpected submit text: {text!r}"
