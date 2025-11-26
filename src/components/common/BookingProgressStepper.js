"use client";

import React from "react";
import {
  BsSearch,
  BsAirplane,
  BsCreditCard,
  BsCheckCircleFill,
} from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useRouter } from "next/navigation";

const BookingProgressStepper = ({
  currentStep = 1,
  className = "",
  onStepClick,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const router = useRouter();

  const steps = [
    {
      id: 1,
      title: t("booking_progress.search", { defaultValue: "Search Flights" }),
      description: t("booking_progress.search_desc", {
        defaultValue: "Find your perfect flight",
      }),
      icon: BsSearch,
    },
    {
      id: 2,
      title: t("booking_progress.details", { defaultValue: "Booking Details" }),
      description: t("booking_progress.details_desc", {
        defaultValue: "Enter passenger information",
      }),
      icon: BsAirplane,
    },
    {
      id: 3,
      title: t("booking_progress.payment", { defaultValue: "Payment" }),
      description: t("booking_progress.payment_desc", {
        defaultValue: "Complete your booking",
      }),
      icon: BsCreditCard,
    },
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  const getStepClasses = (status, isClickable = false) => {
    const baseClasses = {
      completed: {
        container: "text-green-600",
        circle: "bg-green-600 border-green-600 text-white",
        line: "bg-green-600",
        title: "text-green-600 font-semibold",
        description: "text-green-500",
      },
      active: {
        container: "text-blue-600",
        circle: "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100",
        line: "bg-gray-200",
        title: "text-blue-600 font-semibold",
        description: "text-blue-500",
      },
      pending: {
        container: "text-gray-400",
        circle: "bg-white border-gray-300 text-gray-400",
        line: "bg-gray-200",
        title: "text-gray-400",
        description: "text-gray-400",
      },
    };

    const classes = baseClasses[status] || baseClasses.pending;

    if (isClickable) {
      return {
        ...classes,
        container: `${classes.container} cursor-pointer hover:scale-105 transition-transform duration-200`,
        circle: `${classes.circle} hover:shadow-lg`,
        title: `${classes.title} hover:underline`,
      };
    }

    return classes;
  };

  const handleStepClick = (stepId, status) => {
    if (status === "completed") {
      if (onStepClick) {
        onStepClick(stepId);
      } else {
        // Default behavior: navigate back to previous step
        switch (stepId) {
          case 1:
            router.back(); // Go to search results or previous page
            break;
          case 2:
            router.back(); // Go back to previous step
            break;
          default:
            router.back();
        }
      }
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6 mb-8 ${className}`}
    >
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = status === "completed";
          const classes = getStepClasses(status, isClickable);
          const IconComponent = step.icon;

          return (
            <div key={step.id} className="flex-1 relative">
              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 sm:top-6 w-full h-0.5 -translate-y-1/2 z-0 ${
                    isRTL ? "right-1/2" : "left-1/2"
                  }`}
                >
                  <div
                    className={`h-full transition-colors duration-300 ${
                      getStepStatus(step.id + 1) === "completed" ||
                      (getStepStatus(step.id + 1) === "active" &&
                        status === "completed")
                        ? "bg-green-600"
                        : classes.line
                    }`}
                  />
                </div>
              )}

              {/* Step Content */}
              <div
                className={`flex flex-col items-center relative cursor-pointer z-10 ${classes.container}`}
                onClick={() => handleStepClick(step.id, status)}
                role={isClickable ? "button" : "presentation"}
                tabIndex={isClickable ? 0 : -1}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleStepClick(step.id, status);
                  }
                }}
                title={
                  isClickable
                    ? t("booking_progress.click_to_go_back", {
                        defaultValue: "Click to go back",
                      })
                    : ""
                }
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${classes.circle}`}
                >
                  {status === "completed" ? (
                    <BsCheckCircleFill className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step Info */}
                <div className="text-center px-1">
                  <h3
                    className={`text-[11px] sm:text-sm font-medium mb-0.5 sm:mb-1 transition-colors duration-300 leading-tight ${classes.title}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`hidden sm:block text-xs transition-colors duration-300 ${classes.description} max-w-24`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingProgressStepper;
