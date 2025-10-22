// Startup Visa and innovation data

export const innovationStory = {
  tagline: "Transforming Energy Management Through AI and Community",
  mission:
    "Empowering every Canadian household and business to participate in the clean energy transition while reducing costs and carbon emissions.",
  vision:
    "A future where intelligent energy management is accessible to all, creating resilient communities and a sustainable planet.",

  pillars: [
    {
      title: "Technological Innovation",
      description:
        "AI-powered optimization using machine learning to predict and manage energy consumption patterns",
      icon: "Cpu",
      highlights: [
        "Predictive ML models with 95%+ accuracy",
        "Real-time optimization across 50+ device types",
        "Integration with industrial protocols (OCPP, Modbus, BACnet)",
        "Federated learning for privacy-preserving insights",
      ],
    },
    {
      title: "Social Impact",
      description:
        "Democratizing access to clean energy and empowering communities through peer-to-peer energy trading",
      icon: "Users",
      highlights: [
        "20-40% energy cost reduction for households",
        "Community VPP participation for grid flexibility",
        "P2P energy trading marketplace",
        "Multi-language support (EN/FR/FA) for inclusivity",
      ],
    },
    {
      title: "Environmental Leadership",
      description:
        "Measurable carbon reduction and alignment with Canada's 2030 climate targets",
      icon: "Leaf",
      highlights: [
        "500+ tonnes CO₂ reduced (target 2027)",
        "25-50% carbon footprint reduction per user",
        "Green data center infrastructure",
        "ESG reporting for corporate transparency",
      ],
    },
    {
      title: "Economic Viability",
      description:
        "Sustainable business model with clear path to profitability and job creation",
      icon: "TrendingUp",
      highlights: [
        "SaaS revenue model with 80%+ gross margins",
        "15-25 high-skill jobs by 2027",
        "Partnership with 4+ BC incubators",
        "Export potential to US and European markets",
      ],
    },
  ],

  timeline: [
    {
      year: 2024,
      quarter: "Q4",
      title: "Foundation & Validation",
      milestones: [
        "MVP development completed",
        "First pilot program launched (50 households)",
        "Partnership with Foresight Cleantech Accelerator",
        "Startup Visa application submitted",
      ],
    },
    {
      year: 2025,
      quarter: "Q2",
      title: "Market Entry",
      milestones: [
        "200 active households in BC",
        "First SME customer acquired",
        "Seed funding secured ($500K CAD)",
        "Team expansion to 8 members",
      ],
    },
    {
      year: 2026,
      quarter: "Q4",
      title: "Scale & Expansion",
      milestones: [
        "1000 households across BC and Alberta",
        "Series A funding ($3M CAD)",
        "Partnership with major utility provider",
        "Team growth to 15 members",
      ],
    },
    {
      year: 2027,
      quarter: "Q4",
      title: "National Reach",
      milestones: [
        "2000 households, 50 businesses",
        "Expansion to Ontario and Quebec",
        "500 tonnes CO₂ reduction milestone",
        "25 team members, profitability achieved",
      ],
    },
  ],
};

export const milestoneTargets = [
  {
    id: "households",
    label: "Active Households",
    current: 127,
    target: 2000,
    targetDate: "2027",
    unit: "",
    icon: "Home",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "co2Saved",
    label: "CO₂ Reduced",
    current: 38,
    target: 500,
    targetDate: "2027",
    unit: "tonnes",
    icon: "Leaf",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "businesses",
    label: "Business Partners",
    current: 12,
    target: 100,
    targetDate: "2030",
    unit: "",
    icon: "Building",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "jobs",
    label: "Jobs Created",
    current: 8,
    target: 25,
    targetDate: "2027",
    unit: "",
    icon: "Briefcase",
    color: "from-orange-500 to-red-600",
  },
];

export const complianceStandards = [
  {
    name: "PIPEDA",
    fullName: "Personal Information Protection and Electronic Documents Act",
    status: "Compliant",
    certificationDate: "2024-10",
    description: "Canadian federal privacy law for private sector",
    icon: "Shield",
  },
  {
    name: "ISO 27001",
    fullName: "Information Security Management",
    status: "In Progress",
    certificationDate: "2025-06",
    description: "International standard for information security",
    icon: "Lock",
  },
  {
    name: "NIS2",
    fullName: "Network and Information Security Directive",
    status: "Aligned",
    certificationDate: "2024-12",
    description: "EU cybersecurity requirements",
    icon: "ShieldCheck",
  },
  {
    name: "SOC 2 Type II",
    fullName: "Service Organization Control",
    status: "Planned",
    certificationDate: "2026-01",
    description: "Security, availability, and confidentiality audit",
    icon: "FileCheck",
  },
];

export const securityFeatures = [
  {
    title: "Zero-Trust Architecture",
    description:
      "Never trust, always verify - every request is authenticated and authorized",
    implemented: true,
  },
  {
    title: "End-to-End Encryption",
    description:
      "AES-256 encryption for data at rest, TLS 1.3 for data in transit",
    implemented: true,
  },
  {
    title: "Multi-Factor Authentication",
    description: "Optional 2FA/MFA for all user accounts",
    implemented: true,
  },
  {
    title: "Real-Time Anomaly Detection",
    description: "AI-powered threat detection with automated response",
    implemented: true,
  },
  {
    title: "Regular Penetration Testing",
    description: "Quarterly security audits by certified ethical hackers",
    implemented: true,
  },
  {
    title: "Incident Response Plan",
    description: "24/7 monitoring with <15 minute response time",
    implemented: true,
  },
];

export const greenHostingMetrics = {
  renewableEnergy: 100, // percentage
  pue: 1.12, // Power Usage Effectiveness (industry best: 1.1-1.2)
  carbonNeutral: true,
  datacenterLocation: "Vancouver, BC (BC Hydro - 98% renewable)",
  certifications: ["Green Business Certification", "Carbon Neutral Certified"],

  energyBreakdown: [
    {
      source: "Hydroelectric",
      percentage: 87,
      color: "from-blue-500 to-cyan-600",
    },
    { source: "Wind", percentage: 8, color: "from-green-500 to-emerald-600" },
    { source: "Solar", percentage: 3, color: "from-yellow-500 to-orange-600" },
    {
      source: "Other Renewable",
      percentage: 2,
      color: "from-purple-500 to-pink-600",
    },
  ],
};

export const scalabilityTargets = {
  currentUsers: 127,
  targetUsers: 1000000,
  targetYear: 2032,

  infrastructure: [
    {
      metric: "Horizontal Scaling",
      status: "Ready",
      description: "Kubernetes-ready containerized architecture",
    },
    {
      metric: "Database Sharding",
      status: "Planned",
      description: "MongoDB sharding for 10M+ user scale",
    },
    {
      metric: "CDN Distribution",
      status: "Active",
      description: "Multi-region content delivery",
    },
    {
      metric: "Load Balancing",
      status: "Active",
      description: "Auto-scaling with health checks",
    },
  ],

  performanceTargets: {
    apiLatency: { current: 145, target: 200, unit: "ms" },
    uptime: { current: 99.87, target: 99.95, unit: "%" },
    concurrentUsers: { current: 500, target: 100000, unit: "" },
    requestsPerSecond: { current: 250, target: 50000, unit: "req/s" },
  },
};
