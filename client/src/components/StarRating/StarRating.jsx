import { memo } from "react";

function StarRating({ rating = 0, reviews = 0, showCount = true }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-star text-sm">★</span>
        ))}
        {hasHalf && <span className="text-star text-sm">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600 text-sm">★</span>
        ))}
      </div>
      <span className="text-xs font-semibold text-star">{rating}</span>
      {showCount && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}

export default memo(StarRating);
