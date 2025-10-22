import React from "react";
import * as LucideIcons from "lucide-react";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";
import { complianceStandards, securityFeatures } from "../../lib/suvData";
import ZeroTrustDiagram from "./ZeroTrustDiagram";
import AnomalyDetector from "./AnomalyDetector";

const SecurityPosture = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* ================= Header ================= */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
            <ShieldCheck size={20} />
            <span className="font-semibold">Security & Privacy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Enterprise-Grade Security Posture
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Built from the ground up with a security-first architecture,
            compliance standards, and real-time threat detection to protect your
            data and privacy.
          </p>
        </div>

        {/* ================= Zero-Trust Architecture ================= */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Zero-Trust Architecture
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Every request is authenticated, authorized, and encrypted. No
              implicit trust — continuous verification at every layer.
            </p>
          </div>
          <ZeroTrustDiagram />
        </div>

        {/* ================= Compliance Standards ================= */}
        <div className="mb-16 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Compliance & Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceStandards.map((standard, index) => {
              const Icon =
                LucideIcons[standard.icon] || LucideIcons.ShieldCheck;

              return (
                <article
                  key={index}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">
                    {standard.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                    {standard.fullName}
                  </p>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        standard.status === "Compliant"
                          ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : standard.status === "In Progress"
                            ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                            : "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400"
                      }`}
                  >
                    {standard.status}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                    {standard.description}
                  </p>
                  {standard.certificationDate && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      Target: {standard.certificationDate}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* ================= Security Features ================= */}
        <div className="mb-16 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Security Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <article
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h4>
                  {feature.implemented && (
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                      <Lock
                        size={14}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* ================= Real-Time Monitoring ================= */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Real-Time Security Monitoring
          </h3>
          <AnomalyDetector />
        </div>

        {/* ================= Security Statement ================= */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Our Security Commitment
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Security and privacy are not afterthoughts — they are
                  fundamental to our architecture. We employ a defense-in-depth
                  strategy with multiple layers of protection, regular
                  third-party audits, and a dedicated security team monitoring
                  threats 24/7. All data is encrypted at rest and in transit,
                  and we never sell or share your personal information with
                  third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityPosture;
