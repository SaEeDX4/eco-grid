import AIGenerationLog from "../models/AIGenerationLog.js";
import {
  generateOutlineWithAI,
  generateArticleWithAI,
} from "../services/aiContentService.js";
import { validateContent } from "../utils/contentValidator.js";

export const generateOutline = async (req, res) => {
  try {
    // Admin or content creator only
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { prompt, category, targetAudience, tone } = req.body;

    if (!prompt || !category) {
      return res.status(400).json({
        success: false,
        message: "Prompt and category are required",
      });
    }

    const startTime = Date.now();

    // Generate outline using AI
    const result = await generateOutlineWithAI({
      prompt,
      category,
      targetAudience,
      tone,
    });

    const generationTime = Date.now() - startTime;

    // Log generation
    const log = await AIGenerationLog.create({
      type: "outline",
      userId: req.user._id,
      prompt,
      options: { category, targetAudience, tone },
      generatedContent: result.outline,
      model: result.model,
      tokensUsed: result.tokensUsed,
      generationTime,
      success: true,
    });

    res.json({
      success: true,
      outline: result.outline,
      logId: log._id,
    });
  } catch (error) {
    console.error("Generate outline error:", error);

    // Log failed generation
    try {
      await AIGenerationLog.create({
        type: "outline",
        userId: req.user?._id,
        prompt: req.body.prompt,
        options: req.body,
        success: false,
        error: error.message,
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate outline",
    });
  }
};

export const generateArticle = async (req, res) => {
  try {
    // Admin or content creator only
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { outline } = req.body;

    if (!outline || !outline.title || !outline.sections) {
      return res.status(400).json({
        success: false,
        message: "Valid outline is required",
      });
    }

    const startTime = Date.now();

    // Generate article using AI
    const result = await generateArticleWithAI(outline);

    const generationTime = Date.now() - startTime;

    // Validate generated content
    const validation = await validateContent(result.article.content);

    // Log generation
    const log = await AIGenerationLog.create({
      type: "article",
      userId: req.user._id,
      outline,
      generatedContent: result.article,
      model: result.model,
      tokensUsed: result.tokensUsed,
      generationTime,
      success: true,
      contentValidation: {
        passed: validation.passed,
        issues: validation.issues,
      },
    });

    res.json({
      success: true,
      article: {
        ...result.article,
        aiGenerated: true,
        aiGenerationLog: log._id,
      },
      validation,
    });
  } catch (error) {
    console.error("Generate article error:", error);

    // Log failed generation
    try {
      await AIGenerationLog.create({
        type: "article",
        userId: req.user?._id,
        outline: req.body.outline,
        success: false,
        error: error.message,
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate article",
    });
  }
};

export const getGenerationLogs = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { page = 1, limit = 20, type, userId } = req.query;

    const query = {};
    if (type) query.type = type;
    if (userId) query.userId = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AIGenerationLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "name email")
        .populate("articleId", "title slug"),
      AIGenerationLog.countDocuments(query),
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get generation logs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
    });
  }
};

export const getGenerationStats = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [
      totalGenerations,
      successfulGenerations,
      outlineGenerations,
      articleGenerations,
      avgGenerationTime,
      totalTokensUsed,
    ] = await Promise.all([
      AIGenerationLog.countDocuments(),
      AIGenerationLog.countDocuments({ success: true }),
      AIGenerationLog.countDocuments({ type: "outline" }),
      AIGenerationLog.countDocuments({ type: "article" }),
      AIGenerationLog.aggregate([
        { $match: { success: true } },
        { $group: { _id: null, avg: { $avg: "$generationTime" } } },
      ]),
      AIGenerationLog.aggregate([
        { $match: { success: true } },
        { $group: { _id: null, total: { $sum: "$tokensUsed.total" } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        total: totalGenerations,
        successful: successfulGenerations,
        failed: totalGenerations - successfulGenerations,
        outlines: outlineGenerations,
        articles: articleGenerations,
        avgGenerationTime: avgGenerationTime[0]?.avg || 0,
        totalTokensUsed: totalTokensUsed[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Get generation stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
