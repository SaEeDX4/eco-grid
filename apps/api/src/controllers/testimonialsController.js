import Testimonial from "../models/Testimonial.js";

export const getTestimonials = async (req, res) => {
  try {
    const { industries, categories, sizes, featured, limit = 50 } = req.query;

    let query = { status: "published" };

    // Filter by industries
    if (industries) {
      const industryArray = industries.split(",").filter(Boolean);
      if (industryArray.length > 0) {
        query.industry = { $in: industryArray };
      }
    }

    // Filter by company sizes
    if (sizes) {
      const sizeArray = sizes.split(",").filter(Boolean);
      if (sizeArray.length > 0) {
        query.companySize = { $in: sizeArray };
      }
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    const testimonials = await Testimonial.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    console.error("Get testimonials error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findOne({
      _id: id,
      status: "published",
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Increment views
    testimonial
      .incrementViews()
      .catch((err) => console.error("Increment views error:", err));

    res.json({
      success: true,
      testimonial,
    });
  } catch (error) {
    console.error("Get testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial",
    });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create testimonial",
    });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.json({
      success: true,
      message: "Testimonial archived successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
};

export const getTestimonialStats = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [total, published, featured, avgRating, totalViews] =
      await Promise.all([
        Testimonial.countDocuments(),
        Testimonial.countDocuments({ status: "published" }),
        Testimonial.countDocuments({ status: "published", featured: true }),
        Testimonial.aggregate([
          { $match: { status: "published" } },
          { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]),
        Testimonial.aggregate([
          { $match: { status: "published" } },
          { $group: { _id: null, total: { $sum: "$views" } } },
        ]),
      ]);

    res.json({
      success: true,
      stats: {
        total,
        published,
        featured,
        avgRating: avgRating[0]?.avg || 0,
        totalViews: totalViews[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Get testimonial stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
