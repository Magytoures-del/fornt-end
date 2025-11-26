"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineGift,
  HiOutlineAcademicCap,
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { BiSolidPlaneAlt } from "react-icons/bi";
const iconMap = {
  HiOutlineGift,
  HiOutlineAcademicCap,
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
  BiSolidPlaneAlt,
};

const MainNav = ({ item, isScrolled = true }) => {
  const pathname = usePathname();
  const IconComponent = iconMap[item.icon];

  // Check if the current path matches the item route
  const isActive =
    pathname === item.route ||
    (item.route !== "/" && pathname.startsWith(item.route));

  return (
    <Link
      href={item.route}
      className={` relative h-full flex items-center gap-1 sm:gap-2 md:gap-3 px-1.5 sm:px-2 md:px-3 py-2 sm:py-2.5 md:py-3 lg:py-4  text-xs sm:text-sm md:text-sm font-semibold transition-all duration-300 whitespace-nowrap min-w-max overflow-hidden ${
        isActive
          ? "bg-gray-100 text-gray-700 border-b-4 border-blue-500"
          : isScrolled
          ? "text-gray-700 hover:text-blue-600 hover:bg-white/60 hover:shadow-md hover:backdrop-blur-md"
          : "text-white hover:text-blue-200 hover:bg-white/10 hover:shadow-md hover:backdrop-blur-md"
      }`}
    >
      {/* Background effects */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl ${
          isScrolled
            ? "bg-gradient-to-r from-blue-50/80 to-purple-50/80"
            : "bg-gradient-to-r from-white/10 to-white/5"
        }`}
      ></div>

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl blur-sm transform scale-110 ${
          isScrolled
            ? "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            : "bg-gradient-to-r from-white/20 to-white/10"
        }`}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-1 sm:gap-2 md:gap-3">
        {IconComponent && (
          <div
            className={`flex-shrink-0 transition-transform duration-200 ${
              isActive
                ? "text-gray-600"
                : isScrolled
                ? "text-gray-600 group-hover:text-blue-600"
                : "text-white group-hover:text-blue-200"
            }`}
          >
            <IconComponent className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </div>
        )}

        <span
          className={`font-medium transition-colors duration-300 ${
            isActive
              ? "text-gray-700"
              : isScrolled
              ? "text-gray-700 group-hover:text-blue-600"
              : "text-white group-hover:text-blue-200"
          }`}
          suppressHydrationWarning
        >
          {item.name}
        </span>
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-150">
        <div
          className={`absolute inset-0 rounded-lg sm:rounded-xl animate-ping ${
            isScrolled ? "bg-white/20" : "bg-white/10"
          }`}
        ></div>
      </div>
    </Link>
  );
};

export default MainNav;
