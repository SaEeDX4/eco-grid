import React, { useEffect } from "react";
import { Shield, Download, Mail } from "lucide-react";
// ✅ Fixed import path
import { privacyPolicy } from "../lib/privacyContent";
import * as LucideIcons from "lucide-react";
import Button from "../components/ui/Button";

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
              <Shield size={20} />
              <span className="font-semibold">PIPEDA Compliant</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Your privacy is our priority. This policy explains how we collect,
              use, and protect your personal information in compliance with
              Canadian privacy laws.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="default">
                <Download size={18} />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() =>
                  (window.location.href = "mailto:privacy@ecogrid.ca")
                }
              >
                <Mail size={18} />
                Contact Privacy Officer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= METADATA ================= */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Last Updated */}
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Last Updated
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {new Date(privacyPolicy.lastUpdated).toLocaleDateString(
                  "en-CA",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            </div>

            {/* Effective Date */}
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Effective Date
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {new Date(privacyPolicy.effectiveDate).toLocaleDateString(
                  "en-CA",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            </div>

            {/* Version */}
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Version
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                1.0
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POLICY CONTENT ================= */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {privacyPolicy.sections.map((section, index) => {
              const Icon = LucideIcons[section.icon] || Shield;

              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="mb-12 scroll-mt-32 animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Section Body */}
                  <div className="pl-16">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>

                      {/* Subsections */}
                      {section.subsections && (
                        <div className="mt-6 space-y-6">
                          {section.subsections.map((subsection, subIndex) => (
                            <div key={subIndex}>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {subsection.title}
                              </h3>
                              <ul className="space-y-2">
                                {subsection.items.map((item, itemIndex) => (
                                  <li
                                    key={itemIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {item}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Items */}
                      {section.items && (
                        <ul className="mt-6 space-y-3">
                          {section.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-slate-700 dark:text-slate-300">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Details */}
                      {section.details && (
                        <div className="mt-6 p-6 rounded-xl bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800">
                          {section.details.email && (
                            <div className="mb-3">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                Email:{" "}
                              </span>
                              <a
                                href={`mailto:${section.details.email}`}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {section.details.email}
                              </a>
                            </div>
                          )}
                          {section.details.phone && (
                            <div className="mb-3">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                Phone:{" "}
                              </span>
                              <a
                                href={`tel:${section.details.phone}`}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {section.details.phone}
                              </a>
                            </div>
                          )}
                          {section.details.address && (
                            <div className="mb-3">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                Address:{" "}
                              </span>
                              <span className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                {section.details.address}
                              </span>
                            </div>
                          )}
                          {section.details.responseTime && (
                            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 text-sm text-slate-600 dark:text-slate-400">
                              {section.details.responseTime}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Questions About Your Privacy?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Our Privacy Officer is here to help. Contact us anytime with
              questions or concerns.
            </p>
            <Button
              variant="white"
              size="lg"
              onClick={() =>
                (window.location.href = "mailto:privacy@ecogrid.ca")
              }
            >
              <Mail size={20} />
              privacy@ecogrid.ca
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
