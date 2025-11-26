import React from "react";
import { Hotel, ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Enhanced empty state component with modern design
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Go back function
 */
const EmptyState = ({ onBack }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
      <div className="relative flex justify-center mb-8">
        <div className="relative">
          {/* Main icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200/50 transform rotate-3 transition-transform duration-300 hover:rotate-6 hover:scale-110">
            <Hotel className="w-12 h-12 text-white" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
            <Search className="w-5 h-5 text-white m-auto mt-1.5" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {t("hotels.details.empty.title")}
      </h3>
      
      <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
        {t("hotels.details.empty.message")}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onBack}
          className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105"
          aria-label={t("hotels.details.empty.back_to_search_aria")}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          {t("hotels.details.empty.back_to_search")}
        </button>
        
        <button
          onClick={() => window.location.href = '/hotels'}
          className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 hover:scale-105"
          aria-label={t("hotels.details.empty.browse_hotels_aria")}
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          {t("hotels.details.empty.browse_hotels")}
        </button>
      </div>
      </div>
    </div>
  );
};

export default EmptyState;

