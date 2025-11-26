"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
const Spinner = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-xl"
    >
      <div className="text-center space-y-8">
        <motion.div
          className="relative w-20 h-20 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-blue-400/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {t("loading_title", "Preparing Your Journey")}
          </h3>
          <p className="text-blue-200">
            {t("loading_subtitle", "نكتشف وجهات مذهلة لك...")}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default Spinner;
