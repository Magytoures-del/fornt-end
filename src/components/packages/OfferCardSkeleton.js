"use client";

const OfferCardSkeleton = () => {
  return (
    <div className="md:max-w-80 w-full lg:mt-0 mt-5 mb-5 h-[470px] bg-white rounded-[32px] shadow-lg relative animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-[65%] bg-gray-200 rounded-b-none rounded-[32px]"></div>

      {/* Content skeleton */}
      <div className="px-5 pb-5 pt-8 w-full absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white rounded-b-none rounded-[32px] h-[223px] flex flex-col justify-between">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Overview skeleton */}
        <div className="h-4 bg-gray-200 rounded w-full"></div>

        {/* Info section skeleton */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        {/* Price and buttons skeleton */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCardSkeleton;
