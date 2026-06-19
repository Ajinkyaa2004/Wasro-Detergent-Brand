"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type RippleEntry = { id: number; x: number; y: number; size: number };

export function Ripple({
  children,
  className,
  color = "rgba(255,255,255,0.45)",
  rounded = true,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  rounded?: boolean;
}) {
  const [ripples, setRipples] = useState<RippleEntry[]>([]);

  function handlePointerDown(e: MouseEvent<HTMLSpanElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.floor(Math.random() * 1000);

    setRipples((prev) => [...prev, { id, x, y, size }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 750);
  }

  return (
    <span
      onMouseDown={handlePointerDown}
      className={cn(
        "relative inline-block overflow-hidden",
        rounded && "rounded-pill",
        className
      )}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full wasro-ripple"
          style={{
            width: r.size,
            height: r.size,
            top: r.y,
            left: r.x,
            background: color,
          }}
        />
      ))}
    </span>
  );
}
