export const generateSEOMetadata = async (title, content, category) => {
  try {
    // Generate meta description
    const metaDescription = generateMetaDescription(content);

    // Extract keywords
    const keywords = extractKeywords(content, category);

    // Generate Open Graph data
    const ogData = {
      title,
      description: metaDescription,
      type: "article",
      site_name: "Eco-Grid",
    };

    // Generate structured data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: metaDescription,
      author: {
        "@type": "Organization",
        name: "Eco-Grid",
      },
      publisher: {
        "@type": "Organization",
        name: "Eco-Grid",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.FRONTEND_URL}/logo.png`,
        },
      },
      datePublished: new Date().toISOString(),
      articleSection: category,
    };

    return {
      metaDescription,
      keywords,
      ogData,
      structuredData,
    };
  } catch (error) {
    console.error("Generate SEO metadata error:", error);
    return {
      metaDescription: "",
      keywords: [],
      ogData: {},
      structuredData: {},
    };
  }
};

const generateMetaDescription = (content) => {
  try {
    // Remove markdown syntax
    let plainText = content
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .trim();

    // Get first paragraph
    const firstParagraph = plainText.split("\n\n")[0];

    // Truncate to 160 characters
    if (firstParagraph.length <= 160) {
      return firstParagraph;
    }

    return firstParagraph.substring(0, 157) + "...";
  } catch (error) {
    console.error("Generate meta description error:", error);
    return "";
  }
};

const extractKeywords = (content, category) => {
  try {
    const keywords = [];

    // Add category as keyword
    keywords.push(category);

    // Common energy/tech keywords to look for
    const keywordList = [
      "solar",
      "wind",
      "battery",
      "storage",
      "ev",
      "charging",
      "carbon",
      "renewable",
      "energy",
      "efficiency",
      "smart",
      "grid",
      "ai",
      "machine learning",
      "optimization",
      "sustainability",
      "climate",
      "clean tech",
      "vpp",
      "virtual power plant",
    ];

    const contentLower = content.toLowerCase();

    for (const keyword of keywordList) {
      if (contentLower.includes(keyword)) {
        keywords.push(keyword);
      }
    }

    // Return unique keywords, max 10
    return [...new Set(keywords)].slice(0, 10);
  } catch (error) {
    console.error("Extract keywords error:", error);
    return [];
  }
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const generateSitemap = async (articles) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "https://ecogrid.ca";

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add blog index
    sitemap += "  <url>\n";
    sitemap += `    <loc>${baseUrl}/blog</loc>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>0.9</priority>\n`;
    sitemap += "  </url>\n";

    // Add each article
    for (const article of articles) {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}/blog/${article.slug}</loc>\n`;
      sitemap += `    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += "  </url>\n";
    }

    sitemap += "</urlset>";

    return sitemap;
  } catch (error) {
    console.error("Generate sitemap error:", error);
    throw error;
  }
};
