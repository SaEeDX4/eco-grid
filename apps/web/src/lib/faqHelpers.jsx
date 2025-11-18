import {
  Rocket,
  CreditCard,
  Cog,
  Plug,
  Zap,
  Lock,
  Shield,
  Code2,
  MessageCircle,
} from "lucide-react";

export const categoryInfo = {
  "getting-started": {
    name: "Getting Started",
    icon: "🚀", // kept
    Icon: Rocket, // added
    description: "Everything you need to begin your journey",
    color: "from-blue-500 to-cyan-600",
  },
  billing: {
    name: "Billing & Plans",
    icon: "💳",
    Icon: CreditCard,
    description: "Pricing, subscriptions, and payments",
    color: "from-green-500 to-emerald-600",
  },
  technical: {
    name: "Technical",
    icon: "⚙️",
    Icon: Cog,
    description: "Setup, troubleshooting, and configuration",
    color: "from-purple-500 to-pink-600",
  },
  devices: {
    name: "Devices",
    icon: "🔌",
    Icon: Plug,
    description: "Connecting and managing your devices",
    color: "from-orange-500 to-red-600",
  },
  vpp: {
    name: "Virtual Power Plant",
    icon: "⚡",
    Icon: Zap,
    description: "Earning revenue through VPP participation",
    color: "from-yellow-500 to-orange-600",
  },
  privacy: {
    name: "Privacy & Data",
    icon: "🔒",
    Icon: Lock,
    description: "How we protect and use your information",
    color: "from-indigo-500 to-purple-600",
  },
  security: {
    name: "Security",
    icon: "🛡️",
    Icon: Shield,
    description: "Keeping your account and devices safe",
    color: "from-slate-500 to-slate-700",
  },
  api: {
    name: "Developer API",
    icon: "👨‍💻",
    Icon: Code2,
    description: "Building with the Eco-Grid API",
    color: "from-teal-500 to-cyan-600",
  },
  general: {
    name: "General",
    icon: "💬",
    Icon: MessageCircle,
    description: "Everything else",
    color: "from-slate-400 to-slate-600",
  },
};

export const getCategoryInfo = (category) => {
  return categoryInfo[category] || categoryInfo.general;
};

export const highlightText = (text, query) => {
  if (!query || query.trim().length === 0) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-yellow-200 dark:bg-yellow-900/30 text-slate-900 dark:text-white px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export const formatAnswer = (answer) => {
  return answer
    .split("\n\n")
    .map((paragraph, index) => {
      paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").filter((line) => line.trim());
        return `<ul class="list-disc pl-6 space-y-1">${items
          .map((item) => `<li>${item.substring(2)}</li>`)
          .join("")}</ul>`;
      }

      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        const heading = paragraph.replace(/\*\*/g, "");
        return `<h4 class="font-bold text-lg mt-4 mb-2">${heading}</h4>`;
      }

      return `<p>${paragraph}</p>`;
    })
    .join("");
};

export const searchFAQs = (faqs, query) => {
  if (!query || query.trim().length === 0) return faqs;

  const lowerQuery = query.toLowerCase();

  return faqs.filter((faq) => {
    const questionMatch = faq.question.toLowerCase().includes(lowerQuery);
    const answerMatch = faq.answer.toLowerCase().includes(lowerQuery);
    const tagMatch = faq.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return questionMatch || answerMatch || tagMatch;
  });
};

export const getPopularSearches = () => {
  return [
    "How do I connect my devices?",
    "What does Eco-Grid cost?",
    "Is my data secure?",
    "How does VPP work?",
    "Can I cancel anytime?",
    "What devices are supported?",
  ];
};
