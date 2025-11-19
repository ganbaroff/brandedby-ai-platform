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
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import { PWAInstallPrompt, ServiceWorkerStatus } from "@/react-app/hooks/useServiceWorker";
import HomePage from "@/react-app/pages/Home";
import { LazyAdminPanel, LazyCelebrities } from "@/shared/performance-optimizer";
import { AuthProvider } from "@getmocha/users-service/react";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";

// Lazy load remaining pages for better performance
const AdminPage = lazy(() => import("@/react-app/pages/Admin"));
const AdminAuthTest = lazy(() => import("@/react-app/pages/AdminAuthTest"));
const AuthCallbackPage = lazy(() => import("@/react-app/pages/AuthCallback"));
const BlogPage = lazy(() => import("@/react-app/pages/BlogPage"));
const CelebrityDetailPage = lazy(() => import("@/react-app/pages/CelebrityDetail"));
const DashboardPage = lazy(() => import("@/react-app/pages/Dashboard"));
const EmailSetupPage = lazy(() => import("@/react-app/pages/EmailSetup"));
const PaymentPage = lazy(() => import("@/react-app/pages/Payment"));
const SelfieUploadPage = lazy(() => import("@/react-app/pages/SelfieUpload"));

export default function App() {
  return (
    <EnhancedErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/celebrities" element={<LazyCelebrities />} />
              <Route path="/celebrity/:id" element={<CelebrityDetailPage />} />
              <Route path="/selfie-upload" element={<SelfieUploadPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin-panel" element={<LazyAdminPanel />} />
              <Route path="/admin-test" element={<AdminAuthTest />} />
              <Route path="/email-setup" element={<EmailSetupPage />} />
            </Routes>
          </Suspense>
          
          {/* PWA and Service Worker Components */}
          <ServiceWorkerStatus />
          <PWAInstallPrompt />
        </Router>
      </AuthProvider>
    </EnhancedErrorBoundary>
  );
}
