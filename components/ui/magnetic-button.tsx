"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Button wrapper that "pulls" toward the cursor on hover.
 *
 * Perf notes:
 *   - Skipped entirely on touch devices (no hover) and reduced-motion users.
 *   - Mousemove writes are queued through rAF so we never call `style` more
 *     than once per frame.
 */
export function MagneticButton({
  children,
  strength = 0.3,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ dx: number; dy: number } | null>(null);
  const [hoverCapable, setHoverCapable] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setHoverCapable(hover && !reduce);
  }, []);

  // The Tag prop is just for semantics; we use a div by default
  void Tag;

  if (!hoverCapable) {
    return <div className={cn("inline-block", className)}>{children}</div>;
  }

  function flush() {
    rafRef.current = null;
    const el = ref.current;
    const p = pendingRef.current;
    if (!el || !p) return;
    el.style.transform = `translate3d(${p.dx}px, ${p.dy}px, 0)`;
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    pendingRef.current = {
      dx: (e.clientX - cx) * strength,
      dy: (e.clientY - cy) * strength,
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
    el.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "inline-block transition-transform duration-300 ease-out will-change-transform",
        className
      )}
    >
      {children}
    </div>
  );
}
