import styled from "styled-components";

export const OverlayBackdrop = styled.div`
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
  padding: 16px;
  animation: backdropFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background-size: 300% 300%;
  animation: gradientShift 10s ease infinite,
    backdropFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 640px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }

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
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  &::before {
    content: "🏨 ✈️ 🌍 🗺️ 🏖️ 🌟 🧳 🏛️";
    position: absolute;
    inset: 0;
    font-size: 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    place-items: center;
    opacity: 0.15;
    animation: floatIcons 30s ease-in-out infinite;
    pointer-events: none;

    @media (min-width: 640px) {
      font-size: 32px;
    }

    @media (min-width: 1024px) {
      font-size: 40px;
    }
  }

  @keyframes floatIcons {
    0%,
    100% {
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

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
        circle at 15% 25%,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 25%
      ),
      radial-gradient(
        circle at 85% 75%,
        rgba(255, 255, 255, 0.15) 0%,
        transparent 30%
      ),
      radial-gradient(
        circle at 50% 50%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 25% 80%,
        rgba(147, 197, 253, 0.2) 0%,
        transparent 25%
      ),
      radial-gradient(
        circle at 75% 20%,
        rgba(191, 219, 254, 0.15) 0%,
        transparent 30%
      );
    animation: orbitOrbs 20s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes orbitOrbs {
    0%,
    100% {
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

export const OverlayCard = styled.div`
  width: 100%;
  max-width: 640px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(1.8);
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.3), 0 25px 50px rgba(0, 0, 0, 0.2),
    0 10px 20px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 1),
    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
  padding: 24px 20px;
  position: relative;
  z-index: 1;
  animation: cardSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  margin: auto;

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
    0%,
    100% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    50% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  /* Mobile (up to 480px) */
  @media (max-width: 480px) {
    padding: 20px 16px;
    border-radius: 12px;
    width: calc(100% - 8px);
    max-width: 100%;
  }

  /* Small tablets (481px - 640px) */
  @media (min-width: 481px) and (max-width: 640px) {
    padding: 28px 24px;
    border-radius: 20px;
    width: calc(100% - 16px);
  }

  /* Tablets (641px - 768px) */
  @media (min-width: 641px) and (max-width: 768px) {
    padding: 32px 28px;
    border-radius: 24px;
    width: 90%;
  }

  /* Large tablets (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 40px 32px;
    border-radius: 26px;
    width: 85%;
  }

  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    padding: 48px 36px;
    border-radius: 28px;
    width: 92%;
  }
`;

export const OverlayIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 70%, #1d4ed8 100%);
  color: white;
  font-size: 28px;
  margin: 0 auto 16px auto;
  position: relative;
  box-shadow: 0 20px 50px rgba(59, 130, 246, 0.5),
    0 10px 25px rgba(59, 130, 246, 0.4), 0 5px 12px rgba(59, 130, 246, 0.3),
    inset 0 -3px 10px rgba(0, 0, 0, 0.15),
    inset 0 3px 10px rgba(255, 255, 255, 0.2);
  animation: iconFloat 3s ease-in-out infinite;

  @media (min-width: 481px) {
    width: 72px;
    height: 72px;
    font-size: 32px;
    margin-bottom: 18px;
  }

  @media (min-width: 641px) {
    width: 80px;
    height: 80px;
    font-size: 36px;
    margin-bottom: 20px;
  }

  @media (min-width: 1025px) {
    width: 96px;
    height: 96px;
    font-size: 44px;
    margin-bottom: 20px;
  }

  @keyframes iconFloat {
    0%,
    100% {
      transform: translateY(0) scale(1);
      box-shadow: 0 20px 50px rgba(59, 130, 246, 0.5),
        0 10px 25px rgba(59, 130, 246, 0.4);
    }
    50% {
      transform: translateY(-10px) scale(1.05);
      box-shadow: 0 30px 60px rgba(59, 130, 246, 0.6),
        0 15px 30px rgba(59, 130, 246, 0.5);
    }
  }

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

  svg {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
    animation: searchPulse 2s ease-in-out infinite;
  }

  @keyframes searchPulse {
    0%,
    100% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.1) rotate(5deg);
    }
  }
`;

export const OverlayTitle = styled.h3`
  text-align: center;
  font-size: 20px;
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
  line-height: 1.3;

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

  @media (min-width: 481px) {
    font-size: 22px;
  }

  @media (min-width: 641px) {
    font-size: 24px;
  }

  @media (min-width: 1025px) {
    font-size: 26px;
  }
`;

export const OverlaySubtitle = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 12px 0;
  position: relative;
  z-index: 1;
  animation: subtitleSlide 0.6s ease-out 0.4s both;
  line-height: 1.5;

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

  @media (min-width: 481px) {
    font-size: 14px;
  }

  @media (min-width: 641px) {
    font-size: 15px;
  }

  @media (min-width: 1025px) {
    font-size: 16px;
  }
`;

export const OverlayNote = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 500;
  margin: 0 0 16px 0;
  position: relative;
  z-index: 1;
  animation: noteSlide 0.6s ease-out 0.5s both;
  line-height: 1.4;

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

  @media (min-width: 481px) {
    font-size: 12px;
    margin-bottom: 18px;
  }

  @media (min-width: 641px) {
    font-size: 13px;
    margin-bottom: 20px;
  }

  @media (min-width: 1025px) {
    font-size: 13px;
    margin-bottom: 20px;
  }
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 8px 0 16px 0;
  position: relative;
  z-index: 1;

  span {
    width: 8px;
    height: 8px;
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
    0%,
    60%,
    100% {
      transform: translateY(0) scale(1);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-12px) scale(1.2);
      opacity: 1;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
    }
  }

  @media (min-width: 481px) {
    gap: 7px;
    margin: 10px 0 18px 0;

    span {
      width: 9px;
      height: 9px;
    }
  }

  @media (min-width: 641px) {
    gap: 8px;
    margin: 10px 0 20px 0;

    span {
      width: 10px;
      height: 10px;
    }
  }
`;

export const ProgressTrack = styled.div`
  width: 90%;
  height: 8px;
  border-radius: 10px;
  background: rgba(226, 232, 240, 0.8);
  margin: 12px auto 0 auto;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1),
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

  @media (min-width: 481px) {
    width: 88%;
    height: 9px;
    margin: 14px auto 0 auto;
  }

  @media (min-width: 641px) {
    width: 85%;
    height: 10px;
    margin: 16px auto 0 auto;
  }
`;

export const ProgressBar = styled.div`
  height: 100%;
  width: ${(p) => `${p.$value || 0}%`};
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
  border-radius: 12px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);

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
`;

export const OverlayRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8) 0%,
    rgba(241, 245, 249, 0.8) 100%
  );
  border: 1px solid rgba(226, 232, 240, 0.6);
  margin-bottom: 8px;
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
    background: linear-gradient(
      135deg,
      rgba(239, 246, 255, 0.9) 0%,
      rgba(219, 234, 254, 0.9) 100%
    );
    border-color: rgba(147, 197, 253, 0.6);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  &:last-child {
    margin-bottom: 0;
  }

  /* Small tablets and up */
  @media (min-width: 481px) {
    padding: 14px 16px;
    gap: 10px;
    margin-bottom: 10px;
    border-radius: 12px;
  }

  /* Tablets and up - switch to 2 column layout */
  @media (min-width: 641px) {
    grid-template-columns: 120px 1fr;
    gap: 12px;
    padding: 14px 18px;
  }

  /* Large tablets and up */
  @media (min-width: 769px) {
    grid-template-columns: 130px 1fr;
    gap: 14px;
    padding: 15px 20px;
  }

  /* Desktop */
  @media (min-width: 1025px) {
    grid-template-columns: 140px 1fr;
    gap: 16px;
    padding: 16px 20px;
    margin-bottom: 10px;
  }
`;

export const OverlayLabel = styled.div`
  color: #64748b;
  font-weight: 700;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.01em;

  svg {
    color: #3b82f6;
    width: 14px;
    height: 14px;
  }

  @media (min-width: 481px) {
    font-size: 12px;
    gap: 7px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  @media (min-width: 641px) {
    font-size: 13px;
    gap: 8px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (min-width: 1025px) {
    font-size: 14px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const OverlayValue = styled.div`
  color: #0f172a;
  font-weight: 700;
  font-size: 12px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.4;
  word-break: break-word;

  @media (min-width: 481px) {
    font-size: 13px;
  }

  @media (min-width: 641px) {
    font-size: 14px;
  }

  @media (min-width: 1025px) {
    font-size: 15px;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
`;

export const ToastItem = styled.div`
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

