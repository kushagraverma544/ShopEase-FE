import { RatingStars } from '../../../components/product/RatingStars/RatingStars';
import { getRatingBreakdown } from '../../../utils/ratingBreakdown';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ReviewsSection({ product }) {
  const reviews = product.reviews ?? [];
  const { counts, total } = getRatingBreakdown(product.id, product.rating);

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percentage: total > 0 ? (counts[star] / total) * 100 : 0,
  }));

  return (
    <section className="border-t border-neutral-100 pt-8">
      <h2 className="mb-6 text-xl font-semibold text-neutral-800">Ratings &amp; Reviews</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <span className="text-4xl font-semibold text-neutral-900">
            {product.rating?.toFixed(1)}
          </span>
          <RatingStars rating={product.rating} size="lg" />
          <span className="text-sm text-neutral-500">{total} ratings &amp; reviews</span>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          {breakdown.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3 text-sm text-neutral-600">
              <span className="w-12 shrink-0">{star} star</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full w-(--bar-fill) bg-warning-500"
                  style={{ '--bar-fill': `${percentage}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">Be the first to review this product.</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-neutral-100">
          {reviews.map((review) => (
            <div
              key={`${review.reviewerEmail}-${review.date}`}
              className="flex flex-col gap-2 py-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-neutral-800">{review.reviewerName}</span>
                <span className="text-xs text-neutral-400">{formatDate(review.date)}</span>
              </div>
              <RatingStars rating={review.rating} size="sm" />
              <p className="text-sm text-neutral-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
