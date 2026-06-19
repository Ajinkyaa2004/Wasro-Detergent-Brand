import { Marquee } from "@/components/ui/marquee";
import { DISTRIBUTORS } from "@/data/distributors";

export function DistributorStrip() {
  // Build a unique, varied set of "City, State" labels
  const seen = new Set<string>();
  const items: string[] = [];
  for (const d of DISTRIBUTORS) {
    const label = `${d.city}, ${d.state}`;
    if (!seen.has(label)) {
      seen.add(label);
      items.push(label);
    }
  }

  return (
    <section className="border-y border-wasro-blue-dark bg-wasro-blue py-5">
      <div className="mx-auto mb-3 max-w-7xl px-5 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-wasro-cream/70">
          Trusted by 121+ stores across Northeast India and beyond
        </p>
      </div>
      <Marquee items={items} speedSeconds={210} />
    </section>
  );
}
