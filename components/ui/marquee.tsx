import { cn } from "@/lib/utils";

export function Marquee({
  items,
  speedSeconds = 40,
  className,
}: {
  items: string[];
  speedSeconds?: number;
  className?: string;
}) {
  // Duplicate the items so the strip is continuous
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        className
      )}
    >
      <div
        className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 group-hover:[animation-play-state:paused]"
        style={{
          animationName: "wasro-marquee",
          animationDuration: `${speedSeconds}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {doubled.map((item, i) => (
          <MarqueeItem key={i} text={item} />
        ))}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 group-hover:[animation-play-state:paused]"
        style={{
          animationName: "wasro-marquee",
          animationDuration: `${speedSeconds}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {doubled.map((item, i) => (
          <MarqueeItem key={i} text={item} />
        ))}
      </div>

      <style>{`
        @keyframes wasro-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

function MarqueeItem({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-3 text-sm font-medium text-wasro-cream/80">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-wasro-yellow" />
      {text}
    </span>
  );
}
