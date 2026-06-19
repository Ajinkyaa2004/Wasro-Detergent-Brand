"use client";

import { useEffect, useState } from "react";
import { ChevronDown, MapPin, Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * State filter for the Find a Store page.
 *
 * Old design was a horizontal scroll of pill tabs — only ~3 fit on mobile,
 * felt cramped and required horizontal scroll-jacking to switch states.
 *
 * New design:
 *   - Sticky trigger pill (always visible at the top of the page once
 *     scrolled past the hero) shows the currently selected state + count.
 *   - Tapping the pill opens a bottom sheet (mobile) / centered modal
 *     (desktop) listing all 10 states with counts + descriptive helper
 *     text. One tap = filter + dismiss.
 *
 * Same component name, same props — find-store-client is untouched.
 */
export function StateTabs({
  states,
  activeState,
  onSelect,
}: {
  states: { state: string; count: number }[];
  activeState: string | null;
  onSelect: (state: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const totalCount = states.reduce((sum, s) => sum + s.count, 0);
  const currentLabel = activeState ?? "All states";
  const currentCount = activeState
    ? states.find((s) => s.state === activeState)?.count ?? 0
    : totalCount;

  // Filter the picker list by search query (only used inside the picker)
  const filtered = query
    ? states.filter((s) => s.state.toLowerCase().includes(query.toLowerCase()))
    : states;

  // Lock body scroll while picker is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes the picker
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Clear the search whenever the picker re-opens for a fresh experience
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  function pick(state: string | null) {
    onSelect(state);
    setOpen(false);
  }

  return (
    <>
      {/* Sticky trigger bar */}
      <div className="sticky top-20 z-30 -mx-5 border-y border-wasro-border bg-white/95 px-5 py-3 md:-mx-8 md:bg-white/80 md:px-8 md:backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          {/* Trigger pill */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(
              "group inline-flex flex-1 items-center gap-3 rounded-pill border bg-white px-3 py-2 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:px-4 md:flex-initial md:py-2.5",
              open
                ? "border-wasro-blue ring-2 ring-wasro-blue/15"
                : "border-wasro-border hover:border-wasro-blue/40"
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wasro-blue-light text-wasro-blue-dark transition-colors group-hover:bg-wasro-blue group-hover:text-white sm:h-9 sm:w-9">
              <MapPin size={14} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col leading-tight md:flex-row md:items-baseline md:gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-wasro-slate sm:text-[10px]">
                Showing
              </span>
              <span className="truncate text-sm font-bold text-wasro-charcoal sm:text-base">
                {currentLabel}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <span className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-full bg-wasro-blue px-2 text-[11px] font-bold text-white sm:h-6 sm:min-w-[2rem] sm:text-xs">
                {currentCount}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-wasro-slate transition-transform duration-300",
                  open && "rotate-180"
                )}
              />
            </span>
          </button>

          {/* Reset chip — only when filtered. Hidden on tiny screens to
              avoid crowding the trigger; the picker itself has an
              "All states" option. */}
          {activeState !== null && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="hidden shrink-0 items-center gap-1.5 rounded-pill border border-wasro-border bg-white px-3 py-2 text-xs font-semibold text-wasro-blue transition hover:bg-wasro-blue hover:text-white sm:inline-flex md:px-4 md:py-2.5 md:text-sm"
            >
              <X size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Picker — mobile bottom sheet / desktop centered modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter stores by state"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-wasro-charcoal/45 backdrop-blur-sm transition-opacity duration-300 ease-out",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Sheet card */}
        <div
          className={cn(
            "relative flex w-full max-w-md max-h-[85dvh] flex-col overflow-hidden bg-white shadow-2xl sm:max-w-lg",
            "rounded-t-[1.75rem] sm:rounded-[1.5rem]",
            "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-full scale-95 opacity-0 sm:translate-y-0"
          )}
        >
          {/* Mobile pull handle */}
          <div
            aria-hidden
            className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-wasro-border sm:hidden"
          />

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-wasro-border px-5 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-wasro-blue">
                Find a Wasro store
              </p>
              <h3 className="mt-0.5 text-lg font-bold leading-tight text-wasro-charcoal sm:text-xl">
                Browse by state
              </h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wasro-cream text-wasro-charcoal ring-1 ring-wasro-border transition hover:bg-white hover:scale-105 active:scale-95"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="shrink-0 px-5 pt-4 sm:px-6">
            <label className="relative block">
              <span className="sr-only">Search states</span>
              <Search
                size={14}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-wasro-slate"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search states…"
                autoFocus={false}
                className="h-10 w-full rounded-pill bg-wasro-cream pl-9 pr-4 text-sm text-wasro-charcoal placeholder:text-wasro-slate focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
              />
            </label>
          </div>

          {/* Options list */}
          <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
            {/* All states — only shown when no search query */}
            {!query && (
              <button
                type="button"
                onClick={() => pick(null)}
                className={cn(
                  "group mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.98]",
                  activeState === null
                    ? "bg-wasro-blue text-white shadow-md shadow-wasro-blue/25"
                    : "bg-gradient-to-r from-wasro-blue-light/60 to-wasro-cream-dark/40 text-wasro-charcoal hover:from-wasro-blue-light hover:to-wasro-blue-light"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    activeState === null
                      ? "bg-white/20 text-white"
                      : "bg-wasro-blue text-white"
                  )}
                >
                  <MapPin size={16} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-bold">All states</span>
                  <span
                    className={cn(
                      "truncate text-xs",
                      activeState === null
                        ? "text-white/75"
                        : "text-wasro-slate"
                    )}
                  >
                    Every Wasro distributor across India
                  </span>
                </span>
                <span
                  className={cn(
                    "inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-full px-2.5 text-xs font-bold",
                    activeState === null
                      ? "bg-white/20 text-white"
                      : "bg-white text-wasro-blue-dark shadow-sm"
                  )}
                >
                  {totalCount}
                </span>
                {activeState === null && (
                  <Check size={16} className="shrink-0" />
                )}
              </button>
            )}

            {/* Per-state list */}
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-wasro-slate">
                No states match &quot;{query}&quot;.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-1.5">
                {filtered.map((s) => {
                  const isActive = activeState === s.state;
                  return (
                    <li key={s.state}>
                      <button
                        type="button"
                        onClick={() => pick(s.state)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98]",
                          isActive
                            ? "bg-wasro-blue text-white shadow-md shadow-wasro-blue/25"
                            : "hover:bg-wasro-cream"
                        )}
                      >
                        <span className="flex min-w-0 flex-1 flex-col leading-tight">
                          <span className="truncate text-sm font-bold">
                            {s.state}
                          </span>
                          <span
                            className={cn(
                              "text-xs",
                              isActive
                                ? "text-white/75"
                                : "text-wasro-slate"
                            )}
                          >
                            {s.count === 1 ? "1 store" : `${s.count} stores`}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-full px-2.5 text-xs font-bold transition-colors",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-wasro-blue-light text-wasro-blue-dark group-hover:bg-wasro-blue group-hover:text-white"
                          )}
                        >
                          {s.count}
                        </span>
                        {isActive && (
                          <Check size={16} className="shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer hint */}
          <div className="shrink-0 border-t border-wasro-border bg-wasro-cream/60 px-5 py-3 text-center text-[11px] text-wasro-slate sm:px-6">
            Tap any state to filter the store list instantly.
          </div>
        </div>
      </div>
    </>
  );
}
