"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

/**
 * Reusable Header Logo Component
 * @param {Object} props
 * @param {boolean} props.isScrolled - Whether header is in scrolled state
 * @param {string} props.className - Additional CSS classes
 */
export default function HeaderLogo({ isScrolled = false, className = "" }) {
  const { t } = useTranslation();

  const logoSrc = isScrolled ? "/logo.png" : "/light-logo.png";
  const logoAlt = t("header.logo_alt");

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={100}
        height={100}
        sizes="(max-width: 768px) 100px, 120px"
        className="md:w-[100px] md:h-[100px]"
        suppressHydrationWarning
        priority
      />
    </Link>
  );
}

