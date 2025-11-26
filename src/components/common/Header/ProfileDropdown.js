"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { FaRegUserCircle } from "react-icons/fa";
import { RiUserLine, RiLogoutBoxLine } from "react-icons/ri";
import { useOutsideClick } from "@/hooks/useOutsideClick";

/**
 * Reusable Profile Dropdown Component
 * @param {Object} props
 * @param {boolean} props.isScrolled - Whether header is in scrolled state
 * @param {boolean} props.isMobile - Whether to render mobile variant
 * @param {function} props.onAction - Optional callback when action is taken (for mobile menu close)
 * @param {string} props.className - Additional CSS classes
 */
export default function ProfileDropdown({
  isScrolled = false,
  isMobile = false,
  onAction,
  className = "",
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useOutsideClick(() => setIsOpen(false));

  const handleProfileAction = (action) => {
    setIsOpen(false);
    if (action === "profile") {
      router.push("/profile");
    } else if (action === "logout") {
      logout();
    }
    // Call onAction callback if provided (e.g., to close mobile menu)
    if (onAction) {
      onAction();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Desktop variant
  if (!isMobile) {
    return (
      <div
        ref={dropdownRef}
        className={`relative profile-dropdown ${className}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isScrolled
              ? "text-gray-700 hover:bg-gray-100"
              : "text-white hover:bg-blue-800/50"
          }`}
          aria-label={t("common.account", "حسابي")}
          aria-expanded={isOpen}
        >
          <FaRegUserCircle className="w-6 h-6 text-blue-gray-400" />
          <span className="text-sm font-semibold text-gray-500">
            {t("common.account", "حسابي")}
          </span>
        </button>

        {isOpen && (
          <div
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
              isScrolled
                ? "bg-white border border-gray-200"
                : "bg-blue-800/95 backdrop-blur-md border border-blue-700/30"
            }`}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-2">
              <button
                onClick={() => handleProfileAction("profile")}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                  isScrolled
                    ? "hover:bg-gray-50 text-gray-700"
                    : "hover:bg-blue-700/50 text-white"
                }`}
                role="menuitem"
              >
                <RiUserLine className="w-4 h-4" />
                <span>{t("profile.title", "Profile")}</span>
              </button>
              <button
                onClick={() => handleProfileAction("logout")}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                  isScrolled
                    ? "hover:bg-red-50 text-red-600"
                    : "hover:bg-red-600/50 text-red-300"
                }`}
                role="menuitem"
              >
                <RiLogoutBoxLine className="w-4 h-4" />
                <span>{t("common.logout", "Logout")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile variant - matching desktop design with dropdown
  return (
    <div
      ref={dropdownRef}
      className={`relative profile-dropdown ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors w-full justify-center ${
          isScrolled
            ? "text-gray-700 hover:bg-gray-100"
            : "text-white hover:bg-blue-800/50"
        }`}
        aria-label={t("common.account", "حسابي")}
        aria-expanded={isOpen}
      >
        <FaRegUserCircle className="w-6 h-6 text-blue-gray-400" />
        <span className="text-sm font-semibold text-gray-500">
          {t("common.account", "حسابي")}
        </span>
      </button>

      {isOpen && (
        <div
          className={`mt-2 w-full rounded-md shadow-lg z-50 ${
            isScrolled
              ? "bg-white border border-gray-200"
              : "bg-blue-800/95 backdrop-blur-md border border-blue-700/30"
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-2">
            <button
              onClick={() => handleProfileAction("profile")}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                isScrolled
                  ? "hover:bg-gray-50 text-gray-700"
                  : "hover:bg-blue-700/50 text-white"
              }`}
              role="menuitem"
            >
              <RiUserLine className="w-4 h-4" />
              <span>{t("profile.title", "Profile")}</span>
            </button>
            <button
              onClick={() => handleProfileAction("logout")}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                isScrolled
                  ? "hover:bg-red-50 text-red-600"
                  : "hover:bg-red-600/50 text-red-300"
              }`}
              role="menuitem"
            >
              <RiLogoutBoxLine className="w-4 h-4" />
              <span>{t("common.logout", "Logout")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

