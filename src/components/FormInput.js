import React from "react";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 1rem;
  border: 2px solid ${({ error }) => (error ? "#ef4444" : "#e2e8f0")};
  border-radius: 12px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;
  color: #334155;
  font-weight: 500;
  background: white;

  &:focus {
    outline: none;
    border-color: #3d4fff;
    box-shadow: 0 0 0 3px rgba(61, 79, 255, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "!";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;

const FormInput = ({ label, error, type = "text", required, ...props }) => {
  return (
    <InputWrapper>
      {label && (
        <Label>
          {label}
          {required && <span style={{ color: "#ef4444" }}>*</span>}
        </Label>
      )}
      <StyledInput type={type} error={error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
};

export default FormInput;
