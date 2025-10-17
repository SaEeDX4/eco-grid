import React, { useState } from "react";
import { CheckCircle, AlertCircle, Info, ArrowRight, X } from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useToast } from "../../hooks/useToast";
import api from "../../lib/api";

const AcceptanceFlow = ({
  schedule,
  mode,
  savings,
  onAccept,
  onDecline,
  validation,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const { success, error: showError } = useToast();

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const response = await api.post("/optimizer/accept", {
        schedule,
        mode,
        savings,
      });

      success("Optimization plan activated! 🎉");
      createConfetti();
      onAccept?.(response.data);
      setShowModal(false);
    } catch (err) {
      showError("Failed to activate plan. Please try again.");
      console.error("Accept plan error:", err);
    } finally {
      setAccepting(false);
    }
  };

  const createConfetti = () => {
    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-10px";
      confetti.style.opacity = "1";
      confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      confetti.style.transition = "all 3s ease-out";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "9999";

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = window.innerHeight + "px";
        confetti.style.left =
          parseInt(confetti.style.left) + (Math.random() - 0.5) * 200 + "px";
        confetti.style.opacity = "0";
      }, 10);

      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 3000);
    }
  };

  const hasErrors = validation?.errors && validation.errors.length > 0;
  const hasWarnings = validation?.warnings && validation.warnings.length > 0;

  return (
    <>
      <Card className="min-h-[450px]">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Review & Accept Plan
          </h3>

          {/* Validation Status */}
          {hasErrors && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 dark:text-red-400 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-300 mb-2">
                    Plan Has Issues
                  </h4>
                  <ul className="space-y-1">
                    {validation.errors.map((err, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-red-800 dark:text-red-200"
                      >
                        • {err}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {hasWarnings && !hasErrors && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <Info
                  className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {validation.warnings.map((warn, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-yellow-800 dark:text-yellow-200"
                      >
                        • {warn}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!hasErrors && !hasWarnings && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-xl animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 dark:text-green-400 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">
                    Plan Looks Great!
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    No conflicts detected. This optimization plan is ready to
                    activate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {schedule?.length || 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Devices Scheduled
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                ${savings?.monthlySavings?.toFixed(2) || 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Monthly Savings
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {savings?.percentSaved?.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Cost Reduction
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => setShowModal(true)}
              disabled={hasErrors}
              className="flex-1 group"
            >
              <CheckCircle size={20} />
              Accept & Activate Plan
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onDecline}
              className="flex-1"
            >
              <X size={20} />
              Decline
            </Button>
          </div>

          {hasErrors && (
            <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">
              Please resolve the issues above before accepting this plan
            </p>
          )}
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Optimization Plan"
      >
        {/* FIX: scrollable modal content */}
        <div className="space-y-6 max-h-[85vh] overflow-y-auto overscroll-contain pr-2">
          {/* Warning */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Info
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Before you proceed:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This will change your device schedules immediately</li>
                  <li>
                    Some devices may turn off/on based on the new schedule
                  </li>
                  <li>You can always revert to the previous schedule</li>
                  <li>Changes take effect within 5 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-center">
            <h4 className="text-lg font-semibold mb-2">You're About to Save</h4>
            <div className="text-4xl font-bold mb-1">
              ${savings?.monthlySavings?.toFixed(2)}/month
            </div>
            <div className="text-green-100">
              That's ${(savings?.yearlySavings || 0).toFixed(0)} per year!
            </div>
          </div>

          {/* Confirmation */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="confirm"
              className="mt-1 w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-green-600 focus:ring-2 focus:ring-green-500"
            />
            <label
              htmlFor="confirm"
              className="text-sm text-slate-700 dark:text-slate-300"
            >
              I understand that this will modify my device schedules and I want
              to proceed with this optimization plan.
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleAccept}
              loading={accepting}
              disabled={accepting}
              className="flex-1"
            >
              Yes, Activate Plan
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowModal(false)}
              disabled={accepting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AcceptanceFlow;
