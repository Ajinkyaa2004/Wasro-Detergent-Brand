import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck, Gift, Factory, Sparkles, Award } from "lucide-react";
import { SITE, cn } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { BubbleField } from "@/components/ui/bubble-field";
import { PressStrip } from "@/components/sections/press-strip";
import {
  JsonLd,
  buildMetadata,
  breadcrumbLd,
  faqLd,
  organizationLd,
  plantLocalBusinessLd,
} from "@/lib/seo";
import { getFaqs } from "@/lib/faqs";

// Read admin-edited FAQs at request time so changes show up on next visit.
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "About Wasro & Madhav Industries — Assam's Detergent Brand",
  description:
    "Wasro is an Indian detergent brand by Madhav Industries, made in Amingaon, Assam and sold at 121+ stores across Northeast India. Honest pricing, real free gifts.",
  path: "/about",
  keywords: [
    "Madhav Industries Assam",
    "Wasro brand story",
    "detergent manufacturer Assam",
    "Brahmaputra Industrial Park",
    "Amingaon detergent factory",
    "regional Indian FMCG brand",
  ],
});

// FAQs moved to lib/faqs.ts — admin-editable from /admin/faqs.
// Fetched at the top of the AboutPage server component.

const STATS = [
  { value: 121, suffix: "+", label: "Stores", sublabel: "Across NE India & beyond" },
  { value: 14, label: "SKUs", sublabel: "Across 4 categories" },
  { value: 10, label: "States", sublabel: "Covered & growing" },
  { value: 100, suffix: "%", label: "Made in Assam", sublabel: "Single, accountable plant" },
];

export default async function AboutPage() {
  // Admin-editable FAQs — fed to both the visible accordion AND the
  // FAQPage JSON-LD that drives Google's rich-result snippets.
  const FAQS = await getFaqs();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          // Re-emit Organization + LocalBusiness on About — this is the
          // page Google most often crawls for entity confirmation.
          organizationLd(),
          plantLocalBusinessLd(),
          faqLd(FAQS.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      <PageHero
        eyebrow="Our Story"
        title={
          <>
            Built in Assam.<br />
            Trusted across the Northeast.
          </>
        }
        subtitle="Wasro is a regional Indian detergent brand made by Madhav Industries. We serve households, kirana shops, hostels, hotels, and institutions across ten states — at honest, value-tier prices, with a free gift in every family pack."
      />

      {/* Lifestyle banner: man holding clean clothes */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <Image
          src="/lifestyle/man-clean-clothes.webp"
          alt="A satisfied customer holding a pile of clean Wasro-washed clothes"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-wasro-charcoal/85 via-wasro-charcoal/45 to-transparent"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
            <Reveal>
              <div className="max-w-xl text-wasro-cream">
                <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/95 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-wasro-charcoal shadow-lg">
                  <Sparkles size={12} /> Real homes, real loads
                </span>
                <h2 className="mt-5 text-3xl font-bold leading-[1.05] md:text-5xl">
                  Cleaner laundry,<br />honest pricing.
                </h2>
                <p className="mt-4 max-w-md text-wasro-cream/85">
                  Every family pack ships with a free gift, every wash trusted
                  by households across ten states.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated stats strip */}
      <section className="relative overflow-hidden border-b border-wasro-border bg-wasro-blue text-wasro-cream">
        <BubbleField count={5} seed={29} tone="light" className="opacity-50" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="flex h-full flex-col bg-wasro-blue px-6 py-10 text-center">
                <div className="text-4xl font-bold leading-none tracking-tight md:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix ?? ""}
                  />
                </div>
                <div className="mt-3 text-sm font-semibold uppercase tracking-wider text-wasro-yellow">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-wasro-cream/75">
                  {stat.sublabel}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Madhav Industries — manufacturer feature section.
          Layout: centered header + 2-card meta strip + full-width bento grid.
          Way more breathing room than the old 2-column squeeze. */}
      <section id="madhav" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          {/* Centered header */}
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-blue-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-wasro-blue-dark">
                <Factory size={12} /> Manufacturer
              </span>
              <h2 className="mt-4 text-3xl font-bold text-wasro-charcoal md:text-4xl">
                Madhav Industries
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-wasro-slate">
                We make every Wasro pack at our plant inside Brahmaputra
                Industrial Park, Amingaon — on the outskirts of Guwahati.
                Single location, single accountable team, transparent supply
                chain from raw material to retail shelf.
              </p>
            </div>
          </Reveal>

          {/* Plant address + Recognition — two cards side by side */}
          <Reveal delay={0.1}>
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-card border border-wasro-border bg-wasro-cream p-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-wasro-blue" />
                <div>
                  <p className="text-sm font-semibold text-wasro-charcoal">
                    Plant address
                  </p>
                  <p className="text-sm text-wasro-slate">
                    {SITE.manufacturerAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-card border border-amber-200 bg-amber-50 p-4">
                <Award size={20} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Recognised
                  </p>
                  <p className="text-sm text-amber-900/85">
                    Assam Startup &amp; Vocal for Local
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Full-width 5-image bento grid.
              Mobile (cols=2): m1 wide hero on top, then 2x2 of m2-m5 below.
              Desktop (md, cols=4 × rows=2): m1 takes the left half as a
              big-square (2x2 span), m2-m5 fill the right half as 4 squares.
              The container aspect-ratio locks proportions so cells stay
              square at desktop. */}
          <Reveal delay={0.2}>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2 md:aspect-[2/1]">
              {/* Hero — m1 */}
              <div className="group relative col-span-2 aspect-[16/9] overflow-hidden rounded-card shadow-xl ring-1 ring-wasro-border md:col-span-2 md:row-span-2 md:aspect-auto">
                <Image
                  src="/lifestyle/man1.webp"
                  alt="Madhav Industries manufacturing plant — production floor"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              {/* 4 small tiles — m2..m5 */}
              {[
                {
                  src: "/lifestyle/man2.webp",
                  alt: "Wasro Multi-Enzymes pack moving along the conveyor",
                },
                {
                  src: "/lifestyle/man3.webp",
                  alt: "Quality-control inspection of a Wasro detergent pack",
                },
                {
                  src: "/lifestyle/man4.webp",
                  alt: "Finished Wasro cartons stacked in the despatch area",
                },
                {
                  src: "/lifestyle/man5.webp",
                  alt: "Wasro Dishwash Tub at the QC station",
                },
              ].map((img) => (
                <div
                  key={img.src}
                  className="group relative aspect-square overflow-hidden rounded-card shadow-lg ring-1 ring-wasro-border md:aspect-auto"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quality promise */}
      <section id="quality" className="scroll-mt-20 bg-wasro-cream-dark">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-wasro-blue">
                Quality Promise
              </span>
              <h2 className="mt-2 text-3xl font-bold text-wasro-charcoal md:text-4xl">
                Three things we won&apos;t compromise on.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Cleaning power",
                body: "Formulated for Indian water hardness and the kind of stains an Indian household actually fights — from curry to mud to school-uniform grime.",
                stat: "3X",
                statLabel: "technology",
                bg: "bg-gradient-to-br from-wasro-blue to-wasro-blue-dark",
                ring: "hover:ring-wasro-blue/40",
              },
              {
                icon: Gift,
                title: "A free gift, every family pack",
                body: "Mug with 500g, bucket or tub with 2kg, drum or big tub with 3kg, 40L drum with 4kg — useful gifts you'll actually keep. Not stickers, not coupons. Real value.",
                stat: "4",
                statLabel: "gift tiers",
                bg: "bg-gradient-to-br from-wasro-yellow to-amber-600",
                ring: "hover:ring-wasro-yellow/40",
              },
              {
                icon: Factory,
                title: "Made-in-India",
                body: "100% manufactured at our Assam plant. We employ locally, source locally where we can, and ship across Northeast India and beyond.",
                stat: "1",
                statLabel: "single plant",
                bg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
                ring: "hover:ring-emerald-400/40",
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article
                  className={cn(
                    "group relative isolate flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white p-7 ring-1 ring-wasro-border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                    p.ring
                  )}
                >
                  {/* Shine sweep on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-18deg] opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                  />
                  {/* Corner blob */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-10 -top-10 z-0 h-32 w-32 rounded-full opacity-25 blur-2xl",
                      p.bg
                    )}
                  />
                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className={cn(
                          "inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                          p.bg
                        )}
                      >
                        <p.icon size={22} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold leading-none text-wasro-charcoal">
                          {p.stat}
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                          {p.statLabel}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-wasro-charcoal">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-wasro-slate">
                      {p.body}
                    </p>
                    <span
                      aria-hidden
                      className={cn(
                        "mt-5 block h-1 w-12 rounded-full transition-all duration-500 group-hover:w-full",
                        p.bg
                      )}
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Product family showcase */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-wasro-yellow-dark">
                <Sparkles size={12} /> The full Wasro family
              </span>
              <h2 className="mt-3 text-3xl font-bold text-wasro-charcoal md:text-4xl">
                14 packs. 4 categories. Every household need.
              </h2>
              <p className="mt-4 text-wasro-slate">
                From a ₹10 sachet to a 4kg jumbo pack with a free drum, our
                range covers everyday detergent, dishwash, and clothwash needs
                — built around the way Indian families actually clean.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-pill bg-wasro-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-wasro-blue/20 transition hover:bg-wasro-blue-dark hover:-translate-y-0.5"
              >
                Browse all products
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-card shadow-2xl">
              <Image
                src="/lifestyle/clothes-still-life.webp"
                alt="Clean folded clothes — the result of Wasro"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Press / 'As Seen In' strip */}
      <PressStrip />

      {/* FAQs */}
      <section id="faqs" className="scroll-mt-20 bg-wasro-cream-dark">
        <div className="mx-auto max-w-3xl px-5 py-20 md:px-8">
          <Reveal>
            <h2 className="mb-10 text-3xl font-bold text-wasro-charcoal md:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group rounded-card border border-wasro-border bg-white open:border-wasro-blue/30 open:shadow-lg open:shadow-wasro-blue/5">
                  <summary className="cursor-pointer list-none px-5 py-4 text-base font-semibold text-wasro-charcoal marker:hidden">
                    {f.q}
                    <span className="float-right inline-block text-2xl font-light leading-none text-wasro-blue transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-wasro-slate">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative overflow-hidden bg-wasro-blue text-wasro-cream">
        <BubbleField count={6} seed={31} tone="light" className="opacity-50" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 md:flex-row md:items-center md:px-8">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to try Wasro?
            </h2>
            <p className="mt-1 text-wasro-cream/80">
              Explore the full range or send us a bulk enquiry today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/bulk-orders"
              className="wasro-cta-pulse rounded-pill bg-wasro-yellow px-6 py-3 text-sm font-bold text-wasro-charcoal transition hover:bg-wasro-yellow-dark hover:-translate-y-0.5"
            >
              Bulk orders
            </Link>
            <Link
              href="/products"
              className="rounded-pill bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 hover:-translate-y-0.5"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
