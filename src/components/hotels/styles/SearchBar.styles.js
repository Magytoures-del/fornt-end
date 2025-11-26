import styled from "styled-components";

// Main Container
export const SearchFormContainer = styled.div`
  padding: 0px 0;
  padding-right: 0;
  margin-top: 30px;
  @media (min-width: 789px) {
    padding: 16px 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  display: flex;
  flex-direction: column;
  gap: 50px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  align-items: stretch;

  padding-top: 20px;
  gap: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 0;
    padding: 0px 0px 0px 0px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1.2fr 0.5fr 100px;
    padding: 0px;
  }
`;

export const InputGroup = styled.div`
  flex-direction: column;
  gap: 0;
  display: flex;
  justify-content: center;
  &[data-no-border="true"] {
    border-right: none;
  }

  @media (min-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  &:last-of-type {
    border-right: none;
  }
`;

export const StyledInput = styled.div`
  width: 100%;
  border-radius: 7px;
  position: relative;
  height: 56px;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(59, 130, 246, 0.04);
  }

  &:focus-within {
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  svg {
    width: 24px;
    height: 24px;
    color: #64748b;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: #3b82f6;
  }
`;

export const Input = styled.input`
  border: none;
  height: 100%;
  width: 100%;
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
  background: transparent;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    color: #0f172a;
  }

  [dir="rtl"] & {
    text-align: right;
  }
`;

export const SearchButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 789px) {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 0;
    padding: 0px 32px;
    margin-top: 0;
  }
  padding: 10px 32px;
  border-bottom-left-radius: 8px;

  border-bottom-right-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  height: 100%;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* RTL Support */
  [dir="ltr"] & {
    @media (min-width: 789px) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    /* Mobile: both bottom corners remain rounded (inherited from base styles) */
  }
`;
