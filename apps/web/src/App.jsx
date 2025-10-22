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

// ✅ New imports from Claude instruction
import SUVPage from "./pages/SUVPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

function AppContent() {
  const { toasts, removeToast } = useToast();

  // ✅ Restore token on startup
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

        {/* ✅ Added About Route */}
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

        {/* ✅ Added Partners Route */}
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

        {/* ✅ Added Contact Route */}
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

        {/* ✅ Added Pricing Route */}
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

        {/* ✅ Added Startup Visa Route */}
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

        {/* ✅ Added Privacy Policy Route */}
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

        {/* 🔐 Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

        {/* ✅ Added direct Signup route */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 🔒 Protected Routes */}
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

        {/* 🚧 404 Fallback */}
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

            {/* ✅ Chat Launcher visible on all pages */}
            <ChatLauncher />
          </Router>
        </TranslationProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
