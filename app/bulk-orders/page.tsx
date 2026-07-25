import type { Metadata } from "next";
import {
  Phone,
  Truck,
  Clock,
  BadgeCheck,
  Store,
  Hotel,
  GraduationCap,
  HeartHandshake,
  Building2,
  PackageCheck,
  Mail,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { BulkForm } from "@/components/bulk-form";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { BubbleField } from "@/components/ui/bubble-field";
import { SITE, cn } from "@/lib/utils";
import {
  JsonLd,
  buildMetadata,
  breadcrumbLd,
  absoluteUrl,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bulk Detergent Orders & Wholesale Enquiries",
  description:
    "Wholesale Wasro detergent for shops, hostels, hotels, NGOs & distributors — direct from our Assam plant. Pan-India dispatch, GST invoicing, 1-day response.",
  path: "/bulk-orders",
  keywords: [
    "bulk detergent supplier India",
    "wholesale detergent Assam",
    "kirana detergent supply",
    "hotel laundry detergent",
    "institutional dishwash supply",
    "detergent distributor Northeast India",
    "Wasro wholesale price",
  ],
});

// ContactPage + Service schema — tells Google this is the lead-capture
// page and lists what Wasro offers wholesale buyers.
const contactPageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": absoluteUrl("/bulk-orders#contact"),
  url: absoluteUrl("/bulk-orders"),
  name: "Wasro Bulk Orders & Wholesale Enquiries",
  description:
    "Send your bulk detergent requirement. Our team responds within one working day with pricing, MOQs, and dispatch timelines.",
  inLanguage: "en-IN",
  about: {
    "@type": "Service",
    serviceType: "Wholesale FMCG distribution",
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: { "@type": "Country", name: "India" },
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "Kirana stores, supermarkets, hostels, schools, hotels, restaurants, NGOs, corporates, distributors",
    },
  },
};

const HIGHLIGHTS = [
  {
    icon: Truck,
    title: "Pan-India dispatch",
    body: "We ship to retailers, institutions, and bulk buyers across all of Northeast India and beyond.",
    accent: "from-wasro-blue to-wasro-blue-dark",
    ring: "ring-wasro-blue/15",
    chip: "bg-wasro-blue-light text-wasro-blue-dark",
  },
  {
    icon: Clock,
    title: "1-day response",
    body: "Our team gets back with pricing, MOQs, and dispatch timelines within one working day of your enquiry.",
    accent: "from-wasro-yellow to-amber-600",
    ring: "ring-wasro-yellow/20",
    chip: "bg-wasro-yellow/20 text-wasro-yellow-dark",
  },
  {
    icon: BadgeCheck,
    title: "Direct from the plant",
    body: "Manufactured at Madhav Industries, Amingaon — no middlemen, no overheads. Better margins for you.",
    accent: "from-emerald-500 to-emerald-700",
    ring: "ring-emerald-400/20",
    chip: "bg-emerald-100 text-emerald-800",
  },
];

const BUYER_TYPES = [
  {
    icon: Store,
    title: "Kirana & supermarkets",
    body: "Tier-1 wholesale rates with margin-friendly MOQs. Repeat-order discounts.",
  },
  {
    icon: GraduationCap,
    title: "Hostels & schools",
    body: "Monthly running stock plans for boarding-school laundry and dorm dishwash needs.",
  },
  {
    icon: Hotel,
    title: "Hotels & restaurants",
    body: "Daily-use volumes for housekeeping linen, kitchen scrub, and back-of-house dishwash.",
  },
  {
    icon: HeartHandshake,
    title: "NGOs & institutions",
    body: "Subsidized institutional pricing for relief kits, hostels, and community outreach.",
  },
  {
    icon: Building2,
    title: "Corporate & PSU",
    body: "Annual contract pricing, GST-compliant invoicing, scheduled dispatch.",
  },
  {
    icon: PackageCheck,
    title: "Distributors & superstockists",
    body: "Territory rights, marketing support, and direct factory pricing.",
  },
];

const STATS = [
  { value: 150, suffix: "+", label: "Stores served" },
  { value: 14, label: "SKUs across 4 ranges" },
  { value: 10, label: "States covered" },
  { value: 1, label: "Working-day response" },
];

const PROCESS = [
  {
    n: "01",
    title: "Send your requirement",
    body: "Drop us a line via the form, WhatsApp, or email. Tell us the SKU mix, quantity, delivery city, and timeline.",
  },
  {
    n: "02",
    title: "Get a quote in 1 day",
    body: "Our team replies with wholesale pricing, MOQs, GST particulars, and the earliest dispatch date.",
  },
  {
    n: "03",
    title: "Confirm & dispatch",
    body: "Once you approve, the order ships from our Amingaon plant. Pan-India delivery, transparent tracking.",
  },
];

export default function BulkOrdersPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Bulk Orders", path: "/bulk-orders" },
          ]),
          contactPageLd,
        ]}
      />
      <PageHero
        eyebrow="For retailers, institutions & distributors"
        title={
          <>
            Bulk orders,<br />
            made simple.
          </>
        }
        subtitle="Tell us what you need — quantity, SKU mix, delivery city. Our team replies within one working day with a quote and dispatch timeline. Direct from the plant in Assam."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#enquire"
            className="wasro-cta-pulse wasro-shine wasro-shine-cta inline-flex items-center gap-2 rounded-pill bg-wasro-blue px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-wasro-blue/25 transition hover:-translate-y-0.5 hover:bg-wasro-blue-dark"
          >
            <Mail size={14} /> Send enquiry
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.bulkMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-pill bg-white px-6 py-3.5 text-sm font-bold text-wasro-charcoal ring-1 ring-wasro-border transition hover:-translate-y-0.5 hover:ring-wasro-blue"
          >
            <Phone size={14} /> WhatsApp us
          </a>
        </div>

        {/* Inline trust strip */}
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-semibold text-wasro-slate">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-wasro-blue" /> GST-compliant invoicing
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} className="text-wasro-blue" /> Pan-India dispatch
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-wasro-blue" /> Plant in Amingaon, Assam
          </span>
        </div>
      </PageHero>

      {/* Animated stats strip */}
      <section className="relative overflow-hidden border-b border-wasro-blue-dark bg-wasro-blue text-wasro-cream">
        <BubbleField count={5} seed={37} tone="light" className="opacity-50" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="flex h-full flex-col bg-wasro-blue px-6 py-9 text-center">
                <div className="text-3xl font-bold leading-none tracking-tight md:text-4xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix ?? ""}
                  />
                </div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-wasro-yellow">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
                Why bulk-buy Wasro
              </span>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-wasro-charcoal md:text-4xl">
                Built for shopkeepers and institutions across Northeast India.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.1}>
                <article
                  className={cn(
                    "group relative isolate flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white p-7 ring-1 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                    h.ring
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-10 -top-10 z-0 h-32 w-32 rounded-full bg-gradient-to-br opacity-25 blur-2xl",
                      h.accent
                    )}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-18deg] opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                  />
                  <div className="relative z-10">
                    <div
                      className={cn(
                        "mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                        h.accent
                      )}
                    >
                      <h.icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-wasro-charcoal">
                      {h.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-wasro-slate">
                      {h.body}
                    </p>
                    <span
                      aria-hidden
                      className={cn(
                        "mt-5 block h-1 w-12 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-full",
                        h.accent
                      )}
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer types */}
      <section className="bg-wasro-cream-dark">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="mb-10 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-wasro-yellow-dark">
                  <Sparkles size={12} /> Who we serve
                </span>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-wasro-charcoal md:text-4xl">
                  From a single kirana shop to a 500-bed hostel.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-wasro-slate">
                We have wholesale plans tuned for every kind of bulk buyer.
                Tell us your category in the form below.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BUYER_TYPES.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="group flex h-full items-start gap-4 rounded-card border border-wasro-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-wasro-blue/40 hover:shadow-lg hover:shadow-wasro-blue/5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wasro-blue-light text-wasro-blue-dark transition-colors duration-300 group-hover:bg-wasro-blue group-hover:text-white">
                    <b.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-wasro-charcoal">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-wasro-slate">
                      {b.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
                How it works
              </span>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-wasro-charcoal md:text-4xl">
                Three steps. One working day to a quote.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.12}>
                <div className="relative h-full overflow-hidden rounded-[1.25rem] border border-wasro-border bg-gradient-to-br from-wasro-cream via-white to-wasro-blue-light/20 p-7">
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-2 select-none text-7xl font-black leading-none text-wasro-blue/8 md:text-8xl"
                  >
                    {p.n}
                  </span>
                  <div className="relative">
                    <span className="inline-flex h-9 items-center rounded-pill bg-wasro-blue px-3 text-xs font-bold uppercase tracking-wider text-white">
                      Step {p.n}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-wasro-charcoal">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-wasro-slate">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form section */}
      <section
        id="enquire"
        className="relative overflow-hidden scroll-mt-24 bg-gradient-to-br from-wasro-cream-dark via-wasro-blue-light/30 to-wasro-cream-dark"
      >
        <BubbleField count={6} seed={43} tone="dark" className="opacity-40" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr] md:gap-12 md:px-8 md:py-24">
          <Reveal>
            <div className="md:sticky md:top-28">
              <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-wasro-blue">
                <Mail size={12} /> Get in touch
              </span>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-wasro-charcoal md:text-4xl">
                Send us your enquiry.
              </h2>
              <p className="mt-3 max-w-md text-wasro-slate">
                Fill in the form and we&apos;ll respond on WhatsApp or email
                within one working day. Prefer to talk first? Reach us directly:
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.bulkMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-card border border-wasro-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-wasro-slate">
                      WhatsApp
                    </p>
                    <p className="text-base font-bold text-wasro-charcoal group-hover:text-emerald-700">
                      {SITE.whatsappDisplay}
                    </p>
                  </div>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="group flex items-start gap-3 rounded-card border border-wasro-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-wasro-blue hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wasro-blue text-white">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-wasro-slate">
                      Email
                    </p>
                    <p className="text-base font-bold text-wasro-charcoal group-hover:text-wasro-blue">
                      {SITE.email}
                    </p>
                  </div>
                </a>
                <div className="flex items-start gap-3 rounded-card border border-wasro-border bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wasro-yellow text-wasro-charcoal">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-wasro-slate">
                      Plant
                    </p>
                    <p className="text-sm font-semibold leading-snug text-wasro-charcoal">
                      {SITE.manufacturerAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <BulkForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
