import { getAllReviews } from "@/lib/reviews";
import { ReviewsEditor } from "./reviews-editor";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const reviews = await getAllReviews();
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Reviews
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Customer testimonials
        </h1>
        <p className="mt-2 max-w-xl text-sm text-wasro-slate">
          The &ldquo;What shoppers say&rdquo; section on the home page. The
          first review becomes the spotlight card; the next four fill the
          supporting grid. Avg-rating + count are calculated automatically
          and emitted as Google star-rating schema.
        </p>
      </div>
      <ReviewsEditor initial={reviews} />
    </div>
  );
}
