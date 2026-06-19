import { Marquee } from "@/components/ui/marquee";
import { Sparkles } from "lucide-react";

const PROMOS = [
  "FREE GIFT WITH EVERY FAMILY PACK",
  "RECOGNIZED BY ASSAM STARTUP",
  "MADE IN ASSAM, TRUSTED ACROSS NORTHEAST INDIA",
  "FREE 1L MUG WITH 400G PACK",
  "FREE PRINTED BUCKET WITH 2KG PACK",
  "FREE DRUM WITH 3KG MEGA PACK",
  "NOW ON SWIGGY · BLINKIT · BIGBASKET · JIOMART",
  "CALL US FOR BULK ORDERS — RESPONSE WITHIN 1 WORKING DAY",
];

export function AnnouncementBar() {
  return (
    <div className="relative z-50 flex h-9 items-center gap-3 overflow-hidden bg-wasro-charcoal px-4 text-wasro-cream">
      <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-wasro-yellow sm:inline-flex">
        <Sparkles size={12} /> LIVE
      </span>
      <div className="flex-1 overflow-hidden">
        <Marquee items={PROMOS} speedSeconds={45} />
      </div>
    </div>
  );
}
