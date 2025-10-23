import mongoose from "mongoose";
import dotenv from "dotenv";
import Testimonial from "../models/Testimonial.js";
import CaseStudy from "../models/CaseStudy.js";

dotenv.config();

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Sustainability Director",
    company: "TechCorp Industries",
    avatar: "https://i.pravatar.cc/150?img=1",
    quote:
      "Eco-Grid reduced our energy costs by 35% in the first year. The AI optimization is incredible—it learns our patterns and makes smart decisions we never would have thought of.",
    rating: 5,
    industry: "commercial",
    companySize: "large",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    featured: true,
    status: "published",
    metrics: {
      costSavings: "$127,000/year",
      carbonReduction: "450 tonnes CO₂",
      roi: "18 months",
      energySaved: "35%",
    },
  },
  {
    name: "Michael Rodriguez",
    role: "Homeowner",
    company: "Vancouver, BC",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote:
      "My electricity bill dropped from $220 to $140 per month. The system manages everything automatically—I barely think about it anymore, but I see the savings every month.",
    rating: 5,
    industry: "residential",
    companySize: "small",
    status: "published",
    metrics: {
      costSavings: "$960/year",
      carbonReduction: "1.2 tonnes CO₂",
      roi: "24 months",
      energySaved: "36%",
    },
  },
  {
    name: "Dr. Emily Foster",
    role: "Facilities Manager",
    company: "Greenwood University",
    avatar: "https://i.pravatar.cc/150?img=5",
    quote:
      "Managing energy across 15 campus buildings was a nightmare. Eco-Grid gave us centralized control and reduced our peak demand by 40%. The students love seeing our real-time carbon reduction dashboard.",
    rating: 5,
    industry: "education",
    companySize: "large",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    featured: true,
    status: "published",
    metrics: {
      costSavings: "$340,000/year",
      carbonReduction: "890 tonnes CO₂",
      roi: "12 months",
      energySaved: "40%",
    },
  },
  {
    name: "James Park",
    role: "Operations Director",
    company: "Pacific Manufacturing",
    avatar: "https://i.pravatar.cc/150?img=33",
    quote:
      "The predictive maintenance alerts alone saved us $50K in avoided downtime. Add the energy optimization, and we're looking at 6-figure annual savings. Best investment we've made.",
    rating: 5,
    industry: "industrial",
    companySize: "medium",
    status: "published",
    metrics: {
      costSavings: "$185,000/year",
      carbonReduction: "620 tonnes CO₂",
      roi: "9 months",
      energySaved: "32%",
    },
  },
  {
    name: "Linda Martinez",
    role: "City Energy Manager",
    company: "City of Richmond",
    avatar: "https://i.pravatar.cc/150?img=9",
    quote:
      "Eco-Grid helps us meet our climate action goals while saving taxpayer dollars. The reporting features make it easy to show council members the ROI on our sustainability initiatives.",
    rating: 5,
    industry: "government",
    companySize: "large",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    featured: true,
    status: "published",
    metrics: {
      costSavings: "$520,000/year",
      carbonReduction: "1,200 tonnes CO₂",
      roi: "15 months",
      energySaved: "38%",
    },
  },
  {
    name: "Robert Thompson",
    role: "CFO",
    company: "Alpine Resorts",
    avatar: "https://i.pravatar.cc/150?img=14",
    quote:
      "Operating ski resorts is energy-intensive. Eco-Grid's smart HVAC optimization keeps guests comfortable while cutting heating costs by 28%. It's a game-changer for our margins.",
    rating: 5,
    industry: "commercial",
    companySize: "medium",
    status: "published",
    metrics: {
      costSavings: "$95,000/year",
      carbonReduction: "320 tonnes CO₂",
      roi: "20 months",
      energySaved: "28%",
    },
  },
];

const caseStudies = [
  {
    title:
      "TechCorp Industries: 35% Cost Reduction Through AI-Powered Optimization",
    slug: "techcorp-industries-ai-optimization",
    company: "TechCorp Industries",
    location: "Vancouver, BC",
    industry: "commercial",
    companySize: "500+ employees",
    summary:
      "A leading technology company achieved 35% energy cost reduction and 450 tonnes of carbon savings in the first year using Eco-Grid's AI optimization platform.",
    challenge:
      "TechCorp Industries operates a 200,000 sq ft office complex with data centers, labs, and office spaces. Their energy costs were escalating year-over-year, reaching $360,000 annually. The facilities team struggled with: manual scheduling of HVAC systems, unpredictable demand charges from running equipment during peak hours, no visibility into energy usage across departments, and difficulty meeting corporate sustainability targets. Traditional building management systems provided data but no actionable insights.",
    solution:
      "Eco-Grid deployed a comprehensive energy management solution: AI-powered optimization algorithms that learned building usage patterns over 30 days, smart device integration across 150+ endpoints (HVAC, lighting, data center cooling), real-time monitoring dashboard accessible to facilities and finance teams, automated demand response to shift loads away from peak pricing periods, and predictive maintenance alerts for equipment efficiency. The implementation took 6 weeks with minimal disruption to operations.",
    results:
      "The results exceeded expectations: $127,000 annual cost savings (35% reduction), 450 tonnes CO₂ equivalent reduced, 18-month ROI on implementation investment, 40% reduction in peak demand charges, 99.7% uptime maintained throughout optimization, and zero comfort complaints from employees. The system paid for itself in energy savings alone, with additional value from avoided equipment failures and improved sustainability reporting.",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
    metrics: {
      costSavings: "$127,000/year",
      carbonReduction: "450 tonnes CO₂",
      roi: "18 months",
      energySaved: "35%",
    },
    quote: {
      text: "Eco-Grid transformed our approach to energy management. We're now proactive instead of reactive, and the cost savings fund our other sustainability initiatives.",
      author: "Sarah Chen",
      role: "Sustainability Director",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    technologies: [
      "AI Optimization",
      "Smart Thermostats",
      "IoT Sensors",
      "Demand Response",
      "Predictive Maintenance",
    ],
    featured: true,
    status: "published",
    publishedAt: new Date("2024-09-15"),
  },
  {
    title: "Greenwood University: Campus-Wide Energy Transformation",
    slug: "greenwood-university-campus-energy",
    company: "Greenwood University",
    location: "Surrey, BC",
    industry: "education",
    companySize: "10,000+ students",
    summary:
      "A major university reduced energy costs by $340,000 annually across 15 campus buildings while engaging students in real-time sustainability tracking.",
    challenge:
      "Greenwood University faced mounting pressure to reduce operational costs while meeting aggressive carbon reduction commitments. Managing energy across 15 buildings—including classrooms, labs, dormitories, and administrative offices—was a logistical nightmare. Each building operated independently with different systems, making centralized oversight impossible. Annual energy costs exceeded $850,000, and the university had no real-time visibility into consumption patterns. Student activists were demanding measurable progress on sustainability goals.",
    solution:
      "Eco-Grid implemented a comprehensive campus energy management system: centralized dashboard showing real-time energy usage across all buildings, building-specific optimization profiles tailored to usage patterns (labs vs. classrooms vs. dorms), student-facing public dashboard displaying carbon savings and equivalent impact metrics, automated scheduling coordinated with class schedules and occupancy sensors, integration with existing building automation systems without requiring replacements, and mobile app for facilities staff to monitor and control systems remotely.",
    results:
      "The transformation was remarkable: $340,000 annual cost savings (40% reduction in energy spend), 890 tonnes CO₂ reduced annually, 12-month return on investment, 40% reduction in peak demand, engaged student body tracking sustainability progress, positive media coverage enhancing university reputation, and $100,000+ in utility rebates for demand response participation. The public dashboard became a point of pride, featured in campus tours and admissions materials.",
    heroImage:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1200",
    metrics: {
      costSavings: "$340,000/year",
      carbonReduction: "890 tonnes CO₂",
      roi: "12 months",
      energySaved: "40%",
    },
    quote: {
      text: "Eco-Grid gave us the tools to meet our climate commitments while freeing up budget for academic programs. Our students love seeing their impact in real-time.",
      author: "Dr. Emily Foster",
      role: "Facilities Manager",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    technologies: [
      "Campus-Wide Integration",
      "Occupancy Sensors",
      "Public Dashboard",
      "Mobile App",
      "Building Automation",
    ],
    featured: true,
    status: "published",
    publishedAt: new Date("2024-08-20"),
  },
];

const seedTestimonials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Testimonial.deleteMany({});
    await CaseStudy.deleteMany({});
    console.log("Cleared existing testimonials and case studies");

    // Insert testimonials
    const insertedTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`Inserted ${insertedTestimonials.length} testimonials`);

    // Insert case studies
    const insertedCaseStudies = await CaseStudy.insertMany(caseStudies);
    console.log(`Inserted ${insertedCaseStudies.length} case studies`);

    console.log("Testimonials data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed testimonials error:", error);
    process.exit(1);
  }
};

seedTestimonials();
