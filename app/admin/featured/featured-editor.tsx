"use client";

import { useActionState, useMemo, useState } from "react";
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
import type { Product } from "@/data/products";
import { MAX_FEATURED } from "@/lib/featured";
import { saveFeaturedAction, type SaveState } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Featured-products picker.
 *
 * UI model:
 *   - Top panel  → currently selected (ordered) list with reorder + remove
 *   - Bottom    → all available products (greyed when selected) — tap to add
 *
 * The hidden `ids` form field is updated on every change so the server
 * action receives a clean JSON-encoded ordered array on submit.
 */
export function FeaturedEditor({
  products,
  initial,
}: {
  products: Product[];
  initial: string[];
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveFeaturedAction,
    undefined
  );

  const [selected, setSelected] = useState<string[]>(initial);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  const remaining = useMemo(
    () => products.filter((p) => !selected.includes(p.id)),
    [products, selected]
  );

  function add(id: string) {
    if (selected.includes(id) || selected.length >= MAX_FEATURED) return;
    setSelected((prev) => [...prev, id]);
  }
  function remove(id: string) {
    setSelected((prev) => prev.filter((x) => x !== id));
  }
  function move(idx: number, dir: -1 | 1) {
    setSelected((prev) => {
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  const isFull = selected.length >= MAX_FEATURED;
  const isEmpty = selected.length === 0;

  return (
    <form action={formAction} className="space-y-6">
      {/* Server gets the canonical ordered list as JSON */}
      <input type="hidden" name="ids" value={JSON.stringify(selected)} />

      {/* Selected list */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <header className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
              Currently featured
            </h2>
            <p className="mt-0.5 text-xs text-wasro-slate">
              Order top → bottom. Max {MAX_FEATURED} products.
            </p>
          </div>
          <span
            className={cn(
              "inline-flex h-7 min-w-[3.5rem] items-center justify-center rounded-full px-2.5 text-xs font-bold",
              isFull
                ? "bg-wasro-yellow/20 text-wasro-yellow-dark"
                : "bg-wasro-blue-light text-wasro-blue-dark"
            )}
          >
            {selected.length}/{MAX_FEATURED}
          </span>
        </header>

        {isEmpty ? (
          <div className="rounded-xl border-2 border-dashed border-wasro-border bg-wasro-cream/40 p-8 text-center text-sm text-wasro-slate">
            No products selected yet. Pick up to {MAX_FEATURED} from the list
            below.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {selected.map((id, idx) => {
              const p = productById.get(id);
              if (!p) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-2xl border border-wasro-border bg-gradient-to-br from-wasro-cream/60 to-white p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-wasro-blue text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-wasro-charcoal">
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-wasro-slate">
                      {p.size}
                      {p.mrp != null ? ` · ₹${p.mrp}` : " · Price TBD"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-slate transition hover:bg-wasro-blue-light hover:text-wasro-blue-dark disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === selected.length - 1}
                      aria-label="Move down"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-slate transition hover:bg-wasro-blue-light hover:text-wasro-blue-dark disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(id)}
                      aria-label="Remove"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-wasro-coral transition hover:bg-rose-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* All products to add */}
      <section className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6">
        <header className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
            All products
          </h2>
          <p className="mt-0.5 text-xs text-wasro-slate">
            Tap any product to add it to the featured list.
            {isFull && (
              <span className="ml-2 font-semibold text-wasro-yellow-dark">
                Remove one from above first.
              </span>
            )}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.length === 0 ? (
            <p className="col-span-full rounded-xl bg-wasro-cream/40 p-6 text-center text-sm text-wasro-slate">
              All products are featured. Remove one above to add another.
            </p>
          ) : (
            remaining.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p.id)}
                disabled={isFull}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border border-wasro-border bg-white p-3 text-left transition-all duration-200",
                  isFull
                    ? "cursor-not-allowed opacity-50"
                    : "hover:-translate-y-0.5 hover:border-wasro-blue/40 hover:shadow-md active:scale-[0.98]"
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-wasro-cream text-wasro-slate transition-colors group-hover:bg-wasro-blue group-hover:text-white">
                  <Plus size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-wasro-charcoal">
                    {p.name}
                  </p>
                  <p className="truncate text-xs text-wasro-slate">
                    {p.size} · ₹{p.mrp}
                    {p.offer ? ` · ${p.offer}` : ""}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Save bar — sticky at bottom of viewport on small screens for thumb reach */}
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
                Saved. {state.count} product
                {state.count === 1 ? "" : "s"} now featured on the home.
              </span>
            </div>
          )}
          {!state && (
            <p className="text-xs text-wasro-slate">
              Selection changes here don&apos;t go live until you save.
            </p>
          )}
        </div>
        <SaveButton disabled={isEmpty} />
      </div>
    </form>
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
          <Save size={16} /> Save featured list
        </>
      )}
    </button>
  );
}
