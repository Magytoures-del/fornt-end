import React from "react";
import styled from "styled-components";
import { GoDotFill } from "react-icons/go";
import {
  FaPlane,
  FaSuitcase,
  FaWifi,
  FaPlaneDeparture,
  FaHamburger,
  FaChair,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  getLocalizedAirport,
  preloadAirportLocalization,
} from "../../../utils/airportLocalization";
import { getLocalizedCityName } from "../../../utils/cityLocalization";
import { getLocalizedAirlineName } from "../../../utils/airlineLocalization";

// ===================== Styled Components =====================

const Card = styled.div`
  position: relative;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const MainContent = styled.div`
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 1024px) {
    padding: 20px 24px;
    gap: 24px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0px 30px;
  padding-top: 20px;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const AirlineInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AirlineLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  flex-shrink: 0;
  border: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const AirlineDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AirlineName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const FlightMeta = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Tag = styled.span`
  padding: 6px 14px;
  font-size: 12px;
  border-radius: 20px;
  background: #cbd5e1;
  color: #475569;
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 5px 12px;
    font-size: 11px;
  }
`;

const FlightDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 5px;
    width: 100%;
  }
`;

const TimeLocationBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TimeGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: column;
  @media (max-width: 768px) {
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
`;

const Time = styled.div`
  font-size: 25px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const DateText = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const LocationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const City = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Airport = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const FlightPath = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
  }
`;

const PathLine = styled.div`
  background: #cbd5e1;
  height: 32px;
  width: 2px;

  @media (max-width: 768px) {
    height: 2px;
    width: 40px;
    flex: 1;
  }
`;

const PlaneIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const PlaneIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #475569;
  border-radius: 50%;
  color: white;
  flex-shrink: 0;

  svg {
    font-size: 20px;
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      font-size: 16px;
      transform: rotate(180deg);
    }
  }
`;

const FlightDuration = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: absolute;
  left: calc(100% + 12px);
  white-space: nowrap;

  @media (max-width: 768px) {
    position: static;
    text-align: center;
  }
`;

const DurationText = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TransitText = styled.div`
  font-size: 12px;
  color: #ef4444;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const Dot = styled.div`
  color: #1e293b;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ActionButtons = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 52px;
  padding: 10px 8px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eef2f7;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
  display: flex;
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
    width: auto;

    display: none;
    border-top: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 12px;
    box-shadow: none;
    padding: 12px 0;
  }
`;

const ActionButton = styled.button`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2f4739;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: translateY(-1px) scale(1.05);
    color: #1e3a2a;
  }

  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;

    svg {
      font-size: 18px;
    }
  }
`;

const ActionRailSegment = styled.div`
  width: 2px;
  height: 16px;
  background: #d7e3f4;
  border-radius: 2px;

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===================== Skeleton Component =====================

const SkeletonCard = styled(Card)`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonFlightCard = () => (
  <SkeletonCard>
    <MainContent>
      <LeftSection>
        <Header>
          <AirlineInfo>
            <div
              className="skeleton"
              style={{ width: "48px", height: "48px", borderRadius: "8px" }}
            />
            <div>
              <div
                className="skeleton"
                style={{ width: "120px", height: "16px", marginBottom: "6px" }}
              />
              <div
                className="skeleton"
                style={{ width: "180px", height: "13px" }}
              />
            </div>
          </AirlineInfo>
          <TagsContainer>
            <div
              className="skeleton"
              style={{ width: "100px", height: "28px", borderRadius: "20px" }}
            />
            <div
              className="skeleton"
              style={{ width: "90px", height: "28px", borderRadius: "20px" }}
            />
          </TagsContainer>
        </Header>

        <FlightDetailsContainer>
          <TimeLocationBlock>
            <div
              className="skeleton"
              style={{ width: "120px", height: "28px", marginBottom: "8px" }}
            />
            <div
              className="skeleton"
              style={{ width: "140px", height: "18px", marginBottom: "4px" }}
            />
            <div
              className="skeleton"
              style={{ width: "200px", height: "13px" }}
            />
          </TimeLocationBlock>

          <FlightPath>
            <div
              className="skeleton"
              style={{ width: "16px", height: "16px", borderRadius: "50%" }}
            />
            <div
              className="skeleton"
              style={{ width: "2px", height: "32px" }}
            />
            <div
              className="skeleton"
              style={{ width: "48px", height: "48px", borderRadius: "50%" }}
            />
            <div
              className="skeleton"
              style={{ width: "2px", height: "32px" }}
            />
            <div
              className="skeleton"
              style={{ width: "16px", height: "16px", borderRadius: "50%" }}
            />
          </FlightPath>

          <TimeLocationBlock>
            <div
              className="skeleton"
              style={{ width: "120px", height: "28px", marginBottom: "8px" }}
            />
            <div
              className="skeleton"
              style={{ width: "140px", height: "18px", marginBottom: "4px" }}
            />
            <div
              className="skeleton"
              style={{ width: "200px", height: "13px" }}
            />
          </TimeLocationBlock>
        </FlightDetailsContainer>
      </LeftSection>

      <ActionButtons>
        <div
          className="skeleton"
          style={{ width: "40px", height: "40px", borderRadius: "8px" }}
        />
        <div
          className="skeleton"
          style={{ width: "40px", height: "40px", borderRadius: "8px" }}
        />
        <div
          className="skeleton"
          style={{ width: "40px", height: "40px", borderRadius: "8px" }}
        />
        <div
          className="skeleton"
          style={{ width: "40px", height: "40px", borderRadius: "8px" }}
        />
      </ActionButtons>
    </MainContent>
  </SkeletonCard>
);

// ===================== Helper Functions =====================

const formatTime = (isoString, language) => {
  const locale = language === "ar" ? "ar-SA" : "en-US";
  return new Date(isoString).toLocaleTimeString(
    locale,
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      calendar: "gregory",
    }
  );
};

const formatDate = (isoString, language) => {
  const locale = language === "ar" ? "ar-SA" : "en-US";
  return new Date(isoString).toLocaleDateString(
    locale,
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      calendar: "gregory",
    }
  );
};

// ===================== Main Component =====================

export default function FlightCard({ results, loading }) {
  const { i18n, t } = useTranslation();

  // Preload full airport localization dataset for current language
  React.useEffect(() => {
    preloadAirportLocalization(i18n.language);
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonFlightCard />
      </div>
    );
  }

  if (!results?.tripDetails || results.tripDetails.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {results.tripDetails.map((trip, index) => {
        const fromParts = (trip.from.name || "|").split("|");
        const toParts = (trip.to.name || "|").split("|");
        const fromCode = fromParts[0]?.trim() || "";
        const fromRawName = fromParts[1]?.trim() || "";
        const toCode = toParts[0]?.trim() || "";
        const toRawName = toParts[1]?.trim() || "";

        const fromLoc = getLocalizedAirport(fromCode, i18n.language);
        const toLoc = getLocalizedAirport(toCode, i18n.language);

        const fromCity =
          fromLoc?.city ||
          getLocalizedCityName(fromRawName, i18n.language) ||
          fromRawName;
        const toCity =
          toLoc?.city ||
          getLocalizedCityName(toRawName, i18n.language) ||
          toRawName;
        const fromAirport = fromLoc?.airport
          ? `${fromLoc.airport} (${fromCode})`
          : fromCode;
        const toAirport = toLoc?.airport
          ? `${toLoc.airport} (${toCode})`
          : toCode;

        const cabinClass =
          trip.flight.cabin === "E"
            ? t("flights.cabin_class.economy")
            : trip.flight.cabin === "B"
            ? t("flights.cabin_class.business")
            : trip.flight.cabin === "F"
            ? t("flights.cabin_class.first")
            : trip.flight.cabin;

        return (
          <Card key={index}>
            {/* Header with Airline Info and Tags */}
            <Header>
              <AirlineInfo>
                <AirlineLogo>
                  <Image
                    src={`https://sacontent.akbartravels.com/AirlineLogo/assets/images/v2/AirlineLogo/${trip.flight.MAC}.png`}
                    alt={trip.flight.airline}
                    width={48}
                    height={48}
                    style={{ objectFit: "contain" }}
                  />
                </AirlineLogo>
                <AirlineDetails>
                  <AirlineName>
                    {getLocalizedAirlineName(
                      trip.flight.airline,
                      i18n.language
                    )}
                  </AirlineName>
                  <FlightMeta>
                    {trip.flight.flightNumber} | {trip.flight.duration}
                  </FlightMeta>
                </AirlineDetails>
              </AirlineInfo>

              <TagsContainer>
                <Tag>{cabinClass}</Tag>
                <Tag>{t("flight_results.direct")}</Tag>
              </TagsContainer>
            </Header>
            <MainContent>
              <LeftSection>
                {/* Flight Details with Path */}
                <FlightDetailsContainer>
                  {/* Departure Info */}
                  <TimeLocationBlock>
                    <LocationGroup>
                      <City>{fromCity}</City>
                      <Airport>{fromAirport}</Airport>
                    </LocationGroup>
                    <LocationGroup>
                      <City>{toCity}</City>
                      <Airport>{toAirport}</Airport>
                    </LocationGroup>
                  </TimeLocationBlock>

                  {/* Flight Path */}
                  <FlightPath>
                    <Dot>
                      <GoDotFill />
                    </Dot>
                    <PathLine />
                    <PlaneIconWrapper>
                      <PlaneIcon>
                        <FaPlane />
                      </PlaneIcon>
                    </PlaneIconWrapper>
                    <PathLine />
                    <Dot>
                      <GoDotFill />
                    </Dot>
                  </FlightPath>

                  {/* Arrival Info */}
                  <TimeLocationBlock>
                    <TimeGroup>
                      <Time>{formatTime(trip.from.time, i18n.language)}</Time>
                      <DateText>
                        {formatDate(trip.from.time, i18n.language)}
                      </DateText>
                    </TimeGroup>
                    <TimeGroup>
                      <Time>{formatTime(trip.to.time, i18n.language)}</Time>
                      <DateText>
                        {formatDate(trip.to.time, i18n.language)}
                      </DateText>
                    </TimeGroup>
                  </TimeLocationBlock>
                </FlightDetailsContainer>
              </LeftSection>

              {/* Action Buttons */}
              <ActionButtons>
                <ActionButton title="Baggage Info">
                  <FaSuitcase />
                </ActionButton>
                <ActionRailSegment />
                <ActionButton title="Meal Options">
                  <FaHamburger />
                </ActionButton>
                <ActionRailSegment />
                <ActionButton title="Seat Info">
                  <FaChair />
                </ActionButton>
                <ActionRailSegment />
                <ActionButton title="Flight Details">
                  <FaPlaneDeparture />
                </ActionButton>
                <ActionRailSegment />
                <ActionButton title="WiFi">
                  <FaWifi />
                </ActionButton>
              </ActionButtons>
            </MainContent>
          </Card>
        );
      })}
    </div>
  );
}
