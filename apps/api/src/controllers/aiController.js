// apps/api/src/controllers/aiController.js
import ClaudeAdapter from "../services/claude.js";

// API key از env خونده میشه
const claude = new ClaudeAdapter(process.env.ANTHROPIC_API_KEY);

export const generateSmartHeadline = async (req, res) => {
  try {
    const { location, timeOfDay, season } = req.body;

    const prompt = `You are a marketing copywriter for Eco-Grid, a smart energy management platform in ${location || "Vancouver, BC"}.

Current context:
- Time of day: ${timeOfDay} (0-23 hours)
- Season: ${season || "winter"}
- Location: ${location || "Vancouver, BC, Canada"}

Generate a compelling, personalized headline and subheadline for the landing page hero section.

Requirements:
- Headline: 3-8 words, punchy, mentions energy/savings/green/smart
- Subheadline: 8-15 words, mentions Vancouver/BC, clarifies the value
- Consider the time and season (e.g., "Stay Warm, Save More" in winter)
- Be authentic and local to Vancouver/BC culture

Respond ONLY with valid JSON:
{
  "headline": "your headline here",
  "subheadline": "your subheadline here"
}

DO NOT include any text outside the JSON object.`;

    const response = await claude.complete(prompt, {
      model: "claude-sonnet-4-5-20250929", // ✅ updated model
      maxTokens: 200,
    });

    // Clean and validate response
    let cleanResponse = response?.trim() || "";
    cleanResponse = cleanResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let data;

    try {
      if (!cleanResponse) throw new Error("Empty Claude response");
      data = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.warn("⚠️ Invalid or empty Claude response, using fallback.");
      data = {
        headline: "Transform Your Energy Usage",
        subheadline: "Join Vancouver's Smart Energy Revolution",
      };
    }

    res.json({
      success: true,
      headline: data.headline,
      subheadline: data.subheadline,
    });
  } catch (error) {
    console.error("Smart headline generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate smart headline",
      headline: "Transform Your Energy Usage",
      subheadline: "Join Vancouver's Smart Energy Revolution",
    });
  }
};
