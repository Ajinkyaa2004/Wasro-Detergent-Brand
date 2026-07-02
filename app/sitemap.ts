import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { SITE } from "@/lib/utils";

/**
 * Dynamic sitemap for www.wasro.in.
 *
 * Priorities (by importance):
 *   1.00  /          (home)
 *   0.95  /products  (catalogue — also carries all 14 pack images)
 *   0.90  /bulk-orders
 *   0.85  /stain-guide, /about
 *   0.40  /shipping, /returns
 *   0.30  /privacy, /terms
 *
 * lastModified uses a stable module constant — NOT `new Date()`. A live
 * timestamp made every entry report "modified now" on every crawl, which
 * trains Google to ignore the lastmod signal. Bump LASTMOD only when the
 * site's content materially changes.
 *
 * Product pack images are attached as <image:image> children of the single
 * /products <loc> (the correct sitemap-image pattern for Google Image
 * indexing). Per-SKU `/products#<sku>` fragment URLs were removed — Google
 * ignores URL fragments for indexing, so they added no indexable URLs.
 */
const LASTMOD = "2026-07-02";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");

  const entries = [
    { url: `${base}/`, lastModified: LASTMOD, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${base}/products`,
      lastModified: LASTMOD,
      changeFrequency: "weekly",
      priority: 0.95,
      // All 14 pack images attached to the one catalogue URL (image:image
      // sitemap extension). Not in the official MetadataRoute type, but
      // emitted correctly by Next 15+ — hence the cast below.
      images: PRODUCTS.map((p) => `${base}${p.image}`),
    },
    { url: `${base}/bulk-orders`, lastModified: LASTMOD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/stain-guide`, lastModified: LASTMOD, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/about`, lastModified: LASTMOD, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/shipping`, lastModified: LASTMOD, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/returns`, lastModified: LASTMOD, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: LASTMOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: LASTMOD, changeFrequency: "yearly", priority: 0.3 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any;

  return entries;
}
