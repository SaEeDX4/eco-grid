// apps/packages/ai/adapters/claude.js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generate(prompt, options = {}) {
  try {
    const response = await client.messages.create({
      model: options.model || "claude-3-5-sonnet-20241022",
      max_tokens: options.max_tokens || 500,
      temperature: options.temperature || 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content?.[0]?.text || "";
    console.log("🤖 Claude AI response ready");
    return { text };
  } catch (error) {
    console.error("❌ Claude API error:", error);
    return { text: "Claude API error occurred." };
  }
}
