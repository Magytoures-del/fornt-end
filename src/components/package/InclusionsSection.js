"use client";
import React, { useMemo, memo } from "react";
import {
  FaHotel,
  FaPassport,
  FaBusAlt,
  FaUtensils,
  FaUserTie,
  FaUmbrellaBeach,
  FaBed,
  FaBuilding,
  FaHome,
  FaCampground,
  FaCar,
  FaTrain,
  FaBus,
  FaShip,
  FaTaxi,
  FaPlane,
  FaCoffee,
  FaWineGlass,
  FaMapMarkedAlt,
  FaUserMd,
  FaShoppingBag,
  FaShieldAlt,
  FaGamepad,
  FaTicketAlt,
  FaCamera,
  FaWifi,
  FaParking,
  FaSuitcase,
  FaTshirt,
  FaBell,
  FaSimCard,
  FaMobileAlt,
  FaLanguage,
  FaPaw,
  FaBaby,
  FaWheelchair,
  FaUsers,
  FaGift,
  FaHandsHelping,
  FaFirstAid,
  FaCalendarTimes,
  FaSpa,
  FaSwimmer,
  FaTheaterMasks,
  FaUniversity,
  FaKey,
  FaTools,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

import { useTranslation } from "react-i18next";
import {
  MdFlight,
  MdLocalDining,
  MdFreeBreakfast,
  MdEventSeat,
} from "react-icons/md";

// Map feature keys to their respective icons and labels with enhanced responsive styling
const featureIcons = {
  // Accommodation
  hotel: {
    icon: <FaHotel className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50/80",
    description:
      "Comfortable accommodation with modern amenities and excellent service throughout your stay.",
  },
  resort: {
    icon: <FaUmbrellaBeach className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50/80",
    description:
      "Luxury resort experience with premium facilities and beachfront access.",
  },
  hostel: {
    icon: <FaBed className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50/80",
    description:
      "Budget-friendly hostel accommodation with shared facilities and social atmosphere.",
  },
  apartment: {
    icon: <FaBuilding className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50/80",
    description:
      "Self-contained apartment with kitchen facilities and home-like comfort.",
  },
  villa: {
    icon: <FaHome className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50/80",
    description:
      "Private villa accommodation with exclusive amenities and spacious living areas.",
  },
  camping: {
    icon: <FaCampground className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-green-600 to-green-700",
    bgColor: "bg-green-50/80",
    description:
      "Outdoor camping experience with nature immersion and adventure activities.",
  },

  // Transportation
  flight: {
    icon: <MdFlight className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50/80",
    description:
      "Round-trip flights with reputable airlines and convenient schedules for your journey.",
  },
  transportation: {
    icon: <FaBusAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50/80",
    description:
      "Reliable transportation services including transfers and local travel arrangements.",
  },
  airport_transfer: {
    icon: <FaPlane className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-50/80",
    description:
      "Convenient airport transfer service with professional drivers and timely pickup.",
  },
  car_rental: {
    icon: <FaCar className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80",
    description:
      "Flexible car rental service with various vehicle options for independent travel.",
  },
  train_tickets: {
    icon: <FaTrain className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-50/80",
    description:
      "Comfortable train travel with scenic routes and convenient schedules.",
  },
  bus_tickets: {
    icon: <FaBus className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50/80",
    description:
      "Economical bus transportation with reliable service and comfortable seating.",
  },
  ferry_boat: {
    icon: <FaShip className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50/80",
    description:
      "Scenic ferry or boat transportation with beautiful water views and relaxing journey.",
  },
  private_transfer: {
    icon: <FaTaxi className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50/80",
    description:
      "Private transfer service with dedicated vehicle and personalized assistance.",
  },
  taxi_service: {
    icon: <FaTaxi className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-yellow-600 to-yellow-700",
    bgColor: "bg-yellow-50/80",
    description:
      "On-demand taxi service for convenient local transportation and city exploration.",
  },

  // Food & Beverage
  meals: {
    icon: <FaUtensils className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80",
    description:
      "Delicious meals featuring local cuisine and international options to suit all tastes.",
  },
  breakfast: {
    icon: <MdFreeBreakfast className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-50/80",
    description:
      "Fresh daily breakfast with continental and local specialties to start your day.",
  },
  lunch: {
    icon: <MdLocalDining className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50/80",
    description:
      "Satisfying lunch options with varied menu and healthy choices throughout your trip.",
  },
  dinner: {
    icon: <FaUtensils className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50/80",
    description:
      "Fine dining experiences with local delicacies and international cuisine selections.",
  },
  snacks: {
    icon: <FaCoffee className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-amber-50/80",
    description:
      "Light snacks and refreshments available throughout your journey and activities.",
  },
  drinks: {
    icon: <FaWineGlass className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50/80",
    description:
      "Refreshing beverages including local specialties and international drink options.",
  },
  all_inclusive: {
    icon: <MdEventSeat className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50/80",
    description:
      "All-inclusive package covering all meals, drinks and resort amenities for worry-free dining.",
  },

  // Services & Assistance
  guide: {
    icon: <FaUserTie className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50/80",
    description:
      "Professional tour guides with extensive local knowledge and multilingual support.",
  },
  tour_guide: {
    icon: <FaMapMarkedAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50/80",
    description:
      "Expert tour guide service with detailed historical and cultural insights.",
  },
  local_guide: {
    icon: <FaUserTie className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50/80",
    description:
      "Local guide with insider knowledge of hidden gems and authentic experiences.",
  },
  concierge_service: {
    icon: <FaBell className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50/80",
    description:
      "Personal concierge service for reservations, recommendations and special requests.",
  },
  customer_support: {
    icon: <FaHeadset className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50/80",
    description:
      "24/7 customer support service for assistance and emergency help during your trip.",
  },
  medical_assistance: {
    icon: <FaUserMd className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-50/80",
    description:
      "Medical assistance and healthcare support available throughout your journey.",
  },
  shopping_assistance: {
    icon: <FaShoppingBag className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50/80",
    description:
      "Shopping assistance and guidance for local markets and specialty stores.",
  },

  // Documentation & Legal
  visa: {
    icon: <FaPassport className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50/80",
    description:
      "Complete visa processing assistance and documentation support for hassle-free travel.",
  },
  travel_insurance: {
    icon: <FaShieldAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50/80",
    description:
      "Comprehensive travel insurance coverage for medical emergencies and trip cancellations.",
  },
  health_insurance: {
    icon: <FaFirstAid className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80",
    description:
      "Health insurance coverage for medical treatment and emergency healthcare services.",
  },
  documentation_assistance: {
    icon: <FaPassport className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50/80",
    description:
      "Complete documentation assistance including permits, licenses and travel papers.",
  },

  // Activities & Entertainment
  activities: {
    icon: <FaGamepad className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50/80",
    description:
      "Various recreational activities and entertainment options for all age groups.",
  },
  excursions: {
    icon: <FaMapMarkedAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-green-600 to-green-700",
    bgColor: "bg-green-50/80",
    description:
      "Organized excursions to popular attractions and off-the-beaten-path destinations.",
  },
  tours: {
    icon: <FaBusAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50/80",
    description:
      "Guided tours with transportation and expert commentary on local history and culture.",
  },
  entertainment: {
    icon: <FaTheaterMasks className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50/80",
    description:
      "Evening entertainment including shows, live music and cultural performances.",
  },
  shows: {
    icon: <FaTicketAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50/80",
    description:
      "Access to popular shows, concerts and theatrical performances in the destination.",
  },
  cultural_activities: {
    icon: <FaUniversity className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-amber-50/80",
    description:
      "Cultural activities including museum visits, art galleries and historical site tours.",
  },
  adventure_activities: {
    icon: <FaMapMarkedAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-50/80",
    description:
      "Thrilling adventure activities including hiking, climbing and outdoor expeditions.",
  },
  water_sports: {
    icon: <FaSwimmer className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50/80",
    description:
      "Water sports activities including swimming, diving, surfing and boat excursions.",
  },
  spa_wellness: {
    icon: <FaSpa className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50/80",
    description:
      "Spa and wellness services including massage, meditation and relaxation treatments.",
  },

  // Entry & Access
  entry_fees: {
    icon: <FaKey className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50/80",
    description:
      "All entry fees and admission charges for attractions and venues included.",
  },
  museum_tickets: {
    icon: <FaUniversity className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50/80",
    description:
      "Museum admission tickets with priority access and guided tours available.",
  },
  attraction_tickets: {
    icon: <FaTicketAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50/80",
    description:
      "Pre-purchased tickets to popular attractions with skip-the-line access.",
  },
  event_tickets: {
    icon: <FaCalendarTimes className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50/80",
    description:
      "Special event tickets including festivals, concerts and seasonal celebrations.",
  },

  // Equipment & Amenities
  equipment_rental: {
    icon: <FaTools className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-gray-600 to-gray-700",
    bgColor: "bg-gray-50/80",
    description:
      "Equipment rental service for sports, adventure activities and specialized gear.",
  },
  gear_rental: {
    icon: <FaSuitcase className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-amber-50/80",
    description:
      "Gear rental including camping equipment, sports gear and travel accessories.",
  },
  wifi: {
    icon: <FaWifi className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-50/80",
    description:
      "High-speed Wi-Fi internet access available throughout your accommodation and venues.",
  },
  parking: {
    icon: <FaParking className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50/80",
    description:
      "Secure parking facilities available for your vehicle throughout the trip.",
  },
  baggage_handling: {
    icon: <FaSuitcase className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50/80",
    description:
      "Professional baggage handling service including porter assistance and luggage storage.",
  },
  laundry_service: {
    icon: <FaTshirt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50/80",
    description:
      "Convenient laundry and dry cleaning services available during your stay.",
  },
  room_service: {
    icon: <FaBell className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50/80",
    description:
      "24-hour room service with extensive menu options delivered to your accommodation.",
  },

  // Communication & Technology
  sim_card: {
    icon: <FaSimCard className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50/80",
    description:
      "Local SIM card provided for affordable communication and data usage during travel.",
  },
  mobile_data: {
    icon: <FaMobileAlt className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50/80",
    description:
      "Mobile data package with unlimited internet access for navigation and communication.",
  },
  photography_service: {
    icon: <FaCamera className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50/80",
    description:
      "Professional photography service to capture memorable moments throughout your journey.",
  },
  translation_service: {
    icon: <FaLanguage className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50/80",
    description:
      "Translation and interpretation services for seamless communication in local language.",
  },

  // Special Services
  pet_care: {
    icon: <FaPaw className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50/80",
    description:
      "Pet care services including boarding, walking and veterinary assistance for your companions.",
  },
  childcare: {
    icon: <FaBaby className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50/80",
    description:
      "Professional childcare services and supervised activities for children during your trip.",
  },
  elderly_care: {
    icon: <FaHandsHelping className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50/80",
    description:
      "Specialized elderly care assistance including mobility support and health monitoring.",
  },
  disability_support: {
    icon: <FaWheelchair className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50/80",
    description:
      "Comprehensive disability support services including accessibility assistance and equipment.",
  },
  group_coordination: {
    icon: <FaUsers className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-50/80",
    description:
      "Professional group coordination services for seamless organization and management.",
  },

  // Miscellaneous
  souvenir_package: {
    icon: <FaGift className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50/80",
    description:
      "Curated souvenir package featuring authentic local crafts and memorable keepsakes.",
  },
  welcome_package: {
    icon: <FaHandsHelping className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50/80",
    description:
      "Special welcome package with local treats, maps and essential travel information.",
  },
  travel_kit: {
    icon: <FaSuitcase className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50/80",
    description:
      "Complete travel kit with essential items, adapters and convenience accessories.",
  },
  emergency_fund: {
    icon: <FaFirstAid className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80",
    description:
      "Emergency fund coverage for unexpected expenses and urgent assistance during travel.",
  },
  flexible_cancellation: {
    icon: <FaCalendarTimes className="text-lg sm:text-xl lg:text-2xl" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50/80",
    description:
      "Flexible cancellation policy with full or partial refund options for peace of mind.",
  },
};

// Helper function to get feature key
const getFeatureKey = (feature) => {
  return typeof feature === "string" ? feature : feature._key || feature.type;
};

// Helper function to get feature type
const getFeatureType = (feature) => {
  return typeof feature === "string" ? feature : feature.type;
};

// Map bg color hues to matching text color classes (explicit for Tailwind)
const TEXT_COLOR_BY_HUE = {
  blue: "text-blue-600",
  teal: "text-teal-600",
  orange: "text-orange-600",
  gray: "text-gray-600",
  emerald: "text-emerald-600",
  green: "text-green-600",
  indigo: "text-indigo-600",
  yellow: "text-yellow-600",
  sky: "text-sky-600",
  red: "text-red-600",
  violet: "text-violet-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
  pink: "text-pink-600",
  cyan: "text-cyan-600",
  purple: "text-purple-600",
};

const getTextColorFromBg = (bgClass = "") => {
  for (const hue of Object.keys(TEXT_COLOR_BY_HUE)) {
    if (bgClass.includes(hue)) return TEXT_COLOR_BY_HUE[hue];
  }
  return TEXT_COLOR_BY_HUE.gray;
};

const InclusionsSection = memo(({ tripFeatures = [] }) => {
  const { t, i18n } = useTranslation();

  // Memoize current language
  const currentLang = i18n.language;

  // Memoize processed features to avoid unnecessary re-computations
  const processedFeatures = useMemo(() => {
    return tripFeatures.filter(Boolean).map((feature, index) => ({
      originalFeature: feature,
      featureType: getFeatureType(feature),
      featureKey: getFeatureKey(feature),
      index,
    }));
  }, [tripFeatures]);

  // Improved empty state with better UX
  const EmptyState = useMemo(() => {
    if (processedFeatures.length > 0) return null;

    return (
      <div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 my-6"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FaHotel className="text-3xl sm:text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            {t("tripIncludes") || "Trip Features"}
          </h3>
          <p className="text-gray-500 text-base sm:text-lg mb-3 max-w-md mx-auto">
            {t("noFeaturesAvailable") || "No features available for this trip"}
          </p>
          <div className="mt-4 text-sm text-gray-400">
            {t(
              "featuresWillDisplay",
              "Features will be displayed here when available"
            )}
          </div>
        </div>
      </div>
    );
  }, [processedFeatures.length, t]);

  if (EmptyState) return EmptyState;

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-start">
          {t("tripIncludes", "Trip Includes")}
        </h3>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 ml-0 rounded-full"></div>
        {/* Instruction removed since details are always visible */}
      </div>

      <div className="trip-details-container bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-8 my-6">
        {/* Features display with compact single column layout */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {processedFeatures.map(
            ({ originalFeature: feature, featureType, featureKey, index }) => {
              // Get feature title and brief with proper fallbacks
              const featureTitle =
                typeof feature === "string"
                  ? t(`featuresTrip.${feature}`)
                  : feature.title?.[currentLang] ||
                    feature.title?.ar ||
                    feature.title?.en ||
                    t(`featuresTrip.${featureType}`) ||
                    featureType
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());

              const featureBrief =
                typeof feature === "string"
                  ? null
                  : feature.brief?.[currentLang] ||
                    feature.brief?.ar ||
                    feature.brief?.en;

              const featureConfig = featureIcons[featureType] || {
                icon: <FaHotel className="text-lg sm:text-xl lg:text-2xl" />,
                color: "from-gray-500 to-gray-600",
                bgColor: "bg-gray-50/80",
                description:
                  "Additional feature included in your trip package.",
              };
              const iconTextColor = getTextColorFromBg(featureConfig.bgColor);

              return (
                <div
                  key={featureKey}
                  className={`feature-card group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-5 transition-all duration-300 transform-gpu hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300 hover:bg-blue-50/40 border-l-4 border-l-blue-500/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInLeft 0.6s ease-out both",
                  }}
                >
                  {/* Background gradient overlay removed for cleaner look */}

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      {/* Feature content - Left side */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 flex-shrink-0 ring-1 ring-gray-100 bg-white/70">
                          <div className={`  ${iconTextColor}`}>
                            {featureConfig.icon}
                          </div>
                        </div>
                        <span className="text-lg sm:text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 text-left truncate">
                          {featureTitle}
                        </span>
                      </div>

                      {/* Included check */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shadow-sm">
                          <FaCheckCircle className="text-green-600 text-lg" />
                        </div>
                      </div>
                    </div>

                    {/* Details always visible */}
                    <div className="mt-4">
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-gray-600  text-sm sm:text-lg text-left leading-11">
                          {featureBrief ||
                            t(`featuresTrip.${featureType}_description`) ||
                            featureConfig.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Click instruction for mobile with RTL support */}
      </div>
    </div>
  );
});

// Set display name for debugging
InclusionsSection.displayName = "InclusionsSection";

// Enhanced keyframes for RTL animations with improved performance
const createStyleSheet = () => {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translate3d(-20px, 10px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    

    
    .transform-gpu {
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
      will-change: transform;
    }
    
    /* Improve scrolling performance */
    .trip-details-container {
      contain: layout style paint;
    }
    
    /* Reduce layout shift */
    .feature-card {
      contain: layout;
    }
    
    /* Improve focus styles */
    .feature-card:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `;

  // Only add styles once
  if (!document.querySelector("#trip-details-styles")) {
    style.id = "trip-details-styles";
    document.head.appendChild(style);
  }
};

// Initialize styles
if (typeof document !== "undefined") {
  createStyleSheet();
}

export default InclusionsSection;
