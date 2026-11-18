import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import PrizesPage from './pages/public/PrizesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import DrawInfoPage from './pages/public/DrawInfoPage';
import WinnersPage from './pages/public/WinnersPage';
import VerifyWinnerPage from './pages/public/VerifyWinnerPage';
import FaqPage from './pages/public/FaqPage';
import ContactPage from './pages/public/ContactPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';

// Participant Pages
import ParticipantDashboard from './pages/participant/ParticipantDashboard';
import ParticipantProfile from './pages/participant/ParticipantProfile';
import ParticipantPass from './pages/participant/ParticipantPass';
import ParticipantAnnouncements from './pages/participant/ParticipantAnnouncements';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminParticipants from './pages/admin/AdminParticipants';
import AdminPrizes from './pages/admin/AdminPrizes';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminDrawManagement from './pages/admin/AdminDrawManagement';
import AdminEnterWinners from './pages/admin/AdminEnterWinners';
import AdminWinnerApprovals from './pages/admin/AdminWinnerApprovals';
import AdminWinners from './pages/admin/AdminWinners';
import AdminPrizeClaims from './pages/admin/AdminPrizeClaims';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminReports from './pages/admin/AdminReports';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Helpers
const ProtectedAdminRoute = ({ children }) => {
  const { isAdminLoggedIn, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-gold-400 font-mono">Authenticating...</div>;
  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;
  return children;
};

const ProtectedParticipantRoute = ({ children }) => {
  const { isParticipantLoggedIn, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-gold-400 font-mono">Verifying participant...</div>;
  if (!isParticipantLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

// Layout for Public & Participant Pages
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] text-[#172033]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/prizes" element={<PublicLayout><PrizesPage /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            <Route path="/draw-information" element={<PublicLayout><DrawInfoPage /></PublicLayout>} />
            <Route path="/winners" element={<PublicLayout><WinnersPage /></PublicLayout>} />
            <Route path="/verify-winner" element={<PublicLayout><VerifyWinnerPage /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FaqPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/terms-and-conditions" element={<PublicLayout><TermsPage /></PublicLayout>} />
            <Route path="/privacy-policy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />

            {/* PARTICIPANT PORTAL */}
            <Route
              path="/participant/dashboard"
              element={
                <ProtectedParticipantRoute>
                  <PublicLayout><ParticipantDashboard /></PublicLayout>
                </ProtectedParticipantRoute>
              }
            />
            <Route
              path="/participant/profile"
              element={
                <ProtectedParticipantRoute>
                  <PublicLayout><ParticipantProfile /></PublicLayout>
                </ProtectedParticipantRoute>
              }
            />
            <Route
              path="/participant/participation"
              element={
                <ProtectedParticipantRoute>
                  <PublicLayout><ParticipantPass /></PublicLayout>
                </ProtectedParticipantRoute>
              }
            />
            <Route
              path="/participant/announcements"
              element={
                <ProtectedParticipantRoute>
                  <PublicLayout><ParticipantAnnouncements /></PublicLayout>
                </ProtectedParticipantRoute>
              }
            />

            {/* ADMIN PORTAL */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="participants" element={<AdminParticipants />} />
              <Route path="prizes" element={<AdminPrizes />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="draw-management" element={<AdminDrawManagement />} />
              <Route path="enter-winners" element={<AdminEnterWinners />} />
              <Route path="winner-approvals" element={<AdminWinnerApprovals />} />
              <Route path="winners" element={<AdminWinners />} />
              <Route path="prize-claims" element={<AdminPrizeClaims />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* FALLBACK REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
