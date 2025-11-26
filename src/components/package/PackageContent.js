"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import HeroSection from "@/components/package/HeroSection";
import InclusionsSection from "@/components/package/InclusionsSection";
import OverviewSection from "@/components/package/OverviewSection";
import PackageClient from "@/components/package/PackageClient";

const PackageContent = ({ initialOffer, slug }) => {
  const { i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [offer, setOffer] = useState(initialOffer);
  const [isLoading, setIsLoading] = useState(false);
  const previousLanguageRef = useRef(initialOffer?.language || i18n.language || "ar");
  const isInitialMount = useRef(true);

  // Refetch offer when language changes
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

    const fetchOffer = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/offers/${slug}?lang=${currentLang}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setOffer(result.data);
          }
        } else {
          console.error("Failed to fetch offer:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure cookies are set
    const timeoutId = setTimeout(() => {
      fetchOffer();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [i18n.language, currentLanguage, slug]);

  return (
    <div className="min-h-screen relative">
      <HeroSection offer={offer} isLoading={isLoading} />
      
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
      
      <div className={`max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            <OverviewSection offer={offer} />
            <InclusionsSection tripFeatures={offer?.inclusions} />
          </div>

          {/* Client Component with Modal State */}
          <PackageClient offer={offer} />
        </div>
      </div>
    </div>
  );
};

export default PackageContent;

