import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PilotMap from "../components/map/PilotMap";

const PilotMapPage = () => {
  // ✅ Safe access to avoid undefined errors
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode ?? false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PilotMap isDarkMode={isDarkMode} />
    </div>
  );
};

export default PilotMapPage;
