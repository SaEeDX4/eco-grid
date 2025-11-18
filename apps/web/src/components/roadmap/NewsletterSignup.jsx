import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Send } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-100 dark:border-slate-700">
      <div className="max-w-2xl mx-auto text-center">
        {!subscribed ? (
          <>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white" size={28} />
            </div>

            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Get Roadmap Updates
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Be the first to know when we hit new milestones. No spam, just
              progress.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Subscribe
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              You're Subscribed!
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Check your inbox for a confirmation email.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
