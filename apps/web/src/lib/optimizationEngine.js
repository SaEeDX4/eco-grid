// Client-side optimization logic for quick calculations

export const TARIFF_RATES = {
  peak: 0.18, // 4 PM - 9 PM weekdays
  midPeak: 0.13, // 7 AM - 11 AM, 5 PM - 7 PM weekdays
  offPeak: 0.082, // All other times
  weekend: 0.082, // All weekend
};

export const PEAK_HOURS = {
  weekday: {
    peak: [16, 17, 18, 19, 20],
    midPeak: [7, 8, 9, 10, 17, 18],
    offPeak: [0, 1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 21, 22, 23],
  },
  weekend: {
    offPeak: Array.from({ length: 24 }, (_, i) => i),
  },
};

export const calculateCost = (powerKW, hours, rate) => {
  return powerKW * hours * rate;
};

export const getRateForHour = (hour, isWeekend = false) => {
  if (isWeekend) return TARIFF_RATES.weekend;

  if (PEAK_HOURS.weekday.peak.includes(hour)) return TARIFF_RATES.peak;
  if (PEAK_HOURS.weekday.midPeak.includes(hour)) return TARIFF_RATES.midPeak;
  return TARIFF_RATES.offPeak;
};

export const calculateDailyCost = (schedule) => {
  let totalCost = 0;

  schedule.forEach((block) => {
    const powerKW = block.powerW / 1000;
    const duration = block.endHour - block.startHour;

    for (let hour = block.startHour; hour < block.endHour; hour++) {
      const rate = getRateForHour(hour, block.isWeekend);
      totalCost += calculateCost(powerKW, 1, rate);
    }
  });

  return totalCost;
};

export const optimizeSchedule = (devices, mode = "off_peak") => {
  const schedule = [];

  switch (mode) {
    case "normal":
      // Keep current schedule
      devices.forEach((device) => {
        schedule.push({
          deviceId: device.id,
          deviceName: device.name,
          powerW: device.powerW,
          startHour: device.currentStartHour || 8,
          endHour: device.currentEndHour || 18,
          isWeekend: false,
        });
      });
      break;

    case "off_peak":
      // Move flexible loads to off-peak hours (12 AM - 6 AM)
      devices.forEach((device) => {
        if (device.flexible) {
          const duration = device.requiredHours || 4;
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            powerW: device.powerW,
            startHour: 0,
            endHour: Math.min(duration, 6),
            isWeekend: false,
          });
        } else {
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            powerW: device.powerW,
            startHour: device.currentStartHour || 8,
            endHour: device.currentEndHour || 18,
            isWeekend: false,
          });
        }
      });
      break;

    case "partial":
      // Shift 50% of flexible loads
      devices.forEach((device) => {
        if (device.flexible && Math.random() > 0.5) {
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            powerW: device.powerW,
            startHour: 22,
            endHour: 6,
            isWeekend: false,
          });
        } else {
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            powerW: device.powerW,
            startHour: device.currentStartHour || 8,
            endHour: device.currentEndHour || 18,
            isWeekend: false,
          });
        }
      });
      break;

    default:
      // Custom mode - return devices as-is for user editing
      devices.forEach((device) => {
        schedule.push({
          deviceId: device.id,
          deviceName: device.name,
          powerW: device.powerW,
          startHour: device.currentStartHour || 8,
          endHour: device.currentEndHour || 18,
          isWeekend: false,
        });
      });
  }

  return schedule;
};

export const calculateSavings = (beforeSchedule, afterSchedule) => {
  const beforeCost = calculateDailyCost(beforeSchedule);
  const afterCost = calculateDailyCost(afterSchedule);
  const savings = beforeCost - afterCost;
  const percentSaved = beforeCost > 0 ? (savings / beforeCost) * 100 : 0;

  return {
    beforeCost,
    afterCost,
    dailySavings: savings,
    monthlySavings: savings * 30,
    yearlySavings: savings * 365,
    percentSaved,
    co2Reduced: savings * 365 * 0.35, // Rough estimate: 0.35 kg CO2 per kWh saved
  };
};

export const validateSchedule = (schedule) => {
  const errors = [];
  const warnings = [];

  // Check for overlapping high-power devices
  const powerByHour = new Array(24).fill(0);

  schedule.forEach((block) => {
    for (let hour = block.startHour; hour < block.endHour; hour++) {
      powerByHour[hour] += block.powerW;

      if (powerByHour[hour] > 10000) {
        // 10kW limit
        errors.push(
          `Hour ${hour}:00 exceeds 10kW capacity (${(powerByHour[hour] / 1000).toFixed(1)}kW)`,
        );
      }
    }
  });

  // Check for devices running during peak hours
  schedule.forEach((block) => {
    for (let hour = block.startHour; hour < block.endHour; hour++) {
      if (PEAK_HOURS.weekday.peak.includes(hour) && block.powerW > 3000) {
        warnings.push(
          `${block.deviceName} runs during peak hours (${hour}:00)`,
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
