"use client";

import React from "react";
import {
  BsExclamationTriangle,
  BsWifi,
  BsArrowClockwise,
} from "react-icons/bs";
import { isNetworkError } from "@/utils/helper";

const ErrorDisplay = ({
  error,
  onRetry,
  context = "loading data",
  showRetryButton = true,
  className = "",
}) => {
  const isNetwork = isNetworkError(error);

  const getErrorIcon = () => {
    if (isNetwork) return <BsWifi className="w-8 h-8 text-red-500" />;
    return <BsExclamationTriangle className="w-8 h-8 text-red-500" />;
  };

  const getErrorTitle = () => {
    if (isNetwork) return "Connection Problem";
    return "Something went wrong";
  };

  const getErrorMessage = () => {
    if (isNetwork) {
      return "Please check your internet connection and try again.";
    }
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    return `We encountered an issue while ${context}. Please try again.`;
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-red-100 p-6 ${className}`}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          {getErrorIcon()}
        </div>

        <h3 className="text-lg font-semibold text-red-800 mb-2">
          {getErrorTitle()}
        </h3>

        <p className="text-red-600 mb-4 max-w-md mx-auto">
          {getErrorMessage()}
        </p>

        {showRetryButton && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            <BsArrowClockwise className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
