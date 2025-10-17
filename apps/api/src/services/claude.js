// apps/api/src/services/claude.js
import Anthropic from "@anthropic-ai/sdk";

class ClaudeAdapter {
  constructor(apiKey) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  async complete(prompt, options = {}) {
    const response = await this.client.messages.create({
      model: options.model || "claude-sonnet-4-20250514",
      max_tokens: options.maxTokens || 1000,
      messages: [{ role: "user", content: prompt }],
    });
    return response?.content?.[0]?.text ?? "";
  }

  async chat(messages, options = {}) {
    const response = await this.client.messages.create({
      model: options.model || "claude-sonnet-4-20250514",
      max_tokens: options.maxTokens || 1000,
      messages,
    });
    return response?.content?.[0]?.text ?? "";
  }
}

export default ClaudeAdapter;
