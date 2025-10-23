import Article from "../models/Article.js";
import ArticleVersion from "../models/ArticleVersion.js";

export const createArticleVersion = async (article, userId, changeNote) => {
  try {
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
      changedBy: userId,
      changeNote,
    });

    article.previousVersions.push(version._id);
    article.version += 1;
    await article.save();

    return version;
  } catch (error) {
    console.error("Create article version error:", error);
    throw error;
  }
};

export const compareVersions = async (versionId1, versionId2) => {
  try {
    const [version1, version2] = await Promise.all([
      ArticleVersion.findById(versionId1),
      ArticleVersion.findById(versionId2),
    ]);

    if (!version1 || !version2) {
      throw new Error("Version not found");
    }

    const differences = {
      title: version1.title !== version2.title,
      excerpt: version1.excerpt !== version2.excerpt,
      content: version1.content !== version2.content,
      heroImage: version1.heroImage !== version2.heroImage,
      category: version1.category !== version2.category,
      tags: JSON.stringify(version1.tags) !== JSON.stringify(version2.tags),
    };

    return {
      version1,
      version2,
      differences,
      changedFields: Object.keys(differences).filter((key) => differences[key]),
    };
  } catch (error) {
    console.error("Compare versions error:", error);
    throw error;
  }
};

export const getArticleAnalytics = async (articleId) => {
  try {
    const article = await Article.findById(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    // In production, integrate with analytics service
    const analytics = {
      views: article.views,
      avgTimeOnPage: 0, // TODO: Implement
      bounceRate: 0, // TODO: Implement
      sources: [], // TODO: Implement
      devices: [], // TODO: Implement
      locations: [], // TODO: Implement
    };

    return analytics;
  } catch (error) {
    console.error("Get article analytics error:", error);
    throw error;
  }
};

export const getPopularArticles = async (limit = 10, timeframe = "all") => {
  try {
    let query = { status: "published" };

    // Add timeframe filter
    if (timeframe !== "all") {
      const date = new Date();
      switch (timeframe) {
        case "day":
          date.setDate(date.getDate() - 1);
          break;
        case "week":
          date.setDate(date.getDate() - 7);
          break;
        case "month":
          date.setMonth(date.getMonth() - 1);
          break;
        case "year":
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
      query.publishedAt = { $gte: date };
    }

    const articles = await Article.find(query)
      .sort({ views: -1 })
      .limit(limit)
      .lean();

    return articles;
  } catch (error) {
    console.error("Get popular articles error:", error);
    throw error;
  }
};

export const getRelatedArticles = async (articleId, limit = 3) => {
  try {
    const article = await Article.findById(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    // Find articles in same category, excluding current
    const relatedArticles = await Article.find({
      _id: { $ne: articleId },
      status: "published",
      category: article.category,
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return relatedArticles;
  } catch (error) {
    console.error("Get related articles error:", error);
    throw error;
  }
};
