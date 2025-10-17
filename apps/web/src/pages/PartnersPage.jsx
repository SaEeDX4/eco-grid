import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PartnershipModels from "../components/partners/PartnershipModels";
import IncubatorShowcase from "../components/partners/IncubatorShowcase";
import PartnerBenefits from "../components/partners/PartnerBenefits";
import IntegrationProcess from "../components/partners/IntegrationProcess";
import SuccessMetrics from "../components/partners/SuccessMetrics";
import PartnerTestimonials from "../components/partners/PartnerTestimonials";
import PartnerInquiryForm from "../components/partners/PartnerInquiryForm";

const PartnersPage = () => {
  const location = useLocation();
  const formRef = useRef(null);
  const [preselectedModel, setPreselectedModel] = useState("");

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleInquire = (modelName) => {
    setPreselectedModel(modelName);
    // Scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
          <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Partner with Eco-Grid
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Join utilities, incubators, and enterprises across Canada in
              transforming energy management through intelligent automation and
              community-driven innovation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleInquire("General Inquiry")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Become a Partner
              </button>

              {/* ✅ Fixed missing <a> tag */}
              <a
                href="mailto:partnerships@ecogrid.ca"
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <PartnershipModels onInquire={handleInquire} />

      {/* Success Metrics */}
      <SuccessMetrics />

      {/* Partner Benefits */}
      <PartnerBenefits />

      {/* Incubator Showcase */}
      <IncubatorShowcase />

      {/* Testimonials */}
      <PartnerTestimonials />

      {/* Integration Process */}
      <IntegrationProcess />

      {/* Inquiry Form */}
      <div ref={formRef}>
        <PartnerInquiryForm preselectedModel={preselectedModel} />
      </div>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Transform Energy Together?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Let's discuss how Eco-Grid can help your organization achieve its
              clean energy and cost reduction goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* ✅ Fixed missing <a> tag */}
              <a
                href="mailto:partnerships@ecogrid.ca"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Email: partnerships@ecogrid.ca
              </a>

              {/* ✅ Fixed missing <a> tag */}
              <a
                href="tel:+16041234567"
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Call: +1 (604) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
