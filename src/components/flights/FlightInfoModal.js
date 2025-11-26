import React from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { FaPlane, FaWifi, FaUtensils, FaTv, FaCoffee } from "react-icons/fa";
import {
  BsClock,
  BsShieldCheck,
  BsTicketPerforated,
  BsCalendar3,
} from "react-icons/bs";
import { MdLuggage, MdFlightTakeoff, MdFlight } from "react-icons/md";
import { TbShoppingBag, TbPlaneInflight } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  getLocalizedAirport,
  preloadAirportLocalization,
} from "@/utils/airportLocalization";
import { getLocalizedAirlineName } from "@/utils/airlineLocalization";
import { localizeCurrency } from "@/utils/numberLocalization";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f4;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FlightHeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 24px;
`;

const AirlineInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: white;
    padding: 4px;
  }
`;

const AirlineDetails = styled.div`
  .airline-name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .flight-code {
    font-size: 14px;
    opacity: 0.9;
  }
`;

const FlightRoute = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 24px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const RoutePoint = styled.div`
  text-align: center;
  flex: 1;

  .time {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
  }

  .date {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .city {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }

  .airport {
    font-size: 14px;
    color: #666;
  }
`;

const RouteLine = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 2;
  justify-content: center;

  .line {
    height: 2px;
    background: #4f46e5;
    flex: 1;
  }

  .plane-icon {
    color: #4f46e5;
    font-size: 24px;
    transform: rotate(90deg);
  }
`;

const DurationInfo = styled.div`
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  .duration {
    font-size: 16px;
    font-weight: 600;
    color: #4f46e5;
  }

  .label {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin: 24px 0;
`;

const DetailCard = styled.div`
  padding: 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  svg {
    color: #4f46e5;
    font-size: 20px;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
`;

const DetailContent = styled.div`
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f3f4;

    &:last-child {
      border-bottom: none;
    }

    .label {
      font-size: 14px;
      color: #666;
    }

    .value {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #e3f2fd;
  border-radius: 20px;
  font-size: 12px;
  color: #1976d2;
  font-weight: 500;

  svg {
    font-size: 16px;
  }
`;

const BaggageSection = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const BaggageItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f8ff;
  border-radius: 12px;
  border: 1px solid #e3f2fd;

  svg {
    color: #4f46e5;
    font-size: 20px;
  }

  .baggage-info {
    .weight {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .type {
      font-size: 12px;
      color: #666;
    }
  }
`;

const PriceSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-top: 24px;

  .price {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .per-person {
    font-size: 14px;
    opacity: 0.9;
  }
`;

export default function FlightInfoModal({ isOpen, onClose, flightData }) {
  const { i18n, t } = useTranslation();

  React.useEffect(() => {
    preloadAirportLocalization(i18n.language);
  }, [i18n.language]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  React.useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !flightData) return null;

  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString(
      i18n.language === "ar" ? "ar-SA" : "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        calendar: "gregory",
      }
    );

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString(
      i18n.language === "ar" ? "ar-SA" : "en-US",
      {
        weekday: "long",
        calendar: "gregory",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  const formatPrice = (price, currency = "SAR") => {
    return localizeCurrency(price, currency, i18n?.language || "en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getAmenities = (flight) => {
    const amenities = [];
    if (flight?.wifi) amenities.push({ icon: FaWifi, label: "WiFi" });
    if (flight?.meals) amenities.push({ icon: FaUtensils, label: "Meals" });
    if (flight?.entertainment)
      amenities.push({ icon: FaTv, label: "Entertainment" });
    if (flight?.refreshments)
      amenities.push({ icon: FaCoffee, label: "Refreshments" });
    return amenities;
  };

  // Map FlightResults data structure to what the modal expects
  const flight = flightData?.flight || flightData;

  // Extract flight information with fallbacks
  const flightInfo = {
    MAC: flight?.airlineCode || flight?.MAC || "",
    airline: flight?.airline || flight?.airlineName || "",
    flightNumber: flight?.flightNumber || flight?.flightNo || "",
    aircraft: flight?.aircraft || "",
    cabin: flight?.cabin || flight?.fareClass || "E",
    duration: flight?.duration || "",
    baggage: flight?.baggage || "23kg",
    cabinBag: flight?.cabinBag || "7kg",
    refundable: flight?.refundable || false,
    changeable: flight?.changeable || false,
  };

  // Extract route information with fallbacks
  const routeInfo = {
    from: {
      time:
        flight?.departureTime || flight?.departure || new Date().toISOString(),
      name: `${flight?.fromCode || flight?.cityCodeFrom || ""}|${
        flight?.fromCity || flight?.fromAirport || ""
      }`,
    },
    to: {
      time: flight?.arrivalTime || flight?.arrival || new Date().toISOString(),
      name: `${flight?.toCode || flight?.cityCodeTo || ""}|${
        flight?.toCity || flight?.toAirport || ""
      }`,
    },
    departureTerminal: flight?.departureTerminal || "",
    arrivalTerminal: flight?.arrivalTerminal || "",
  };

  const amenities = getAmenities(flight);
  const price = flightData?.price || flight?.price || 0;
  const currency = flightData?.currency || flight?.currency || "SAR";

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t("flight_results.flight_details")}</ModalTitle>
          <CloseButton onClick={onClose}>
            <IoMdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Flight Header */}
          <FlightHeaderSection>
            <AirlineInfo>
              <Image
                src={`https://sacontent.akbartravels.com/AirlineLogo/assets/images/v2/AirlineLogo/${flightInfo.MAC}.png`}
                alt={getLocalizedAirlineName(flightInfo.airline, i18n.language)}
                width={48}
                height={48}
              />
              <AirlineDetails>
                <div className="airline-name">
                  {getLocalizedAirlineName(flightInfo.airline, i18n.language)}
                </div>
                <div className="flight-code">
                  {flightInfo.flightNumber} • {flightInfo.aircraft}
                </div>
              </AirlineDetails>
            </AirlineInfo>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                {flightInfo.cabin === "E"
                  ? t("flights.cabin_class.economy")
                  : flightInfo.cabin}
              </div>
            </div>
          </FlightHeaderSection>

          {/* Flight Route */}
          <FlightRoute>
            <RoutePoint>
              <div className="time">{formatTime(routeInfo.from.time)}</div>
              <div className="date">{formatDate(routeInfo.from.time)}</div>
              {(() => {
                const [codeRaw, cityRaw] = (routeInfo.from.name || "|")
                  .split("|")
                  .map((s) => (s || "").trim());
                const loc = getLocalizedAirport(codeRaw, i18n.language);
                const city = loc?.city || cityRaw;
                const airportName = loc?.airport || codeRaw;
                return (
                  <>
                    <div className="city">{city}</div>
                    <div className="airport">{airportName}</div>
                  </>
                );
              })()}
            </RoutePoint>

            <RouteLine>
              <div className="line"></div>
              <FaPlane className="plane-icon" />
              <div className="line"></div>
            </RouteLine>

            <RoutePoint>
              <div className="time">{formatTime(routeInfo.to.time)}</div>
              <div className="date">{formatDate(routeInfo.to.time)}</div>
              {(() => {
                const [codeRaw, cityRaw] = (routeInfo.to.name || "|")
                  .split("|")
                  .map((s) => (s || "").trim());
                const loc = getLocalizedAirport(codeRaw, i18n.language);
                const city = loc?.city || cityRaw;
                const airportName = loc?.airport || codeRaw;
                return (
                  <>
                    <div className="city">{city}</div>
                    <div className="airport">{airportName}</div>
                  </>
                );
              })()}
            </RoutePoint>
          </FlightRoute>

          {/* Duration */}
          <DurationInfo>
            <div className="duration">{flightInfo.duration}</div>
            <div className="label">{t("flight_results.duration")}</div>
          </DurationInfo>

          {/* Details Grid */}
          <DetailsGrid>
            {/* Flight Information */}
            <DetailCard>
              <DetailHeader>
                <TbPlaneInflight />
                <h3>{t("flight_results.flight_information")}</h3>
              </DetailHeader>
              <DetailContent>
                <div className="detail-item">
                  <span className="label">
                    {t("flight_results.flight_number")}
                  </span>
                  <span className="value">{flightInfo.flightNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">{t("flight_results.aircraft")}</span>
                  <span className="value">{flightInfo.aircraft}</span>
                </div>
                <div className="detail-item">
                  <span className="label">{t("flight_results.duration")}</span>
                  <span className="value">{flightInfo.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="label">
                    {t("flight_results.cabin_class")}
                  </span>
                  <span className="value">
                    {flightInfo.cabin === "E"
                      ? t("flights.cabin_class.economy")
                      : flightInfo.cabin}
                  </span>
                </div>
              </DetailContent>
            </DetailCard>

            {/* Terminal Information */}
            {(routeInfo.departureTerminal || routeInfo.arrivalTerminal) && (
              <DetailCard>
                <DetailHeader>
                  <MdFlightTakeoff />
                  <h3>{t("flight_results.terminal_information")}</h3>
                </DetailHeader>
                <DetailContent>
                  {routeInfo.departureTerminal && (
                    <div className="detail-item">
                      <span className="label">
                        {t("flight_results.departure_terminal")}
                      </span>
                      <span className="value">
                        {routeInfo.departureTerminal}
                      </span>
                    </div>
                  )}
                  {routeInfo.arrivalTerminal && (
                    <div className="detail-item">
                      <span className="label">
                        {t("flight_results.arrival_terminal")}
                      </span>
                      <span className="value">{routeInfo.arrivalTerminal}</span>
                    </div>
                  )}
                </DetailContent>
              </DetailCard>
            )}

            {/* Baggage Information */}
            <DetailCard>
              <DetailHeader>
                <MdLuggage />
                <h3>{t("flight_results.baggage_information")}</h3>
              </DetailHeader>
              <DetailContent>
                <BaggageSection>
                  <BaggageItem>
                    <MdLuggage />
                    <div className="baggage-info">
                      <div className="weight">
                        {flightInfo.baggage || "23kg"}
                      </div>
                      <div className="type">
                        {t("flight_results.checked_baggage")}
                      </div>
                    </div>
                  </BaggageItem>
                  <BaggageItem>
                    <TbShoppingBag />
                    <div className="baggage-info">
                      <div className="weight">
                        {flightInfo.cabinBag || "1x7kg"}
                      </div>
                      <div className="type">
                        {t("flight_results.cabin_baggage")}
                      </div>
                    </div>
                  </BaggageItem>
                </BaggageSection>
              </DetailContent>
            </DetailCard>

            {/* Booking Policies */}
            <DetailCard>
              <DetailHeader>
                <BsShieldCheck />
                <h3>{t("flight_results.booking_policies")}</h3>
              </DetailHeader>
              <DetailContent>
                <div className="detail-item">
                  <span className="label">
                    {t("flight_results.refundable")}
                  </span>
                  <span className="value">
                    {flightInfo.refundable
                      ? t("flight_results.yes")
                      : t("flight_results.no")}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">
                    {t("flight_results.changeable")}
                  </span>
                  <span className="value">
                    {flightInfo.changeable
                      ? t("flight_results.yes")
                      : t("flight_results.no")}
                  </span>
                </div>
              </DetailContent>
            </DetailCard>

            {/* Amenities */}
            {amenities.length > 0 && (
              <DetailCard>
                <DetailHeader>
                  <FaWifi />
                  <h3>{t("flight_results.amenities")}</h3>
                </DetailHeader>
                <DetailContent>
                  <AmenitiesGrid>
                    {amenities.map((amenity, idx) => (
                      <AmenityItem key={idx}>
                        <amenity.icon />
                        <span>{amenity.label}</span>
                      </AmenityItem>
                    ))}
                  </AmenitiesGrid>
                </DetailContent>
              </DetailCard>
            )}
          </DetailsGrid>

          {/* Price Section */}
          <PriceSection>
            <div className="price">{formatPrice(price, currency)}</div>
            <div className="per-person">{t("flight_results.per_person")}</div>
          </PriceSection>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}
