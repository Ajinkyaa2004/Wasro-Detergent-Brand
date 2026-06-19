"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CyclingHeadline({
  words,
  intervalMs = 2600,
  className,
}: {
  words: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  // Reserve width based on the longest word so layout doesn't jump
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className={cn("relative inline-block align-bottom", className)}>
      <span aria-hidden className="invisible">
        {longest}
      </span>
      <span className="absolute inset-0 overflow-hidden">
        {words.map((word, idx) => (
          <span
            key={idx}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              idx === i
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            )}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
