Eco-Grid — Smart Energy Optimization Platform
(React + Express + MongoDB + AI)

Eco-Grid is a comprehensive energy management system for households and SMEs in British Columbia (Vancouver).
It empowers users to monitor electricity usage, receive AI-powered optimization tips, and track their carbon footprint.

🌐 Live Demo
Render: https://eco-grid.onrender.com/

🧭 Project Overview
Eco-Grid provides an interactive dashboard that helps users understand their energy consumption and reduce costs through smart scheduling and AI insights.
It promotes sustainable living by combining modern web technologies with intelligent analytics and clean UI/UX.

🏗️ Project Structure
apps/web – React frontend (Vite)
apps/api – Express backend
packages/ui – Shared UI components
packages/lib – Shared utilities
packages/ai – AI adapter (Claude)
packages/config – Shared configuration
locales/ – i18n translation files

⚙️ Setup
Install dependencies:
npm install

Run development servers:
npm run dev

Environment configuration – create a .env file inside apps/api with:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

(Optional) Add API keys for AI integrations:
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

💡 Key Features
• Interactive Dashboard – visualize daily and monthly energy usage
• Device Hub – add and manage smart devices with estimated consumption
• AI Optimization – generate personalized energy-saving recommendations
• Reports & ESG Metrics – view monthly savings and CO₂ reduction
• Multilingual Support – English, Farsi, and French
• JWT Authentication – secure login and protected routes
• Responsive Design – fully optimized for desktop and mobile

🧰 Technologies Used
Frontend: React (Vite), Tailwind CSS, shadcn/ui, Lucide Icons
Backend: Node.js, Express.js
Database: MongoDB Atlas (Mongoose)
AI Integration: Claude / GPT API Adapter
Deployment: Render
Testing: Vitest / Jest, manual testing

🪄 Usage

Register or log in

Add devices in the Device Hub

View consumption data on the Dashboard

Use the Optimizer to see AI-generated energy-saving tips

Review monthly Reports to track savings and environmental impact

📈 Future Improvements
• Real smart-meter integrations (OCPP / Modbus / SunSpec)
• Carbon-credit wallet and rewards
• Background jobs for automated reports
• Mobile app using React Native

🧑‍🎓 Author
Saeed Sharifzadeh
Software Development Bootcamp | Capstone Project
Submitted: October 21, 2025
