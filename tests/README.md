# Wasro Selenium QA Suite

End-to-end UI tests for the Wasro website. Built for pre-launch verification before going live on the paid domain.

## What's covered (≈80 tests, ~3 min runtime)

| File | Coverage |
|---|---|
| `test_01_homepage.py` | Hero CTAs, Made-in-Assam chip z-index, category strip, featured products, pack sizes, reviews section, press strip, floating WhatsApp |
| `test_02_navbar.py` | Logo + 5 nav links + Bulk Orders CTA; click-navigates each. Mobile hamburger menu + quick actions |
| `test_03_footer.py` | All shop / help / about / legal links, social icons, newsletter form fields + honeypot |
| `test_04_cookie_banner.py` | First-visit display, Accept/Reject persists, Dismiss does NOT persist, cross-page memory |
| `test_05_reviews_swipe.py` | Aggregate badge, arrow buttons advance counter by exactly 1 (regression for the cascade bug), Restart deck |
| `test_06_products.py` | All 4 category sections, no sticky pill nav, ≥8 product images, Find-a-store links |
| `test_07_supporting_pages.py` | Find-store filter + distributor cards, stain guide entries, About bento + FAQs |
| `test_08_bulk_orders.py` | Required field attributes, input types, full form fill (no submit) |
| `test_09_policies_and_404.py` | Privacy / Terms / Shipping / Returns load. /random-page → branded 404 with 4 CTAs |
| `test_10_admin.py` | Login redirects, wrong/right password flow, 8 editor pages reachable, sign-out |

## Write-safety policy

**These tests never click Save / Submit / persist anywhere.** They fill in forms and verify the UI state but stop before triggering an actual server action. This means:

- Newsletter signups don't land in Upstash.
- Bulk-orders enquiries don't email Harshit.
- Admin editor saves don't mutate live content.

If you want true end-to-end including writes, set `WASRO_TEST_MODE=submit` and modify the relevant tests — but be ready to clean up afterwards.

## Setup (one-time)

```bash
cd tests
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

Chrome must be installed (any recent version — Selenium 4 auto-resolves the driver).

## Running

```bash
# 1. Start the dev server in another terminal
(cd .. && npm run dev)

# 2. Run the suite
./run.sh
```

### Useful flags

```bash
# Watch the browser windows (debug a failing test)
WASRO_HEADED=1 ./run.sh

# Run against production instead of localhost
WASRO_BASE_URL=https://wasro.vercel.app ./run.sh

# Just the smoke tests (~30s)
./run.sh -m smoke

# Just one file
./run.sh test_05_reviews_swipe.py

# One specific test
./run.sh test_05_reviews_swipe.py::test_right_arrow_swipes_exactly_one_card
```

## Output

- Live results print to the terminal in pytest's standard format.
- A self-contained `report.html` is generated at `tests/report.html` — open it in a browser.
- Failed tests auto-save a Chrome screenshot to `tests/screenshots/<test_name>.png`.

## Environment variables

| Var | Default | Purpose |
|---|---|---|
| `WASRO_BASE_URL` | `http://localhost:3000` | Site root |
| `WASRO_ADMIN_PASSWORD` | (unset) | Admin login — required for the `admin` + `write` tests |
| `WASRO_HEADED` | (unset) | Set to `1` to show Chrome windows |

## Adding tests

The conftest exposes a few small helpers:

```python
from conftest import wait_for, wait_for_all, dismiss_cookie_banner

def test_my_thing(driver, base_url):
    driver.get(f"{base_url}/my-page")
    dismiss_cookie_banner(driver)        # pre-seeds localStorage
    el = wait_for(driver, (By.CSS_SELECTOR, ".thing"))
    assert el.is_displayed()
```

Mark slow / flaky tests with `@pytest.mark.interactive` and CI can skip them with `-m "not interactive"`.

## CI integration

For GitHub Actions: install Chrome via `browser-actions/setup-chrome@latest`, then `python3 -m pip install -r tests/requirements.txt && cd tests && python3 -m pytest`. The `report.html` should be uploaded as an artifact.
