"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  RiCloseLine,
  RiMailLine,
  RiLock2Line,
  RiEyeLine,
  RiEyeOffLine,
  RiLoader4Line,
} from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

export default function LoginModal({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToRegister,
  isSubmitting,
}) {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
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
      setEmail("");
      setPassword("");
      setErrors({});
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = t("form.errors.email_required", "Email is required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = t(
          "form.errors.email_invalid",
          "Please enter a valid email address"
        );
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = t("auth.password_required", "Password is required");
    } else if (password.length < 6) {
      newErrors.password = t(
        "auth.password_min_length",
        "Password must be at least 6 characters"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getLocalizedError = (errorMessage) => {
    if (!errorMessage) {
      return t("auth.login_failed", "Login failed. Please try again.");
    }

    const lowerError = errorMessage.toLowerCase();

    // Check for invalid credentials errors
    if (
      lowerError.includes("invalid") ||
      lowerError.includes("incorrect") ||
      lowerError.includes("wrong") ||
      lowerError.includes("unauthorized") ||
      lowerError.includes("credentials") ||
      (lowerError.includes("email") &&
        (lowerError.includes("password") || lowerError.includes("pass")))
    ) {
      return t("auth.login_error", "Invalid email or password");
    }

    // Return the original error message if it's already localized or specific
    return errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(email, password);
      if (result.success) {
        if (onSubmit) await onSubmit({ email, password });
        onClose();
      } else {
        setErrors({
          general: getLocalizedError(result.error),
        });
      }
    } catch (error) {
      setErrors({
        general: getLocalizedError(error.message),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center sm:justify-end h-screen">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`
          relative w-full h-full sm:h-screen sm:max-w-md 
          bg-white sm:shadow-2xl 
          transform transition-all duration-300 animate-in fade-in-90 slide-in-from-bottom-4
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 sm:top-6 sm:right-6 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label={t("common.close", "Close")}
        >
          <RiCloseLine className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-12 sm:pt-8 px-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className=""
          />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("auth.login_title", "تسجيل الدخول")}
          </h2>
          <p className="text-gray-600 text-sm text-center mt-2">
            {t("auth.login_subtitle", "مرحبا بعودتك! يرجى إدخال التفاصيل")}
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 py-6 overflow-y-auto sm:overflow-visible">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.form.email", "البريد الإلكتروني")}
              </label>
              <div className="relative">
                <RiMailLine
                  className={`absolute ${
                    isRTL ? "right-4" : "left-4"
                  } top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={`w-full ${
                    isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                  } py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("auth.password", "كلمة المرور")}
              </label>
              <div className="relative">
                <RiLock2Line
                  className={`absolute ${
                    isRTL ? "right-4" : "left-4"
                  } top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`w-full ${
                    isRTL ? "pr-12 pl-12" : "pl-12 pr-12"
                  } py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className={`absolute ${
                    isRTL ? "left-4" : "right-4"
                  } top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {showPassword ? (
                    <RiEyeOffLine className="w-5 h-5" />
                  ) : (
                    <RiEyeLine className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className={`${isRTL ? "text-left" : "text-right"}`}>
              <button
                type="button"
                disabled={isLoading}
                className="text-sm text-blue-600 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("auth.forgot_password", "هل نسيت كلمة المرور؟")}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {(isLoading || isSubmitting) && (
                <RiLoader4Line className="w-5 h-5 animate-spin" />
              )}
              <span>
                {isLoading || isSubmitting
                  ? t("common.loading", "جاري التحميل...")
                  : t("common.login", "تسجيل الدخول")}
              </span>
            </button>
          </form>

          {/* Switch to register */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {t("auth.dont_have_account", "ليس لديك حساب؟")}{" "}
            <button
              onClick={onSwitchToRegister}
              disabled={isLoading || isSubmitting}
              className="text-blue-600 hover:underline font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("auth.create_account", "إنشاء حساب")}
            </button>
          </p>
        </div>
      </div>
    </div>,
    typeof window !== "undefined"
      ? document.body
      : document.createElement("div")
  );
}
