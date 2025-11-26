import React from "react";
import { IoCalendar } from "react-icons/io5";

/**
 * DateField Component
 * Displays a single date field (start or end date)
 *
 * @param {Object} props
 * @param {string|null} props.formattedDate - Formatted date string to display
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.isRTL - Whether RTL layout
 * @param {boolean} props.isClickable - Whether field is clickable
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onKeyDown - Keyboard handler
 * @param {string} props.ariaLabel - ARIA label
 */
export const DateField = ({
  formattedDate,
  label,
  placeholder,
  isRTL,
  isClickable = false,
  className = "",
  onClick,
  onKeyDown,
  ariaLabel,
}) => {
  const displayText = formattedDate || placeholder;

  return (
    <div
      className={`
        flex-1 flex items-center justify-between
        py-3 px-3 sm:py-4 sm:px-4
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col flex-1 min-w-0">
        {label && (
          <span
            className="text-xs sm:text-sm text-gray-500 mb-1 font-medium"
            aria-hidden="true"
          >
            {label}
          </span>
        )}
        <span
          className={`
            text-sm sm:text-base lg:text-lg font-medium truncate transition-colors duration-200
            ${
              formattedDate
                ? "text-gray-800"
                : isClickable
                ? "text-gray-400 hover:text-orange-500"
                : "text-gray-400"
            }
          `}
        >
          {displayText}
        </span>
      </div>
      <IoCalendar
        className={`
          text-gray-400 flex-shrink-0
          w-5 h-5 sm:w-6 sm:h-6
          ${isRTL ? "mr-2" : "ml-2"}
        `}
        aria-hidden="true"
      />
    </div>
  );
};
