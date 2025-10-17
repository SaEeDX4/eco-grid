import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ type = "info", message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const Icon = icons[type];

  return (
    <div
      className={`
      ${styles[type]}
      px-6 py-4 rounded-2xl shadow-2xl
      flex items-center gap-3
      animate-in slide-in-from-top-4 fade-in duration-300
      min-w-[300px] max-w-md
    `}
    >
      <Icon size={24} />
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default Toast;
