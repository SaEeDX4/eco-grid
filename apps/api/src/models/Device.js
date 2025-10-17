import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "ev_charger",
        "battery",
        "solar",
        "heat_pump",
        "thermostat",
        "smart_plug",
        "water_heater",
        "appliance",
      ],
    },
    brand: String,
    model: String,
    protocols: [
      {
        type: String,
        enum: [
          "ocpp",
          "modbus",
          "bacnet",
          "sunspec",
          "homekit",
          "nest",
          "mqtt",
        ],
      },
    ],
    status: {
      type: String,
      enum: [
        "online",
        "offline",
        "charging",
        "idle",
        "active",
        "standby",
        "generating",
      ],
      default: "offline",
    },
    currentPowerW: {
      type: Number,
      default: 0,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    capabilities: {
      controllable: { type: Boolean, default: false },
      schedulable: { type: Boolean, default: false },
      bidirectional: { type: Boolean, default: false },
    },
    location: String,
    installDate: Date,
  },
  {
    timestamps: true,
  },
);

// Indexes
deviceSchema.index({ ownerId: 1, status: 1 });
deviceSchema.index({ ownerId: 1, type: 1 });

const Device = mongoose.model("Device", deviceSchema);

export default Device;
