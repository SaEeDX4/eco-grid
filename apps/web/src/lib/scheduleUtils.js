// Utility functions for schedule management

export const formatHour = (hour) => {
  const h = hour % 12 || 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${h}:00 ${period}`;
};

export const getHourRange = (startHour, endHour) => {
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
};

export const isOffPeakHour = (hour) => {
  return (hour >= 0 && hour < 7) || (hour >= 21 && hour < 24);
};

export const isPeakHour = (hour) => {
  return hour >= 16 && hour < 21;
};

export const getHourClass = (hour) => {
  if (isPeakHour(hour)) return "peak";
  if (isOffPeakHour(hour)) return "off-peak";
  return "mid-peak";
};

export const getHourColor = (hour) => {
  if (isPeakHour(hour))
    return {
      bg: "bg-red-100 dark:bg-red-900/30",
      border: "border-red-300 dark:border-red-700",
      text: "text-red-700 dark:text-red-400",
    };
  if (isOffPeakHour(hour))
    return {
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-300 dark:border-green-700",
      text: "text-green-700 dark:text-green-400",
    };
  return {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    border: "border-yellow-300 dark:border-yellow-700",
    text: "text-yellow-700 dark:text-yellow-400",
  };
};

export const scheduleToBlocks = (schedule) => {
  return schedule.map((item) => ({
    ...item,
    duration: item.endHour - item.startHour,
    label: getHourRange(item.startHour, item.endHour),
  }));
};

export const detectConflicts = (schedule) => {
  const conflicts = [];
  const devicesByHour = {};

  schedule.forEach((block) => {
    for (let hour = block.startHour; hour < block.endHour; hour++) {
      if (!devicesByHour[hour]) devicesByHour[hour] = [];
      devicesByHour[hour].push(block);
    }
  });

  Object.entries(devicesByHour).forEach(([hour, devices]) => {
    const totalPower = devices.reduce((sum, d) => sum + d.powerW, 0);
    if (totalPower > 10000) {
      conflicts.push({
        hour: parseInt(hour),
        devices: devices.map((d) => d.deviceName),
        totalPower,
        excess: totalPower - 10000,
      });
    }
  });

  return conflicts;
};

export const suggestResolution = (conflicts) => {
  const suggestions = [];

  conflicts.forEach((conflict) => {
    const heaviestDevice = conflict.devices.reduce((prev, curr) => {
      return curr.powerW > prev.powerW ? curr : prev;
    });

    suggestions.push({
      conflict,
      suggestion: `Move ${heaviestDevice.deviceName} to off-peak hours (12 AM - 6 AM) to resolve capacity issue at ${formatHour(conflict.hour)}`,
    });
  });

  return suggestions;
};
