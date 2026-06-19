import { Gift, Tag, Package } from "lucide-react";
import {
  CATEGORIES,
  type Product,
} from "@/data/products";
import { CATEGORY_THEMES } from "@/lib/category-theme";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { ProductCard } from "@/components/ui/product-card";
import { cn } from "@/lib/utils";

type Cat = (typeof CATEGORIES)[number];

export function CategorySection({
  category,
  products,
}: {
  category: Cat;
  products: Product[];
}) {
  const theme = CATEGORY_THEMES[category.id];
  // Filter out null prices before finding the minimum — otherwise
  // Math.min would return NaN if any product hasn't been priced yet.
  const pricedItems = products
    .map((p) => p.mrp)
    .filter((v): v is number => typeof v === "number");
  const startingPrice = pricedItems.length ? Math.min(...pricedItems) : null;
  const giftCount = products.filter((p) => p.offer).length;

  return (
    <section
      id={category.id}
      className={cn(
        // `scroll-mt-24` clears the fixed 80px navbar + a small comfort
        // gap. Was `scroll-mt-32` to also clear the sticky pill nav,
        // which is now removed.
        "scroll-mt-24 relative overflow-hidden",
        theme.tintBg
      )}
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        {/* Big section header */}
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left: icon + title + description */}
            <div className="flex items-start gap-5">
              <div
                className={cn(
                  "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-4xl text-white shadow-2xl",
                  theme.iconGradient
                )}
              >
                {theme.emoji}
              </div>
              <div>
                <span
                  className={cn(
                    "text-xs font-bold uppercase tracking-[0.22em]",
                    theme.accentText
                  )}
                >
                  Category {String(
                    CATEGORIES.findIndex((c) => c.id === category.id) + 1
                  ).padStart(2, "0")} / 04
                </span>
                <h2 className="mt-2 text-3xl font-bold leading-tight text-wasro-charcoal md:text-5xl">
                  {category.label}
                </h2>
                <p className="mt-3 max-w-xl text-wasro-slate">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Right: stats badges */}
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <Badge
                icon={Package}
                value={products.length.toString()}
                label="variants"
                themeText={theme.accentText}
              />
              {/* Only show the starting-price badge when at least one
                  product in the category has a published MRP. */}
              {startingPrice != null && (
                <Badge
                  icon={Tag}
                  value={`₹${startingPrice}`}
                  label="starting at"
                  themeText={theme.accentText}
                />
              )}
              {giftCount > 0 && (
                <Badge
                  icon={Gift}
                  value={`${giftCount}`}
                  label={giftCount === 1 ? "with gift" : "with gifts"}
                  themeText={theme.accentText}
                  highlight
                />
              )}
            </div>
          </div>
        </Reveal>

        {/* Decorative accent line under header */}
        <Reveal delay={0.1}>
          <div
            className={cn(
              "mb-12 h-1 w-24 rounded-full",
              theme.iconGradient
            )}
          />
        </Reveal>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <TiltCard intensity={5}>
                <ProductCard product={p} />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Badge({
  icon: Icon,
  value,
  label,
  themeText,
  highlight,
}: {
  icon: typeof Gift;
  value: string;
  label: string;
  themeText: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition",
        highlight
          ? "bg-wasro-yellow/90 ring-wasro-yellow shadow-md"
          : "bg-white ring-wasro-border"
      )}
    >
      <Icon
        size={18}
        className={highlight ? "text-wasro-charcoal" : themeText}
      />
      <div className="leading-tight">
        <div
          className={cn(
            "text-lg font-bold",
            highlight ? "text-wasro-charcoal" : "text-wasro-charcoal"
          )}
        >
          {value}
        </div>
        <div
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            highlight ? "text-wasro-charcoal/75" : "text-wasro-slate"
          )}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
