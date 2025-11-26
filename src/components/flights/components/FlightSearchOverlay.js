import React from "react";
import {
  LuSearch,
  LuPlaneTakeoff,
  LuPlaneLanding,
  LuCalendar,
  LuUsers,
} from "react-icons/lu";
import {
  OverlayBackdrop,
  OverlayCard,
  OverlayIcon,
  Dots,
  OverlayTitle,
  OverlaySubtitle,
  OverlayNote,
  OverlayRow,
  OverlayLabel,
  OverlayValue,
  ProgressTrack,
  ProgressBar,
} from "../../hotels/styles/SearchOverlay.styles";

const FlightSearchOverlay = ({
  isSearching,
  searchProgress,
  origin,
  destination,
  originLabel,
  destinationLabel,
  departureDate,
  returnDate,
  adults,
  childrenCount,
  infants,
  cabinClass,
  isRoundTrip,
  t,
  i18n,
}) => {
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
      return date.toLocaleDateString(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        calendar: "gregory",
      });
    } catch (e) {
      return dateString;
    }
  };
  const getCabinClassLabel = (cabinClass) => {
    const cabinMap = {
      E: t("flights.cabin_class.economy", "Economy"),
      B: t("flights.cabin_class.business", "Business"),
      F: t("flights.cabin_class.first", "First"),
    };
    return cabinMap[cabinClass] || t("flights.cabin_class.economy", "Economy");
  };

  const totalPassengers =
    parseInt(adults || 0) +
    parseInt(childrenCount || 0) +
    parseInt(infants || 0);

  return (
    <OverlayBackdrop
      role="dialog"
      aria-label="Searching flights"
      aria-modal="true"
    >
      <OverlayCard>
        <OverlayIcon>
          <LuSearch />
        </OverlayIcon>
        <Dots>
          <span />
          <span />
          <span />
        </Dots>
        <OverlayTitle>
          {t("flights.search_form.searching_title", "Searching Flights")}
        </OverlayTitle>
        <OverlaySubtitle>
          {t(
            "flights.search_form.searching_subtitle",
            "We're finding the best flight options for you"
          )}
        </OverlaySubtitle>
        <OverlayNote>
          {t(
            "flights.search_form.searching_note",
            "This may take a few moments..."
          )}
        </OverlayNote>
        <OverlayRow>
          <OverlayLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LuPlaneTakeoff /> {t("flights.search_form.origin", "From")}
            </span>
          </OverlayLabel>
          <OverlayValue>{originLabel || origin || "—"}</OverlayValue>
        </OverlayRow>
        <OverlayRow>
          <OverlayLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LuPlaneLanding /> {t("flights.search_form.destination", "To")}
            </span>
          </OverlayLabel>
          <OverlayValue>{destinationLabel || destination || "—"}</OverlayValue>
        </OverlayRow>
        <OverlayRow>
          <OverlayLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LuCalendar />{" "}
              {t("flights.search_form.departure_date", "Departure")}
            </span>
          </OverlayLabel>
          <OverlayValue>
            {formatDateForDisplay(departureDate) || "—"}
          </OverlayValue>
        </OverlayRow>
        {isRoundTrip && returnDate && (
          <OverlayRow>
            <OverlayLabel>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <LuCalendar /> {t("flights.search_form.return_date", "Return")}
              </span>
            </OverlayLabel>
            <OverlayValue>
              {formatDateForDisplay(returnDate) || "—"}
            </OverlayValue>
          </OverlayRow>
        )}
        <OverlayRow>
          <OverlayLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LuUsers /> {t("flights.search_form.passengers", "Passengers")}
            </span>
          </OverlayLabel>
          <OverlayValue>
            {totalPassengers > 0 ? (
              <>
                {totalPassengers}{" "}
                {t("flights.passengers.passengers", "Passengers")}
                {parseInt(adults) > 0 && (
                  <>
                    {" "}
                    • {adults}{" "}
                    {parseInt(adults) === 1
                      ? t("flights.passengers.adult", "Adult")
                      : t("flights.passengers.adults", "Adults")}
                  </>
                )}
                {parseInt(childrenCount) > 0 && (
                  <>
                    , {childrenCount}{" "}
                    {parseInt(childrenCount) === 1
                      ? t("flights.passengers.child", "Child")
                      : t("flights.passengers.children", "Children")}
                  </>
                )}
                {parseInt(infants) > 0 && (
                  <>
                    , {infants}{" "}
                    {parseInt(infants) === 1
                      ? t("flights.passengers.infant", "Infant")
                      : t("flights.passengers.infants", "Infants")}
                  </>
                )}
              </>
            ) : (
              "—"
            )}
          </OverlayValue>
        </OverlayRow>
        <OverlayRow>
          <OverlayLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LuUsers /> {t("flights.search_form.cabin_class", "Cabin Class")}
            </span>
          </OverlayLabel>
          <OverlayValue>{getCabinClassLabel(cabinClass)}</OverlayValue>
        </OverlayRow>
        <ProgressTrack>
          <ProgressBar $value={Math.round(searchProgress)} />
        </ProgressTrack>
      </OverlayCard>
    </OverlayBackdrop>
  );
};

export default FlightSearchOverlay;
