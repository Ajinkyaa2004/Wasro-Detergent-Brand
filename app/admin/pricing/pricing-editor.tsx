"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  RotateCcw,
} from "lucide-react";
import type { Product, ProductCategory } from "@/data/products";
import type { PriceOverrides } from "@/lib/product-prices";
import { savePricesAction, type SaveState } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Per-product MRP editor.
 *
 * Layout: products grouped by category, each row showing the SKU + size
 * with a single ₹ input. The placeholder shows the data-file default
 * (or "—" if there's no default), and the current value is the admin
 * override if one is saved.
 *
 * Empty value = clear the override (revert to data-file default).
 */

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "detergent-powder": "Detergent Powder",
  "dishwash-bar": "Dishwash Bar",
  "dishwash-tub": "Dishwash Tub",
  "clothwash-bar": "Clothwash Bar",
};

const CATEGORY_ORDER: ProductCategory[] = [
  "detergent-powder",
  "dishwash-bar",
  "dishwash-tub",
  "clothwash-bar",
];

export function PricingEditor({
  products,
  initialOverrides,
}: {
  products: Product[];
  initialOverrides: PriceOverrides;
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(
    savePricesAction,
    undefined
  );

  // Per-input string state. Empty string = "no override" (use data-file default).
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of products) {
      init[p.id] =
        initialOverrides[p.id] !== undefined
          ? String(initialOverrides[p.id])
          : "";
    }
    return init;
  });

  function setValue(id: string, v: string) {
    // Strip non-digits — admin enters whole rupees only
    const cleaned = v.replace(/[^\d]/g, "");
    setValues((prev) => ({ ...prev, [id]: cleaned }));
  }

  function clearAll() {
    const empty: Record<string, string> = {};
    for (const p of products) empty[p.id] = "";
    setValues(empty);
  }

  // Build payload for the server action — only includes non-empty values
  // because the action treats empty / missing keys as "clear override".
  const payload: Record<string, number | string> = {};
  for (const [id, v] of Object.entries(values)) {
    payload[id] = v === "" ? "" : Number(v);
  }

  const overrideCount = Object.values(values).filter(
    (v) => v.trim() !== ""
  ).length;

  // Group products by category
  const byCategory = new Map<ProductCategory, Product[]>();
  for (const cat of CATEGORY_ORDER) byCategory.set(cat, []);
  for (const p of products) byCategory.get(p.category)?.push(p);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="prices" value={JSON.stringify(payload)} />

      {/* Status summary at the top */}
      <div className="rounded-card border border-wasro-border bg-wasro-cream/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-wasro-blue">
              {overrideCount} admin override
              {overrideCount === 1 ? "" : "s"}
            </p>
            <p className="mt-0.5 text-xs text-wasro-slate">
              Out of {products.length} total SKUs. Blank inputs use the
              data-file default or show &quot;Price coming soon&quot;.
            </p>
          </div>
          {overrideCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-pill border border-wasro-border bg-white px-3 py-1.5 text-xs font-semibold text-wasro-coral transition hover:bg-rose-50"
            >
              <RotateCcw size={12} /> Clear all overrides
            </button>
          )}
        </div>
      </div>

      {/* Per-category sections */}
      {CATEGORY_ORDER.map((cat) => {
        const items = byCategory.get(cat) ?? [];
        if (items.length === 0) return null;
        return (
          <section
            key={cat}
            className="rounded-[1.25rem] border border-wasro-border bg-white p-5 shadow-sm sm:p-6"
          >
            <header className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
                {CATEGORY_LABELS[cat]}
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                {items.length} SKU{items.length === 1 ? "" : "s"}
              </span>
            </header>

            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items.map((p) => (
                <PriceRow
                  key={p.id}
                  product={p}
                  value={values[p.id] ?? ""}
                  onChange={(v) => setValue(p.id, v)}
                />
              ))}
            </ul>
          </section>
        );
      })}

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
              <span>
                Saved. {state.setCount} override{state.setCount === 1 ? "" : "s"}{" "}
                live
                {state.clearedCount > 0
                  ? `, ${state.clearedCount} row${state.clearedCount === 1 ? "" : "s"} reset to default`
                  : ""}
                .
              </span>
            </div>
          )}
          {!state && (
            <p className="text-xs text-wasro-slate">
              Edit any price → Save. Changes reflect across home / products
              / stain-guide instantly.
            </p>
          )}
        </div>
        <SaveButton />
      </div>
    </form>
  );
}

function PriceRow({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string;
  onChange: (v: string) => void;
}) {
  const defaultLabel =
    product.mrp != null ? `Default: ₹${product.mrp}` : "No default";
  const hasOverride = value !== "";

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-wasro-border bg-wasro-cream/30 p-3">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-sm font-bold text-wasro-charcoal">
          {product.name}
        </p>
        <p className="text-xs text-wasro-slate">
          {product.size} · {defaultLabel}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-sm font-bold text-wasro-slate">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={product.mrp != null ? String(product.mrp) : "—"}
          maxLength={6}
          className={cn(
            "h-10 w-20 rounded-pill border bg-white px-3 text-center text-sm font-bold tabular-nums focus:outline-none focus:ring-2",
            hasOverride
              ? "border-wasro-blue text-wasro-blue focus:ring-wasro-blue/30"
              : "border-wasro-border text-wasro-charcoal focus:border-wasro-blue focus:ring-wasro-blue/20"
          )}
        />
      </div>
    </li>
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
          <Save size={16} /> Save all prices
        </>
      )}
    </button>
  );
}
