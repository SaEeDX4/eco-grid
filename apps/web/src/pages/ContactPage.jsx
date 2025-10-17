import React, { useState, useEffect } from "react";
import { Mail, MessageSquare } from "lucide-react";
import ContactForm from "../components/contact/ContactForm";
import ContactSuccess from "../components/contact/ContactSuccess";
import ContactInfo from "../components/contact/ContactInfo";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSuccess = (refId) => {
    setReferenceId(refId);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSubmitted(false);
    setReferenceId(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
              <MessageSquare size={20} />
              <span className="font-semibold">We're Here to Help</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Have questions about Eco-Grid? Want to discuss a partnership? Our
              team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>

            {/* Form or Success Message */}
            <div className="lg:col-span-2">
              {submitted ? (
                <ContactSuccess referenceId={referenceId} onBack={handleBack} />
              ) : (
                <ContactForm onSuccess={handleSuccess} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Prompt Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Looking for Quick Answers?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Our AI assistant can help you with common questions about pricing,
              features, integrations, and more.
            </p>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Eco-Grid AI Assistant
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Get instant answers to questions about our platform, pricing,
                device compatibility, and more. Available 24/7.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Look for the chat icon in the bottom-right corner of your screen
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
