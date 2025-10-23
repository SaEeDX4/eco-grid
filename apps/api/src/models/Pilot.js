import mongoose from "mongoose";

const pilotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
      enum: [
        "Lower Mainland",
        "Vancouver Island",
        "Interior",
        "Northern BC",
        "Kootenays",
      ],
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    deviceTypes: [
      {
        type: String,
        enum: ["solar", "ev-charger", "battery", "heat-pump", "thermostat"],
      },
    ],
    status: {
      type: String,
      enum: ["active", "idle", "maintenance", "offline"],
      default: "active",
    },
    metrics: {
      energySaved: {
        type: Number,
        default: 0,
        min: 0,
      },
      co2Reduced: {
        type: Number,
        default: 0,
        min: 0,
      },
      costSavings: {
        type: Number,
        default: 0,
        min: 0,
      },
      activeDevices: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalDevices: {
        type: Number,
        default: 0,
        min: 0,
      },
      uptime: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
    },
    contactInfo: {
      email: String,
      phone: String,
      manager: String,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    description: String,
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location queries
pilotSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });
pilotSchema.index({ region: 1, status: 1 });
pilotSchema.index({ status: 1 });

// Create 2dsphere index for geospatial queries
pilotSchema.index({
  coordinates: "2dsphere",
});

// Static method to find nearby pilots
pilotSchema.statics.findNearby = function (
  longitude,
  latitude,
  maxDistance = 50000
) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
    status: { $ne: "offline" },
  });
};

// Static method to get aggregate metrics
pilotSchema.statics.getAggregateMetrics = async function (filters = {}) {
  const match = { status: { $ne: "offline" }, ...filters };

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalEnergy: { $sum: "$metrics.energySaved" },
        totalCO2: { $sum: "$metrics.co2Reduced" },
        totalSavings: { $sum: "$metrics.costSavings" },
        totalPilots: { $sum: 1 },
        totalDevices: { $sum: "$metrics.totalDevices" },
        activeDevices: { $sum: "$metrics.activeDevices" },
      },
    },
  ]);

  return (
    result[0] || {
      totalEnergy: 0,
      totalCO2: 0,
      totalSavings: 0,
      totalPilots: 0,
      totalDevices: 0,
      activeDevices: 0,
    }
  );
};

// Instance method to update last active
pilotSchema.methods.updateLastActive = async function () {
  this.lastActive = new Date();
  await this.save();
};

const Pilot = mongoose.model("Pilot", pilotSchema);

export default Pilot;
