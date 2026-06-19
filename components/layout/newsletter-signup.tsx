"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Mail, ArrowRight, Loader2, Check, AlertCircle } from "lucide-react";
import { subscribeAction, type SubscribeState } from "./newsletter-actions";

/**
 * Footer email signup form.
 *
 * Form posts to the `subscribeAction` server action which writes the
 * email to the Upstash-backed subscriber list. UX details:
 *   - Empty input is rejected client-side (HTML required) so the action
 *     doesn't bounce trivial submissions
 *   - On success we replace the form with a "you're in" tick. The state
 *     is local — refreshing the page brings the form back, which is
 *     intentional (lets the same browser sign up multiple emails).
 *   - Hidden honeypot field `_company` traps the dumber crawlers.
 *   - "Already-subscribed" vs "newly-subscribed" both look identical to
 *     the user — same success message — to discourage probing for email
 *     enumeration.
 */
export function NewsletterSignup() {
  const [state, formAction] = useActionState<SubscribeState, FormData>(
    subscribeAction,
    undefined
  );
  // Local "submitted" mirror so we can keep the success state visible
  // even after revalidation churn. Cleared on a manual reset (if we add
  // one later).
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state?.ok) setSubmitted(true);
  }, [state]);

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-500/15 p-4 ring-1 ring-emerald-300/30">
        <div className="flex items-start gap-3 text-emerald-100">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={14} />
          </span>
          <div>
            <p className="text-sm font-bold text-white">You&apos;re in.</p>
            <p className="mt-0.5 text-xs leading-relaxed text-emerald-100/80">
              We&apos;ll only send genuine product news, new-launch pings, and
              the occasional festive offer. No daily noise.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-2.5">
      <div className="relative">
        <Mail
          size={14}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-wasro-cream/70"
          aria-hidden
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email address for newsletter"
          className="h-11 w-full rounded-pill bg-white/10 pl-9 pr-28 text-sm text-white placeholder:text-wasro-cream/55 ring-1 ring-white/15 transition focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-wasro-yellow/60"
        />
        {/* Honeypot — invisible to humans, irresistible to bots. */}
        <input
          type="text"
          name="_company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute left-[-9999px] top-auto h-0 w-0 opacity-0"
        />
        <SubmitButton />
      </div>
      {state?.ok === false && (
        <p className="flex items-center gap-1.5 text-xs text-rose-200">
          <AlertCircle size={12} /> {state.error}
        </p>
      )}
      {!state && (
        <p className="text-[11px] leading-relaxed text-wasro-cream/65">
          Product news, new-launch pings, festive offers. No spam, unsubscribe
          anytime.
        </p>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Subscribe"
      className="absolute right-1.5 top-1/2 inline-flex h-8 -translate-y-1/2 items-center gap-1 rounded-pill bg-wasro-yellow px-3.5 text-xs font-bold text-wasro-charcoal transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <>
          Subscribe <ArrowRight size={12} />
        </>
      )}
    </button>
  );
}
