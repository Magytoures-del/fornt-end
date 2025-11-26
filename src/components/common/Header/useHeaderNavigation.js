"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook for header navigation items
 * Memoizes navigation based on i18n language to prevent hydration mismatch
 * @returns {Array} - Navigation items array
 */
export function useHeaderNavigation() {
  const { t, i18n } = useTranslation();

  const navigation = useMemo(
    () => [
      {
        name: t("common.flights"),
        href: "/",
        route: "/",
        icon: "BiSolidPlaneAlt",
      },
      {
        name: t("common.hotels"),
        href: "/hotels",
        route: "/hotels",
        icon: "HiOutlineBuildingOffice2",
      },
      {
        name: t("common.packages"),
        href: "/packages",
        route: "/packages",
        icon: "HiOutlineGift",
      },
      {
        name: t("common.about"),
        href: "/about-us",
        route: "/about-us",
        icon: "HiOutlineInformationCircle",
      },
      {
        name: t("common.contact"),
        href: "/contact",
        route: "/contact",
        icon: "HiOutlinePhone",
      },
    ],
    [t, i18n.language]
  );

  return navigation;
}

