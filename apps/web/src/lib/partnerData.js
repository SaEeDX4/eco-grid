// Partner and incubator data

export const partnershipModels = [
  {
    id: "pilot",
    name: "Pilot Program",
    icon: "Rocket",
    color: "from-blue-500 to-cyan-600",
    description:
      "Launch a proof-of-concept with select households or businesses to demonstrate impact",
    features: [
      "Free platform access for pilot participants",
      "Dedicated technical support and onboarding",
      "Custom reporting and analytics dashboard",
      "Co-marketing opportunities",
      "Flexible 3-6 month pilot timeline",
    ],
    idealFor: "Utilities, municipalities, housing complexes",
    commitment: "Low - pilot duration only",
    pricing: "Contact for custom pilot pricing",
  },
  {
    id: "whitelabel",
    name: "White-Label Solution",
    icon: "Package",
    color: "from-purple-500 to-pink-600",
    description:
      "Deploy Eco-Grid under your brand with customized UI, features, and integrations",
    features: [
      "Fully branded platform (your logo, colors, domain)",
      "Custom feature configuration",
      "API access for system integration",
      "Dedicated cloud infrastructure",
      "Training and ongoing support",
    ],
    idealFor: "Utilities, energy retailers, large enterprises",
    commitment: "Medium - 12+ month partnership",
    pricing: "From $50,000/year + revenue share",
  },
  {
    id: "custom",
    name: "Custom Integration",
    icon: "Settings",
    color: "from-green-500 to-emerald-600",
    description:
      "Tailored solution integrating with existing systems, hardware, or business processes",
    features: [
      "Bespoke development to meet specific needs",
      "Integration with legacy systems and protocols",
      "Custom data models and workflows",
      "Compliance with regulatory requirements",
      "Dedicated engineering resources",
    ],
    idealFor: "Utilities with existing infrastructure, government agencies",
    commitment: "High - multi-year partnership",
    pricing: "Custom pricing based on scope",
  },
];

export const incubators = [
  {
    id: 1,
    name: "Foresight Cleantech Accelerator",
    location: "Vancouver, BC",
    logo: "/images/partners/foresight.png",
    type: "Accelerator",
    relationship: "Portfolio Company",
    website: "https://foresightcac.com",
    description:
      "Leading Canadian cleantech accelerator supporting our market entry and utility partnerships.",
  },
  {
    id: 2,
    name: "Innovate BC",
    location: "British Columbia",
    logo: "/images/partners/innovate-bc.png",
    type: "Government Program",
    relationship: "Grant Recipient",
    website: "https://innovatebc.ca",
    description:
      "Provincial innovation agency providing funding and mentorship for technology commercialization.",
  },
  {
    id: 3,
    name: "Venture Labs",
    location: "Vancouver, BC",
    logo: "/images/partners/venture-labs.png",
    type: "Incubator",
    relationship: "Member",
    website: "https://venturelabs.ca",
    description:
      "Supporting our product development and go-to-market strategy through expert mentorship.",
  },
  {
    id: 4,
    name: "Spring Activator",
    location: "Vancouver, BC",
    logo: "/images/partners/spring.png",
    type: "Accelerator",
    relationship: "Alumni",
    website: "https://springactivator.com",
    description:
      "Helped us refine our business model and secure initial pilot customers.",
  },
];

export const partnerBenefits = {
  utilities: [
    {
      icon: "TrendingDown",
      title: "Peak Demand Reduction",
      description:
        "Reduce infrastructure costs by 15-30% through intelligent load shifting",
    },
    {
      icon: "Users",
      title: "Customer Engagement",
      description:
        "Increase customer satisfaction and reduce churn with value-added services",
    },
    {
      icon: "Zap",
      title: "Grid Flexibility",
      description:
        "Enable demand response programs and virtual power plant aggregation",
    },
    {
      icon: "Shield",
      title: "Regulatory Compliance",
      description:
        "Meet clean energy targets and reporting requirements effortlessly",
    },
  ],
  incubators: [
    {
      icon: "Rocket",
      title: "Portfolio Value",
      description:
        "Add a proven, revenue-generating cleantech solution to your portfolio",
    },
    {
      icon: "Award",
      title: "Success Stories",
      description: "Demonstrate impact with measurable energy and cost savings",
    },
    {
      icon: "Network",
      title: "Network Effects",
      description:
        "Connect us with utilities, investors, and strategic partners",
    },
    {
      icon: "Target",
      title: "ESG Alignment",
      description:
        "Support climate goals and showcase environmental leadership",
    },
  ],
  enterprises: [
    {
      icon: "DollarSign",
      title: "Cost Reduction",
      description:
        "Reduce energy costs by 20-40% through AI-powered optimization",
    },
    {
      icon: "Leaf",
      title: "Carbon Reporting",
      description:
        "Automated ESG reporting with verified carbon reduction metrics",
    },
    {
      icon: "Building",
      title: "Multi-Site Management",
      description: "Centralized energy management across all facilities",
    },
    {
      icon: "TrendingUp",
      title: "Revenue Opportunities",
      description:
        "Monetize flexibility through VPP and demand response programs",
    },
  ],
};

export const integrationSteps = [
  {
    step: 1,
    title: "Initial Consultation",
    duration: "1 week",
    description:
      "Discovery call to understand your needs, goals, and existing infrastructure",
    deliverables: [
      "Partnership proposal",
      "Technical assessment",
      "Timeline & milestones",
    ],
  },
  {
    step: 2,
    title: "Agreement & Planning",
    duration: "2-3 weeks",
    description: "Finalize partnership terms, scope, and integration plan",
    deliverables: ["Signed agreement", "Project plan", "Resource allocation"],
  },
  {
    step: 3,
    title: "Technical Integration",
    duration: "4-8 weeks",
    description:
      "API integration, device connectivity, and system configuration",
    deliverables: ["Working integration", "Test environment", "Documentation"],
  },
  {
    step: 4,
    title: "Pilot Launch",
    duration: "1-3 months",
    description: "Roll out to pilot users with monitoring and optimization",
    deliverables: ["Live pilot", "User onboarding", "Performance reports"],
  },
  {
    step: 5,
    title: "Full Deployment",
    duration: "Ongoing",
    description:
      "Scale to full user base with continuous support and optimization",
    deliverables: ["Full rollout", "Training materials", "Ongoing support"],
  },
];

export const successMetrics = [
  {
    metric: "15-30%",
    label: "Peak Demand Reduction",
    description:
      "Average load reduction during peak hours through intelligent optimization",
    icon: "TrendingDown",
  },
  {
    metric: "20-40%",
    label: "Energy Cost Savings",
    description: "Typical annual savings for households and businesses",
    icon: "DollarSign",
  },
  {
    metric: "95%+",
    label: "User Satisfaction",
    description: "Customer satisfaction score across pilot programs",
    icon: "ThumbsUp",
  },
  {
    metric: "500+",
    label: "Devices Managed",
    description: "Connected devices across pilot partnerships",
    icon: "Plug",
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "Eco-Grid helped us demonstrate demand response capabilities to BC Hydro, opening doors to new revenue streams for our residents.",
    author: "David Kim",
    position: "Property Manager",
    company: "GreenTower Residences",
    location: "Vancouver, BC",
  },
  {
    id: 2,
    quote:
      "The pilot program delivered measurable results within 60 days. We're now exploring white-label deployment across our portfolio.",
    author: "Sarah Johnson",
    position: "Director of Innovation",
    company: "BC Housing Co-op",
    location: "Victoria, BC",
  },
  {
    id: 3,
    quote:
      "Eco-Grid's team was professional and responsive throughout the integration. Their platform exceeded our expectations.",
    author: "Michael Chen",
    position: "CTO",
    company: "CleanEnergy Solutions",
    location: "Vancouver, BC",
  },
];
