import PackageContent from "@/components/package/PackageContent";
import { getOfferById } from "@/services/apiOffers";
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

// Generate dynamic metadata based on the offer data
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const language = getLanguage();
  const offer = await getOfferById(slug, language);

  // Format the date for metadata based on language
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";
  const createdDate = offer?._createdAt
    ? new Date(offer._createdAt).toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Get localized content based on language
  const title = offer?.titleHeader?.[language] || 
    (language === "ar" ? "فلاي مون - رفيقك في السفر" : "Flymoon - Your Travel Companion");
  const description = offer?.overview?.[language] || 
    (language === "ar" 
      ? "احجز الرحلات والفنادق واكتشف الأماكن الرائعة مع فلاي مون"
      : "Book flights and hotels and discover amazing places with Flymoon");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: offer?._createdAt,
      modifiedTime: offer?._updatedAt,
      locale: language === "ar" ? "ar_SA" : "en_US",
    },
    other: {
      "article:published_time": offer?._createdAt,
      "article:modified_time": offer?._updatedAt,
      date: createdDate,
    },
    alternates: {
      canonical: `/package/${slug}`,
    },
  };
}

export default async function page({ params }) {
  const { slug } = await params;
  const language = getLanguage();
  const result = await getOfferById(slug, language);

  // Store the language in the result for comparison
  const resultWithLanguage = result ? { ...result, language } : null;

  return <PackageContent initialOffer={resultWithLanguage} slug={slug} />;
}
