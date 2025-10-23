export const industries = [
  { id: "residential", name: "Residential", icon: "Home" },
  { id: "commercial", name: "Commercial", icon: "Building" },
  { id: "industrial", name: "Industrial", icon: "Factory" },
  { id: "government", name: "Government", icon: "Landmark" },
  { id: "education", name: "Education", icon: "GraduationCap" },
];

export const impactCategories = [
  {
    id: "cost-savings",
    name: "Cost Savings",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "carbon-reduction",
    name: "Carbon Reduction",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "efficiency",
    name: "Efficiency",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "reliability",
    name: "Reliability",
    color: "from-orange-500 to-red-600",
  },
];

export const companySizes = [
  { id: "small", name: "Small (1-50)", range: "1-50 employees" },
  { id: "medium", name: "Medium (51-500)", range: "51-500 employees" },
  { id: "large", name: "Large (501+)", range: "501+ employees" },
];

// Placeholder testimonials for design
export const placeholderTestimonials = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Sustainability Director",
    company: "TechCorp Industries",
    avatar: "https://i.pravatar.cc/150?img=1",
    quote:
      "Eco-Grid reduced our energy costs by 35% in the first year. The AI optimization is incredible—it learns our patterns and makes smart decisions we never would have thought of.",
    rating: 5,
    industry: "commercial",
    companySize: "large",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    featured: true,
    metrics: {
      costSavings: "$127,000/year",
      carbonReduction: "450 tonnes CO₂",
      roi: "18 months",
    },
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Homeowner",
    company: "Vancouver, BC",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote:
      "My electricity bill dropped from $220 to $140 per month. The system manages everything automatically—I barely think about it anymore, but I see the savings every month.",
    rating: 5,
    industry: "residential",
    companySize: "small",
    metrics: {
      costSavings: "$960/year",
      carbonReduction: "1.2 tonnes CO₂",
      roi: "24 months",
    },
  },
  {
    id: "3",
    name: "Dr. Emily Foster",
    role: "Facilities Manager",
    company: "Greenwood University",
    avatar: "https://i.pravatar.cc/150?img=5",
    quote:
      "Managing energy across 15 campus buildings was a nightmare. Eco-Grid gave us centralized control and reduced our peak demand by 40%. The students love seeing our real-time carbon reduction dashboard.",
    rating: 5,
    industry: "education",
    companySize: "large",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    metrics: {
      costSavings: "$340,000/year",
      carbonReduction: "890 tonnes CO₂",
      roi: "12 months",
    },
  },
  {
    id: "4",
    name: "James Park",
    role: "Operations Director",
    company: "Pacific Manufacturing",
    avatar: "https://i.pravatar.cc/150?img=33",
    quote:
      "The predictive maintenance alerts alone saved us $50K in avoided downtime. Add the energy optimization, and we're looking at 6-figure annual savings. Best investment we've made.",
    rating: 5,
    industry: "industrial",
    companySize: "medium",
    metrics: {
      costSavings: "$185,000/year",
      carbonReduction: "620 tonnes CO₂",
      roi: "9 months",
    },
  },
  {
    id: "5",
    name: "Linda Martinez",
    role: "City Energy Manager",
    company: "City of Richmond",
    avatar: "https://i.pravatar.cc/150?img=9",
    quote:
      "Eco-Grid helps us meet our climate action goals while saving taxpayer dollars. The reporting features make it easy to show council members the ROI on our sustainability initiatives.",
    rating: 5,
    industry: "government",
    companySize: "large",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    featured: true,
    metrics: {
      costSavings: "$520,000/year",
      carbonReduction: "1,200 tonnes CO₂",
      roi: "15 months",
    },
  },
  {
    id: "6",
    name: "Robert Thompson",
    role: "CFO",
    company: "Alpine Resorts",
    avatar: "https://i.pravatar.cc/150?img=14",
    quote:
      "Operating ski resorts is energy-intensive. Eco-Grid's smart HVAC optimization keeps guests comfortable while cutting heating costs by 28%. It's a game-changer for our margins.",
    rating: 5,
    industry: "commercial",
    companySize: "medium",
    metrics: {
      costSavings: "$95,000/year",
      carbonReduction: "320 tonnes CO₂",
      roi: "20 months",
    },
  },
];
