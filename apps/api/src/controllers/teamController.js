import AuditLog from "../models/AuditLog.js";

// In a real app, this would come from database
// For now, we return structured data
const teamMembers = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former Tesla Energy lead with 15 years in smart grid technology. PhD in Electrical Engineering from MIT.",
    expertise: ["Smart Grids", "Energy Storage", "IoT"],
    linkedin: "https://linkedin.com/in/placeholder",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google Cloud architect specializing in scalable energy platforms. Stanford CS graduate.",
    expertise: ["Cloud Architecture", "AI/ML", "Data Engineering"],
    linkedin: "https://linkedin.com/in/placeholder",
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Head of Product",
    bio: "Product leader from Nest/Google with expertise in consumer IoT and user experience.",
    expertise: ["Product Strategy", "UX Design", "Consumer IoT"],
    linkedin: "https://linkedin.com/in/placeholder",
  },
];

const advisors = [
  {
    id: 1,
    name: "Prof. Robert Zhang",
    title: "Energy Systems Advisor",
    affiliation: "University of British Columbia",
    bio: "Leading researcher in smart grid technology and renewable energy integration.",
  },
  {
    id: 2,
    name: "Jennifer Martinez",
    title: "Business Strategy Advisor",
    affiliation: "Former VP, Tesla Energy",
    bio: "Scaled Tesla Energy from pilot to global deployment across 30+ countries.",
  },
];

export const getTeamMembers = async (req, res) => {
  try {
    res.json({
      success: true,
      team: teamMembers,
    });
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team members",
    });
  }
};

export const getAdvisors = async (req, res) => {
  try {
    res.json({
      success: true,
      advisors: advisors,
    });
  } catch (error) {
    console.error("Get advisors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch advisors",
    });
  }
};

export const submitCareerInquiry = async (req, res) => {
  try {
    const { name, email, position, message, resume } = req.body;

    // Validate input
    if (!name || !email || !position) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and position are required",
      });
    }

    // In production, save to database and send notification
    // For now, just log the inquiry
    await AuditLog.create({
      userId: null,
      action: "career_inquiry",
      entity: "Career",
      details: {
        name,
        email,
        position,
        hasResume: !!resume,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message:
        "Thank you for your interest! We will review your application and get back to you soon.",
    });
  } catch (error) {
    console.error("Submit career inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
};
