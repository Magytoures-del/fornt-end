import React from "react";
import { useRouter } from "next/navigation";
import { Home, Hotel, ChevronRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Breadcrumb navigation component for hotel details
 * @param {Object} props - Component props
 * @param {string} props.hotelName - Hotel name
 * @param {string} props.city - City name
 */
const Breadcrumb = ({ hotelName, city }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const breadcrumbItems = [
    {
      icon: Home,
      label: t("common.home"),
      onClick: () => router.push("/"),
      className: "hover:text-blue-600",
    },
    {
      icon: Hotel,
      label: t("common.hotels"),
      onClick: () => router.push("/hotels"),
      className: "hover:text-blue-600",
    },
  ];

  if (city) {
    breadcrumbItems.push({
      icon: MapPin,
      label: city,
      className: "text-gray-500",
    });
  }

  if (hotelName) {
    breadcrumbItems.push({
      label: hotelName,
      className: "font-medium text-gray-900 truncate max-w-xs",
    });
  }

  return (
    <nav
      className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-8 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 shadow-sm"
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
          )}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className={`flex items-center gap-1.5 transition-all duration-200 rounded-lg px-2 py-1 hover:bg-blue-50 ${item.className}`}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.icon && (
                <item.icon className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="font-medium">{item.label}</span>
            </button>
          ) : (
            <span className={`flex items-center gap-1.5 px-2 py-1 ${item.className}`}>
              {item.icon && (
                <item.icon className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="font-medium">{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

