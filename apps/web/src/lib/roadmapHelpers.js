export const getStatusColor = (status) => {
  const colors = {
    completed: "from-green-500 to-emerald-600",
    "in-progress": "from-blue-500 to-cyan-600",
    planned: "from-slate-400 to-slate-600",
  };
  return colors[status] || colors.planned;
};

export const getStatusLabel = (status) => {
  const labels = {
    completed: "Completed",
    "in-progress": "In Progress",
    planned: "Planned",
  };
  return labels[status] || "Planned";
};

export const getStatusIcon = (status) => {
  const icons = {
    completed: "CheckCircle2",
    "in-progress": "Clock",
    planned: "Circle",
  };
  return icons[status] || "Circle";
};

export const filterMilestonesByCategory = (years, category) => {
  if (!category) return years;

  return years
    .map((year) => ({
      ...year,
      milestones: year.milestones.filter((m) => m.category === category),
    }))
    .filter((year) => year.milestones.length > 0);
};

export const getAllCategories = (years) => {
  const categories = new Set();

  years.forEach((year) => {
    year.milestones.forEach((milestone) => {
      categories.add(milestone.category);
    });
  });

  return Array.from(categories);
};

export const calculateOverallProgress = (years) => {
  let totalProgress = 0;
  let milestoneCount = 0;

  years.forEach((year) => {
    year.milestones.forEach((milestone) => {
      totalProgress += milestone.progress;
      milestoneCount++;
    });
  });

  return milestoneCount > 0 ? Math.round(totalProgress / milestoneCount) : 0;
};

export const getMilestonesByStatus = (years, status) => {
  const milestones = [];

  years.forEach((year) => {
    year.milestones.forEach((milestone) => {
      if (milestone.status === status) {
        milestones.push({ ...milestone, year: year.year });
      }
    });
  });

  return milestones;
};

export const formatImpactMetric = (key, value) => {
  const formats = {
    users: value,
    energySaved: value,
    co2Reduced: value,
    revenue: value,
    capacity: value,
    coverage: value,
    marketShare: value,
    engagement: value,
    satisfaction: value,
    retention: value,
    partners: value,
    integration: value,
    distribution: value,
    developers: value,
    apps: value,
    funding: value,
    team: value,
    recognition: value,
    batteryLife: value,
    gridStability: value,
    accuracy: value,
    privacy: value,
    efficiency: value,
    credits: value,
    marketplace: value,
    transparency: value,
    automation: value,
    gridServices: value,
    markets: value,
    partnerships: value,
    standards: value,
    advisory: value,
    influence: value,
    emissions: value,
    offset: value,
    certification: value,
    licenses: value,
    reach: value,
    avgROI: value,
  };

  return formats[key] || value;
};

export const getYearProgress = (year) => {
  const milestones = year.milestones;
  if (milestones.length === 0) return 0;

  const totalProgress = milestones.reduce((sum, m) => sum + m.progress, 0);
  return Math.round(totalProgress / milestones.length);
};

export const isYearCompleted = (year) => {
  return year.milestones.every((m) => m.status === "completed");
};

export const isYearInProgress = (year) => {
  return year.milestones.some((m) => m.status === "in-progress");
};

export const getDependentMilestones = (milestoneId, years) => {
  const dependents = [];

  years.forEach((year) => {
    year.milestones.forEach((milestone) => {
      if (
        milestone.dependencies &&
        milestone.dependencies.includes(milestoneId)
      ) {
        dependents.push({ ...milestone, year: year.year });
      }
    });
  });

  return dependents;
};

export const scrollToYear = (year) => {
  const element = document.getElementById(`year-${year}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

export const scrollToMilestone = (milestoneId) => {
  const element = document.getElementById(`milestone-${milestoneId}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
