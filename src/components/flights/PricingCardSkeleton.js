"use client";

import React from "react";

const PricingCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mr-2"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
      </div>

      {/* Price Items */}
      <div className="space-y-3">
        {/* Base Fare */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>

        {/* Taxes */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
        </div>

        {/* Transaction Fee */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-14"></div>
        </div>

        {/* VAT on Transaction Fee */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-10"></div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 pt-3 space-y-2">
          {/* Baggage */}
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>

          {/* Seat Selection */}
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-28"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>

          {/* Meal */}
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="text-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mx-auto mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default PricingCardSkeleton;
