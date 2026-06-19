"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Gift,
  Wallet,
  ShieldCheck,
  MapPin,
  Factory,
  Truck,
  Sparkles,
  Award,
  Heart,
  Leaf,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  type LucideIcon,
} from "lucide-react";
import {
  ALLOWED_ICONS,
  ALLOWED_THEMES,
  MAX_CARDS,
  type IconName,
  type ThemeName,
  type WhyCard,
  type WhyWasro,
} from "@/lib/why-wasro";
import { saveWhyWasroAction, type SaveState } from "./actions";
import { cn } from "@/lib/utils";

// Icon registry — same one as in components/sections/why-wasro.tsx
const ICONS: Record<IconName, LucideIcon> = {
  Gift,
  Wallet,
  ShieldCheck,
  MapPin,
  Factory,
  Truck,
  Sparkles,
  Award,
  Heart,
  Leaf,
};

// Theme swatch colours for the picker buttons
const THEME_SWATCHES: Record<ThemeName, string> = {
  yellow: "bg-gradient-to-br from-wasro-yellow to-amber-600",
  blue: "bg-gradient-to-br from-wasro-blue to-wasro-blue-dark",
  emerald: "bg-gradient-to-br from-emerald-500 to-emerald-700",
  coral: "bg-gradient-to-br from-wasro-coral to-rose-700",
};

export function WhyUsEditor({ initial }: { initial: WhyWasro }) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveWhyWasroAction,
    undefined
  );
  const [d, setD] = useState<WhyWasro>(initial);
  const [activeTab, setActiveTab] = useState(0);

  function updateCard(i: number, patch: Partial<WhyCard>) {
    setD((prev) => ({
      ...prev,
      cards: prev.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }));
  }

  return (
    // 2-column on xl+; stacked on smaller screens
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,420px)]">
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="cards" value={JSON.stringify(d.cards)} />

      {/* Section header */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          label="Section header"
          hint="The eyebrow chip, big heading, and one-line summary above the cards."
        />
        <div className="space-y-5">
          <Field
            label="Eyebrow chip"
            name="eyebrow"
            value={d.eyebrow}
            onChange={(v) => setD({ ...d, eyebrow: v })}
            maxLength={40}
            placeholder="Why Wasro"
          />
          <Field
            label="Heading"
            name="title"
            value={d.title}
            onChange={(v) => setD({ ...d, title: v })}
            maxLength={80}
            placeholder="More than just a wash."
          />
          <Field
            label="Sub-heading"
            name="subtitle"
            value={d.subtitle}
            onChange={(v) => setD({ ...d, subtitle: v })}
            maxLength={280}
            placeholder="Built for the Indian household — strong on cleaning, generous on value…"
            multiline
            rows={3}
          />
        </div>
      </section>

      {/* Cards */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          label={`Cards (${MAX_CARDS})`}
          hint="Pick a card to edit. Each card shows on a 1-2-4 grid (mobile/tablet/desktop)."
        />

        {/* Tab strip */}
        <div className="mb-5 flex flex-wrap gap-2">
          {d.cards.map((card, i) => {
            const isActive = i === activeTab;
            const Icon = ICONS[card.icon] ?? Gift;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                  isActive
                    ? "border-wasro-blue bg-wasro-blue text-white shadow-md shadow-wasro-blue/25"
                    : "border-wasro-border bg-white text-wasro-charcoal hover:border-wasro-blue/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded",
                    isActive
                      ? "bg-white/20"
                      : THEME_SWATCHES[card.theme] + " text-white"
                  )}
                >
                  <Icon size={11} />
                </span>
                Card {i + 1}
              </button>
            );
          })}
        </div>

        <CardForm
          card={d.cards[activeTab]}
          onChange={(patch) => updateCard(activeTab, patch)}
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
              <span>Saved. The home page updates on the next page load.</span>
            </div>
          )}
          {!state && (
            <p className="text-xs text-wasro-slate">
              Edit each card&apos;s text + icon + colour. Save commits all
              cards at once.
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
      <WhyUsPreview data={d} activeIndex={activeTab} />
      <p className="text-[11px] leading-relaxed text-wasro-slate">
        Compact mock of the home-page &quot;Why Wasro&quot; section. The
        card you&apos;re editing has a blue ring so you can spot it.
      </p>
    </aside>
    </div>
  );
}

function WhyUsPreview({
  data,
  activeIndex,
}: {
  data: WhyWasro;
  activeIndex: number;
}) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-wasro-blue/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-wasro-blue">
        <Sparkles size={10} /> {data.eyebrow || "—"}
      </span>
      <h3 className="mt-2 text-lg font-bold leading-tight text-wasro-charcoal sm:text-xl">
        {data.title || "—"}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-wasro-slate sm:text-sm">
        {data.subtitle || "—"}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.cards.map((card, i) => {
          const Icon = ICONS[card.icon] ?? Gift;
          return (
            <div
              key={i}
              className={cn(
                "relative overflow-hidden rounded-xl bg-white p-3 ring-1 transition-all",
                i === activeIndex
                  ? "ring-2 ring-wasro-blue shadow-md"
                  : "ring-wasro-border"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm",
                    THEME_SWATCHES[card.theme]
                  )}
                >
                  <Icon size={14} />
                </span>
                <div className="text-right">
                  <div className="text-sm font-bold leading-none text-wasro-charcoal">
                    {card.stat || "—"}
                  </div>
                  <div className="text-[8px] uppercase tracking-wider text-wasro-slate">
                    {card.statLabel || "—"}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] font-bold leading-tight text-wasro-charcoal">
                {card.title || "—"}
              </p>
              <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-wasro-slate">
                {card.body || "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CardForm({
  card,
  onChange,
}: {
  card: WhyCard;
  onChange: (patch: Partial<WhyCard>) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Icon picker */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-wasro-slate">
          Icon
        </label>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {ALLOWED_ICONS.map((iconName) => {
            const Icon = ICONS[iconName];
            const selected = iconName === card.icon;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange({ icon: iconName })}
                title={iconName}
                className={cn(
                  "flex h-11 items-center justify-center rounded-lg border transition",
                  selected
                    ? "border-wasro-blue bg-wasro-blue text-white shadow-md shadow-wasro-blue/25"
                    : "border-wasro-border bg-white text-wasro-slate hover:border-wasro-blue/40 hover:text-wasro-blue"
                )}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme picker */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-wasro-slate">
          Colour theme
        </label>
        <div className="flex flex-wrap gap-2">
          {ALLOWED_THEMES.map((theme) => {
            const selected = theme === card.theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => onChange({ theme })}
                className={cn(
                  "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-semibold capitalize transition",
                  selected
                    ? "border-wasro-blue bg-wasro-blue/5 text-wasro-blue"
                    : "border-wasro-border bg-white text-wasro-charcoal hover:border-wasro-blue/40"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded-full",
                    THEME_SWATCHES[theme]
                  )}
                />
                {theme}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text fields */}
      <Field
        label="Card title"
        name="cardTitle"
        value={card.title}
        onChange={(v) => onChange({ title: v })}
        maxLength={80}
        placeholder="Free gifts in every family pack"
      />
      <Field
        label="Card body"
        name="cardBody"
        value={card.body}
        onChange={(v) => onChange({ body: v })}
        maxLength={280}
        placeholder="1L mug with the 400g, dishwash bar with the 500g…"
        multiline
        rows={3}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Field
          label="Stat value"
          name="cardStat"
          value={card.stat}
          onChange={(v) => onChange({ stat: v })}
          maxLength={12}
          placeholder="5"
          hint="Big number top-right of the card. Can include symbols (e.g. ₹5, 100%)."
        />
        <Field
          label="Stat label"
          name="cardStatLabel"
          value={card.statLabel}
          onChange={(v) => onChange({ statLabel: v })}
          maxLength={40}
          placeholder="gift types"
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
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="h-11 w-full rounded-pill border border-wasro-border bg-white px-4 text-sm text-wasro-charcoal placeholder:text-wasro-slate/70 focus:border-wasro-blue focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
        />
      )}
      {hint && (
        <p className="mt-1 text-[11px] leading-relaxed text-wasro-slate">{hint}</p>
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
          <Save size={16} /> Save Why Wasro
        </>
      )}
    </button>
  );
}
