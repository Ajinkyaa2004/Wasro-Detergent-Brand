import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { ScrollOnRouteChange } from "@/components/layout/scroll-on-route-change";
import { SITE } from "@/lib/utils";
import {
  JsonLd,
  organizationLd,
  websiteLd,
  absoluteUrl,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Self-hosted General Sans (display / headings). Previously loaded via a
// render-blocking Fontshare <link rel="stylesheet"> on the LCP critical
// path; self-hosting via next/font eliminates the third-party round-trip
// and lets Next preload the exact woff2s with no external request.
const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

// ---------------------------------------------------------------------------
// Root metadata — applies to every page unless overridden via the page's own
// generateMetadata / metadata export.
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — ${SITE.tagline}`,
    template: `%s | ${SITE.brand}`,
  },
  description:
    "Wasro detergent powders, dishwash bars, and clothwash bars by Madhav Industries — manufactured in Assam, trusted at 121+ stores across Northeast India. Free gift in every family pack. Available on Swiggy Instamart, Blinkit, BigBasket, JioMart & Flipkart.",
  applicationName: SITE.brand,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "shopping",
  classification: "FMCG · Home Care · Detergent",
  keywords: [
    "Wasro",
    "Wasro detergent",
    "Wasro detergent powder",
    "Wasro dishwash bar",
    "Wasro dishwash tub",
    "Wasro clothwash bar",
    "Madhav Industries",
    "detergent powder Assam",
    "best detergent powder India",
    "Northeast India detergent brand",
    "Indian detergent brand",
    "dishwash bar India",
    "buy detergent online India",
    "Wasro Guwahati",
    "wholesale detergent supplier",
    "bulk detergent orders",
  ],
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.brand,
    title: `${SITE.brand} — ${SITE.tagline}`,
    description:
      "Detergent powders, dishwash bars & clothwash bars by Madhav Industries. Made in Assam. Free gift in every family pack.",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Wasro — Trusted Clean for Every Indian Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} — ${SITE.tagline}`,
    description:
      "Detergent powders, dishwash bars & clothwash bars by Madhav Industries. Made in Assam. Free gift in every family pack.",
    images: [absoluteUrl("/opengraph-image")],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Next.js App Router auto-discovers `app/icon.png` and `app/apple-icon.png`
  // (file-based metadata conventions). We still emit the favicon.ico
  // explicitly for old browsers + Windows pinned-tab shortcuts.
  //
  // Source: `public/logo1-cropped.png` (bg-removed Wasro logo) →
  // generated via tools/generate-favicons.py into:
  //   app/favicon.ico       (multi-res: 16/32/48/64/128/256)
  //   app/icon.png          (512×512, auto-emitted as <link rel="icon">)
  //   app/apple-icon.png    (180×180, auto-emitted as apple-touch-icon)
  //   public/icon-192.png   (manifest)
  //   public/icon-512.png   (manifest + maskable variant)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      // Sizes pulled from the generated PNGs; iOS picks the closest match.
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

// ---------------------------------------------------------------------------
// Viewport — separated per Next 15+ convention. Includes themeColor for
// browser chrome tinting on mobile (matches Wasro brand blue).
// ---------------------------------------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B5FA8" },
    { media: "(prefers-color-scheme: dark)", color: "#0F4275" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      dir="ltr"
      className={`${inter.variable} ${generalSans.variable} h-full antialiased`}
    >
      <head>
        {/* General Sans is now self-hosted via next/font/local (see
            layout.tsx) — no more render-blocking Fontshare stylesheet on
            the LCP critical path. Next preloads the exact woff2s itself. */}
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* NOTE on LCP preload: we intentionally do NOT emit a manual
            `<link rel="preload" href="/products/powder-2kg.webp">` here.
            Next/Image's `priority` flag already generates a preload for
            the OPTIMIZED variant (`/_next/image?url=...&w=...`); manually
            preloading the raw file triggers a "resource was preloaded but
            not used" console warning because Chrome ends up loading the
            optimized URL instead. The priority+sizes combo on
            <ProductImage> is sufficient. */}
        {/* Site-wide JSON-LD: Organization + WebSite. These two graphs identify
            the brand to search engines and unlock Knowledge Panel + Sitelinks
            Search Box eligibility. */}
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-wasro-charcoal">
        <SmoothScrollProvider>
          {/* Resets scroll to top on every cross-page navigation.
              Lenis hijacks scrolling and breaks Next.js's default
              "land at top of new page" behaviour — this restores it. */}
          <ScrollOnRouteChange />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
        <FloatingWhatsApp />
        <CookieConsent />
      </body>
    </html>
  );
}
