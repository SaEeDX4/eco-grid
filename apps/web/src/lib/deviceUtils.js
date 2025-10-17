// Utility functions for device operations

export const formatPower = (watts) => {
  if (watts === 0) return "0 W";
  if (Math.abs(watts) < 1000) return `${watts.toFixed(1)} W`;
  return `${(watts / 1000).toFixed(2)} kW`;
};

export const calculateDailyCost = (powerW, hours = 24, rate = 0.12) => {
  const kWh = (powerW / 1000) * hours;
  return (kWh * rate).toFixed(2);
};

export const calculateMonthlyCost = (powerW, rate = 0.12) => {
  return calculateDailyCost(powerW, 24 * 30, rate);
};

export const groupDevicesByType = (devices) => {
  return devices.reduce((groups, device) => {
    const type = device.type || "other";
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(device);
    return groups;
  }, {});
};

export const getDeviceTypeName = (type) => {
  const names = {
    ev_charger: "EV Charger",
    battery: "Battery Storage",
    solar: "Solar Panels",
    heat_pump: "Heat Pump",
    thermostat: "Smart Thermostat",
    smart_plug: "Smart Plug",
    water_heater: "Water Heater",
    appliance: "Appliance",
    hub: "Energy Hub",
    sensor: "Sensor",
  };
  return names[type] || "Device";
};

export const getDeviceTypeNames = (type) => {
  const names = {
    ev_charger: "EV Chargers",
    battery: "Battery Storage",
    solar: "Solar Panels",
    heat_pump: "Heat Pumps",
    thermostat: "Thermostats",
    smart_plug: "Smart Plugs",
    water_heater: "Water Heaters",
    appliance: "Appliances",
    hub: "Energy Hubs",
    sensor: "Sensors",
  };
  return names[type] || "Devices";
};

export const isStandby = (device) => {
  return device.status === "standby" && device.powerW > 0 && device.powerW < 50;
};

export const getDeviceHealth = (device) => {
  const now = new Date();
  const lastSeen = new Date(device.lastSeen);
  const minutesSinceLastSeen = (now - lastSeen) / (1000 * 60);

  if (minutesSinceLastSeen > 60)
    return { status: "offline", message: "Device offline" };
  if (device.status === "error")
    return { status: "error", message: "Device error" };
  if (isStandby(device))
    return { status: "warning", message: "Standby power detected" };
  return { status: "healthy", message: "Operating normally" };
};

export const mockDevices = [
  {
    id: "1",
    name: "Tesla Model 3 Charger",
    type: "ev_charger",
    brand: "Tesla",
    status: "charging",
    powerW: 7200,
    lastSeen: new Date().toISOString(),
    batteryLevel: 65,
    estimatedTimeToFull: "2.5 hours",
  },
  {
    id: "2",
    name: "Home Battery",
    type: "battery",
    brand: "Tesla Powerwall",
    status: "active",
    powerW: -1500,
    lastSeen: new Date().toISOString(),
    batteryLevel: 85,
    mode: "Self-Powered",
  },
  {
    id: "3",
    name: "Rooftop Solar",
    type: "solar",
    brand: "Canadian Solar",
    status: "generating",
    powerW: -4200,
    lastSeen: new Date().toISOString(),
    todayGeneration: 28.5,
  },
  {
    id: "4",
    name: "Heat Pump",
    type: "heat_pump",
    brand: "Mitsubishi",
    status: "active",
    powerW: 2500,
    lastSeen: new Date().toISOString(),
    temperature: 21,
    targetTemperature: 22,
  },
  {
    id: "5",
    name: "Smart Thermostat",
    type: "thermostat",
    brand: "Nest",
    status: "online",
    powerW: 5,
    lastSeen: new Date().toISOString(),
    temperature: 21.5,
    targetTemperature: 22,
    mode: "Heat",
  },
  {
    id: "6",
    name: "Water Heater",
    type: "water_heater",
    brand: "Rheem",
    status: "standby",
    powerW: 15,
    lastSeen: new Date().toISOString(),
    temperature: 55,
  },
  {
    id: "7",
    name: "Kitchen Plug",
    type: "smart_plug",
    brand: "TP-Link",
    status: "online",
    powerW: 0,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Garage Plug",
    type: "smart_plug",
    brand: "TP-Link",
    status: "standby",
    powerW: 8,
    lastSeen: new Date().toISOString(),
  },
];

export const getDeviceColor = (type = "default") => {
  switch (type) {
    case "solar":
      return "#facc15"; // yellow
    case "battery":
      return "#4ade80"; // green
    case "grid":
      return "#60a5fa"; // blue
    default:
      return "#94a3b8"; // gray
  }
};

// ✅ Added minimal missing export — no UI change
export const getDeviceIcon = (type = "default") => {
  const icons = {
    solar: "solar",
    battery: "battery",
    ev_charger: "ev_charger",
    thermostat: "thermostat",
    smart_plug: "smart_plug",
    water_heater: "water_heater",
    appliance: "appliance",
    heat_pump: "heat_pump",
    hub: "hub",
    sensor: "sensor",
    default: "device",
  };
  return icons[type] || icons.default;
};
