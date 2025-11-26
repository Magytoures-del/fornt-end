// app/page.tsx or app/page.js
import Script from "next/script";
import Flights from "./flights/page";

export const metadata = {
  title: "فلاي مون | أفضل عروض باقات السفر وحجز الطيران والفنادق في السعودية",
  description:
    "استكشف أفضل باقات السفر واحجز تذاكر الطيران والفنادق مع فلاي مون بأسعار تنافسية وخدمة موثوقة داخل وخارج المملكة.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "فلاي مون | أفضل عروض باقات السفر وحجز الطيران والفنادق في السعودية",
    description:
      "استكشف أفضل باقات السفر واحجز تذاكر الطيران والفنادق مع فلاي مون بأسعار تنافسية وخدمة موثوقة داخل وخارج المملكة.",
    url: "https://flymoon.sa",
    type: "website",
  },
  twitter: {
    title: "فلاي مون | أفضل عروض باقات السفر وحجز الطيران والفنادق في السعودية",
    description:
      "استكشف أفضل باقات السفر واحجز تذاكر الطيران والفنادق مع فلاي مون بأسعار تنافسية وخدمة موثوقة داخل وخارج المملكة.",
    card: "summary_large_image",
  },
};

export default function Home() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "فلاي مون للسفر والسياحة",
    url: "https://flymoon.sa",
    logo: "https://flymoon.sa/logo.png",
    telephone: "+1234567890",
    address: "مكة المكرمة، المملكة العربية السعودية",
    areaServed: "SA",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "فلاي مون | Flymoon",
    url: "https://flymoon.sa",
    inLanguage: "ar-SA",
  };


  return (
    <>
      <Script
        id="org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(organizationJsonLd)}
      </Script>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(websiteJsonLd)}
      </Script>

      <Flights />
    </>
  );
}
