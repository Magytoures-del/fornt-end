/**
 * Styled components for SearchForm component
 */

import styled from "styled-components";

// Design tokens
const colors = {
  white: "#ffffff",
  gray: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#6b7280",
    600: "#475569",
    700: "#374151",
  },
  blue: {
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  orange: {
    300: "#fdba74",
  },
};

const spacing = {
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  "2xl": "32px",
};

const borderRadius = {
  sm: "8px",
  md: "10px",
};

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "789px",
  xl: "1024px",
};

// Main container
export const SearchFormContainer = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  border-radius: ${borderRadius.md};
  background-color: ${colors.white};

  @media (min-width: ${breakpoints.lg}) {
    padding: 0;
    border: 1px solid ${colors.gray[200]};
  }

  /* RTL Support */
  [dir="rtl"] & {
    @media (min-width: ${breakpoints.lg}) {
      padding-right: 10px;
    }
  }

  [dir="ltr"] & {
    @media (min-width: ${breakpoints.lg}) {
      padding-left: 10px;
    }
  }
`;

// Form grid layout
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;

  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${breakpoints.xl}) {
    grid-template-columns: 1fr 1fr 100px;
  }
`;

// Input group wrapper
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};

  @media (min-width: ${breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }
`;

// Form label
export const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.gray[700]};
  display: block;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 14px;
  }

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

// Swap locations button
export const SwapButton = styled.button`
  width: 30px;
  height: 30px;
  border: 2px solid ${colors.gray[200]};
  border-radius: 50%;
  background: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 ${spacing.xs};
  flex-shrink: 0;

  &:hover {
    border-color: ${colors.blue[500]};
    background: ${colors.gray[50]};
    transform: rotate(180deg);
  }

  &:active {
    transform: rotate(180deg) scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${colors.gray[500]};
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: ${colors.blue[500]};
  }
`;

// Search button
export const SearchButton = styled.button`
  background: linear-gradient(
    135deg,
    ${colors.blue[500]} 0%,
    ${colors.blue[700]} 100%
  );
  color: ${colors.white};
  border: none;
  margin-top: ${spacing.lg};
  padding: 10px ${spacing["2xl"]};
  border-bottom-left-radius: ${borderRadius.sm};
  border-bottom-right-radius: ${borderRadius.sm};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  height: 100%;

  @media (min-width: ${breakpoints.lg}) {
    border-top-left-radius: ${borderRadius.sm};
    border-bottom-left-radius: ${borderRadius.sm};
    border-bottom-right-radius: 0;
    padding: 0px ${spacing["2xl"]};
    margin-top: 0;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${colors.gray[400]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* RTL Support */
  [dir="ltr"] & {
    @media (min-width: ${breakpoints.lg}) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: ${borderRadius.sm};
      border-bottom-right-radius: ${borderRadius.sm};
    }
  }
`;

