import React from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Enhanced error state component with modern design
 * @param {Object} props - Component props
 * @param {string} props.error - Error message
 * @param {Function} props.onRetry - Retry function
 * @param {Function} props.onBack - Go back function
 */
const ErrorState = ({ error, onRetry, onBack }) => {
  const { t } = useTranslation();
  
  return (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full">
      <div className="relative bg-white/80 backdrop-blur-xl border-2 border-red-200/50 rounded-3xl p-8 shadow-2xl shadow-red-100/50 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl opacity-30 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-100 to-pink-100 rounded-full blur-3xl opacity-30 -ml-16 -mb-16" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200/50 animate-pulse">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-40 animate-pulse" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {t("hotels.details.error.title")}
          </h3>
          
          <p className="text-gray-600 text-center mb-8 leading-relaxed">{error}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRetry}
              className="group flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105"
              aria-label={t("hotels.details.error.try_again_aria")}
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              {t("hotels.details.error.try_again")}
            </button>
            <button
              onClick={onBack}
              className="group flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 hover:scale-105"
              aria-label={t("hotels.details.error.go_back_aria")}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              {t("hotels.details.error.go_back")}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ErrorState;

