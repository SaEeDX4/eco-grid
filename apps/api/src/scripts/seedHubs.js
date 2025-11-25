import mongoose from "mongoose";
import dotenv from "dotenv";
import Hub from "../models/Hub.js";

dotenv.config();

const hubs = [
  {
    name: "Vancouver Commercial Plaza",
    description:
      "Mixed-use commercial building with retail and office spaces in downtown Vancouver",
    type: "mixed-use",
    location: {
      address: "1234 Robson Street",
      city: "Vancouver",
      province: "BC",
      postalCode: "V6E 1B5",
      country: "Canada",
      coordinates: {
        lat: 49.2827,
        lng: -123.1207,
      },
    },
    capacity: {
      totalKW: 500,
      allocatedKW: 420,
      availableKW: 80,
      reservedKW: 0,
      peakKW: 485,
      utilizationPercent: 84,
    },
    devices: [
      {
        type: "solar",
        capacityKW: 150,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "battery",
        capacityKW: 200,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "grid",
        capacityKW: 300,
        sharedPercent: 100,
        status: "online",
      },
    ],
    billing: {
      model: "proportional",
      baseFeeCAD: 100,
      ratePerKWhCAD: 0.15,
      demandChargePerKWCAD: 12,
    },
    vpp: {
      enabled: true,
      maxContributionKW: 80,
      revenueSharePercent: 25,
      tenantOptIn: true,
    },
    performance: {
      uptimePercent: 99.2,
      avgUtilization: 84,
      peakDemandKW: 485,
      totalEnergyKWh: 125000,
      revenue30d: 8500,
    },
    alerts: {
      capacityThreshold: 90,
      enableAlerts: true,
    },
    status: "active",
    settings: {
      allowTenantOverage: true,
      overageRateMultiplier: 1.5,
      autoRebalance: true,
    },
  },
  {
    name: "Richmond Industrial Park",
    description: "Industrial facility with warehousing and light manufacturing",
    type: "industrial",
    location: {
      address: "5678 Industrial Way",
      city: "Richmond",
      province: "BC",
      postalCode: "V6X 2T1",
      country: "Canada",
      coordinates: {
        lat: 49.1666,
        lng: -123.1336,
      },
    },
    capacity: {
      totalKW: 1000,
      allocatedKW: 750,
      availableKW: 250,
      reservedKW: 0,
      peakKW: 920,
      utilizationPercent: 75,
    },
    devices: [
      {
        type: "solar",
        capacityKW: 300,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "battery",
        capacityKW: 400,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "grid",
        capacityKW: 500,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "generator",
        capacityKW: 200,
        sharedPercent: 100,
        status: "standby",
      },
    ],
    billing: {
      model: "usage-based",
      baseFeeCAD: 200,
      ratePerKWhCAD: 0.12,
      demandChargePerKWCAD: 10,
    },
    vpp: {
      enabled: true,
      maxContributionKW: 200,
      revenueSharePercent: 20,
      tenantOptIn: false,
    },
    performance: {
      uptimePercent: 98.5,
      avgUtilization: 75,
      peakDemandKW: 920,
      totalEnergyKWh: 385000,
      revenue30d: 15200,
    },
    alerts: {
      capacityThreshold: 85,
      enableAlerts: true,
    },
    status: "active",
    settings: {
      allowTenantOverage: true,
      overageRateMultiplier: 2.0,
      autoRebalance: false,
    },
  },
  {
    name: "Surrey Residential Complex",
    description: "Multi-tenant residential building with 100+ units",
    type: "residential",
    location: {
      address: "9012 King George Blvd",
      city: "Surrey",
      province: "BC",
      postalCode: "V3T 2W4",
      country: "Canada",
      coordinates: {
        lat: 49.1913,
        lng: -122.8449,
      },
    },
    capacity: {
      totalKW: 300,
      allocatedKW: 285,
      availableKW: 15,
      reservedKW: 0,
      peakKW: 295,
      utilizationPercent: 95,
    },
    devices: [
      {
        type: "solar",
        capacityKW: 100,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "battery",
        capacityKW: 150,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "grid",
        capacityKW: 200,
        sharedPercent: 100,
        status: "online",
      },
    ],
    billing: {
      model: "equal-split",
      baseFeeCAD: 50,
      ratePerKWhCAD: 0.14,
      demandChargePerKWCAD: 8,
    },
    vpp: {
      enabled: false,
      maxContributionKW: 0,
      revenueSharePercent: 30,
      tenantOptIn: false,
    },
    performance: {
      uptimePercent: 99.8,
      avgUtilization: 95,
      peakDemandKW: 295,
      totalEnergyKWh: 98000,
      revenue30d: 12500,
    },
    alerts: {
      capacityThreshold: 95,
      enableAlerts: true,
    },
    status: "active",
    settings: {
      allowTenantOverage: false,
      overageRateMultiplier: 1.0,
      autoRebalance: true,
    },
  },
  {
    name: "Burnaby Tech Campus",
    description: "Technology campus with office buildings and data center",
    type: "commercial",
    location: {
      address: "4321 Lougheed Highway",
      city: "Burnaby",
      province: "BC",
      postalCode: "V5C 3Y8",
      country: "Canada",
      coordinates: {
        lat: 49.2488,
        lng: -122.9805,
      },
    },
    capacity: {
      totalKW: 2000,
      allocatedKW: 1600,
      availableKW: 400,
      reservedKW: 100,
      peakKW: 1850,
      utilizationPercent: 80,
    },
    devices: [
      {
        type: "solar",
        capacityKW: 500,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "battery",
        capacityKW: 800,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "grid",
        capacityKW: 1000,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "generator",
        capacityKW: 500,
        sharedPercent: 100,
        status: "standby",
      },
    ],
    billing: {
      model: "tiered",
      baseFeeCAD: 500,
      ratePerKWhCAD: 0.13,
      demandChargePerKWCAD: 15,
    },
    vpp: {
      enabled: true,
      maxContributionKW: 400,
      revenueSharePercent: 15,
      tenantOptIn: true,
    },
    performance: {
      uptimePercent: 99.9,
      avgUtilization: 80,
      peakDemandKW: 1850,
      totalEnergyKWh: 750000,
      revenue30d: 35000,
    },
    alerts: {
      capacityThreshold: 90,
      enableAlerts: true,
    },
    status: "active",
    settings: {
      allowTenantOverage: true,
      overageRateMultiplier: 1.3,
      autoRebalance: true,
    },
  },
  {
    name: "Victoria Educational Hub",
    description: "School district facilities with multiple buildings",
    type: "institutional",
    location: {
      address: "789 Douglas Street",
      city: "Victoria",
      province: "BC",
      postalCode: "V8W 2B7",
      country: "Canada",
      coordinates: {
        lat: 48.4284,
        lng: -123.3656,
      },
    },
    capacity: {
      totalKW: 800,
      allocatedKW: 560,
      availableKW: 240,
      reservedKW: 0,
      peakKW: 720,
      utilizationPercent: 70,
    },
    devices: [
      {
        type: "solar",
        capacityKW: 250,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "battery",
        capacityKW: 300,
        sharedPercent: 100,
        status: "online",
      },
      {
        type: "grid",
        capacityKW: 400,
        sharedPercent: 100,
        status: "online",
      },
    ],
    billing: {
      model: "proportional",
      baseFeeCAD: 150,
      ratePerKWhCAD: 0.11,
      demandChargePerKWCAD: 9,
    },
    vpp: {
      enabled: true,
      maxContributionKW: 150,
      revenueSharePercent: 30,
      tenantOptIn: true,
    },
    performance: {
      uptimePercent: 99.5,
      avgUtilization: 70,
      peakDemandKW: 720,
      totalEnergyKWh: 245000,
      revenue30d: 9800,
    },
    alerts: {
      capacityThreshold: 85,
      enableAlerts: true,
    },
    status: "active",
    settings: {
      allowTenantOverage: true,
      overageRateMultiplier: 1.4,
      autoRebalance: true,
    },
  },
];

async function seedHubs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing hubs
    await Hub.deleteMany({});
    console.log("Cleared existing hubs");

    // Create a default organization user (for organizationId)
    // In production, this would be actual user IDs
    const defaultOrgId = new mongoose.Types.ObjectId();

    // Add organizationId to all hubs
    const hubsWithOrg = hubs.map((hub) => ({
      ...hub,
      organizationId: defaultOrgId,
    }));

    // Insert hubs
    const insertedHubs = await Hub.insertMany(hubsWithOrg);
    console.log(`Inserted ${insertedHubs.length} hubs`);

    // Display summary
    console.log("\nHubs by Type:");
    const byType = {};
    insertedHubs.forEach((hub) => {
      byType[hub.type] = (byType[hub.type] || 0) + 1;
    });
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} hub(s)`);
    });

    console.log("\nTotal Capacity:");
    const totalCapacity = insertedHubs.reduce(
      (sum, hub) => sum + hub.capacity.totalKW,
      0
    );
    const totalAllocated = insertedHubs.reduce(
      (sum, hub) => sum + hub.capacity.allocatedKW,
      0
    );
    console.log(`  Total: ${totalCapacity} kW`);
    console.log(`  Allocated: ${totalAllocated} kW`);
    console.log(`  Available: ${totalCapacity - totalAllocated} kW`);
    console.log(
      `  Avg Utilization: ${((totalAllocated / totalCapacity) * 100).toFixed(1)}%`
    );

    console.log("\nVPP Status:");
    const vppEnabled = insertedHubs.filter((hub) => hub.vpp.enabled).length;
    console.log(`  Enabled: ${vppEnabled} hub(s)`);
    console.log(`  Disabled: ${insertedHubs.length - vppEnabled} hub(s)`);

    console.log("\nHubs seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Seed hubs error:", error);
    process.exit(1);
  }
}

seedHubs();
