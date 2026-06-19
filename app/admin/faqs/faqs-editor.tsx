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
} from "lucide-react";
import {
  MAX_ANSWER_LEN,
  MAX_FAQS,
  MAX_QUESTION_LEN,
  type FaqEntry,
} from "@/lib/faqs";
import { saveFaqsAction, type SaveState } from "./actions";
import { cn } from "@/lib/utils";

/**
 * FAQ list editor.
 *
 * Pattern:
 *   - Each FAQ is a card with Q + A fields, an up/down/remove control row
 *   - "Add FAQ" button appends an empty card (capped at MAX_FAQS)
 *   - Empty cards are silently dropped on save
 *   - Hidden JSON field keeps the server action validation simple
 */
export function FaqsEditor({ initial }: { initial: FaqEntry[] }) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveFaqsAction,
    undefined
  );

  // Start with at least one row so the page isn't blank if storage is empty
  const [faqs, setFaqs] = useState<FaqEntry[]>(
    initial.length ? initial : [{ q: "", a: "" }]
  );

  function update(i: number, patch: Partial<FaqEntry>) {
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }
  function remove(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    setFaqs((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function add() {
    if (faqs.length >= MAX_FAQS) return;
    setFaqs((prev) => [...prev, { q: "", a: "" }]);
  }

  const canAdd = faqs.length < MAX_FAQS;
  const filledCount = faqs.filter(
    (f) => f.q.trim() && f.a.trim()
  ).length;

  return (
    // 2-column on xl+; stacked on smaller screens
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,400px)]">
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="faqs"
        value={JSON.stringify(
          faqs.map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q && f.a)
        )}
      />

      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <header className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
              Questions &amp; answers
            </h2>
            <p className="mt-0.5 text-xs text-wasro-slate">
              Order top → bottom. Empty rows are skipped automatically.
            </p>
          </div>
          <span
            className={cn(
              "inline-flex h-7 min-w-[3.5rem] items-center justify-center rounded-full px-2.5 text-xs font-bold",
              filledCount >= MAX_FAQS
                ? "bg-wasro-yellow/20 text-wasro-yellow-dark"
                : "bg-wasro-blue-light text-wasro-blue-dark"
            )}
          >
            {filledCount}/{MAX_FAQS}
          </span>
        </header>

        <ul className="space-y-3">
          {faqs.map((faq, i) => (
            <li
              key={i}
              className="rounded-2xl border border-wasro-border bg-white p-4 shadow-sm transition hover:border-wasro-blue/30 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-wasro-blue-light px-2 text-xs font-bold text-wasro-blue-dark">
                  Q{i + 1}
                </span>
                <div className="flex items-center gap-1">
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
                    disabled={i === faqs.length - 1}
                    aria-label="Move down"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-slate transition hover:bg-wasro-blue-light hover:text-wasro-blue-dark disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Remove"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-coral transition hover:bg-rose-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Field
                  label="Question"
                  value={faq.q}
                  onChange={(v) => update(i, { q: v })}
                  maxLength={MAX_QUESTION_LEN}
                  placeholder="Where can I buy Wasro?"
                />
                <Field
                  label="Answer"
                  value={faq.a}
                  onChange={(v) => update(i, { a: v })}
                  maxLength={MAX_ANSWER_LEN}
                  placeholder="Across 121+ retail stores in Assam, Meghalaya…"
                  multiline
                  rows={4}
                />
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
          Add another FAQ
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
                Saved. The About page now shows {state.count} FAQ
                {state.count === 1 ? "" : "s"}.
              </span>
            </div>
          )}
          {!state && (
            <p className="text-xs text-wasro-slate">
              {filledCount} of {MAX_FAQS} filled. Empty rows are skipped.
            </p>
          )}
        </div>
        <SaveButton disabled={filledCount === 0} />
      </div>
    </form>

    {/* Live preview pane — mirrors the About page accordion */}
    <aside className="space-y-3 xl:sticky xl:top-24 xl:self-start">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-slate">
          Live preview
        </h2>
        <span className="text-[11px] text-wasro-slate/80">
          As shown on About
        </span>
      </div>
      <FaqsPreview faqs={faqs} />
      <p className="text-[11px] leading-relaxed text-wasro-slate">
        Click any question to expand its answer — same accordion as the
        live About page. Empty Q/A pairs are skipped here too.
      </p>
    </aside>
    </div>
  );
}

function FaqsPreview({ faqs }: { faqs: FaqEntry[] }) {
  const filled = faqs.filter((f) => f.q.trim() && f.a.trim());
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-wasro-border bg-wasro-cream-dark/40 p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 text-sm font-bold text-wasro-charcoal">
        Frequently asked questions
      </h3>
      {filled.length === 0 ? (
        <div className="rounded-card border border-dashed border-wasro-border bg-white/60 p-6 text-center text-xs text-wasro-slate">
          Fill in at least one full Q + A pair to preview.
        </div>
      ) : (
        <div className="space-y-2">
          {filled.map((f, i) => (
            <details
              key={i}
              open={i === 0}
              className="group rounded-card border border-wasro-border bg-white open:border-wasro-blue/30 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold text-wasro-charcoal marker:hidden sm:text-sm">
                {f.q}
                <span className="float-right inline-block text-lg font-light leading-none text-wasro-blue transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-[11px] leading-relaxed text-wasro-slate sm:text-xs">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      )}
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
          <Save size={16} /> Save FAQs
        </>
      )}
    </button>
  );
}
