import FAQ from "../models/FAQ.js";

export const getAllFAQs = async (req, res) => {
  try {
    // Admin only - check auth
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { status, category, language, page = 1, limit = 20 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (language) query.language = language;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [faqs, total] = await Promise.all([
      FAQ.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      FAQ.countDocuments(query),
    ]);

    res.json({
      success: true,
      faqs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Get all FAQs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
    });
  }
};

export const createFAQ = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const faq = await FAQ.create({
      ...req.body,
      updatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      faq,
    });
  } catch (error) {
    console.error("Create FAQ error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create FAQ",
    });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const faq = await FAQ.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ updated successfully",
      faq,
    });
  } catch (error) {
    console.error("Update FAQ error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update FAQ",
    });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ archived successfully",
    });
  } catch (error) {
    console.error("Delete FAQ error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [
      totalFAQs,
      publishedFAQs,
      totalViews,
      avgHelpfulness,
      topFAQs,
      categoryStats,
    ] = await Promise.all([
      FAQ.countDocuments(),
      FAQ.countDocuments({ status: "published" }),
      FAQ.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      FAQ.aggregate([
        {
          $project: {
            helpfulnessScore: {
              $cond: [
                { $eq: [{ $add: ["$helpful", "$notHelpful"] }, 0] },
                0,
                {
                  $multiply: [
                    {
                      $divide: [
                        "$helpful",
                        { $add: ["$helpful", "$notHelpful"] },
                      ],
                    },
                    100,
                  ],
                },
              ],
            },
          },
        },
        { $group: { _id: null, avg: { $avg: "$helpfulnessScore" } } },
      ]),
      FAQ.find({ status: "published" })
        .sort({ views: -1 })
        .limit(10)
        .select("question views helpful notHelpful")
        .lean(),
      FAQ.aggregate([
        { $match: { status: "published" } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            totalViews: { $sum: "$views" },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      analytics: {
        totalFAQs,
        publishedFAQs,
        totalViews: totalViews[0]?.total || 0,
        avgHelpfulness: avgHelpfulness[0]?.avg?.toFixed(1) || 0,
        topFAQs,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};
