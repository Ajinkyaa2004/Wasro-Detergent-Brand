"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { SITE } from "@/lib/utils";

/**
 * Wasro bulk-orders form.
 *
 * Submits to our own Next.js Route Handler at /api/bulk-enquiry, which uses
 * Nodemailer to send an email to madhav.ghy@gmail.com via Gmail SMTP.
 *
 * Required server-side env vars (.env.local):
 *   SMTP_USER   = madhav.ghy@gmail.com
 *   SMTP_PASS   = <16-char Gmail App Password>   (NOT the regular Gmail password)
 *   MAIL_TO     = madhav.ghy@gmail.com           (optional — defaults to SMTP_USER)
 *   MAIL_FROM   = Wasro Website <madhav.ghy@gmail.com>   (optional)
 *
 * One-time Gmail setup for Harshit:
 *   1. Enable 2-Step Verification on madhav.ghy@gmail.com
 *   2. Visit myaccount.google.com/apppasswords
 *   3. Create a new App Password named "Wasro website"
 *   4. Copy the 16-character password into SMTP_PASS
 */

type Status = "idle" | "submitting" | "success" | "error";

export function BulkForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/bulk-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.error) {
        throw new Error(json.error || `Request failed (${res.status})`);
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : `Failed to send. Please WhatsApp us at ${SITE.whatsappDisplay}.`
      );
    }
  }

  if (status === "success") {
    return <SuccessCard onReset={() => setStatus("idle")} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[1.5rem] border border-wasro-border bg-white p-6 shadow-xl shadow-wasro-blue/[0.06] md:p-8"
    >
      {/* Honeypot — bots fill this; humans don't see it */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="mb-6 flex items-center gap-3 border-b border-wasro-border pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wasro-blue-light text-wasro-blue">
          <Send size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-wasro-charcoal">
            Bulk enquiry form
          </p>
          <p className="text-xs text-wasro-slate">
            Goes straight to {SITE.email}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Your name"
            name="name"
            type="text"
            required
            placeholder="Harshit Agarwal"
          />
          <Field
            label="Business / Shop name"
            name="business"
            type="text"
            placeholder="Optional"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Phone (WhatsApp preferred)"
            name="phone"
            type="tel"
            required
            placeholder="+91 90000 00000"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="City"
            name="city"
            type="text"
            required
            placeholder="Guwahati"
          />
          <SelectField
            label="Buyer type"
            name="buyer_type"
            required
            options={[
              "Kirana / retail shop",
              "Supermarket / chain",
              "Hostel / school",
              "Hotel / restaurant",
              "NGO / institution",
              "Distributor",
              "Other",
            ]}
          />
        </div>
        <Field
          label="Approximate quantity"
          name="quantity"
          type="text"
          required
          placeholder="e.g. 200 packs of 1kg powder + 100 dishwash bars"
        />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-wasro-charcoal">
            Anything else?
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder="SKU mix, delivery timeline, any other notes..."
            className="w-full rounded-card border border-wasro-border bg-wasro-cream/60 p-3 text-sm text-wasro-charcoal placeholder:text-wasro-slate transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
          />
        </div>

        {status === "error" && (
          <div className="flex items-start gap-2 rounded-card bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="mt-0.5 text-xs">
                You can also WhatsApp us at {SITE.whatsappDisplay}.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="wasro-shine wasro-shine-cta inline-flex w-full items-center justify-center gap-2 rounded-pill bg-wasro-blue px-6 py-4 text-sm font-bold text-white shadow-lg shadow-wasro-blue/25 transition hover:-translate-y-0.5 hover:bg-wasro-blue-dark hover:shadow-xl disabled:opacity-60 md:w-auto md:px-10"
        >
          {status === "submitting" ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send size={14} /> Send enquiry
            </>
          )}
        </button>
        <p className="text-xs text-wasro-slate">
          By submitting, you agree to be contacted on the phone/email above.
          We&apos;ll reply within one working day.
        </p>
      </div>
    </form>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-10 text-center shadow-xl shadow-emerald-500/10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div className="relative">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-emerald-900">
          Enquiry received!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-emerald-800/80">
          Thank you. Our team will reach out on WhatsApp or email within one
          working day with pricing, MOQs, and dispatch timelines.
        </p>
        <button
          onClick={onReset}
          className="mt-7 rounded-pill bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Send another enquiry
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-wasro-charcoal">
        {label}
        {required && <span className="ml-0.5 text-wasro-coral">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 w-full rounded-pill border border-wasro-border bg-wasro-cream/60 px-4 text-sm text-wasro-charcoal placeholder:text-wasro-slate transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-wasro-charcoal">
        {label}
        {required && <span className="ml-0.5 text-wasro-coral">*</span>}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="h-12 w-full appearance-none rounded-pill border border-wasro-border bg-wasro-cream/60 bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231B5FA8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px_18px] bg-[position:right_16px_center] bg-no-repeat px-4 pr-12 text-sm text-wasro-charcoal transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
      >
        <option value="" disabled>
          Select buyer type…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
