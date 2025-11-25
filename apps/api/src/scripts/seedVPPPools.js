import mongoose from "mongoose";
import dotenv from "dotenv";
import VPPPool from "../models/VPPPool.js";
import VPPMarket from "../models/VPPMarket.js";

dotenv.config();

const seedVPPPools = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get markets
    const bchMarket = await VPPMarket.findOne({ code: "BCH" });
    const aesoMarket = await VPPMarket.findOne({ code: "AESO" });
    const iesoMarket = await VPPMarket.findOne({ code: "IESO" });
    const caisoMarket = await VPPMarket.findOne({ code: "CAISO" });

    if (!bchMarket || !aesoMarket || !iesoMarket) {
      console.error("Required markets not found. Run seedVPPMarkets.js first.");
      process.exit(1);
    }

    // Clear existing pools
    await VPPPool.deleteMany({});
    console.log("Cleared existing pools");

    const pools = [
      {
        name: "BC Metro Energy Pool",
        description:
          "Residential battery and EV aggregation pool serving Greater Vancouver and Victoria. Optimized for peak shaving and frequency regulation.",
        region: "BC",
        market: bchMarket._id,
        status: "active",
        capacity: {
          totalMW: 3.5,
          availableMW: 3.2,
          committedMW: 0.3,
          targetMW: 10,
        },
        members: [],
        strategy: {
          marketProducts: ["energy", "frequency-regulation"],
          bidWindows: ["peak-evening", "morning-ramp"],
          socLimits: {
            min: 20,
            max: 90,
          },
          maxCyclesPerDay: 2,
          riskTolerance: "moderate",
        },
        performance: {
          revenue30d: 8500,
          revenue90d: 24200,
          revenueAllTime: 48000,
          dispatches30d: 156,
          reliability: 97.5,
          avgRevenuePerMW: 2428,
        },
        fees: {
          platformPercent: 15,
          operatorPercent: 5,
        },
        requirements: {
          minCapacityKW: 5,
          deviceTypes: ["battery", "ev-charger"],
          locationRestrictions: ["Vancouver", "Victoria", "Burnaby", "Surrey"],
        },
        settings: {
          autoEnroll: false,
          allowPartialDischarge: true,
          notifyBeforeDispatch: true,
        },
      },
      {
        name: "BC Residential Flex Pool",
        description:
          "Large residential aggregation pool focusing on demand response and load shifting. Includes thermostats, water heaters, and controllable loads.",
        region: "BC",
        market: bchMarket._id,
        status: "full",
        capacity: {
          totalMW: 10.2,
          availableMW: 9.8,
          committedMW: 0.4,
          targetMW: 10,
        },
        members: [],
        strategy: {
          marketProducts: ["energy", "demand-response"],
          bidWindows: ["all-day"],
          socLimits: {
            min: 15,
            max: 95,
          },
          maxCyclesPerDay: 3,
          riskTolerance: "conservative",
        },
        performance: {
          revenue30d: 18400,
          revenue90d: 52800,
          revenueAllTime: 125000,
          dispatches30d: 284,
          reliability: 98.2,
          avgRevenuePerMW: 1803,
        },
        fees: {
          platformPercent: 12,
          operatorPercent: 5,
        },
        requirements: {
          minCapacityKW: 3,
          deviceTypes: ["battery", "ev-charger", "thermostat", "water-heater"],
          locationRestrictions: [],
        },
        settings: {
          autoEnroll: false,
          allowPartialDischarge: true,
          notifyBeforeDispatch: true,
        },
      },
      {
        name: "Alberta Energy Arbitrage Pool",
        description:
          "High-performance pool targeting Alberta's volatile energy market. Battery-only pool optimized for energy arbitrage and spinning reserves.",
        region: "AB",
        market: aesoMarket._id,
        status: "active",
        capacity: {
          totalMW: 5.8,
          availableMW: 5.5,
          committedMW: 0.3,
          targetMW: 15,
        },
        members: [],
        strategy: {
          marketProducts: [
            "energy",
            "spinning-reserve",
            "frequency-regulation",
          ],
          bidWindows: ["peak-hours", "high-volatility"],
          socLimits: {
            min: 25,
            max: 85,
          },
          maxCyclesPerDay: 2,
          riskTolerance: "aggressive",
        },
        performance: {
          revenue30d: 15600,
          revenue90d: 44200,
          revenueAllTime: 92000,
          dispatches30d: 198,
          reliability: 95.8,
          avgRevenuePerMW: 2689,
        },
        fees: {
          platformPercent: 18,
          operatorPercent: 7,
        },
        requirements: {
          minCapacityKW: 10,
          deviceTypes: ["battery"],
          locationRestrictions: [],
        },
        settings: {
          autoEnroll: false,
          allowPartialDischarge: true,
          notifyBeforeDispatch: false,
        },
      },
      {
        name: "Ontario Capacity Pool",
        description:
          "Capacity-focused pool providing grid reliability services to IESO. Stable, predictable revenue with lower cycling requirements.",
        region: "ON",
        market: iesoMarket._id,
        status: "active",
        capacity: {
          totalMW: 8.2,
          availableMW: 7.9,
          committedMW: 0.3,
          targetMW: 20,
        },
        members: [],
        strategy: {
          marketProducts: ["capacity", "demand-response"],
          bidWindows: ["daily"],
          socLimits: {
            min: 30,
            max: 80,
          },
          maxCyclesPerDay: 1,
          riskTolerance: "conservative",
        },
        performance: {
          revenue30d: 12200,
          revenue90d: 35800,
          revenueAllTime: 78000,
          dispatches30d: 142,
          reliability: 99.1,
          avgRevenuePerMW: 1487,
        },
        fees: {
          platformPercent: 10,
          operatorPercent: 5,
        },
        requirements: {
          minCapacityKW: 5,
          deviceTypes: ["battery", "ev-charger", "thermostat"],
          locationRestrictions: [],
        },
        settings: {
          autoEnroll: true,
          allowPartialDischarge: true,
          notifyBeforeDispatch: true,
        },
      },
      {
        name: "Pacific Northwest Pilot Pool",
        description:
          "Cross-border pilot pool testing US-Canada VPP coordination. Limited capacity for early adopters.",
        region: "US-WEST",
        market: caisoMarket ? caisoMarket._id : bchMarket._id,
        status: "active",
        capacity: {
          totalMW: 2.1,
          availableMW: 2.0,
          committedMW: 0.1,
          targetMW: 5,
        },
        members: [],
        strategy: {
          marketProducts: ["energy", "frequency-regulation"],
          bidWindows: ["peak-hours"],
          socLimits: {
            min: 20,
            max: 90,
          },
          maxCyclesPerDay: 2,
          riskTolerance: "moderate",
        },
        performance: {
          revenue30d: 4800,
          revenue90d: 13500,
          revenueAllTime: 18000,
          dispatches30d: 86,
          reliability: 96.5,
          avgRevenuePerMW: 2285,
        },
        fees: {
          platformPercent: 20,
          operatorPercent: 5,
        },
        requirements: {
          minCapacityKW: 10,
          deviceTypes: ["battery"],
          locationRestrictions: ["Washington", "Oregon", "BC"],
        },
        settings: {
          autoEnroll: false,
          allowPartialDischarge: true,
          notifyBeforeDispatch: true,
        },
      },
    ];

    const insertedPools = await VPPPool.insertMany(pools);
    console.log(`Inserted ${insertedPools.length} pools`);

    console.log("\nPools by Region:");
    const byRegion = {};
    insertedPools.forEach((p) => {
      byRegion[p.region] = (byRegion[p.region] || 0) + 1;
    });
    Object.entries(byRegion).forEach(([region, count]) => {
      console.log(`  ${region}: ${count} pool(s)`);
    });

    console.log("\nPools by Status:");
    const byStatus = {};
    insertedPools.forEach((p) => {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    });
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} pool(s)`);
    });

    console.log("\nTotal Capacity:");
    const totalCapacity = insertedPools.reduce(
      (sum, p) => sum + p.capacity.totalMW,
      0
    );
    const totalTarget = insertedPools.reduce(
      (sum, p) => sum + p.capacity.targetMW,
      0
    );
    console.log(`  Current: ${totalCapacity.toFixed(1)} MW`);
    console.log(`  Target: ${totalTarget.toFixed(1)} MW`);
    console.log(`  Fill: ${((totalCapacity / totalTarget) * 100).toFixed(1)}%`);

    console.log("\nVPP pools seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed VPP pools error:", error);
    process.exit(1);
  }
};

seedVPPPools();
