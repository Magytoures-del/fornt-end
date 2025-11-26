"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  RiCloseLine,
  RiBookmarkLine,
  RiCalendarEventFill,
} from "react-icons/ri";
import BookingForm from "./BookingForm";

const BookingModal = ({ offer, isOpen, onClose }) => {
  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Reset success state when modal opens/closes
  useEffect(() => {
    if (!isOpen) setSuccess(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10 border-b border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <RiCalendarEventFill className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {t("form.modal_title", "احجز رحلتك الآن")}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {offer?.titleHeader?.ar ||
                      offer?.titleHeader?.en ||
                      t("form.modal_subtitle", "املأ البيانات لإتمام الحجز")}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={t("common.close", "إغلاق")}
              >
                <RiCloseLine className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-0">
            {success ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-2">
                  {t("form.success_title", "تم إرسال الحجز بنجاح!")}
                </h3>
                <p className="text-gray-700 mb-6">
                  {t(
                    "form.success_message",
                    "سنتواصل معك قريبًا لتأكيد الحجز. شكرًا لاختيارك لنا!"
                  )}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("common.close", "إغلاق")}
                </button>
              </div>
            ) : (
              <BookingForm
                offer={offer}
                onSubmit={(data) => {
                  // Handle successful submission
                  setSuccess(true);
                  // You can add custom logic here
                  // Optionally: onClose();
                }}
                className="border-0 shadow-none rounded-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
