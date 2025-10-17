import React from "react";
import { CheckCircle, Copy, ArrowLeft } from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";

const ContactSuccess = ({ referenceId, onBack }) => {
  const { success } = useToast();

  const copyReferenceId = () => {
    navigator.clipboard.writeText(referenceId);
    success("Reference ID copied to clipboard");
  };

  return (
    <Card className="text-center">
      <div className="p-12">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-950/30 mb-6 animate-in zoom-in duration-500">
          <CheckCircle
            className="text-green-600 dark:text-green-400"
            size={48}
          />
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Message Sent Successfully!
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>

        {/* Reference ID */}
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Your Reference ID
          </p>
          <div className="flex items-center justify-center gap-3">
            <code className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {referenceId}
            </code>
            <button
              onClick={copyReferenceId}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Copy reference ID"
            >
              <Copy size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Save this ID to track your inquiry
          </p>
        </div>

        {/* Next Steps */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 text-left">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                1.
              </span>
              <span>
                You'll receive an automated confirmation email within minutes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                2.
              </span>
              <span>
                Our team will review your message and assign it to the right
                specialist
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                3.
              </span>
              <span>
                Expect a personalized response within 24 hours (Mon-Fri,
                business hours)
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" size="default" onClick={onBack}>
            <ArrowLeft size={18} />
            Send Another Message
          </Button>
          <Button
            variant="gradient"
            size="default"
            onClick={() => (window.location.href = "/")}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContactSuccess;
