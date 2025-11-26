"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import HeroSection from "@/components/place/HeroSection";
import OfferGrid from "@/components/place/OfferGrid";

const PlaceContent = ({ initialData, slug }) => {
  const { i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const previousLanguageRef = useRef(initialData?.language || i18n.language || "ar");
  const isInitialMount = useRef(true);

  // Refetch destination when language changes
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousLanguageRef.current = i18n.language || currentLanguage || "ar";
      return;
    }

    const currentLang = i18n.language || currentLanguage || "ar";
    
    // Only refetch if language actually changed
    if (currentLang === previousLanguageRef.current) {
      return;
    }

    previousLanguageRef.current = currentLang;

    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/places/${slug}?lang=${currentLang}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setData(result.data);
          }
        } else {
          console.error("Failed to fetch destination:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure cookies are set
    const timeoutId = setTimeout(() => {
      fetchDestination();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [i18n.language, currentLanguage, slug]);

  return (
    <div className="relative">
      <HeroSection place={data?.destination} />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-semibold text-gray-700">
              {i18n.language === "ar" ? "جاري التحميل..." : "Loading..."}
            </p>
            <p className="text-sm text-gray-500">
              {i18n.language === "ar" 
                ? "جاري تحديث المحتوى باللغة المختارة" 
                : "Updating content in selected language"}
            </p>
          </div>
        </div>
      )}
      
      <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
        <OfferGrid offers={data?.offers || []} />
      </div>
    </div>
  );
};

export default PlaceContent;

