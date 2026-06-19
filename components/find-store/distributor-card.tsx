import { MapPin, Phone, MessageCircle, Navigation } from "lucide-react";
import type { Distributor } from "@/data/distributors";
import { cn } from "@/lib/utils";

// Color theme per state — visual identity
const STATE_THEME: Record<string, { bg: string; text: string }> = {
  Assam: { bg: "bg-wasro-blue-light", text: "text-wasro-blue-dark" },
  Meghalaya: { bg: "bg-emerald-100", text: "text-emerald-800" },
  Manipur: { bg: "bg-violet-100", text: "text-violet-800" },
  Tripura: { bg: "bg-rose-100", text: "text-rose-800" },
  Mizoram: { bg: "bg-cyan-100", text: "text-cyan-800" },
  Nagaland: { bg: "bg-orange-100", text: "text-orange-800" },
  "Arunachal Pradesh": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "West Bengal": { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
  Bihar: { bg: "bg-teal-100", text: "text-teal-800" },
  Odisha: { bg: "bg-indigo-100", text: "text-indigo-800" },
};

export function DistributorCard({
  distributor,
}: {
  distributor: Distributor;
}) {
  const theme = STATE_THEME[distributor.state] ?? {
    bg: "bg-wasro-blue-light",
    text: "text-wasro-blue-dark",
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${distributor.name}, ${distributor.address}`
  )}`;

  const waMessage = encodeURIComponent(
    `Hi, I'm trying to reach ${distributor.name} in ${distributor.city}. I'd like to enquire about Wasro products availability.`
  );

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[1rem] bg-white p-5 ring-1 ring-wasro-border transition-all duration-300 hover:-translate-y-1 hover:ring-wasro-blue/40 hover:shadow-xl hover:shadow-wasro-blue/10">
      {/* Subtle gradient accent at the top */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-wasro-blue via-wasro-blue-light to-wasro-blue"
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
              theme.bg,
              theme.text
            )}
          >
            {distributor.state}
          </span>
          <span className="text-xs text-wasro-slate">{distributor.city}</span>
        </div>

        <h3 className="text-base font-bold leading-tight text-wasro-charcoal">
          {distributor.name}
        </h3>

        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-wasro-slate">
          <MapPin size={12} className="mt-0.5 shrink-0 text-wasro-blue" />
          <span className="line-clamp-3">{distributor.address}</span>
        </p>
      </div>

      <div className="mt-auto pt-4">
        {/* Primary action: Call */}
        <a
          href={`tel:+91${distributor.phone}`}
          className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-pill bg-wasro-blue px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-wasro-blue-dark hover:shadow-md"
        >
          <Phone size={14} />
          {formatPhone(distributor.phone)}
        </a>

        {/* Secondary actions */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/91${distributor.phone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-pill bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-600 hover:text-white hover:ring-emerald-600"
          >
            <MessageCircle size={12} /> WhatsApp
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-pill bg-wasro-cream px-3 py-2 text-xs font-semibold text-wasro-charcoal ring-1 ring-wasro-border transition hover:bg-wasro-blue hover:text-white hover:ring-wasro-blue"
          >
            <Navigation size={12} /> Maps
          </a>
        </div>
      </div>
    </div>
  );
}

function formatPhone(p: string): string {
  // 9876543210 -> 98765 43210
  if (p.length === 10) return `${p.slice(0, 5)} ${p.slice(5)}`;
  return p;
}
