import React from "react";
import { LuMapPin, LuBed, LuX } from "react-icons/lu";
import {
  BottomSheetOverlay,
  BottomSheet,
  BottomSheetDragIndicator,
  BottomSheetHeader,
  BottomSheetTitle,
  CloseButton,
  BottomSheetContent,
  MobileSearchInputWrapper,
  MobileSearchIcon,
  MobileSearchInput,
  MobileSuggestionsList,
  MobileSuggestionItem,
  MobileSuggestionContent,
  MobileSuggestionIcon,
  MobileSuggestionText,
  MobileSuggestionTitle,
  MobileSuggestionSubtitle,
  MobileSuggestionBadge,
  MobileNoResults,
} from "../styles/MobileBottomSheet.styles";
import { SkeletonLine } from "../styles/Suggestions.styles";
import {
  getSuggestionDisplayText,
  buildLocationParts,
  renderHighlighted,
} from "../utils/hotelSearchUtils";

const MobileDestinationBottomSheet = ({
  showMobilePopup,
  handleOverlayClick,
  closeMobileSuggestions,
  mobileSearchRef,
  mobileSearchValue,
  handleMobileSearch,
  isSuggestLoading,
  suggestions,
  handleSuggestionSelect,
  title,
  placeholder,
  noResultsText,
  startTypingText,
}) => {
  return (
    <>
      <BottomSheetOverlay
        $show={showMobilePopup}
        onClick={handleOverlayClick}
      />
      <BottomSheet $show={showMobilePopup}>
        <BottomSheetDragIndicator />
        <BottomSheetHeader>
          <BottomSheetTitle>{title}</BottomSheetTitle>
          <CloseButton onClick={closeMobileSuggestions}>
            <LuX />
          </CloseButton>
        </BottomSheetHeader>
        <BottomSheetContent>
          <MobileSearchInputWrapper>
            <MobileSearchIcon>
              <LuMapPin />
            </MobileSearchIcon>
            <MobileSearchInput
              ref={mobileSearchRef}
              type="text"
              placeholder={placeholder}
              value={mobileSearchValue}
              onChange={handleMobileSearch}
              autoComplete="off"
            />
          </MobileSearchInputWrapper>

          {isSuggestLoading && (
            <div style={{ padding: "12px 0" }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <MobileSuggestionItem key={`mobile-skeleton-${idx}`}>
                  <MobileSuggestionContent>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#f1f5f9",
                        flexShrink: 0,
                      }}
                    >
                      <SkeletonLine
                        $w="22px"
                        style={{
                          height: "22px",
                          margin: "13px auto",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <MobileSuggestionText>
                      <SkeletonLine $w="70%" />
                      <SkeletonLine $w="50%" />
                    </MobileSuggestionText>
                  </MobileSuggestionContent>
                </MobileSuggestionItem>
              ))}
            </div>
          )}

          {!isSuggestLoading && suggestions.length > 0 && (
            <MobileSuggestionsList>
              {suggestions.map((suggestion, index) => {
                const displayText = getSuggestionDisplayText(suggestion);
                const locationParts = buildLocationParts(suggestion);
                const secondaryText =
                  locationParts.length > 0
                    ? locationParts.join(", ")
                    : suggestion.fullName;

                const getIcon = () => {
                  if (suggestion.type === "hotel") {
                    return <LuBed />;
                  }
                  return <LuMapPin />;
                };

                return (
                  <MobileSuggestionItem
                    key={suggestion.id || index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <MobileSuggestionContent>
                      <MobileSuggestionIcon>{getIcon()}</MobileSuggestionIcon>
                      <MobileSuggestionText>
                        <MobileSuggestionTitle>
                          {renderHighlighted(displayText, mobileSearchValue)}
                        </MobileSuggestionTitle>
                        {secondaryText && (
                          <MobileSuggestionSubtitle>
                            {renderHighlighted(
                              secondaryText,
                              mobileSearchValue
                            )}
                          </MobileSuggestionSubtitle>
                        )}
                      </MobileSuggestionText>
                      {suggestion.type && (
                        <MobileSuggestionBadge>
                          {suggestion.type}
                        </MobileSuggestionBadge>
                      )}
                    </MobileSuggestionContent>
                  </MobileSuggestionItem>
                );
              })}
            </MobileSuggestionsList>
          )}

          {!isSuggestLoading &&
            suggestions.length === 0 &&
            mobileSearchValue.trim() && (
              <MobileNoResults>{noResultsText}</MobileNoResults>
            )}

          {!isSuggestLoading &&
            suggestions.length === 0 &&
            !mobileSearchValue.trim() && (
              <MobileNoResults>{startTypingText}</MobileNoResults>
            )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

export default MobileDestinationBottomSheet;

