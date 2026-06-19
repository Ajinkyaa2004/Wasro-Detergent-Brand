import { getHeroContent } from "@/lib/hero-content";
import { HeroContentEditor } from "./hero-content-editor";

export const dynamic = "force-dynamic";

export default async function HeroContentAdminPage() {
  const content = await getHeroContent();
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Hero Content
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Edit the static hero text
        </h1>
        <p className="mt-2 max-w-xl text-sm text-wasro-slate">
          The chip, subtitle, CTA buttons, and stats that sit around the
          rotating slideshow + cycling words. Save commits to storage and
          the live hero updates on the next page load.
        </p>
      </div>
      <HeroContentEditor initial={content} />
    </div>
  );
}
