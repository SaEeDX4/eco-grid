// Pricing plans and features data

export const billingPeriods = {
  monthly: {
    label: "Monthly",
    discount: 0,
  },
  annual: {
    label: "Annual",
    discount: 0.2, // 20% discount
    note: "Save 20%",
  },
};

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out Eco-Grid",
    price: {
      monthly: 0,
      annual: 0,
    },
    currency: "CAD",
    popular: false,
    features: {
      devices: "5 devices",
      optimization: "Basic optimization",
      reports: "Monthly reports",
      support: "Community support",
      api: false,
      multiSite: false,
      priority: false,
      whiteLabel: false,
      customIntegration: false,
      dedicatedAccount: false,
      sla: false,
      training: false,
      analytics: "Basic",
      carbonWallet: true,
      vpp: false,
      p2p: false,
    },
    limits: {
      maxDevices: 5,
      maxUsers: 1,
      maxSites: 1,
      apiCallsPerMonth: 0,
      dataRetentionDays: 30,
    },
    cta: "Get Started Free",
  },
  {
    id: "household",
    name: "Household",
    description: "Ideal for homes and small properties",
    price: {
      monthly: 15,
      annual: 12, // 20% off (15 * 0.8)
    },
    currency: "CAD",
    popular: true,
    features: {
      devices: "Unlimited devices",
      optimization: "AI-powered optimization",
      reports: "Weekly reports + PDF export",
      support: "Email support (24h response)",
      api: "Basic API access",
      multiSite: false,
      priority: false,
      whiteLabel: false,
      customIntegration: false,
      dedicatedAccount: false,
      sla: false,
      training: false,
      analytics: "Advanced",
      carbonWallet: true,
      vpp: "Community VPP pools",
      p2p: "Peer-to-peer trading",
    },
    limits: {
      maxDevices: 999,
      maxUsers: 5,
      maxSites: 1,
      apiCallsPerMonth: 1000,
      dataRetentionDays: 365,
    },
    cta: "Start Free Trial",
  },
  {
    id: "sme",
    name: "Small Business",
    description: "For SMEs and multi-tenant buildings",
    price: {
      monthly: 300,
      annual: 240, // 20% off
    },
    currency: "CAD",
    popular: false,
    features: {
      devices: "Unlimited devices",
      optimization: "Advanced AI optimization",
      reports: "Daily reports + custom scheduling",
      support: "Priority support (4h response)",
      api: "Full API access + webhooks",
      multiSite: "Up to 10 sites",
      priority: true,
      whiteLabel: false,
      customIntegration: "Standard integrations",
      dedicatedAccount: false,
      sla: "99.5% uptime SLA",
      training: "Self-service resources",
      analytics: "Enterprise analytics",
      carbonWallet: true,
      vpp: "Commercial VPP pools",
      p2p: "Business energy trading",
    },
    limits: {
      maxDevices: 9999,
      maxUsers: 50,
      maxSites: 10,
      apiCallsPerMonth: 50000,
      dataRetentionDays: 730,
    },
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: {
      monthly: null, // Custom pricing
      annual: null,
    },
    currency: "CAD",
    popular: false,
    features: {
      devices: "Unlimited devices",
      optimization: "Custom optimization models",
      reports: "Real-time dashboards + API access",
      support: "Dedicated support team",
      api: "Unlimited API + GraphQL",
      multiSite: "Unlimited sites",
      priority: true,
      whiteLabel: "Full white-label options",
      customIntegration: "Custom integrations",
      dedicatedAccount: "Dedicated account manager",
      sla: "99.9% uptime SLA",
      training: "On-site training + workshops",
      analytics: "Custom analytics + BI tools",
      carbonWallet: true,
      vpp: "Enterprise VPP management",
      p2p: "Private energy marketplace",
    },
    limits: {
      maxDevices: 999999,
      maxUsers: 9999,
      maxSites: 9999,
      apiCallsPerMonth: 999999999,
      dataRetentionDays: 9999,
    },
    cta: "Contact Sales",
  },
];

export const comparisonFeatures = [
  {
    category: "Core Features",
    features: [
      {
        name: "Connected Devices",
        key: "devices",
        tooltip: "Number of smart devices you can connect",
      },
      {
        name: "AI Optimization",
        key: "optimization",
        tooltip: "Automated energy optimization using machine learning",
      },
      {
        name: "Energy Reports",
        key: "reports",
        tooltip: "Detailed reports on your energy usage and savings",
      },
      {
        name: "Analytics Dashboard",
        key: "analytics",
        tooltip: "Visual analytics and insights on your energy data",
      },
    ],
  },
  {
    category: "Support & Services",
    features: [
      {
        name: "Customer Support",
        key: "support",
        tooltip: "Access to our support team",
      },
      {
        name: "Priority Support",
        key: "priority",
        tooltip: "Faster response times and dedicated support channels",
      },
      {
        name: "Service Level Agreement",
        key: "sla",
        tooltip: "Guaranteed uptime and performance",
      },
      {
        name: "Training & Onboarding",
        key: "training",
        tooltip: "Help getting started with the platform",
      },
    ],
  },
  {
    category: "Advanced Features",
    features: [
      {
        name: "API Access",
        key: "api",
        tooltip: "Programmatic access to your data and controls",
      },
      {
        name: "Multi-Site Management",
        key: "multiSite",
        tooltip: "Manage multiple properties from one account",
      },
      {
        name: "Custom Integrations",
        key: "customIntegration",
        tooltip: "Connect with your existing systems",
      },
      {
        name: "White-Label Options",
        key: "whiteLabel",
        tooltip: "Brand the platform as your own",
      },
    ],
  },
  {
    category: "Energy Markets",
    features: [
      {
        name: "Carbon Offset Wallet",
        key: "carbonWallet",
        tooltip: "Track and trade carbon credits",
      },
      {
        name: "Virtual Power Plant",
        key: "vpp",
        tooltip: "Participate in grid flexibility programs",
      },
      {
        name: "Peer-to-Peer Trading",
        key: "p2p",
        tooltip: "Buy and sell energy with your community",
      },
      {
        name: "Dedicated Account Manager",
        key: "dedicatedAccount",
        tooltip: "Personal support and strategic guidance",
      },
    ],
  },
];

export const trialDetails = {
  duration: 14, // days
  features: "household", // Full access to this plan
  creditCardRequired: false,
  note: "No credit card required. Cancel anytime.",
};
