import mongoose from "mongoose";
import dotenv from "dotenv";
import Hub from "../models/Hub.js";
import Tenant from "../models/Tenant.js";

dotenv.config();

const tenantTemplates = [
  // Vancouver Commercial Plaza tenants
  {
    hubName: "Vancouver Commercial Plaza",
    tenants: [
      {
        name: "Downtown Coffee Co.",
        businessType: "restaurant",
        capacityKW: 30,
        squareFootage: 1500,
        priorityTier: "standard",
      },
      {
        name: "TechStart Innovations",
        businessType: "office",
        capacityKW: 80,
        squareFootage: 5000,
        priorityTier: "priority",
      },
      {
        name: "Urban Fitness Studio",
        businessType: "service",
        capacityKW: 50,
        squareFootage: 3000,
        priorityTier: "standard",
      },
      {
        name: "Green Grocer Market",
        businessType: "retail",
        capacityKW: 70,
        squareFootage: 4000,
        priorityTier: "standard",
      },
      {
        name: "Pacific Legal Group",
        businessType: "office",
        capacityKW: 60,
        squareFootage: 3500,
        priorityTier: "priority",
      },
      {
        name: "Sunset Restaurant",
        businessType: "restaurant",
        capacityKW: 90,
        squareFootage: 4500,
        priorityTier: "standard",
      },
      {
        name: "Metro Dental Clinic",
        businessType: "service",
        capacityKW: 40,
        squareFootage: 2000,
        priorityTier: "critical",
      },
    ],
  },
  // Richmond Industrial Park tenants
  {
    hubName: "Richmond Industrial Park",
    tenants: [
      {
        name: "Pacific Manufacturing Ltd",
        businessType: "manufacturing",
        capacityKW: 250,
        squareFootage: 15000,
        priorityTier: "priority",
      },
      {
        name: "Western Logistics Co",
        businessType: "warehouse",
        capacityKW: 180,
        squareFootage: 20000,
        priorityTier: "standard",
      },
      {
        name: "Advanced Assembly Inc",
        businessType: "manufacturing",
        capacityKW: 200,
        squareFootage: 12000,
        priorityTier: "priority",
      },
      {
        name: "Cold Storage Solutions",
        businessType: "warehouse",
        capacityKW: 120,
        squareFootage: 8000,
        priorityTier: "critical",
      },
    ],
  },
  // Surrey Residential Complex tenants
  {
    hubName: "Surrey Residential Complex",
    tenants: [
      {
        name: "Unit 101",
        businessType: "residential",
        capacityKW: 15,
        squareFootage: 800,
        priorityTier: "standard",
      },
      {
        name: "Unit 102",
        businessType: "residential",
        capacityKW: 15,
        squareFootage: 800,
        priorityTier: "standard",
      },
      {
        name: "Unit 201",
        businessType: "residential",
        capacityKW: 20,
        squareFootage: 1200,
        priorityTier: "standard",
      },
      {
        name: "Unit 202",
        businessType: "residential",
        capacityKW: 18,
        squareFootage: 1000,
        priorityTier: "standard",
      },
      {
        name: "Common Areas",
        businessType: "other",
        capacityKW: 40,
        squareFootage: 5000,
        priorityTier: "critical",
      },
    ],
  },
  // Burnaby Tech Campus tenants
  {
    hubName: "Burnaby Tech Campus",
    tenants: [
      {
        name: "CloudTech Solutions",
        businessType: "office",
        capacityKW: 400,
        squareFootage: 25000,
        priorityTier: "critical",
      },
      {
        name: "DataCenter West",
        businessType: "service",
        capacityKW: 600,
        squareFootage: 10000,
        priorityTier: "critical",
      },
      {
        name: "Innovation Labs",
        businessType: "office",
        capacityKW: 300,
        squareFootage: 15000,
        priorityTier: "priority",
      },
      {
        name: "Campus Facilities",
        businessType: "other",
        capacityKW: 300,
        squareFootage: 20000,
        priorityTier: "priority",
      },
    ],
  },
  // Victoria Educational Hub tenants
  {
    hubName: "Victoria Educational Hub",
    tenants: [
      {
        name: "Main Campus Building",
        businessType: "other",
        capacityKW: 200,
        squareFootage: 50000,
        priorityTier: "critical",
      },
      {
        name: "Science Wing",
        businessType: "other",
        capacityKW: 150,
        squareFootage: 30000,
        priorityTier: "critical",
      },
      {
        name: "Athletics Center",
        businessType: "service",
        capacityKW: 120,
        squareFootage: 25000,
        priorityTier: "standard",
      },
      {
        name: "Administration",
        businessType: "office",
        capacityKW: 90,
        squareFootage: 15000,
        priorityTier: "priority",
      },
    ],
  },
];

async function seedTenants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing tenants
    await Tenant.deleteMany({});
    console.log("Cleared existing tenants");

    let totalCreated = 0;

    for (const template of tenantTemplates) {
      // Find the hub
      const hub = await Hub.findOne({ name: template.hubName });

      if (!hub) {
        console.log(`Hub "${template.hubName}" not found, skipping tenants`);
        continue;
      }

      console.log(`\nCreating tenants for: ${hub.name}`);

      for (const tenantData of template.tenants) {
        const tenant = await Tenant.create({
          hubId: hub._id,
          name: tenantData.name,
          description: `${tenantData.businessType} tenant in ${hub.name}`,
          businessType: tenantData.businessType,
          contactInfo: {
            primaryContact: `${tenantData.name} Manager`,
            email: `contact@${tenantData.name.toLowerCase().replace(/\s+/g, "")}.com`,
            phone: "+1-604-555-" + Math.floor(1000 + Math.random() * 9000),
          },
          location: {
            building: hub.name,
            squareFootage: tenantData.squareFootage,
          },
          capacity: {
            baseKW: tenantData.capacityKW * 0.8,
            burstKW: tenantData.capacityKW * 0.2,
            allocatedKW: tenantData.capacityKW,
            guaranteedKW:
              tenantData.priorityTier === "critical"
                ? tenantData.capacityKW
                : 0,
          },
          priorityTier: tenantData.priorityTier,
          contract: {
            startDate: new Date("2024-01-01"),
            status: "active",
            terms: "Standard multi-year lease agreement",
          },
          billing: {
            planType: "usage-based",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            currentBalanceCAD: 0,
            paymentStatus: "current",
          },
          usage: {
            current: {
              currentKW: tenantData.capacityKW * (0.4 + Math.random() * 0.4), // 40-80% utilization
              peakKW: tenantData.capacityKW * 0.9,
              avgKW: tenantData.capacityKW * 0.6,
              lastUpdated: new Date(),
            },
          },
          compliance: {
            violations: 0,
            warningLevel: "none",
          },
          performance: {
            avgUtilization: 60 + Math.random() * 30, // 60-90%
            peakDemandKW: tenantData.capacityKW * 0.9,
            loadFactor: 0.6 + Math.random() * 0.2,
            reliabilityScore: 95 + Math.random() * 5,
          },
          preferences: {
            allowVPPParticipation: hub.vpp.enabled && Math.random() > 0.5,
            allowDemandResponse: true,
            notificationsEnabled: true,
            autoPayEnabled: false,
          },
          status: "active",
          settings: {
            softCapEnabled: true,
            burstAllowanceMinutes: 15,
            alertThresholdPercent: 85,
          },
        });

        // Add tenant to hub
        if (!hub.tenants.includes(tenant._id)) {
          hub.tenants.push(tenant._id);
        }

        totalCreated++;
        console.log(
          `  ✓ Created: ${tenant.name} (${tenantData.capacityKW} kW)`
        );
      }

      await hub.save();
    }

    console.log(`\n=== Seeding Complete ===`);
    console.log(`Total tenants created: ${totalCreated}`);

    // Display summary by hub
    console.log("\nTenants by Hub:");
    const hubs = await Hub.find().populate("tenants");

    for (const hub of hubs) {
      console.log(`\n${hub.name}:`);
      console.log(`  Tenants: ${hub.tenants.length}`);
      console.log(`  Total Allocated: ${hub.capacity.allocatedKW} kW`);
      console.log(`  Available: ${hub.capacity.availableKW} kW`);
      console.log(
        `  Utilization: ${hub.capacity.utilizationPercent.toFixed(1)}%`
      );

      // Show tenant breakdown
      const tenants = await Tenant.find({ hubId: hub._id });
      const byBusinessType = {};
      tenants.forEach((t) => {
        byBusinessType[t.businessType] =
          (byBusinessType[t.businessType] || 0) + 1;
      });

      console.log("  Business Types:");
      Object.entries(byBusinessType).forEach(([type, count]) => {
        console.log(`    ${type}: ${count}`);
      });
    }

    console.log("\nTenants seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Seed tenants error:", error);
    process.exit(1);
  }
}

seedTenants();
