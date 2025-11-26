import React from "react";
import { Share2, Heart, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Floating action buttons component with modern glass morphism design
 * @param {Object} props - Component props
 * @param {Function} props.onShare - Share handler
 * @param {Function} props.onFavorite - Favorite handler
 * @param {boolean} props.isFavorite - Whether hotel is favorited
 * @param {Function} props.onScrollTop - Scroll to top handler
 * @param {boolean} props.showScrollTop - Whether to show scroll to top button
 */
const FloatingActions = ({
  onShare,
  onFavorite,
  isFavorite,
  onScrollTop,
  showScrollTop,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Share and Favorite Buttons */}
      <div className="fixed top-20 right-4 sm:right-6 z-40 flex flex-col gap-3">
        {/* Share Button */}
        <button
          onClick={onShare}
          className="group relative bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 p-3.5 rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:scale-110 border border-gray-200/50 hover:border-blue-300"
          aria-label={t("hotels.details.actions.share_hotel")}
        >
          <Share2 className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
            {t("hotels.details.actions.share")}
          </span>
        </button>

        {/* Favorite Button */}
        <button
          onClick={onFavorite}
          className={`group relative ${
            isFavorite
              ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-200/50 hover:shadow-red-300/50"
              : "bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 shadow-gray-200/50 hover:shadow-red-200/50 border border-gray-200/50 hover:border-red-300"
          } p-3.5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110`}
          aria-label={isFavorite ? t("hotels.details.actions.remove_from_favorites") : t("hotels.details.actions.add_to_favorites")}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isFavorite
                ? "fill-current animate-pulse"
                : "group-hover:text-red-500 group-hover:scale-110"
            }`}
          />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
            {isFavorite ? t("hotels.details.actions.saved") : t("hotels.details.actions.save")}
          </span>
        </button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={onScrollTop}
          className="group fixed bottom-8 right-4 sm:right-6 z-40 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl shadow-lg shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 transition-all duration-300 hover:scale-110 animate-fade-in border border-blue-500/50"
          aria-label={t("hotels.details.actions.scroll_to_top")}
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
            {t("hotels.details.actions.top")}
          </span>
        </button>
      )}
    </>
  );
};

export default FloatingActions;

