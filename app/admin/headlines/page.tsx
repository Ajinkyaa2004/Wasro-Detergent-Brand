import { getHeadlines } from "@/lib/headlines";
import { HeadlinesEditor } from "./headlines-editor";

export const dynamic = "force-dynamic";

export default async function HeadlinesAdminPage() {
  const current = await getHeadlines();
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Hero Headlines
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Edit the cycling words
        </h1>
        <p className="mt-2 text-sm text-wasro-slate">
          These rotate every few seconds inside the home-hero headline.
          Keep each line short (under ~28 characters) so the layout
          doesn&apos;t jump when they swap.
        </p>
      </div>
      <HeadlinesEditor initial={current} />
    </div>
  );
}
