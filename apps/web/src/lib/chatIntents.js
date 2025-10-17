// FAQ intents and responses for chatbot

export const faqIntents = [
  {
    id: "pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "fee",
      "subscription",
      "plan",
      "charge",
      "expensive",
      "cheap",
    ],
    question: "What are your pricing plans?",
    answer:
      "Eco-Grid offers flexible pricing:\n\n• **Households**: $10-20 CAD/month\n• **Small Business**: $100-500 CAD/month\n• **Enterprise**: Custom pricing\n\nAll plans include AI optimization, device control, and ESG reporting. Would you like to see detailed plan comparisons?",
  },
  {
    id: "privacy",
    keywords: [
      "privacy",
      "data",
      "security",
      "safe",
      "protected",
      "gdpr",
      "pipeda",
      "personal information",
    ],
    question: "How do you protect my data?",
    answer:
      "Your data security is our top priority:\n\n• Bank-grade encryption (AES-256)\n• PIPEDA compliant (Canadian privacy law)\n• Privacy-by-design architecture\n• No data selling or sharing\n• Regular security audits\n• You own your data - delete anytime\n\nWould you like more details about our security practices?",
  },
  {
    id: "devices",
    keywords: [
      "device",
      "compatible",
      "support",
      "integrate",
      "connect",
      "thermostat",
      "ev",
      "solar",
      "battery",
    ],
    question: "What devices do you support?",
    answer:
      "We support a wide range of smart devices:\n\n• **EV Chargers**: Tesla, ChargePoint, JuiceBox\n• **Thermostats**: Nest, Ecobee, Honeywell\n• **Solar**: Enphase, SolarEdge, Tesla\n• **Batteries**: Tesla Powerwall, LG Chem\n• **Smart Plugs**: TP-Link, Wemo, Belkin\n\nPlus industrial protocols: OCPP, Modbus, BACnet. Need help with a specific device?",
  },
  {
    id: "pilot",
    keywords: ["pilot", "trial", "test", "demo", "free", "try", "evaluate"],
    question: "Can I try Eco-Grid first?",
    answer:
      "Yes! We offer a pilot program:\n\n• Free platform access during pilot\n• Dedicated technical support\n• 3-6 month evaluation period\n• No long-term commitment\n• Custom reporting dashboard\n\nWould you like to apply for our pilot program?",
  },
  {
    id: "support",
    keywords: [
      "help",
      "support",
      "contact",
      "assistance",
      "hours",
      "available",
      "phone",
      "email",
    ],
    question: "How can I get support?",
    answer:
      "We provide comprehensive support:\n\n• **Email**: support@ecogrid.ca\n• **Phone**: +1 (604) 123-4567\n• **Hours**: Mon-Fri 9 AM - 5 PM PT\n• **Response time**: < 24 hours\n• **Emergency support**: Available for enterprise customers\n\nWould you like to contact our support team now?",
  },
  {
    id: "location",
    keywords: [
      "location",
      "canada",
      "bc",
      "vancouver",
      "available",
      "region",
      "province",
    ],
    question: "Where is Eco-Grid available?",
    answer:
      "Currently available in:\n\n• **British Columbia** (full service)\n• **Alberta** (pilot program)\n• **Ontario** (coming 2025)\n\nExpanding across Canada by 2026. Want to be notified when we launch in your area?",
  },
  {
    id: "savings",
    keywords: ["save", "savings", "reduce", "lower", "cut", "decrease", "bill"],
    question: "How much can I save?",
    answer:
      "Typical savings:\n\n• **Households**: 20-40% on energy costs\n• **Businesses**: 15-30% reduction\n• **Peak demand**: Up to 35% reduction\n• **Carbon footprint**: 25-50% decrease\n\nActual savings depend on your usage patterns, devices, and energy rates. Would you like a personalized estimate?",
  },
  {
    id: "integration",
    keywords: [
      "integrate",
      "api",
      "developer",
      "technical",
      "webhook",
      "oauth",
      "sdk",
    ],
    question: "Do you offer API access?",
    answer:
      "Yes! We provide:\n\n• RESTful API with OpenAPI docs\n• OAuth 2.0 authentication\n• Webhooks for real-time events\n• SDKs for popular languages\n• Developer sandbox environment\n• Rate limits: 1000 req/hour\n\nWould you like access to our developer documentation?",
  },
];

export const findMatchingIntent = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  // Calculate match scores for each intent
  const scores = faqIntents.map((intent) => {
    const matchCount = intent.keywords.filter((keyword) =>
      lowerMessage.includes(keyword),
    ).length;

    return {
      intent,
      score: matchCount,
    };
  });

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Return best match if score > 0
  if (scores[0].score > 0) {
    return scores[0].intent;
  }

  return null;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const getWelcomeMessage = () => {
  return `${getGreeting()}! I'm the Eco-Grid AI assistant. How can I help you today?\n\nYou can ask me about:\n• Pricing and plans\n• Device compatibility\n• Privacy and security\n• Pilot programs\n• Support options`;
};
