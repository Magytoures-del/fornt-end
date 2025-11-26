"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsAndConditionsPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const sections = [
    { id: "definitions", key: "definitions" },
    { id: "use", key: "use" },
    { id: "booking", key: "booking" },
    { id: "cancellation", key: "cancellation" },
    { id: "privacy", key: "privacy" },
    { id: "ip", key: "ip" },
    { id: "liability", key: "liability" },
    { id: "law", key: "law" },
    { id: "changes", key: "changes" },
    { id: "contact", key: "contact" },
  ];

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {t("terms_and_conditions.title")}
          </h1>
          <p className="mt-2 text-blue-100">{t("terms_and_conditions.last_updated")}</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 mt-8" dir={isRTL ? "rtl" : "ltr"}>
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                {t("terms_and_conditions.table_of_contents")}
              </h2>
              <nav className="space-y-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-gray-700 hover:text-blue-600"
                  >
                    {t(`terms_and_conditions.sections.${s.key}.title`)}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="md:col-span-8 lg:col-span-9">
            <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="prose prose-slate max-w-none prose-headings:font-bold">
                <p>{t("terms_and_conditions.intro")}</p>

                <h2 id="definitions">{t("terms_and_conditions.sections.definitions.title")}</h2>
                <p>{t("terms_and_conditions.sections.definitions.content")}</p>

                <h2 id="use">{t("terms_and_conditions.sections.use.title")}</h2>
                <ul>
                  <li>{t("terms_and_conditions.sections.use.item1")}</li>
                  <li>{t("terms_and_conditions.sections.use.item2")}</li>
                  <li>{t("terms_and_conditions.sections.use.item3")}</li>
                </ul>

                <h2 id="booking">{t("terms_and_conditions.sections.booking.title")}</h2>
                <ul>
                  <li>{t("terms_and_conditions.sections.booking.item1")}</li>
                  <li>{t("terms_and_conditions.sections.booking.item2")}</li>
                  <li>{t("terms_and_conditions.sections.booking.item3")}</li>
                </ul>

                <h2 id="cancellation">{t("terms_and_conditions.sections.cancellation.title")}</h2>
                <p>{t("terms_and_conditions.sections.cancellation.content")}</p>

                <h2 id="privacy">{t("terms_and_conditions.sections.privacy.title")}</h2>
                <p>{t("terms_and_conditions.sections.privacy.content")}</p>

                <h2 id="ip">{t("terms_and_conditions.sections.ip.title")}</h2>
                <p>{t("terms_and_conditions.sections.ip.content")}</p>

                <h2 id="liability">{t("terms_and_conditions.sections.liability.title")}</h2>
                <p>{t("terms_and_conditions.sections.liability.content")}</p>

                <h2 id="law">{t("terms_and_conditions.sections.law.title")}</h2>
                <p>{t("terms_and_conditions.sections.law.content")}</p>

                <h2 id="changes">{t("terms_and_conditions.sections.changes.title")}</h2>
                <p>{t("terms_and_conditions.sections.changes.content")}</p>

                <h2 id="contact">{t("terms_and_conditions.sections.contact.title")}</h2>
                <p>{t("terms_and_conditions.sections.contact.content")}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
