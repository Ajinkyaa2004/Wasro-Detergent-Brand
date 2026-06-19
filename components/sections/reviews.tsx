import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { getVisibleReviews, aggregate } from "@/lib/reviews";
import { ReviewsSwipeStack } from "./reviews-swipe-stack";

/**
 * Reviews section for the home page.
 *
 * Server component — fetches admin-edited reviews at request time and
 * hands them to the interactive client SwipeStack. The fetch happens
 * here (not in the client) so the section can no-op cleanly when there
 * are zero reviews (no flash of an empty deck on first paint).
 *
 * Layout: split into a sticky-feeling text column on the left (header +
 * aggregate badge + instructions) and the draggable card stack on the
 * right. Stacks vertically on mobile, header on top.
 */
export async function Reviews() {
  const reviews = await getVisibleReviews();
  if (reviews.length === 0) return null;

  const agg = aggregate(reviews);
  // Hard cap at 12 cards in the stack — more than that and the deck
  // becomes a chore. Admin can prioritise via the editor's reorder.
  const stack = reviews.slice(0, 12);

  return (
    <section className="relative overflow-hidden bg-wasro-cream">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-wasro-yellow/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-wasro-blue/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: section header */}
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
                <Quote size={12} /> What shoppers say
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight text-wasro-charcoal md:text-5xl">
                Trusted in homes &amp; kirana shelves alike.
              </h2>
              <p className="mt-4 max-w-lg text-wasro-slate">
                Real words from households, shopkeepers, and small business
                owners across Northeast India and beyond.
              </p>

              {/* Aggregate badge */}
              {agg && (
                <div className="mt-8 inline-flex items-center gap-5 rounded-3xl bg-white px-6 py-4 shadow-lg ring-1 ring-wasro-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-3xl font-extrabold text-wasro-charcoal">
                      {agg.average.toFixed(1)}
                      <Star
                        size={22}
                        className="fill-wasro-yellow text-wasro-yellow"
                      />
                    </div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                      Avg. rating
                    </div>
                  </div>
                  <div className="h-12 w-px bg-wasro-border" aria-hidden />
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-wasro-blue">
                      {agg.count}
                    </div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                      Reviews
                    </div>
                  </div>
                </div>
              )}

              {/* Instructional copy */}
              <p className="mt-8 max-w-md text-sm leading-relaxed text-wasro-slate">
                <span className="font-bold text-wasro-charcoal">
                  Drag a card aside
                </span>{" "}
                — or tap the arrows below the deck — to flip through every
                story on the stack.
              </p>
            </div>
          </Reveal>

          {/* Right: swipe-card stack */}
          <Reveal delay={0.15}>
            <ReviewsSwipeStack reviews={stack} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
