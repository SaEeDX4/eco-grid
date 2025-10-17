// apps/web/src/components/ui/TeamMemberCard.jsx
import React from "react";
import { Linkedin, Mail } from "lucide-react";
import { Card } from "./Card";

const TeamMemberCard = ({ member }) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
          {/* ✅ Fixed: added missing <a> opening tag */}
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin size={20} className="text-blue-600" />
          </a>

          <button
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${member.name
                .toLowerCase()
                .replace(" ", ".")}@ecogrid.ca`;
            }}
          >
            <Mail size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {member.name}
        </h3>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
          {member.role}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {member.bio}
        </p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2">
          {member.expertise.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TeamMemberCard;
