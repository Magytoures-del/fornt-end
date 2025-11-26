import styled from "styled-components";

export const Suggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), 0 10px 25px rgba(0, 0, 0, 0.08);
  max-height: 400px;
  overflow-y: auto;
  list-style: none;
  margin: 8px 0 0 0;
  padding: 12px;
  z-index: 1000;

  @media (max-width: 767px) {
    display: none;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

export const SuggestionItem = styled.li`
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  margin-bottom: 6px;
  border: 2px solid transparent;
  background: white;

  &:hover {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #93c5fd;
    transform: translateX(6px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2);
  }

  &:last-child {
    margin-bottom: 0;
  }

  [dir="rtl"] &:hover {
    transform: translateX(-6px);
  }
`;

export const SkeletonItem = styled.li`
  padding: 14px 18px;
  margin-bottom: 4px;
  border-radius: 12px;
  background: #f8fafc;
  overflow: hidden;
`;

export const SkeletonLine = styled.div`
  position: relative;
  height: 12px;
  width: ${(props) => props.$w || "100%"};
  border-radius: 8px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e5e7eb 37%, #f1f5f9 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;

export const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #93c5fd;
  border-top-color: #2563eb;
  border-radius: 9999px;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

