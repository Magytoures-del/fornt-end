"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

/**
 * Breadcrumb navigation component
 */
export default function Breadcrumb({ currentStep, stepName }) {
  const { t } = useTranslation();

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {t("common.home")}
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        <li>
          <Link
            href="/flights"
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {t("flights.title")}
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        <li className="text-gray-900 font-semibold">
          {stepName ||
            t("flight_details.title", { defaultValue: "Flight Details" })}
        </li>
      </ol>
    </nav>
  );
}

