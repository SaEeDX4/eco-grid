import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import Button from "../ui/Button";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const CTASection = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);

  const benefits = [
    "No credit card required",
    "Free during pilot program",
    "Cancel anytime",
    "Priority support",
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTEuMDQ1LTguOTU1IDIwLTIwIDIwcy0yMC04Ljk1NS0yMC0yMFM0Ljk1NSAyMCAxNiAyMHMyMCA4Ljk1NSAyMCAyMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center" ref={ref}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Ready to Transform Your Energy Usage?
          </h2>
          <p className="text-xl text-green-50 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Join the pilot program today and start saving immediately
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-white">
                <CheckCircle size={20} className="text-green-200" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button
              variant="secondary"
              size="xl"
              className="group shadow-2xl hover:shadow-green-900/50 bg-white text-green-600 hover:bg-green-50"
            >
              Join Pilot Program Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <p className="text-green-100 text-sm mt-4">
              Limited spots available • Vancouver, BC residents only
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 pt-12 border-t border-white/20 animate-in fade-in duration-1000 delay-700">
            <p className="text-green-100 text-sm mb-4">
              Trusted by leading organizations
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <div className="text-white font-semibold">BC Hydro</div>
              <div className="text-white font-semibold">Innovate BC</div>
              <div className="text-white font-semibold">Startup Visa</div>
              <div className="text-white font-semibold">Clean BC</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
