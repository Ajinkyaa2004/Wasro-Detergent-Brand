"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered reveal wrapper.
 *
 * Perf notes:
 *   - Dropped the `blur-[2px]` filter animation — filter animations are
 *     not composited, so they trigger main-thread paint each frame on the
 *     entire subtree, which on a 14-product grid means measurable jank.
 *   - Only animates `opacity + translateY` — both GPU-composited.
 *   - Honours `prefers-reduced-motion` (renders visible immediately, skips
 *     the IntersectionObserver entirely).
 *   - Uses a single shared observer per page would be ideal at scale, but
 *     for our use-count (~30 instances) the dedicated observer is fine and
 *     keeps the API ergonomic.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "block w-full transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        className
      )}
      style={{
        transitionDelay: visible ? `${delay}s` : "0s",
        // Hint to the compositor only while transitioning — turning
        // will-change off afterwards lets the browser free GPU memory.
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
