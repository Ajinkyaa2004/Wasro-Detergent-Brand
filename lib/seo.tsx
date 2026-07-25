/**
 * SEO helpers for Wasro.
 *
 * Provides:
 *   - `buildMetadata(...)`        Type-safe Next.js Metadata builder with sane defaults
 *   - `absoluteUrl(...)`          Convert a path to an absolute canonical URL
 *   - JSON-LD builders            organizationLd / websiteLd / localBusinessLd /
 *                                 productLd / itemListLd / faqLd /
 *                                 breadcrumbLd / aggregateRatingLd
 *   - `<JsonLd ld={...} />`       React component that renders a single ld+json script
 *
 * All schemas conform to schema.org and are validated against
 * https://validator.schema.org / https://search.google.com/test/rich-results.
 */

import type { Metadata } from "next";
import { SITE } from "./utils";
import { PRODUCTS, type Product } from "@/data/products";

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/** Strip leading slash and produce an absolute URL against SITE.url. */
export function absoluteUrl(path: string = "/"): string {
  const base = SITE.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

// ---------------------------------------------------------------------------
// Metadata builder
// ---------------------------------------------------------------------------

export type PageMetaInput = {
  /** Page title (without the brand suffix — template adds " | Wasro") */
  title: string;
  description: string;
  /** Path relative to site root, e.g. "/products". Used for canonical + og:url. */
  path: string;
  /** Public image path (e.g. "/lifestyle/hero-family.webp"). Defaults to the
   *  site-wide OG image rendered by app/opengraph-image.tsx. */
  ogImage?: string;
  /** Override Open Graph type. Default "website". */
  ogType?: "website" | "article";
  /** Whether this URL should be indexed. Default true. */
  index?: boolean;
  /** Additional keywords appended to the brand defaults. */
  keywords?: string[];
};

const BRAND_KEYWORDS = [
  "Wasro",
  "Wasro detergent",
  "Madhav Industries",
  "Assam detergent brand",
  "Northeast India detergent",
  "Indian detergent powder",
];

/**
 * Single entry point for per-page metadata. Returns a fully populated
 * Next.js `Metadata` object with title, description, canonical, OpenGraph,
 * Twitter, and robots all wired up consistently.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  ogType = "website",
  index = true,
  keywords = [],
}: PageMetaInput): Metadata {
  const canonical = absoluteUrl(path);
  // Default OG image: site-wide rendered image. If the page wants a custom
  // hero shot, pass `ogImage`.
  const image = ogImage ?? "/opengraph-image";
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...BRAND_KEYWORDS, ...keywords],
    alternates: {
      canonical,
      // Emit hreflang on every page (the site is single-locale en-IN).
      // Points each alternate at the page's own canonical so the tags
      // render consistently site-wide rather than only in the root layout.
      languages: {
        "en-IN": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Wasro",
      type: ogType,
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          // Avoid "Foo — Wasro — Wasro" duplication if the title already
          // contains the brand name.
          alt: /wasro/i.test(title) ? title : `${title} — Wasro`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD shared types
// ---------------------------------------------------------------------------

export type JsonLd = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Organization (root) — emitted once in the root layout
// ---------------------------------------------------------------------------

export function organizationLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE.brand,
    alternateName: ["Wasro Detergent", "Wasro India", SITE.legalName],
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    image: absoluteUrl(SITE.logo),
    foundingDate: SITE.foundingDate,
    slogan: SITE.tagline,
    description:
      "Wasro is an Indian detergent brand by Madhav Industries — manufactured in Assam, available across 150+ stores in India.",
    // Categories the brand is recognised for — feeds Google's
    // "About this result" knowledge cards.
    knowsAbout: [
      "Detergent powder",
      "Dishwash bar",
      "Dishwash tub",
      "Clothwash bar",
      "Multi-Enzymes detergent",
      "Home cleaning",
      "FMCG manufacturing",
      "Northeast India FMCG",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: `+${SITE.whatsapp}`,
        email: SITE.email,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "as"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${SITE.whatsapp}`,
        email: SITE.email,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "as"],
      },
      {
        "@type": "ContactPoint",
        contactType: "wholesale",
        telephone: `+${SITE.whatsapp}`,
        email: SITE.email,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "as"],
      },
    ],
    sameAs: SITE.sameAs,
  };
}

// ---------------------------------------------------------------------------
// LocalBusiness — for the manufacturing plant
// ---------------------------------------------------------------------------

export function plantLocalBusinessLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#plant"),
    name: `${SITE.brand} — Manufacturing Plant (${SITE.legalName})`,
    url: SITE.url,
    image: absoluteUrl(SITE.logo),
    telephone: `+${SITE.whatsapp}`,
    email: SITE.email,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: [
      "Assam",
      "Meghalaya",
      "Manipur",
      "Tripura",
      "Mizoram",
      "Nagaland",
      "Arunachal Pradesh",
      "West Bengal",
      "Bihar",
      "Odisha",
    ].map((s) => ({
      "@type": "State",
      name: s,
      containedInPlace: { "@type": "Country", name: "India" },
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    // Commerce hints — narrow the long-tail "wholesale detergent Guwahati"
    // type query enough that Google's local pack is more likely to surface
    // Wasro for bulk-buy searches.
    currenciesAccepted: "INR",
    paymentAccepted: ["Cash", "UPI", "NEFT", "RTGS", "Bank Transfer"],
    slogan: SITE.tagline,
    keywords: [
      "detergent manufacturer Assam",
      "FMCG plant Amingaon",
      "wholesale detergent Northeast India",
      "Wasro distributor enquiries",
    ].join(", "),
  };
}

// ---------------------------------------------------------------------------
// WebSite — enables Sitelinks Searchbox if/when we add /search
// ---------------------------------------------------------------------------

export function websiteLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE.url,
    name: SITE.brand,
    description: SITE.tagline,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-IN",
  };
}

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<Product["category"], string> = {
  "detergent-powder": "Detergent Powder",
  "dishwash-bar": "Dishwash Bar",
  "dishwash-tub": "Dishwash Tub",
  "clothwash-bar": "Clothwash Bar",
};

export function productLd(p: Product): JsonLd {
  const base: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/products#${p.id}`),
    name: `${p.name} ${p.size}`,
    description: p.description,
    sku: p.id,
    image: absoluteUrl(p.image),
    category: CATEGORY_LABELS[p.category],
    brand: {
      "@type": "Brand",
      name: SITE.brand,
    },
    manufacturer: {
      "@type": "Organization",
      name: SITE.legalName,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        addressCountry: SITE.address.addressCountry,
      },
    },
  };

  // Only attach the Offer node when the product has a published MRP.
  // Emitting `price: null` would fail Google's structured-data
  // validation and could disable rich-result eligibility entirely.
  if (p.mrp != null) {
    // priceValidUntil is required-recommended by Google for Offers.
    // Set to end of next year so it never lapses between deploys.
    const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;
    base.offers = {
      "@type": "Offer",
      url: absoluteUrl(`/products#${p.id}`),
      priceCurrency: "INR",
      price: p.mrp,
      priceValidUntil,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE.legalName,
      },
      // Return policy mirrors the published /returns page (30-day window).
      // We intentionally omit shippingDetails — Wasro is sold via retail
      // kirana + quick-commerce, not direct D2C from this site, so
      // claiming site-level delivery specifics would be inaccurate.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnAtKiosk",
        returnFees: "https://schema.org/FreeReturn",
      },
    };
  }

  return base;
}

/** Emit a single ItemList of all products — better than dozens of Product nodes. */
export function productsItemListLd(products: Product[] = PRODUCTS): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/products#itemlist"),
    name: "Wasro product catalogue",
    description: `All ${products.length} Wasro SKUs across detergent powder, dishwash bar, dishwash tub, and clothwash bar.`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productLd(p),
    })),
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export type Crumb = { name: string; path: string };

export function breadcrumbLd(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

// ---------------------------------------------------------------------------
// FAQPage
// ---------------------------------------------------------------------------

export type FaqEntry = { q: string; a: string };

export function faqLd(faqs: FaqEntry[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// HowTo — for stain-guide entries
// ---------------------------------------------------------------------------

export type HowToInput = {
  name: string;
  description: string;
  image?: string;
  totalTimeMinutes?: number;
  supplies?: string[];
  steps: string[];
};

export function howToLd(input: HowToInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.totalTimeMinutes
      ? { totalTime: `PT${input.totalTimeMinutes}M` }
      : {}),
    ...(input.supplies
      ? {
          supply: input.supplies.map((s) => ({
            "@type": "HowToSupply",
            name: s,
          })),
        }
      : {}),
    step: input.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
}

// ---------------------------------------------------------------------------
// AggregateRating + Reviews
// ---------------------------------------------------------------------------

export type ReviewInput = {
  author: string;
  body: string;
  rating: number; // 1–5
  date?: string; // YYYY-MM-DD
};

/**
 * Brand-level AggregateRating + a few featured Review nodes attached to
 * the Organization schema. Pasting this on the home page makes the brand
 * eligible for star-rating rich snippets in Google search results.
 *
 * Why attached to the brand and not individual products: until each SKU
 * has its own review pool, the trustworthier signal is "Wasro overall is
 * rated 4.X by N users". Once per-SKU reviews exist, switch to attaching
 * each review to the matching Product node instead.
 */
export function brandAggregateRatingLd(input: {
  average: number;
  count: number;
  featured?: ReviewInput[];
}): JsonLd {
  const body: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#org-rating"),
    name: SITE.brand,
    url: SITE.url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: input.average,
      reviewCount: input.count,
      bestRating: 5,
      worstRating: 1,
    },
  };
  if (input.featured && input.featured.length > 0) {
    body.review = input.featured.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(r.date ? { datePublished: r.date } : {}),
    }));
  }
  return body;
}

// ---------------------------------------------------------------------------
// CollectionPage wrapper for ItemList pages (products, stains)
// ---------------------------------------------------------------------------

export type CollectionLdInput = {
  name: string;
  description: string;
  path: string;
  itemList: JsonLd;
};

export function collectionPageLd(input: CollectionLdInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(`${input.path}#collection`),
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntity: input.itemList,
  };
}

// ---------------------------------------------------------------------------
// <JsonLd /> component — keeps page files clean
// ---------------------------------------------------------------------------

/**
 * Render one or more JSON-LD blobs as `<script type="application/ld+json">`.
 *
 * Use one component per page (passing an array if multiple schemas). Each
 * blob becomes its own script tag for easier validator debugging.
 */
export function JsonLd({ data }: { data: JsonLd | JsonLd[] }) {
  const blobs = Array.isArray(data) ? data : [data];
  return (
    <>
      {blobs.map((blob, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Stringify with no whitespace — saves a few bytes vs pretty-print
          // and avoids weird HTML-encoding issues with `dangerouslySetInnerHTML`.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blob) }}
        />
      ))}
    </>
  );
}
