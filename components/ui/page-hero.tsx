import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BubbleField } from "@/components/ui/bubble-field";
import { Reveal } from "@/components/ui/reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  variant = "cream",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  variant?: "cream" | "blue";
  children?: ReactNode;
}) {
  const isBlue = variant === "blue";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        isBlue
          ? "border-wasro-blue-dark bg-wasro-blue text-wasro-cream"
          : "border-wasro-border bg-white"
      )}
    >
      {isBlue ? (
        // Blue variant — keep existing simpler treatment for contrast
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            className="wasro-mesh-blob absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.16), transparent 65%)",
            }}
          />
          <div
            className="wasro-mesh-blob absolute -right-20 -bottom-20 h-[360px] w-[360px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(244,196,48,0.22), transparent 65%)",
              animationDelay: "-8s",
            }}
          />
        </div>
      ) : (
        // Bright white variant — same animated mesh blob field as the home hero
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Powder-blue glow — top-left */}
          <div
            className="wasro-mesh-blob absolute h-[640px] w-[640px] rounded-full"
            style={{
              left: "-15%",
              top: "-20%",
              background:
                "radial-gradient(circle at center, rgba(135,189,233,0.38) 0%, rgba(135,189,233,0.18) 35%, transparent 70%)",
            }}
          />
          {/* Sunshine yellow — bottom-right */}
          <div
            className="wasro-mesh-blob absolute h-[560px] w-[560px] rounded-full"
            style={{
              right: "-10%",
              bottom: "-25%",
              background:
                "radial-gradient(circle at center, rgba(252,211,77,0.32) 0%, rgba(252,211,77,0.15) 35%, transparent 70%)",
              animationDelay: "-8s",
            }}
          />
          {/* Coral pink — upper-right */}
          <div
            className="wasro-mesh-blob absolute h-[400px] w-[400px] rounded-full"
            style={{
              right: "15%",
              top: "-10%",
              background:
                "radial-gradient(circle at center, rgba(251,113,133,0.22) 0%, rgba(251,113,133,0.10) 35%, transparent 70%)",
              animationDelay: "-20s",
            }}
          />
          {/* Wasro blue — mid-left */}
          <div
            className="wasro-mesh-blob absolute h-[460px] w-[460px] rounded-full"
            style={{
              left: "22%",
              bottom: "-15%",
              background:
                "radial-gradient(circle at center, rgba(59,130,246,0.20) 0%, rgba(59,130,246,0.10) 35%, transparent 70%)",
              animationDelay: "-14s",
            }}
          />
          {/* Lavender — center */}
          <div
            className="wasro-mesh-blob absolute h-[380px] w-[380px] rounded-full"
            style={{
              left: "45%",
              top: "20%",
              background:
                "radial-gradient(circle at center, rgba(196,181,253,0.20) 0%, rgba(196,181,253,0.08) 40%, transparent 75%)",
              animationDelay: "-26s",
            }}
          />
        </div>
      )}

      <BubbleField
        count={isBlue ? 7 : 8}
        seed={isBlue ? 13 : 17}
        tone={isBlue ? "light" : "dark"}
        className="opacity-50"
      />

      {/* `pt-28` on mobile clears the fixed 80px navbar. */}
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 md:px-8 md:py-20">
        <Reveal>
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.22em]",
              isBlue ? "text-wasro-cream/80" : "text-wasro-blue"
            )}
          >
            {eyebrow}
          </span>
          <h1
            className={cn(
              "mt-2 max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight md:text-6xl pb-1",
              isBlue ? "text-wasro-cream" : "text-wasro-charcoal"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-5 max-w-2xl text-lg leading-relaxed",
                isBlue ? "text-wasro-cream/85" : "text-wasro-slate"
              )}
            >
              {subtitle}
            </p>
          )}
        </Reveal>

        {children && <div className="relative mt-8">{children}</div>}
      </div>
    </section>
  );
}
