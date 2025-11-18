import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Phone,
  Send,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const ContactEscalation = ({ searchQuery = "", category = "" }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: searchQuery || "",
    category: category || "general",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Support request:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setFormData({ name: "", email: "", question: "", category: "general" });
    }, 3000);
  };

  return (
    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="text-slate-400" size={48} />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Didn't Find Your Answer?
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          No worries! Our support team is here to help you 24/7.
        </p>
      </div>

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* LIVE CHAT CARD */}
          <motion.button
            onClick={() => setShowForm(true)}
            className="p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all group h-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Live Chat
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-center">
                  Chat with our team in real-time
                </p>
              </div>

              <div className="text-center mt-2">
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Available now
                </div>
              </div>
            </div>
          </motion.button>

          {/* EMAIL CARD */}
          <motion.a
            href="mailto:support@ecogrid.ca"
            className="p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all group h-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Email Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-center">
                  Get a detailed response within 24h
                </p>
              </div>

              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 text-center mt-2">
                support@ecogrid.ca
              </p>
            </div>
          </motion.a>

          {/* PHONE CARD */}
          <motion.a
            href="tel:1-800-326-4743"
            className="p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all group h-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Phone Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-center">
                  Call us Mon–Fri 8am–8pm PT
                </p>
              </div>

              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 text-center mt-2">
                1-800-ECO-GRID
              </p>
            </div>
          </motion.a>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Ask Our Support Team
              </h3>

              {/* FORM FIELDS */}
              {/* (unchanged, as per your rule) */}

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="general">General Question</option>
                    <option value="getting-started">Getting Started</option>
                    <option value="billing">Billing & Plans</option>
                    <option value="technical">Technical Support</option>
                    <option value="devices">Device Connection</option>
                    <option value="vpp">Virtual Power Plant</option>
                    <option value="privacy">Privacy & Security</option>
                  </select>
                </div>

                {/* Question */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Your Question
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Describe your question or issue in detail..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg transition-all"
                  >
                    <Send size={20} />
                    Send Message
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-green-200 dark:border-green-800 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={32}
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Message Sent!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We'll get back to you within 24 hours at {formData.email}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ContactEscalation;
