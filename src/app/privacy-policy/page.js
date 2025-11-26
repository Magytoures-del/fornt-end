"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const sections = [
    { id: "controller", key: "controller" },
    { id: "data-we-collect", key: "data_we_collect" },
    { id: "purposes", key: "purposes" },
    { id: "sharing", key: "sharing" },
    { id: "cross-border", key: "cross_border" },
    { id: "retention", key: "retention" },
    { id: "rights", key: "rights" },
    { id: "security", key: "security" },
    { id: "cookies", key: "cookies" },
    { id: "minors", key: "minors" },
    { id: "contact", key: "contact" },
    { id: "changes", key: "changes" },
  ];

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {t("privacy_policy.title")}
          </h1>
          <p className="mt-2 text-blue-100">{t("privacy_policy.last_updated")}</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 mt-8" dir={isRTL ? "rtl" : "ltr"}>
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                {t("privacy_policy.table_of_contents")}
              </h2>
              <nav className="space-y-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-gray-700 hover:text-blue-600"
                  >
                    {t(`privacy_policy.sections.${s.key}.title`)}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="md:col-span-8 lg:col-span-9">
            <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="prose prose-slate max-w-none prose-headings:font-bold">
                <p>{t("privacy_policy.intro")}</p>

                <h2 id="controller">{t("privacy_policy.sections.controller.title")}</h2>
                <p>{t("privacy_policy.sections.controller.content")}</p>

                <h2 id="data-we-collect">{t("privacy_policy.sections.data_we_collect.title")}</h2>
                <ul>
                  <li>{t("privacy_policy.sections.data_we_collect.identity")}</li>
                  <li>{t("privacy_policy.sections.data_we_collect.booking")}</li>
                  <li>{t("privacy_policy.sections.data_we_collect.payment")}</li>
                  <li>{t("privacy_policy.sections.data_we_collect.usage")}</li>
                </ul>

                <h2 id="purposes">{t("privacy_policy.sections.purposes.title")}</h2>
                <ul>
                  <li>{t("privacy_policy.sections.purposes.contract")}</li>
                  <li>{t("privacy_policy.sections.purposes.legitimate")}</li>
                  <li>{t("privacy_policy.sections.purposes.legal")}</li>
                  <li>{t("privacy_policy.sections.purposes.consent")}</li>
                </ul>

                <h2 id="sharing">{t("privacy_policy.sections.sharing.title")}</h2>
                <p>{t("privacy_policy.sections.sharing.content")}</p>

                <h2 id="cross-border">{t("privacy_policy.sections.cross_border.title")}</h2>
                <p>{t("privacy_policy.sections.cross_border.content")}</p>

                <h2 id="retention">{t("privacy_policy.sections.retention.title")}</h2>
                <p>{t("privacy_policy.sections.retention.content")}</p>

                <h2 id="rights">{t("privacy_policy.sections.rights.title")}</h2>
                <ul>
                  <li>{t("privacy_policy.sections.rights.access")}</li>
                  <li>{t("privacy_policy.sections.rights.correction")}</li>
                  <li>{t("privacy_policy.sections.rights.deletion")}</li>
                  <li>{t("privacy_policy.sections.rights.withdraw")}</li>
                  <li>{t("privacy_policy.sections.rights.complaint")}</li>
                </ul>

                <h2 id="security">{t("privacy_policy.sections.security.title")}</h2>
                <p>{t("privacy_policy.sections.security.content")}</p>

                <h2 id="cookies">{t("privacy_policy.sections.cookies.title")}</h2>
                <p>{t("privacy_policy.sections.cookies.content")}</p>

                <h2 id="minors">{t("privacy_policy.sections.minors.title")}</h2>
                <p>{t("privacy_policy.sections.minors.content")}</p>

                <h2 id="contact">{t("privacy_policy.sections.contact.title")}</h2>
                <p>{t("privacy_policy.sections.contact.content")}</p>

                <h2 id="changes">{t("privacy_policy.sections.changes.title")}</h2>
                <p>{t("privacy_policy.sections.changes.content")}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
