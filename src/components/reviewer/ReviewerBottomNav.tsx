import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ReviewerTab } from '../../types';
import {
  Home,
  CheckSquare,
  Wallet,
  User,
} from 'lucide-react';

export const ReviewerBottomNav: React.FC = () => {
  const { activeReviewerTab, setActiveReviewerTab, language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: {
    id: ReviewerTab;
    path: string;
    labelBn: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', path: '/reviewer', labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'tasks', path: '/reviewer/tasks', labelBn: 'আমার টাস্ক', labelEn: 'My Tasks', icon: CheckSquare },
    { id: 'wallet', path: '/reviewer/wallet', labelBn: 'ওয়ালেট', labelEn: 'Wallet', icon: Wallet },
    { id: 'profile', path: '/reviewer/profile', labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: User },
  ];

  const handleTabClick = (item: typeof navItems[0]) => {
    setActiveReviewerTab(item.id);
    navigate(item.path);
  };

  return (
    <nav
      id="reviewer-bottom-nav"
      aria-label="Reviewer Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.75)] pb-[env(safe-area-inset-bottom,0px)] transition-all"
    >
      <div className="max-w-lg mx-auto h-[64px] sm:h-[68px] flex items-center justify-around px-2 sm:px-4">
        {navItems.map((item) => {
          const pathname = location.pathname;
          // Determine if active based on path and tab context
          const isPathActive =
            (item.id === 'home' && (pathname === '/reviewer' || pathname === '/reviewer/' || pathname === '/reviewer/opportunities' || pathname === '/reviewer/dashboard')) ||
            (item.id === 'tasks' && pathname.startsWith('/reviewer/tasks')) ||
            (item.id === 'wallet' && pathname.startsWith('/reviewer/wallet')) ||
            (item.id === 'profile' && (
              pathname.startsWith('/reviewer/profile') ||
              pathname.startsWith('/reviewer/rewards') ||
              pathname.startsWith('/reviewer/leaderboard') ||
              pathname.startsWith('/reviewer/academy')
            ));

          const isProfileSection = item.id === 'profile' && ['profile', 'rewards', 'leaderboard', 'academy'].includes(activeReviewerTab);
          const isHomeSection = item.id === 'home' && (activeReviewerTab === 'home' || activeReviewerTab === 'opportunities');
          const isActive = isPathActive || activeReviewerTab === item.id || isProfileSection || isHomeSection;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => handleTabClick(item)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 group focus:outline-none ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Top Glow Pill Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-in fade-in zoom-in duration-200" />
              )}

              {/* Icon Container with subtle active halo */}
              <div
                className={`relative flex items-center justify-center w-8 h-7 sm:w-9 sm:h-8 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 shadow-[0_0_16px_rgba(16,185,129,0.3)] scale-105'
                    : 'group-hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? 'text-emerald-400 stroke-[2.25]' : 'text-slate-400 group-hover:text-slate-200 stroke-[1.75]'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] font-semibold tracking-tight whitespace-nowrap mt-0.5 transition-colors ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 group-hover:text-slate-300'
                }`}
              >
                {language === 'bn' ? item.labelBn : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


