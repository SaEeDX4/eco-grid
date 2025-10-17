// Mock data for dashboard - will be replaced with real API data

export const mockDashboardData = {
  kpis: {
    currentUsage: 3.2,
    todayCost: 4.85,
    todaySavings: 2.4,
    carbonOffset: 12.5,
  },

  trends: {
    last7Days: [
      { date: "Mon", usage: 28.5, cost: 8.2, savings: 3.1 },
      { date: "Tue", usage: 32.1, cost: 9.15, savings: 2.85 },
      { date: "Wed", usage: 26.8, cost: 7.5, savings: 3.5 },
      { date: "Thu", usage: 30.2, cost: 8.75, savings: 3.25 },
      { date: "Fri", usage: 29.5, cost: 8.4, savings: 3.4 },
      { date: "Sat", usage: 25.3, cost: 7.1, savings: 3.8 },
      { date: "Sun", usage: 24.1, cost: 6.9, savings: 4.1 },
    ],
    hourlyToday: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      usage: Math.random() * 5 + 1,
      forecast: Math.random() * 5 + 1,
    })),
  },

  forecast: {
    tomorrow: {
      peakHours: ["8-10 AM", "6-9 PM"],
      offPeakHours: ["12-6 AM", "10 AM-4 PM"],
      avgPrice: 0.12,
      weather: {
        temp: 18,
        condition: "Partly Cloudy",
        icon: "cloud-sun",
      },
      recommendation:
        "Run heavy appliances during off-peak hours (12-6 AM) to save 35%",
    },
  },

  devices: [
    {
      id: 1,
      name: "EV Charger",
      status: "charging",
      power: 7.2,
      lastUsed: "2 hours ago",
    },
    {
      id: 2,
      name: "Heat Pump",
      status: "active",
      power: 2.5,
      lastUsed: "Active now",
    },
    {
      id: 3,
      name: "Water Heater",
      status: "standby",
      power: 0.2,
      lastUsed: "30 mins ago",
    },
    {
      id: 4,
      name: "Solar Panels",
      status: "generating",
      power: -4.2,
      lastUsed: "Active now",
    },
  ],

  carbonWallet: {
    totalOffset: 847,
    thisMonth: 45,
    credits: 12,
    equivalents: {
      trees: 42,
      miles: 2100,
    },
    milestones: [
      { name: "First 100 kg", achieved: true, date: "2024-11-15" },
      { name: "500 kg Milestone", achieved: true, date: "2025-01-10" },
      { name: "1000 kg Goal", achieved: false, progress: 84.7 },
    ],
  },

  aiCoachTips: [
    {
      id: 1,
      type: "timing",
      priority: "high",
      message: "Run your dishwasher tonight after 10 PM to save $0.85",
      icon: "clock",
      actionable: true,
    },
    {
      id: 2,
      type: "device",
      priority: "medium",
      message:
        "Your heat pump is using 15% more than usual. Consider a filter check.",
      icon: "tool",
      actionable: true,
    },
    {
      id: 3,
      type: "optimization",
      priority: "low",
      message: "Great job! You're in the top 10% of energy savers this week.",
      icon: "trophy",
      actionable: false,
    },
  ],

  recentActivity: [
    {
      id: 1,
      action: "EV Charging Started",
      time: "2 hours ago",
      type: "device",
      icon: "zap",
      details: "Off-peak rate: $0.08/kWh",
    },
    {
      id: 2,
      action: "AI Optimization Applied",
      time: "4 hours ago",
      type: "optimization",
      icon: "cpu",
      details: "Shifted heat pump schedule",
    },
    {
      id: 3,
      action: "Report Generated",
      time: "1 day ago",
      type: "report",
      icon: "file",
      details: "Monthly ESG report ready",
    },
    {
      id: 4,
      action: "Carbon Credits Earned",
      time: "2 days ago",
      type: "reward",
      icon: "leaf",
      details: "+2 credits for optimization",
    },
  ],

  billComparison: {
    yourBill: 78.5,
    bcAverage: 125.3,
    canadaAverage: 142.8,
    savingsVsBC: 46.8,
    savingsVsCanada: 64.3,
    percentileBc: 15, // You're better than 85% of BC residents
    percentileCanada: 12,
  },

  notifications: [
    {
      id: 1,
      type: "alert",
      severity: "high",
      title: "High Usage Detected",
      message: "Your current usage is 20% above normal. Check active devices.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      type: "tip",
      severity: "medium",
      title: "Optimization Opportunity",
      message: "Energy prices will drop 30% after 10 PM tonight.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "success",
      severity: "low",
      title: "Monthly Goal Achieved",
      message: "You've saved $85 this month - 12% above your target!",
      time: "3 hours ago",
      read: true,
    },
  ],
};

// Helper function to get data with simulated API delay
export const fetchDashboardData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
  return mockDashboardData;
};

// Helper to generate random data for real-time simulation
export const generateRealtimeUpdate = () => {
  return {
    currentUsage: Math.random() * 5 + 2,
    timestamp: new Date().toISOString(),
  };
};
