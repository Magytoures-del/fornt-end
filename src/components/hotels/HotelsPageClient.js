"use client";

import { useTranslation } from "react-i18next";

export default function HotelsPageClient() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t("hotels.title")}
        </h1>
        <p className="text-gray-600">{t("hotels.search_placeholder")}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">{t("hotels.coming_soon")}</p>
      </div>
    </div>
  );
}
