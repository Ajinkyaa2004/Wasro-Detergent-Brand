import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  Star,
  Type,
  Wrench,
  LayoutGrid,
  HelpCircle,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Quote,
} from "lucide-react";
import { getOffer } from "@/lib/offer";
import { getFeaturedIds, MAX_FEATURED } from "@/lib/featured";
import { getHeadlines } from "@/lib/headlines";
import { getHeroContent } from "@/lib/hero-content";
import { getWhyWasro } from "@/lib/why-wasro";
import { getFaqs } from "@/lib/faqs";
import { getProductPrices } from "@/lib/product-prices";
import { getAllReviews } from "@/lib/reviews";
import { PRODUCTS } from "@/data/products";
import { isPersistent } from "@/lib/storage";

export const dynamic = "force-dynamic";

type Card = {
  href: string;
  title: string;
  blurb: string;
  status: { label: string; tone: "live" | "muted" };
  icon: typeof Megaphone;
  gradient: string;
};

export default async function AdminDashboard() {
  const [offer, featuredIds, headlines, heroContent, why, faqs, prices, reviews] =
    await Promise.all([
      getOffer(),
      getFeaturedIds(),
      getHeadlines(),
      getHeroContent(),
      getWhyWasro(),
      getFaqs(),
      getProductPrices(),
      getAllReviews(),
    ]);
  const overrideCount = Object.keys(prices).length;
  const unpricedDefaults = PRODUCTS.filter((p) => p.mrp == null).length;
  const visibleReviews = reviews.filter((r) => !r.hidden).length;

  const cards: Card[] = [
    {
      href: "/admin/offer",
      title: "Hero offer slideshow",
      blurb:
        "Up to 3 rotating slides at the bottom of the home hero. Each slide swaps its own product image into the hero too.",
      status: offer.active
        ? {
            label: `${offer.slides.length} slide${offer.slides.length === 1 ? "" : "s"} live`,
            tone: "live",
          }
        : { label: "Hidden", tone: "muted" },
      icon: Megaphone,
      gradient: "from-wasro-yellow to-amber-500",
    },
    {
      href: "/admin/hero-content",
      title: "Hero content",
      blurb:
        "Static hero text: the brand chip, headline second line, subtitle, CTA buttons, and stats.",
      status: { label: heroContent.chipText, tone: "live" },
      icon: Wrench,
      gradient: "from-indigo-500 to-indigo-700",
    },
    {
      href: "/admin/featured",
      title: "Featured products",
      blurb: `The ${MAX_FEATURED}-product grid in "Family favourites" on the home page.`,
      status: {
        label: `${featuredIds.length} selected`,
        tone: featuredIds.length > 0 ? "live" : "muted",
      },
      icon: Star,
      gradient: "from-wasro-blue to-wasro-blue-dark",
    },
    {
      href: "/admin/pricing",
      title: "Product pricing",
      blurb:
        "Set or update the printed MRP for any SKU. Reflects on home, /products, /stain-guide and SEO instantly.",
      status: {
        label:
          overrideCount > 0
            ? `${overrideCount} override${overrideCount === 1 ? "" : "s"}`
            : unpricedDefaults > 0
              ? `${unpricedDefaults} SKU${unpricedDefaults === 1 ? "" : "s"} unpriced`
              : "Using defaults",
        tone:
          overrideCount > 0 || unpricedDefaults > 0 ? "live" : "muted",
      },
      icon: Tag,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      href: "/admin/headlines",
      title: "Hero headlines",
      blurb: "Rotating words inside the home-hero headline.",
      status: {
        label: `${headlines.length} active`,
        tone: headlines.length > 0 ? "live" : "muted",
      },
      icon: Type,
      gradient: "from-emerald-500 to-emerald-700",
    },
    {
      href: "/admin/why-us",
      title: "Why Wasro cards",
      blurb: "Four value-prop cards in the 'More than just a wash' section.",
      status: {
        label: `${why.cards.length} cards`,
        tone: "live",
      },
      icon: LayoutGrid,
      gradient: "from-wasro-coral to-rose-700",
    },
    {
      href: "/admin/faqs",
      title: "FAQs",
      blurb:
        "The Q&A accordion on the About page (also feeds Google's rich-result snippets).",
      status: {
        label: `${faqs.length} question${faqs.length === 1 ? "" : "s"}`,
        tone: faqs.length > 0 ? "live" : "muted",
      },
      icon: HelpCircle,
      gradient: "from-sky-500 to-sky-700",
    },
    {
      href: "/admin/reviews",
      title: "Customer reviews",
      blurb:
        "Home page testimonials. The first visible review is the spotlight card; next four fill the grid. Feeds AggregateRating schema.",
      status: {
        label:
          visibleReviews === 0
            ? "Section hidden"
            : `${visibleReviews} visible${
                reviews.length - visibleReviews > 0
                  ? ` · ${reviews.length - visibleReviews} hidden`
                  : ""
              }`,
        tone: visibleReviews > 0 ? "live" : "muted",
      },
      icon: Quote,
      gradient: "from-fuchsia-500 to-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Storage health banner */}
      {!isPersistent ? (
        <UpstashWarning />
      ) : (
        <div className="flex items-start gap-3 rounded-card border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Persistent storage connected</p>
            <p className="mt-0.5 text-emerald-900/80">
              Saves are written to Upstash Redis and reflected on the live
              site instantly.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Wasro Admin
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal sm:text-4xl">
          Welcome back.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-wasro-slate">
          Manage the editable parts of wasro.in. Changes are live the moment
          you save — no developer needed.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-[1.25rem] border border-wasro-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-wasro-blue/30 hover:shadow-lg"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${c.gradient} opacity-20 blur-2xl`}
              />
              <div className="relative">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-md`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold leading-tight text-wasro-charcoal">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-wasro-slate">
                  {c.blurb}
                </p>
              </div>
              <div className="relative mt-auto flex items-center justify-between border-t border-wasro-border pt-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      c.status.tone === "live"
                        ? "bg-emerald-500"
                        : "bg-wasro-slate/40"
                    }`}
                    aria-hidden
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-wasro-slate">
                    {c.status.label}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-wasro-blue transition-transform duration-300 group-hover:translate-x-1">
                  Edit <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}

        {/* Placeholder for the next batch (distributors, FAQs, etc.) */}
        <div className="hidden flex-col items-center justify-center rounded-[1.25rem] border-2 border-dashed border-wasro-border bg-white/50 p-8 text-center sm:flex">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wasro-cream text-wasro-slate">
            <Star size={20} className="opacity-50" />
          </div>
          <p className="text-sm font-semibold text-wasro-charcoal">
            More controls coming soon
          </p>
          <p className="mt-1 text-xs text-wasro-slate">
            Distributors, FAQs, press logos.
          </p>
        </div>
      </div>
    </div>
  );
}

function UpstashWarning() {
  return (
    <div className="rounded-card border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-bold">In-memory storage only</p>
          <p className="mt-1 leading-relaxed text-amber-900/85">
            No Upstash Redis credentials detected. Your saves will work in
            this browser session but won&apos;t survive a server cold-start
            (which Vercel does after ~5 min of inactivity).
          </p>

          <div className="mt-3 rounded-card bg-white/70 p-3 ring-1 ring-amber-200/60">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Fix it in 3 minutes
            </p>
            <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-900/90 sm:text-sm">
              <li>
                <span className="font-bold">1.</span>{" "}
                <Link
                  href="https://upstash.com/?utm_source=wasro-admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-900 underline underline-offset-2 hover:text-amber-700"
                >
                  Sign up at upstash.com
                  <ExternalLink size={11} className="ml-0.5 inline" />
                </Link>{" "}
                — free, GitHub OAuth, no card.
              </li>
              <li>
                <span className="font-bold">2.</span> Create a Redis DB
                (free tier, Mumbai/Singapore region is closest).
              </li>
              <li>
                <span className="font-bold">3.</span> On the DB details
                page, copy the <code className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-mono">UPSTASH_REDIS_REST_URL</code> and{" "}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-mono">UPSTASH_REDIS_REST_TOKEN</code>.
              </li>
              <li>
                <span className="font-bold">4.</span> Send both values to
                the developer to add as Vercel env vars and redeploy.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
