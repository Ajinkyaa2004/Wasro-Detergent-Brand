import Link from "next/link";
import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { CATEGORY_THEMES } from "@/lib/category-theme";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";

export function CategoryShowcaseHero() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <Reveal>
          <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-wasro-yellow-dark">
                <Sparkles size={12} /> Browse by category
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-wasro-charcoal md:text-4xl">
                Built for every home.
              </h2>
            </div>
            <p className="max-w-md text-sm text-wasro-slate md:text-right">
              Each Wasro product line is built for a specific household
              cleaning job — from clothes to dishes to delicate stains.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const theme = CATEGORY_THEMES[cat.id];
            const items = PRODUCTS.filter((p) => p.category === cat.id);
            const pricedItems = items
              .map((p) => p.mrp)
              .filter((v): v is number => typeof v === "number");
            const startingPrice = pricedItems.length
              ? Math.min(...pricedItems)
              : null;
            const hasGifts = items.some((p) => p.offer);
            return (
              <Reveal key={cat.id} delay={i * 0.08}>
                <TiltCard intensity={6}>
                  <Link
                    href={`/products#${cat.id}`}
                    className={cn(
                      "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-gradient-to-br p-6 ring-1 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
                      theme.cardGradient,
                      theme.accentRing,
                      theme.shadowColor
                    )}
                  >
                    {/* Decorative corner blob */}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50",
                        theme.iconGradient
                      )}
                    />

                    {/* Shine sweep on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-18deg] opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                    />

                    <div className="relative flex h-full flex-col">
                      {/* Icon bubble */}
                      <div
                        className={cn(
                          "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                          theme.iconGradient
                        )}
                      >
                        {theme.emoji}
                      </div>

                      <h3 className="text-2xl font-bold leading-tight text-wasro-charcoal">
                        {cat.label}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-wasro-slate">
                        {cat.description}
                      </p>

                      {/* Stats row */}
                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-wasro-border/60 pt-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-wasro-slate">
                            Variants
                          </div>
                          <div
                            className={cn(
                              "text-xl font-bold",
                              theme.accentText
                            )}
                          >
                            {items.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-wasro-slate">
                            {startingPrice != null ? "From" : "Price"}
                          </div>
                          <div
                            className={cn(
                              "text-base font-bold leading-tight sm:text-xl",
                              theme.accentText
                            )}
                          >
                            {startingPrice != null
                              ? `₹${startingPrice}`
                              : "Coming soon"}
                          </div>
                        </div>
                      </div>

                      {/* Free gift indicator */}
                      {hasGifts && (
                        <div
                          className={cn(
                            "mt-4 inline-flex items-center gap-1.5 self-start rounded-pill bg-white/80 px-3 py-1.5 text-xs font-semibold backdrop-blur",
                            theme.accentText
                          )}
                        >
                          <Gift size={12} /> Free gifts inside
                        </div>
                      )}

                      <div
                        className={cn(
                          "mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold transition-all group-hover:gap-3",
                          theme.accentText
                        )}
                      >
                        Explore {cat.label.toLowerCase()} <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
