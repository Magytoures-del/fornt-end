import React from "react";
import { createPortal } from "react-dom";
import { LuUsers, LuX, LuPlus, LuTrash2, LuBedDouble } from "react-icons/lu";
import {
  SelectorWrapper,
  SelectorInner,
  SelectorText,
  SelectorLabel,
  SelectorValue,
  SelectorDropdown,
  SelectorItem,
  SelectorItemInfo,
  SelectorItemTitle,
  SelectorItemDesc,
  SelectorControls,
  SelectorButton,
  SelectorCount,
  ChildAgesContainer,
  ChildAgeLabel,
  ChildAgeGrid,
  ChildAgeWrapper,
  ChildAgeNumber,
  ChildAgeSelect,
  GuestsOverlay,
  MobileGuestsHeader,
  MobileGuestsTitle,
  MobileCloseButton,
  RoomSection,
  RoomHeader,
  RoomTitle,
  RemoveRoomButton,
  AddRoomButton,
  RoomsSummary,
} from "../styles/GuestsSelector.styles";
import { CHILD_AGE_RANGE, MAX_ROOMS } from "../constants/hotelSearch";

const GuestsSelector = ({
  guestsRef,
  rooms,
  guests,
  totalGuests,
  showGuestsDropdown,
  setShowGuestsDropdown,
  addRoom,
  removeRoom,
  updateRoomGuests,
  updateRoomChildAge,
  guestsDropdownJustOpenedRef,
  isMobile,
  isMounted,
  t,
}) => {
  // Handle button clicks to prevent dropdown from closing
  const handleButtonClick = (e, roomIndex, type, operation) => {
    e.preventDefault();
    e.stopPropagation();
    updateRoomGuests(roomIndex, type, operation);
  };

  // Handle overlay click (only close if clicking the overlay itself)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !guestsDropdownJustOpenedRef.current) {
      setShowGuestsDropdown(false);
    }
  };

  // Handle add room button
  const handleAddRoom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addRoom();
  };

  // Handle remove room button
  const handleRemoveRoom = (e, roomIndex) => {
    e.preventDefault();
    e.stopPropagation();
    removeRoom(roomIndex);
  };

  const renderRoomControls = () => (
    <>
      {rooms.length > 1 && (
        <RoomsSummary>
          {rooms.length} {t("hotels.guests.rooms")} • {totalGuests}{" "}
          {t("hotels.guests.guests")}
        </RoomsSummary>
      )}

      {rooms.map((room, roomIndex) => (
        <RoomSection key={roomIndex}>
          <RoomHeader>
            <RoomTitle>
              <LuBedDouble />
              {t("hotels.guests.room")} {roomIndex + 1}
            </RoomTitle>
            {rooms.length > 1 && (
              <RemoveRoomButton
                onClick={(e) => handleRemoveRoom(e, roomIndex)}
                title={t("hotels.guests.remove_room") || "Remove room"}
              >
                <LuTrash2 />
                {t("hotels.guests.remove") || "Remove"}
              </RemoveRoomButton>
            )}
          </RoomHeader>

          <SelectorItem>
            <SelectorItemInfo>
              <SelectorItemTitle>{t("hotels.guests.adults")}</SelectorItemTitle>
              <SelectorItemDesc>
                {t("hotels.guests.adults_desc")}
              </SelectorItemDesc>
            </SelectorItemInfo>
            <SelectorControls>
              <SelectorButton
                onClick={(e) =>
                  handleButtonClick(e, roomIndex, "adults", "decrement")
                }
                disabled={room.adults <= 1}
                title={
                  room.adults <= 1
                    ? t("hotels.guests.min_one_adult_per_room") ||
                      "At least 1 adult per room"
                    : ""
                }
              >
                −
              </SelectorButton>
              <SelectorCount>{room.adults}</SelectorCount>
              <SelectorButton
                onClick={(e) =>
                  handleButtonClick(e, roomIndex, "adults", "increment")
                }
              >
                +
              </SelectorButton>
            </SelectorControls>
          </SelectorItem>

          <SelectorItem>
            <SelectorItemInfo>
              <SelectorItemTitle>
                {t("hotels.guests.children")}
              </SelectorItemTitle>
              <SelectorItemDesc>
                {t("hotels.guests.children_desc")}
              </SelectorItemDesc>
            </SelectorItemInfo>
            <SelectorControls>
              <SelectorButton
                onClick={(e) =>
                  handleButtonClick(e, roomIndex, "children", "decrement")
                }
                disabled={room.children <= 0}
              >
                −
              </SelectorButton>
              <SelectorCount>{room.children}</SelectorCount>
              <SelectorButton
                onClick={(e) =>
                  handleButtonClick(e, roomIndex, "children", "increment")
                }
              >
                +
              </SelectorButton>
            </SelectorControls>
          </SelectorItem>

          {room.children > 0 && (
            <div onClick={(e) => e.stopPropagation()}>
              <ChildAgesContainer>
                <ChildAgeLabel>
                  {t("hotels.guests.children_ages") || "Children Ages"}
                </ChildAgeLabel>
                <ChildAgeGrid>
                  {Array.from({ length: room.children }).map(
                    (_, childIndex) => (
                      <ChildAgeWrapper key={childIndex}>
                        <ChildAgeNumber>
                          {t("hotels.guests.child") || "Child"} {childIndex + 1}
                        </ChildAgeNumber>
                        <ChildAgeSelect
                          value={room.childAges[childIndex] || 1}
                          onChange={(e) =>
                            updateRoomChildAge(
                              roomIndex,
                              childIndex,
                              e.target.value
                            )
                          }
                        >
                          {Array.from(
                            { length: CHILD_AGE_RANGE.max },
                            (_, i) => i + CHILD_AGE_RANGE.min
                          ).map((age) => (
                            <option key={age} value={age}>
                              {age}{" "}
                              {age === 1
                                ? t("hotels.guests.year") || "yr"
                                : t("hotels.guests.years") || "yrs"}
                            </option>
                          ))}
                        </ChildAgeSelect>
                      </ChildAgeWrapper>
                    )
                  )}
                </ChildAgeGrid>
              </ChildAgesContainer>
            </div>
          )}
        </RoomSection>
      ))}

      <AddRoomButton
        onClick={handleAddRoom}
        disabled={rooms.length >= MAX_ROOMS}
        title={
          rooms.length >= MAX_ROOMS
            ? t("hotels.guests.max_rooms_reached") ||
              `Maximum ${MAX_ROOMS} rooms`
            : ""
        }
      >
        <LuPlus />
        {t("hotels.guests.add_room") || "Add Room"}
        {rooms.length < MAX_ROOMS && ` (${rooms.length}/${MAX_ROOMS})`}
      </AddRoomButton>
    </>
  );

  return (
    <SelectorWrapper
      ref={guestsRef}
      onClick={(e) => {
        e.stopPropagation();
        if (!showGuestsDropdown) {
          guestsDropdownJustOpenedRef.current = true;
          setTimeout(() => {
            guestsDropdownJustOpenedRef.current = false;
          }, 100);
        }
        setShowGuestsDropdown(!showGuestsDropdown);
      }}
      $isOpen={showGuestsDropdown}
    >
      <SelectorLabel>
        {t("hotels.results.search_bar.rooms_guests")}
      </SelectorLabel>
      <SelectorInner $isOpen={showGuestsDropdown}>
        <LuUsers />
        <SelectorText>
          <SelectorValue>
            {totalGuests} {t("hotels.guests.guests")}, {guests.rooms}{" "}
            {guests.rooms === 1
              ? t("hotels.guests.room")
              : t("hotels.guests.rooms")}
          </SelectorValue>
        </SelectorText>
      </SelectorInner>

      {/* Mobile dropdown with portal */}
      {isMounted &&
        isMobile &&
        showGuestsDropdown &&
        createPortal(
          <>
            <GuestsOverlay
              $show={showGuestsDropdown}
              onClick={handleOverlayClick}
            />
            <SelectorDropdown onClick={(e) => e.stopPropagation()}>
              <MobileGuestsHeader>
                <MobileGuestsTitle>
                  {t("hotels.results.search_bar.rooms_guests")}
                </MobileGuestsTitle>
                <MobileCloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    guestsDropdownJustOpenedRef.current = false;
                    setShowGuestsDropdown(false);
                  }}
                >
                  <LuX />
                </MobileCloseButton>
              </MobileGuestsHeader>
              {renderRoomControls()}
            </SelectorDropdown>
          </>,
          document.body
        )}

      {/* Desktop dropdown */}
      {!isMobile && showGuestsDropdown && (
        <SelectorDropdown>{renderRoomControls()}</SelectorDropdown>
      )}
    </SelectorWrapper>
  );
};

export default GuestsSelector;
