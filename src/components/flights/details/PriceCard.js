import React from "react";
import { useTranslation } from "react-i18next";
import { BsCreditCard, BsInfoCircle } from "react-icons/bs";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

/**
 * Get currency symbol (localized) - returns JSX for SAR, string for others
 */
const getCurrencySymbol = (currency, t) => {
  const symbols = {
    USD: "$",
    SAR: null, // Will use SARCurrencyIcon component
    AED: t("common.currency_aed") || "AED",
    EUR: "€",
    GBP: "£",
    INR: "₹",
  };
  return symbols[currency] !== undefined ? symbols[currency] : currency || null;
};

/**
 * Format price with currency symbol
 * Returns JSX if currency is SAR (to use icon), otherwise returns string
 */
const formatPrice = (amount, currency, currencySymbol) => {
  const formattedAmount =
    typeof amount === "number"
      ? amount.toFixed(2)
      : (parseFloat(amount) || 0).toFixed(2);

  // If SAR, return JSX with icon
  if (currency === "SAR") {
    return (
      <span className="inline-flex items-center gap-1" dir="ltr">
        <SARCurrencyIcon className="w-4 h-4 inline-flex" /> {formattedAmount}
      </span>
    );
  }

  // For other currencies, return string
  return `${currencySymbol} ${formattedAmount}`;
};

export default function PriceCard({ pricingData, priceError }) {
  const { t } = useTranslation();

  const currency = pricingData?.currency || "SAR";
  const currencySymbol = getCurrencySymbol(currency, t);

  // Calculate main price (total - tax)
  const total = parseFloat(pricingData?.total || 0);
  const tax = parseFloat(pricingData?.taxes || 0);
  const mainPrice = total - tax;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BsCreditCard className="w-5 h-5 text-green-600" />
          {t("flight_details.pricing_details")}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Main Price */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">
            {t("flight_details.main_price")}
          </span>
          <span className="font-semibold text-gray-900">
            {formatPrice(mainPrice, currency, currencySymbol)}
          </span>
        </div>

        {/* Taxes */}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {t("flight_details.taxes")}
          </span>
          <span className="font-semibold text-gray-900">
            {formatPrice(tax, currency, currencySymbol)}
          </span>
        </div>

        {/* Additional Services */}
        {pricingData?.baggage && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <BsInfoCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-700">
                {t("flight_details.additional_services")}
              </span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {t("flight_details.baggage_allowance")}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
                  {pricingData.baggage}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t-2 border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">
              {t("flight_details.total")}
            </span>
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(total, currency, currencySymbol)}
            </span>
          </div>
        </div>

        {priceError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <BsInfoCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-xs text-red-600">
                {t("flight_details.price_verification_failed")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
