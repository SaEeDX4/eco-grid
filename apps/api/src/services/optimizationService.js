// Backend optimization logic

const TARIFF_RATES = {
  peak: 0.18,
  midPeak: 0.13,
  offPeak: 0.082,
  weekend: 0.082,
};

const PEAK_HOURS = {
  weekday: {
    peak: [16, 17, 18, 19, 20],
    midPeak: [7, 8, 9, 10, 17, 18],
    offPeak: [0, 1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 21, 22, 23],
  },
  weekend: {
    offPeak: Array.from({ length: 24 }, (_, i) => i),
  },
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

    for (let hour = block.startHour; hour < block.endHour; hour++) {
      const rate = getRateForHour(hour, block.isWeekend);
      totalCost += powerKW * rate;
    }
  });

  return totalCost;
};

export const optimizeSchedule = (devices, mode = "off_peak") => {
  const schedule = [];

  switch (mode) {
    case "normal":
      devices.forEach((device) => {
        schedule.push({
          deviceId: device.id,
          deviceName: device.name,
          deviceType: device.type,
          powerW: device.powerW,
          startHour: device.currentStartHour || 8,
          endHour: device.currentEndHour || 18,
          isWeekend: false,
        });
      });
      break;

    case "off_peak":
      devices.forEach((device) => {
        if (device.flexible) {
          const duration = device.requiredHours || 4;
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            deviceType: device.type,
            powerW: device.powerW,
            startHour: 0,
            endHour: Math.min(duration, 6),
            isWeekend: false,
          });
        } else {
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            deviceType: device.type,
            powerW: device.powerW,
            startHour: device.currentStartHour || 8,
            endHour: device.currentEndHour || 18,
            isWeekend: false,
          });
        }
      });
      break;

    case "partial":
      devices.forEach((device, index) => {
        if (device.flexible && index % 2 === 0) {
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            deviceType: device.type,
            powerW: device.powerW,
            startHour: 22,
            endHour: 6,
            isWeekend: false,
          });
        } else {
          schedule.push({
            deviceId: device.id,
            deviceName: device.name,
            deviceType: device.type,
            powerW: device.powerW,
            startHour: device.currentStartHour || 8,
            endHour: device.currentEndHour || 18,
            isWeekend: false,
          });
        }
      });
      break;

    default:
      devices.forEach((device) => {
        schedule.push({
          deviceId: device.id,
          deviceName: device.name,
          deviceType: device.type,
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
    co2Reduced: savings * 365 * 0.35,
  };
};

export const validateSchedule = (schedule) => {
  const errors = [];
  const warnings = [];

  const powerByHour = new Array(24).fill(0);

  schedule.forEach((block) => {
    for (let hour = block.startHour; hour < block.endHour; hour++) {
      powerByHour[hour] += block.powerW;

      if (powerByHour[hour] > 10000) {
        errors.push(
          `Hour ${hour}:00 exceeds 10kW capacity (${(powerByHour[hour] / 1000).toFixed(1)}kW)`,
        );
      }
    }
  });

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
