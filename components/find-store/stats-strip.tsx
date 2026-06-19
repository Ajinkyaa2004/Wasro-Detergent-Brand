import { Store, MapPin, Building2, Award } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { getTopCities } from "@/lib/distributors-utils";
import type { Distributor } from "@/data/distributors";

export function StatsStrip({ distributors }: { distributors: Distributor[] }) {
  const stateCount = new Set(distributors.map((d) => d.state)).size;
  const cityCount = new Set(distributors.map((d) => `${d.city}|${d.state}`))
    .size;
  const topCities = getTopCities(distributors, 4);

  return (
    <div className="grid grid-cols-1 gap-4 rounded-[1.5rem] bg-wasro-blue p-6 text-wasro-cream shadow-xl md:grid-cols-[1fr_1.5fr] md:gap-6 md:p-8">
      {/* Stats side */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock
          icon={Store}
          value={distributors.length}
          suffix="+"
          label="Stores"
        />
        <StatBlock
          icon={MapPin}
          value={stateCount}
          label="States"
        />
        <StatBlock
          icon={Building2}
          value={cityCount}
          suffix="+"
          label="Cities"
        />
      </div>

      {/* Top cities side */}
      <div className="rounded-[1rem] bg-white/10 p-5 backdrop-blur">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-wasro-yellow">
          <Award size={14} /> Top distribution hubs
        </div>
        <div className="flex flex-wrap gap-2">
          {topCities.map((c, i) => (
            <span
              key={`${c.city}-${c.state}`}
              className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-3 py-1.5 text-sm font-medium ring-1 ring-white/15"
            >
              <span
                className={
                  i === 0
                    ? "rounded-pill bg-wasro-yellow px-2 py-0.5 text-[10px] font-bold text-wasro-charcoal"
                    : "text-xs font-bold text-wasro-yellow"
                }
              >
                #{i + 1}
              </span>
              {c.city}
              <span className="text-wasro-cream/65">· {c.count}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  value,
  suffix,
  label,
}: {
  icon: typeof Store;
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1rem] bg-white/10 px-3 py-5 text-center backdrop-blur">
      <Icon size={20} className="mb-2 text-wasro-yellow" />
      <div className="text-3xl font-bold leading-none tracking-tight md:text-4xl">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-wasro-cream/75">
        {label}
      </div>
    </div>
  );
}
