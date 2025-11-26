"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { BsCreditCard, BsX } from "react-icons/bs";
import PriceCard from "./PriceCard";

export default function MobilePriceBar({ pricingData, priceError, isLoading }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!pricingData && !isLoading) return null;

  return (
    <>
      {/* Floating bar - mobile only */}
      <div className="lg:hidden w-full h-20 flex items-center justify-center fixed bottom-0 left-0 right-0 z-40 bg-white backdrop-blur border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => !isLoading && setIsOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 disabled:opacity-60"
          disabled={isLoading}
          aria-label={t("flight_details.view_price_details", {
            defaultValue: "View price details",
          })}
        >
          <div className="flex items-center gap-3">
            <BsCreditCard className="w-5 h-5 text-green-600" />
            <span className="text-lg text-gray-600">
              {t("flight_details.total")}
            </span>
          </div>
          {isLoading ? (
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="text-xl font-semibold text-green-700">
              {pricingData.currency} {pricingData.total}
            </div>
          )}
        </button>
      </div>

      {/* Modal */}
      {isOpen && !isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full sm:w-[520px] mx-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 rounded-t-2xl">
              <div className="font-semibold text-gray-900">
                {t("flight_details.pricing_details")}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label={t("common.close", { defaultValue: "Close" })}
              >
                <BsX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <PriceCard pricingData={pricingData} priceError={priceError} />
            </div>
          </div>
        </div>
      )}
      {/* Spacer to avoid content being hidden behind bar */}
      <div className="lg:hidden h-[56px]" />
    </>
  );
}
