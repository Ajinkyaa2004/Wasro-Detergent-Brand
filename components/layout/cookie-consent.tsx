"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

/**
 * Cookie consent banner — DPDP Act 2023 compliant.
 *
 * Why it exists:
 * - India's Digital Personal Data Protection Act 2023 requires explicit
 *   consent for any cookies that go beyond strict-necessary (analytics,
 *   marketing trackers, etc.).
 * - Currently the site only sets functional cookies (session, admin auth)
 *   but the moment we wire Google Analytics / Meta Pixel / similar, this
 *   banner needs to already be there gating those scripts.
 *
 * Implementation notes:
 * - LocalStorage key `wasro_cookie_consent` stores either "accepted" or
 *   "rejected". Banner only shows when the key is absent (first visit /
 *   cleared storage).
 * - Reading localStorage is synchronous-safe at mount inside useEffect —
 *   the brief flash of nothing is preferable to SSR/CSR hydration
 *   mismatch from server-rendering a banner the user already dismissed.
 * - We deliberately do NOT auto-accept on close (X button) — closing
 *   without choosing means "ask me again later" (next page load). Only
 *   the explicit Accept / Reject buttons persist a decision.
 */

const STORAGE_KEY = "wasro_cookie_consent";

type Consent = "accepted" | "rejected" | null;

function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    // localStorage can throw in Safari private mode — fail silent.
  }
  return null;
}

function writeConsent(value: Consent) {
  if (typeof window === "undefined") return;
  if (!value) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
  // Surface a CustomEvent so any analytics-init code listening can react
  // to the user's choice without polling localStorage.
  window.dispatchEvent(
    new CustomEvent("wasro:cookie-consent", { detail: value })
  );
}

export function CookieConsent() {
  // `null` here means "still figuring out whether to show" — keeps the
  // banner hidden until the effect resolves, avoiding a hydration flash.
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (readConsent() === null) setShow(true);
  }, []);

  if (!mounted || !show) return null;

  const handleAccept = () => {
    writeConsent("accepted");
    setShow(false);
  };
  const handleReject = () => {
    writeConsent("rejected");
    setShow(false);
  };
  const handleDismiss = () => {
    // Close without persisting — banner will reappear on next page load.
    // Deliberate: we want a deliberate choice from the user, not
    // accidental dismissal that locks them in.
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="wasro-cookie-desc"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-3xl border border-wasro-border bg-white p-5 shadow-2xl ring-1 ring-black/5 md:inset-x-auto md:right-6 md:bottom-6 md:left-6"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-wasro-yellow/20 text-wasro-yellow-dark sm:flex"
        >
          <Cookie size={22} />
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-bold text-wasro-charcoal">
            We use a few essential cookies
          </h2>
          <p
            id="wasro-cookie-desc"
            className="mt-1 text-xs leading-relaxed text-wasro-slate"
          >
            wasro.in uses only strictly-necessary cookies for the site to work
            (admin login, form submissions). We do not use third-party
            advertising trackers. Read the details in our{" "}
            <Link
              href="/privacy"
              className="font-semibold text-wasro-blue underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center justify-center rounded-pill bg-wasro-charcoal px-5 py-2 text-xs font-semibold text-white transition hover:bg-wasro-blue"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center justify-center rounded-pill bg-white px-5 py-2 text-xs font-semibold text-wasro-charcoal ring-1 ring-wasro-border transition hover:bg-wasro-cream"
            >
              Reject non-essential
            </button>
            <Link
              href="/privacy"
              className="text-xs font-semibold text-wasro-blue underline-offset-2 hover:underline"
            >
              Learn more
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss cookie banner for now"
          className="rounded-full p-1.5 text-wasro-slate transition hover:bg-wasro-cream hover:text-wasro-charcoal"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
