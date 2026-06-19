"use client";

import { useMemo } from "react";
import { STATE_POSITIONS } from "@/lib/distributors-utils";
import type { Distributor } from "@/data/distributors";

export function IndiaConstellation({
  distributors,
  activeState,
  onSelect,
}: {
  distributors: Distributor[];
  activeState: string | null;
  onSelect: (state: string | null) => void;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of distributors) {
      map.set(d.state, (map.get(d.state) ?? 0) + 1);
    }
    return map;
  }, [distributors]);

  const maxCount = Math.max(...Array.from(counts.values()));

  return (
    <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-wasro-blue-light/40 via-white to-wasro-cream-dark p-6 ring-1 ring-wasro-border md:p-10">
      {/* Title */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
            Wasro distribution map
          </p>
          <h3 className="mt-1 text-xl font-bold text-wasro-charcoal md:text-2xl">
            {activeState ?? "All 10 states"}
            <span className="ml-2 text-base font-medium text-wasro-slate">
              {activeState
                ? `${counts.get(activeState) ?? 0} stores`
                : `${distributors.length} stores total`}
            </span>
          </h3>
        </div>
        {activeState && (
          <button
            onClick={() => onSelect(null)}
            className="rounded-pill bg-white px-4 py-1.5 text-xs font-semibold text-wasro-blue ring-1 ring-wasro-border transition hover:bg-wasro-blue hover:text-white"
          >
            Show all states
          </button>
        )}
      </div>

      <svg
        viewBox="0 0 600 420"
        className="mx-auto block w-full max-w-[620px]"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Wasro distribution map of Northeast India"
      >
        {/* Soft background blob suggesting NE India region */}
        <ellipse
          cx="340"
          cy="220"
          rx="280"
          ry="170"
          fill="white"
          opacity="0.55"
        />

        {/* Connection lines between states (faint) */}
        {Object.entries(STATE_POSITIONS).map(([s1, p1]) =>
          Object.entries(STATE_POSITIONS)
            .filter(([s2]) => s1 < s2)
            .map(([s2, p2]) => {
              const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (distance > 180) return null;
              return (
                <line
                  key={`${s1}-${s2}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="rgba(27,95,168,0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
              );
            })
        )}

        {/* State circles */}
        {Object.entries(STATE_POSITIONS).map(([state, pos]) => {
          const count = counts.get(state) ?? 0;
          if (count === 0) return null;
          const isActive = activeState === state;
          const radius = 10 + (count / maxCount) * 28;
          return (
            <g
              key={state}
              className="cursor-pointer transition-transform duration-300 hover:scale-110"
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              onClick={() => onSelect(isActive ? null : state)}
            >
              {/* Ping ring for active */}
              {isActive && (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 12}
                    fill="none"
                    stroke="#1B5FA8"
                    strokeWidth="2"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      from={radius + 4}
                      to={radius + 24}
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}

              {/* Outer glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius + 4}
                fill="rgba(27,95,168,0.08)"
              />

              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={isActive ? "#1B5FA8" : "url(#stateGrad)"}
                stroke={isActive ? "#0F4275" : "rgba(27,95,168,0.35)"}
                strokeWidth="2"
                className="transition-colors duration-300"
              />

              {/* Count label inside circle */}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="select-none font-bold"
                fill={isActive ? "white" : "#0F4275"}
                style={{ fontSize: `${Math.max(11, radius * 0.55)}px` }}
              >
                {count}
              </text>

              {/* State name label below */}
              <text
                x={pos.x}
                y={pos.y + radius + 16}
                textAnchor="middle"
                className="select-none text-[10px] font-semibold uppercase tracking-wider"
                fill="#1A1A1A"
              >
                {pos.label}
              </text>
            </g>
          );
        })}

        <defs>
          <radialGradient id="stateGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#D6E8F5" />
            <stop offset="100%" stopColor="#BEE9E8" />
          </radialGradient>
        </defs>
      </svg>

      <p className="mt-4 text-center text-xs text-wasro-slate">
        Click any state to filter. Numbers show distributor count.
      </p>
    </div>
  );
}
