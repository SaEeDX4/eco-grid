export const formatCAD = (amount) => {
  if (amount === undefined || amount === null) return "$0.00";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatKW = (kw) => {
  if (kw === undefined || kw === null) return "0 kW";
  return `${kw.toFixed(1)} kW`;
};

export const formatMW = (mw) => {
  if (mw === undefined || mw === null) return "0 MW";
  return `${mw.toFixed(2)} MW`;
};

export const formatKWh = (kwh) => {
  if (kwh === undefined || kwh === null) return "0 kWh";
  if (kwh >= 1000) {
    return `${(kwh / 1000).toFixed(2)} MWh`;
  }
  return `${kwh.toFixed(1)} kWh`;
};

export const formatPercent = (value) => {
  if (value === undefined || value === null) return "0%";
  return `${value.toFixed(1)}%`;
};

export const getPoolStatusColor = (status) => {
  const colors = {
    active: "from-green-500 to-emerald-600",
    full: "from-blue-500 to-cyan-600",
    paused: "from-yellow-500 to-orange-600",
    closed: "from-slate-400 to-slate-600",
  };
  return colors[status] || colors.active;
};

export const getPoolStatusLabel = (status) => {
  const labels = {
    active: "Active",
    full: "Full",
    paused: "Paused",
    closed: "Closed",
  };
  return labels[status] || status;
};

export const getDispatchStatusColor = (status) => {
  const colors = {
    scheduled: "text-blue-600 dark:text-blue-400",
    active: "text-green-600 dark:text-green-400",
    completed: "text-slate-600 dark:text-slate-400",
    cancelled: "text-red-600 dark:text-red-400",
    failed: "text-orange-600 dark:text-orange-400",
  };
  return colors[status] || colors.scheduled;
};

export const getDispatchStatusLabel = (status) => {
  const labels = {
    scheduled: "Scheduled",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
    failed: "Failed",
  };
  return labels[status] || status;
};

export const calculateFillPercentage = (totalMW, targetMW) => {
  if (!targetMW || targetMW === 0) return 0;
  return Math.min(100, (totalMW / targetMW) * 100);
};

export const calculateAvailableSlots = (totalMW, targetMW) => {
  if (!targetMW) return 0;
  return Math.max(0, targetMW - totalMW);
};

export const formatTimeRemaining = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target - now;

  if (diffMs < 0) return "Started";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
  if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
  return `${diffMins}m`;
};

export const formatDispatchDuration = (startTime, endTime) => {
  const durationMs = new Date(endTime) - new Date(startTime);
  const durationMins = Math.floor(durationMs / 60000);
  const hours = Math.floor(durationMins / 60);
  const mins = durationMins % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const getReliabilityColor = (reliability) => {
  if (reliability >= 98) return "text-green-600 dark:text-green-400";
  if (reliability >= 95) return "text-blue-600 dark:text-blue-400";
  if (reliability >= 90) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const getReliabilityLabel = (reliability) => {
  if (reliability >= 98) return "Excellent";
  if (reliability >= 95) return "Very Good";
  if (reliability >= 90) return "Good";
  if (reliability >= 80) return "Fair";
  return "Needs Improvement";
};

export const groupDispatchesByDate = (dispatches) => {
  const grouped = {};

  dispatches.forEach((dispatch) => {
    const date = new Date(dispatch.startTime).toISOString().split("T")[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(dispatch);
  });

  return grouped;
};

export const calculateTotalRevenue = (revenueRecords) => {
  return revenueRecords.reduce(
    (sum, record) => sum + (record.netRevenue || 0),
    0
  );
};

export const calculateAverageReliability = (dispatches) => {
  if (!dispatches || dispatches.length === 0) return 100;

  const completed = dispatches.filter(
    (d) => d.status === "completed" && d.performance?.reliability
  );
  if (completed.length === 0) return 100;

  const sum = completed.reduce(
    (total, d) => total + d.performance.reliability,
    0
  );
  return sum / completed.length;
};

export const getDeviceVPPCapacity = (device) => {
  if (!device) return 0;

  switch (device.type) {
    case "battery":
      return device.settings?.capacity || 10;
    case "ev-charger":
      return device.settings?.maxPower || 7;
    case "thermostat":
      return 2;
    case "water-heater":
      return 4;
    case "pool-pump":
      return 1.5;
    default:
      return 0;
  }
};

export const isPoolJoinable = (pool) => {
  if (!pool) return false;
  return (
    pool.status === "active" && pool.capacity.totalMW < pool.capacity.targetMW
  );
};

export const meetsPoolRequirements = (pool, devices) => {
  if (!pool || !devices || devices.length === 0) return false;

  // Check device types
  if (pool.requirements.deviceTypes.length > 0) {
    const hasValidDevice = devices.some((d) =>
      pool.requirements.deviceTypes.includes(d.type)
    );
    if (!hasValidDevice) return false;
  }

  // Check minimum capacity
  const totalCapacity = devices.reduce(
    (sum, d) => sum + getDeviceVPPCapacity(d),
    0
  );
  if (totalCapacity < pool.requirements.minCapacityKW) return false;

  return true;
};
