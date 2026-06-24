import { memo } from "react";

function Loader() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Image skeleton */}
      <div className="aspect-square skeleton-shimmer" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded skeleton-shimmer" />
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-24 rounded skeleton-shimmer" />
        <div className="h-3 w-32 rounded skeleton-shimmer" />
        <div className="h-6 w-20 rounded skeleton-shimmer mt-2" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 flex-1 rounded-lg skeleton-shimmer" />
          <div className="h-8 flex-1 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default memo(Loader);