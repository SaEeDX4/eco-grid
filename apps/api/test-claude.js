// test-claude.js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function test() {
  try {
    console.log("🔍 Testing available models...");

    const models = [
      "claude-sonnet-4-5-20250929",
      "claude-3-opus-latest",
      "claude-3-haiku-latest",
    ];

    for (const model of models) {
      try {
        console.log(`🧠 Trying model: ${model}`);
        const response = await client.messages.create({
          model,
          max_tokens: 20,
          messages: [{ role: "user", content: "Say hi briefly." }],
        });
        console.log(`✅ Success with ${model}:`, response.content[0].text);
      } catch (error) {
        console.log(`❌ Failed with ${model}:`, error.message);
      }
    }
  } catch (err) {
    console.error("General error:", err);
  }
}

test();
