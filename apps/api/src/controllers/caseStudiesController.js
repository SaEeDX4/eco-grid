import CaseStudy from "../models/CaseStudy.js";

export const getCaseStudies = async (req, res) => {
  try {
    const { industry, featured, limit = 20 } = req.query;

    let query = { status: "published" };

    if (industry) {
      query.industry = industry;
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    const caseStudies = await CaseStudy.find(query)
      .sort({ featured: -1, publishedAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      caseStudies,
      count: caseStudies.length,
    });
  } catch (error) {
    console.error("Get case studies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch case studies",
    });
  }
};

export const getCaseStudyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const caseStudy = await CaseStudy.findOne({
      slug,
      status: "published",
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case study not found",
      });
    }

    // Increment views
    caseStudy
      .incrementViews()
      .catch((err) => console.error("Increment views error:", err));

    res.json({
      success: true,
      caseStudy,
    });
  } catch (error) {
    console.error("Get case study error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch case study",
    });
  }
};

export const createCaseStudy = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const caseStudy = await CaseStudy.create(req.body);

    res.status(201).json({
      success: true,
      message: "Case study created successfully",
      caseStudy,
    });
  } catch (error) {
    console.error("Create case study error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create case study",
    });
  }
};

export const updateCaseStudy = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const caseStudy = await CaseStudy.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case study not found",
      });
    }

    res.json({
      success: true,
      message: "Case study updated successfully",
      caseStudy,
    });
  } catch (error) {
    console.error("Update case study error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update case study",
    });
  }
};

export const deleteCaseStudy = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const caseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true }
    );

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case study not found",
      });
    }

    res.json({
      success: true,
      message: "Case study archived successfully",
    });
  } catch (error) {
    console.error("Delete case study error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete case study",
    });
  }
};

export const getCaseStudyStats = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [total, published, featured, totalViews, byIndustry] =
      await Promise.all([
        CaseStudy.countDocuments(),
        CaseStudy.countDocuments({ status: "published" }),
        CaseStudy.countDocuments({ status: "published", featured: true }),
        CaseStudy.aggregate([
          { $match: { status: "published" } },
          { $group: { _id: null, total: { $sum: "$views" } } },
        ]),
        CaseStudy.aggregate([
          { $match: { status: "published" } },
          { $group: { _id: "$industry", count: { $sum: 1 } } },
        ]),
      ]);

    res.json({
      success: true,
      stats: {
        total,
        published,
        featured,
        totalViews: totalViews[0]?.total || 0,
        byIndustry,
      },
    });
  } catch (error) {
    console.error("Get case study stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
