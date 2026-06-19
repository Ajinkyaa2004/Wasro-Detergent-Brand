import { cn } from "@/lib/utils";

type Bubble = {
  size: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
};

function makeBubbles(count: number, seed: number): Bubble[] {
  // Deterministic pseudo-random so SSR + client agree
  const out: Bubble[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    out.push({
      size: 12 + Math.floor(rand() * 60),
      left: rand() * 100,
      delay: rand() * 14,
      duration: 9 + rand() * 12,
      drift: -40 + rand() * 80,
      opacity: 0.25 + rand() * 0.45,
    });
  }
  return out;
}

/**
 * Floating-bubble decoration.
 *
 * Perf notes:
 *   - The keyframes are emitted ONCE per page via the global `bubble-field-keyframes`
 *     class; previously every instance shipped its own `<style>` block.
 *   - `drop-shadow` filter removed — too expensive on mobile (full repaint
 *     each frame per bubble). The bubble SVG already has a highlight ellipse
 *     so they read fine without the shadow.
 *   - On screens <=640px we hide the back half of bubbles via CSS to cut
 *     paint cost roughly in half on phones without changing desktop.
 */
export function BubbleField({
  count = 18,
  seed = 7,
  tone = "light",
  className,
}: {
  count?: number;
  seed?: number;
  tone?: "light" | "dark";
  className?: string;
}) {
  const bubbles = makeBubbles(count, seed);
  const stroke =
    tone === "dark"
      ? "rgba(15, 66, 117, 0.55)"
      : "rgba(255, 255, 255, 0.85)";
  const fill =
    tone === "dark"
      ? "rgba(214, 232, 245, 0.25)"
      : "rgba(255, 255, 255, 0.18)";

  return (
    <div
      aria-hidden
      className={cn(
        "wasro-bubble-field pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {bubbles.map((b, i) => (
        <span
          key={i}
          // `data-half` lets us hide the back half on mobile via CSS without
          // a parallel JS branch.
          data-half={i % 2 === 0 ? "front" : "back"}
          className="wasro-bubble"
          style={{
            position: "absolute",
            left: `${b.left}%`,
            bottom: `-${b.size + 20}px`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            ["--bubble-drift" as string]: `${b.drift}px`,
          } as React.CSSProperties}
        >
          <svg
            viewBox="0 0 40 40"
            width="100%"
            height="100%"
            style={{ display: "block" }}
          >
            <circle
              cx="20"
              cy="20"
              r="18"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.2"
            />
            <ellipse
              cx="14"
              cy="13"
              rx="4"
              ry="2.5"
              fill="rgba(255,255,255,0.7)"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
