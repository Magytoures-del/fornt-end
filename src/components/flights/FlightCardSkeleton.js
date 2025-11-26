"use client";

import React from "react";

const FlightCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
      </div>

      {/* Flight Route */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Departure */}
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
        </div>

        {/* Flight Path */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-0.5 bg-gray-200 w-16 animate-pulse"></div>
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-0.5 bg-gray-200 w-16 animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-14 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-10 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-18 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-14 mx-auto"></div>
        </div>
      </div>

      {/* Baggage Info */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-14 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-10 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
      </div>
    </div>
  );
};

export default FlightCardSkeleton;
