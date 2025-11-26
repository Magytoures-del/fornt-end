import React from "react";
import { LuSearch, LuMapPin, LuCalendar, LuUsers } from "react-icons/lu";
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
} from "../styles/SearchOverlay.styles";
import { formatDateForDisplay } from "../utils/hotelSearchUtils";

const SearchOverlay = ({
  isSearching,
  searchProgress,
  destination,
  selectedLocation,
  checkIn,
  checkOut,
  guests,
  t,
}) => {
  return (
    <OverlayBackdrop role="dialog" aria-label="Searching hotels" aria-modal="true">
      <OverlayCard>
        <OverlayIcon>
          <LuSearch />
        </OverlayIcon>
        <Dots>
          <span />
          <span />
          <span />
        </Dots>
        <OverlayTitle>{t("hotels.search_form.searching_title")}</OverlayTitle>
        <OverlaySubtitle>
          {t("hotels.search_form.searching_subtitle")}
        </OverlaySubtitle>
        <OverlayNote>{t("hotels.search_form.searching_note")}</OverlayNote>
        <OverlayRow>
          <OverlayLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LuMapPin /> {t("hotels.results.search_bar.destination")}
            </span>
          </OverlayLabel>
          <OverlayValue>
            {destination ||
              (selectedLocation &&
                (selectedLocation.fullName || selectedLocation.name)) ||
              "—"}
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
              <LuCalendar /> {t("hotels.results.search_bar.check_in")}
            </span>
          </OverlayLabel>
          <OverlayValue>{formatDateForDisplay(checkIn) || "—"}</OverlayValue>
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
              <LuCalendar /> {t("hotels.results.search_bar.check_out")}
            </span>
          </OverlayLabel>
          <OverlayValue>{formatDateForDisplay(checkOut) || "—"}</OverlayValue>
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
              <LuUsers /> {t("hotels.results.search_bar.rooms_guests")}
            </span>
          </OverlayLabel>
          <OverlayValue>
            {guests && typeof guests === 'object' ? (
              <>
                {(guests.adults || 0) + (guests.children || 0)} {t("hotels.guests.guests")}
                {", "}
                {guests.rooms || 1}{" "}
                {(guests.rooms || 1) === 1
                  ? t("hotels.guests.room")
                  : t("hotels.guests.rooms")}
              </>
            ) : (
              "—"
            )}
          </OverlayValue>
        </OverlayRow>
        <ProgressTrack>
          <ProgressBar $value={Math.round(searchProgress)} />
        </ProgressTrack>
      </OverlayCard>
    </OverlayBackdrop>
  );
};

export default SearchOverlay;

