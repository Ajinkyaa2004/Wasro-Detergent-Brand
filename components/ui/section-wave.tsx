import { cn } from "@/lib/utils";

/**
 * Smooth wave transition between two adjacent sections of different colors.
 * The wave SVG is rendered double-width (two tile copies) and slowly translated
 * horizontally — back layer slow, front layer faster and reversed — so the
 * water visibly flows.
 *
 * `from` = bg color of the section above this divider.
 * `to`   = bg color of the section below — the wave shape is filled in this color.
 *
 * Responsive: the `height` prop is the desktop value. On mobile the
 * `.wasro-section-wave` class kicks in (defined in globals.css) and caps the
 * height at `clamp(32px, 6vw, 56px)` so the wave doesn't dominate small
 * screens. One CSS rule covers every instance — no per-instance `<style>`.
 */
export function SectionWave({
  from,
  to,
  className,
  height = 70,
  flip = false,
}: {
  from: string;
  to: string;
  className?: string;
  height?: number;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "wasro-section-wave relative w-full overflow-hidden leading-[0]",
        className
      )}
      style={{ background: from, height }}
    >
      {/* Back wave — slower, lower opacity */}
      <svg
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        className={cn(
          "wasro-wave-back absolute inset-0 block h-full w-[200%]",
          flip && "rotate-180"
        )}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,20 1440,50 L1440,100 L0,100 Z M1440,40 C1680,80 1920,0 2160,40 C2400,80 2640,20 2880,50 L2880,100 L1440,100 Z"
          fill={to}
          opacity="0.55"
        />
      </svg>

      {/* Front wave — slightly faster, opposite direction, full opacity */}
      <svg
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        className={cn(
          "wasro-wave-front absolute inset-0 block h-full w-[200%]",
          flip && "rotate-180"
        )}
      >
        <path
          d="M0,55 C200,90 460,15 720,55 C980,95 1240,30 1440,65 L1440,100 L0,100 Z M1440,55 C1640,90 1900,15 2160,55 C2420,95 2680,30 2880,65 L2880,100 L1440,100 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
