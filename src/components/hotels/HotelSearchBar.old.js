"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import {
  LuMapPin,
  LuCalendar,
  LuUsers,
  LuSearch,
  LuGlobe,
  LuX,
  LuBed,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import axios from "axios";
import DateInput from "../search/DateInput";
import {
  SearchFormProvider,
  useSearchForm,
} from "../../context/SearchFormContext";

// Styled Components
const SearchFormContainer = styled.div`
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  align-items: stretch;
  padding: 12px 12px;
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
    grid-template-columns:
      1fr 1.2fr
      0.5fr 100px;
    padding: 0px;
  }
`;

const InputGroup = styled.div`
  flex-direction: column;
  gap: 0;
  /* padding-right: 10px; */
  /* border-right: 1px solid #e5e7eb; */
  display: flex;
  justify-content: center;
  &[data-no-border="true"] {
    border-right: none;
  }

  @media (min-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  @media (min-width: 1024px) {
  }

  &:last-of-type {
    border-right: none;
  }
`;

const SearchButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  padding: 0;

  @media (min-width: 1024px) {
    padding-left: 20px;
  }
`;

const StyledInput = styled.div`
  width: 100%;
  border-radius: 7px;
  position: relative;
  height: 56px;
`;

const InputWrapper = styled.div`
  position: relative;
  /* height: 56px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  /* background: #f8fafc; */
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

const Input = styled.input`
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

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const RightControls = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  transform: translateY(-50%);
  &:hover {
    color: #111827;
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const Spinner = styled.div`
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

const Suggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15),
    0 10px 25px rgba(0, 0, 0, 0.08);
  max-height: 400px;
  overflow-y: auto;
  list-style: none;
  margin: 8px 0 0 0;
  padding: 12px;
  z-index: 1000;

  @media (max-width: 767px) {
    display: none;
  }

  /* Custom scrollbar */
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

// Mobile Bottom Sheet Components
const BottomSheetOverlay = styled.div`
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

const BottomSheet = styled.div`
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

const BottomSheetDragIndicator = styled.div`
  width: 40px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin: 8px auto 0;
  flex-shrink: 0;
`;

const BottomSheetHeader = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const BottomSheetTitle = styled.h3`
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

const CloseButton = styled.button`
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

const BottomSheetContent = styled.div`
  padding: 0;
  flex: 1;
  overflow-y: auto;
  background: #ffffff;

  /* Custom scrollbar */
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

const MobileSearchInputWrapper = styled.div`
  position: relative;
  padding: 20px;
  background: white;
  border-bottom: 2px solid #e5e7eb;
`;

const MobileSearchInput = styled.input`
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

const MobileSearchIcon = styled.div`
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

const MobileSuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 8px 0;
`;

const MobileNoResults = styled.div`
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

const MobileSuggestionItem = styled.li`
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

const MobileSuggestionContent = styled.div`
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

const MobileSuggestionIcon = styled.div`
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

const MobileSuggestionText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MobileSuggestionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin: 0;
`;

const MobileSuggestionSubtitle = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.3;
  margin: 0;
`;

const MobileSuggestionBadge = styled.span`
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

// Skeleton loaders for destination suggestions
const SkeletonItem = styled.li`
  padding: 14px 18px;
  margin-bottom: 4px;
  border-radius: 12px;
  background: #f8fafc;
  overflow: hidden;
`;

const SkeletonLine = styled.div`
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

const SuggestionAlert = styled.li`
  padding: 12px 14px;
  margin: 6px 6px 10px 6px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const RetryButton = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #fca5a5;
  background: #fff7ed;
  color: #9a3412;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background: #ffedd5;
  }
`;

const FormError = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  font-size: 14px;
`;

// Toasts
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
`;

const ToastItem = styled.div`
  min-width: 260px;
  max-width: 360px;
  padding: 12px 14px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${(p) => (p.$type === "error" ? "#fecaca" : "#bae6fd")};
  background: ${(p) => (p.$type === "error" ? "#fef2f2" : "#eff6ff")};
  color: ${(p) => (p.$type === "error" ? "#991b1b" : "#1e3a8a")};
  font-size: 14px;
`;

// Full-screen searching overlay
const OverlayBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.96),
    rgba(37, 99, 235, 0.96),
    rgba(29, 78, 216, 0.96),
    rgba(30, 64, 175, 0.96)
  );
  backdrop-filter: blur(12px) saturate(1.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: backdropFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Animated gradient background */
  background-size: 300% 300%;
  animation: gradientShift 10s ease infinite, backdropFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes backdropFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px) saturate(1);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(12px) saturate(1.5);
    }
  }

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  /* Animated floating hotel icons */
  &::before {
    content: "🏨 ✈️ 🌍 🗺️ 🏖️ 🌟 🧳 🏛️";
    position: absolute;
    inset: 0;
    font-size: 40px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    place-items: center;
    opacity: 0.15;
    animation: floatIcons 30s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes floatIcons {
    0%, 100% {
      transform: translateY(0) rotate(0deg) scale(1);
    }
    25% {
      transform: translateY(-30px) rotate(5deg) scale(1.1);
    }
    50% {
      transform: translateY(-15px) rotate(-5deg) scale(0.95);
    }
    75% {
      transform: translateY(-40px) rotate(3deg) scale(1.05);
    }
  }

  /* Glowing orbs */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 25%),
      radial-gradient(circle at 85% 75%, rgba(255, 255, 255, 0.15) 0%, transparent 30%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 25% 80%, rgba(147, 197, 253, 0.2) 0%, transparent 25%),
      radial-gradient(circle at 75% 20%, rgba(191, 219, 254, 0.15) 0%, transparent 30%);
    animation: orbitOrbs 20s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes orbitOrbs {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.6;
    }
    25% {
      transform: translate(-10px, -20px) scale(1.1);
      opacity: 0.8;
    }
    50% {
      transform: translate(10px, -10px) scale(0.9);
      opacity: 0.5;
    }
    75% {
      transform: translate(-15px, 15px) scale(1.05);
      opacity: 0.7;
    }
  }
`;

const OverlayCard = styled.div`
  width: 92%;
  max-width: 640px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(1.8);
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 
    0 50px 100px rgba(0, 0, 0, 0.3),
    0 25px 50px rgba(0, 0, 0, 0.2),
    0 10px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 1),
    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
  padding: 48px 36px;
  position: relative;
  z-index: 1;
  animation: cardSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;

  @keyframes cardSlideUp {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.92) rotateX(10deg);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1) rotateX(0deg);
    }
  }

  /* Animated shimmer effect */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 70%
    );
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    50% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  /* Rotating gradient orb */
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(59, 130, 246, 0.08) 0%,
      rgba(37, 99, 235, 0.04) 30%,
      transparent 60%
    );
    animation: rotateOrb 25s linear infinite;
  }

  @keyframes rotateOrb {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 640px) {
    padding: 36px 28px;
    max-width: 95%;
    border-radius: 24px;
  }
`;

const OverlayHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-weight: 700;
  color: #111827;
  font-size: 16px;
`;

const OverlayIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 70%, #1d4ed8 100%);
  color: white;
  font-size: 44px;
  margin: 0 auto 20px auto;
  position: relative;
  box-shadow: 
    0 20px 50px rgba(59, 130, 246, 0.5),
    0 10px 25px rgba(59, 130, 246, 0.4),
    0 5px 12px rgba(59, 130, 246, 0.3),
    inset 0 -3px 10px rgba(0, 0, 0, 0.15),
    inset 0 3px 10px rgba(255, 255, 255, 0.2);
  animation: iconFloat 3s ease-in-out infinite;

  @keyframes iconFloat {
    0%, 100% {
      transform: translateY(0) scale(1);
      box-shadow: 
        0 20px 50px rgba(59, 130, 246, 0.5),
        0 10px 25px rgba(59, 130, 246, 0.4);
    }
    50% {
      transform: translateY(-10px) scale(1.05);
      box-shadow: 
        0 30px 60px rgba(59, 130, 246, 0.6),
        0 15px 30px rgba(59, 130, 246, 0.5);
    }
  }

  /* Rotating ring */
  &::before {
    content: "";
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: rgba(147, 197, 253, 0.8);
    border-right-color: rgba(147, 197, 253, 0.5);
    animation: spinRing 2s linear infinite;
  }

  @keyframes spinRing {
    to {
      transform: rotate(360deg);
    }
  }

  /* Second ring */
  &::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-bottom-color: rgba(191, 219, 254, 0.6);
    border-left-color: rgba(191, 219, 254, 0.3);
    animation: spinRing 1.5s linear infinite reverse;
  }

  /* Icon with animation */
  svg {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
    animation: searchPulse 2s ease-in-out infinite;
  }

  @keyframes searchPulse {
    0%, 100% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.1) rotate(5deg);
    }
  }
`;

const OverlayTitle = styled.h3`
  text-align: center;
  font-size: 26px;
  font-weight: 900;
  color: #0f172a;
  margin: 12px 0 8px 0;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleSlide 0.6s ease-out 0.3s both;

  @keyframes titleSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const OverlaySubtitle = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 12px 0;
  position: relative;
  z-index: 1;
  animation: subtitleSlide 0.6s ease-out 0.4s both;

  @keyframes subtitleSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const OverlayNote = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 20px 0;
  position: relative;
  z-index: 1;
  animation: noteSlide 0.6s ease-out 0.5s both;

  @keyframes noteSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 10px 0 20px 0;
  position: relative;
  z-index: 1;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    animation: dotBounce 1.4s ease-in-out infinite;
  }

  span:nth-child(1) {
    animation-delay: 0s;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }

  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes dotBounce {
    0%, 60%, 100% {
      transform: translateY(0) scale(1);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-12px) scale(1.2);
      opacity: 1;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
    }
  }
`;

const ProgressTrack = styled.div`
  width: 85%;
  height: 10px;
  border-radius: 12px;
  background: rgba(226, 232, 240, 0.8);
  margin: 16px auto 0 auto;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.8);
  animation: trackSlide 0.6s ease-out 0.6s both;

  @keyframes trackSlide {
    from {
      opacity: 0;
      transform: scaleX(0.8);
    }
    to {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  /* Animated shine */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: trackShine 2s ease-in-out infinite;
  }

  @keyframes trackShine {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${(p) => `${p.$value || 0}%`};
  background: linear-gradient(
    90deg,
    #60a5fa 0%,
    #3b82f6 50%,
    #2563eb 100%
  );
  border-radius: 12px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);

  /* Animated shimmer */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    animation: progressShimmer 1.5s ease-in-out infinite;
  }

  @keyframes progressShimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  /* Glowing effect */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    border-radius: 12px;
  }
`;

const OverlayRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%);
  border: 1px solid rgba(226, 232, 240, 0.6);
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: rowSlide 0.5s ease-out both;
  animation-delay: calc(var(--index) * 0.1s);

  &:nth-child(1) {
    --index: 1;
  }
  &:nth-child(2) {
    --index: 2;
  }
  &:nth-child(3) {
    --index: 3;
  }
  &:nth-child(4) {
    --index: 4;
  }

  @keyframes rowSlide {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    background: linear-gradient(135deg, rgba(239, 246, 255, 0.9) 0%, rgba(219, 234, 254, 0.9) 100%);
    border-color: rgba(147, 197, 253, 0.6);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  &:last-child {
    margin-bottom: 0;
  }

  /* Decorative accent */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 60%;
    background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
    border-radius: 0 4px 4px 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 14px 16px;
  }
`;

const OverlayLabel = styled.div`
  color: #64748b;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.01em;

  svg {
    color: #3b82f6;
  }

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const OverlayValue = styled.div`
  color: #0f172a;
  font-weight: 700;
  font-size: 15px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const OverlaySpinner = styled.div`
  width: 22px;
  height: 22px;
  border: 3px solid #bfdbfe;
  border-top-color: #2563eb;
  border-radius: 9999px;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuggestionItem = styled.li`
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

  /* RTL Support */
  [dir="rtl"] &:hover {
    transform: translateX(-6px);
  }
`;

const SelectorWrapper = styled.div`
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

const SelectorInner = styled.div`
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

const SelectorText = styled.div`
  flex: 1;
  min-width: 0;
`;

const SelectorLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  /* margin-bottom: 4px; */
`;

const SelectorValue = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
`;

const SelectorDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15),
    0 10px 25px rgba(0, 0, 0, 0.08);
  z-index: 10001;
  padding: 24px;
  min-width: 340px;
  max-width: 420px;
  animation: fadeInUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 450px;
  overflow-y: auto;

  /* Custom scrollbar */
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

const SelectorItem = styled.div`
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

const SelectorItemInfo = styled.div`
  flex: 1;
`;

const SelectorItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const SelectorItemDesc = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const SelectorControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SelectorButton = styled.button`
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

const SelectorCount = styled.span`
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

const ChildAgesContainer = styled.div`
  margin-top: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ChildAgeLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ChildAgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
`;

const ChildAgeSelect = styled.select`
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

const ChildAgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChildAgeNumber = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
`;

const GuestsOverlay = styled.div`
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

const MobileGuestsHeader = styled.div`
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

const MobileGuestsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const MobileCloseButton = styled.button`
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

const Select = styled.select`
  border: 2px solid #e5e7eb;
  height: 56px;
  width: 100%;
  color: #1f2937;
  border-radius: 12px;
  padding: 8px 48px 8px 16px;
  font-size: 16px;
  font-weight: 500;
  background: white;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
  }

  &:focus {
    border-color: #3b82f6;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* RTL Support */
  [dir="rtl"] & {
    background-position: left 16px center;
    padding-left: 48px;
    padding-right: 16px;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  @media (min-width: 789px) {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    padding: 0px 36px;
  }
  padding: 14px 36px;
  border-bottom-left-radius: 12px;
  /* border-bottom-right-radius: 12px; */
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

// Wrapper component to handle hotel-specific date input setup
function HotelDateInputWrapper({ checkIn, setCheckIn, checkOut, setCheckOut }) {
  const { actions } = useSearchForm();

  // Set tripType to roundtrip for hotels (always need check-in and check-out)
  useEffect(() => {
    actions.setTripType("roundtrip");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleStartDateChange = (date) => {
    // Convert date to YYYY-MM-DD format if it's a Date object or ISO string
    let formattedDate;
    if (date instanceof Date) {
      formattedDate = date.toISOString().split("T")[0];
    } else if (typeof date === "string") {
      // If it's already in YYYY-MM-DD format, use it as is
      // If it has time component, remove it
      formattedDate = date.includes("T") ? date.split("T")[0] : date;
    } else {
      formattedDate = date;
    }
    setCheckIn(formattedDate);
  };

  const handleEndDateChange = (date) => {
    // Convert date to YYYY-MM-DD format if it's a Date object or ISO string
    let formattedDate;
    if (date instanceof Date) {
      formattedDate = date.toISOString().split("T")[0];
    } else if (typeof date === "string") {
      // If it's already in YYYY-MM-DD format, use it as is
      // If it has time component, remove it
      formattedDate = date.includes("T") ? date.split("T")[0] : date;
    } else {
      formattedDate = date;
    }
    setCheckOut(formattedDate);
  };

  return (
    <DateInput
      startDate={checkIn}
      setStartDate={handleStartDateChange}
      endDate={checkOut}
      setEndDate={handleEndDateChange}
    />
  );
}

// LocalStorage key for hotel search data
const HOTEL_SEARCH_STORAGE_KEY = "flymoon_hotel_search_data";

export default function HotelSearchBar() {
  const { t } = useTranslation();
  const router = useRouter();

  // State management
  const [destination, setDestination] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
  });
  const [childrenAges, setChildrenAges] = useState([]);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [nationality, setNationality] = useState("");
  // Separate loading states: suggestions vs search action
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // Error states
  const [suggestError, setSuggestError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  // Toasts
  const [toasts, setToasts] = useState([]);
  // Mobile states
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");

  const addToast = (message, type = "error", durationMs = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  };

  // Progress for overlay
  const [searchProgress, setSearchProgress] = useState(0);
  useEffect(() => {
    if (isSearching) {
      setSearchProgress(8);
      const id = setInterval(() => {
        setSearchProgress((p) => {
          const next = p + Math.random() * 8;
          return next >= 92 ? 92 : next; // cap while waiting
        });
      }, 450);
      return () => clearInterval(id);
    } else {
      setSearchProgress(0);
    }
  }, [isSearching]);

  // Refs
  const destinationRef = useRef(null);
  const suggestionsRef = useRef(null);
  const guestsRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileDebounceTimerRef = useRef(null);
  const guestsDropdownJustOpenedRef = useRef(false);

  // Detect mount and mobile screen size
  useEffect(() => {
    setIsMounted(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(HOTEL_SEARCH_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);

        // Restore destination and location
        if (parsed.destination) {
          setDestination(parsed.destination);
          setSearchTerm(parsed.destination);
        }

        if (parsed.selectedLocation) {
          setSelectedLocation(parsed.selectedLocation);
        }

        // Restore dates - check-in first, then check-out (check-out depends on check-in)
        if (parsed.checkIn) {
          setCheckIn(parsed.checkIn);

          // Only restore check-out if check-in exists and check-out is valid
          if (parsed.checkOut && parsed.checkOut > parsed.checkIn) {
            setCheckOut(parsed.checkOut);
          }
        }

        // Restore guests
        if (parsed.adults || parsed.children || parsed.rooms) {
          setGuests({
            adults: parsed.adults || 1,
            children: parsed.children || 0,
            rooms: parsed.rooms || 1,
          });
        }

        // Restore children ages
        if (parsed.childrenAges && Array.isArray(parsed.childrenAges)) {
          setChildrenAges(parsed.childrenAges);
        }
      }
    } catch (error) {
      console.error(
        "Error loading hotel search data from localStorage:",
        error
      );
      // Clear corrupted data
      try {
        localStorage.removeItem(HOTEL_SEARCH_STORAGE_KEY);
      } catch (clearError) {
        // Ignore clear errors
      }
    }
  }, []);

  // Save destination, dates, and guests to localStorage whenever they change
  useEffect(() => {
    try {
      const dataToSave = {
        destination: destination || "",
        selectedLocation: selectedLocation || null,
        checkIn: checkIn || "",
        checkOut: checkOut || "",
        adults: guests.adults || 1,
        children: guests.children || 0,
        rooms: guests.rooms || 1,
        childrenAges: childrenAges || [],
      };

      // Only save if there's meaningful data
      if (dataToSave.destination || dataToSave.checkIn || dataToSave.checkOut) {
        localStorage.setItem(
          HOTEL_SEARCH_STORAGE_KEY,
          JSON.stringify(dataToSave)
        );
      }
    } catch (error) {
      console.error("Error saving hotel search data to localStorage:", error);
    }
  }, [destination, selectedLocation, checkIn, checkOut, guests, childrenAges]);

  // Close dropdowns when clicking outside (Desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobile) {
        if (
          destinationRef.current &&
          !destinationRef.current.contains(event.target) &&
          suggestionsRef.current &&
          !suggestionsRef.current.contains(event.target)
        ) {
          setShowSuggestions(false);
        }
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (mobileDebounceTimerRef.current) {
        clearTimeout(mobileDebounceTimerRef.current);
      }
    };
  }, [isMobile]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isMobile && showMobilePopup) {
          closeMobileSuggestions();
        } else if (!isMobile && showSuggestions) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, showMobilePopup, showSuggestions]);

  // Prevent body scroll when bottom sheet is open (mobile)
  useEffect(() => {
    if (showMobilePopup && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobilePopup, isMobile]);

  // Fetch destination suggestions
  const fetchSuggestions = async (term) => {
    if (!term || term.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSuggestLoading(false);
      setSuggestError(null);
      return;
    }

    setIsSuggestLoading(true);
    setSuggestError(null);
    setShowSuggestions(true); // Show loading state
    try {
      const response = await axios.get("/api/hotels/autosuggest", {
        params: { term: term.trim() },
      });

      let suggestionsData = [];

      // Handle the nested response structure: response.data.data.data.locations
      if (response.data.success && response.data.data) {
        const innerData = response.data.data;
        if (innerData.success && innerData.data && innerData.data.locations) {
          suggestionsData = Array.isArray(innerData.data.locations)
            ? innerData.data.locations
            : [];
        } else if (Array.isArray(innerData)) {
          suggestionsData = innerData;
        } else if (innerData.locations && Array.isArray(innerData.locations)) {
          suggestionsData = innerData.locations;
        } else if (Array.isArray(innerData.suggestions)) {
          suggestionsData = innerData.suggestions;
        }
      } else if (response.data.data && response.data.data.locations) {
        suggestionsData = Array.isArray(response.data.data.locations)
          ? response.data.data.locations
          : [];
      } else if (Array.isArray(response.data)) {
        suggestionsData = response.data;
      }

      if (suggestionsData.length > 0) {
        setSuggestions(suggestionsData);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(true); // Keep showing to display "no results" message
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(true); // Show error state with no results message
      const message =
        (error &&
          error.response &&
          error.response.data &&
          error.response.data.message) ||
        (error && error.message) ||
        t("hotels.errors.suggest_failed");
      setSuggestError(message);
      addToast(message, "error");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Handle destination input change with debounce (Desktop)
  const handleDestinationChange = (e) => {
    if (isMobile) return; // Don't handle on mobile

    const value = e.target.value;
    setSearchTerm(value);
    setSearchError(null);
    // Clear selected location when user types
    if (selectedLocation) {
      setSelectedLocation(null);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle mobile input click
  const handleMobileInputClick = () => {
    if (isMobile) {
      setShowMobilePopup(true);
      setMobileSearchValue("");
      setSuggestions([]);
      // Focus on mobile search input after popup opens
      setTimeout(() => {
        if (mobileSearchRef.current) {
          mobileSearchRef.current.focus();
        }
      }, 300);
    }
  };

  // Handle mobile search input change
  const handleMobileSearch = (e) => {
    const value = e.target.value;
    setMobileSearchValue(value);
    setSearchError(null);
    // Clear selected location when user types
    if (selectedLocation) {
      setSelectedLocation(null);
    }

    if (mobileDebounceTimerRef.current) {
      clearTimeout(mobileDebounceTimerRef.current);
    }

    mobileDebounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle overlay click (mobile)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setSuggestions([]);
      setShowMobilePopup(false);
      setMobileSearchValue("");
    }
  };

  // Close mobile suggestions
  const closeMobileSuggestions = () => {
    setSuggestions([]);
    setShowMobilePopup(false);
    setMobileSearchValue("");
  };

  // Highlight matched query inside suggestion text
  const renderHighlighted = (text, term) => {
    if (!term) return text;
    try {
      const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = String(text).split(new RegExp(`(${safe})`, "ig"));
      return parts.map((part, idx) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <span
            key={idx}
            style={{
              background: "#fef3c7",
              color: "#92400e",
              padding: "0 2px",
              borderRadius: "4px",
            }}
          >
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        )
      );
    } catch {
      return text;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    // Use fullName if available, otherwise fall back to name
    const displayText =
      suggestion.fullName ||
      suggestion.name ||
      suggestion.label ||
      suggestion.city ||
      suggestion.destination ||
      String(suggestion);
    setDestination(displayText);
    setSearchTerm(displayText);
    // Save the full location object
    setSelectedLocation(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestError(null);
    setSearchError(null);

    // Close mobile popup if open
    if (isMobile) {
      setShowMobilePopup(false);
      setMobileSearchValue("");
    }
  };

  // Handle guest updates
  const updateGuests = (type, operation) => {
    setGuests((prev) => {
      const newValue =
        operation === "increment" ? prev[type] + 1 : prev[type] - 1;
      const finalValue = Math.max(type === "adults" ? 1 : 0, newValue);
      
      // Handle children ages when children count changes
      if (type === "children") {
        if (operation === "increment") {
          // Add a new age slot (default to 1)
          setChildrenAges((prevAges) => [...prevAges, 1]);
        } else if (operation === "decrement" && finalValue < prev[type]) {
          // Remove the last age slot
          setChildrenAges((prevAges) => prevAges.slice(0, -1));
        }
      }
      
      return {
        ...prev,
        [type]: finalValue,
      };
    });
  };

  // Handle child age update
  const updateChildAge = (index, age) => {
    setChildrenAges((prev) => {
      const newAges = [...prev];
      newAges[index] = parseInt(age, 10);
      return newAges;
    });
  };

  const totalGuests = guests.adults + guests.children;

  // Handle search
  const handleSearch = async () => {
    setSearchError(null);
    if (!selectedLocation) {
      const msg = t("hotels.errors.select_destination");
      setSearchError(msg);
      addToast(msg, "error");
      return;
    }

    if (!checkIn || !checkOut) {
      const msg = t("hotels.errors.select_dates");
      setSearchError(msg);
      addToast(msg, "error");
      return;
    }

    const searchData = {
      destination,
      location: selectedLocation, // Full location object
      checkIn,
      checkOut,
      guests,
      nationality,
    };

    // Format dates from YYYY-MM-DD to MM/DD/YYYY
    const formatDateToMMDDYYYY = (dateString) => {
      if (!dateString) return "";
      const [year, month, day] = dateString.split("-");
      return `${month}/${day}/${year}`;
    };

    const payload = {
      geoCode: { ...selectedLocation.coordinates },
      locationId: selectedLocation.id,
      currency: "SAR",
      culture: "ar-SA",
      checkIn: formatDateToMMDDYYYY(checkIn),
      checkOut: formatDateToMMDDYYYY(checkOut),
      rooms: (() => {
        // Build rooms array based on guest selection
        // Distribute adults and children across rooms
        const roomsArray = [];
        const adultsPerRoom = Math.floor(guests.adults / guests.rooms);
        const childrenPerRoom = Math.floor(guests.children / guests.rooms);
        const remainingAdults = guests.adults % guests.rooms;
        const remainingChildren = guests.children % guests.rooms;

        let childAgeIndex = 0;
        for (let i = 0; i < guests.rooms; i++) {
          const roomAdults = adultsPerRoom + (i === 0 ? remainingAdults : 0);
          const roomChildren =
            childrenPerRoom + (i === 0 ? remainingChildren : 0);

          // Assign child ages to this room
          const roomChildAges = [];
          for (let j = 0; j < roomChildren; j++) {
            if (childAgeIndex < childrenAges.length) {
              roomChildAges.push(String(childrenAges[childAgeIndex]));
              childAgeIndex++;
            } else {
              roomChildAges.push("1"); // Default to 1 if age not specified
            }
          }

          roomsArray.push({
            adults: String(roomAdults),
            children: String(roomChildren),
            childAges: roomChildAges,
          });
        }
        return roomsArray;
      })(),
      agentCode: "",
      destinationCountryCode: (() => {
        // Extract country code from selected location
        if (selectedLocation) {
          if (selectedLocation.countryCode) {
            return selectedLocation.countryCode;
          } else if (selectedLocation.country?.code) {
            return selectedLocation.country.code;
          } else if (
            selectedLocation.country &&
            typeof selectedLocation.country === "string"
          ) {
            // If country is a string, try to extract code (might need mapping)
            // For now, use the string if it's a valid 2-letter code
            const countryStr = selectedLocation.country.trim().toUpperCase();
            if (countryStr.length === 2) {
              return countryStr;
            }
          }
        }
        return "AE"; // Default fallback
      })(),
      nationality: nationality || "SR",
      countryOfResidence: nationality || "SR",
      channelId: "b2bIndiaDeals",
      affiliateRegion: "B2B_India",
      segmentId: "TigerSPL",
      companyId: "1",
      gstPercentage: 0,
      tdsPercentage: 0,
    };

    console.log("Search:", searchData);
    console.log("payload", payload);
    try {
      setIsSearching(true);
      const response = await axios.post("/api/hotels/search/init", payload);

      if (response.data.success) {
        console.log("Search initialized successfully:", response.data.data);

        // Extract searchId from response
        const searchId =
          response.data.data?.searchId ||
          response.data.data?.data?.searchId ||
          response.data.data?.search_id;

        if (searchId) {
          // Redirect to results page with searchId
          router.push(`/hotels/results?searchId=${searchId}`);
        } else {
          const msg = t("hotels.errors.search_id_missing");
          setSearchError(msg);
          addToast(msg, "error");
        }
      } else {
        const msg =
          (response && response.data && response.data.error) ||
          t("hotels.errors.search_failed");
        setSearchError(msg);
        addToast(msg, "error");
      }
    } catch (error) {
      console.error("Error initializing search:", error);
      const message =
        (error &&
          error.response &&
          error.response.data &&
          error.response.data.message) ||
        (error && error.message) ||
        t("hotels.errors.search_exception");
      setSearchError(message);
      addToast(message, "error");
    } finally {
      setIsSearching(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <SearchFormContainer>
      <FormGrid>
        {/* Destination */}
        <InputGroup className="border-l border-l-gray-200 pr-4 justify-center relative">
          <StyledInput ref={destinationRef}>
            <SelectorLabel>
              {t("hotels.results.search_bar.destination")}
            </SelectorLabel>
            <InputWrapper className="mt-2">
              <LuMapPin />
              <Input
                type="text"
                value={searchTerm}
                onChange={isMobile ? undefined : handleDestinationChange}
                onClick={isMobile ? handleMobileInputClick : undefined}
                onFocus={
                  isMobile
                    ? handleMobileInputClick
                    : (e) => {
                        e.target.select();
                        if (suggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }
                }
                readOnly={isMobile}
                placeholder={t("hotels.results.search_bar.destination")}
                style={isMobile ? { cursor: "pointer" } : {}}
              />
              {/* <RightControls className="">
                {isSuggestLoading && <Spinner aria-label="loading" />}
                {!!searchTerm && (
                  <ClearButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchTerm("");
                      setDestination("");
                      setSelectedLocation(null);
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    aria-label="clear"
                    title={t("common.clear") || "Clear"}
                  >
                    <LuX size={16} />
                  </ClearButton>
                )}
              </RightControls> */}
            </InputWrapper>

            {/* Desktop Suggestions */}
            {showSuggestions && !isMobile && (
              <Suggestions ref={suggestionsRef}>
                {isSuggestLoading && (
                  <>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <SkeletonItem key={`skeleton-${idx}`}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <SkeletonLine $w="60%" />
                          <SkeletonLine $w="40%" />
                        </div>
                      </SkeletonItem>
                    ))}
                  </>
                )}

                {!isSuggestLoading &&
                  suggestions.length > 0 &&
                  suggestions.map((suggestion, index) => {
                    const displayText =
                      suggestion.name || suggestion.label || String(suggestion);

                    const locationParts = [];
                    if (suggestion.type === "hotel" && suggestion.city) {
                      locationParts.push(suggestion.city);
                    }
                    if (suggestion.state) {
                      locationParts.push(suggestion.state);
                    }
                    if (suggestion.country) {
                      locationParts.push(suggestion.country);
                    }
                    const secondaryText =
                      locationParts.length > 0
                        ? locationParts.join(", ")
                        : suggestion.fullName;

                    return (
                      <SuggestionItem
                        key={suggestion.id || index}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "#1f2937",
                                marginBottom: "4px",
                              }}
                            >
                              {renderHighlighted(displayText, searchTerm)}
                            </div>
                            {secondaryText && (
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#6b7280",
                                }}
                              >
                                {renderHighlighted(secondaryText, searchTerm)}
                              </div>
                            )}
                          </div>
                          {suggestion.type && (
                            <span
                              style={{
                                fontSize: "11px",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                background: "#dbeafe",
                                color: "#1e40af",
                                fontWeight: "600",
                                textTransform: "capitalize",
                              }}
                            >
                              {suggestion.type}
                            </span>
                          )}
                        </div>
                      </SuggestionItem>
                    );
                  })}

                {!isSuggestLoading && suggestions.length === 0 && (
                  <SuggestionItem style={{ cursor: "default" }}>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                      {t("common.no_results")}
                    </div>
                  </SuggestionItem>
                )}
              </Suggestions>
            )}
          </StyledInput>
        </InputGroup>

        {/* Check In & Check Out - DateInput */}
        <InputGroup>
          <SearchFormProvider onSubmit={() => {}}>
            <HotelDateInputWrapper
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
            />
          </SearchFormProvider>
        </InputGroup>

        {/* Guests & Nationality - Mobile Layout */}
        <div className="flex flex-col gap-0 px-0 lg:hidden">
          <InputGroup className="lg:hidden" data-no-border="true">
            <SelectorWrapper
              ref={guestsRef}
              onClick={(e) => {
                e.stopPropagation();
                if (!showGuestsDropdown) {
                  guestsDropdownJustOpenedRef.current = true;
                  setTimeout(() => {
                    guestsDropdownJustOpenedRef.current = false;
                  }, 100);
                }
                setShowGuestsDropdown(!showGuestsDropdown);
              }}
              $isOpen={showGuestsDropdown}
            >
              <SelectorLabel>
                {t("hotels.results.search_bar.rooms_guests")}
              </SelectorLabel>
              <SelectorInner $isOpen={showGuestsDropdown}>
                <LuUsers />
                <SelectorText>
                  <SelectorValue>
                    {totalGuests} {t("hotels.guests.guests")}, {guests.rooms}{" "}
                    {guests.rooms === 1
                      ? t("hotels.guests.room")
                      : t("hotels.guests.rooms")}
                  </SelectorValue>
                </SelectorText>
              </SelectorInner>
            </SelectorWrapper>
            {isMounted && isMobile && showGuestsDropdown && createPortal(
              <>
                <GuestsOverlay 
                  $show={showGuestsDropdown} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!guestsDropdownJustOpenedRef.current) {
                      setShowGuestsDropdown(false);
                    }
                  }}
                />
                <SelectorDropdown onClick={(e) => e.stopPropagation()}>
                  <MobileGuestsHeader>
                    <MobileGuestsTitle>
                      {t("hotels.results.search_bar.rooms_guests")}
                    </MobileGuestsTitle>
                    <MobileCloseButton onClick={(e) => {
                      e.stopPropagation();
                      guestsDropdownJustOpenedRef.current = false;
                      setShowGuestsDropdown(false);
                    }}>
                      <LuX />
                    </MobileCloseButton>
                  </MobileGuestsHeader>
                  <SelectorItem>
                    <SelectorItemInfo>
                      <SelectorItemTitle>
                        {t("hotels.guests.adults")}
                      </SelectorItemTitle>
                      <SelectorItemDesc>
                        {t("hotels.guests.adults_desc")}
                      </SelectorItemDesc>
                    </SelectorItemInfo>
                    <SelectorControls>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("adults", "decrement");
                        }}
                        disabled={guests.adults <= 1}
                      >
                        −
                      </SelectorButton>
                      <SelectorCount>{guests.adults}</SelectorCount>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("adults", "increment");
                        }}
                      >
                        +
                      </SelectorButton>
                    </SelectorControls>
                  </SelectorItem>

                  <SelectorItem>
                    <SelectorItemInfo>
                      <SelectorItemTitle>
                        {t("hotels.guests.children")}
                      </SelectorItemTitle>
                      <SelectorItemDesc>
                        {t("hotels.guests.children_desc")}
                      </SelectorItemDesc>
                    </SelectorItemInfo>
                    <SelectorControls>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("children", "decrement");
                        }}
                        disabled={guests.children <= 0}
                      >
                        −
                      </SelectorButton>
                      <SelectorCount>{guests.children}</SelectorCount>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("children", "increment");
                        }}
                      >
                        +
                      </SelectorButton>
                    </SelectorControls>
                  </SelectorItem>

                  {guests.children > 0 && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ChildAgesContainer>
                        <ChildAgeLabel>
                          {t("hotels.guests.children_ages") || "Children Ages"}
                        </ChildAgeLabel>
                        <ChildAgeGrid>
                          {Array.from({ length: guests.children }).map((_, index) => (
                            <ChildAgeWrapper key={index}>
                              <ChildAgeNumber>
                                {t("hotels.guests.child") || "Child"} {index + 1}
                              </ChildAgeNumber>
                              <ChildAgeSelect
                                value={childrenAges[index] || 1}
                                onChange={(e) => updateChildAge(index, e.target.value)}
                              >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((age) => (
                                  <option key={age} value={age}>
                                    {age} {age === 1 ? t("hotels.guests.year") || "yr" : t("hotels.guests.years") || "yrs"}
                                  </option>
                                ))}
                              </ChildAgeSelect>
                            </ChildAgeWrapper>
                          ))}
                        </ChildAgeGrid>
                      </ChildAgesContainer>
                    </div>
                  )}

                  <SelectorItem>
                    <SelectorItemInfo>
                      <SelectorItemTitle>
                        {t("hotels.guests.rooms")}
                      </SelectorItemTitle>
                      <SelectorItemDesc>
                        {t("hotels.guests.rooms_desc")}
                      </SelectorItemDesc>
                    </SelectorItemInfo>
                    <SelectorControls>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("rooms", "decrement");
                        }}
                        disabled={guests.rooms <= 1}
                      >
                        −
                      </SelectorButton>
                      <SelectorCount>{guests.rooms}</SelectorCount>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("rooms", "increment");
                        }}
                      >
                        +
                      </SelectorButton>
                    </SelectorControls>
                  </SelectorItem>
                </SelectorDropdown>
              </>,
              document.body
            )}
            {!isMobile && showGuestsDropdown && (
              <SelectorDropdown>
                <SelectorItem>
                  <SelectorItemInfo>
                    <SelectorItemTitle>
                      {t("hotels.guests.adults")}
                    </SelectorItemTitle>
                    <SelectorItemDesc>
                      {t("hotels.guests.adults_desc")}
                    </SelectorItemDesc>
                  </SelectorItemInfo>
                  <SelectorControls>
                    <SelectorButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGuests("adults", "decrement");
                      }}
                      disabled={guests.adults <= 1}
                    >
                      −
                    </SelectorButton>
                    <SelectorCount>{guests.adults}</SelectorCount>
                    <SelectorButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGuests("adults", "increment");
                      }}
                    >
                      +
                    </SelectorButton>
                  </SelectorControls>
                </SelectorItem>

                <SelectorItem>
                  <SelectorItemInfo>
                    <SelectorItemTitle>
                      {t("hotels.guests.children")}
                    </SelectorItemTitle>
                    <SelectorItemDesc>
                      {t("hotels.guests.children_desc")}
                    </SelectorItemDesc>
                  </SelectorItemInfo>
                  <SelectorControls>
                    <SelectorButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGuests("children", "decrement");
                      }}
                      disabled={guests.children <= 0}
                    >
                      −
                    </SelectorButton>
                    <SelectorCount>{guests.children}</SelectorCount>
                    <SelectorButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGuests("children", "increment");
                      }}
                    >
                      +
                    </SelectorButton>
                  </SelectorControls>
                </SelectorItem>

                {guests.children > 0 && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <ChildAgesContainer>
                      <ChildAgeLabel>
                        {t("hotels.guests.children_ages") || "Children Ages"}
                      </ChildAgeLabel>
                      <ChildAgeGrid>
                        {Array.from({ length: guests.children }).map((_, index) => (
                          <ChildAgeWrapper key={index}>
                            <ChildAgeNumber>
                              {t("hotels.guests.child") || "Child"} {index + 1}
                            </ChildAgeNumber>
                            <ChildAgeSelect
                              value={childrenAges[index] || 1}
                              onChange={(e) => updateChildAge(index, e.target.value)}
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((age) => (
                                <option key={age} value={age}>
                                  {age} {age === 1 ? t("hotels.guests.year") || "yr" : t("hotels.guests.years") || "yrs"}
                                </option>
                              ))}
                            </ChildAgeSelect>
                          </ChildAgeWrapper>
                        ))}
                      </ChildAgeGrid>
                    </ChildAgesContainer>
                  </div>
                )}

                <SelectorItem>
                  <SelectorItemInfo>
                    <SelectorItemTitle>
                      {t("hotels.guests.rooms")}
                    </SelectorItemTitle>
                    <SelectorItemDesc>
                      {t("hotels.guests.rooms_desc")}
                    </SelectorItemDesc>
                  </SelectorItemInfo>
                  <SelectorControls>
                    <SelectorButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGuests("rooms", "decrement");
                      }}
                      disabled={guests.rooms <= 1}
                    >
                      −
                    </SelectorButton>
                    <SelectorCount>{guests.rooms}</SelectorCount>
                    <SelectorButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGuests("rooms", "increment");
                      }}
                    >
                      +
                    </SelectorButton>
                  </SelectorControls>
                </SelectorItem>
              </SelectorDropdown>
            )}
          </InputGroup>
        </div>

        {/* Desktop: Guests & Nationality */}
        <div className="hidden lg:flex lg:flex-col gap-0 border-r border-r-gray-200 pr-4 justify-center">
          <InputGroup className="relative ">
            <SelectorWrapper
              ref={guestsRef}
              onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
              $isOpen={showGuestsDropdown}
            >
              <SelectorLabel className=" top-0 left-0">
                {t("hotels.results.search_bar.rooms_guests")}
              </SelectorLabel>
              <SelectorInner $isOpen={showGuestsDropdown}>
                <LuUsers />
                <SelectorText>
                  <SelectorValue>
                    {totalGuests} {t("hotels.guests.guests")}, {guests.rooms}{" "}
                    {guests.rooms === 1
                      ? t("hotels.guests.room")
                      : t("hotels.guests.rooms")}
                  </SelectorValue>
                </SelectorText>
              </SelectorInner>
              {showGuestsDropdown && (
                <SelectorDropdown>
                  <SelectorItem>
                    <SelectorItemInfo>
                      <SelectorItemTitle>
                        {t("hotels.guests.adults")}
                      </SelectorItemTitle>
                      <SelectorItemDesc>
                        {t("hotels.guests.adults_desc")}
                      </SelectorItemDesc>
                    </SelectorItemInfo>
                    <SelectorControls>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("adults", "decrement");
                        }}
                        disabled={guests.adults <= 1}
                      >
                        −
                      </SelectorButton>
                      <SelectorCount>{guests.adults}</SelectorCount>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("adults", "increment");
                        }}
                      >
                        +
                      </SelectorButton>
                    </SelectorControls>
                  </SelectorItem>

                  <SelectorItem>
                    <SelectorItemInfo>
                      <SelectorItemTitle>
                        {t("hotels.guests.children")}
                      </SelectorItemTitle>
                      <SelectorItemDesc>
                        {t("hotels.guests.children_desc")}
                      </SelectorItemDesc>
                    </SelectorItemInfo>
                    <SelectorControls>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("children", "decrement");
                        }}
                        disabled={guests.children <= 0}
                      >
                        −
                      </SelectorButton>
                      <SelectorCount>{guests.children}</SelectorCount>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("children", "increment");
                        }}
                      >
                        +
                      </SelectorButton>
                    </SelectorControls>
                  </SelectorItem>

                  {guests.children > 0 && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ChildAgesContainer>
                        <ChildAgeLabel>
                          {t("hotels.guests.children_ages") || "Children Ages"}
                        </ChildAgeLabel>
                        <ChildAgeGrid>
                          {Array.from({ length: guests.children }).map((_, index) => (
                          <ChildAgeWrapper key={index}>
                            <ChildAgeNumber>
                              {t("hotels.guests.child") || "Child"} {index + 1}
                            </ChildAgeNumber>
                            <ChildAgeSelect
                              value={childrenAges[index] || 1}
                              onChange={(e) => updateChildAge(index, e.target.value)}
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((age) => (
                                <option key={age} value={age}>
                                  {age} {age === 1 ? t("hotels.guests.year") || "yr" : t("hotels.guests.years") || "yrs"}
                                </option>
                              ))}
                            </ChildAgeSelect>
                          </ChildAgeWrapper>
                          ))}
                        </ChildAgeGrid>
                      </ChildAgesContainer>
                    </div>
                  )}

                  <SelectorItem>
                    <SelectorItemInfo>
                      <SelectorItemTitle>
                        {t("hotels.guests.rooms")}
                      </SelectorItemTitle>
                      <SelectorItemDesc>
                        {t("hotels.guests.rooms_desc")}
                      </SelectorItemDesc>
                    </SelectorItemInfo>
                    <SelectorControls>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("rooms", "decrement");
                        }}
                        disabled={guests.rooms <= 1}
                      >
                        −
                      </SelectorButton>
                      <SelectorCount>{guests.rooms}</SelectorCount>
                      <SelectorButton
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests("rooms", "increment");
                        }}
                      >
                        +
                      </SelectorButton>
                    </SelectorControls>
                  </SelectorItem>
                </SelectorDropdown>
              )}
            </SelectorWrapper>
          </InputGroup>
          {/* 
          <InputGroup style={{ paddingTop: "16px" }}>
            <SelectorLabel>
              {t("hotels.details.booking_page.guest_details.nationality")}
            </SelectorLabel>
            <div style={{ position: "relative", width: "100%" }}>
              <LuGlobe
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#6b7280",
                  pointerEvents: "none",
                  zIndex: 1,
                  transition: "color 0.2s ease",
                }}
              />
              <Select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                style={{ paddingLeft: "48px" }}
                onFocus={(e) => {
                  const globeIcon = e.target.previousElementSibling;
                  if (globeIcon) {
                    globeIcon.style.color = "#3b82f6";
                  }
                }}
                onBlur={(e) => {
                  const globeIcon = e.target.previousElementSibling;
                  if (globeIcon) {
                    globeIcon.style.color = "#6b7280";
                  }
                }}
              >
                <option value="">
                  {t("hotels.details.booking_page.guest_details.select_nationality")}
                </option>
                <option value="SA">{t("countries.saudi_arabia")}</option>
                <option value="AE">{t("countries.uae")}</option>
                <option value="KW">{t("countries.kuwait")}</option>
                <option value="QA">{t("countries.qatar")}</option>
                <option value="BH">{t("countries.bahrain")}</option>
                <option value="OM">{t("countries.oman")}</option>
              </Select>
            </div>
          </InputGroup> */}
        </div>

        {/* Search Button */}
        <div className="flex justify-end h-full items-center">
          <SearchButton onClick={handleSearch} disabled={isSearching}>
            <LuSearch />
            {t("hotels.results.search_bar.search")}
          </SearchButton>
        </div>
        {/* Errors are surfaced via toasts */}
      </FormGrid>

      {/* Mobile Bottom Sheet via Portal */}
      {isMounted &&
        isMobile &&
        showMobilePopup &&
        createPortal(
          <>
            <BottomSheetOverlay
              $show={showMobilePopup}
              onClick={handleOverlayClick}
            />
            <BottomSheet $show={showMobilePopup}>
              <BottomSheetDragIndicator />
              <BottomSheetHeader>
                <BottomSheetTitle>
                  {t("hotels.results.search_bar.destination")}
                </BottomSheetTitle>
                <CloseButton onClick={closeMobileSuggestions}>
                  <LuX />
                </CloseButton>
              </BottomSheetHeader>
              <BottomSheetContent>
                <MobileSearchInputWrapper>
                  <MobileSearchIcon>
                    <LuMapPin />
                  </MobileSearchIcon>
                  <MobileSearchInput
                    ref={mobileSearchRef}
                    type="text"
                    placeholder={t("hotels.results.search_bar.destination")}
                    value={mobileSearchValue}
                    onChange={handleMobileSearch}
                    autoComplete="off"
                  />
                </MobileSearchInputWrapper>

                {isSuggestLoading && (
                  <div style={{ padding: "12px 0" }}>
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <MobileSuggestionItem key={`mobile-skeleton-${idx}`}>
                        <MobileSuggestionContent>
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "12px",
                              background: "#f1f5f9",
                              flexShrink: 0,
                            }}
                          >
                            <SkeletonLine
                              $w="22px"
                              style={{
                                height: "22px",
                                margin: "13px auto",
                                borderRadius: "4px",
                              }}
                            />
                          </div>
                          <MobileSuggestionText>
                            <SkeletonLine $w="70%" />
                            <SkeletonLine $w="50%" />
                          </MobileSuggestionText>
                        </MobileSuggestionContent>
                      </MobileSuggestionItem>
                    ))}
                  </div>
                )}

                {!isSuggestLoading && suggestions.length > 0 && (
                  <MobileSuggestionsList>
                    {suggestions.map((suggestion, index) => {
                      const displayText =
                        suggestion.name ||
                        suggestion.label ||
                        String(suggestion);

                      const locationParts = [];
                      if (suggestion.type === "hotel" && suggestion.city) {
                        locationParts.push(suggestion.city);
                      }
                      if (suggestion.state) {
                        locationParts.push(suggestion.state);
                      }
                      if (suggestion.country) {
                        locationParts.push(suggestion.country);
                      }
                      const secondaryText =
                        locationParts.length > 0
                          ? locationParts.join(", ")
                          : suggestion.fullName;

                      // Determine icon based on type
                      const getIcon = () => {
                        if (suggestion.type === "hotel") {
                          return <LuBed />;
                        }
                        return <LuMapPin />;
                      };

                      return (
                        <MobileSuggestionItem
                          key={suggestion.id || index}
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          <MobileSuggestionContent>
                            <MobileSuggestionIcon>
                              {getIcon()}
                            </MobileSuggestionIcon>
                            <MobileSuggestionText>
                              <MobileSuggestionTitle>
                                {renderHighlighted(
                                  displayText,
                                  mobileSearchValue
                                )}
                              </MobileSuggestionTitle>
                              {secondaryText && (
                                <MobileSuggestionSubtitle>
                                  {renderHighlighted(
                                    secondaryText,
                                    mobileSearchValue
                                  )}
                                </MobileSuggestionSubtitle>
                              )}
                            </MobileSuggestionText>
                            {suggestion.type && (
                              <MobileSuggestionBadge>
                                {suggestion.type}
                              </MobileSuggestionBadge>
                            )}
                          </MobileSuggestionContent>
                        </MobileSuggestionItem>
                      );
                    })}
                  </MobileSuggestionsList>
                )}

                {!isSuggestLoading &&
                  suggestions.length === 0 &&
                  mobileSearchValue.trim() && (
                    <MobileNoResults>
                      {t("common.no_results_for", {
                        query: mobileSearchValue,
                        defaultValue: 'No results found for "{{query}}"',
                      })}
                    </MobileNoResults>
                  )}

                {!isSuggestLoading &&
                  suggestions.length === 0 &&
                  !mobileSearchValue.trim() && (
                    <MobileNoResults>
                      {t("flights.search_form.start_typing") ||
                        "Start typing to search..."}
                    </MobileNoResults>
                  )}
              </BottomSheetContent>
            </BottomSheet>
          </>,
          document.body
        )}

      {isSearching && (
        <OverlayBackdrop role="dialog" aria-label="Searching hotels">
          <OverlayCard>
            <OverlayIcon>
              <LuSearch />
            </OverlayIcon>
            <Dots>
              <span />
              <span />
              <span />
            </Dots>
            <OverlayTitle>
              {t("hotels.search_form.searching_title")}
            </OverlayTitle>
            <OverlaySubtitle>
              {t("hotels.search_form.searching_subtitle")}
            </OverlaySubtitle>
            <OverlayNote>{t("hotels.search_form.searching_note")}</OverlayNote>
            <OverlayRow>
              <OverlayLabel>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <LuMapPin /> {t("hotels.results.search_bar.destination")}
                </span>
              </OverlayLabel>
              <OverlayValue>
                {destination ||
                  (selectedLocation &&
                    (selectedLocation.fullName || selectedLocation.name)) ||
                  "—"}
              </OverlayValue>
            </OverlayRow>
            <OverlayRow>
              <OverlayLabel>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <LuCalendar /> {t("hotels.results.search_bar.check_in")}
                </span>
              </OverlayLabel>
              <OverlayValue>{formatDate(checkIn) || "—"}</OverlayValue>
            </OverlayRow>
            <OverlayRow>
              <OverlayLabel>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <LuCalendar /> {t("hotels.results.search_bar.check_out")}
                </span>
              </OverlayLabel>
              <OverlayValue>{formatDate(checkOut) || "—"}</OverlayValue>
            </OverlayRow>
            <OverlayRow>
              <OverlayLabel>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <LuUsers /> {t("hotels.results.search_bar.rooms_guests")}
                </span>
              </OverlayLabel>
              <OverlayValue>
                {guests.adults + guests.children} {t("hotels.guests.guests")}
                {", "}
                {guests.rooms}{" "}
                {guests.rooms === 1
                  ? t("hotels.guests.room")
                  : t("hotels.guests.rooms")}
              </OverlayValue>
            </OverlayRow>
            <ProgressTrack>
              <ProgressBar $value={Math.round(searchProgress)} />
            </ProgressTrack>
          </OverlayCard>
        </OverlayBackdrop>
      )}
      {!!toasts.length && (
        <ToastContainer>
          {toasts.map((t) => (
            <ToastItem key={t.id} $type={t.type}>
              {t.message}
            </ToastItem>
          ))}
        </ToastContainer>
      )}
    </SearchFormContainer>
  );
}
