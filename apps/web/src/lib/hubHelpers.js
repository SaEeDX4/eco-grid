/**
 * Format capacity in kW with proper units
 */
export const formatKW = (kw) => {
  if (kw === null || kw === undefined) return "0 kW";
  if (kw >= 1000) {
    return `${(kw / 1000).toFixed(2)} MW`;
  }
  return `${kw.toFixed(1)} kW`;
};

/**
 * Format energy in kWh with proper units
 */
export const formatKWh = (kwh) => {
  if (kwh === null || kwh === undefined) return "0 kWh";
  if (kwh >= 1000000) {
    return `${(kwh / 1000000).toFixed(2)} GWh`;
  }
  if (kwh >= 1000) {
    return `${(kwh / 1000).toFixed(2)} MWh`;
  }
  return `${kwh.toFixed(1)} kWh`;
};

/**
 * Format CAD currency
 */
export const formatCAD = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return "0%";
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get utilization color based on percentage
 */
export const getUtilizationColor = (percent) => {
  if (percent >= 95) return "text-red-600 dark:text-red-400";
  if (percent >= 85) return "text-orange-600 dark:text-orange-400";
  if (percent >= 70) return "text-yellow-600 dark:text-yellow-400";
  if (percent >= 50) return "text-green-600 dark:text-green-400";
  return "text-blue-600 dark:text-blue-400";
};

/**
 * Get utilization background color
 */
export const getUtilizationBg = (percent) => {
  if (percent >= 95) return "bg-red-100 dark:bg-red-950/30";
  if (percent >= 85) return "bg-orange-100 dark:bg-orange-950/30";
  if (percent >= 70) return "bg-yellow-100 dark:bg-yellow-950/30";
  if (percent >= 50) return "bg-green-100 dark:bg-green-950/30";
  return "bg-blue-100 dark:bg-blue-950/30";
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    active: "text-green-600 dark:text-green-400",
    suspended: "text-red-600 dark:text-red-400",
    inactive: "text-slate-600 dark:text-slate-400",
    terminated: "text-red-600 dark:text-red-400",
    maintenance: "text-yellow-600 dark:text-yellow-400",
    offline: "text-slate-600 dark:text-slate-400",
  };
  return colors[status] || "text-slate-600 dark:text-slate-400";
};

/**
 * Get status badge color
 */
export const getStatusBadgeColor = (status) => {
  const colors = {
    active:
      "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
    suspended:
      "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    inactive:
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    terminated:
      "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    maintenance:
      "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    offline:
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  };
  return (
    colors[status] ||
    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
  );
};

/**
 * Get warning level color
 */
export const getWarningLevelColor = (level) => {
  const colors = {
    none: "text-green-600 dark:text-green-400",
    low: "text-yellow-600 dark:text-yellow-400",
    medium: "text-orange-600 dark:text-orange-400",
    high: "text-red-600 dark:text-red-400",
    critical: "text-red-600 dark:text-red-400",
  };
  return colors[level] || "text-slate-600 dark:text-slate-400";
};

/**
 * Get warning level badge
 */
export const getWarningLevelBadge = (level) => {
  const colors = {
    none: "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400",
    low: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400",
    medium:
      "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    high: "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400",
    critical: "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  };
  return (
    colors[level] ||
    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
  );
};

/**
 * Get priority tier info
 */
export const getPriorityTierInfo = (tier) => {
  const info = {
    standard: {
      label: "Standard",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-950/30",
      icon: "User",
    },
    priority: {
      label: "Priority",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-950/30",
      icon: "Star",
    },
    critical: {
      label: "Critical",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-950/30",
      icon: "AlertTriangle",
    },
  };
  return info[tier] || info.standard;
};

/**
 * Get business type icon
 */
export const getBusinessTypeIcon = (type) => {
  const icons = {
    retail: "ShoppingBag",
    office: "Briefcase",
    restaurant: "Utensils",
    residential: "Home",
    warehouse: "Package",
    manufacturing: "Factory",
    service: "Wrench",
    other: "Building",
  };
  return icons[type] || "Building";
};

/**
 * Calculate capacity percentage
 */
export const calculateCapacityPercent = (current, total) => {
  if (!total || total === 0) return 0;
  return (current / total) * 100;
};

/**
 * Get capacity status
 */
export const getCapacityStatus = (percent) => {
  if (percent >= 95) return { label: "Critical", severity: "critical" };
  if (percent >= 85) return { label: "High", severity: "high" };
  if (percent >= 70) return { label: "Moderate", severity: "medium" };
  if (percent >= 50) return { label: "Normal", severity: "low" };
  return { label: "Low", severity: "minimal" };
};

/**
 * Format date relative (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return "Never";

  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return new Date(date).toLocaleDateString("en-CA");
  }
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

/**
 * Format duration in hours/minutes
 */
export const formatDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Get hub type label
 */
export const getHubTypeLabel = (type) => {
  const labels = {
    commercial: "Commercial",
    industrial: "Industrial",
    residential: "Residential",
    "mixed-use": "Mixed Use",
    institutional: "Institutional",
  };
  return labels[type] || type;
};

/**
 * Get allocation method label
 */
export const getAllocationMethodLabel = (method) => {
  const labels = {
    "equal-split": "Equal Split",
    proportional: "Proportional",
    tiered: "Tiered",
    "priority-based": "Priority Based",
    "time-based": "Time Based",
    custom: "Custom",
    "usage-based": "Usage Based",
    weighted: "Weighted",
  };
  return labels[method] || method;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, length = 50) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

/**
 * Calculate savings percentage
 */
export const calculateSavingsPercent = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((previous - current) / previous) * 100;
};

/**
 * Get recommendation priority color
 */
export const getRecommendationPriorityColor = (priority) => {
  const colors = {
    high: "text-red-600 dark:text-red-400",
    medium: "text-orange-600 dark:text-orange-400",
    low: "text-blue-600 dark:text-blue-400",
  };
  return colors[priority] || "text-slate-600 dark:text-slate-400";
};

/**
 * Get recommendation priority icon
 */
export const getRecommendationPriorityIcon = (priority) => {
  const icons = {
    high: "AlertCircle",
    medium: "AlertTriangle",
    low: "Info",
  };
  return icons[priority] || "Info";
};

/**
 * Format square footage
 */
export const formatSquareFootage = (sqft) => {
  if (!sqft) return "N/A";
  return new Intl.NumberFormat("en-CA").format(sqft) + " sq ft";
};

/**
 * Get billing model label
 */
export const getBillingModelLabel = (model) => {
  const labels = {
    "equal-split": "Equal Split",
    proportional: "Proportional",
    tiered: "Tiered",
    dynamic: "Dynamic",
    fixed: "Fixed",
    "usage-based": "Usage Based",
  };
  return labels[model] || model;
};
