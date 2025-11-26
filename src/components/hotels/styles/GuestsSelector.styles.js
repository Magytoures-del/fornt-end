import styled from "styled-components";

export const SelectorWrapper = styled.div`
  position: relative;
  width: 100%;
  border: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${(props) =>
    props.$isOpen &&
    `
    border-color: #3b82f6;
  `}

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: #3b82f6;
  }
`;

export const SelectorInner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 5px;
  border-radius: 12px;
  background: white;
  padding: 4px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.04);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
  }

  ${(props) =>
    props.$isOpen &&
    `
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    background: rgba(239, 246, 255, 0.5);
  `}
`;

export const SelectorText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SelectorLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SelectorValue = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
`;

export const SelectorDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), 0 10px 25px rgba(0, 0, 0, 0.08);
  z-index: 10001;
  padding: 24px;
  min-width: 340px;
  max-width: 420px;
  animation: fadeInUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 450px;
  overflow-y: auto;

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

  @media (max-width: 767px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: none;
    min-width: 100%;
    border-radius: 20px 20px 0 0;
    max-height: 70vh;
    z-index: 10010;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(-12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SelectorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;

  @media (max-width: 767px) {
    padding: 20px 0;
  }

  &:hover {
    background: #f9fafb;
    margin: 0 -20px;
    padding: 16px 20px;
    border-radius: 8px;

    @media (max-width: 767px) {
      padding: 20px;
    }
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const SelectorItemInfo = styled.div`
  flex: 1;
`;

export const SelectorItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

export const SelectorItemDesc = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const SelectorControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SelectorButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #3b82f6;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 767px) {
    width: 44px;
    height: 44px;
    font-size: 24px;
  }

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
    background: #f1f5f9;
    border-color: #e2e8f0;
  }
`;

export const SelectorCount = styled.span`
  min-width: 50px;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  padding: 0 8px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 8px;
  padding: 6px 12px;
`;

export const ChildAgesContainer = styled.div`
  margin-top: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

export const ChildAgeLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ChildAgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
`;

export const ChildAgeSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236b7280' d='M5 7L1 3h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;

  @media (max-width: 767px) {
    padding: 12px 16px;
    padding-right: 36px;
    font-size: 16px;
    min-height: 44px;
  }

  &:hover {
    border-color: #3b82f6;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const ChildAgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ChildAgeNumber = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
`;

export const GuestsOverlay = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: ${(props) => (props.$show ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10009;
    opacity: ${(props) => (props.$show ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;

export const MobileGuestsHeader = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 2px solid #e5e7eb;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  }
`;

export const MobileGuestsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const MobileCloseButton = styled.button`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    width: 36px;
    height: 36px;
    border: none;
    background: #f1f5f9;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e5e7eb;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 20px;
      height: 20px;
      color: #4b5563;
    }
  }
`;

export const RoomSection = styled.div`
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: all 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

export const RoomTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #3b82f6;
  }
`;

export const RemoveRoomButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const AddRoomButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  margin-top: 12px;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #3b82f6;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #9ca3af;
    border-color: #e5e7eb;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const RoomsSummary = styled.div`
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
  text-align: center;
`;

