"use client";

import { useState, useEffect } from "react";

export default function ScrollIndicator({ t }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return null;
  }

  return (
    <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-0 xl:bottom-0 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3">
        <div className="text-white/80 text-[clamp(0.625rem,1.2vw,0.75rem)] sm:text-[clamp(0.6875rem,1.1vw,0.8125rem)] font-medium tracking-wide">
          {t("packages.hero.scrollDown")}
        </div>
        <div className="animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 md:w-6 md:h-10 lg:w-6 lg:h-10 xl:w-6 xl:h-10 border-2 border-white/60 rounded-full flex justify-center shadow-lg">
            <div className="w-0.5 h-2 sm:w-1 sm:h-3 md:w-1 md:h-3 lg:w-1 lg:h-3 xl:w-1 xl:h-3 bg-white/90 rounded-full mt-1.5 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
