import mongoose from "mongoose";

const poolMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
    contributionKW: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "active",
    },
    reliability: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const vppPoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
      enum: [
        "BC",
        "AB",
        "SK",
        "MB",
        "ON",
        "QC",
        "CA-WEST",
        "CA-EAST",
        "US-WEST",
        "US-EAST",
      ],
    },
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VPPMarket",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "full", "paused", "closed"],
      default: "active",
    },
    capacity: {
      totalMW: {
        type: Number,
        default: 0,
      },
      availableMW: {
        type: Number,
        default: 0,
      },
      committedMW: {
        type: Number,
        default: 0,
      },
      targetMW: {
        type: Number,
        required: true,
      },
    },
    members: [poolMemberSchema],
    strategy: {
      marketProducts: [
        {
          type: String,
          enum: [
            "energy",
            "capacity",
            "frequency-regulation",
            "spinning-reserve",
            "demand-response",
          ],
        },
      ],
      bidWindows: [
        {
          type: String,
        },
      ],
      socLimits: {
        min: {
          type: Number,
          default: 20,
        },
        max: {
          type: Number,
          default: 90,
        },
      },
      maxCyclesPerDay: {
        type: Number,
        default: 2,
      },
      riskTolerance: {
        type: String,
        enum: ["conservative", "moderate", "aggressive"],
        default: "moderate",
      },
    },
    performance: {
      revenue30d: {
        type: Number,
        default: 0,
      },
      revenue90d: {
        type: Number,
        default: 0,
      },
      revenueAllTime: {
        type: Number,
        default: 0,
      },
      dispatches30d: {
        type: Number,
        default: 0,
      },
      reliability: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      avgRevenuePerMW: {
        type: Number,
        default: 0,
      },
    },
    fees: {
      platformPercent: {
        type: Number,
        default: 15,
        min: 0,
        max: 50,
      },
      operatorPercent: {
        type: Number,
        default: 5,
        min: 0,
        max: 20,
      },
    },
    requirements: {
      minCapacityKW: {
        type: Number,
        default: 5,
      },
      deviceTypes: [
        {
          type: String,
          enum: [
            "battery",
            "ev-charger",
            "thermostat",
            "water-heater",
            "pool-pump",
          ],
        },
      ],
      locationRestrictions: [String],
    },
    settings: {
      autoEnroll: {
        type: Boolean,
        default: false,
      },
      allowPartialDischarge: {
        type: Boolean,
        default: true,
      },
      notifyBeforeDispatch: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vppPoolSchema.index({ region: 1, status: 1 });
vppPoolSchema.index({ market: 1 });
vppPoolSchema.index({ status: 1, "capacity.availableMW": 1 });
vppPoolSchema.index({ "members.userId": 1 });

// Virtual for member count
vppPoolSchema.virtual("memberCount").get(function () {
  return this.members.filter((m) => m.status === "active").length;
});

// Virtual for fill percentage
vppPoolSchema.virtual("fillPercentage").get(function () {
  return Math.round((this.capacity.totalMW / this.capacity.targetMW) * 100);
});

// Method to add member
vppPoolSchema.methods.addMember = async function (
  userId,
  deviceIds,
  contributionKW
) {
  // Check if already a member
  const existingMember = this.members.find(
    (m) => m.userId.toString() === userId.toString()
  );
  if (existingMember) {
    throw new Error("User is already a member of this pool");
  }

  // Check if pool is full
  if (
    this.status === "full" ||
    this.capacity.totalMW >= this.capacity.targetMW
  ) {
    throw new Error("Pool is full");
  }

  // Add member
  this.members.push({
    userId,
    deviceIds,
    contributionKW,
    joinedAt: new Date(),
    status: "active",
    reliability: 100,
  });

  // Update capacity
  this.capacity.totalMW += contributionKW / 1000;
  this.capacity.availableMW += contributionKW / 1000;

  // Check if pool is now full
  if (this.capacity.totalMW >= this.capacity.targetMW) {
    this.status = "full";
  }

  await this.save();
  return this;
};

// Method to remove member
vppPoolSchema.methods.removeMember = async function (userId) {
  const memberIndex = this.members.findIndex(
    (m) => m.userId.toString() === userId.toString()
  );

  if (memberIndex === -1) {
    throw new Error("User is not a member of this pool");
  }

  const member = this.members[memberIndex];
  const contributionKW = member.contributionKW;

  // Remove member
  this.members.splice(memberIndex, 1);

  // Update capacity
  this.capacity.totalMW -= contributionKW / 1000;
  this.capacity.availableMW -= contributionKW / 1000;

  // Update status if no longer full
  if (
    this.status === "full" &&
    this.capacity.totalMW < this.capacity.targetMW
  ) {
    this.status = "active";
  }

  await this.save();
  return this;
};

// Method to update member contribution
vppPoolSchema.methods.updateMemberContribution = async function (
  userId,
  newContributionKW
) {
  const member = this.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  if (!member) {
    throw new Error("User is not a member of this pool");
  }

  const oldContribution = member.contributionKW;
  const delta = newContributionKW - oldContribution;

  member.contributionKW = newContributionKW;

  // Update capacity
  this.capacity.totalMW += delta / 1000;
  this.capacity.availableMW += delta / 1000;

  await this.save();
  return this;
};

// Static method to get user pools
vppPoolSchema.statics.getUserPools = function (userId) {
  return this.find({ "members.userId": userId, "members.status": "active" })
    .populate("market")
    .lean();
};

const VPPPool = mongoose.model("VPPPool", vppPoolSchema);

export default VPPPool;
