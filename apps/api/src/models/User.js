import mongoose from "mongoose";
import bcrypt from "bcrypt"; // ✅ changed from bcryptjs to bcrypt

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin", "partner"],
      default: "user",
    },
    accountType: {
      type: String,
      enum: ["household", "business"],
      default: "household",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    locale: {
      type: String,
      default: "en",
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
      currency: {
        type: String,
        default: "CAD",
      },
      timezone: {
        type: String,
        default: "America/Vancouver",
      },
    },
    profile: {
      location: String,
      tariff: String,
      householdSize: Number,
      phone: String,
      avatar: String,
    },
    consents: [
      {
        type: {
          type: String,
          required: true,
        },
        granted: {
          type: Boolean,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        ipAddress: String,
      },
    ],
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
