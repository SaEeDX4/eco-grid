import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Pilot from "../models/Pilot.js";

// ✅ Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ✅ Updated: Convert coordinates to GeoJSON format [longitude, latitude]
const pilots = [
  {
    name: "Burnaby Community Solar",
    city: "Burnaby",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-122.9805, 49.2488],
    },
    deviceTypes: ["solar", "battery"],
  },
  {
    name: "Vancouver Smart Grid",
    city: "Vancouver",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-123.1207, 49.2827],
    },
    deviceTypes: ["solar", "ev-charger", "thermostat"],
  },
  {
    name: "Surrey EV Pilot",
    city: "Surrey",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-122.8011, 49.1044],
    },
    deviceTypes: ["ev-charger"],
  },
  {
    name: "Richmond Energy Hub",
    city: "Richmond",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-123.1336, 49.1666],
    },
    deviceTypes: ["battery", "heat-pump"],
  },
  {
    name: "Coquitlam Heat Recovery",
    city: "Coquitlam",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-122.7932, 49.2838],
    },
    deviceTypes: ["heat-pump"],
  },
  {
    name: "Victoria Smart Home Project",
    city: "Victoria",
    region: "Vancouver Island",
    coordinates: {
      type: "Point",
      coordinates: [-123.3656, 48.4284],
    },
    deviceTypes: ["thermostat", "solar"],
  },
  {
    name: "Nanaimo Solar Pilot",
    city: "Nanaimo",
    region: "Vancouver Island",
    coordinates: {
      type: "Point",
      coordinates: [-123.9401, 49.1659],
    },
    deviceTypes: ["solar"],
  },
  {
    name: "Kamloops Battery Program",
    city: "Kamloops",
    region: "Interior",
    coordinates: {
      type: "Point",
      coordinates: [-120.3273, 50.6745],
    },
    deviceTypes: ["battery"],
  },
  {
    name: "Kelowna Smart Energy",
    city: "Kelowna",
    region: "Interior",
    coordinates: {
      type: "Point",
      coordinates: [-119.496, 49.888],
    },
    deviceTypes: ["heat-pump", "solar"],
  },
  {
    name: "Prince George EV Network",
    city: "Prince George",
    region: "Northern BC",
    coordinates: {
      type: "Point",
      coordinates: [-122.7497, 53.9171],
    },
    deviceTypes: ["ev-charger"],
  },
  {
    name: "Cranbrook Clean Energy",
    city: "Cranbrook",
    region: "Kootenays",
    coordinates: {
      type: "Point",
      coordinates: [-115.7694, 49.512],
    },
    deviceTypes: ["solar", "battery"],
  },
  {
    name: "Whistler Resort Efficiency",
    city: "Whistler",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-122.9574, 50.1163],
    },
    deviceTypes: ["heat-pump", "thermostat"],
  },
  {
    name: "Abbotsford Microgrid",
    city: "Abbotsford",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-122.3045, 49.0504],
    },
    deviceTypes: ["battery", "solar"],
  },
  {
    name: "Chilliwack Thermal Control",
    city: "Chilliwack",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-121.9515, 49.1579],
    },
    deviceTypes: ["thermostat"],
  },
  {
    name: "Langley Clean Energy",
    city: "Langley",
    region: "Lower Mainland",
    coordinates: {
      type: "Point",
      coordinates: [-122.6604, 49.1044],
    },
    deviceTypes: ["solar", "ev-charger"],
  },
];

// ✅ Random metrics generator (no change)
const addRandomMetrics = (pilot) => ({
  ...pilot,
  status: "active",
  metrics: {
    energySaved: Math.floor(Math.random() * 5000) + 1000,
    co2Reduced: Math.floor(Math.random() * 200) + 50,
    costSavings: Math.floor(Math.random() * 10000) + 1000,
    activeDevices: Math.floor(Math.random() * 10) + 1,
    totalDevices: Math.floor(Math.random() * 15) + 5,
    uptime: Math.floor(Math.random() * 20) + 80,
  },
});

const seedPilots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Pilot.deleteMany({});
    console.log("🧹 Cleared existing pilots");

    const pilotsWithMetrics = pilots.map(addRandomMetrics);
    await Pilot.insertMany(pilotsWithMetrics);

    console.log(`🚀 Inserted ${pilotsWithMetrics.length} pilots successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedPilots();
