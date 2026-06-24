import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { SITE } from "@/lib/utils";

/**
 * Dynamic sitemap for wasro.in.
 *
 * Lists every indexable route on the site with priorities + change-
 * frequency hints tuned by importance:
 *
 *   1.00  /          (home)
 *   0.95  /products  (catalogue)
 *   0.90  /find-store, /bulk-orders
 *   0.85  /stain-guide, /about
 *   0.80  product anchors (15 SKU deep-links)
 *   0.30  legal pages
 *
 * Each product anchor entry carries `images: [productPng]` so Google
 * Image search can index the SKU PNG and surface it under "Wasro 1kg
 * detergent" image queries. The Next types don't officially expose
 * `images` on Sitemap entries, but Google honours it when the resulting
 * XML uses the `<image:image>` extension — we cast through `any` to
 * emit it cleanly.
 *
 * If you add a new top-level route under `app/`, list it here too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const topLevel: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/bulk-orders`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/stain-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/shipping`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/returns`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Per-SKU deep-links. The product cards live inside the categorised
  // sections on /products and each section is `id={category.id}`; we point
  // to those anchors. Google honours the URL but treats #fragments
  // identically for indexing, so this also serves as a hint for
  // canonicalisation when a user shares a deep link.
  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    url: `${base}/products#${p.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${base}${p.image}`],
    // Cast — `images` is a Google extension, not in MetadataRoute.Sitemap types
    // but emitted correctly by Next 15+ when present.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;

  return [...topLevel, ...productEntries];
}
