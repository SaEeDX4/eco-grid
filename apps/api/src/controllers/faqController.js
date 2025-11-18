import FAQ from "../models/FAQ.js";
import {
  semanticSearch,
  findRelatedQuestions,
  analyzeSearchQuery,
} from "../services/faqSearchService.js";

export const getFAQs = async (req, res) => {
  try {
    const { category, language = "en", search, limit = 50 } = req.query;

    let query = {
      status: "published",
      language,
    };

    if (category) {
      query.category = category;
    }

    let faqs;

    if (search) {
      // Use text search
      faqs = await FAQ.search(search, language);
    } else {
      faqs = await FAQ.find(query)
        .sort({ order: 1, createdAt: -1 })
        .limit(parseInt(limit))
        .lean();
    }

    res.json({
      success: true,
      faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error("Get FAQs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
    });
  }
};

export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    // Increment views asynchronously
    faq
      .incrementViews()
      .catch((err) => console.error("View increment error:", err));

    // Get related questions
    const related = await findRelatedQuestions(faq._id);

    res.json({
      success: true,
      faq,
      relatedQuestions: related,
    });
  } catch (error) {
    console.error("Get FAQ error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
    });
  }
};

export const semanticSearchFAQs = async (req, res) => {
  try {
    const { query, language = "en", limit = 5 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Perform semantic search using Claude
    const results = await semanticSearch(query, language, parseInt(limit));

    // Analyze the query for insights
    const analysis = await analyzeSearchQuery(query);

    res.json({
      success: true,
      results,
      count: results.length,
      analysis,
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

export const getPopularFAQs = async (req, res) => {
  try {
    const { language = "en", limit = 5 } = req.query;

    const popular = await FAQ.getPopular(parseInt(limit), language);

    res.json({
      success: true,
      faqs: popular,
    });
  } catch (error) {
    console.error("Get popular FAQs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular FAQs",
    });
  }
};

export const recordFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await faq.recordFeedback(helpful === true);

    res.json({
      success: true,
      message: "Feedback recorded",
      helpful: faq.helpful,
      notHelpful: faq.notHelpful,
    });
  } catch (error) {
    console.error("Record feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record feedback",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { language = "en" } = req.query;

    // Get count of FAQs per category
    const categories = await FAQ.aggregate([
      {
        $match: {
          status: "published",
          language,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      success: true,
      categories: categories.map((c) => ({
        name: c._id,
        count: c.count,
      })),
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};
