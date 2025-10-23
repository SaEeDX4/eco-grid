import Testimonial from "../models/Testimonial.js";
import CaseStudy from "../models/CaseStudy.js";

export const calculateCollectiveImpact = async () => {
  try {
    // Get all published testimonials with metrics
    const testimonials = await Testimonial.find({
      status: "published",
      "metrics.costSavings": { $exists: true },
    }).lean();

    // Parse and sum metrics
    let totalSavings = 0;
    let totalCO2 = 0;
    let totalEnergy = 0;
    let roiSum = 0;
    let roiCount = 0;

    testimonials.forEach((t) => {
      // Parse cost savings (e.g., "$127,000/year" -> 127000)
      if (t.metrics.costSavings) {
        const savings = parseFloat(
          t.metrics.costSavings.replace(/[^0-9.-]+/g, "")
        );
        if (!isNaN(savings)) totalSavings += savings;
      }

      // Parse carbon reduction (e.g., "450 tonnes CO₂" -> 450)
      if (t.metrics.carbonReduction) {
        const co2 = parseFloat(
          t.metrics.carbonReduction.replace(/[^0-9.-]+/g, "")
        );
        if (!isNaN(co2)) totalCO2 += co2;
      }

      // Parse energy saved (e.g., "35%" -> 35)
      if (t.metrics.energySaved) {
        const energy = parseFloat(
          t.metrics.energySaved.replace(/[^0-9.-]+/g, "")
        );
        if (!isNaN(energy)) totalEnergy += energy;
      }

      // Parse ROI (e.g., "18 months" -> 18)
      if (t.metrics.roi) {
        const roi = parseFloat(t.metrics.roi.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(roi)) {
          roiSum += roi;
          roiCount++;
        }
      }
    });

    const avgROI = roiCount > 0 ? Math.round(roiSum / roiCount) : 0;

    return {
      totalSavings: Math.round(totalSavings),
      totalCO2: Math.round(totalCO2),
      totalEnergy: Math.round(totalEnergy),
      avgROI,
      count: testimonials.length,
    };
  } catch (error) {
    console.error("Calculate collective impact error:", error);
    return {
      totalSavings: 0,
      totalCO2: 0,
      totalEnergy: 0,
      avgROI: 0,
      count: 0,
    };
  }
};

export const trackView = async (model, id) => {
  try {
    const Model = model === "testimonial" ? Testimonial : CaseStudy;
    const doc = await Model.findById(id);

    if (doc) {
      await doc.incrementViews();
    }
  } catch (error) {
    console.error("Track view error:", error);
  }
};

export const getPopularContent = async (model, limit = 5) => {
  try {
    const Model = model === "testimonial" ? Testimonial : CaseStudy;

    const popular = await Model.find({ status: "published" })
      .sort({ views: -1 })
      .limit(limit)
      .lean();

    return popular;
  } catch (error) {
    console.error("Get popular content error:", error);
    return [];
  }
};
