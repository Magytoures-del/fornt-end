"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { LuPlaneTakeoff, LuPlaneLanding } from "react-icons/lu";
import { MdLuggage } from "react-icons/md";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";
import Link from "next/link";
import BaggageModal from "@/components/flights/BaggageModal";
import SeatModal from "@/components/flights/SeatModal";
import FlightInfoModal from "@/components/flights/FlightInfoModal";
import { getLocalizedCityName } from "@/utils/cityLocalization";
import {
  getLocalizedAirport,
  preloadAirportLocalization,
} from "@/utils/airportLocalization";
import { getLocalizedAirlineName } from "@/utils/airlineLocalization";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { localizeNumber, localizeCurrency } from "@/utils/numberLocalization";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";
// Connection Tooltip Component
const ConnectionTooltip = ({ connections, isVisible, position }) => {
  const { t } = useTranslation();

  if (!isVisible || !connections || connections.length === 0) return null;

  return (
    <div
      className={`absolute z-50 bg-gray-900 text-white rounded-lg p-3 shadow-xl border border-gray-700 min-w-[280px] max-w-[320px] fadeIn ${
        position === "top" ? "bottom-full mb-2" : "top-full mt-2"
      } left-1/2 transform -translate-x-1/2`}
    >
      {/* Arrow */}
      <div
        className={`absolute w-3 h-3 bg-gray-900 transform rotate-45 border-gray-700 ${
          position === "top" ? "top-full -mt-1.5" : "bottom-full -mb-1.5"
        } left-1/2 -translate-x-1/2`}
      ></div>

      <div className="relative z-10">
        <h4 className="font-semibold text-sm mb-2 text-blue-300">
          {t("flight_results.connection_details")}
        </h4>
        <div className="space-y-2">
          {connections.map((connection, index) => (
            <div key={index} className="bg-gray-800 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-300 font-medium">
                  {connection.airport}
                </span>
                <span className="text-xs text-blue-300 font-medium">
                  {connection.duration}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {connection.arrivalAirportName}
              </div>
              {connection.flightNo && (
                <div className="text-xs text-gray-400 mt-1">
                  {t("flight_results.flight")}: {connection.flightNo}
                </div>
              )}
              {connection.marketingAirline && (
                <div className="text-xs text-gray-400">
                  {connection.marketingAirline.split("|")[1] ||
                    connection.marketingAirline}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FlightCard({
  results,
  origin,
  destination,
  selectedFlight,
  onFlightSelect,
}) {
  const [tooltipStates, setTooltipStates] = useState({});
  const [isBaggageOpen, setIsBaggageOpen] = useState(false);
  const [isSeatOpen, setIsSeatOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [baggageValue, setBaggageValue] = useState("none");
  const [seatValue, setSeatValue] = useState("no_preference");
  const [activeFlightForModal, setActiveFlightForModal] = useState(null);
  const { t, i18n } = useTranslation();

  // Preload airport localization for current language
  React.useEffect(() => {
    preloadAirportLocalization(i18n.language);
  }, [i18n.language]);

  const handleBooking = (flight) => {
    // TODO: Implement booking logic
    console.log("Booking flight:", flight);
    // Redirect to booking page or open booking modal
  };

  const handleFlightSelect = (flight) => {
    if (onFlightSelect) {
      onFlightSelect(flight);
    }
  };

  const getAirlineLogo = (airlineCode) => {
    const code = (airlineCode || "").toString().trim().toUpperCase();
    if (!code) return "/logo.png";
    return `https://sacontent.akbartravels.com/AirlineLogo/assets/images/v2/AirlineLogo/${code}.png`;
  };

  const formatPrice = (price) => {
    return localizeNumber(price, i18n?.language || "en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatCurrency = (currency = "USD") => {
    return (
      localizeCurrency(0, currency, "en", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .replace(/[\d٠-٩.,\s]/g, "")
        .trim() || currency
    );
  };

  const getCabinClassLabel = (cabinClass) => {
    const cabinMap = {
      E: t("flights.cabin_class.economy"),
      B: t("flights.cabin_class.business"),
      F: t("flights.cabin_class.first"),
    };
    return cabinMap[cabinClass] || t("flights.cabin_class.economy");
  };

  const formatAirportWithTerminal = (code, terminal) => {
    const c = (code || "").toString().trim();
    const t = (terminal || "").toString().trim();
    if (!c && !t) return "";
    if (!t) return c;
    return `${c} • T${t}`;
  };

  const formatBooleanBadge = (value, trueText, falseText) => {
    const isTrue =
      value === true ||
      value === 1 ||
      value === "1" ||
      value === "True" ||
      value === "true";
    return {
      text: isTrue ? trueText : falseText,
      cls: isTrue
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-amber-50 text-amber-700 border-emerald-200",
    };
  };

  const formatTimeWithMeridiem = (timeStr) => {
    const raw = (timeStr || "").toString().trim();
    if (!raw) return "";

    // Handle ISO datetime like 2025-09-19T10:25:00
    const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/);
    if (isoMatch) {
      const dateObj = new Date(raw);
      if (!isNaN(dateObj.getTime())) {
        const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
        return new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          calendar: "gregory",
        }).format(dateObj);
      }
    }

    // If already contains AM/PM, normalize label localization
    const ampmMatch = raw.match(/\b(AM|PM|am|pm|Am|Pm)\b/);
    if (ampmMatch) {
      const isPM = ampmMatch[0].toLowerCase() === "pm";
      const label = isPM ? t("flight_results.pm") : t("flight_results.am");
      return raw.replace(/\b(AM|PM|am|pm|Am|Pm)\b/, label);
    }

    // Expect HH:mm → convert to 12-hour format with localized AM/PM
    const m = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return raw;
    let hours = parseInt(m[1], 10);
    const minutes = m[2];
    const isPM = hours >= 12;
    const label = isPM ? t("flight_results.pm") : t("flight_results.am");
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${label}`;
  };

  const isISODateTime = (value) =>
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value.trim());

  const formatDateFromISOString = (isoString) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
      return new Intl.DateTimeFormat(locale, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        calendar: "gregory",
      }).format(d);
    } catch (e) {
      return "";
    }
  };

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <>
      {results.map((flight) => {
        // Extract data from the nested trip structure
        const firstTrip =
          Array.isArray(flight.trip) && flight.trip.length > 0
            ? flight.trip[0]
            : {};

        // Use trip data first, fallback to flight data
        const airlineCode = firstTrip.airlineCode || flight.airlineCode || "";
        const airlineName = firstTrip.airlineName || flight.airline || "";
        const fromCode =
          firstTrip.cityCodeFrom || flight.cityCodeFrom || origin;
        const toCode = firstTrip.cityCodeTo || flight.cityCodeTo || destination;
        const departureTime =
          firstTrip.departureTime || flight.departureTime || flight.departure;
        const arrivalTime =
          firstTrip.arrivalTime || flight.arrivalTime || flight.arrival;
        const duration = firstTrip.duration || flight.duration;
        const stops = firstTrip.stops || flight.stops || 0;
        const seats = firstTrip.seats || flight.seats;
        const refundable = firstTrip.refundable || flight.refundable;
        const inclusions = firstTrip.inclusions || flight.inclusions || {};
        const fareType = firstTrip.fareType || flight.fareType;
        const fareClass = firstTrip.fareClass || flight.fareClass;
        const aircraft = firstTrip.aircraft || flight.aircraft;
        const flightNumber = firstTrip.flightNo || flight.flightNumber;
        const departureTerminal =
          firstTrip.departureTerminal || flight.departureTerminal;
        const arrivalTerminal =
          firstTrip.arrivalTerminal || flight.arrivalTerminal;
        const fromAirport = firstTrip.fromAirport || flight.fromAirport;
        const toAirport = firstTrip.toAirport || flight.toAirport;
        const fromCity = firstTrip.fromCity || flight.fromCity;
        const toCity = firstTrip.toCity || flight.toCity;

        // Use the main flight price and currency
        const price = flight.price || flight.grossFare || 0;
        const currency = flight.currency || "SAR";
        const cabinClassCode = flight.cabinClass || firstTrip.cabin || "E";

        const refundableBadge = formatBooleanBadge(
          refundable,
          t("flight_results.refundable"),
          t("flight_results.non_refundable")
        );

        const baggageText = inclusions.Baggage || inclusions.baggage || "—";
        const mealsText = inclusions.Meals || inclusions.meals;
        const pieceDescription =
          inclusions.PieceDescription || inclusions.pieceDescription;

        const isExpanded = selectedFlight?.id === flight.id;

        return (
          <div
            key={flight.id}
            className={`bg-white rounded-2xl  shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-300 ${
              false
                ? "ring-2 ring-blue-500 border-blue-200 shadow-xl transform scale-[1.01] sm:scale-[1.02]"
                : "hover:shadow-xl hover:border-gray-200 hover:transform hover:scale-[1.005] sm:hover:scale-[1.01]"
            } relative`}
            onClick={() => handleFlightSelect(flight)}
          >
            {/* Mobile full-card link overlay */}
            <Link
              href={`/flights/details/${
                flight.isRoundTrip ? "RT" : "ON"
              }/${encodeURIComponent(String(flight.booking_id ?? ""))}`}
              className="sm:hidden absolute inset-0 z-10"
              aria-label={t("flight_results.select")}
            >
              <span className="sr-only">{t("flight_results.select")}</span>
            </Link>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Flight Info */}
              <div className="flex-1  sm:mb-6 lg:mb-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-5 mb-3 sm:mb-4">
                  {/* Airline Logo */}

                  {/* Enhanced Flight Details */}
                  <div className="flex-1">
                    {/* Outbound Flight */}
                    <div className="flex items-center gap-2 flex-col sm:flex-row">
                      <div className="w-full sm:w-auto">
                        <Image
                          src={getAirlineLogo(airlineCode)}
                          alt={getLocalizedAirlineName(
                            airlineName,
                            i18n.language
                          )}
                          width={50}
                          height={50}
                          className="rounded-lg object-contain w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]"
                        />
                      </div>
                      <div className="flex-1 flex sm:flex-row justify-between w-full sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-6 pl-0 md:pl-10">
                        {/* Enhanced Departure */}

                        <FlightInfo
                          code={fromCode}
                          time={departureTime}
                          city={fromCity}
                        />
                        {/* Enhanced Flight Duration & Route */}
                        <div className="text-center flex-1 min-w-0">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-blue-300"></div>
                            <div className="bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                              <span className="text-xs sm:text-sm font-medium text-gray-700">
                                {duration}
                              </span>
                            </div>
                            <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-300 to-blue-300"></div>
                          </div>
                          <div className="flex items-center justify-center space-x-2 relative">
                            <span
                              className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                                stops === 0
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200"
                              }`}
                              onMouseEnter={(e) => {
                                if (
                                  stops > 0 &&
                                  firstTrip.connections &&
                                  firstTrip.connections.length > 0
                                ) {
                                  const rect = e.target.getBoundingClientRect();
                                  const position =
                                    rect.top > window.innerHeight / 2
                                      ? "top"
                                      : "bottom";
                                  setTooltipStates((prev) => ({
                                    ...prev,
                                    [flight.id]: {
                                      isVisible: true,
                                      connections: firstTrip.connections,
                                      position,
                                    },
                                  }));
                                }
                              }}
                              onMouseLeave={() => {
                                setTooltipStates((prev) => ({
                                  ...prev,
                                  [flight.id]: {
                                    isVisible: false,
                                    connections: [],
                                    position: "top",
                                  },
                                }));
                              }}
                            >
                              {stops === 0
                                ? t("flight_results.direct")
                                : t("flight_results.stops_count", {
                                    count: stops,
                                  })}
                            </span>

                            {/* Connection Tooltip */}
                            <ConnectionTooltip
                              connections={
                                tooltipStates[flight.id]?.connections || []
                              }
                              isVisible={
                                tooltipStates[flight.id]?.isVisible || false
                              }
                              position={
                                tooltipStates[flight.id]?.position || "top"
                              }
                            />
                          </div>
                        </div>
                        {/* Enhanced Arrival */}
                        <FlightInfo
                          code={toCode}
                          time={arrivalTime}
                          className={true}
                          city={toCity}
                        />
                      </div>
                    </div>

                    {/* Return Flight (Round Trip) */}
                    {flight.isRoundTrip && flight.returnFlight && (
                      <div className="mt-0 pt-4 border-t border-gray-100 pl-0 md:pl-10">
                        {/* Return Flight Airline Logo */}
                        <div className="flex flex-col md:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-5 mb-3 sm:mb-4">
                          <div className="flex justify-center sm:justify-start">
                            <div className="=">
                              <Image
                                src={getAirlineLogo(
                                  Array.isArray(flight.trip) &&
                                    flight.trip.length > 1
                                    ? flight.trip[1].airlineCode
                                    : airlineCode
                                )}
                                alt={getLocalizedAirlineName(
                                  Array.isArray(flight.trip) &&
                                    flight.trip.length > 1
                                    ? flight.trip[1].airlineName ||
                                        flight.returnFlight.airline
                                    : airlineName,
                                  i18n.language
                                )}
                                width={50}
                                height={50}
                                className="rounded-lg object-contain w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]"
                              />
                            </div>
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex justify-between w-full sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-6">
                              {/* Return Departure */}
                              <FlightInfo
                                code={toCode}
                                city={flight.returnFlight.fromCity}
                                time={flight.trip[1].departureTime}
                              />

                              {/* Return Flight Duration & Route */}
                              <div className="text-center flex-1 min-w-0">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                  <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-green-300"></div>
                                  <div className="bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                      {flight.returnFlight.duration}
                                    </span>
                                  </div>
                                  <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-300 to-green-300"></div>
                                </div>
                                <div className="flex items-center justify-center space-x-2 relative">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                                      flight.returnFlight.stops === 0
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200"
                                    }`}
                                    onMouseEnter={(e) => {
                                      const secondTrip =
                                        Array.isArray(flight.trip) &&
                                        flight.trip.length > 1
                                          ? flight.trip[1]
                                          : null;
                                      const connections =
                                        (secondTrip &&
                                          secondTrip.connections) ||
                                        (flight.returnFlight &&
                                          flight.returnFlight.connections) ||
                                        [];
                                      if (
                                        flight.returnFlight.stops > 0 &&
                                        connections.length > 0
                                      ) {
                                        const rect =
                                          e.target.getBoundingClientRect();
                                        const position =
                                          rect.top > window.innerHeight / 2
                                            ? "top"
                                            : "bottom";
                                        setTooltipStates((prev) => ({
                                          ...prev,
                                          [`${flight.id}-return`]: {
                                            isVisible: true,
                                            connections,
                                            position,
                                          },
                                        }));
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      setTooltipStates((prev) => ({
                                        ...prev,
                                        [`${flight.id}-return`]: {
                                          isVisible: false,
                                          connections: [],
                                          position: "top",
                                        },
                                      }));
                                    }}
                                  >
                                    {flight.returnFlight.stops === 0
                                      ? t("flight_results.direct")
                                      : t("flight_results.stops_count", {
                                          count: flight.returnFlight.stops,
                                        })}
                                  </span>

                                  {/* Connection Tooltip (Return) */}
                                  <ConnectionTooltip
                                    connections={
                                      tooltipStates[`${flight.id}-return`]
                                        ?.connections || []
                                    }
                                    isVisible={
                                      tooltipStates[`${flight.id}-return`]
                                        ?.isVisible || false
                                    }
                                    position={
                                      tooltipStates[`${flight.id}-return`]
                                        ?.position || "top"
                                    }
                                  />
                                </div>
                              </div>

                              {/* Return Arrival */}

                              <FlightInfo
                                code={fromCode}
                                time={flight.trip[1].arrivalTime}
                                city={flight.trip[1].toCity}
                                className={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden items-center gap-2 sm:gap-3 mt-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFlightForModal(flight);
                      setIsBaggageOpen(true);
                    }}
                    aria-label={t(
                      "flight_results.baggage_information",
                      "Baggage"
                    )}
                  >
                    <MdLuggage className="w-5 h-5 text-blue-700" />
                    <IoIosArrowDown className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFlightForModal(flight);
                      setIsSeatOpen(true);
                    }}
                    aria-label={t("flight_results.seat_selection", "Seats")}
                  >
                    <MdAirlineSeatReclineNormal className="w-4 h-4 text-indigo-600" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFlightForModal(flight);
                      setIsRefundOpen(true);
                    }}
                    aria-label={t(
                      "flight_results.booking_policies",
                      "Policies"
                    )}
                  >
                    <BsShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t("flight_results.refund", "Refund")}</span>
                  </button>

                  {/* Modals */}
                  <BaggageModal
                    isOpen={isBaggageOpen}
                    onClose={() => setIsBaggageOpen(false)}
                    value={baggageValue}
                    onChange={setBaggageValue}
                    baggageOptions={[]}
                  />
                </div>
              </div>

              {/* Price and Booking Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-6">
                {/* Flight Details */}

                {/* Price and Book Button */}
                <div className="flex flex-col sm:items-end gap-3 sm:border-r border-gray-200 sm:pr-4 px-4 sm:px-0">
                  <div className="flex items-center justify-between text-right pb-2 pt-2 sm:pb-0  sm:px-0 border-t sm:border-t-0 border-gray-200">
                    <p className="sm:hidden">{t("flight_results.price")}</p>{" "}
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-1">
                      {formatPrice(
                        flight.isRoundTrip
                          ? flight?.trip[0]?.price + flight?.trip?.[1]?.price
                          : flight.trip[0]?.price
                      )}{" "}
                      {currency === "SAR" ? (
                        <SARCurrencyIcon className="text-sm w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <span className="text-sm text-blue-600">
                          {formatCurrency(currency)}{" "}
                        </span>
                      )}
                    </p>
                    {/* <p className="text-sm text-gray-500">
                      {t("flight_results.per_person", "للشخص")}
                    </p> */}
                  </div>

                  <Link
                    href={`/flights/details/${
                      flight.isRoundTrip ? "RT" : "ON"
                    }/${encodeURIComponent(String(flight.booking_id ?? ""))}`}
                    className="hidden sm:block w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    {t("flight_results.select")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

const FlightInfo = ({ code, time, className = "", city }) => {
  const { i18n, t } = useTranslation();

  // Try IATA-based localization first, fallback to city name localization
  const airportLoc = getLocalizedAirport(code, i18n?.language);
  const localizedCity =
    airportLoc?.city || getLocalizedCityName(city, i18n?.language);
  const formatTimeWithMeridiem = (timeStr) => {
    const raw = (timeStr || "").toString().trim();
    if (!raw) return "";

    // Handle ISO datetime like 2025-09-19T10:25:00
    const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/);
    if (isoMatch) {
      const dateObj = new Date(raw);
      if (!isNaN(dateObj.getTime())) {
        const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
        return new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          calendar: "gregory",
        }).format(dateObj);
      }
    }

    // If already contains AM/PM, normalize label localization
    const ampmMatch = raw.match(/\b(AM|PM|am|pm|Am|Pm)\b/);
    if (ampmMatch) {
      const isPM = ampmMatch[0].toLowerCase() === "pm";
      const label = isPM ? t("flight_results.pm") : t("flight_results.am");
      return raw.replace(/\b(AM|PM|am|pm|Am|Pm)\b/, label);
    }

    // Expect HH:mm → convert to 12-hour format with localized AM/PM
    const m = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return raw;
    let hours = parseInt(m[1], 10);
    const minutes = m[2];
    const isPM = hours >= 12;
    const label = isPM ? t("flight_results.pm") : t("flight_results.am");
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${label}`;
  };

  const isISODateTime = (value) =>
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value.trim());

  const formatDateFromISOString = (isoString) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
      return new Intl.DateTimeFormat(locale, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        calendar: "gregory",
      }).format(d);
    } catch (e) {
      return "";
    }
  };
  return (
    <div
      className={`${
        className ? "sm:items-end" : " sm:items-start"
      } text-center sm:text-start flex flex-col items-center gap-1 flex-1`}
    >
      <div className="flex items-center gap-1">
        <p>{localizedCity}</p>
        <span className="text-xs sm:text-xs text-blue-600 font-semibold uppercase tracking-wide">
          ({code})
        </span>

        {/* <LuPlaneTakeoff className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> */}
      </div>
      <p className="text-base sm:text-xl lg:text-xl xl:text-3xl font-bold text-gray-900 mb-1">
        {formatTimeWithMeridiem(time)}
      </p>

      <p className="text-[10px] sm:text-xs text-gray-400 -mt-1">
        {formatDateFromISOString(time)}
      </p>

      {/* {fromCity && (
          <div className="items-center gap-1 hidden sm:flex">
            <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[180px] mt-1">
              {fromCity}
            </p>
          </div>
        )} */}
    </div>
  );
};
