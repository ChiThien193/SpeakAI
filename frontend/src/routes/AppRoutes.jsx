import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import PracticePage from "../pages/PracticePage";
import ProfilePage from "../pages/ProfilePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/TermsOfServicePage";
import ContactSupportPage from "../pages/ContactSupportPage";
import DashboardPage from "../pages/DashboardPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/contact-support" element={<ContactSupportPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}