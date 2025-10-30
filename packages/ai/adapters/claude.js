import Anthropic from "@anthropic-ai/sdk";

class ClaudeAdapter {
  constructor(apiKey) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;

    if (!key || !key.startsWith("sk-ant-")) {
      console.warn(
        "❌ Anthropic API key missing or invalid. Claude not initialized."
      );
      this.client = null;
      return;
    }

    this.client = new Anthropic({ apiKey: key });
    console.log("🤖 Claude client initialized successfully.");
  }

  async complete(prompt, options = {}) {
    if (!this.client) throw new Error("Claude client not initialized");

    try {
      const response = await this.client.messages.create({
        model: options.model || "claude-sonnet-4-5-20250929", // ✅ Updated stable model
        max_tokens: options.maxTokens || 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const text = response?.content?.[0]?.text || "";
      console.log("✅ Claude API response received (complete).");
      return text;
    } catch (error) {
      console.error(
        "❌ Claude API Error (complete):",
        error.response?.data || error.message
      );
      throw new Error("Failed to get AI response from Claude");
    }
  }

  async chat(messages, options = {}) {
    if (!this.client) throw new Error("Claude client not initialized");

    try {
      const response = await this.client.messages.create({
        model: options.model || "claude-sonnet-4-5-20250929", // ✅ Updated stable model
        max_tokens: options.maxTokens || 1000,
        messages,
      });

      const text = response?.content?.[0]?.text || "";
      console.log("✅ Claude API response received (chat).");
      return text;
    } catch (error) {
      console.error(
        "❌ Claude API Error (chat):",
        error.response?.data || error.message
      );
      throw new Error("Failed to get AI response from Claude");
    }
  }
}

export default ClaudeAdapter;
