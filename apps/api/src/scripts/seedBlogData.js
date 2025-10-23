import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/Article.js";

dotenv.config();

const sampleArticles = [
  {
    title:
      "How AI-Powered Energy Optimization Can Reduce Household Costs by 30%",
    slug: "ai-energy-optimization-reduce-costs",
    excerpt:
      "Discover how artificial intelligence is revolutionizing home energy management, helping families save hundreds of dollars annually while reducing their carbon footprint.",
    content: `# Introduction

Artificial intelligence is transforming how we manage energy in our homes. By analyzing consumption patterns, weather data, and utility rates, AI-powered systems can optimize energy usage in real-time, leading to significant cost savings and environmental benefits.

## The Problem with Traditional Energy Management

Most households operate on a "set and forget" approach to energy management. Thermostats are set to fixed temperatures, appliances run whenever convenient, and electric vehicle charging happens without regard to utility rates. This approach leads to:

- Unnecessarily high electricity bills
- Increased carbon emissions
- Stress on the electrical grid during peak hours
- Missed opportunities for cost savings

## How AI Optimization Works

AI-powered energy management systems like Eco-Grid use machine learning algorithms to:

### 1. Pattern Recognition

The system learns your household's energy usage patterns over time, identifying when and how you use energy most.

### 2. Predictive Analytics

By analyzing weather forecasts, utility rates, and your schedule, the AI predicts optimal times for energy-intensive activities.

### 3. Real-Time Optimization

The system automatically adjusts device schedules, thermostat settings, and charging times to minimize costs while maintaining comfort.

### 4. Continuous Learning

As your habits change and seasons shift, the AI adapts its recommendations to ensure ongoing optimization.

## Real-World Results

Our pilot program participants have seen remarkable results:

- **Average savings:** 32% reduction in electricity costs
- **Carbon reduction:** 450 kg CO₂ per household annually
- **Peak demand:** 40% reduction in peak-hour consumption
- **Comfort:** No sacrifice in quality of life

## Getting Started

Implementing AI-powered energy optimization is simpler than you might think:

1. **Install smart devices:** Start with a smart thermostat and smart plugs
2. **Connect to Eco-Grid:** Our platform integrates with most major brands
3. **Set your preferences:** Tell us your priorities (cost, comfort, environment)
4. **Let AI work:** The system learns and optimizes automatically

## Conclusion

AI-powered energy optimization isn't just about saving money—it's about building a more sustainable future. By reducing peak demand, lowering carbon emissions, and making efficient use of renewable energy, we're creating a smarter, cleaner grid for everyone.

Ready to start saving? [Join our pilot program](/contact) today.`,
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
    category: "ai-optimization",
    tags: ["AI", "Energy Efficiency", "Cost Savings", "Smart Home"],
    authorId: "team",
    status: "published",
    publishedAt: new Date("2024-10-15"),
    aiGenerated: false,
  },
  {
    title: "The Future of Virtual Power Plants in Canada",
    slug: "future-virtual-power-plants-canada",
    excerpt:
      "Virtual Power Plants are revolutionizing how we generate, store, and distribute electricity. Learn how VPPs are creating new opportunities for homeowners and businesses across Canada.",
    content: `# Introduction

Virtual Power Plants (VPPs) represent a paradigm shift in how we think about electricity generation and distribution. By aggregating distributed energy resources like solar panels, batteries, and smart devices, VPPs create a flexible, resilient alternative to traditional power plants.

## What is a Virtual Power Plant?

A Virtual Power Plant is a network of decentralized energy resources that are coordinated through software to function as a single power plant. These resources include:

- Residential solar panels
- Home battery systems
- Electric vehicle batteries
- Smart thermostats and appliances
- Commercial energy storage

## The Canadian Opportunity

Canada is uniquely positioned to benefit from VPP technology:

### Provincial Grid Challenges

Many Canadian provinces face seasonal demand spikes and transmission constraints. VPPs can help balance these challenges without expensive infrastructure upgrades.

### Renewable Energy Growth

As Canada expands its renewable energy capacity, VPPs provide the flexibility needed to integrate variable sources like wind and solar.

### Economic Benefits

VPP participants can earn revenue by providing grid services, creating new income streams for homeowners and businesses.

## How VPPs Work

1. **Enrollment:** Homeowners and businesses opt in to share their energy resources
2. **Aggregation:** The VPP platform combines thousands of small resources
3. **Optimization:** AI determines the best use of each resource
4. **Grid Services:** The VPP provides capacity, frequency regulation, and demand response
5. **Revenue Sharing:** Participants receive compensation for their contribution

## Real-World Impact

Early VPP deployments in Canada are showing promising results:

- **Peak capacity:** VPPs have provided over 50 MW of flexible capacity
- **Cost savings:** Participants earn $200-500 annually per household
- **Grid stability:** 99.9% reliability during demand response events
- **Carbon reduction:** Equivalent to removing 10,000 cars from roads

## Regulatory Landscape

Canadian regulators are increasingly supportive of VPP technology:

- Ontario has approved VPP participation in capacity markets
- BC Hydro is piloting VPP programs
- Alberta's deregulated market offers significant VPP opportunities

## Getting Involved

To participate in a VPP:

1. Install qualifying equipment (solar, battery, smart devices)
2. Join a VPP aggregator like Eco-Grid
3. Set your participation preferences
4. Earn revenue automatically

## Conclusion

Virtual Power Plants represent the future of electricity systems—distributed, flexible, and sustainable. As Canada works toward its net-zero goals, VPPs will play a crucial role in building a cleaner, more resilient grid.

Interested in joining a VPP? [Contact us](/contact) to learn more.`,
    heroImage:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200",
    category: "clean-energy",
    tags: ["VPP", "Virtual Power Plant", "Grid Services", "Renewable Energy"],
    authorId: "team",
    status: "published",
    publishedAt: new Date("2024-10-10"),
    aiGenerated: false,
  },
  {
    title: "Understanding Time-of-Use Electricity Rates in British Columbia",
    slug: "understanding-tou-rates-bc",
    excerpt:
      "Time-of-Use rates can significantly impact your electricity bill. Learn how to take advantage of BC's rate structures to save money and reduce grid stress.",
    content: `# Introduction

Time-of-Use (TOU) electricity rates are becoming increasingly common across Canada, including in British Columbia. Understanding these rates and optimizing your energy consumption accordingly can lead to substantial savings.

## What are Time-of-Use Rates?

TOU rates charge different prices for electricity depending on when you use it. Typically, rates are highest during peak hours when demand is greatest, and lowest during off-peak hours.

### BC Hydro Rate Structure

BC Hydro uses a two-tier system:

- **Tier 1:** First 1,350 kWh per billing period (residential)
- **Tier 2:** Usage above 1,350 kWh

While BC Hydro doesn't yet have full TOU rates, pilot programs are testing dynamic pricing models.

## Why TOU Rates Matter

### Economic Benefits

Shifting usage to off-peak hours can save 20-40% on electricity costs.

### Environmental Impact

Peak hours often require fossil fuel generation. Using power during off-peak hours means more renewable energy.

### Grid Stability

Reducing peak demand helps prevent blackouts and defers costly infrastructure upgrades.

## Strategies for Optimizing TOU Rates

### 1. Shift Major Appliances

Run dishwashers, washing machines, and dryers during off-peak hours.

### 2. Smart EV Charging

Schedule EV charging for overnight hours when rates are lowest.

### 3. Pre-Cool or Pre-Heat

Use HVAC systems to adjust temperature before peak hours, then reduce usage during peaks.

### 4. Battery Storage

Store energy during off-peak hours and use it during peak times.

### 5. Solar + Storage

Generate power during the day, store excess, and use it during evening peaks.

## Eco-Grid's TOU Optimization

Our platform automatically optimizes your energy usage for TOU rates:

- **Smart scheduling:** Automatically runs appliances during off-peak hours
- **Battery management:** Optimizes charge/discharge cycles
- **Forecast integration:** Anticipates rate changes and adjusts accordingly
- **Comfort priority:** Ensures optimization doesn't compromise comfort

## Real Savings

Case study: Vancouver household

- **Before optimization:** $180/month electricity bill
- **After optimization:** $108/month (40% savings)
- **Annual savings:** $864
- **Payback period:** 18 months

## Future of TOU in BC

BC Hydro is expanding TOU pilots and may implement province-wide TOU rates by 2026. Early adopters who optimize now will be well-positioned for future rate structures.

## Getting Started

1. Review your current usage patterns
2. Identify flexible loads (appliances, EV, HVAC)
3. Install smart controls
4. Connect to Eco-Grid for automatic optimization

## Conclusion

Time-of-Use rates represent the future of electricity pricing. By understanding and optimizing for these rates, you can save money, reduce environmental impact, and support grid stability.

Ready to optimize? [Start your free trial](/contact) today.`,
    heroImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    category: "policy-regulation",
    tags: ["Time-of-Use", "BC Hydro", "Electricity Rates", "Cost Savings"],
    authorId: "team",
    status: "published",
    publishedAt: new Date("2024-10-05"),
    aiGenerated: false,
  },
];

const seedBlogData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing articles
    await Article.deleteMany({});
    console.log("Cleared existing articles");

    // Insert sample articles
    const articles = await Article.insertMany(sampleArticles);
    console.log(`Inserted ${articles.length} sample articles`);

    console.log("Blog data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed blog data error:", error);
    process.exit(1);
  }
};

seedBlogData();
