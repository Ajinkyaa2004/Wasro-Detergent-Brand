"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  X,
  Plus,
  GripVertical,
} from "lucide-react";
import { MAX_HEADLINES, MAX_HEADLINE_LENGTH } from "@/lib/headlines";
import { saveHeadlinesAction, type SaveState } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Editor for the rotating headlines.
 *
 * Tied closely to the home-hero <CyclingHeadline /> component:
 *   - Order matters (controls cycle sequence)
 *   - Each item capped at MAX_HEADLINE_LENGTH so the longest-word
 *     width-reservation in CyclingHeadline stays sane
 *   - MAX_HEADLINES = 6 — beyond that each line is shown too rarely
 */
export function HeadlinesEditor({ initial }: { initial: string[] }) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveHeadlinesAction,
    undefined
  );

  const [items, setItems] = useState<string[]>(initial);
  const [previewIdx, setPreviewIdx] = useState(0);

  // Demo cycle in the preview pane so admins see what the live hero will do
  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setPreviewIdx((v) => (v + 1) % items.length);
    }, 2600);
    return () => clearInterval(id);
  }, [items]);

  function update(i: number, value: string) {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? value.slice(0, MAX_HEADLINE_LENGTH) : item))
    );
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    setPreviewIdx(0);
  }
  function add() {
    if (items.length >= MAX_HEADLINES) return;
    setItems((prev) => [...prev, ""]);
  }

  const canAdd = items.length < MAX_HEADLINES;
  const filledCount = items.filter((s) => s.trim().length > 0).length;
  // Longest current word — used to size the preview line so it doesn't jump
  const longest = items.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
      {/* Form */}
      <form action={formAction} className="space-y-5">
        <input
          type="hidden"
          name="headlines"
          value={JSON.stringify(items.map((s) => s.trim()).filter(Boolean))}
        />

        <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
          <header className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
                Headline words
              </h2>
              <p className="mt-0.5 text-xs text-wasro-slate">
                Order top → bottom is the cycle order. Drag handle is decorative.
              </p>
            </div>
            <span
              className={cn(
                "inline-flex h-7 min-w-[3.5rem] items-center justify-center rounded-full px-2.5 text-xs font-bold",
                filledCount >= MAX_HEADLINES
                  ? "bg-wasro-yellow/20 text-wasro-yellow-dark"
                  : "bg-wasro-blue-light text-wasro-blue-dark"
              )}
            >
              {filledCount}/{MAX_HEADLINES}
            </span>
          </header>

          <ul className="space-y-2.5">
            {items.map((value, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-2xl border border-wasro-border bg-white p-2 transition hover:border-wasro-blue/30 sm:gap-3 sm:p-2.5"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-wasro-cream text-wasro-slate"
                >
                  <GripVertical size={14} />
                </span>
                <span className="flex h-9 w-7 shrink-0 items-center justify-center text-xs font-bold text-wasro-slate">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => update(i, e.target.value)}
                  maxLength={MAX_HEADLINE_LENGTH}
                  placeholder="e.g. Honest pricing."
                  className="h-10 min-w-0 flex-1 rounded-pill border border-wasro-border bg-wasro-cream/50 px-4 text-sm font-semibold text-wasro-charcoal placeholder:font-normal placeholder:text-wasro-slate/70 focus:border-wasro-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
                />
                <span className="hidden w-12 shrink-0 text-right text-[10px] font-medium text-wasro-slate sm:inline">
                  {value.length}/{MAX_HEADLINE_LENGTH}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove headline"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-wasro-coral transition hover:bg-rose-50"
                >
                  <X size={14} />
                </button>
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
            Add another word
          </button>
        </section>

        {/* Status + Save */}
        <div className="flex flex-col gap-3 rounded-[1.25rem] border border-wasro-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
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
                  Saved. The hero now cycles through {state.count} words.
                </span>
              </div>
            )}
            {!state && (
              <p className="text-xs text-wasro-slate">
                Save commits the list to storage and refreshes the live hero.
              </p>
            )}
          </div>
          <SaveButton disabled={filledCount === 0} />
        </div>
      </form>

      {/* Live preview */}
      <aside className="space-y-3 xl:sticky xl:top-24 xl:self-start">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-slate">
            Live preview
          </h2>
          <span className="text-[11px] text-wasro-slate/80">Cycles every 2.6s</span>
        </div>
        <div className="rounded-[1.25rem] border border-dashed border-wasro-border bg-gradient-to-br from-wasro-cream via-white to-wasro-blue-light/40 p-6">
          {filledCount === 0 ? (
            <div className="rounded-2xl border border-dashed border-wasro-border bg-white/60 p-6 text-center text-sm text-wasro-slate">
              Add at least one headline word.
            </div>
          ) : (
            <p className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight tracking-tight text-wasro-charcoal">
              <span className="relative inline-block align-bottom">
                <span aria-hidden className="invisible">
                  {longest}
                </span>
                <span className="absolute inset-0 text-wasro-blue transition-opacity duration-500">
                  {items.filter(Boolean)[previewIdx % filledCount] ?? ""}
                </span>
              </span>
              <br />
              For every Indian home.
            </p>
          )}
        </div>
        <p className="text-[11px] leading-relaxed text-wasro-slate">
          This mirrors the cycling word inside the home hero. The
          surrounding text (&quot;For every Indian home.&quot;) stays the
          same and isn&apos;t editable here.
        </p>
      </aside>
    </div>
  );
}

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-pill bg-wasro-blue px-7 text-sm font-bold text-white shadow-md shadow-wasro-blue/25 transition hover:-translate-y-0.5 hover:bg-wasro-blue-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Save size={16} /> Save headlines
        </>
      )}
    </button>
  );
}
