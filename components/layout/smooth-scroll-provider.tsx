"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenis-ref";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect reduced-motion preference — skip Lenis entirely
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    // Expose the instance globally so any component on the page (route-change
    // listener, state-filter buttons, etc.) can trigger smooth scrolls via
    // `smoothScrollTo()` from lib/lenis-ref.
    setLenisInstance(lenis);

    let raf = 0;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // Recalculate Lenis dimensions whenever the page height changes.
    // Without this, late-loading images/fonts/animations grow the document
    // after Lenis has measured it once — and scrolling silently stops at the
    // old maxScroll value, which is the "have to Ctrl+/- to scroll further"
    // bug users were hitting.
    const resizeLenis = () => lenis.resize();

    const resizeObserver = new ResizeObserver(() => {
      resizeLenis();
    });
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    // Catch image loads that fire after initial layout (lazy product cards,
    // ProductImage swaps, etc.) — they bump body height after ResizeObserver
    // has already fired its first callback.
    const onLoadCapture = (ev: Event) => {
      const t = ev.target as HTMLElement | null;
      if (!t) return;
      if (t.tagName === "IMG" || t.tagName === "IFRAME") {
        // Run after the browser commits the new size
        requestAnimationFrame(resizeLenis);
      }
    };
    window.addEventListener("load", resizeLenis);
    document.addEventListener("load", onLoadCapture, true);
    window.addEventListener("resize", resizeLenis);
    // Run after fonts have applied, which can shift heights significantly
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(resizeLenis).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("load", resizeLenis);
      document.removeEventListener("load", onLoadCapture, true);
      window.removeEventListener("resize", resizeLenis);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
