import styled from "styled-components";

export const BottomSheetOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10005;
  display: ${(props) => (props.$show ? "block" : "none")};
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease;
  visibility: ${(props) => (props.$show ? "visible" : "hidden")};

  @media (min-width: 768px) {
    display: none;
  }
`;

export const BottomSheet = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 0;
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.3);
  z-index: 10006;
  transform: ${(props) => (props.$show ? "translateY(0)" : "translateY(100%)")};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  visibility: ${(props) => (props.$show ? "visible" : "hidden")};

  @media (min-width: 768px) {
    display: none;
  }
`;

export const BottomSheetDragIndicator = styled.div`
  width: 40px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin: 8px auto 0;
  flex-shrink: 0;
`;

export const BottomSheetHeader = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const BottomSheetTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 2px;
  }
`;

export const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #e5e7eb;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 22px;
    height: 22px;
    color: #4b5563;
  }
`;

export const BottomSheetContent = styled.div`
  padding: 0;
  flex: 1;
  overflow-y: auto;
  background: #ffffff;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

export const MobileSearchInputWrapper = styled.div`
  position: relative;
  padding: 20px;
  background: white;
  border-bottom: 2px solid #e5e7eb;
`;

export const MobileSearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 52px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  background: #f8fafc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

export const MobileSearchIcon = styled.div`
  position: absolute;
  left: 36px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const MobileSuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 8px 0;
`;

export const MobileNoResults = styled.div`
  padding: 60px 24px;
  text-align: center;
  color: #6b7280;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &::before {
    content: "🔍";
    font-size: 48px;
    opacity: 0.5;
    margin-bottom: 8px;
  }
`;

export const MobileSuggestionItem = styled.li`
  padding: 0;
  margin: 0;
  border-radius: 0;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;

  &:active {
    background: #f1f5f9;
  }
`;

export const MobileSuggestionContent = styled.div`
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;

  ${MobileSuggestionItem}:hover & {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding-left: 24px;
  }

  ${MobileSuggestionItem}:last-child & {
    border-bottom: none;
  }
`;

export const MobileSuggestionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);

  svg {
    width: 22px;
    height: 22px;
    color: #2563eb;
  }
`;

export const MobileSuggestionText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MobileSuggestionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin: 0;
`;

export const MobileSuggestionSubtitle = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.3;
  margin: 0;
`;

export const MobileSuggestionBadge = styled.span`
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);
`;

