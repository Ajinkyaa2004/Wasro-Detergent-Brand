"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DistributorCard } from "./distributor-card";
import type { CityGroup } from "@/lib/distributors-utils";

export function CityAccordion({
  group,
  defaultOpen = false,
}: {
  group: CityGroup;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-wasro-border transition hover:ring-wasro-blue/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-wasro-cream"
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-pill transition",
              open
                ? "bg-wasro-blue text-white"
                : "bg-wasro-blue-light text-wasro-blue-dark"
            )}
          >
            <MapPin size={16} />
          </span>
          <div>
            <h4 className="text-lg font-bold leading-tight text-wasro-charcoal">
              {group.city}
            </h4>
            <p className="text-xs text-wasro-slate">
              {group.distributors.length}{" "}
              {group.distributors.length === 1 ? "distributor" : "distributors"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-pill bg-wasro-blue-light px-2.5 py-1 text-[11px] font-bold text-wasro-blue-dark">
            {group.distributors.length}
          </span>
          <ChevronDown
            size={20}
            className={cn(
              "text-wasro-blue transition-transform duration-300",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      <div
        className={cn(
          "grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-4 border-t border-wasro-border p-5 md:grid-cols-2 lg:grid-cols-3">
            {group.distributors.map((d) => (
              <DistributorCard key={d.id} distributor={d} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
