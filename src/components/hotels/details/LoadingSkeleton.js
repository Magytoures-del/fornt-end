import React from "react";

/**
 * Loading skeleton component with shimmer effect for hotel details page
 */
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
    {/* Hero Skeleton */}
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-80 md:h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" 
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-8 lg:space-y-10">
        {/* Breadcrumb skeleton */}
        <div className="h-5 bg-gray-200 rounded-lg w-64 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        
        {/* Title and meta */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded-xl w-2/3 overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className="h-5 bg-gray-200 rounded-lg w-1/3 overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" 
              style={{ animationDelay: '0.1s' }}
            />
          </div>
        </div>
        
        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-lg overflow-hidden relative"
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </div>
          ))}
        </div>
        
        {/* Room list skeleton */}
        <div className="space-y-4">
          <div className="h-7 bg-gray-200 rounded-xl w-48 overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl shadow-md overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Location skeleton */}
        <div className="space-y-4">
          <div className="h-7 bg-gray-200 rounded-xl w-40 overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
    `}</style>
  </div>
);

export default LoadingSkeleton;

