import mongoose from "mongoose";
import dotenv from "dotenv";
import VPPMarket from "../models/VPPMarket.js";

dotenv.config();

const markets = [
  {
    name: "BC Hydro Integrated Market",
    code: "BCH",
    region: "BC",
    operator: "BC Hydro",
    status: "active",
    products: [
      {
        type: "energy",
        minBidMW: 1,
        clearingPriceCAD: 85,
        windowDurationMinutes: 60,
      },
      {
        type: "frequency-regulation",
        minBidMW: 0.5,
        clearingPriceCAD: 120,
        windowDurationMinutes: 15,
      },
    ],
    integrationStatus: "simulated",
    timezone: "America/Vancouver",
    currency: "CAD",
    description:
      "BC Hydro integrated electricity market serving British Columbia",
    requirements: {
      minCapacityMW: 1,
      maxCapacityMW: 100,
      settlementPeriodDays: 30,
      bidLeadTimeHours: 24,
    },
  },
  {
    name: "Alberta Electric System Operator",
    code: "AESO",
    region: "AB",
    operator: "AESO",
    status: "active",
    products: [
      {
        type: "energy",
        minBidMW: 1,
        clearingPriceCAD: 95,
        windowDurationMinutes: 60,
      },
      {
        type: "spinning-reserve",
        minBidMW: 1,
        clearingPriceCAD: 45,
        windowDurationMinutes: 60,
      },
      {
        type: "frequency-regulation",
        minBidMW: 1,
        clearingPriceCAD: 130,
        windowDurationMinutes: 15,
      },
    ],
    integrationStatus: "simulated",
    timezone: "America/Edmonton",
    currency: "CAD",
    description: "Alberta deregulated wholesale electricity market",
    requirements: {
      minCapacityMW: 1,
      maxCapacityMW: 200,
      settlementPeriodDays: 30,
      bidLeadTimeHours: 12,
    },
  },
  {
    name: "Independent Electricity System Operator",
    code: "IESO",
    region: "ON",
    operator: "IESO",
    status: "active",
    products: [
      {
        type: "energy",
        minBidMW: 1,
        clearingPriceCAD: 80,
        windowDurationMinutes: 60,
      },
      {
        type: "capacity",
        minBidMW: 5,
        clearingPriceCAD: 65,
        windowDurationMinutes: 1440,
      },
      {
        type: "demand-response",
        minBidMW: 1,
        clearingPriceCAD: 100,
        windowDurationMinutes: 240,
      },
    ],
    integrationStatus: "simulated",
    timezone: "America/Toronto",
    currency: "CAD",
    description: "Ontario electricity market operator",
    requirements: {
      minCapacityMW: 1,
      maxCapacityMW: 150,
      settlementPeriodDays: 30,
      bidLeadTimeHours: 24,
    },
  },
  {
    name: "California ISO",
    code: "CAISO",
    region: "US-WEST",
    operator: "CAISO",
    status: "active",
    products: [
      {
        type: "energy",
        minBidMW: 0.5,
        clearingPriceCAD: 110,
        windowDurationMinutes: 60,
      },
      {
        type: "frequency-regulation",
        minBidMW: 0.5,
        clearingPriceCAD: 140,
        windowDurationMinutes: 15,
      },
      {
        type: "spinning-reserve",
        minBidMW: 1,
        clearingPriceCAD: 50,
        windowDurationMinutes: 60,
      },
    ],
    integrationStatus: "planned",
    apiEndpoint: "https://api.caiso.com",
    timezone: "America/Los_Angeles",
    currency: "CAD",
    description: "California Independent System Operator wholesale market",
    requirements: {
      minCapacityMW: 0.5,
      maxCapacityMW: 500,
      settlementPeriodDays: 45,
      bidLeadTimeHours: 12,
    },
  },
  {
    name: "ENTSO-E Day-Ahead Market",
    code: "ENTSOE",
    region: "EUROPE",
    operator: "ENTSO-E",
    status: "active",
    products: [
      {
        type: "energy",
        minBidMW: 1,
        clearingPriceCAD: 125,
        windowDurationMinutes: 60,
      },
      {
        type: "capacity",
        minBidMW: 5,
        clearingPriceCAD: 70,
        windowDurationMinutes: 1440,
      },
    ],
    integrationStatus: "planned",
    timezone: "Europe/Brussels",
    currency: "CAD",
    description:
      "European Network of Transmission System Operators cross-border market",
    requirements: {
      minCapacityMW: 1,
      maxCapacityMW: 200,
      settlementPeriodDays: 30,
      bidLeadTimeHours: 24,
    },
  },
];

const seedVPPMarkets = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing markets
    await VPPMarket.deleteMany({});
    console.log("Cleared existing markets");

    // Insert markets
    const insertedMarkets = await VPPMarket.insertMany(markets);
    console.log(`Inserted ${insertedMarkets.length} markets`);

    console.log("\nMarkets by Region:");
    const byRegion = {};
    insertedMarkets.forEach((m) => {
      byRegion[m.region] = (byRegion[m.region] || 0) + 1;
    });
    Object.entries(byRegion).forEach(([region, count]) => {
      console.log(`  ${region}: ${count} market(s)`);
    });

    console.log("\nMarkets by Status:");
    const byStatus = {};
    insertedMarkets.forEach((m) => {
      byStatus[m.status] = (byStatus[m.status] || 0) + 1;
    });
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} market(s)`);
    });

    console.log("\nVPP markets seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed VPP markets error:", error);
    process.exit(1);
  }
};

seedVPPMarkets();
