/**
 * Session Storage Debugger Component
 * Displays session storage data for debugging purposes
 */

"use client";

import React, { useState, useEffect } from "react";
import { BsEye, BsEyeSlash, BsTrash, BsDownload } from "react-icons/bs";
import {
  getAllTravelData,
  clearAllTravelData,
  getStorageInfo,
  SESSION_KEYS,
} from "@/utils/sessionStorage";

const SessionStorageDebugger = ({ isVisible = false, onToggle }) => {
  const [storageData, setStorageData] = useState(null);
  const [storageInfo, setStorageInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const refreshData = () => {
    try {
      const data = getAllTravelData();
      const info = getStorageInfo();
      setStorageData(data);
      setStorageInfo(info);
    } catch (error) {
      console.error("Failed to load session storage data:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      refreshData();
      // Refresh data every 2 seconds when visible
      const interval = setInterval(refreshData, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all travel data from session storage?"
      )
    ) {
      clearAllTravelData();
      refreshData();
    }
  };

  const handleDownloadData = () => {
    const dataToDownload = {
      timestamp: new Date().toISOString(),
      storageData,
      storageInfo,
    };

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `travel-session-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => onToggle?.(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Show Session Storage Debugger"
      >
        <BsEye className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Session Storage Debug
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <BsEyeSlash className="w-4 h-4" />
            ) : (
              <BsEye className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDownloadData}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="Download Data"
          >
            <BsDownload className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 transition-colors"
            title="Clear All Data"
          >
            <BsTrash className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggle?.(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Hide Debugger"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Storage Info */}
      <div className="px-4 py-2 bg-blue-50 border-b border-gray-200">
        <div className="text-xs text-gray-600">
          <span className="font-medium">Items:</span>{" "}
          {storageInfo?.itemCount || 0} |
          <span className="font-medium ml-2">Size:</span>{" "}
          {formatBytes(storageInfo?.totalSize || 0)}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="overflow-y-auto max-h-64">
          {storageData &&
            Object.entries(storageData).map(([key, value]) => (
              <div
                key={key}
                className="px-4 py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      value
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {value ? "Stored" : "Empty"}
                  </span>
                </div>
                {value && (
                  <div className="mt-1 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded overflow-hidden">
                    <div className="truncate">
                      {JSON.stringify(value, null, 1).substring(0, 100)}
                      {JSON.stringify(value).length > 100 && "..."}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={refreshData}
          className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default SessionStorageDebugger;

