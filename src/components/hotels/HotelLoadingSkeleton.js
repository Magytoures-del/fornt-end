import React from "react";

/**
 * Loading skeleton for hotel cards
 */
const HotelCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="flex flex-col sm:flex-row">
      {/* Image skeleton */}
      <div className="relative w-full sm:w-64 p-3 flex-shrink-0">
        <div className="w-full h-44 bg-gray-200 rounded-lg" />
        {/* Images badge placeholder */}
        <div className="absolute top-5 right-5 w-16 h-6 bg-gray-300/70 rounded-md" />
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-4 sm:p-6 sm:pr-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            {/* Title */}
            <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
            {/* Location */}
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
            {/* Stars + amenities */}
            <div className="flex items-center gap-4 mb-3">
              {/* Stars row */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
              {/* Amenities count */}
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            {/* Review badge + text */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-10 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
          {/* Right column: price and CTA */}
          <div className="w-full sm:w-56 flex-shrink-0 flex flex-col sm:flex-col justify-between sm:items-end items-start sm:min-h-[176px] gap-4">
            {/* starting from label */}
            <div className="w-28 h-3 bg-gray-200 rounded mb-2" />
            {/* price */}
            <div className="w-40 h-6 bg-gray-200 rounded mb-1" />
            {/* excl tax */}
            <div className="w-20 h-3 bg-gray-200 rounded" />
            {/* CTA */}
            <div className="w-full sm:w-full h-10 bg-gray-200 rounded mt-auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Full page loading skeleton
 */
export const HotelLoadingSkeleton = ({ count = 5 }) => (
  <div className="animate-pulse">
    {/* Top meta skeleton */}
    <div className="h-6 bg-gray-200 rounded-md w-48 mb-6" />

    {/* Result cards skeleton */}
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <HotelCardSkeleton key={`results-skeleton-${idx}`} />
      ))}
    </div>

    {/* Pagination skeleton */}
    <div className="flex items-center justify-center gap-3 mt-8">
      <div className="h-9 w-20 bg-gray-200 rounded-md" />
      <div className="h-9 w-9 bg-gray-200 rounded-md" />
      <div className="h-9 w-9 bg-gray-200 rounded-md" />
      <div className="h-9 w-9 bg-gray-200 rounded-md" />
      <div className="h-9 w-20 bg-gray-200 rounded-md" />
    </div>
  </div>
);

/**
 * Loading more skeleton (for infinite scroll)
 */
export const LoadingMoreSkeleton = ({ count = 3 }) => (
  <div className="mt-8 space-y-4">
    {Array.from({ length: count }).map((_, idx) => (
      <HotelCardSkeleton key={`loading-skeleton-${idx}`} />
    ))}
  </div>
);

export default HotelLoadingSkeleton;

