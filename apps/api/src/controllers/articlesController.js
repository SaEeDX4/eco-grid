import Article from "../models/Article.js";
import ArticleVersion from "../models/ArticleVersion.js";
import {
  calculateReadingTime,
  generateExcerpt,
} from "../utils/contentUtils.js";
import { generateSEOMetadata } from "../utils/seoGenerator.js";

export const getArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      categories,
      tags,
      status = "published",
    } = req.query;

    let query = { status };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Categories filter
    if (categories) {
      const categoryArray = categories.split(",").filter(Boolean);
      if (categoryArray.length > 0) {
        query.category = { $in: categoryArray };
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").filter(Boolean);
      if (tagArray.length > 0) {
        query.tags = { $in: tagArray };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort(search ? { score: { $meta: "textScore" } } : { publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Article.countDocuments(query),
    ]);

    res.json({
      success: true,
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({ slug, status: "published" });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Increment views asynchronously
    article
      .incrementViews()
      .catch((err) => console.error("Increment views error:", err));

    // Get related articles (same category, excluding current)
    const relatedArticles = await Article.find({
      category: article.category,
      status: "published",
      _id: { $ne: article._id },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    res.json({
      success: true,
      article,
      relatedArticles,
    });
  } catch (error) {
    console.error("Get article by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};

export const createArticle = async (req, res) => {
  try {
    // Admin or content creator only
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const {
      title,
      excerpt,
      content,
      heroImage,
      category,
      tags,
      authorId,
      status,
      metaDescription,
      aiGenerated,
      aiGenerationLog,
    } = req.body;

    // Validation
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and category are required",
      });
    }

    // Auto-generate excerpt if not provided
    const finalExcerpt = excerpt || generateExcerpt(content);

    // Auto-generate SEO metadata if not provided
    const seoData = await generateSEOMetadata(title, content, category);

    const article = await Article.create({
      title,
      excerpt: finalExcerpt,
      content,
      heroImage,
      category,
      tags: tags || [],
      authorId: authorId || "team",
      status: status || "draft",
      metaDescription: metaDescription || seoData.metaDescription,
      metaKeywords: seoData.keywords,
      aiGenerated: aiGenerated || false,
      aiGenerationLog,
    });

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create article",
    });
  }
};

export const updateArticle = async (req, res) => {
  try {
    // Admin or content creator only
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Create version snapshot before updating
    const version = await ArticleVersion.create({
      articleId: article._id,
      versionNumber: article.version,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      heroImage: article.heroImage,
      category: article.category,
      tags: article.tags,
      authorId: article.authorId,
      metaDescription: article.metaDescription,
      changedBy: req.user._id,
      changeNote: updates.changeNote,
      changedFields: Object.keys(updates).filter((k) => k !== "changeNote"),
    });

    // Add version to history
    article.previousVersions.push(version._id);
    article.version += 1;

    // Apply updates
    Object.assign(article, updates);

    await article.save();

    res.json({
      success: true,
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update article",
    });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const article = await Article.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article archived successfully",
      article,
    });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete article",
    });
  }
};

export const getArticleVersions = async (req, res) => {
  try {
    // Admin or content creator only
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const versions = await ArticleVersion.find({ articleId: id })
      .sort({ versionNumber: -1 })
      .populate("changedBy", "name email");

    res.json({
      success: true,
      versions,
    });
  } catch (error) {
    console.error("Get article versions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch versions",
    });
  }
};

export const restoreArticleVersion = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id, versionId } = req.params;

    const version = await ArticleVersion.findById(versionId);

    if (!version || version.articleId.toString() !== id) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Create snapshot of current state before restoring
    const currentVersion = await ArticleVersion.create({
      articleId: article._id,
      versionNumber: article.version,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      heroImage: article.heroImage,
      category: article.category,
      tags: article.tags,
      authorId: article.authorId,
      metaDescription: article.metaDescription,
      changedBy: req.user._id,
      changeNote: `Restored from version ${version.versionNumber}`,
    });

    article.previousVersions.push(currentVersion._id);
    article.version += 1;

    // Restore fields from version
    article.title = version.title;
    article.excerpt = version.excerpt;
    article.content = version.content;
    article.heroImage = version.heroImage;
    article.category = version.category;
    article.tags = version.tags;
    article.authorId = version.authorId;
    article.metaDescription = version.metaDescription;

    await article.save();

    res.json({
      success: true,
      message: "Version restored successfully",
      article,
    });
  } catch (error) {
    console.error("Restore article version error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restore version",
    });
  }
};

export const getPopularArticles = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const articles = await Article.find({ status: "published" })
      .sort({ views: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("Get popular articles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular articles",
    });
  }
};
