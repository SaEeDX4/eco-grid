// apps/api/src/services/aiService.js
import ClaudeAdapter from "./claude.js";

const claude = new ClaudeAdapter();

export const getAIExplanation = async (schedule, mode, savings) => {
  try {
    const deviceCount = schedule.length;
    const offPeakDevices = schedule.filter(
      (d) => d.startHour >= 0 && d.startHour < 7
    );
    const peakDevices = schedule.filter(
      (d) => d.startHour >= 16 && d.startHour < 21
    );

    const prompt = `You are an energy optimization expert explaining a smart home energy plan to a homeowner.

Context:
- Optimization Mode: ${mode}
- Total Devices: ${deviceCount}
- Devices shifted to off-peak: ${offPeakDevices.length}
- Devices during peak hours: ${peakDevices.length}
- Monthly Savings: $${savings?.monthlySavings?.toFixed(2) || 0}
- Annual Savings: $${savings?.yearlySavings?.toFixed(2) || 0}
- CO₂ Reduction: ${savings?.co2Reduced?.toFixed(0) || 0} kg/year

Device Schedule:
${schedule
  .map(
    (d) =>
      `- ${d.deviceName}: ${d.startHour}:00 - ${d.endHour}:00 (${(
        d.powerW / 1000
      ).toFixed(2)}kW)`
  )
  .join("\n")}

Create a friendly, conversational explanation that includes:

1. A brief summary (2-3 sentences) explaining what this plan does and why it saves money
2. Step-by-step breakdown (3-5 steps) of how the optimization works
3. Personalized recommendations (3-4 items) for the user based on this schedule
4. Potential improvements (2 suggestions) they could make for even better results

Guidelines:
- Be conversational and friendly, not technical
- Use simple language a homeowner would understand
- Focus on practical benefits (comfort, savings, convenience)
- Be encouraging and positive
- Keep each section concise

Respond ONLY with valid JSON in this exact format:
{
  "summary": "your summary here",
  "steps": ["step 1", "step 2", "step 3"],
  "recommendations": ["rec 1", "rec 2", "rec 3"],
  "improvements": [
    {"title": "improvement 1 title", "description": "description"},
    {"title": "improvement 2 title", "description": "description"}
  ]
}

DO NOT include any text outside the JSON object.`;

    const responseText = await claude.complete(prompt, { maxTokens: 1500 });

    // Clean and parse response
    let cleanResponse = responseText?.trim() || "";
    cleanResponse = cleanResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const explanation = JSON.parse(cleanResponse);
    return explanation;
  } catch (error) {
    console.error("AI explanation error:", error);

    // Fallback explanation
    return {
      summary: `This ${mode} optimization plan helps you save money by shifting flexible devices to off-peak hours when electricity rates are lower. You'll save approximately $${
        savings?.monthlySavings?.toFixed(2) || 0
      } per month while maintaining comfort and convenience.`,
      steps: [
        `Analyzed your ${schedule.length} devices and their power consumption patterns`,
        `Identified ${
          offPeakDevices.length
        } flexible devices that can run during cheaper off-peak hours (12 AM - 6 AM)`,
        `Kept essential devices running during your preferred times`,
        `Ensured total power usage never exceeds your home's capacity`,
        `Calculated potential savings of $${
          savings?.monthlySavings?.toFixed(2) || 0
        } per month`,
      ],
      recommendations: [
        "Schedule EV charging to start at midnight for maximum off-peak savings",
        "Water heater can run during off-peak without affecting hot water availability",
        "Keep climate control on your preferred schedule for comfort",
        "Monitor actual vs predicted savings in your dashboard",
      ],
      improvements: [
        {
          title: "Add smart thermostat scheduling",
          description:
            "Pre-heat or pre-cool your home during off-peak hours to maintain comfort while saving on peak-time energy",
        },
        {
          title: "Consider battery storage",
          description:
            "Store cheap off-peak energy in a home battery to use during expensive peak hours, saving an additional 15-20%",
        },
      ],
    };
  }
};

export const getSavingsRecommendation = async (
  currentUsage,
  devices,
  tariff
) => {
  try {
    const prompt = `You are an energy optimization advisor. Based on the user's current energy usage, provide ONE specific, actionable recommendation to save money.

Current Usage:
- Daily average: ${currentUsage.dailyKWh} kWh
- Monthly cost: $${currentUsage.monthlyCost}
- Peak hour usage: ${currentUsage.peakPercentage}%

Available Devices:
${devices.map((d) => `- ${d.name} (${d.type}): ${d.powerW}W`).join("\n")}

Tariff Information:
- Peak rate: $${tariff.peak}/kWh (4 PM - 9 PM)
- Off-peak rate: $${tariff.offPeak}/kWh (12 AM - 7 AM)

Provide ONE specific recommendation in 1-2 sentences that:
- Is immediately actionable
- Includes estimated savings
- Is personalized to their situation
- Is friendly and encouraging

Respond with ONLY the recommendation text, no JSON or formatting.`;

    const responseText = await claude.complete(prompt, { maxTokens: 200 });
    return responseText?.trim() || "";
  } catch (error) {
    console.error("Savings recommendation error:", error);
    return "Try shifting your largest flexible loads (like EV charging or water heating) to off-peak hours (12 AM - 6 AM) to save up to 35% on those devices.";
  }
};
