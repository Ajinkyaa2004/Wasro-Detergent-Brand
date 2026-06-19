"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { Distributor } from "@/data/distributors";
import { groupByStateAndCity } from "@/lib/distributors-utils";
import { smoothScrollTo } from "@/lib/lenis-ref";
import { StateTabs } from "./state-tabs";
import { StatsStrip } from "./stats-strip";
import { CityAccordion } from "./city-accordion";
import { DistributorCard } from "./distributor-card";
import { NearestStoresButton } from "./nearest-button";
import { BecomeDistributor } from "./become-distributor";

// When the state filter changes, scroll the store list so its top sits
// just under the navbar (80px) + sticky state-tabs bar (~64px). The 8px
// extra is a comfort gap so the result-count header isn't kissing the
// sticky bar's bottom edge.
const SCROLL_OFFSET_PX = -(80 + 64 + 8);

// Lazy-load the constellation SVG. It's the heaviest piece of this page
// (200+ SVG nodes, SMIL animations, O(n^2) line generation) but it's
// purely decorative on first paint — defer it so the search box and
// distributor list become interactive immediately.
const IndiaConstellation = dynamic(
  () => import("./india-constellation").then((m) => m.IndiaConstellation),
  {
    ssr: true,
    loading: () => (
      <div
        aria-hidden
        className="w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-wasro-blue-light/40 via-white to-wasro-cream-dark ring-1 ring-wasro-border"
        style={{ aspectRatio: "600 / 420", minHeight: 320 }}
      />
    ),
  }
);

export function FindStoreClient({
  distributors,
}: {
  distributors: Distributor[];
}) {
  // null = "All states"
  const [activeState, setActiveState] = useState<string | null>("Assam");
  const [query, setQuery] = useState("");
  const [openCity, setOpenCity] = useState<string | null>(null);

  // Anchor for the result-count header — we scroll here on state changes
  // (and on "find nearest" jumps) so the user lands at the START of the
  // filtered list, not somewhere deep in the previous state's stores.
  const listAnchorRef = useRef<HTMLDivElement>(null);
  // Skip the initial mount scroll (the default state is "Assam" — page
  // already starts at top, no need to animate).
  const isFirstStateRender = useRef(true);

  useEffect(() => {
    if (isFirstStateRender.current) {
      isFirstStateRender.current = false;
      return;
    }
    if (!listAnchorRef.current) return;
    // Defer to the next frame so React has committed the new filtered
    // list and Lenis has re-measured the document.
    requestAnimationFrame(() => {
      if (listAnchorRef.current) {
        smoothScrollTo(listAnchorRef.current, {
          offset: SCROLL_OFFSET_PX,
          duration: 0.9,
        });
      }
    });
  }, [activeState]);

  const allBuckets = useMemo(
    () => groupByStateAndCity(distributors),
    [distributors]
  );

  const stateSummaries = useMemo(
    () => allBuckets.map((b) => ({ state: b.state, count: b.count })),
    [allBuckets]
  );

  // Filter pipeline: state -> query
  const filteredBuckets = useMemo(() => {
    let buckets = allBuckets;
    if (activeState) buckets = buckets.filter((b) => b.state === activeState);
    if (query.trim()) {
      const q = query.toLowerCase();
      buckets = buckets
        .map((b) => ({
          ...b,
          cities: b.cities
            .map((c) => ({
              ...c,
              distributors: c.distributors.filter(
                (d) =>
                  d.name.toLowerCase().includes(q) ||
                  d.address.toLowerCase().includes(q) ||
                  d.city.toLowerCase().includes(q)
              ),
            }))
            .filter((c) => c.distributors.length > 0),
        }))
        .filter((b) => b.cities.length > 0);
    }
    return buckets;
  }, [allBuckets, activeState, query]);

  const filteredCount = useMemo(
    () =>
      filteredBuckets.reduce(
        (sum, b) => sum + b.cities.reduce((s, c) => s + c.distributors.length, 0),
        0
      ),
    [filteredBuckets]
  );

  function handleNearestState(state: string) {
    setActiveState(state);
    setQuery("");
    // Note: the `activeState` effect above will trigger the smooth scroll
    // once React commits. No explicit setTimeout / scrollIntoView needed —
    // that older path bypassed Lenis and produced a janky double-scroll.
  }

  return (
    <div className="space-y-10">
      {/* Stats banner */}
      <StatsStrip distributors={distributors} />

      {/* India constellation map */}
      <IndiaConstellation
        distributors={distributors}
        activeState={activeState}
        onSelect={setActiveState}
      />

      {/* State tabs (sticky) */}
      <StateTabs
        states={stateSummaries}
        activeState={activeState}
        onSelect={(s) => {
          setActiveState(s);
          setOpenCity(null);
        }}
      />

      {/* Search + Nearest */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-wasro-slate"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by store name, city, or area..."
            className="h-12 w-full rounded-pill bg-white px-12 text-sm text-wasro-charcoal ring-1 ring-wasro-border placeholder:text-wasro-slate focus:outline-none focus:ring-2 focus:ring-wasro-blue"
          />
        </div>
        <NearestStoresButton onNearestState={handleNearestState} />
      </div>

      {/* Result count — also the scroll anchor for state-filter changes.
          Keeps `id="distributor-list"` for any other deep-link consumers. */}
      <div
        id="distributor-list"
        ref={listAnchorRef}
        className="flex scroll-mt-44 items-baseline gap-2"
      >
        <span className="text-4xl font-bold text-wasro-blue md:text-5xl">
          {filteredCount}
        </span>
        <span className="text-base text-wasro-slate">
          {filteredCount === 1 ? "store" : "stores"} found
          {activeState ? ` in ${activeState}` : " across all states"}
          {query ? ` matching "${query}"` : ""}
        </span>
      </div>

      {/* Distributor list */}
      {filteredBuckets.length === 0 ? (
        <div className="rounded-[1.5rem] bg-white p-12 text-center ring-1 ring-wasro-border">
          <p className="text-lg font-bold text-wasro-charcoal">
            No stores match your filters.
          </p>
          <p className="mt-2 text-sm text-wasro-slate">
            Try clearing the search or picking a different state. For bulk
            orders we ship pan-India — see the Bulk Orders page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBuckets.map((bucket) => (
            <div key={bucket.state} className="space-y-4">
              {!activeState && (
                <h3 className="flex items-center gap-2 px-1 text-lg font-bold uppercase tracking-wider text-wasro-charcoal">
                  {bucket.state}
                  <span className="rounded-pill bg-wasro-blue-light px-2.5 py-0.5 text-xs text-wasro-blue-dark">
                    {bucket.count}
                  </span>
                </h3>
              )}
              {bucket.cities.length === 1 ? (
                // Single city — render cards directly without accordion
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {bucket.cities[0].distributors.map((d) => (
                    <DistributorCard key={d.id} distributor={d} />
                  ))}
                </div>
              ) : (
                bucket.cities.map((cityGroup, idx) => (
                  <CityAccordion
                    key={`${bucket.state}-${cityGroup.city}`}
                    group={cityGroup}
                    // Auto-open the biggest city for each state
                    defaultOpen={
                      openCity === `${bucket.state}-${cityGroup.city}` ||
                      (openCity === null && idx === 0)
                    }
                  />
                ))
              )}
            </div>
          ))}
        </div>
      )}

      {/* Become a Wasro distributor CTA */}
      <BecomeDistributor />
    </div>
  );
}
