// Reference data for VPP markets
// In production, this would be fetched from the API

export const marketInfo = {
  BCH: {
    name: "BC Hydro",
    region: "BC",
    color: "from-blue-500 to-cyan-600",
    description: "British Columbia integrated market",
  },
  AESO: {
    name: "AESO",
    region: "AB",
    color: "from-orange-500 to-red-600",
    description: "Alberta deregulated market",
  },
  IESO: {
    name: "IESO",
    region: "ON",
    color: "from-green-500 to-emerald-600",
    description: "Ontario electricity market",
  },
  CAISO: {
    name: "CAISO",
    region: "US-WEST",
    color: "from-purple-500 to-pink-600",
    description: "California ISO market",
  },
  ENTSOE: {
    name: "ENTSO-E",
    region: "EUROPE",
    color: "from-indigo-500 to-purple-600",
    description: "European cross-border market",
  },
};

export const productInfo = {
  energy: {
    name: "Energy",
    description: "Wholesale energy trading",
    icon: "Zap",
    color: "from-yellow-500 to-orange-600",
  },
  capacity: {
    name: "Capacity",
    description: "Grid reliability reserves",
    icon: "Battery",
    color: "from-blue-500 to-cyan-600",
  },
  "frequency-regulation": {
    name: "Frequency Regulation",
    description: "Fast-response grid balancing",
    icon: "Activity",
    color: "from-green-500 to-emerald-600",
  },
  "spinning-reserve": {
    name: "Spinning Reserve",
    description: "Emergency backup capacity",
    icon: "RotateCw",
    color: "from-purple-500 to-pink-600",
  },
  "demand-response": {
    name: "Demand Response",
    description: "Load reduction programs",
    icon: "TrendingDown",
    color: "from-red-500 to-orange-600",
  },
};

export const riskToleranceInfo = {
  conservative: {
    name: "Conservative",
    description: "Lower risk, predictable revenue",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/30",
  },
  moderate: {
    name: "Moderate",
    description: "Balanced risk and reward",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
  },
  aggressive: {
    name: "Aggressive",
    description: "Higher risk, higher potential",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
  },
};
