import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

export const generateOutlineWithAI = async ({
  prompt,
  category,
  targetAudience,
  tone,
}) => {
  try {
    const systemPrompt = `You are an expert content strategist and editor specializing in clean energy, sustainability, and technology topics. Your role is to create well-structured article outlines that are informative, engaging, and actionable.

Create outlines that:
- Have a clear, compelling title
- Include a strong introduction that hooks the reader
- Break down the topic into 4-6 main sections with logical flow
- Provide 3-5 key points for each section
- End with a powerful conclusion that summarizes and inspires action
- Are appropriate for the target audience and maintain the specified tone

Category: ${category}
Target Audience: ${targetAudience || "general"}
Tone: ${tone || "professional"}`;

    const userPrompt = `Create a detailed article outline for the following topic:

${prompt}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "title": "Article title here",
  "introduction": "Brief introduction summary (2-3 sentences)",
  "sections": [
    {
      "id": "section-1",
      "heading": "Section heading",
      "points": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ],
  "conclusion": "Brief conclusion summary (2-3 sentences)"
}`;

    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const generationTime = Date.now() - startTime;

    // Extract JSON from response
    let outlineText = message.content[0].text.trim();

    // Remove markdown code blocks if present
    outlineText = outlineText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    const outline = JSON.parse(outlineText);

    // Validate outline structure
    if (
      !outline.title ||
      !outline.sections ||
      !Array.isArray(outline.sections)
    ) {
      throw new Error("Invalid outline structure returned by AI");
    }

    // Add IDs to sections if missing
    outline.sections = outline.sections.map((section, index) => ({
      ...section,
      id: section.id || `section-${index + 1}`,
    }));

    return {
      outline,
      model: MODEL,
      tokensUsed: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
        total: message.usage.input_tokens + message.usage.output_tokens,
      },
      generationTime,
    };
  } catch (error) {
    console.error("Generate outline with AI error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

export const generateArticleWithAI = async (outline) => {
  try {
    const systemPrompt = `You are an expert content writer specializing in clean energy, sustainability, and technology. Your role is to write comprehensive, well-researched articles that are informative, engaging, and accessible.

Write articles that:
- Use clear, professional language appropriate for the target audience
- Include specific examples, data, and real-world applications
- Break down complex concepts into understandable explanations
- Maintain an engaging narrative flow throughout
- Use proper Markdown formatting (headers, bold, lists, code blocks where appropriate)
- Are factually accurate and balanced
- Include actionable insights and practical takeaways
- Are approximately 1200-2000 words in length

CRITICAL: Return ONLY valid Markdown content. Do NOT include any JSON, explanations, or metadata. The response should be pure article content ready for publication.`;

    const userPrompt = `Write a complete article based on this outline:

**Title:** ${outline.title}

**Introduction:** ${outline.introduction}

**Main Sections:**
${outline.sections
  .map(
    (section, index) => `
${index + 1}. ${section.heading}
${section.points.map((point) => `   - ${point}`).join("\n")}
`
  )
  .join("\n")}

**Conclusion:** ${outline.conclusion}

Write the full article in Markdown format. Include:
- An engaging introduction that expands on the outline
- Detailed sections with examples and explanations
- Proper headings (## for main sections, ### for subsections)
- A compelling conclusion that reinforces key points

Return ONLY the Markdown content, starting with the introduction (do NOT repeat the title as # heading).`;

    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const generationTime = Date.now() - startTime;

    const content = message.content[0].text.trim();

    // Calculate reading time
    const words = content.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    // Generate excerpt from first paragraph
    const firstParagraph = content.split("\n\n")[0];
    const excerpt =
      firstParagraph.length > 200
        ? firstParagraph.substring(0, 197) + "..."
        : firstParagraph;

    const article = {
      title: outline.title,
      excerpt,
      content,
      category: outline.category || "technology",
      tags: extractTags(content),
      readingTime,
      authorId: "ai",
      status: "draft",
    };

    return {
      article,
      model: MODEL,
      tokensUsed: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
        total: message.usage.input_tokens + message.usage.output_tokens,
      },
      generationTime,
    };
  } catch (error) {
    console.error("Generate article with AI error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

// Helper function to extract relevant tags from content
const extractTags = (content) => {
  const commonTags = [
    "Solar Energy",
    "Wind Energy",
    "Battery Storage",
    "EV Charging",
    "Carbon Reduction",
    "Smart Grid",
    "Energy Efficiency",
    "VPP",
    "Net Zero",
    "Renewable Energy",
    "Climate Tech",
    "AI Optimization",
    "IoT",
    "Sustainability",
    "Clean Energy",
    "Energy Management",
  ];

  const contentLower = content.toLowerCase();
  const foundTags = commonTags.filter((tag) =>
    contentLower.includes(tag.toLowerCase())
  );

  return foundTags.slice(0, 5); // Return max 5 tags
};
