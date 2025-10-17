// apps/web/src/hooks/useToast.js
import { toast } from "sonner"; // ✅ use Sonner's built-in toast

export const useToast = () => {
  const success = (message, duration = 4000) => {
    toast.success(message, { duration });
  };

  const error = (message, duration = 4000) => {
    toast.error(message, { duration });
  };

  const warning = (message, duration = 4000) => {
    toast.warning(message, { duration });
  };

  const info = (message, duration = 4000) => {
    toast(message, { duration });
  };

  // Compatibility (for components using old structure)
  return {
    toasts: [],
    removeToast: () => {},
    success,
    error,
    warning,
    info,
  };
};
