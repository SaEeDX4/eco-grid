import React from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

const UpgradeBanner = ({
  message,
  onUpgrade,
  onDismiss,
  dismissible = true,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-6 shadow-xl animate-in slide-in-from-top duration-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Sparkles className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Upgrade to Unlock More
            </h3>
            <p className="text-sm text-white/90">
              {message ||
                "Get access to advanced features and unlimited devices"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="white"
            size="default"
            onClick={onUpgrade}
            className="flex-shrink-0"
          >
            Upgrade Now
            <ArrowRight size={18} />
          </Button>
          {dismissible && (
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="text-white" size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;
