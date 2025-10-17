import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import api from "../../lib/api";

const SmartHeadline = () => {
  const [headline, setHeadline] = useState("Transform Your Energy Usage");
  const [subheadline, setSubheadline] = useState(
    "Join Vancouver's Smart Energy Revolution",
  );
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false); // ✅ prevent double fetch in Strict Mode

  useEffect(() => {
    if (fetchedRef.current) return; // already fetched once
    fetchedRef.current = true;
    fetchSmartHeadline();
  }, []);

  const fetchSmartHeadline = async () => {
    try {
      const response = await api.post("/ai/smart-headline", {
        location: "Vancouver, BC",
        timeOfDay: new Date().getHours(),
        season: getCurrentSeason(),
      });

      if (response.data?.headline) setHeadline(response.data.headline);
      if (response.data?.subheadline) setSubheadline(response.data.subheadline);
    } catch (error) {
      console.log("Using fallback headline");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
  };

  return (
    <div className="relative mb-10">
      {loading && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <Sparkles size={16} className="animate-pulse" />
            <span>AI personalizing your experience...</span>
          </div>
        </div>
      )}
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-snug bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {headline}
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-snug animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        {subheadline}
      </p>
    </div>
  );
};

export default SmartHeadline;
