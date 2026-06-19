"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { HeroContent } from "@/lib/hero-content";
import { saveHeroContentAction, type SaveState } from "./actions";

export function HeroContentEditor({ initial }: { initial: HeroContent }) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveHeroContentAction,
    undefined
  );
  const [c, setC] = useState<HeroContent>(initial);

  function patch<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
  }

  function patchStat(i: number, partial: Partial<HeroContent["stats"][number]>) {
    setC((prev) => ({
      ...prev,
      stats: prev.stats.map((s, idx) =>
        idx === i ? { ...s, ...partial } : s
      ),
    }));
  }

  return (
    // 2-column on xl+ (form left, sticky preview right). Stacked below.
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,420px)]">
    <form action={formAction} className="space-y-5">
      {/* Brand chip + headline second-line */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          label="Top tag & headline"
          hint="The small chip above the headline, plus the line that stays static under the cycling words."
        />
        <div className="space-y-5">
          <Field
            label="Brand chip"
            name="chipText"
            value={c.chipText}
            onChange={(v) => patch("chipText", v)}
            maxLength={80}
            placeholder="Trusted across Northeast India"
            hint="Sits above the headline. Keep it short — used as a quick brand signal."
          />
          <Field
            label="Static headline line"
            name="secondLine"
            value={c.secondLine}
            onChange={(v) => patch("secondLine", v)}
            maxLength={80}
            placeholder="For every Indian home."
            hint="Sits BELOW the rotating words (edit those at Hero headlines)."
          />
        </div>
      </section>

      {/* Subtitle paragraph */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          label="Subtitle paragraph"
          hint="The body copy directly under the headline."
        />
        <Field
          label="Subtitle"
          name="subtitle"
          value={c.subtitle}
          onChange={(v) => patch("subtitle", v)}
          maxLength={400}
          placeholder="Wasro detergent powders, dishwash bars..."
          multiline
          rows={4}
        />
      </section>

      {/* CTAs */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          label="Call-to-action buttons"
          hint="Two buttons under the subtitle. Use site paths (/products) or full https:// URLs."
        />
        <div className="space-y-5">
          <CtaRow
            label="Primary button (blue)"
            namePrefix="primaryCta"
            value={c.primaryCta}
            onChange={(v) => patch("primaryCta", v)}
          />
          <CtaRow
            label="Secondary button (outline)"
            namePrefix="secondaryCta"
            value={c.secondaryCta}
            onChange={(v) => patch("secondaryCta", v)}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          label="Stats row"
          hint="Three counters above the offer slideshow. Animated count-up runs on page load."
        />
        <div className="space-y-4">
          {c.stats.map((stat, i) => (
            <StatRow
              key={i}
              index={i}
              value={stat}
              onChange={(partial) => patchStat(i, partial)}
            />
          ))}
        </div>
      </section>

      {/* Made in Assam chip */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          label="Product sticker chip"
          hint="The yellow sticker on top-right of the product image (a brand-mark, not slide-specific)."
        />
        <Field
          label="Chip text"
          name="madeInAssamChip"
          value={c.madeInAssamChip}
          onChange={(v) => patch("madeInAssamChip", v)}
          maxLength={40}
          placeholder="Made in Assam"
        />
      </section>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-[1.25rem] border border-wasro-border bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 flex-1">
          {state?.ok === false && (
            <div className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}
          {state?.ok === true && (
            <div className="flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>Saved. The hero text updates on the next page load.</span>
            </div>
          )}
          {!state && (
            <p className="text-xs text-wasro-slate">
              All hero text is editable here. Save to commit to storage.
            </p>
          )}
        </div>
        <SaveButton />
      </div>
    </form>

    {/* Live preview pane */}
    <aside className="space-y-3 xl:sticky xl:top-24 xl:self-start">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-slate">
          Live preview
        </h2>
        <span className="text-[11px] text-wasro-slate/80">
          Updates as you type
        </span>
      </div>
      <HeroPreview content={c} />
      <p className="text-[11px] leading-relaxed text-wasro-slate">
        Compact mock of the home hero. Rotating slideshow + cycling
        headline words are edited in their own admin sections — shown
        here as placeholders.
      </p>
    </aside>
    </div>
  );
}

/**
 * Reduced-scale mock of the live hero. Mirrors components/sections/hero.tsx
 * structurally so admins see roughly what the change will look like.
 */
function HeroPreview({ content }: { content: HeroContent }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-wasro-border bg-gradient-to-br from-wasro-cream via-white to-wasro-blue-light/30 p-5 shadow-sm sm:p-6">
      {/* Chip */}
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-wasro-blue ring-1 ring-wasro-blue/15 backdrop-blur">
        <Sparkles size={10} className="animate-pulse" />{" "}
        {content.chipText || "—"}
      </span>

      {/* Headline */}
      <h1 className="mt-3 text-xl font-bold leading-[1.15] tracking-tight text-wasro-charcoal sm:text-2xl">
        <span className="text-wasro-blue italic opacity-70">
          [cycling words]
        </span>
        <br />
        {content.secondLine || "—"}
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-xs leading-relaxed text-wasro-slate sm:text-sm">
        {content.subtitle || "—"}
      </p>

      {/* CTAs */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-pill bg-wasro-blue px-4 py-2 text-xs font-semibold text-white shadow-sm">
          {content.primaryCta.label || "—"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-white px-4 py-2 text-xs font-semibold text-wasro-charcoal ring-1 ring-wasro-border">
          <MapPin size={11} /> {content.secondaryCta.label || "—"}
        </span>
      </div>

      {/* Stats row */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-wasro-border/60 pt-3">
        {content.stats.map((s, i) => (
          <div key={i}>
            <div className="text-base font-bold text-wasro-charcoal sm:text-lg">
              {s.prefix ?? ""}
              {s.value.toLocaleString("en-IN")}
              {s.suffix ?? ""}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-wasro-slate">
              {s.label || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* "Made in Assam" chip preview */}
      <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-wasro-slate">
        <span>Product sticker:</span>
        <span className="inline-flex items-center justify-center rounded-card bg-wasro-yellow/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-wasro-charcoal">
          {content.madeInAssamChip || "—"}
        </span>
      </div>
    </div>
  );
}

function CtaRow({
  label,
  namePrefix,
  value,
  onChange,
}: {
  label: string;
  namePrefix: string;
  value: { label: string; href: string };
  onChange: (v: { label: string; href: string }) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-wasro-charcoal">{label}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Field
          label="Button text"
          name={`${namePrefix}_label`}
          value={value.label}
          onChange={(v) => onChange({ ...value, label: v })}
          maxLength={40}
          placeholder="Shop the range"
        />
        <Field
          label="Button link"
          name={`${namePrefix}_href`}
          value={value.href}
          onChange={(v) => onChange({ ...value, href: v })}
          maxLength={500}
          placeholder="/products"
        />
      </div>
    </div>
  );
}

function StatRow({
  index,
  value,
  onChange,
}: {
  index: number;
  value: HeroContent["stats"][number];
  onChange: (partial: Partial<HeroContent["stats"][number]>) => void;
}) {
  return (
    <div className="rounded-card border border-wasro-border bg-wasro-cream/50 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-wasro-blue">
        Stat {index + 1}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,80px)_minmax(0,1fr)_minmax(0,80px)_minmax(0,2fr)]">
        <Field
          label="Prefix"
          name={`stat${index}_prefix`}
          value={value.prefix ?? ""}
          onChange={(v) => onChange({ prefix: v || undefined })}
          maxLength={4}
          placeholder="₹"
        />
        <Field
          label="Value"
          name={`stat${index}_value`}
          value={String(value.value)}
          onChange={(v) =>
            onChange({ value: Number(v.replace(/[^0-9]/g, "")) || 0 })
          }
          maxLength={9}
          placeholder="121"
          type="number"
        />
        <Field
          label="Suffix"
          name={`stat${index}_suffix`}
          value={value.suffix ?? ""}
          onChange={(v) => onChange({ suffix: v || undefined })}
          maxLength={4}
          placeholder="+"
        />
        <Field
          label="Label"
          name={`stat${index}_label`}
          value={value.label}
          onChange={(v) => onChange({ label: v })}
          maxLength={60}
          placeholder="Stores across NE India"
        />
      </div>
    </div>
  );
}

function SectionHeader({ label, hint }: { label: string; hint?: string }) {
  return (
    <header className="mb-4">
      <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
        {label}
      </h2>
      {hint && (
        <p className="mt-1 text-xs leading-relaxed text-wasro-slate">{hint}</p>
      )}
    </header>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  maxLength,
  placeholder,
  hint,
  type = "text",
  multiline,
  rows = 2,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
  hint?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-bold uppercase tracking-wider text-wasro-slate">
        <span>{label}</span>
        {maxLength && (
          <span className="text-[10px] font-medium normal-case tracking-normal text-wasro-slate/70">
            {value.length}/{maxLength}
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-card border border-wasro-border bg-white p-3 text-sm text-wasro-charcoal placeholder:text-wasro-slate/70 focus:border-wasro-blue focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="h-11 w-full rounded-pill border border-wasro-border bg-white px-4 text-sm text-wasro-charcoal placeholder:text-wasro-slate/70 focus:border-wasro-blue focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
        />
      )}
      {hint && (
        <p className="mt-1 text-[11px] leading-relaxed text-wasro-slate">
          {hint}
        </p>
      )}
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-pill bg-wasro-blue px-7 text-sm font-bold text-white shadow-md shadow-wasro-blue/25 transition hover:-translate-y-0.5 hover:bg-wasro-blue-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Save size={16} /> Save hero content
        </>
      )}
    </button>
  );
}
