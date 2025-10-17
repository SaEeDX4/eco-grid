// apps/web/src/components/about/JoinTeamCTA.jsx
import React from "react";
import { ArrowRight, Briefcase, MapPin, Users } from "lucide-react";

const JoinTeamCTA = () => {
  const openPositions = [
    {
      title: "Senior Full-Stack Engineer",
      location: "Vancouver, BC",
      type: "Full-time",
      department: "Engineering",
    },
    {
      title: "Product Designer",
      location: "Remote (Canada)",
      type: "Full-time",
      department: "Product",
    },
    {
      title: "Energy Systems Engineer",
      location: "Vancouver, BC",
      type: "Full-time",
      department: "Engineering",
    },
    {
      title: "Business Development Manager",
      location: "Vancouver, BC / Toronto, ON",
      type: "Full-time",
      department: "Business",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Briefcase size={20} />
            <span className="font-semibold">Careers at Eco-Grid</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Help us build the future of sustainable energy. We're looking for
            passionate individuals who want to make a real impact.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-bold mb-2">Competitive Package</h3>
            <p className="text-sm text-blue-100">
              Market-leading salary, equity options, and comprehensive benefits
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-bold mb-2">Growth Opportunities</h3>
            <p className="text-sm text-blue-100">
              Learning budget, conferences, and clear career progression paths
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="font-bold mb-2">Flexible Work</h3>
            <p className="text-sm text-blue-100">
              Hybrid options, flexible hours, and remote-friendly culture
            </p>
          </div>
        </div>

        {/* Open Positions */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Open Positions ({openPositions.length})
          </h3>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                      {position.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{position.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{position.department}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className="text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300"
                    size={24}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 mb-4">
            Don't see the right role? We're always interested in talented
            people.
          </p>
          {/* ✅ Fixed anchor tag opening */}
          <a
            href="mailto:careers@ecogrid.ca"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Get in Touch
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default JoinTeamCTA;
