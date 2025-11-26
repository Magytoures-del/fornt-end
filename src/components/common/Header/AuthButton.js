"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { FaRegUserCircle } from "react-icons/fa";
import AuthModal from "../AuthModal";

/**
 * Reusable Auth Button Component
 * Shows login button when not authenticated, nothing when authenticated (ProfileDropdown handles that)
 * @param {Object} props
 * @param {boolean} props.isScrolled - Whether header is in scrolled state
 * @param {boolean} props.isMobile - Whether to render mobile variant
 * @param {function} props.onLoginClick - Callback when login button is clicked (for mobile menu close)
 * @param {string} props.className - Additional CSS classes
 */
export default function AuthButton({
  isScrolled = false,
  isMobile = false,
  onLoginClick,
  className = "",
}) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Don't show if authenticated (ProfileDropdown handles that)
  if (isAuthenticated) {
    return null;
  }

  const handleLoginClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // If onLoginClick callback is provided (mobile), use it instead of managing modal state
    if (onLoginClick) {
      onLoginClick();
    } else {
      // Desktop: manage modal state internally
      setIsLoginOpen(true);
    }
  };

  // Desktop variant
  if (!isMobile) {
    return (
      <>
        <div className={`flex items-center space-x-3 ${className}`}>
          <button
            onClick={handleLoginClick}
            className="flex items-center gap-2 hover:bg-blue-100/50 cursor-pointer rounded-md p-2 transition-all duration-200"
            aria-label={t("common.login")}
          >
            <FaRegUserCircle className="w-6 h-6 text-blue-gray-400" />
            <span className="text-sm font-semibold text-gray-500">
              {t("common.login")}
            </span>
          </button>
        </div>
        <AuthModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSuccess={(user) => {
            console.log("Authentication successful:", user);
          }}
        />
      </>
    );
  }

  // Mobile variant - matching desktop design
  // Note: Modal is managed by parent (Header) when onLoginClick is provided
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleLoginClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors w-full justify-center ${
          isScrolled
            ? "text-gray-700 hover:bg-gray-100"
            : "text-white hover:bg-blue-800/50"
        }`}
        aria-label={t("common.login")}
      >
        <FaRegUserCircle className="w-6 h-6 text-blue-gray-400" />
        <span className="text-sm font-semibold text-gray-500">
          {t("common.login")}
        </span>
      </button>
    </div>
  );
}

