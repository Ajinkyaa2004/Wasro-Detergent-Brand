import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

/**
 * Web App Manifest for wasro.in.
 *
 * Lets browsers (and Android Chrome's "Add to Home Screen") treat the
 * site as a PWA-style app icon. Also feeds metadata to search engines.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.brand} — ${SITE.tagline}`,
    short_name: SITE.brand,
    description:
      "Wasro detergent powders, dishwash bars, and clothwash bars by Madhav Industries — made in Assam, available at 121+ stores across Northeast India.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#1B5FA8",
    lang: "en-IN",
    dir: "ltr",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle", "business"],
    icons: [
      // Generated from the bg-removed `public/logo1-cropped.png` via
      // tools/generate-favicons.py. Square, transparent canvas.
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Maskable variant fills a wider safe area so Android's adaptive
      // icon mask doesn't crop the Wasro mark (Android can shave ~10%
      // off the edges depending on the launcher's icon shape).
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
