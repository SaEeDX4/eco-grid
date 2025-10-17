// apps/web/src/components/about/TeamGrid.jsx
import React from "react";
import TeamMemberCard from "../ui/TeamMemberCard";
import { teamMembers } from "../../lib/teamData";

const TeamGrid = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            World-class experts in energy, technology, and sustainability
            driving Canada's clean energy transition
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-3">Join Our Mission</h3>
            <p className="text-blue-100 mb-6 max-w-md">
              We're always looking for talented individuals passionate about
              clean energy and technology
            </p>
            {/* ✅ Fixed anchor tag opening */}
            <a
              href="mailto:careers@ecogrid.ca"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
