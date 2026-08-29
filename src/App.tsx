import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './components/public/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ReviewerOnboarding } from './components/reviewer/ReviewerOnboarding';
import { ReviewerDashboard } from './components/reviewer/ReviewerDashboard';
import { ReviewerTaskWorkspace } from './components/reviewer/ReviewerTaskWorkspace';
import { ReviewerWallet } from './components/reviewer/ReviewerWallet';
import { ReviewerRewards } from './components/reviewer/ReviewerRewards';
import { ReviewerLeaderboard } from './components/reviewer/ReviewerLeaderboard';
import { ReviewerAcademy } from './components/reviewer/ReviewerAcademy';
import { ReviewerProfileView } from './components/reviewer/ReviewerProfileView';
import { ReviewerBottomNav } from './components/reviewer/ReviewerBottomNav';
import { BrandDashboard } from './components/brand/BrandDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotFoundPage } from './components/common/NotFoundPage';
import { UserCheck } from 'lucide-react';

const ReviewerLayout: React.FC = () => {
  const { language, activeReviewerTab, setActiveReviewerTab } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync active tab context based on the current sub-route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/reviewer/tasks')) {
      if (activeReviewerTab !== 'tasks') setActiveReviewerTab('tasks');
    } else if (path.startsWith('/reviewer/wallet')) {
      if (activeReviewerTab !== 'wallet') setActiveReviewerTab('wallet');
    } else if (path.startsWith('/reviewer/rewards')) {
      if (activeReviewerTab !== 'rewards') setActiveReviewerTab('rewards');
    } else if (path.startsWith('/reviewer/leaderboard')) {
      if (activeReviewerTab !== 'leaderboard') setActiveReviewerTab('leaderboard');
    } else if (path.startsWith('/reviewer/academy')) {
      if (activeReviewerTab !== 'academy') setActiveReviewerTab('academy');
    } else if (path.startsWith('/reviewer/profile')) {
      if (activeReviewerTab !== 'profile') setActiveReviewerTab('profile');
    } else if (
      path === '/reviewer' ||
      path === '/reviewer/' ||
      path.startsWith('/reviewer/dashboard') ||
      path.startsWith('/reviewer/opportunities')
    ) {
      if (activeReviewerTab !== 'home' && activeReviewerTab !== 'opportunities') {
        setActiveReviewerTab('home');
      }
    }
  }, [location.pathname, activeReviewerTab, setActiveReviewerTab]);

  const isOnboarding = location.pathname.startsWith('/reviewer/onboarding');

  return (
    <div className="relative">
      {/* Quick onboarding wizard switcher bar for demo flexibility */}
      <div className="max-w-4xl mx-auto px-4 pt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={() => {
            if (isOnboarding) {
              navigate('/reviewer');
            } else {
              navigate('/reviewer/onboarding');
            }
          }}
          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>
            {isOnboarding
              ? language === 'bn' ? '← ড্যাশবোর্ডে ফিরে যান' : '← Back to Dashboard'
              : language === 'bn' ? '৫-ধাপ ভেরিফিকেশন উইজার্ড ডেমো' : '5-Step Verification Wizard Demo'}
          </span>
        </button>
      </div>

      <Routes>
        <Route index element={<ReviewerDashboard />} />
        <Route path="dashboard" element={<ReviewerDashboard />} />
        <Route path="opportunities" element={<ReviewerDashboard />} />
        <Route path="onboarding" element={<ReviewerOnboarding />} />
        <Route path="tasks" element={<ReviewerTaskWorkspace />} />
        <Route path="wallet" element={<ReviewerWallet />} />
        <Route path="rewards" element={<ReviewerRewards />} />
        <Route path="leaderboard" element={<ReviewerLeaderboard />} />
        <Route path="academy" element={<ReviewerAcademy />} />
        <Route path="profile" element={<ReviewerProfileView />} />
        <Route path="*" element={<Navigate to="/reviewer" replace />} />
      </Routes>

      {!isOnboarding && <ReviewerBottomNav />}
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-['Anek_Bangla',system-ui,sans-serif] relative flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Ambient background glows matching Elegant Dark */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Persistent Navigation Header */}
      <Header />

      {/* Main Container with React Router Routes */}
      <main className="flex-1 z-10 relative">
        <Routes>
          {/* Root / Route shows the Public Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Reviewer Portal with nested tab workspace */}
          <Route
            path="/reviewer/*"
            element={
              <ProtectedRoute allow={['reviewer']}>
                <ReviewerLayout />
              </ProtectedRoute>
            }
          />

          {/* Direct shortcut aliases redirecting to Reviewer views */}
          <Route path="/opportunities" element={<Navigate to="/reviewer" replace />} />
          <Route path="/tasks" element={<Navigate to="/reviewer/tasks" replace />} />
          <Route path="/wallet" element={<Navigate to="/reviewer/wallet" replace />} />
          <Route path="/rewards" element={<Navigate to="/reviewer/rewards" replace />} />
          <Route path="/leaderboard" element={<Navigate to="/reviewer/leaderboard" replace />} />
          <Route path="/academy" element={<Navigate to="/reviewer/academy" replace />} />
          <Route path="/profile" element={<Navigate to="/reviewer/profile" replace />} />
          <Route path="/onboarding" element={<Navigate to="/reviewer/onboarding" replace />} />

          {/* Brand & Multi-Store Dashboard */}
          <Route
            path="/brand/*"
            element={
              <ProtectedRoute allow={['brand']}>
                <BrandDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Command Center */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allow={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
