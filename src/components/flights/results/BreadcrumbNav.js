"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

/**
 * Breadcrumb navigation component for flight results page
 */
export default function BreadcrumbNav() {
  const { t } = useTranslation();

  const breadcrumbItems = [
    { label: t("common.home"), href: "/" },
    { label: t("flights.title"), href: "/flights" },
    { label: t("flights.results.breadcrumb"), href: null, isActive: true },
  ];

  return (
    <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-2 sm:gap-3 text-sm sm:text-base">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span
                className="flex items-center text-gray-400 mx-2"
                aria-hidden="true"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-blue-600 transition-all duration-200 font-medium hover:underline underline-offset-2"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${
                  item.isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}



