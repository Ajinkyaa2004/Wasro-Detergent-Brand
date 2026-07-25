"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import type { Product } from "@/data/products";
import {
  MAX_SLIDES,
  MIN_CYCLE,
  MAX_CYCLE,
  type Offer,
  type Slide,
} from "@/lib/offer";
import { saveOfferAction, type SaveState } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Multi-slide hero offer editor.
 *
 * Layout:
 *   - Left column: master controls (active toggle, cycle seconds) + a
 *     tab strip for each slide, then the active slide's form fields.
 *   - Right column: live preview that auto-cycles through the slides
 *     just like the live hero will.
 *
 * Form posts a JSON-encoded `slides` array plus `active` + `cycleSeconds`.
 */
export function OfferEditor({
  initial,
  products,
}: {
  initial: Offer;
  products: Product[];
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveOfferAction,
    undefined
  );

  const [active, setActive] = useState(initial.active);
  const [cycleSeconds, setCycleSeconds] = useState(initial.cycleSeconds);

  // Pad initial to exactly MAX_SLIDES editor slots — empty slides are
  // dropped server-side on save.
  const padded: Slide[] = Array.from({ length: MAX_SLIDES }, (_, i) =>
    initial.slides[i] ?? blankSlide()
  );
  const [slides, setSlides] = useState<Slide[]>(padded);
  const [activeTab, setActiveTab] = useState(0);

  const productById = new Map(products.map((p) => [p.id, p]));
  const filledSlideIndices = slides
    .map((s, i) => (s.title.trim() ? i : -1))
    .filter((i) => i >= 0);

  function updateSlide(i: number, patch: Partial<Slide>) {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  }

  function clearSlide(i: number) {
    setSlides((prev) => prev.map((s, idx) => (idx === i ? blankSlide() : s)));
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(380px,460px)]">
      {/* Form */}
      <form action={formAction} className="space-y-5">
        {/* Hidden state for server action */}
        <input
          type="hidden"
          name="slides"
          value={JSON.stringify(slides.filter((s) => s.title.trim()))}
        />

        {/* Master controls — visibility + cycle speed */}
        <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            label="Master controls"
            hint="Toggle the whole slideshow on/off and set how long each slide stays on screen."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_minmax(0,1fr)]">
            <ActiveToggle checked={active} onChange={setActive} name="active" />
            <CycleSecondsPicker
              value={cycleSeconds}
              onChange={setCycleSeconds}
            />
          </div>
        </section>

        {/* Slide tabs */}
        <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            label="Slides"
            hint={`Up to ${MAX_SLIDES} slides cycle in order. Leave a slide empty to skip it.`}
          />

          <div className="mb-5 flex flex-wrap gap-2">
            {slides.map((slide, i) => {
              const isActive = i === activeTab;
              const isFilled = slide.title.trim().length > 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                    isActive
                      ? "border-wasro-blue bg-wasro-blue text-white shadow-md shadow-wasro-blue/25"
                      : "border-wasro-border bg-white text-wasro-charcoal hover:border-wasro-blue/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      isActive
                        ? "bg-white/25 text-white"
                        : isFilled
                          ? "bg-wasro-blue-light text-wasro-blue-dark"
                          : "bg-wasro-cream text-wasro-slate"
                    )}
                  >
                    {i + 1}
                  </span>
                  Slide {i + 1}
                  {isFilled && (
                    <span
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isActive ? "bg-emerald-300" : "bg-emerald-500"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <SlideForm
            slide={slides[activeTab]}
            slideIndex={activeTab}
            onChange={(patch) => updateSlide(activeTab, patch)}
            onClear={() => clearSlide(activeTab)}
            products={products}
            productById={productById}
          />
        </section>

        {/* Status + Save */}
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
                <span>
                  Saved. The hero now rotates through {state.slideCount} slide
                  {state.slideCount === 1 ? "" : "s"} every {cycleSeconds}s.
                </span>
              </div>
            )}
            {!state && (
              <p className="text-xs text-wasro-slate">
                {filledSlideIndices.length} of {MAX_SLIDES} slides filled.
                Save commits to storage and refreshes the live hero.
              </p>
            )}
          </div>
          <SaveButton />
        </div>

        {/* Hidden field for cycleSeconds — comes from the picker above */}
        <input type="hidden" name="cycleSeconds" value={cycleSeconds} />
      </form>

      {/* Live cycling preview */}
      <aside className="space-y-3 xl:sticky xl:top-24 xl:self-start">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-slate">
            Live preview
          </h2>
          <span className="text-[11px] text-wasro-slate/80">
            Cycles every {cycleSeconds}s
          </span>
        </div>
        <PreviewPanel
          slides={slides}
          active={active}
          cycleSeconds={cycleSeconds}
          productById={productById}
        />
        <p className="text-[11px] leading-relaxed text-wasro-slate">
          The banner shows what visitors see at the bottom of the home
          hero. The product image is what swaps into the hero&apos;s
          right column for the matching slide.
        </p>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slide form
// ---------------------------------------------------------------------------

function SlideForm({
  slide,
  slideIndex,
  onChange,
  onClear,
  products,
  productById,
}: {
  slide: Slide;
  slideIndex: number;
  onChange: (patch: Partial<Slide>) => void;
  onClear: () => void;
  products: Product[];
  productById: Map<string, Product>;
}) {
  const isEmpty = !slide.title.trim();
  const selectedProduct = slide.productId
    ? productById.get(slide.productId)
    : undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-wasro-slate">
          Slide {slideIndex + 1} content
        </p>
        {!isEmpty && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-semibold text-wasro-coral transition hover:bg-rose-50"
          >
            <Trash2 size={12} /> Clear slide
          </button>
        )}
      </div>

      <Field
        label="Badge"
        hint="Small chip at the top of the banner. Keep it short and shouty."
        value={slide.badge}
        onChange={(v) => onChange({ badge: v })}
        maxLength={30}
        placeholder="LIMITED TIME"
      />

      <Field
        label="Title"
        hint="The main offer line. Required to count as a real slide."
        value={slide.title}
        onChange={(v) => onChange({ title: v })}
        maxLength={140}
        placeholder="Buy a 2kg Wasro pack — get a free printed bucket."
        multiline
      />

      <Field
        label="Subtitle (optional)"
        hint="One-line supporting detail."
        value={slide.subtitle ?? ""}
        onChange={(v) => onChange({ subtitle: v })}
        maxLength={200}
        placeholder="Valid across all 150+ stores this month."
        multiline
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Field
          label="Button label (optional)"
          hint="Leave blank to hide the button."
          value={slide.ctaLabel ?? ""}
          onChange={(v) => onChange({ ctaLabel: v })}
          maxLength={30}
          placeholder="Shop now"
        />
        <Field
          label="Button link (optional)"
          hint="Site path (/products) or full https:// URL."
          value={slide.ctaHref ?? ""}
          onChange={(v) => onChange({ ctaHref: v })}
          maxLength={500}
          placeholder="/products"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <ProductPicker
          value={slide.productId ?? ""}
          onChange={(v) => onChange({ productId: v || undefined })}
          products={products}
          selectedProduct={selectedProduct}
        />
        <Field
          label="Valid until (optional)"
          hint="Shows 'ends DD MMM' next to the badge."
          value={slide.validUntil ?? ""}
          onChange={(v) => onChange({ validUntil: v })}
          maxLength={30}
          placeholder="2026-06-30"
          type="date"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live preview (auto-cycles like the real hero)
// ---------------------------------------------------------------------------

function PreviewPanel({
  slides,
  active,
  cycleSeconds,
  productById,
}: {
  slides: Slide[];
  active: boolean;
  cycleSeconds: number;
  productById: Map<string, Product>;
}) {
  const filled = slides.filter((s) => s.title.trim());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (filled.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((v) => (v + 1) % filled.length);
    }, Math.max(2000, cycleSeconds * 1000));
    return () => window.clearInterval(id);
  }, [active, filled.length, cycleSeconds]);

  useEffect(() => {
    if (index >= filled.length) setIndex(0);
  }, [filled.length, index]);

  if (!active) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-wasro-border bg-white/60 p-8 text-center text-sm text-wasro-slate">
        <EyeOff size={20} className="mx-auto mb-2 opacity-50" />
        Slideshow is off. Toggle it on in Master controls to preview.
      </div>
    );
  }

  if (filled.length === 0) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-wasro-border bg-white/60 p-8 text-center text-sm text-wasro-slate">
        Fill in at least one slide&apos;s title to preview.
      </div>
    );
  }

  const slide = filled[index] ?? filled[0];
  const product = slide.productId ? productById.get(slide.productId) : undefined;

  return (
    <div className="space-y-3 rounded-[1.25rem] border border-dashed border-wasro-border bg-gradient-to-br from-wasro-cream via-white to-wasro-blue-light/40 p-4 sm:p-6">
      {/* Product image preview */}
      {product && (
        <div className="relative mx-auto aspect-[4/5] w-40 overflow-hidden rounded-card bg-white shadow-md ring-1 ring-wasro-border/60">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-wasro-blue text-xs font-bold text-white">
              {product.size}
            </div>
          )}
        </div>
      )}

      {/* Banner preview */}
      <PreviewBanner slide={slide} />

      {/* Dots */}
      {filled.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {filled.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-wasro-blue" : "w-1.5 bg-wasro-border"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewBanner({ slide }: { slide: Slide }) {
  const hasCta = Boolean(slide.ctaLabel && slide.ctaHref);
  return (
    <div className="relative flex items-start gap-3 overflow-hidden rounded-2xl border border-wasro-border bg-white/85 p-3 pr-4 shadow-[0_2px_12px_-4px_rgba(15,66,117,0.10)] backdrop-blur sm:gap-4 sm:p-4">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(244,196,48,0.55), transparent 70%)",
        }}
      />
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wasro-yellow to-amber-500 text-wasro-charcoal shadow-sm sm:h-11 sm:w-11">
        <Sparkles size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col leading-snug">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {slide.badge && (
            <span className="rounded-pill bg-wasro-yellow/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-wasro-yellow-dark sm:text-[10px]">
              {slide.badge}
            </span>
          )}
          {slide.validUntil && (
            <span className="text-[10px] font-medium text-wasro-slate">
              ends{" "}
              {(() => {
                try {
                  return new Date(slide.validUntil).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short" }
                  );
                } catch {
                  return slide.validUntil;
                }
              })()}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-bold text-wasro-charcoal sm:text-base">
          {slide.title}
        </p>
        {slide.subtitle && (
          <p className="mt-1 text-xs leading-relaxed text-wasro-slate sm:text-sm">
            {slide.subtitle}
          </p>
        )}
      </div>
      {hasCta && (
        <span className="hidden shrink-0 self-center items-center gap-1.5 rounded-pill bg-wasro-blue px-3.5 py-2 text-xs font-bold text-white shadow-sm sm:inline-flex">
          {slide.ctaLabel}
          <ArrowRight size={12} />
        </span>
      )}
      {hasCta && (
        <span className="mt-0.5 flex h-9 w-9 shrink-0 self-center items-center justify-center rounded-full bg-wasro-blue text-white sm:hidden">
          <ArrowRight size={14} />
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared helpers (mostly inlined from the previous editor)
// ---------------------------------------------------------------------------

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

function ActiveToggle({
  checked,
  onChange,
  name,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  name: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-wasro-border bg-wasro-cream/60 p-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        id="offer-active"
      />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-wasro-blue" : "bg-wasro-border"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <label htmlFor="offer-active" className="flex-1 cursor-pointer">
        <span className="flex items-center gap-2 text-sm font-bold text-wasro-charcoal">
          {checked ? (
            <Eye size={14} className="text-emerald-600" />
          ) : (
            <EyeOff size={14} className="text-wasro-slate" />
          )}
          {checked ? "Slideshow is live" : "Slideshow is hidden"}
        </span>
        <span className="mt-0.5 block text-xs text-wasro-slate">
          {checked
            ? "Visitors see the rotating offer on the home hero."
            : "Hide without losing your saved slides."}
        </span>
      </label>
    </div>
  );
}

function CycleSecondsPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-card border border-wasro-border bg-wasro-cream/60 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-wasro-slate">
        Seconds per slide
      </p>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          min={MIN_CYCLE}
          max={MAX_CYCLE}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-wasro-border accent-wasro-blue"
        />
        <span className="inline-flex h-9 min-w-[3rem] items-center justify-center rounded-pill bg-wasro-blue px-2 text-sm font-bold text-white">
          {value}s
        </span>
      </div>
      <p className="mt-2 text-[11px] text-wasro-slate">
        Min {MIN_CYCLE}s, max {MAX_CYCLE}s. Default 4s.
      </p>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  maxLength,
  placeholder,
  type = "text",
  multiline = false,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={2}
          className="w-full rounded-card border border-wasro-border bg-white p-3 text-sm text-wasro-charcoal placeholder:text-wasro-slate/70 focus:border-wasro-blue focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
        />
      ) : (
        <input
          type={type}
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

function ProductPicker({
  value,
  onChange,
  products,
  selectedProduct,
}: {
  value: string;
  onChange: (v: string) => void;
  products: Product[];
  selectedProduct?: Product;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-bold uppercase tracking-wider text-wasro-slate">
        <span>Hero product image</span>
      </label>
      <div className="flex items-center gap-3">
        {/* Thumbnail of currently picked product */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-wasro-cream ring-1 ring-wasro-border">
          {selectedProduct?.imageUrl ? (
            <Image
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-wasro-slate">
              none
            </div>
          )}
        </div>
        {/* Native select for the choice */}
        <div className="relative flex-1">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-full appearance-none rounded-pill border border-wasro-border bg-white px-4 pr-10 text-sm text-wasro-charcoal focus:border-wasro-blue focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
          >
            <option value="">— Use default product (2kg pack) —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.size}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-wasro-slate"
          />
        </div>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-wasro-slate">
        Swaps into the hero&apos;s right column while this slide is active.
      </p>
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
          <Save size={16} /> Save slideshow
        </>
      )}
    </button>
  );
}

// Silence unused import warning — Plus is reserved for a future "add slide"
// affordance (we already render MAX_SLIDES tabs from the start).
void Plus;

function blankSlide(): Slide {
  return {
    badge: "",
    title: "",
    subtitle: "",
    ctaLabel: "",
    ctaHref: "",
    validUntil: "",
    productId: "",
  };
}
