import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

/**
 * robots.txt for www.wasro.in.
 *
 * - Allow all crawlers everywhere except /api/ + /admin/.
 * - Point them at the dynamic sitemap (now on the www canonical host).
 *
 * NOTE: the non-standard `Host:` directive was removed — Google does not
 * honour it (it was a Yandex directive), and canonical host selection is
 * handled correctly by our self-referencing canonical tags + the apex→www
 * 308 redirect. Keeping it risked signalling an inconsistent host.
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
  };
}
