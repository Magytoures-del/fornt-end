"use client";

import React from "react";
import { LuUser, LuCreditCard, LuCheck } from "react-icons/lu";
import { BsCheckCircleFill } from "react-icons/bs";

/**
 * Step status types
 */
const STEP_STATUS = {
  COMPLETED: "completed",
  CURRENT: "current",
  UPCOMING: "upcoming",
};

/**
 * Get step status based on current step
 */
const getStepStatus = (stepId, currentStep) => {
  if (stepId < currentStep) return STEP_STATUS.COMPLETED;
  if (stepId === currentStep) return STEP_STATUS.CURRENT;
  return STEP_STATUS.UPCOMING;
};

/**
 * Get icon for step based on title and status
 */
const getStepIcon = (step, status) => {
  const title = (step?.title || "").toLowerCase();
  // Responsive icon sizes matching flight booking stepper
  const iconClasses = status === STEP_STATUS.COMPLETED 
    ? "w-5 h-5 sm:w-6 sm:h-6" 
    : "w-4 h-4 sm:w-5 sm:h-5";

  // Completed steps always show check icon
  if (status === STEP_STATUS.COMPLETED) {
    return <BsCheckCircleFill className={iconClasses} />;
  }

  // Payment step
  if (title.includes("pay") || title.includes("payment") || title.includes("الدفع")) {
    return <LuCreditCard className={iconClasses} />;
  }

  // Guest details step
  if (
    title.includes("detail") ||
    title.includes("book") ||
    title.includes("guest") ||
    title.includes("تفاصيل")
  ) {
    return <LuUser className={iconClasses} />;
  }

  // Confirmation step
  if (title.includes("confirm") || title.includes("confirmation") || title.includes("تأكيد")) {
    return <BsCheckCircleFill className={iconClasses} />;
  }

  return <BsCheckCircleFill className={iconClasses} />;
};

/**
 * Desktop Step Button Component
 */
const DesktopStepButton = ({ step, index, status, onClick }) => {
  const isClickable = status !== STEP_STATUS.UPCOMING;

  const getButtonStyles = () => {
    switch (status) {
      case STEP_STATUS.COMPLETED:
        return "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 shadow-green-500/30";
      case STEP_STATUS.CURRENT:
        return "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl ring-4 ring-blue-100 scale-110 shadow-blue-500/40";
      case STEP_STATUS.UPCOMING:
        return "bg-gray-100 border-2 border-gray-300 text-gray-400";
      default:
        return "";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`
        relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
        transition-all duration-300 transform border-2
        ${getButtonStyles()}
        ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
      `}
      aria-label={`Step ${index + 1}: ${step.title}`}
      aria-current={status === STEP_STATUS.CURRENT ? "step" : undefined}
    >
      {getStepIcon(step, status)}

      {/* Pulse animation for current step */}
      {status === STEP_STATUS.CURRENT && (
        <>
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25" />
          <span className="absolute inset-0 rounded-full bg-blue-300 animate-pulse opacity-20" />
        </>
      )}
    </button>
  );
};

/**
 * Mobile Step Button Component
 */
const MobileStepButton = ({ step, index, status, onClick }) => {
  const isClickable = status !== STEP_STATUS.UPCOMING;

  const getButtonStyles = () => {
    switch (status) {
      case STEP_STATUS.COMPLETED:
        return "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30";
      case STEP_STATUS.CURRENT:
        return "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg ring-3 ring-blue-100 scale-105 shadow-blue-500/40";
      case STEP_STATUS.UPCOMING:
        return "bg-gray-100 border-2 border-gray-300 text-gray-400";
      default:
        return "";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`
        relative w-10 h-10 rounded-full flex items-center justify-center
        transition-all duration-300 transform flex-shrink-0 border-2
        ${getButtonStyles()}
        ${isClickable ? "cursor-pointer active:scale-95" : "cursor-not-allowed"}
      `}
      aria-label={`Step ${index + 1}: ${step.title}`}
      aria-current={status === STEP_STATUS.CURRENT ? "step" : undefined}
    >
      {getStepIcon(step, status)}

      {/* Pulse animation for current step */}
      {status === STEP_STATUS.CURRENT && (
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25" />
      )}
    </button>
  );
};

/**
 * Step Content Component
 */
const StepContent = ({ step, status }) => {
  const getTitleStyles = () => {
    switch (status) {
      case STEP_STATUS.COMPLETED:
        return "text-green-600 font-semibold";
      case STEP_STATUS.CURRENT:
        return "text-blue-600 font-semibold";
      case STEP_STATUS.UPCOMING:
        return "text-gray-400";
      default:
        return "";
    }
  };

  const getDescriptionStyles = () => {
    switch (status) {
      case STEP_STATUS.COMPLETED:
        return "text-green-500";
      case STEP_STATUS.CURRENT:
        return "text-blue-500";
      case STEP_STATUS.UPCOMING:
        return "text-gray-400";
      default:
        return "";
    }
  };

  return (
    <div className="mt-2 sm:mt-2.5 lg:mt-2 text-center px-1">
      <h3
        className={`
          text-[11px] sm:text-sm transition-colors duration-300 leading-tight mb-0.5 sm:mb-1
          ${getTitleStyles()}
        `}
      >
        {step.title}
      </h3>
      <p
        className={`
          hidden sm:block text-xs transition-colors duration-300 leading-relaxed max-w-24 mx-auto
          ${getDescriptionStyles()}
        `}
      >
        {step.description}
      </p>
    </div>
  );
};

/**
 * Main Booking Progress Stepper Component
 */
export default function BookingProgressStepper({ steps, currentStep, onStepClick }) {
  if (!steps || steps.length === 0) return null;

  const total = steps.length;
  const currentIndex = Math.max(0, steps.findIndex((s) => s.id === currentStep) ?? 0);
  const progressPercent = total > 1 ? (currentIndex / (total - 1)) * 100 : 0;

  const handleStepClick = (stepId) => {
    if (stepId <= currentStep && onStepClick) {
      onStepClick(stepId);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl mt-5 lg:mt-0 shadow-lg border border-gray-100 p-3 sm:p-6 mb-6 sm:mb-8">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute inset-x-0 top-5 sm:top-6 h-0.5 bg-gray-200 rounded-full overflow-hidden -translate-y-1/2">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Steps */}
          <div className="relative flex items-start justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id, currentStep);

              return (
                <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                  <DesktopStepButton
                    step={step}
                    index={index}
                    status={status}
                    onClick={() => handleStepClick(step.id)}
                  />
                  <StepContent step={step} status={status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute inset-x-0 top-5 h-0.5 bg-gray-200 rounded-full overflow-hidden -translate-y-1/2">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex items-start justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id, currentStep);

              return (
                <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                  <MobileStepButton
                    step={step}
                    index={index}
                    status={status}
                    onClick={() => handleStepClick(step.id)}
                  />
                  <StepContent step={step} status={status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
