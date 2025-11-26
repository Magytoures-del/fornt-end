import { cookies } from "next/headers";
import arTranslation from "@/locales/ar/translation.json";
import enTranslation from "@/locales/en/translation.json";

// Helper function to get language from cookies
async function getLanguage() {
  try {
    const cookieStore = await cookies();
    const language =
      cookieStore.get("i18next")?.value ||
      cookieStore.get("language")?.value ||
      "ar";
    return language === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
}

// Helper function to get translation
function getTranslation(language, key, fallback) {
  const translations = language === "en" ? enTranslation : arTranslation;
  const keys = key.split(".");
  let value = translations;
  for (const k of keys) {
    value = value?.[k];
  }
  return value || fallback;
}

export default async function Loading() {
  const language = await getLanguage();
  const t = (key, fallback) => getTranslation(language, key, fallback);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-200/50 p-8 sm:p-12 lg:p-16 max-w-md mx-auto border border-white/50">
          {/* Animated spinner */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200/30"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin"
              style={{ animationDuration: "2s" }}
            ></div>
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-600 border-l-blue-500 animate-spin"
              style={{
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            ></div>
          </div>

          {/* Loading text */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("loading_page.title", "جاري التحميل...")}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              {t("loading_page.subtitle", "يرجى الانتظار قليلاً")}
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-progress-loading"></div>
            </div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="mt-8 text-gray-500 text-sm animation-delay-500">
          <p>{t("loading_page.message", "نحضر تجربتك المثالية...")}</p>
        </div>
      </div>
    </div>
  );
}
