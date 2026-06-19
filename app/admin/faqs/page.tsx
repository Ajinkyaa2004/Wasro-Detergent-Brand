import { getFaqs } from "@/lib/faqs";
import { FaqsEditor } from "./faqs-editor";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const faqs = await getFaqs();
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          FAQs
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Edit the About-page Q&amp;A
        </h1>
        <p className="mt-2 max-w-xl text-sm text-wasro-slate">
          The accordion at the bottom of the About page. Each item also
          feeds the FAQPage JSON-LD that powers Google&apos;s rich-result
          snippets for &quot;Wasro&quot; queries.
        </p>
      </div>
      <FaqsEditor initial={faqs} />
    </div>
  );
}
