import mongoose from "mongoose";
import dotenv from "dotenv";
import Milestone from "../models/Milestone.js";

dotenv.config();

const milestones = [
  // 2026
  {
    year: 2026,
    quarter: "Q1",
    title: "BC-Wide Expansion",
    category: "product",
    status: "in-progress",
    progress: 65,
    description:
      "Scale from 15 pilots to 2,000 active households across British Columbia. Achieve product-market fit with residential segment.",
    impact: {
      users: "2,000 households",
      energySaved: "15 GWh/year",
      co2Reduced: "7,500 tonnes",
      revenue: "$480K ARR",
    },
    challenges: [
      "Utility integration across BC Hydro and FortisBC",
      "Onboarding scalability and support capacity",
      "Device compatibility across diverse hardware",
    ],
    dependencies: [],
    icon: "Home",
    order: 1,
    featured: true,
  },
  {
    year: 2026,
    quarter: "Q2",
    title: "VPP Optimization Engine",
    category: "vpp",
    status: "planned",
    progress: 0,
    description:
      "Launch advanced VPP algorithms with predictive bidding, battery health optimization, and multi-market participation.",
    impact: {
      users: "All VPP participants",
      revenue: "+$50K/month VPP revenue",
      batteryLife: "+15% lifespan extension",
      gridStability: "25 MW capacity",
    },
    challenges: [
      "Real-time market integration complexity",
      "Battery warranty compliance across manufacturers",
      "Grid operator coordination and approvals",
    ],
    dependencies: [],
    icon: "Zap",
    stakeholderQuote: {
      text: "Eco-Grid's VPP technology represents the future of distributed energy resources.",
      author: "BC Hydro Innovation Team",
      role: "Grid Modernization Lead",
    },
    order: 2,
    featured: false,
  },
  {
    year: 2026,
    quarter: "Q3",
    title: "Mobile App 2.0",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Complete mobile redesign with real-time notifications, voice control, and offline mode. iOS and Android feature parity.",
    impact: {
      engagement: "+40% daily active users",
      satisfaction: "4.8+ app store rating",
      retention: "85% 90-day retention",
    },
    challenges: [
      "Push notification infrastructure at scale",
      "Offline data sync complexity",
      "Platform-specific optimization",
    ],
    dependencies: [],
    icon: "Smartphone",
    order: 3,
    featured: false,
  },
  {
    year: 2026,
    quarter: "Q4",
    title: "Enterprise Pilot Program",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Launch SME offering with 50 commercial pilots. Multi-tenant support, advanced analytics, and ROI reporting.",
    impact: {
      users: "50 SMEs",
      revenue: "+$120K ARR",
      energySaved: "8 GWh/year",
      avgROI: "18 months payback",
    },
    challenges: [
      "Complex commercial tariff structures",
      "Multi-site coordination",
      "Enterprise sales cycle and contracts",
    ],
    dependencies: [],
    icon: "Building",
    order: 4,
    featured: false,
  },

  // 2027
  {
    year: 2027,
    quarter: "Q1",
    title: "Western Canada Rollout",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Expand to Alberta, Saskatchewan, and Manitoba. Partner with local utilities and adapt to provincial energy policies.",
    impact: {
      users: "5,000 total households",
      coverage: "4 provinces",
      revenue: "$1.2M ARR",
      marketShare: "2% Western Canada",
    },
    challenges: [
      "Multi-province regulatory compliance",
      "Cold climate optimization",
      "Utility partnership negotiations",
    ],
    dependencies: [],
    icon: "MapPin",
    order: 5,
    featured: false,
  },
  {
    year: 2027,
    quarter: "Q2",
    title: "Hardware Partnership Program",
    category: "hardware",
    status: "planned",
    progress: 0,
    description:
      "Strategic partnerships with Tesla, Enphase, and ChargePoint. Co-branded offerings and seamless integration.",
    impact: {
      partners: "3 major OEMs",
      integration: "15 new device types",
      distribution: "In-box bundling",
    },
    challenges: [
      "Partnership negotiation and contracts",
      "Co-marketing coordination",
      "Technical integration timelines",
    ],
    dependencies: [],
    icon: "Handshake",
    stakeholderQuote: {
      text: "Eco-Grid is the integration layer the industry has been waiting for.",
      author: "Major OEM Partner",
      role: "VP of Product",
    },
    order: 6,
    featured: true,
  },
  {
    year: 2027,
    quarter: "Q3",
    title: "Developer API Marketplace",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Public API launch with marketplace for third-party apps, plugins, and integrations. Revenue sharing model.",
    impact: {
      developers: "500+ registered",
      apps: "50 marketplace listings",
      revenue: "+$30K/month API fees",
    },
    challenges: [
      "API security and rate limiting",
      "Developer onboarding and support",
      "Marketplace quality control",
    ],
    dependencies: [],
    icon: "Code",
    order: 7,
    featured: false,
  },
  {
    year: 2027,
    quarter: "Q4",
    title: "Startup Visa Success",
    category: "policy",
    status: "planned",
    progress: 0,
    description:
      "Achieve all Startup Visa metrics. Secure Series A funding. Establish as Canadian cleantech leader.",
    impact: {
      users: "8,000 households",
      funding: "$5M Series A",
      team: "25 employees",
      recognition: "Top 10 CleanTech",
    },
    challenges: [
      "Meeting job creation targets",
      "Investor due diligence",
      "Maintaining growth velocity",
    ],
    dependencies: [],
    icon: "Award",
    order: 8,
    featured: false,
  },

  // 2028
  {
    year: 2028,
    quarter: "Q2",
    title: "National Coverage",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Complete Canadian coverage. Integration with all major utilities. Provincial policy leadership.",
    impact: {
      users: "25,000 households",
      coverage: "10 provinces",
      revenue: "$5M ARR",
      marketShare: "5% national",
    },
    challenges: [
      "Quebec and Atlantic regulatory differences",
      "Bilingual customer support",
      "National marketing campaign",
    ],
    dependencies: [],
    icon: "Flag",
    order: 9,
    featured: false,
  },
  {
    year: 2028,
    quarter: "Q3",
    title: "Federated Learning AI",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Privacy-preserving AI that learns from network without accessing individual data. Industry-leading accuracy.",
    impact: {
      accuracy: "+25% prediction improvement",
      privacy: "100% local data",
      efficiency: "+15% energy savings",
    },
    challenges: [
      "Federated learning infrastructure",
      "Model aggregation complexity",
      "Privacy certification",
    ],
    dependencies: [],
    icon: "Brain",
    stakeholderQuote: {
      text: "Their federated approach sets a new standard for privacy in energy tech.",
      author: "Privacy Commissioner Advisory",
      role: "Technical Review",
    },
    order: 10,
    featured: true,
  },
  {
    year: 2028,
    quarter: "Q4",
    title: "Cross-Border VPP",
    category: "vpp",
    status: "planned",
    progress: 0,
    description:
      "Launch pilot for US-Canada cross-border VPP participation. Integration with CAISO and AESO markets.",
    impact: {
      capacity: "100 MW cross-border",
      revenue: "+$200K/month",
      gridStability: "Bi-national support",
    },
    challenges: [
      "International regulatory compliance",
      "Currency and tax complexity",
      "Real-time cross-border coordination",
    ],
    dependencies: [],
    icon: "Globe",
    order: 11,
    featured: false,
  },

  // 2029
  {
    year: 2029,
    quarter: "Q2",
    title: "Pacific Northwest Launch",
    category: "global",
    status: "planned",
    progress: 0,
    description:
      "US market entry via Washington and Oregon. Partnership with BPA and local utilities.",
    impact: {
      users: "50,000 total",
      usMarket: "5,000 US households",
      revenue: "$10M ARR",
      valuation: "$100M Series B",
    },
    challenges: [
      "US regulatory navigation (state-level)",
      "Customer acquisition in competitive market",
      "Local team hiring and operations",
    ],
    dependencies: [],
    icon: "TrendingUp",
    order: 12,
    featured: false,
  },
  {
    year: 2029,
    quarter: "Q3",
    title: "Blockchain Energy Credits",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Launch blockchain-based carbon credit marketplace. Transparent, tradeable energy certificates.",
    impact: {
      credits: "50,000 tonnes verified",
      marketplace: "$500K trading volume",
      transparency: "100% auditable",
    },
    challenges: [
      "Blockchain scalability and cost",
      "Regulatory acceptance",
      "Carbon credit verification standards",
    ],
    dependencies: [],
    icon: "Coins",
    order: 13,
    featured: false,
  },

  // 2030
  {
    year: 2030,
    quarter: "Q2",
    title: "1 Million Users",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Reach 1M households milestone. Proven scalability, market leadership, and sustainable unit economics.",
    impact: {
      users: "1,000,000 households",
      energySaved: "2,500 GWh/year",
      co2Reduced: "1.25M tonnes",
      revenue: "$100M ARR",
    },
    challenges: [
      "Infrastructure scaling",
      "Customer support automation",
      "Maintaining quality at scale",
    ],
    dependencies: [],
    icon: "Users",
    stakeholderQuote: {
      text: "Eco-Grid's trajectory mirrors the most successful SaaS companies in history.",
      author: "Series B Lead Investor",
      role: "Managing Partner",
    },
    order: 14,
    featured: true,
  },
  {
    year: 2030,
    quarter: "Q3",
    title: "Full AI Autonomy",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Achieve 95% autonomous optimization. Minimal user intervention required. Continuous learning and adaptation.",
    impact: {
      automation: "95% autonomous",
      savings: "+30% vs manual",
      satisfaction: "4.9/5 rating",
    },
    challenges: [
      "Edge case handling",
      "Trust and adoption",
      "Regulatory approval for autonomous control",
    ],
    dependencies: [],
    icon: "Cpu",
    order: 15,
    featured: false,
  },

  // 2032
  {
    year: 2032,
    quarter: "Q3",
    title: "10 Million Users",
    category: "product",
    status: "planned",
    progress: 0,
    description:
      "Reach 10M global users. Established as industry standard for residential and commercial energy management.",
    impact: {
      users: "10,000,000 households",
      energySaved: "25,000 GWh/year",
      co2Reduced: "12.5M tonnes",
      revenue: "$500M ARR",
    },
    challenges: [
      "Global infrastructure",
      "Maintaining company culture",
      "Competitive response",
    ],
    dependencies: [],
    icon: "TrendingUp",
    stakeholderQuote: {
      text: "Eco-Grid has become the de facto standard for intelligent energy management.",
      author: "Industry Analyst",
      role: "Cleantech Research Lead",
    },
    order: 16,
    featured: true,
  },
];

const seedRoadmap = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing milestones
    await Milestone.deleteMany({});
    console.log("Cleared existing milestones");

    // Insert milestones
    const insertedMilestones = await Milestone.insertMany(milestones);
    console.log(`Inserted ${insertedMilestones.length} milestones`);

    // Get statistics
    const byYear = {};
    insertedMilestones.forEach((m) => {
      byYear[m.year] = (byYear[m.year] || 0) + 1;
    });

    console.log("\nMilestones by Year:");
    Object.entries(byYear)
      .sort()
      .forEach(([year, count]) => {
        console.log(`  ${year}: ${count} milestones`);
      });

    const byCategory = {};
    insertedMilestones.forEach((m) => {
      byCategory[m.category] = (byCategory[m.category] || 0) + 1;
    });

    console.log("\nMilestones by Category:");
    Object.entries(byCategory)
      .sort()
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} milestones`);
      });

    console.log("\nRoadmap data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed roadmap error:", error);
    process.exit(1);
  }
};

seedRoadmap();
