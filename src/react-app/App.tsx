/**
 * BrandedBy AI Platform - Main Application Router
 * 
 * AI-powered face generation platform for creating personalized videos with celebrities.
 * Tech stack: React 18 + TypeScript + Vite + Tailwind CSS + Cloudflare Workers
 * 
 * Features:
 * - Celebrity face morphing with AI
 * - Custom selfie video generation  
 * - Real-time face animation demos
 * - Payment processing and user management
 * - EmailJS logging system integration
 * - Mobile-first responsive design
 */

import EnhancedErrorBoundary from "@/react-app/components/EnhancedErrorBoundary";
import AdminPage from "@/react-app/pages/Admin";
import AdminPanel from "@/react-app/pages/AdminPanel";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import BlogPage from "@/react-app/pages/BlogPage";
import CelebritiesPage from "@/react-app/pages/Celebrities";
import CelebrityDetailPage from "@/react-app/pages/CelebrityDetail";
import DashboardPage from "@/react-app/pages/Dashboard";
import EmailSetupPage from "@/react-app/pages/EmailSetup";
import HomePage from "@/react-app/pages/Home";
import PaymentPage from "@/react-app/pages/Payment";
import SelfieUploadPage from "@/react-app/pages/SelfieUpload";
import { AuthProvider } from "@getmocha/users-service/react";
import { Route, BrowserRouter as Router, Routes } from "react-router";

export default function App() {
  return (
    <EnhancedErrorBoundary>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/celebrities" element={<CelebritiesPage />} />
          <Route path="/celebrity/:id" element={<CelebrityDetailPage />} />
          <Route path="/selfie-upload" element={<SelfieUploadPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/email-setup" element={<EmailSetupPage />} />
        </Routes>
        </Router>
      </AuthProvider>
    </EnhancedErrorBoundary>
  );
}
