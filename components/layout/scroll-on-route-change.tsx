"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { smoothScrollTo } from "@/lib/lenis-ref";

/**
 * Restores the "land at top of new page" behaviour that Lenis breaks.
 *
 * Why this is needed:
 *   - Next.js App Router normally scrolls to the top on cross-page
 *     navigation (e.g. clicking <Link href="/bulk-orders"> when scrolled
 *     halfway down /).
 *   - When a custom scroll library like Lenis hijacks scrolling, Next's
 *     `window.scrollTo(0,0)` runs but Lenis's internal `targetScroll`
 *     stays at the old value — the page snaps back within a frame.
 *   - This component watches `usePathname()` and calls our shared
 *     `smoothScrollTo(0)`, which routes through Lenis (or native, if
 *     Lenis is disabled for reduced-motion users).
 *
 * Behavioural rules:
 *   - Hash navigations (`/page#section`) are left alone — Next.js still
 *     handles those correctly via the browser's native anchor jump.
 *   - The very first mount is skipped (the user just opened the page;
 *     scroll is already at 0).
 *   - The scroll is `immediate: true` because cross-page navigation
 *     should feel instant — animating through the OLD page's content
 *     as the NEW page mounts looks like a glitch.
 */
export function ScrollOnRouteChange() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    // Skip if the URL has a hash — Next.js will scroll to the anchor.
    if (window.location.hash) return;

    // Run on the next frame so the new page has had a chance to mount and
    // Lenis has had time to re-measure document height.
    requestAnimationFrame(() => {
      smoothScrollTo(0, { immediate: true });
    });
  }, [pathname]);

  return null;
}
