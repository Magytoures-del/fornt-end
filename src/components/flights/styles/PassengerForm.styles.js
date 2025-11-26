import styled from "styled-components";

// Design System Constants
const theme = {
  colors: {
    primary: "#3d4fff",
    primaryHover: "#2d3eef",
    primaryLight: "#f0f4ff",
    secondary: "#6366f1",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    gray: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    "4xl": "2.5rem", // 40px
    "5xl": "3rem", // 48px
  },
  borderRadius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 1px 3px rgba(0, 0, 0, 0.1)",
    lg: "0 4px 6px rgba(0, 0, 0, 0.07)",
    xl: "0 8px 25px rgba(61, 79, 255, 0.3)",
  },
  transitions: {
    fast: "0.15s ease",
    normal: "0.2s ease",
    slow: "0.3s ease",
  },
};

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-block-start: ${theme.spacing["5xl"]};
  min-height: 100vh;
  padding-inline: ${theme.spacing.lg};

  @media (max-width: 640px) {
    margin-block-start: ${theme.spacing["2xl"]};
    padding-inline: ${theme.spacing.md};
  }

  /* Screen reader only class for accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export const Section = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing["3xl"]};
  margin-block-end: ${theme.spacing["3xl"]};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.gray[200]};
  transition: box-shadow ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.lg};
  }

  @media (max-width: 640px) {
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.lg};
    margin-block-end: ${theme.spacing.xl};
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: ${theme.spacing["3xl"]};
  padding-block-end: ${theme.spacing.lg};
  border-block-end: 2px solid ${theme.colors.gray[200]};
  gap: ${theme.spacing.md};
  flex-wrap: wrap;

  span:first-child {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${theme.colors.gray[800]};
    line-height: 1.4;
  }

  span:last-child {
    font-size: 0.95rem;
    color: ${theme.colors.gray[500]};
    background: ${theme.colors.gray[100]};
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
    font-weight: 500;
  }

  @media (max-width: 640px) {
    margin-block-end: ${theme.spacing.xl};
    padding-block-end: ${theme.spacing.md};

    span:first-child {
      font-size: 1.05rem;
    }

    span:last-child {
      font-size: 0.85rem;
      padding: ${theme.spacing.xs} ${theme.spacing.md};
    }
  }
`;

export const GenderToggle = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-block-end: ${theme.spacing["3xl"]};

  @media (max-width: 640px) {
    gap: ${theme.spacing.md};
    margin-block-end: ${theme.spacing.xl};
  }
`;

export const GenderButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg} ${theme.spacing["2xl"]};
  border: 2px solid
    ${({ $active }) =>
      $active ? theme.colors.primary : theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  background: ${({ $active }) =>
    $active ? theme.colors.primaryLight : "white"};
  color: ${({ $active }) =>
    $active ? theme.colors.primary : theme.colors.gray[500]};
  font-weight: 600;
  width: fit-content;
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  flex: 1 1 200px;
  min-height: 44px; /* Accessibility: minimum touch target */

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: 0.95rem;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const InputGrid = styled.div`
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing["2xl"]};
  margin-block-end: ${theme.spacing["2xl"]};
  display: grid;
  @media (max-width: 600px) {
    gap: ${theme.spacing.lg};
    margin-block-end: ${theme.spacing.lg};
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  label {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${theme.colors.gray[700]};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    line-height: 1.4;

    span {
      color: ${theme.colors.primary};
      font-weight: 700;
    }
  }

  @media (max-width: 640px) {
    gap: ${theme.spacing.sm};

    label {
      font-size: 0.9rem;
    }
  }
`;

export const Select = styled.select`
  padding: 1rem;
  border: 2px solid ${({ error }) => (error ? "#ef4444" : "#e2e8f0")};
  border-radius: 12px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;
  color: #334155;
  font-weight: 500;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25em;

  &:focus {
    outline: none;
    border-color: #3d4fff;
    box-shadow: 0 0 0 3px rgba(61, 79, 255, 0.1);
  }

  &:hover {
    border-color: #94a3b8;
  }

  option {
    padding: 0.5rem;
  }
`;

export const PhoneInput = styled.div`
  display: flex;
  border: 2px solid ${({ error }) => (error ? "#ef4444" : "#e2e8f0")};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #3d4fff;
    box-shadow: 0 0 0 3px rgba(61, 79, 255, 0.1);
  }

  select {
    border: none;
    border-right: 1px solid #e2e8f0;
    border-radius: 0;
    padding: 1rem 0.75rem;
    background: #f8fafc;
    font-weight: 600;
    color: #334155;
    min-width: 120px;
  }

  input {
    flex: 1;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    color: #334155;
    font-weight: 500;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  @media (max-width: 640px) {
    select {
      min-width: 96px;
      padding: 0.75rem 0.5rem;
    }

    input {
      padding: 0.75rem;
      font-size: 0.95rem;
    }
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;

  @media (max-width: 640px) {
    gap: 0.75rem;
    margin: 1rem 0;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3d4fff;
    background: #f0f4ff;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #3d4fff;
    cursor: pointer;
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    color: #334155;
  }

  @media (max-width: 640px) {
    padding: 0.75rem;

    span {
      font-size: 0.95rem;
    }
  }
`;

export const Textarea = styled.textarea`
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;
  color: #334155;
  font-weight: 500;
  background: white;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3d4fff;
    box-shadow: 0 0 0 3px rgba(61, 79, 255, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 640px) {
    font-size: 0.95rem;
    min-height: 80px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #3d4fff 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 2rem;

  &:hover {
    background: linear-gradient(135deg, #2d3eef 0%, #5b5cf0 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(61, 79, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 640px) {
    padding: 1rem 1.25rem;
    font-size: 1rem;
    margin-top: 1.25rem;
    border-radius: 10px;
  }
`;

export const ErrorMessage = styled.span`
  color: ${theme.colors.error};
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-block-start: ${theme.spacing.sm};
  animation: slideIn ${theme.transitions.fast};

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: "!";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: ${theme.colors.error};
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: bold;
    flex-shrink: 0;
  }
`;
