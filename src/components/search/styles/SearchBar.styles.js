import styled from "styled-components";

// Design System Theme
const theme = {
  colors: {
    white: "#ffffff",
    gray: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
    },
    primary: {
      light: "rgba(59, 130, 246, 0.05)",
      medium: "rgba(59, 130, 246, 0.1)",
    },
  },
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.25rem", // 20px
    xl: "1.5rem", // 24px
    "2xl": "1.75rem", // 28px
  },
  borderRadius: {
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
  shadows: {
    default:
      "0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.05)",
    hover:
      "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)",
  },
  transitions: {
    default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

// Main Container
export const SearchContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  position: relative;
  z-index: 10;

  @media (min-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xl};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    gap: ${theme.spacing["2xl"]};
  }
`;

// Flight Options Grid
export const FlightOptions = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
  width: 100%;
  grid-template-columns: 1fr;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.lg};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${theme.spacing.sm};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    gap: ${theme.spacing.lg};
  }

  @media (min-width: ${theme.breakpoints.xl}) {
    gap: ${theme.spacing.xl};
  }
`;

// Form Group Container
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-width: 0; /* Prevents overflow in grid */
  width: 100%;

  /* Support for Tailwind utility classes */
  &.hidden {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    &.lg\\:flex {
      display: flex;
    }
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

// Form Label
export const FormLabel = styled.label`
  font-size: 0.75rem; /* 12px */
  font-weight: 600;
  color: ${theme.colors.gray[700]};
  display: block;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  /* Hide on mobile when hidden class is applied */
  &.hidden {
    display: none;
  }

  /* Show on large screens when lg:block is applied */
  @media (min-width: ${theme.breakpoints.lg}) {
    &.lg\\:block {
      display: block;
    }
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 0.8125rem; /* 13px */
  }

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 0.875rem; /* 14px */
  }

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

// Search Form Container
export const SearchFormContainer = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.white} 0%,
    ${theme.colors.gray[50]} 100%
  );
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.default};
  padding-top: ${theme.spacing.md};
  transition: ${theme.transitions.default};
  border: 1px solid ${theme.colors.gray[200]};

  &:hover {
    box-shadow: ${theme.shadows.hover};
    transform: translateY(-1px);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    border-radius: ${theme.borderRadius.xl};
    padding: ${theme.spacing.xl} ${theme.spacing["2xl"]};
  }
`;
