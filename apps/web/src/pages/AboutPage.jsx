import React, { useEffect } from "react";
import MissionSection from "../components/about/MissionSection";
import VisionValues from "../components/about/VisionValues";
import TeamGrid from "../components/about/TeamGrid";
import AdvisoryBoard from "../components/about/AdvisoryBoard";
import CompanyTimeline from "../components/about/CompanyTimeline";
import JoinTeamCTA from "../components/about/JoinTeamCTA";

const AboutPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MissionSection />
      <VisionValues />
      <TeamGrid />
      <AdvisoryBoard />
      <CompanyTimeline />
      <JoinTeamCTA />
    </div>
  );
};

export default AboutPage;
