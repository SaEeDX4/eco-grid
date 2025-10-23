import mongoose from "mongoose";
import dotenv from "dotenv";
import Pilot from "../models/Pilot.js";

dotenv.config();

const pilots = [
  {
    name: "Downtown Vancouver Office Complex",
    city: "Vancouver",
    region: "Lower Mainland",
    coordinates: {
      latitude: 49.2827,
      longitude: -123.1207,
    },
    deviceTypes: ["solar", "ev-charger", "battery", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 450000, // kWh
      co2Reduced: 225,
      costSavings: 67500,
      activeDevices: 48,
      totalDevices: 50,
      uptime: 98.5,
    },
    contactInfo: {
      email: "vancouver@ecogrid.ca",
      phone: "604-555-0101",
      manager: "Sarah Chen",
    },
    startDate: new Date("2024-01-15"),
    description:
      "Large commercial office complex with rooftop solar, EV charging stations, and smart building management.",
    featured: true,
  },
  {
    name: "Richmond Community Center",
    city: "Richmond",
    region: "Lower Mainland",
    coordinates: {
      latitude: 49.1666,
      longitude: -123.1336,
    },
    deviceTypes: ["solar", "heat-pump", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 180000,
      co2Reduced: 90,
      costSavings: 27000,
      activeDevices: 22,
      totalDevices: 25,
      uptime: 99.2,
    },
    contactInfo: {
      email: "richmond@ecogrid.ca",
      phone: "604-555-0102",
      manager: "Linda Martinez",
    },
    startDate: new Date("2024-02-01"),
    description:
      "Municipal facility serving as a showcase for community energy efficiency.",
    featured: true,
  },
  {
    name: "Burnaby Manufacturing Plant",
    city: "Burnaby",
    region: "Lower Mainland",
    coordinates: {
      latitude: 49.2488,
      longitude: -122.9805,
    },
    deviceTypes: ["solar", "battery", "heat-pump"],
    status: "active",
    metrics: {
      energySaved: 620000,
      co2Reduced: 310,
      costSavings: 93000,
      activeDevices: 35,
      totalDevices: 38,
      uptime: 97.8,
    },
    contactInfo: {
      email: "burnaby@ecogrid.ca",
      phone: "604-555-0103",
      manager: "James Park",
    },
    startDate: new Date("2023-11-20"),
    description:
      "Industrial facility with advanced energy management and peak demand optimization.",
    featured: false,
  },
  {
    name: "Victoria Government Buildings",
    city: "Victoria",
    region: "Vancouver Island",
    coordinates: {
      latitude: 48.4284,
      longitude: -123.3656,
    },
    deviceTypes: ["solar", "ev-charger", "battery", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 520000,
      co2Reduced: 260,
      costSavings: 78000,
      activeDevices: 62,
      totalDevices: 65,
      uptime: 99.5,
    },
    contactInfo: {
      email: "victoria@ecogrid.ca",
      phone: "250-555-0101",
      manager: "Emily Foster",
    },
    startDate: new Date("2024-01-05"),
    description:
      "Provincial government office complex leading by example in energy efficiency.",
    featured: true,
  },
  {
    name: "Nanaimo Hospital Complex",
    city: "Nanaimo",
    region: "Vancouver Island",
    coordinates: {
      latitude: 49.1659,
      longitude: -123.9401,
    },
    deviceTypes: ["battery", "heat-pump", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 380000,
      co2Reduced: 190,
      costSavings: 57000,
      activeDevices: 44,
      totalDevices: 48,
      uptime: 98.9,
    },
    contactInfo: {
      email: "nanaimo@ecogrid.ca",
      phone: "250-555-0102",
      manager: "Dr. Robert Kim",
    },
    startDate: new Date("2024-03-10"),
    description:
      "Healthcare facility ensuring reliable, efficient energy for critical operations.",
    featured: false,
  },
  {
    name: "Kelowna University Campus",
    city: "Kelowna",
    region: "Interior",
    coordinates: {
      latitude: 49.888,
      longitude: -119.496,
    },
    deviceTypes: ["solar", "ev-charger", "battery", "heat-pump", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 890000,
      co2Reduced: 445,
      costSavings: 133500,
      activeDevices: 78,
      totalDevices: 82,
      uptime: 99.1,
    },
    contactInfo: {
      email: "kelowna@ecogrid.ca",
      phone: "250-555-0201",
      manager: "Dr. Amanda Foster",
    },
    startDate: new Date("2023-09-01"),
    description:
      "Large university campus with comprehensive energy management across 15 buildings.",
    featured: true,
  },
  {
    name: "Kamloops Recreation Center",
    city: "Kamloops",
    region: "Interior",
    coordinates: {
      latitude: 50.6745,
      longitude: -120.3273,
    },
    deviceTypes: ["solar", "heat-pump", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 210000,
      co2Reduced: 105,
      costSavings: 31500,
      activeDevices: 28,
      totalDevices: 30,
      uptime: 98.3,
    },
    contactInfo: {
      email: "kamloops@ecogrid.ca",
      phone: "250-555-0202",
      manager: "Michael Chen",
    },
    startDate: new Date("2024-02-15"),
    description:
      "Community recreation facility with solar heating and smart climate control.",
    featured: false,
  },
  {
    name: "Vernon Shopping Mall",
    city: "Vernon",
    region: "Interior",
    coordinates: {
      latitude: 50.2671,
      longitude: -119.272,
    },
    deviceTypes: ["solar", "battery", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 340000,
      co2Reduced: 170,
      costSavings: 51000,
      activeDevices: 38,
      totalDevices: 42,
      uptime: 97.5,
    },
    contactInfo: {
      email: "vernon@ecogrid.ca",
      phone: "250-555-0203",
      manager: "Lisa Wong",
    },
    startDate: new Date("2024-01-20"),
    description:
      "Large retail complex with rooftop solar and battery storage for peak shaving.",
    featured: false,
  },
  {
    name: "Prince George Logistics Hub",
    city: "Prince George",
    region: "Northern BC",
    coordinates: {
      latitude: 53.9171,
      longitude: -122.7497,
    },
    deviceTypes: ["solar", "battery", "ev-charger"],
    status: "active",
    metrics: {
      energySaved: 280000,
      co2Reduced: 140,
      costSavings: 42000,
      activeDevices: 32,
      totalDevices: 35,
      uptime: 96.8,
    },
    contactInfo: {
      email: "princegeorge@ecogrid.ca",
      phone: "250-555-0301",
      manager: "Tom Anderson",
    },
    startDate: new Date("2024-04-01"),
    description:
      "Distribution center with EV fleet charging and solar canopy installation.",
    featured: false,
  },
  {
    name: "Fort St. John Industrial Park",
    city: "Fort St. John",
    region: "Northern BC",
    coordinates: {
      latitude: 56.2465,
      longitude: -120.8533,
    },
    deviceTypes: ["solar", "battery"],
    status: "maintenance",
    metrics: {
      energySaved: 150000,
      co2Reduced: 75,
      costSavings: 22500,
      activeDevices: 0,
      totalDevices: 24,
      uptime: 85.2,
    },
    contactInfo: {
      email: "fortstjohn@ecogrid.ca",
      phone: "250-555-0302",
      manager: "David Lee",
    },
    startDate: new Date("2023-12-01"),
    description: "Remote industrial facility undergoing system upgrades.",
    featured: false,
  },
  {
    name: "Cranbrook Ski Resort",
    city: "Cranbrook",
    region: "Kootenays",
    coordinates: {
      latitude: 49.512,
      longitude: -115.7686,
    },
    deviceTypes: ["solar", "heat-pump", "battery"],
    status: "idle",
    metrics: {
      energySaved: 95000,
      co2Reduced: 47.5,
      costSavings: 14250,
      activeDevices: 8,
      totalDevices: 20,
      uptime: 78.5,
    },
    contactInfo: {
      email: "cranbrook@ecogrid.ca",
      phone: "250-555-0401",
      manager: "Robert Thompson",
    },
    startDate: new Date("2023-10-15"),
    description:
      "Seasonal resort facility with reduced operations during off-season.",
    featured: false,
  },
  {
    name: "Nelson Arts Center",
    city: "Nelson",
    region: "Kootenays",
    coordinates: {
      latitude: 49.4928,
      longitude: -117.2948,
    },
    deviceTypes: ["solar", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 125000,
      co2Reduced: 62.5,
      costSavings: 18750,
      activeDevices: 18,
      totalDevices: 20,
      uptime: 99.8,
    },
    contactInfo: {
      email: "nelson@ecogrid.ca",
      phone: "250-555-0402",
      manager: "Sophie Martin",
    },
    startDate: new Date("2024-03-01"),
    description:
      "Community arts and culture center with sustainable energy practices.",
    featured: false,
  },
  {
    name: "Surrey Data Center",
    city: "Surrey",
    region: "Lower Mainland",
    coordinates: {
      latitude: 49.1913,
      longitude: -122.849,
    },
    deviceTypes: ["solar", "battery", "thermostat"],
    status: "active",
    metrics: {
      energySaved: 720000,
      co2Reduced: 360,
      costSavings: 108000,
      activeDevices: 56,
      totalDevices: 60,
      uptime: 99.9,
    },
    contactInfo: {
      email: "surrey@ecogrid.ca",
      phone: "604-555-0104",
      manager: "Alex Kumar",
    },
    startDate: new Date("2023-08-15"),
    description:
      "High-efficiency data center with advanced cooling and renewable energy.",
    featured: true,
  },
  {
    name: "Whistler Resort Village",
    city: "Whistler",
    region: "Lower Mainland",
    coordinates: {
      latitude: 50.1163,
      longitude: -122.9574,
    },
    deviceTypes: ["solar", "ev-charger", "battery", "heat-pump"],
    status: "active",
    metrics: {
      energySaved: 410000,
      co2Reduced: 205,
      costSavings: 61500,
      activeDevices: 52,
      totalDevices: 55,
      uptime: 98.7,
    },
    contactInfo: {
      email: "whistler@ecogrid.ca",
      phone: "604-555-0105",
      manager: "Jennifer Walsh",
    },
    startDate: new Date("2024-01-10"),
    description:
      "Premier resort destination showcasing sustainable tourism practices.",
    featured: true,
  },
  {
    name: "Abbotsford Agricultural Hub",
    city: "Abbotsford",
    region: "Lower Mainland",
    coordinates: {
      latitude: 49.0504,
      longitude: -122.3045,
    },
    deviceTypes: ["solar", "heat-pump", "battery"],
    status: "active",
    metrics: {
      energySaved: 260000,
      co2Reduced: 130,
      costSavings: 39000,
      activeDevices: 30,
      totalDevices: 32,
      uptime: 97.2,
    },
    contactInfo: {
      email: "abbotsford@ecogrid.ca",
      phone: "604-555-0106",
      manager: "Mark Johnson",
    },
    startDate: new Date("2024-02-28"),
    description:
      "Agricultural research and processing facility with renewable energy systems.",
    featured: false,
  },
];

const seedPilots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing pilots
    await Pilot.deleteMany({});
    console.log("Cleared existing pilots");

    // Insert pilots
    const insertedPilots = await Pilot.insertMany(pilots);
    console.log(`Inserted ${insertedPilots.length} pilots`);

    // Calculate aggregate metrics
    const metrics = await Pilot.getAggregateMetrics();
    console.log("\nAggregate Metrics:");
    console.log(
      `Total Energy Saved: ${(metrics.totalEnergy / 1000).toFixed(1)} MWh`
    );
    console.log(`Total CO₂ Reduced: ${metrics.totalCO2.toFixed(1)} tonnes`);
    console.log(
      `Total Cost Savings: $${metrics.totalSavings.toLocaleString()}`
    );
    console.log(`Total Pilots: ${metrics.totalPilots}`);
    console.log(`Total Devices: ${metrics.totalDevices}`);
    console.log(`Active Devices: ${metrics.activeDevices}`);

    console.log("\nPilots data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed pilots error:", error);
    process.exit(1);
  }
};

seedPilots();
