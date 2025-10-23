import React, { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useNewsletter } from "../../hooks/useNewsletter";

const NewsletterSignup = ({ inline = false }) => {
  const [email, setEmail] = useState("");
  const { subscribe, loading, success, error } = useNewsletter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    await subscribe(email);
    if (success) {
      setEmail("");
    }
  };

  if (inline) {
    return (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Mail size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Get weekly insights on clean energy, AI optimization, and
              sustainability delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading || success}
                  className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || success}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Subscribing...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle size={18} />
                      Subscribed!
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle size={16} />
                  <span>Check your email to confirm your subscription!</span>
                </div>
              )}
            </form>

            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
              By subscribing, you agree to our Privacy Policy. Unsubscribe
              anytime.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full-width section variant
  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Mail size={40} />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Never Miss an Insight
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,000+ energy professionals receiving weekly insights on clean
            energy innovation, AI optimization, and sustainability trends.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading || success}
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:border-white focus:outline-none transition-colors text-lg disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || success}
                className="px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Subscribing...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={20} />
                    Subscribed!
                  </>
                ) : (
                  "Subscribe Free"
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-300 flex items-center gap-2 text-white">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-300 flex items-center gap-2 text-white">
                <CheckCircle size={20} />
                <span>
                  Success! Check your email to confirm your subscription.
                </span>
              </div>
            )}
          </form>

          <p className="text-sm text-blue-100 mt-6">
            No spam, ever. PIPEDA-compliant. Unsubscribe with one click.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
