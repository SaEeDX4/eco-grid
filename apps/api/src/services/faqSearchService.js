import FAQ from "../models/FAQ.js";
import { callClaude } from "./aiService.js";

export const semanticSearch = async (query, language = "en", limit = 5) => {
  try {
    // Get all published FAQs for this language
    const allFAQs = await FAQ.find({
      status: "published",
      language,
    }).lean();

    if (allFAQs.length === 0) {
      return [];
    }

    // Create a prompt for Claude to find most relevant FAQs
    const faqList = allFAQs
      .map(
        (faq, index) =>
          `${index + 1}. Q: ${faq.question}\nA: ${faq.answer.substring(0, 200)}...`
      )
      .join("\n\n");

    const prompt = `You are helping match a user's question to the most relevant FAQ entries.

User's question: "${query}"

Available FAQs:
${faqList}

Task: Return ONLY a JSON array of the top ${limit} most relevant FAQ numbers (1-${allFAQs.length}), ordered by relevance. Consider semantic similarity, not just keyword matching.

Format: [1, 5, 3] (just the numbers, no explanation)

If no FAQs are relevant, return an empty array: []`;

    const response = await callClaude(prompt, {
      maxTokens: 100,
      temperature: 0.3,
    });

    // Parse the response
    let relevantIndices = [];
    try {
      // Extract JSON array from response
      const match = response.match(/\[[\d,\s]+\]/);
      if (match) {
        relevantIndices = JSON.parse(match[0]);
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
    }

    // Map indices back to FAQs
    const results = relevantIndices
      .filter((index) => index > 0 && index <= allFAQs.length)
      .map((index) => allFAQs[index - 1])
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error("Semantic search error:", error);
    // Fallback to text search
    return await FAQ.search(query, language).limit(limit);
  }
};

export const findRelatedQuestions = async (faqId, limit = 5) => {
  try {
    const faq = await FAQ.findById(faqId);
    if (!faq) return [];

    // If related questions are manually set, use those
    if (faq.relatedQuestions && faq.relatedQuestions.length > 0) {
      return await FAQ.find({
        _id: { $in: faq.relatedQuestions },
        status: "published",
      })
        .limit(limit)
        .lean();
    }

    // Otherwise, find FAQs with similar tags or same category
    const related = await FAQ.find({
      _id: { $ne: faqId },
      status: "published",
      language: faq.language,
      $or: [{ tags: { $in: faq.tags } }, { category: faq.category }],
    })
      .limit(limit)
      .lean();

    return related;
  } catch (error) {
    console.error("Find related questions error:", error);
    return [];
  }
};

export const analyzeSearchQuery = async (query) => {
  try {
    const prompt = `Analyze this FAQ search query and extract:
1. Main topic/intent
2. Suggested categories (from: getting-started, billing, technical, devices, vpp, privacy, security, api, general)
3. Key search terms

Query: "${query}"

Respond with JSON only:
{
  "intent": "brief description",
  "categories": ["category1", "category2"],
  "searchTerms": ["term1", "term2"]
}`;

    const response = await callClaude(prompt, {
      maxTokens: 200,
      temperature: 0.3,
    });

    // Parse JSON response
    const match = response.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    return null;
  } catch (error) {
    console.error("Analyze search query error:", error);
    return null;
  }
};
