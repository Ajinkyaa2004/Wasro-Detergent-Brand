import { getWhyWasro } from "@/lib/why-wasro";
import { WhyUsEditor } from "./why-us-editor";

export const dynamic = "force-dynamic";

export default async function WhyUsAdminPage() {
  const data = await getWhyWasro();
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Why Wasro
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Edit the value-prop cards
        </h1>
        <p className="mt-2 max-w-xl text-sm text-wasro-slate">
          The four cards in the &quot;More than just a wash&quot; section
          on the home page. Each card has an icon, colour theme, headline,
          body, and a small stat in the top-right corner.
        </p>
      </div>
      <WhyUsEditor initial={data} />
    </div>
  );
}
