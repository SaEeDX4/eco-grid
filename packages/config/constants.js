// Shared constants across the application

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  PARTNER: "partner",
};

export const DEVICE_TYPES = {
  EV_CHARGER: "ev_charger",
  BATTERY: "battery",
  SOLAR: "solar",
  HEAT_PUMP: "heat_pump",
  THERMOSTAT: "thermostat",
  SMART_PLUG: "smart_plug",
  WATER_HEATER: "water_heater",
};

export const DEVICE_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  CHARGING: "charging",
  IDLE: "idle",
  ACTIVE: "active",
};

export const PROTOCOLS = {
  OCPP: "ocpp",
  MODBUS: "modbus",
  BACNET: "bacnet",
  SUNSPEC: "sunspec",
  HOMEKIT: "homekit",
  NEST: "nest",
};

export const OPTIMIZER_MODES = {
  NORMAL: "normal",
  OFF_PEAK: "off_peak",
  PARTIAL_SHIFT: "partial_shift",
  CUSTOM: "custom",
};

export const LOCALES = {
  EN: "en",
  FA: "fa",
  FR: "fr",
};

export const CURRENCIES = {
  CAD: "CAD",
  USD: "USD",
};

export const TIMEZONE = "America/Vancouver";

export const ALERT_SEVERITY = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
};
