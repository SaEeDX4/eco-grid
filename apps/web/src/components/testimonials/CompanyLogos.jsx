import React from "react";

const CompanyLogos = ({ title = "Trusted by Leading Organizations" }) => {
  // Placeholder company logos - in production, use actual client logos
  const companies = [
    { name: "TechCorp", logo: "/logos/techcorp.svg" },
    { name: "Greenwood University", logo: "/logos/greenwood.svg" },
    { name: "Pacific Manufacturing", logo: "/logos/pacific.svg" },
    { name: "City of Richmond", logo: "/logos/richmond.svg" },
    { name: "Alpine Resorts", logo: "/logos/alpine.svg" },
    { name: "Metro Transit", logo: "/logos/metro.svg" },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Placeholder - replace with actual logos */}
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-300 dark:text-slate-600 mb-2">
                  {company.name.charAt(0)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {company.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
