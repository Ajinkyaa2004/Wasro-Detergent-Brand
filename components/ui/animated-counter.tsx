"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Number that ramps from 0 → `value` once it scrolls into view.
 *
 * CLS-safe: the rendered character count changes during the ramp
 * (e.g. "5 → 121"), so we:
 *   - pad with a hidden span containing the FINAL value to reserve width
 *   - apply `font-variant-numeric: tabular-nums` so every digit occupies
 *     the same advance-width regardless of which glyph is rendered
 *
 * Net effect: zero layout shift during the count-up animation.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const [hasMounted, setHasMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  // SSR / first paint renders the final value (no flicker, no CLS).
  // On client mount we drop to 0 and ramp up.
  useEffect(() => {
    setHasMounted(true);
    setShown(0);

    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(Math.round(value * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  const finalDisplay = value.toLocaleString("en-IN");
  const currentDisplay = (hasMounted ? shown : value).toLocaleString("en-IN");

  return (
    <span
      ref={ref}
      className={className}
      style={{
        // Tabular figures: every digit is the same width, so "5" → "55"
        // doesn't reflow surrounding text.
        fontVariantNumeric: "tabular-nums",
        // Inline-block so the contained hidden span actually reserves space.
        display: "inline-block",
        position: "relative",
      }}
    >
      {/* Visible counter */}
      <span style={{ visibility: "visible" }}>
        {prefix}
        {currentDisplay}
        {suffix}
      </span>
      {/* Width reservation — pads to the final rendered width.
          aria-hidden so screen readers don't read it twice. */}
      <span
        aria-hidden
        style={{
          visibility: "hidden",
          position: "absolute",
          left: 0,
          top: 0,
          pointerEvents: "none",
        }}
      >
        {prefix}
        {finalDisplay}
        {suffix}
      </span>
    </span>
  );
}
