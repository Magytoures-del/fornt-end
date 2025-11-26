"use client";

export default function FlightResultsSkeleton({ count = 3 }) {
  const items = Array.from({ length: count });
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Enhanced Summary skeleton with progressive loading indicators */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-6 overflow-hidden">
        <div className="animate-pulse flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="mb-3 sm:mb-0 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg" />
              <div className="flex items-center space-x-3 min-w-0">
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32" />
                {/* Progressive loading indicator skeleton */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 sm:w-20" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="h-3 sm:h-4 bg-gray-100 rounded w-36 sm:w-48" />
              {/* Total flights found skeleton */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded w-20 sm:w-24" />
              </div>
            </div>
          </div>
          <div className="text-center sm:text-right w-full sm:w-auto">
            <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-16 sm:w-20" />
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-6 sm:w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6 animate-pulse overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
            {/* Left: Enhanced flight info skeleton */}
            <div className="flex-1 mb-4 sm:mb-6 lg:mb-0 px-2 sm:px-3 min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4 min-w-0">
                {/* Enhanced Airline logo */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl p-2 border border-gray-200">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-lg" />
                  </div>
                </div>

                {/* Enhanced Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-stretch sm:items-center space-x-3 sm:space-x-6 min-w-0">
                    {/* Enhanced Departure */}
                    <div className="text-start flex flex-col items-start gap-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 bg-gray-200 rounded" />
                        <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-8 sm:w-10" />
                      </div>
                      <div className="h-6 sm:h-8 w-16 sm:w-20 bg-gray-200 rounded" />
                      <div className="h-2.5 sm:h-3 w-20 sm:w-28 bg-gray-100 rounded" />
                      <div className="h-2.5 sm:h-3 w-24 sm:w-32 bg-gray-100 rounded" />
                    </div>

                    {/* Enhanced Route */}
                    <div className="text-center flex-1 min-w-0 px-1">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300" />
                        <div className="bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                          <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-100 rounded" />
                        </div>
                        <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-200 to-gray-300" />
                      </div>
                      <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-gray-100 rounded mx-auto border border-gray-200" />
                      <div className="h-2.5 sm:h-3 w-20 sm:w-28 bg-gray-50 rounded mx-auto" />
                    </div>

                    {/* Enhanced Arrival */}
                    <div className="text-center flex flex-col items-end gap-1 min-w-0">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-3.5 h-3.5 bg-gray-200 rounded" />
                        <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-8 sm:w-10" />
                      </div>
                      <div className="h-6 sm:h-8 w-16 sm:w-20 bg-gray-200 rounded" />
                      <div className="h-2.5 sm:h-3 w-20 sm:w-28 bg-gray-100 rounded" />
                      <div className="h-2.5 sm:h-3 w-24 sm:w-32 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Flight Metadata */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded" />
                  <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded" />
                  <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded" />
                  <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* Right: Enhanced price & button */}
            <div className="flex-shrink-0 text-center lg:text-right w-full lg:w-auto pt-2 lg:pt-0 border-t border-gray-100 lg:border-0">
              <div className="mb-2 sm:mb-3">
                <div className="h-8 sm:h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 sm:w-32 mx-auto lg:ml-auto" />
                <div className="h-3 sm:h-4 bg-gray-100 rounded w-20 sm:w-24 mx-auto lg:ml-auto" />
              </div>
              <div className="h-10 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg sm:rounded-xl w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3" />
            </div>
          </div>
        </div>
      ))}

      {/* Progressive loading indicator skeleton */}
      <div className="text-center py-4 sm:py-6">
        <div className="inline-flex max-w-full items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-32 sm:w-40" />
        </div>
      </div>
    </div>
  );
}
