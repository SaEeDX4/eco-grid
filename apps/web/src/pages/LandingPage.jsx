import React from "react";
import Hero from "../components/landing/Hero";
import ImpactTracker from "../components/landing/ImpactTracker";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import CTASection from "../components/landing/CTASection";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <ImpactTracker />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default LandingPage;
