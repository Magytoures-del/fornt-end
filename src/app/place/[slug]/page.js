import PlaceContent from "@/components/place/PlaceContent";
import { getDestinationById } from "@/services/apiOffers";
import { cookies } from "next/headers";

// Helper function to get language from cookies
function getLanguage() {
  const cookieStore = cookies();
  // Check both i18next cookie (used by i18next-browser-languagedetector) and language cookie
  const language = cookieStore.get("i18next")?.value || 
                   cookieStore.get("language")?.value || 
                   "ar";
  // Ensure we only return supported languages
  return language === "en" ? "en" : "ar";
}

export default async function page({ params }) {
  const { slug } = await params;
  const language = getLanguage();
  const result = await getDestinationById(slug, language);

  // Store the language in the result for comparison
  const resultWithLanguage = result ? { ...result, language } : null;

  return <PlaceContent initialData={resultWithLanguage} slug={slug} />;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const language = getLanguage();
  const result = await getDestinationById(slug, language);

  const destinationTitle = result?.destination?.title;
  const bannerTitle = result?.destination?.imageBanner?.title;
  
  // Get localized fallback text based on language
  const descriptionFallback = bannerTitle || 
    (language === "ar" 
      ? "اكتشف الوجهات السياحية الرائعة مع فلاي مون"
      : "Discover amazing tourist destinations with Flymoon");
  const baseTitle = language === "ar" 
    ? "فلاي مون - رفيقك في السفر"
    : "Flymoon - Your Travel Companion";
  const title = destinationTitle
    ? `${destinationTitle} | ${baseTitle}`
    : baseTitle;

  return {
    title,
    description: descriptionFallback,
    alternates: {
      canonical: `/place/${slug}`,
    },
    openGraph: {
      title,
      description: descriptionFallback,
      type: "website",
      locale: language === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      title,
      description: descriptionFallback,
      card: "summary_large_image",
    },
  };
}
