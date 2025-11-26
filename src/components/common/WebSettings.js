"use client";

import { useWebSettings } from "@/hooks/useWebSettings";
import { useTranslation } from "react-i18next";

export default function WebSettings() {
  const { settings, isLoading, error } = useWebSettings();
  const { t } = useTranslation();
  console.log(settings);
  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">
            {t("common.loading")} web-settings...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-red-800 font-medium">
            Error loading web-settings: {error}
          </span>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-yellow-800 font-medium">
            No web-settings data available
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-green-800 font-medium text-lg">
          Web Settings Loaded Successfully
        </span>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          API Response Data:
        </h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
}
