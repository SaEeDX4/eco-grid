import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext"; // ✅ Added ChatProvider
import { TranslationProvider } from "./context/TranslationContext"; // ✅ Added TranslationProvider
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/ui/Toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ChatLauncher from "./components/chat/ChatLauncher"; // ✅ Added ChatLauncher

// ✅ Pages
import LandingPage from "./pages/LandingPage";
import DemoPage from "./pages/DemoPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
import DevicesPage from "./pages/DevicesPage";
import AboutPage from "./pages/AboutPage"; // ✅ Added for Module 13
import OptimizerPage from "./pages/OptimizerPage"; // ✅ Module 5
import ReportsPage from "./pages/ReportsPage"; // ✅ Added for Module 6
import PartnersPage from "./pages/PartnersPage"; // ✅ Added for Module 14
import ContactPage from "./pages/ContactPage"; // ✅ Added for Module 9
import PricingPage from "./pages/PricingPage"; // ✅ Added for Module 10

// ✅ From Claude
import SUVPage from "./pages/SUVPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

// Blog
import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";
import AIWriterPage from "./pages/AIWriterPage";

// Testimonials / Case Studies
import TestimonialsPage from "./pages/TestimonialsPage";
import CaseStudyPage from "./pages/CaseStudyPage";

// Pilot Map
import PilotMapPage from "./pages/PilotMapPage";

// FAQ
import FAQPage from "./pages/FAQPage";

// Roadmap
import RoadmapPage from "./pages/RoadmapPage";

// ⭐⭐⭐ VPP Pages
import VPPOverviewPage from "./pages/VPPOverviewPage";
import VPPPoolsPage from "./pages/VPPPoolsPage";
import VPPPoolDetailPage from "./pages/VPPPoolDetailPage";
import VPPRevenuePage from "./pages/VPPRevenuePage";

// ⭐⭐⭐⭐ HUB PAGES (DO NOT DELETE)
import HubList from "./pages/HubList";
import HubOverview from "./pages/HubOverview";
import HubPolicies from "./pages/HubPolicies";
import HubAnalytics from "./pages/HubAnalytics";
import HubRevenue from "./pages/HubRevenue";
import TenantDetail from "./pages/TenantDetail";
// ⭐⭐⭐⭐ END HUB PAGES

function AppContent() {
  const { toasts, removeToast } = useToast();

  // Restore token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) window.authToken = token;
  }, []);

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <Routes>
        {/* 🌍 Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/demo"
          element={
            <>
              <Navbar />
              <DemoPage />
              <Footer />
            </>
          }
        />

        {/* Static marketing pages */}
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <AboutPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/partners"
          element={
            <>
              <Navbar />
              <PartnersPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <ContactPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/pricing"
          element={
            <>
              <Navbar />
              <PricingPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/startup-visa"
          element={
            <>
              <Navbar />
              <SUVPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <>
              <Navbar />
              <PrivacyPolicyPage />
              <Footer />
            </>
          }
        />

        {/* 📰 Blog */}
        <Route
          path="/blog"
          element={
            <>
              <Navbar />
              <BlogPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/blog/:slug"
          element={
            <>
              <Navbar />
              <ArticlePage />
              <Footer />
            </>
          }
        />

        <Route
          path="/ai-writer"
          element={
            <>
              <Navbar />
              <AIWriterPage />
              <Footer />
            </>
          }
        />

        {/* Testimonials / Case Studies */}
        <Route
          path="/testimonials"
          element={
            <>
              <Navbar />
              <TestimonialsPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/case-studies/:slug"
          element={
            <>
              <Navbar />
              <CaseStudyPage />
              <Footer />
            </>
          }
        />

        {/* Map / FAQ / Roadmap */}
        <Route
          path="/map"
          element={
            <>
              <Navbar />
              <PilotMapPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/faq"
          element={
            <>
              <Navbar />
              <FAQPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/roadmap"
          element={
            <>
              <Navbar />
              <RoadmapPage />
              <Footer />
            </>
          }
        />

        {/* ⭐⭐⭐ VPP ROUTES */}
        <Route
          path="/vpp"
          element={
            <>
              <Navbar />
              <VPPOverviewPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/vpp/pools"
          element={
            <>
              <Navbar />
              <VPPPoolsPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/vpp/pools/:id"
          element={
            <>
              <Navbar />
              <VPPPoolDetailPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/vpp/revenue"
          element={
            <>
              <Navbar />
              <VPPRevenuePage />
              <Footer />
            </>
          }
        />
        {/* END VPP */}

        {/* AUTH */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <DashboardPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Navbar />
              <DevicesPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/optimizer"
          element={
            <ProtectedRoute>
              <Navbar />
              <OptimizerPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Navbar />
              <ReportsPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* ⭐⭐⭐⭐ HUB ROUTES (SAFE COPY — NO REMOVALS) */}
        <Route
          path="/hub/list"
          element={
            <ProtectedRoute>
              <Navbar />
              <HubList />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hub/:hubId"
          element={
            <ProtectedRoute>
              <Navbar />
              <HubOverview />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hub/:hubId/policies"
          element={
            <ProtectedRoute>
              <Navbar />
              <HubPolicies />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hub/:hubId/analytics"
          element={
            <ProtectedRoute>
              <Navbar />
              <HubAnalytics />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hub/:hubId/revenue"
          element={
            <ProtectedRoute>
              <Navbar />
              <HubRevenue />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hub/tenants/:tenantId"
          element={
            <ProtectedRoute>
              <Navbar />
              <TenantDetail />
              <Footer />
            </ProtectedRoute>
          }
        />
        {/* ⭐⭐⭐⭐ END HUB ROUTES */}

        {/* 404 */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="p-8 pt-28 text-center">
                <h1 className="text-4xl font-bold text-red-600">
                  404 - Page Not Found
                </h1>
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <TranslationProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <AppContent />
            </div>

            {/* Chat Launcher stays outside pages */}
            <ChatLauncher />
          </Router>
        </TranslationProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
