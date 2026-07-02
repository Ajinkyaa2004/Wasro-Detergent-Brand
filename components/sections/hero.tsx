import Link from "next/link";
import Image from "next/image";
import { Sparkles, MapPin } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { withImage } from "@/lib/server/product-images";
import { BubbleField } from "@/components/ui/bubble-field";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal } from "@/components/ui/reveal";
import { CyclingHeadline } from "@/components/ui/cycling-headline";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Ripple } from "@/components/ui/ripple";
import {
  HeroSlideshowProvider,
  HeroCyclingOfferBanner,
  HeroCyclingProduct,
  type ResolvedSlide,
} from "@/components/sections/hero-slideshow";
import { FALLBACK_PRODUCT_ID, getOffer } from "@/lib/offer";
import { getHeadlines } from "@/lib/headlines";
import { getHeroContent } from "@/lib/hero-content";

export async function Hero() {
  // Resolve fallback product (used when no offer is active or a slide
  // doesn't pick a productId).
  const base =
    PRODUCTS.find((p) => p.id === FALLBACK_PRODUCT_ID) ?? PRODUCTS[0];
  const featured = withImage(base);

  // Admin-editable content fetched server-side in parallel.
  const [offer, headlines, content] = await Promise.all([
    getOffer(),
    getHeadlines(),
    getHeroContent(),
  ]);

  // Resolve each slide's productId → live Product (with image URL). Done
  // server-side so the client component receives no product-lookup work.
  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
  const resolvedSlides: ResolvedSlide[] = offer.slides.map((slide) => {
    const product = (slide.productId && byId.get(slide.productId)) || base;
    return { ...slide, product: withImage(product) };
  });

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Bright animated mesh blob field. Trimmed from 5 blobs → 2 on
          desktop and disabled entirely on mobile via CSS — the perf
          win on Lighthouse mobile is huge and the visual difference at
          phone size is imperceptible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block"
      >
        {/* Powder-blue glow — top-left */}
        <div
          className="wasro-mesh-blob absolute h-[720px] w-[720px] rounded-full"
          style={{
            left: "-12%",
            top: "-15%",
            background:
              "radial-gradient(circle at center, rgba(135,189,233,0.38) 0%, rgba(135,189,233,0.18) 35%, transparent 70%)",
          }}
        />
        {/* Sunshine yellow — bottom-right */}
        <div
          className="wasro-mesh-blob absolute h-[620px] w-[620px] rounded-full"
          style={{
            right: "-8%",
            bottom: "-15%",
            background:
              "radial-gradient(circle at center, rgba(252,211,77,0.32) 0%, rgba(252,211,77,0.15) 35%, transparent 70%)",
            animationDelay: "-8s",
          }}
        />
      </div>

      <BubbleField count={6} seed={11} tone="dark" className="opacity-60" />

      {/* `pt-28` (112px) clears the fixed 80px navbar plus a comfortable
          gap on mobile. Desktop keeps the symmetric `py-24` since the
          navbar isn't visually competing for the hero space there.

          Wrapped in <HeroSlideshowProvider> so the offer banner (left
          column) and the product image (right column) cycle through the
          same slide index in sync. */}
      <HeroSlideshowProvider
        slides={resolvedSlides}
        active={offer.active}
        cycleSeconds={offer.cycleSeconds}
        fallbackProduct={featured}
      >
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
        <Reveal>
          <div className="space-y-7">
            {/* All hero text below is admin-editable from /admin/hero-content. */}
            <span className="inline-flex items-center gap-2 rounded-pill bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-wasro-blue ring-1 ring-wasro-blue/15 backdrop-blur">
              <Sparkles size={14} className="animate-pulse" /> {content.chipText}
            </span>

            <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.15] tracking-tight text-wasro-charcoal pb-2">
              <CyclingHeadline words={headlines} className="text-wasro-blue" />
              <br />
              {content.secondLine}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-wasro-slate">
              {content.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton strength={0.25}>
                <Ripple>
                  <Link
                    href={content.primaryCta.href}
                    className="wasro-cta-pulse wasro-shine wasro-shine-cta inline-flex items-center justify-center rounded-pill bg-wasro-blue px-7 py-3.5 text-base font-semibold text-white transition hover:bg-wasro-blue-dark"
                  >
                    {content.primaryCta.label}
                  </Link>
                </Ripple>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <Ripple color="rgba(27,95,168,0.18)">
                  <Link
                    href={content.secondaryCta.href}
                    className="inline-flex items-center gap-2 rounded-pill bg-white px-6 py-3.5 text-base font-semibold text-wasro-charcoal ring-1 ring-wasro-border transition hover:ring-wasro-blue"
                  >
                    <MapPin size={16} /> {content.secondaryCta.label}
                  </Link>
                </Ripple>
              </MagneticButton>
            </div>

            {/* Admin-editable offer slideshow (up to 3 slides). Renders
                nothing when the admin has set `active: false`. */}
            <HeroCyclingOfferBanner />

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4 text-sm text-wasro-slate">
              {content.stats.map((s, i) => (
                <Stat
                  key={i}
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  label={s.label}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-md">
              {/* Cycling product image — swaps in sync with the offer
                  banner on the left. LCP-friendly: no float/shine on
                  the image, and `priority` is set on the first slide so
                  it starts fetching immediately. */}
              <HeroCyclingProduct fallback={featured} />

              {/* Pack-specific "Free with X" chip removed: each slide now
                  conveys its own offer in the banner on the left, so a
                  static chip here would contradict mid-cycle. */}

              {/* "Made in Assam" chip — visible on all screens. On mobile
                  the offset is tighter so it doesn't extend past the
                  viewport edge.
                  `z-20`: HeroCyclingProduct slides use `z-10` when active,
                  so an un-stacked chip ends up BEHIND the pack image. We
                  bump to z-20 (same level as the 2X formula sticker
                  below) so both decorations clear the product image. */}
              <div className="absolute -right-2 top-4 z-20 rotate-3 rounded-card bg-wasro-yellow/85 px-3 py-1.5 shadow-lg ring-1 ring-white/40 backdrop-blur-md md:-right-4 md:top-6 md:px-4 md:py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-wasro-charcoal md:text-xs">
                  {content.madeInAssamChip}
                </p>
              </div>
              {/* 2X formula sticker — visible on all screens now. On mobile
                  it's smaller and pulled inwards so the full sticker stays
                  on-screen. Z-index so it sits above the cycling product
                  image (slides use z-10 → sticker uses z-20). */}
              <Image
                src="/lifestyle/wasro-2x-formula.webp"
                alt=""
                width={120}
                height={80}
                className="absolute -right-3 -bottom-6 z-20 h-14 w-auto rotate-[-6deg] rounded-card object-contain shadow-xl ring-2 ring-white md:-right-8 md:-bottom-10 md:h-20"
                aria-hidden
              />
            </div>

            <div className="absolute -inset-x-4 -bottom-10 -z-10 h-32 rounded-full bg-wasro-blue/10 blur-2xl" />
          </div>
        </Reveal>
      </div>
      </HeroSlideshowProvider>
    </section>
  );
}

function Stat({
  value,
  prefix,
  suffix,
  label,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  return (
    <div>
      <div className="text-2xl font-bold text-wasro-charcoal">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}
