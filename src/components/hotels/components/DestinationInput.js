import React from "react";
import { LuMapPin, LuBed } from "react-icons/lu";
import {
  StyledInput,
  InputWrapper,
  Input,
} from "../styles/SearchBar.styles";
import {
  Suggestions,
  SuggestionItem,
  SkeletonItem,
  SkeletonLine,
  Spinner,
} from "../styles/Suggestions.styles";
import {
  getSuggestionDisplayText,
  buildLocationParts,
  renderHighlighted,
} from "../utils/hotelSearchUtils";

const DestinationInput = ({
  destinationRef,
  suggestionsRef,
  searchTerm,
  isMobile,
  handleDestinationChange,
  handleMobileInputClick,
  placeholder,
  showSuggestions,
  isSuggestLoading,
  suggestions,
  handleSuggestionSelect,
  noResultsText,
}) => {
  return (
    <StyledInput ref={destinationRef}>
      <InputWrapper className="mt-2">
        <LuMapPin />
        <Input
          type="text"
          value={searchTerm}
          onChange={isMobile ? undefined : handleDestinationChange}
          onClick={isMobile ? handleMobileInputClick : undefined}
          onFocus={
            isMobile
              ? handleMobileInputClick
              : (e) => {
                  e.target.select();
                }
          }
          readOnly={isMobile}
          placeholder={placeholder}
          style={isMobile ? { cursor: "pointer" } : {}}
        />
      </InputWrapper>

      {/* Desktop Suggestions */}
      {showSuggestions && !isMobile && (
        <Suggestions ref={suggestionsRef}>
          {isSuggestLoading && (
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonItem key={`skeleton-${idx}`}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <SkeletonLine $w="60%" />
                    <SkeletonLine $w="40%" />
                  </div>
                </SkeletonItem>
              ))}
            </>
          )}

          {!isSuggestLoading &&
            suggestions.length > 0 &&
            suggestions.map((suggestion, index) => {
              const displayText = getSuggestionDisplayText(suggestion);
              const locationParts = buildLocationParts(suggestion);
              const secondaryText =
                locationParts.length > 0
                  ? locationParts.join(", ")
                  : suggestion.fullName;

              return (
                <SuggestionItem
                  key={suggestion.id || index}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#1f2937",
                          marginBottom: "4px",
                        }}
                      >
                        {renderHighlighted(displayText, searchTerm)}
                      </div>
                      {secondaryText && (
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6b7280",
                          }}
                        >
                          {renderHighlighted(secondaryText, searchTerm)}
                        </div>
                      )}
                    </div>
                    {suggestion.type && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          background: "#dbeafe",
                          color: "#1e40af",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {suggestion.type}
                      </span>
                    )}
                  </div>
                </SuggestionItem>
              );
            })}

          {!isSuggestLoading && suggestions.length === 0 && (
            <SuggestionItem style={{ cursor: "default" }}>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {noResultsText}
              </div>
            </SuggestionItem>
          )}
        </Suggestions>
      )}
    </StyledInput>
  );
};

export default DestinationInput;

