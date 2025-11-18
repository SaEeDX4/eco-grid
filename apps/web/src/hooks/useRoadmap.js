import { useState, useEffect } from "react";
import { roadmapData } from "../data/roadmapData";
import { filterMilestonesByCategory } from "../lib/roadmapHelpers";

export const useRoadmap = () => {
  const [years, setYears] = useState(roadmapData.years);
  const [filteredYears, setFilteredYears] = useState(roadmapData.years);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(null);

  useEffect(() => {
    if (activeCategory) {
      const filtered = filterMilestonesByCategory(years, activeCategory);
      setFilteredYears(filtered);
    } else {
      setFilteredYears(years);
    }
  }, [activeCategory, years]);

  const setCategory = (category) => {
    setActiveCategory(category);
  };

  const clearCategory = () => {
    setActiveCategory(null);
  };

  const selectMilestone = (milestone) => {
    setActiveMilestone(milestone);
  };

  const clearMilestone = () => {
    setActiveMilestone(null);
  };

  return {
    years: filteredYears,
    allYears: years,
    activeCategory,
    activeMilestone,
    setCategory,
    clearCategory,
    selectMilestone,
    clearMilestone,
  };
};
