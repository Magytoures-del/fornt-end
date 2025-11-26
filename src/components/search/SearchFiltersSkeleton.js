"use client";

export default function SearchFiltersSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="h-6 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-9 w-full bg-gray-200 rounded" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="h-5 w-28 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">
          <div className="h-9 w-full bg-gray-200 rounded" />
          <div className="h-9 w-5/6 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="h-5 w-20 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        <div className="mb-3">
          <div className="h-9 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-3 max-h-72 overflow-hidden">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
