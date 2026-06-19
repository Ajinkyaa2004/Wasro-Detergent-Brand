"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/data/products";
import type { Slide } from "@/lib/offer";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/utils";

/**
 * Resolved slide = the admin's stored slide + the live Product object
 * (with image URL) that the server resolved from `slide.productId`.
 */
export type ResolvedSlide = Slide & { product: Product };

type SlideshowState = {
  index: number;
  slides: ResolvedSlide[];
  active: boolean;
};

const Ctx = createContext<SlideshowState | null>(null);

/**
 * Provider — owns the slideshow index state and the auto-cycle timer.
 * Wraps the parts of the hero that need to coordinate (offer banner on
 * the left + product image on the right both render the slide at the
 * same index).
 */
export function HeroSlideshowProvider({
  slides,
  active,
  cycleSeconds,
  fallbackProduct,
  children,
}: {
  slides: ResolvedSlide[];
  active: boolean;
  cycleSeconds: number;
  /** Used by HeroCyclingProduct when there's no offer / no slides. */
  fallbackProduct: Product;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);

  // Auto-cycle CONTINUOUSLY. Never pauses on hover. Skips only when:
  //   - the slideshow is hidden by the admin (active=false)
  //   - there's only one slide (nothing to cycle to)
  //   - user prefers reduced motion (accessibility — system-level
  //     setting, not a casual UI preference)
  useEffect(() => {
    if (!active) return;
    if (slides.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const ms = Math.max(2000, Math.min(10000, cycleSeconds * 1000));
    const id = window.setInterval(() => {
      setIndex((v) => (v + 1) % slides.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [active, slides.length, cycleSeconds]);

  // Whenever the source slide list changes (admin saves), restart at 0
  // so stale indices don't render garbage.
  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  // Augment the slides we render with the fallback product if a slide
  // didn't specify one. Kept here so consumers don't have to repeat the
  // ?? fallback logic.
  const resolved = slides.map<ResolvedSlide>((s) => ({
    ...s,
    product: s.product ?? fallbackProduct,
  }));

  const value: SlideshowState = {
    index,
    slides: resolved,
    active,
  };

  // No wrapper div needed now that we don't pause on hover. Context-only.
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useSlideshow(): SlideshowState {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("Hero slideshow component used outside <HeroSlideshowProvider>");
  }
  return v;
}

// ---------------------------------------------------------------------------
// Cycling offer banner (left column)
// ---------------------------------------------------------------------------

/**
 * Replaces the old single-render HeroOfferBanner. Renders ALL slides
 * stacked in the same grid cell — only one is opacity-1 at a time, the
 * rest crossfade behind it. Grid container sizes to the tallest slide
 * so the layout never shifts as content changes.
 */
export function HeroCyclingOfferBanner() {
  const { slides, index, active } = useSlideshow();
  if (!active || slides.length === 0) return null;

  return (
    <div className="relative">
      {/* All slides occupy the same grid cell; container sizes to the
          tallest. Opacity crossfade between them. */}
      <div className="grid">
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-500 ease-out",
              i === index
                ? "z-10 opacity-100"
                : "z-0 pointer-events-none opacity-0"
            )}
          >
            <OfferCard slide={slide} />
          </div>
        ))}
      </div>

      {/* Pagination dots — only shown if there's more than one slide */}
      {slides.length > 1 && <SlideDots count={slides.length} active={index} />}
    </div>
  );
}

function OfferCard({ slide }: { slide: ResolvedSlide }) {
  const hasCta = Boolean(slide.ctaLabel && slide.ctaHref);
  const body = <OfferBody slide={slide} hasCta={hasCta} />;

  if (hasCta) {
    return (
      <Link
        href={slide.ctaHref!}
        aria-label={`${slide.title}. ${slide.ctaLabel}`}
        className={cn(
          "group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-wasro-border bg-white/85 p-3 pr-4 shadow-[0_2px_12px_-4px_rgba(15,66,117,0.10)] backdrop-blur transition-all duration-300 sm:gap-4 sm:p-4",
          "hover:-translate-y-0.5 hover:border-wasro-blue/40 hover:shadow-[0_8px_28px_-10px_rgba(15,66,117,0.20)]"
        )}
      >
        {body}
      </Link>
    );
  }

  return (
    <div className="relative flex items-start gap-3 overflow-hidden rounded-2xl border border-wasro-border bg-white/85 p-3 pr-4 shadow-[0_2px_12px_-4px_rgba(15,66,117,0.10)] backdrop-blur sm:gap-4 sm:p-4">
      {body}
    </div>
  );
}

function OfferBody({ slide, hasCta }: { slide: ResolvedSlide; hasCta: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -left-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(244,196,48,0.55), transparent 70%)",
        }}
      />
      <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wasro-yellow to-amber-500 text-wasro-charcoal shadow-sm sm:h-11 sm:w-11">
        <Sparkles size={16} />
      </span>
      <div className="relative flex min-w-0 flex-1 flex-col leading-snug">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {slide.badge && (
            <span className="rounded-pill bg-wasro-yellow/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-wasro-yellow-dark sm:text-[10px]">
              {slide.badge}
            </span>
          )}
          {slide.validUntil && (
            <span className="text-[10px] font-medium text-wasro-slate">
              ends{" "}
              {new Date(slide.validUntil).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
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
        <>
          <span className="relative hidden shrink-0 self-center items-center gap-1.5 rounded-pill bg-wasro-blue px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors group-hover:bg-wasro-blue-dark sm:inline-flex">
            {slide.ctaLabel}
            <ArrowRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
          <span className="relative mt-0.5 flex h-9 w-9 shrink-0 self-center items-center justify-center rounded-full bg-wasro-blue text-white shadow-sm transition-colors group-hover:bg-wasro-blue-dark sm:hidden">
            <ArrowRight size={14} />
          </span>
        </>
      )}
    </>
  );
}

function SlideDots({ count, active }: { count: number; active: number }) {
  return (
    <div
      aria-hidden
      className="mt-3 flex items-center justify-center gap-1.5"
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === active
              ? "w-6 bg-wasro-blue"
              : "w-1.5 bg-wasro-border"
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cycling product image (right column)
// ---------------------------------------------------------------------------

/**
 * Replaces the single static <ProductImage> in the hero's right column.
 * Renders every slide's product image stacked, only one visible at a
 * time. Crossfades between them as the index changes.
 *
 * Notes:
 *   - `priority` is set on the FIRST slide's image so the LCP fetch
 *     starts immediately.
 *   - Other slides render with `priority={false}` (default lazy in
 *     <Image>, but we already preloaded all of them via priority on the
 *     server side via <link rel="preload"> for the first slide only).
 */
export function HeroCyclingProduct({
  fallback,
  className,
}: {
  fallback: Product;
  className?: string;
}) {
  const { slides, index, active } = useSlideshow();

  // When slideshow is off / empty, render the static fallback so the
  // hero never goes blank.
  if (!active || slides.length === 0) {
    return (
      <ProductImage
        product={fallback}
        priority
        className={cn(
          "h-full w-full shadow-2xl shadow-wasro-blue/25 ring-1 ring-white/40",
          className
        )}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            i === index ? "z-10 opacity-100" : "z-0 opacity-0"
          )}
        >
          <ProductImage
            product={slide.product}
            priority={i === 0}
            className={cn(
              "h-full w-full shadow-2xl shadow-wasro-blue/25 ring-1 ring-white/40",
              className
            )}
          />
        </div>
      ))}
    </div>
  );
}
