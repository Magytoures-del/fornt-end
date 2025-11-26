"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import authService from "@/services/authService";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (credentials) => {
    try {
      setIsSubmitting(true);
      setError("");

      const result = await authService.login(
        credentials.email,
        credentials.password
      );

      if (result.success) {
        onSuccess?.(result.user);
        onClose?.();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || t("auth.login_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setIsSubmitting(true);
      setError("");

      const result = await authService.register({
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        phone: userData.phone,
      });

      if (result.success) {
        onSuccess?.(result.user);
        onClose?.();
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || t("auth.register_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
    setError("");
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
    setError("");
  };

  const handleClose = () => {
    setError("");
    setIsLoginMode(true);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {isLoginMode ? (
        <LoginModal
          isOpen={isOpen}
          onClose={handleClose}
          onSubmit={handleLogin}
          onSwitchToRegister={switchToRegister}
          isSubmitting={isSubmitting}
        />
      ) : (
        <RegisterModal
          isOpen={isOpen}
          onClose={handleClose}
          onSubmit={handleRegister}
          onSwitchToLogin={switchToLogin}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Enhanced Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm border border-red-400/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError("")}
                className="ml-4 p-1 rounded-full hover:bg-white/20 transition-all duration-200 text-white hover:text-red-100"
                aria-label={t("common.close")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
