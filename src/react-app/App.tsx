import AdminPage from "@/react-app/pages/Admin";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/celebrities" element={<CelebritiesPage />} />
          <Route path="/celebrity/:id" element={<CelebrityDetailPage />} />
          <Route path="/selfie-upload" element={<SelfieUploadPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/email-setup" element={<EmailSetupPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
