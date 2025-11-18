import mongoose from "mongoose";
import dotenv from "dotenv";
import FAQ from "../models/FAQ.js";

dotenv.config();

const faqs = [
  // Getting Started
  {
    question: "What is Eco-Grid and how does it work?",
    answer: `Eco-Grid is an AI-powered energy management platform that helps households and businesses optimize their energy consumption, reduce costs, and lower their carbon footprint.

Our platform connects to your smart devices (solar panels, EV chargers, batteries, thermostats) and uses predictive AI to automatically optimize when and how you use energy. We analyze real-time pricing, weather forecasts, and your usage patterns to make intelligent decisions that save you money while supporting grid stability.

Key features include:
- Real-time energy monitoring and control
- AI-powered optimization recommendations
- Virtual Power Plant (VPP) participation for additional revenue
- Detailed reports and carbon tracking
- Integration with 100+ smart home devices

Getting started is simple: sign up, connect your devices, and let our AI start optimizing immediately.`,
    category: "getting-started",
    tags: ["basics", "overview", "how-it-works"],
    language: "en",
    order: 1,
    status: "published",
  },
  {
    question: "How do I sign up and get started?",
    answer: `Getting started with Eco-Grid takes just a few minutes:

**Step 1: Create Your Account**
- Visit ecogrid.ca and click "Sign Up"
- Enter your email and create a secure password
- Verify your email address

**Step 2: Set Up Your Profile**
- Add your location (for local utility rates and weather)
- Select your utility provider
- Choose your tariff plan (Time-of-Use, Flat Rate, etc.)

**Step 3: Connect Your Devices**
- Go to the Devices page
- Click "Add Device" and select your device type
- Follow the connection wizard for each device
- We support solar panels, EV chargers, batteries, thermostats, and more

**Step 4: Start Saving**
- Our AI immediately begins analyzing your energy patterns
- You'll see optimization recommendations within 24 hours
- Enable auto-optimization for hands-free savings

Need help? Our support team is available 24/7 via live chat.`,
    category: "getting-started",
    tags: ["signup", "onboarding", "setup"],
    language: "en",
    order: 2,
    status: "published",
  },
  {
    question: "What devices are compatible with Eco-Grid?",
    answer: `Eco-Grid supports a wide range of smart energy devices through multiple protocols:

**Solar & Storage:**
- Solar panels (SunSpec, Modbus, manufacturer APIs)
- Battery storage systems (Tesla Powerwall, LG Chem, Enphase, etc.)
- Solar inverters (SolarEdge, Fronius, SMA, etc.)

**EV Charging:**
- Level 2 home chargers with OCPP support
- Tesla Wall Connector
- ChargePoint Home
- JuiceBox
- Most Wi-Fi enabled chargers

**HVAC & Climate:**
- Smart thermostats (Nest, Ecobee, Honeywell Home)
- Heat pumps with smart controls
- Smart vents and zoning systems

**Smart Home Integration:**
- Apple HomeKit devices
- Google Home devices
- Amazon Alexa devices
- Samsung SmartThings
- Zigbee and Z-Wave devices

**Industrial/Commercial:**
- Building management systems (BACnet, Modbus)
- Industrial controllers
- Energy monitoring systems

Not seeing your device? Contact us - we're constantly adding new integrations and can often add support for specific devices upon request.`,
    category: "devices",
    tags: ["compatibility", "devices", "supported", "integration"],
    language: "en",
    order: 3,
    status: "published",
  },

  // Billing
  {
    question: "How much does Eco-Grid cost?",
    answer: `Eco-Grid offers flexible pricing plans to fit every need:

**Household Plans:**
- **Free Tier:** Basic monitoring and manual optimization (up to 3 devices)
- **Home Plan:** $15-20 CAD/month - Full AI optimization, unlimited devices, carbon tracking
- **Home Plus:** $25-30 CAD/month - Includes VPP participation, advanced analytics, priority support

**Business Plans:**
- **Small Business:** $100-200 CAD/month (up to 50 devices)
- **Enterprise:** $500+ CAD/month - Custom pricing based on scale and requirements

**What's Included:**
- No setup fees or contracts
- Cancel anytime
- 30-day money-back guarantee
- All plans include mobile app access
- Free device connections
- Regular software updates

**ROI Guarantee:**
Most customers save 2-3x their subscription cost through energy optimization and VPP revenue. If you don't save more than your subscription in the first 90 days, we'll refund the difference.

Annual plans available with 20% discount.`,
    category: "billing",
    tags: ["pricing", "cost", "plans", "subscription"],
    language: "en",
    order: 10,
    status: "published",
  },
  {
    question: "Do you offer a free trial?",
    answer: `Yes! We offer a **30-day free trial** with full access to all features:

**What's Included in Your Trial:**
- Connect unlimited devices
- Full AI optimization capabilities
- Access to all reports and analytics
- Mobile app access
- VPP participation (where available)
- Email and chat support

**No Credit Card Required:**
- Sign up without payment information
- Explore all features risk-free
- Cancel anytime during trial with no charges

**After Your Trial:**
- Choose the plan that fits your needs
- Keep all your device connections and settings
- Continue saving with no interruption

**Trial Extension:**
- Need more time? Contact support for a trial extension
- Available for users still setting up devices or evaluating features

Start your free trial today at ecogrid.ca/signup - no commitment required!`,
    category: "billing",
    tags: ["trial", "free", "demo"],
    language: "en",
    order: 11,
    status: "published",
  },

  // Technical
  {
    question: "How secure is my data?",
    answer: `Security and privacy are our top priorities. Here's how we protect your data:

**Encryption:**
- AES-256 encryption for data at rest
- TLS 1.3 for all data in transit
- End-to-end encryption for sensitive device communications

**Access Controls:**
- Multi-factor authentication (MFA) available
- Role-based access control (RBAC)
- Regular security audits and penetration testing

**Data Privacy:**
- PIPEDA compliant (Canadian privacy law)
- GDPR compliant for international users
- SOC 2 Type II certified
- We never sell your data to third parties

**Infrastructure Security:**
- Hosted on ISO 27001 certified data centers in Canada
- Regular backups with encryption
- Disaster recovery protocols
- 24/7 security monitoring

**Device Security:**
- OAuth 2.0 for device authorization
- API keys with configurable scopes
- Rate limiting and anomaly detection
- Secure device firmware updates

**Your Control:**
- Export your data anytime
- Delete your account and all data
- Granular privacy settings
- Transparent data usage policies

Read our full Security & Privacy Policy at ecogrid.ca/security`,
    category: "security",
    tags: ["security", "privacy", "encryption", "data-protection"],
    language: "en",
    order: 20,
    status: "published",
  },
  {
    question: "What happens if my internet goes down?",
    answer: `Eco-Grid is designed to work reliably even during connectivity issues:

**Local Device Control:**
- Your devices continue operating normally
- Previously set schedules remain active
- Manual controls still work directly on devices

**Smart Fallback:**
- Devices follow last-known optimization schedule
- Battery systems maintain charge/discharge patterns
- EV chargers continue based on last settings

**Automatic Recovery:**
- System reconnects automatically when internet returns
- Catches up on missed optimization opportunities
- Syncs data and analytics once online

**Critical Systems:**
- Battery backup systems prioritize essential loads
- Solar systems continue generating power
- No interruption to your energy supply

**Offline Mode (Coming Soon):**
- Local processing on hub device
- Basic optimization without cloud connection
- Full sync when reconnected

**Best Practices:**
- We recommend UPS backup for your router
- Consider cellular backup for critical installations
- Commercial users can deploy local edge devices

Your devices and home remain fully functional - you just won't get real-time optimization updates until connectivity is restored.`,
    category: "technical",
    tags: ["offline", "internet", "connectivity", "reliability"],
    language: "en",
    order: 21,
    status: "published",
  },
  {
    question: "Can I control Eco-Grid with voice commands?",
    answer: `Yes! Eco-Grid integrates with major voice assistants:

**Supported Voice Assistants:**
- Amazon Alexa
- Google Assistant
- Apple Siri (via Shortcuts)

**Example Voice Commands:**
- "Alexa, ask Eco-Grid how much energy I've saved today"
- "Hey Google, set my home to Eco Mode"
- "Alexa, tell Eco-Grid to charge my EV now"
- "Hey Google, what's my current power usage?"
- "Alexa, optimize my energy for tomorrow"

**Setup Instructions:**

**For Alexa:**
1. Enable the Eco-Grid skill in the Alexa app
2. Link your Eco-Grid account
3. Discover devices
4. Start using voice commands

**For Google Assistant:**
1. Open Google Home app
2. Add Eco-Grid under "Works with Google"
3. Link your account
4. Use voice commands

**For Siri:**
1. Create shortcuts in the Shortcuts app
2. Connect to Eco-Grid API
3. Trigger with "Hey Siri"

**Privacy Note:**
Voice commands are processed securely and never stored. You can disable voice control anytime in settings.`,
    category: "technical",
    tags: ["voice", "alexa", "google", "siri", "integration"],
    language: "en",
    order: 22,
    status: "published",
  },

  // VPP
  {
    question:
      "What is the Virtual Power Plant (VPP) and how can I earn revenue?",
    answer: `Our Virtual Power Plant (VPP) program allows you to earn money by sharing your flexible energy resources with the grid:

**How It Works:**
When the grid needs support during peak demand, we can temporarily:
- Discharge your battery
- Adjust your EV charging schedule
- Shift your thermostat by 1-2 degrees
- Delay non-critical loads

In return, you earn revenue payments from utilities and grid operators.

**Earning Potential:**
- **Average household:** $15-50 CAD/month
- **With battery storage:** $30-100 CAD/month
- **Commercial installations:** $200-1000+ CAD/month

**Your Control:**
- Set minimum battery reserve levels
- Define comfort ranges for temperature
- Choose which devices participate
- Override anytime with one tap
- Opt out completely if desired

**No Impact on Comfort:**
- Most events are short (15-60 minutes)
- We never compromise essential services
- Temperature changes are minimal (1-2°C)
- You always have manual control

**Requirements:**
- Eco-Grid Home Plus subscription or higher
- Compatible battery storage or flexible loads
- Located in VPP-enabled region

**Payments:**
- Paid monthly via direct deposit
- Transparent earnings dashboard
- Detailed event history
- Tax documents provided

Join the energy transition while earning passive income. Enable VPP in your account settings today!`,
    category: "vpp",
    tags: ["vpp", "revenue", "earnings", "virtual-power-plant"],
    language: "en",
    order: 30,
    status: "published",
  },
  {
    question: "Is VPP participation safe for my battery?",
    answer: `Absolutely! We've designed VPP participation to protect and extend your battery's lifespan:

**Battery Health Protection:**
- Smart charge/discharge limits (never below 20%, never above 90%)
- Optimal charge rate management
- Temperature monitoring and protection
- Cycle count optimization

**Manufacturer Compliance:**
- All operations within warranty specifications
- Following Tesla, LG, Enphase guidelines
- Regular firmware update compatibility checks

**Real Data:**
- VPP participation typically adds only 5-10 extra cycles per month
- Modern batteries rated for 5,000-10,000 cycles
- Additional wear is minimal compared to normal usage
- Many users see better battery longevity due to optimized charging

**Your Protection:**
- Set custom battery reserve levels
- Maximum depth of discharge limits
- Cycle count tracking
- Automatic pause if battery health degrades

**Insurance:**
- All VPP operations covered by our insurance
- Warranty preservation guarantee
- Equipment protection included

**Transparency:**
- Real-time battery health monitoring
- Detailed cycle and usage logs
- Performance analytics
- Manufacturer warranty status tracking

VPP events are carefully orchestrated to prioritize your battery's health while maximizing your earnings. Most events use less than 20% of battery capacity.`,
    category: "vpp",
    tags: ["vpp", "battery", "safety", "warranty"],
    language: "en",
    order: 31,
    status: "published",
  },

  // Privacy
  {
    question: "What data do you collect and how is it used?",
    answer: `We believe in complete transparency about data collection and use:

**Data We Collect:**

**Account Data:**
- Email, name, location (for tariff calculations)
- Billing information (processed securely via Stripe)
- Communication preferences

**Energy Data:**
- Real-time power consumption and generation
- Device status and settings
- Tariff rates and utility bills
- Weather data (from public sources)

**Usage Analytics:**
- Feature usage within the app
- Performance metrics
- Error logs (anonymized)

**How We Use Your Data:**

**For You:**
- Energy optimization and recommendations
- Accurate savings calculations
- Personalized insights and reports
- Device control and automation

**For Service Improvement:**
- Aggregated analytics (anonymized)
- AI model training (your data stays private)
- Performance optimization
- Feature development

**What We DON'T Do:**
- ❌ Sell your data to third parties
- ❌ Share with advertisers
- ❌ Use for unrelated marketing
- ❌ Access without permission

**Your Rights:**
- Export all your data (JSON/CSV)
- Delete your account and all data
- Opt out of analytics
- Control data retention periods
- Request data corrections

**Data Retention:**
- Active account data: Retained while account active
- Deleted account: 30-day grace period, then permanent deletion
- Backups: Encrypted, automatically purged after 90 days

**Compliance:**
- PIPEDA (Canada)
- GDPR (EU users)
- CCPA (California users)

Read our complete Privacy Policy at ecogrid.ca/privacy`,
    category: "privacy",
    tags: ["privacy", "data", "collection", "usage"],
    language: "en",
    order: 40,
    status: "published",
  },

  // API
  {
    question: "Does Eco-Grid offer a developer API?",
    answer: `Yes! We offer a comprehensive REST API for developers and partners:

**API Access:**
- Available on all paid plans
- Free tier: 1,000 requests/day
- Business plans: 100,000+ requests/day
- Enterprise: Custom limits

**What You Can Do:**
- Read real-time energy data
- Control devices programmatically
- Access historical analytics
- Manage users and settings
- Integrate with third-party systems

**API Features:**
- RESTful architecture
- JSON responses
- OAuth 2.0 authentication
- Webhooks for real-time updates
- Comprehensive documentation
- OpenAPI 3.0 spec
- Code examples in multiple languages

**Getting Started:**
1. Go to Settings > Developer
2. Generate API key
3. Read documentation at docs.ecogrid.ca
4. Start building!

**Rate Limits:**
- Generous limits with automatic scaling
- Real-time rate limit headers
- Retry-After headers for throttled requests

**Support:**
- Developer Discord community
- Email support for API issues
- Monthly office hours
- Sample code and SDKs

**Use Cases:**
- Custom dashboards and visualizations
- Integration with home automation systems
- Energy analytics tools
- Research and data analysis
- Third-party app development

**Enterprise Features:**
- Dedicated API endpoints
- SLA guarantees
- Priority support
- Custom webhooks
- Higher rate limits

Start building at ecogrid.ca/developers`,
    category: "api",
    tags: ["api", "developer", "integration", "webhooks"],
    language: "en",
    order: 50,
    status: "published",
  },

  // General
  {
    question: "How can I contact support?",
    answer: `We offer multiple support channels to help you quickly:

**Live Chat:**
- Click the chat icon in the bottom-right
- Available 24/7 for urgent issues
- Average response time: < 2 minutes
- Available in English, French, Farsi

**Email Support:**
- support@ecogrid.ca
- Response within 24 hours (usually faster)
- Attach screenshots for faster resolution

**Phone Support:**
- Toll-free: 1-800-ECO-GRID (1-800-326-4743)
- Business hours: Mon-Fri 8am-8pm PT
- Emergency line: 24/7 for critical issues

**Help Center:**
- help.ecogrid.ca
- Searchable knowledge base
- Video tutorials
- Step-by-step guides
- Community forum

**Social Media:**
- Twitter: @EcoGridHQ
- Facebook: /EcoGridCanada
- LinkedIn: /company/eco-grid

**Priority Support:**
- Available on Business and Enterprise plans
- Dedicated account manager
- Direct phone line
- Faster response times
- Scheduled check-ins

**Emergency Support:**
For critical issues affecting energy supply:
- Call: 1-800-ECO-GRID
- Press 9 for emergency support
- Available 24/7/365

**What to Include:**
When contacting support, please provide:
- Your account email
- Device type and model
- Screenshot of issue (if applicable)
- Error messages
- Steps to reproduce

We're here to help make your Eco-Grid experience smooth and successful!`,
    category: "general",
    tags: ["support", "contact", "help", "customer-service"],
    language: "en",
    order: 60,
    status: "published",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: `Yes! You can cancel your Eco-Grid subscription at any time with no penalties or fees:

**How to Cancel:**
1. Log in to your account
2. Go to Settings > Billing
3. Click "Cancel Subscription"
4. Confirm cancellation
5. You'll receive a confirmation email

**What Happens:**
- Your subscription remains active until the end of your billing period
- You keep access to all features until then
- No further charges after cancellation
- Your devices remain connected but optimization stops

**Data Retention:**
- Your account and data remain for 30 days after cancellation
- You can reactivate anytime during this period
- After 30 days, account moves to Free tier (if eligible)
- Or you can request permanent deletion

**Refund Policy:**
- **30-day money-back guarantee** on first subscription
- Pro-rated refunds available within first 60 days
- No questions asked
- Refunds processed within 5-7 business days

**Reactivation:**
- Simply go to Billing and select a new plan
- All your devices and settings are preserved
- No setup required
- Pick up right where you left off

**Alternatives to Cancelling:**
Before canceling, consider:
- **Pause subscription:** Take a break for 1-3 months
- **Downgrade plan:** Switch to a lower-cost tier
- **Talk to us:** We might have a solution or discount

**Free Tier:**
After cancellation, you can:
- Keep monitoring up to 3 devices
- View basic analytics
- Export your historical data
- Maintain account for future use

**No Hard Feelings:**
We're sad to see you go, but we understand. If you decide to cancel, please let us know why - your feedback helps us improve!

Questions? Contact support@ecogrid.ca`,
    category: "billing",
    tags: ["cancel", "subscription", "refund"],
    language: "en",
    order: 12,
    status: "published",
  },
];

const seedFAQs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log("Cleared existing FAQs");

    // Insert FAQs
    const insertedFAQs = await FAQ.insertMany(faqs);
    console.log(`Inserted ${insertedFAQs.length} FAQs`);

    // Get stats by category
    const categoryStats = await FAQ.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log("\nFAQs by Category:");
    categoryStats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    console.log("\nFAQs seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed FAQs error:", error);
    process.exit(1);
  }
};

seedFAQs();
