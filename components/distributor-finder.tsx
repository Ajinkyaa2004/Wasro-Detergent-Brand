"use client";

import { useMemo, useState } from "react";
import { MapPin, Phone, Search } from "lucide-react";
import type { Distributor } from "@/data/distributors";
import { cn } from "@/lib/utils";

export function DistributorFinder({
  distributors,
}: {
  distributors: Distributor[];
}) {
  const [state, setState] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  const states = useMemo(() => {
    const set = new Set(distributors.map((d) => d.state));
    return ["All", ...Array.from(set).sort()];
  }, [distributors]);

  const cities = useMemo(() => {
    const filtered =
      state === "All"
        ? distributors
        : distributors.filter((d) => d.state === state);
    const set = new Set(filtered.map((d) => d.city));
    return ["All", ...Array.from(set).sort()];
  }, [distributors, state]);

  const filtered = useMemo(() => {
    return distributors.filter((d) => {
      if (state !== "All" && d.state !== state) return false;
      if (city !== "All" && d.city !== city) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [distributors, state, city, query]);

  return (
    <div>
      <div className="mb-8 grid grid-cols-1 gap-3 rounded-card border border-wasro-border bg-white p-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wasro-slate"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by store name, address, or area..."
            className="h-11 w-full rounded-pill bg-wasro-cream px-10 text-sm text-wasro-charcoal placeholder:text-wasro-slate focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
          />
        </div>

        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setCity("All");
          }}
          className="h-11 rounded-pill bg-wasro-cream px-4 text-sm font-medium text-wasro-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All states" : s}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-11 rounded-pill bg-wasro-cream px-4 text-sm font-medium text-wasro-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All cities" : c}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-5 text-sm text-wasro-slate">
        Showing{" "}
        <strong className="text-2xl font-bold text-wasro-blue">
          {filtered.length}
        </strong>{" "}
        {filtered.length === 1 ? "store" : "stores"}
        {state !== "All" ? ` in ${state}` : ""}
        {city !== "All" ? `, ${city}` : ""}.
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-wasro-border bg-white p-10 text-center">
          <p className="text-base font-semibold text-wasro-charcoal">
            No stores match your filters.
          </p>
          <p className="mt-1 text-sm text-wasro-slate">
            Try clearing the search or pick a different state. For bulk
            orders we can ship pan-India — see the Bulk Orders page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DistributorCard key={d.id} distributor={d} />
          ))}
        </div>
      )}
    </div>
  );
}

function DistributorCard({ distributor }: { distributor: Distributor }) {
  return (
    <div className={cn(
      "group flex flex-col justify-between gap-4 rounded-card border border-wasro-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-wasro-blue/40 hover:shadow-xl hover:shadow-wasro-blue/10"
    )}>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-pill bg-wasro-blue-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-wasro-blue-dark transition group-hover:bg-wasro-blue group-hover:text-white">
            {distributor.state}
          </span>
          <span className="text-xs text-wasro-slate">{distributor.city}</span>
        </div>
        <h3 className="text-base font-semibold leading-tight text-wasro-charcoal">
          {distributor.name}
        </h3>
        <p className="mt-2 flex items-start gap-2 text-sm text-wasro-slate">
          <MapPin size={14} className="mt-0.5 shrink-0 text-wasro-blue" />
          <span>{distributor.address}</span>
        </p>
      </div>
      <a
        href={`tel:${distributor.phone}`}
        className="inline-flex items-center justify-center gap-2 rounded-pill bg-wasro-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-wasro-blue/20 transition hover:bg-wasro-blue-dark hover:shadow-lg hover:shadow-wasro-blue/30"
      >
        <Phone size={14} /> {distributor.phone}
      </a>
    </div>
  );
}
