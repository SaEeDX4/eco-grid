export const generateDeviceAdvisorPrompt = (device) => {
  return `You are a device energy advisor. Analyze this device and provide a 1-2 line actionable tip.

Device details:
- Type: ${device.type}
- Brand: ${device.brand || "Generic"}
- Status: ${device.status}
- Current power usage: ${device.powerW || "Unknown"}W
- Average daily usage: ${device.avgDailyKWh || "Unknown"}kWh
- Last activity: ${device.lastSeen || "Unknown"}

Provide a specific, friendly tip about:
- Standby power waste if applicable
- Optimal usage timing
- Energy-saving mode suggestions
- Maintenance for efficiency

Keep it under 25 words. Be direct and helpful.`;
};
