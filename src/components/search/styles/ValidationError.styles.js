/**
 * Styled components for validation errors
 */

import styled from "styled-components";

const colors = {
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
  },
  gray: {
    400: "#9ca3af",
  },
};

const spacing = {
  xs: "4px",
  sm: "8px",
};

// Error message container - absolutely positioned to avoid taking space
export const ErrorMessage = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  color: ${colors.red[600]};
  font-size: 12px;
  font-weight: 500;
  margin-top: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${colors.red[50]};
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  line-height: 1.4;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
  pointer-events: none;

  /* Hide on mobile - use toast instead */
  @media (max-width: 768px) {
    display: none;
  }

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

// Error message wrapper - relative positioning for absolute children
export const ErrorMessageWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// Error icon wrapper
export const ErrorIcon = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: ${colors.red[500]};
`;

// Input with error state
export const InputWithError = styled.div`
  position: relative;
  width: 100%;

  ${(props) =>
    props.$hasError &&
    `
    input, select, textarea {
      border-color: ${colors.red[500]} !important;
      background-color: ${colors.red[50]} !important;
      
      &:focus {
        border-color: ${colors.red[600]} !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }
    }
  `}
`;

// Error summary container (for displaying all errors at once)
export const ErrorSummary = styled.div`
  background-color: ${colors.red[50]};
  border: 1px solid ${colors.red[200]};
  border-radius: 8px;
  padding: ${spacing.sm} 12px;
  margin-bottom: ${spacing.sm};
  color: ${colors.red[600]};
  font-size: 13px;
  font-weight: 500;

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;

    [dir="rtl"] & {
      padding-left: 0;
      padding-right: 20px;
    }
  }

  li {
    margin-bottom: ${spacing.xs};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
