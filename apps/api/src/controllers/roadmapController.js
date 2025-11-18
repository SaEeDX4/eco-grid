import Milestone from "../models/Milestone.js";

export const getRoadmap = async (req, res) => {
  try {
    const { category, status, year } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (year) {
      query.year = parseInt(year);
    }

    const milestones = await Milestone.find(query)
      .sort({ year: 1, quarter: 1, order: 1 })
      .lean();

    // Group by year
    const byYear = {};
    milestones.forEach((milestone) => {
      if (!byYear[milestone.year]) {
        byYear[milestone.year] = {
          year: milestone.year,
          milestones: [],
        };
      }
      byYear[milestone.year].milestones.push(milestone);
    });

    const years = Object.values(byYear).sort((a, b) => a.year - b.year);

    res.json({
      success: true,
      years,
      totalMilestones: milestones.length,
    });
  } catch (error) {
    console.error("Get roadmap error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap",
    });
  }
};

export const getMilestoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const milestone = await Milestone.findById(id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.json({
      success: true,
      milestone,
    });
  } catch (error) {
    console.error("Get milestone error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch milestone",
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const [total, completed, inProgress, planned, byCategory, byYear] =
      await Promise.all([
        Milestone.countDocuments(),
        Milestone.countDocuments({ status: "completed" }),
        Milestone.countDocuments({ status: "in-progress" }),
        Milestone.countDocuments({ status: "planned" }),
        Milestone.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
              avgProgress: { $avg: "$progress" },
            },
          },
        ]),
        Milestone.aggregate([
          {
            $group: {
              _id: "$year",
              count: { $sum: 1 },
              avgProgress: { $avg: "$progress" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const overallProgress = await Milestone.aggregate([
      {
        $group: {
          _id: null,
          avgProgress: { $avg: "$progress" },
        },
      },
    ]);

    res.json({
      success: true,
      statistics: {
        total,
        completed,
        inProgress,
        planned,
        overallProgress: overallProgress[0]?.avgProgress?.toFixed(1) || 0,
        byCategory: byCategory.map((c) => ({
          category: c._id,
          count: c.count,
          progress: c.avgProgress.toFixed(1),
        })),
        byYear: byYear.map((y) => ({
          year: y._id,
          count: y.count,
          progress: y.avgProgress.toFixed(1),
        })),
      },
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};

// Admin endpoints
export const createMilestone = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const milestone = await Milestone.create({
      ...req.body,
      updatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      milestone,
    });
  } catch (error) {
    console.error("Create milestone error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create milestone",
    });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const milestone = await Milestone.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.json({
      success: true,
      message: "Milestone updated successfully",
      milestone,
    });
  } catch (error) {
    console.error("Update milestone error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update milestone",
    });
  }
};

export const deleteMilestone = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const milestone = await Milestone.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.json({
      success: true,
      message: "Milestone cancelled successfully",
    });
  } catch (error) {
    console.error("Delete milestone error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete milestone",
    });
  }
};
