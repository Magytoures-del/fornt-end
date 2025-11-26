"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

/**
 * BookingLoadingOverlay
 * A specialized loading overlay for booking creation process
 * Shows animated progress indicators and booking-specific messaging
 * @param {Object} flightData - Flight route information to display
 */
const BookingLoadingOverlay = ({ flightData }) => {
  const { t } = useTranslation();

  // Animation variants for the plane icon
  const planeVariants = {
    initial: { x: -100, opacity: 0 },
    animate: {
      x: 100,
      opacity: [0, 1, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Animation variants for the dots
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.3 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-sky-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl"
    >
      <div className="text-center space-y-8 px-4">
        {/* Animated Plane Container */}
        <div className="relative w-64 h-24 mx-auto overflow-hidden">
          {/* Flight path line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>

          {/* Animated plane icon */}
          <motion.div
            variants={planeVariants}
            initial="initial"
            animate="animate"
            className="absolute top-1/2 left-1/2 transform -translate-y-1/2"
          >
            <svg
              className="w-12 h-12 text-sky-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </motion.div>
        </div>

        {/* Loading dots */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.2 }}
              className="w-3 h-3 rounded-full bg-sky-400"
            />
          ))}
        </div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-3xl font-bold text-white">
            {t("booking_loading.creating_booking", "Creating Your Booking")}
          </h3>
          <p className="text-sky-200 text-lg">
            {t(
              "booking_loading.processing_request",
              "Processing your request, please wait..."
            )}
          </p>

          {/* Flight Route Information */}
          {flightData && (flightData.from || flightData.to) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-sky-800/30 backdrop-blur-sm rounded-lg p-4 mt-4 border border-sky-400/20"
            >
              <p className="text-sky-300 text-sm font-medium mb-3">
                {t("booking_loading.flight_route", "Flight Route")}
              </p>
              <div className="flex items-center justify-center gap-3 text-white">
                {/* From */}
                <div className="text-center flex-1">
                  <p className="text-xs text-sky-300 mb-1">
                    {t("booking_loading.from", "From")}
                  </p>
                  <p className="text-lg font-bold">{flightData.from || "—"}</p>
                  {flightData.departureTime && (
                    <p className="text-xs text-sky-200 mt-1">
                      {flightData.departureTime}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>

                {/* To */}
                <div className="text-center flex-1">
                  <p className="text-xs text-sky-300 mb-1">
                    {t("booking_loading.to", "To")}
                  </p>
                  <p className="text-lg font-bold">{flightData.to || "—"}</p>
                  {flightData.arrivalTime && (
                    <p className="text-xs text-sky-200 mt-1">
                      {flightData.arrivalTime}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-2"
          >
            <p className="text-sky-300/80 text-sm">
              {t(
                "booking_loading.do_not_close",
                "Please do not close this window"
              )}
            </p>
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-64 mx-auto"
        >
          <div className="h-1.5 bg-sky-900/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
              animate={{
                width: ["0%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingLoadingOverlay;
