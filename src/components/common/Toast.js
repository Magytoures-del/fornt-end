import React, { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, info)
 * @param {number} props.duration - Duration in milliseconds
 * @param {Function} props.onClose - Close handler
 */
const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 z-50 max-w-md w-full transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0`}
    >
      <div
        className={`${colors[type]} border-2 rounded-2xl shadow-xl shadow-gray-200/50 backdrop-blur-sm p-4 flex items-start gap-3 mx-4 md:mx-0`}
      >
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={`w-5 h-5 ${iconColors[type]}`} />
        </div>
        <p className="flex-1 text-sm font-semibold leading-relaxed">
          {message}
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg p-1 transition-all duration-200"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Toast container to manage multiple toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-full max-w-md px-4 md:left-auto md:right-4 md:translate-x-0 md:px-0">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Custom hook to manage toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
};

export default Toast;
