"use client";

import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { CATEGORY_THEMES } from "@/lib/category-theme";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function CategoryPillNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Track which section is most in view
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    CATEGORIES.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    // Sticky bar — `backdrop-blur-2xl` + `backdrop-saturate-150` on a
    // scroll-sticky element is one of the most expensive paint patterns on
    // mobile. Dropped to `blur-md` (or nothing on mobile) and bumped the
    // background opacity to compensate. Functionally identical.
    <div className="sticky top-20 z-40 -mx-5 border-y border-wasro-border bg-white/95 px-5 py-3 md:-mx-8 md:bg-white/75 md:px-8 md:backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const theme = CATEGORY_THEMES[cat.id];
          const items = PRODUCTS.filter((p) => p.category === cat.id);
          const isActive = active === cat.id;
          return (
            <Link
              key={cat.id}
              href={`#${cat.id}`}
              className={cn(
                "group inline-flex shrink-0 items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "border-transparent bg-wasro-charcoal text-white shadow-md"
                  : "border-wasro-border bg-white text-wasro-charcoal hover:-translate-y-0.5 hover:border-wasro-blue/40"
              )}
            >
              <span className="text-base">{theme.emoji}</span>
              <span>{cat.label}</span>
              <span
                className={cn(
                  "rounded-pill px-2 py-0.5 text-[10px] font-bold",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-wasro-cream-dark text-wasro-charcoal"
                )}
              >
                {items.length}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
