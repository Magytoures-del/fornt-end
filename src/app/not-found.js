"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-1 items-center justify-center py-24">
      <div className="text-center px-4">
        <div className="text-5xl md:text-7xl font-extrabold text-blue-600">
          404
        </div>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
          {t("not_found.title", "Page not found")}
        </h1>
        <p className="mt-2 text-gray-600">
          {t(
            "not_found.subtitle",
            "The page you're looking for doesn't exist or was moved"
          )}
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 transition-colors"
          >
            {t("not_found.back_home", "Back to homepage")}
          </Link>
        </div>
      </div>
    </section>
  );
}
