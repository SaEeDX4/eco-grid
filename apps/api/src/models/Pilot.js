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

    // ✅ FIXED: use GeoJSON format compatible with 2dsphere index
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (arr) {
            return (
              Array.isArray(arr) &&
              arr.length === 2 &&
              arr[0] >= -180 &&
              arr[0] <= 180 &&
              arr[1] >= -90 &&
              arr[1] <= 90
            );
          },
          message: "Coordinates must be [longitude, latitude]",
        },
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

// ✅ Indexes (keep all previous ones)
pilotSchema.index({ region: 1, status: 1 });
pilotSchema.index({ status: 1 });
pilotSchema.index({ coordinates: "2dsphere" }); // now valid with GeoJSON

// ✅ Static method to find nearby pilots
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

// ✅ Static method to get aggregate metrics
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

// ✅ Instance method to update last active
pilotSchema.methods.updateLastActive = async function () {
  this.lastActive = new Date();
  await this.save();
};

const Pilot = mongoose.model("Pilot", pilotSchema);

export default Pilot;
