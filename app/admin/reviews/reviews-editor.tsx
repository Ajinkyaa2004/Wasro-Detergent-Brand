"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Quote,
} from "lucide-react";
import {
  MAX_BODY_LEN,
  MAX_LOCATION_LEN,
  MAX_NAME_LEN,
  MAX_PRODUCT_LABEL_LEN,
  MAX_REVIEWS,
  MAX_TITLE_LEN,
  type Review,
} from "@/lib/reviews";
import { saveReviewsAction, type SaveState } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Reviews list editor. Each row is one testimonial card.
 *
 * Per-row UX:
 *   - Star slider (1–5)
 *   - Name + Location (the only identity required)
 *   - Optional title (becomes the bold headline on the card)
 *   - Body — the actual quote
 *   - Optional product label chip
 *   - Optional date (YYYY-MM-DD; helps with rich snippet eligibility)
 *   - Hide toggle for staging drafts before going public
 *
 * Empty (no name OR no body) rows are silently dropped on save.
 */
export function ReviewsEditor({ initial }: { initial: Review[] }) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveReviewsAction,
    undefined
  );

  const [reviews, setReviews] = useState<Review[]>(
    initial.length ? initial : [emptyReview()]
  );

  function update(i: number, patch: Partial<Review>) {
    setReviews((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    );
  }
  function remove(i: number) {
    setReviews((prev) => prev.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    setReviews((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function add() {
    if (reviews.length >= MAX_REVIEWS) return;
    setReviews((prev) => [...prev, emptyReview()]);
  }

  const canAdd = reviews.length < MAX_REVIEWS;
  const visibleCount = reviews.filter(
    (r) => r.name.trim() && r.body.trim() && !r.hidden
  ).length;
  const filledCount = reviews.filter(
    (r) => r.name.trim() && r.body.trim()
  ).length;
  const avgRating =
    filledCount === 0
      ? 0
      : reviews
          .filter((r) => r.name.trim() && r.body.trim() && !r.hidden)
          .reduce((acc, r) => acc + r.rating, 0) / Math.max(1, visibleCount);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,400px)]">
      <form action={formAction} className="space-y-5">
        <input
          type="hidden"
          name="reviews"
          value={JSON.stringify(
            reviews
              .map((r) => ({
                ...r,
                name: r.name.trim(),
                location: r.location.trim(),
                title: r.title?.trim() || undefined,
                body: r.body.trim(),
                productLabel: r.productLabel?.trim() || undefined,
                date: r.date?.trim() || undefined,
                hidden: r.hidden === true,
              }))
              .filter((r) => r.name && r.body)
          )}
        />

        <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
          <header className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
                Reviews
              </h2>
              <p className="mt-0.5 text-xs text-wasro-slate">
                First visible review becomes the spotlight card. Hide drafts
                without deleting them.
              </p>
            </div>
            <span
              className={cn(
                "inline-flex h-7 min-w-[3.5rem] items-center justify-center rounded-full px-2.5 text-xs font-bold",
                visibleCount >= MAX_REVIEWS
                  ? "bg-wasro-yellow/20 text-wasro-yellow-dark"
                  : "bg-wasro-blue-light text-wasro-blue-dark"
              )}
            >
              {visibleCount}/{MAX_REVIEWS}
            </span>
          </header>

          <ul className="space-y-3">
            {reviews.map((review, i) => (
              <li
                key={review.id || i}
                className={cn(
                  "rounded-2xl border border-wasro-border bg-white p-4 shadow-sm transition hover:border-wasro-blue/30 sm:p-5",
                  review.hidden && "opacity-60 ring-1 ring-amber-200"
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-wasro-blue-light px-2 text-xs font-bold text-wasro-blue-dark">
                      #{i + 1}
                    </span>
                    {review.hidden && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        <EyeOff size={10} /> Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => update(i, { hidden: !review.hidden })}
                      aria-label={review.hidden ? "Show on site" : "Hide from site"}
                      title={review.hidden ? "Show on site" : "Hide from site"}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-slate transition hover:bg-wasro-blue-light hover:text-wasro-blue-dark"
                    >
                      {review.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-slate transition hover:bg-wasro-blue-light hover:text-wasro-blue-dark disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === reviews.length - 1}
                      aria-label="Move down"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-slate transition hover:bg-wasro-blue-light hover:text-wasro-blue-dark disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      aria-label="Remove review"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-coral transition hover:bg-rose-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <RatingPicker
                    value={review.rating}
                    onChange={(v) => update(i, { rating: v })}
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label="Name"
                      value={review.name}
                      onChange={(v) => update(i, { name: v })}
                      maxLength={MAX_NAME_LEN}
                      placeholder="Priya Sharma"
                    />
                    <Field
                      label="Location"
                      value={review.location}
                      onChange={(v) => update(i, { location: v })}
                      maxLength={MAX_LOCATION_LEN}
                      placeholder="Guwahati, Assam"
                    />
                  </div>
                  <Field
                    label="Headline (optional)"
                    value={review.title ?? ""}
                    onChange={(v) => update(i, { title: v })}
                    maxLength={MAX_TITLE_LEN}
                    placeholder="Mug came free with the 1kg pack"
                  />
                  <Field
                    label="Review body"
                    value={review.body}
                    onChange={(v) => update(i, { body: v })}
                    maxLength={MAX_BODY_LEN}
                    placeholder="Switched from a national brand because of the free 1L mug — but stayed because the clothes actually smell fresher…"
                    multiline
                    rows={4}
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_minmax(140px,200px)]">
                    <Field
                      label="Product label (optional chip)"
                      value={review.productLabel ?? ""}
                      onChange={(v) => update(i, { productLabel: v })}
                      maxLength={MAX_PRODUCT_LABEL_LEN}
                      placeholder="Detergent Powder · 1kg"
                    />
                    <Field
                      label="Date (YYYY-MM-DD)"
                      value={review.date ?? ""}
                      onChange={(v) => update(i, { date: v })}
                      maxLength={10}
                      placeholder="2026-03-12"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={add}
            disabled={!canAdd}
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-pill border border-dashed px-4 py-2 text-sm font-bold transition",
              canAdd
                ? "border-wasro-blue text-wasro-blue hover:bg-wasro-blue hover:text-white"
                : "cursor-not-allowed border-wasro-border text-wasro-slate opacity-60"
            )}
          >
            <Plus size={14} />
            Add another review
          </button>
        </section>

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
                  Saved. The home page now shows {state.count} review
                  {state.count === 1 ? "" : "s"} (visible + hidden combined).
                </span>
              </div>
            )}
            {!state && (
              <p className="text-xs text-wasro-slate">
                {visibleCount} visible · {filledCount - visibleCount} hidden ·{" "}
                {avgRating ? avgRating.toFixed(1) : "—"}★ average
              </p>
            )}
          </div>
          <SaveButton />
        </div>
      </form>

      {/* Live preview pane — mirrors the home page section */}
      <aside className="space-y-3 xl:sticky xl:top-24 xl:self-start">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-slate">
            Live preview
          </h2>
          <span className="text-[11px] text-wasro-slate/80">
            Spotlight card
          </span>
        </div>
        <SpotlightPreview reviews={reviews} />
        <p className="text-[11px] leading-relaxed text-wasro-slate">
          The first visible review becomes the spotlight card on the home
          page. The next 4 become the supporting grid.
        </p>
      </aside>
    </div>
  );
}

function emptyReview(): Review {
  return {
    id: `r-new-${
      // Simple uniqueness: position-in-list will dedupe via the normalisation
      // step on save; this just keeps React keys unique while editing.
      Math.floor(performance.now() * 1000)
    }`,
    name: "",
    location: "",
    rating: 5,
    body: "",
  };
}

function RatingPicker({
  value,
  onChange,
}: {
  value: 1 | 2 | 3 | 4 | 5;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-wasro-slate">
        Rating
      </label>
      <div className="inline-flex items-center gap-1 rounded-pill bg-wasro-cream px-3 py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i as 1 | 2 | 3 | 4 | 5)}
            aria-label={`${i} star${i === 1 ? "" : "s"}`}
            className="rounded p-1 transition hover:scale-110"
          >
            <Star
              size={20}
              className={cn(
                i <= value
                  ? "fill-wasro-yellow text-wasro-yellow"
                  : "text-wasro-slate/30"
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-xs font-semibold text-wasro-charcoal">
          {value}/5
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  multiline,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="h-11 w-full rounded-pill border border-wasro-border bg-white px-4 text-sm text-wasro-charcoal placeholder:text-wasro-slate/70 focus:border-wasro-blue focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
        />
      )}
    </div>
  );
}

function SpotlightPreview({ reviews }: { reviews: Review[] }) {
  const spotlight = reviews.find((r) => r.name.trim() && r.body.trim() && !r.hidden);
  if (!spotlight) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-wasro-border bg-white/60 p-6 text-center text-xs text-wasro-slate">
        Fill in at least one visible review to see the spotlight card.
      </div>
    );
  }
  return (
    <article className="relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-wasro-blue to-wasro-blue-dark p-5 text-white shadow-xl ring-1 ring-white/10">
      <Quote size={32} className="text-white/15" aria-hidden />
      {spotlight.title && (
        <h3 className="mt-3 text-lg font-bold leading-tight">
          {spotlight.title}
        </h3>
      )}
      <p className="mt-3 text-sm leading-relaxed text-white/90">
        &ldquo;{spotlight.body}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            className={cn(
              i <= spotlight.rating
                ? "fill-wasro-yellow text-wasro-yellow"
                : "text-white/30"
            )}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3">
        <div>
          <div className="text-xs font-bold">{spotlight.name}</div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-white/80">
            <MapPin size={10} /> {spotlight.location || "—"}
          </div>
        </div>
        {spotlight.productLabel && (
          <span className="rounded-pill bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {spotlight.productLabel}
          </span>
        )}
      </div>
    </article>
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
          <Save size={16} /> Save reviews
        </>
      )}
    </button>
  );
}
