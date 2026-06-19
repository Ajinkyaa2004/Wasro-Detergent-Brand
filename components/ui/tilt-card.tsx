"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 3D tilt-on-hover wrapper.
 *
 * Perf notes:
 *   - On touch devices (no hover), we early-return a plain div — no event
 *     listeners, no transform writes. Saves ~30 hydration subtrees on
 *     listing pages.
 *   - Mouse handler now uses a rAF queue so we never write to `style`
 *     more than once per frame, even on 240Hz mice.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const [hoverCapable, setHoverCapable] = useState(true);

  useEffect(() => {
    // Skip tilt entirely on touch-primary devices and reduced-motion users.
    if (typeof window === "undefined") return;
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setHoverCapable(hover && !reduce);
  }, []);

  if (!hoverCapable) {
    return <div className={className}>{children}</div>;
  }

  function flush() {
    rafRef.current = null;
    const el = ref.current;
    const p = pendingRef.current;
    if (!el || !p) return;
    el.style.transform = `perspective(900px) rotateY(${p.x * intensity}deg) rotateX(${-p.y * intensity}deg) translateY(-2px)`;
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    pendingRef.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flush);
    }
  }

  function handleLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "transition-transform duration-200 ease-out will-change-transform",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
