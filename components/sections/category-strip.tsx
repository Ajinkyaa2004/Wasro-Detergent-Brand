import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/products";

const ICONS: Record<string, string> = {
  "detergent-powder": "🧺",
  "dishwash-bar": "🍽️",
  "dishwash-tub": "🫧",
  "clothwash-bar": "👕",
};

export function CategoryStrip() {
  return (
    <section className="border-y border-wasro-border bg-white">
      {/* sr-only section heading — fixes the h1→h3 hierarchy skip (the
          hero's h1 was followed directly by these category h3s) without
          altering the compact strip's visual design. */}
      <h2 className="sr-only">Shop Wasro by category</h2>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-wasro-border md:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const count = PRODUCTS.filter((p) => p.category === cat.id).length;
          return (
            <Link
              key={cat.id}
              href={`/products#${cat.id}`}
              className="group flex items-center justify-between gap-4 bg-white px-5 py-6 transition hover:bg-wasro-cream"
            >
              <div>
                <div className="mb-1 text-2xl">{ICONS[cat.id]}</div>
                <h3 className="text-sm font-semibold text-wasro-charcoal">
                  {cat.label}
                </h3>
                <p className="text-xs text-wasro-slate">{count} variants</p>
              </div>
              <ArrowRight
                size={16}
                className="text-wasro-blue opacity-0 transition group-hover:opacity-100"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
