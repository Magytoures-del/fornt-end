import React from "react";

/**
 * DateInputContainer Component
 * Container wrapper for date input fields
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.isRTL - Whether RTL layout
 * @param {boolean} props.isActive - Whether calendar is active
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onKeyDown - Keyboard handler
 * @param {string} props.ariaLabel - ARIA label
 * @param {boolean} props.ariaExpanded - ARIA expanded state
 */
export const DateInputContainer = ({
  children,
  isRTL,
  isActive,
  onClick,
  onKeyDown,
  ariaLabel,
  ariaExpanded,
}) => {
  return (
    <div
      className={`
        flex w-full rounded-lg overflow-hidden bg-white cursor-pointer
        hover:border-orange-300 transition-all duration-200
        lg:border border-gray-200
        ${isActive ? "border-orange-400 shadow-md" : ""}
      `}
      onClick={onClick}
      dir={isRTL ? "rtl" : "ltr"}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

