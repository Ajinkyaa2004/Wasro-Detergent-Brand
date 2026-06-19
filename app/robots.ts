import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

/**
 * robots.txt for wasro.in.
 *
 * - Allow all crawlers everywhere except /api/ (form-submission endpoint).
 * - Point them at the dynamic sitemap.
 * - Set the canonical host so Google picks the right hostname when there
 *   are redirects from www → apex (or vice-versa).
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/   — form-submission endpoint, no value to index
        // /admin/ — staff-only, the layout also sets robots: noindex
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
