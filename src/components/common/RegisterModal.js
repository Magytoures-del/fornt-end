"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RiCloseLine,
  RiMailLine,
  RiLock2Line,
  RiEyeLine,
  RiEyeOffLine,
  RiUserLine,
} from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function RegisterModal({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToLogin,
  isSubmitting,
  onGoogleRegister,
}) {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) onClose?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = t("form.errors.name_required");
    } else {
      const nameParts = formData.name.trim().split(/\s+/);
      if (nameParts.length < 2) {
        newErrors.name = t("form.errors.name_full_required");
      } else if (nameParts[0].length < 2) {
        newErrors.name = t("form.errors.first_name_min_length");
      } else if (nameParts[nameParts.length - 1].length < 2) {
        newErrors.name = t("form.errors.last_name_min_length");
      }
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = t("form.errors.email_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("form.errors.email_invalid");
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t("auth.password_required");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.password_min_length");
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.confirm_password_required");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.passwords_dont_match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Split name into firstName and lastName
      // First word is firstName, rest is lastName
      const nameParts = formData.name
        .trim()
        .split(/\s+/)
        .filter((part) => part.length > 0);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      // Prepare data for API call - firstName, lastName, email and password
      const registerData = {
        firstName: firstName,
        lastName: lastName,
        email: formData.email.trim(),
        password: formData.password,
      };

      const result = await register(registerData);

      if (result.success) {
        // Call the onSubmit callback if provided
        if (onSubmit) {
          await onSubmit(registerData);
        }

        // Switch to login modal on successful registration
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else {
          onClose();
        }

        // You can add success notification here if needed
        console.log("Registration successful:", result);
      } else {
        setErrors({
          general: result.error || t("auth.register_failed"),
        });
      }
    } catch (error) {
      console.error("Registration submission error:", error);
      setErrors({
        general: error.message || t("auth.register_failed"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await (onGoogleRegister ? onGoogleRegister() : Promise.resolve());
    } catch (error) {
      console.error("Google register error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] h-screen ${
        isRTL ? "right-0" : "left-0"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`flex min-h-screen items-center ${
          !isRTL ? "justify-end" : "justify-start"
        }  `}
      >
        <div
          className="relative w-[400px] px-8 pt-2 bg-white shadow-2xl transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4 h-screen"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          <div className="">
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              aria-label={t("common.close")}
            >
              <RiCloseLine className="w-6 h-6" />
            </button>
            <div
              className={`relative flex items-center ${
                isRTL ? "justify-center" : "justify-end"
              }`}
            >
              <div
                className={`flex-1 flex flex-col ${
                  isRTL
                    ? "items-center justify-center"
                    : "items-end justify-end"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-1 mt-2 ${
                    isRTL ? "text-center" : "text-right"
                  }`}
                >
                  {t("auth.register_title")}
                </h2>
                <p
                  className={`text-gray-700 text-sm ${
                    isRTL ? "text-center" : "text-right"
                  }`}
                >
                  {t("auth.register_subtitle")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <form onSubmit={handleSubmit} className="">
              {/* General Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-600 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span>{errors.general}</span>
                  </p>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-right"
                  }`}
                >
                  {t("form.name")}
                </label>
                <div className="relative group">
                  <RiUserLine
                    className={`absolute ${
                      isRTL ? "right-4" : "left-4"
                    } top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200`}
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading || isSubmitting}
                    className={`w-full ${
                      isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                    } py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder={t("form.placeholders.name")}
                    autoFocus
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="mt-4 space-y-2">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-right"
                  }`}
                >
                  {t("auth.email")}
                </label>
                <div className="relative group">
                  <RiMailLine
                    className={`absolute ${
                      isRTL ? "right-4" : "left-4"
                    } top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200`}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading || isSubmitting}
                    className={`w-full ${
                      isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                    } py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder={t("form.placeholders.email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mt-4">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-right"
                  }`}
                >
                  {t("auth.password")}
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    disabled={isLoading || isSubmitting}
                    className={`w-full ${
                      isRTL ? "pr-12 pl-4" : "pl-4 pr-12"
                    } py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder={t("auth.password_placeholder", "••••••••")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isSubmitting}
                    className={`absolute ${
                      isRTL ? "left-4" : "right-4"
                    } top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={
                      showPassword
                        ? t("auth.hide_password")
                        : t("auth.show_password")
                    }
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="w-5 h-5" />
                    ) : (
                      <RiEyeLine className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="mt-4">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-right"
                  }`}
                >
                  {t("auth.confirm_password")}
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    disabled={isLoading || isSubmitting}
                    className={`w-full ${
                      isRTL ? "pr-12 pl-4" : "pl-4 pr-12"
                    } py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder={t("auth.password_placeholder", "••••••••")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading || isSubmitting}
                    className={`absolute ${
                      isRTL ? "left-4" : "right-4"
                    } top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={
                      showConfirmPassword
                        ? t("auth.hide_password")
                        : t("auth.show_password")
                    }
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine className="w-5 h-5" />
                    ) : (
                      <RiEyeLine className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading || isSubmitting ? (
                  <div
                    className={`flex items-center ${
                      isRTL ? "justify-center" : "justify-center"
                    } space-x-2`}
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t("common.loading")}</span>
                  </div>
                ) : (
                  t("auth.create_account")
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span
                className={`px-4 text-sm text-gray-500 ${
                  isRTL ? "text-center" : "text-right"
                }`}
              >
                {t("auth.or")}
              </span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Register Button */}
            {/* <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <FcGoogle className="w-5 h-5" />
              <span>
                {t("auth.register_with_google", "إنشاء حساب بـ Google")}
              </span>
            </button> */}

            {/* Switch to Login */}
            <div className={`mt-6 ${isRTL ? "text-center" : "text-right"}`}>
              <p
                className={`text-sm text-gray-600 ${
                  isRTL ? "text-center" : "text-right"
                }`}
              >
                {t("auth.already_have_account")}{" "}
                <button
                  onClick={onSwitchToLogin}
                  disabled={isLoading || isSubmitting}
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("auth.login_instead")}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
