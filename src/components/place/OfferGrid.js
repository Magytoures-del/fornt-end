"use client";
import OfferCard from "../packages/OfferCard";
import { useTranslation } from "react-i18next";

export default function OfferGrid({ offers }) {
  const { t } = useTranslation();
  console.log(offers);
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("place.offers.title", "الباقات المتاحة")}
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t("place.offers.description", "اكتشف الباقات المتاحة لهذه الوجهة")}
        </p>

        {/* Decorative line */}
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-5 md:px-0">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
