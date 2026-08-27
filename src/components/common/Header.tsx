import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Globe,
  Shield,
  Smartphone,
  Briefcase,
  UserCheck,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';
import { StoreSwitcher } from '../brand/StoreSwitcher';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    language,
    toggleLanguage,
    reviewerProfile,
    brandProfile,
    notifications,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleConfigs: Record<UserRole, { labelBn: string; labelEn: string; icon: any; color: string; path: string }> = {
    guest: {
      labelBn: 'পাবলিক ওয়েবসাইট',
      labelEn: 'Public Landing',
      icon: Globe,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      path: '/',
    },
    reviewer: {
      labelBn: 'রিভিউয়ার অ্যাপ (Mobile First)',
      labelEn: 'Reviewer App (Mobile First)',
      icon: Smartphone,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      path: '/reviewer',
    },
    brand: {
      labelBn: 'ব্র্যান্ড পোর্টাল',
      labelEn: 'Brand Dashboard',
      icon: Briefcase,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      path: '/brand',
    },
    admin: {
      labelBn: 'অ্যাডমিন কমান্ড সেন্টার',
      labelEn: 'Admin Command Center',
      icon: Shield,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      path: '/admin',
    },
  };

  // Sync role based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '') {
      if (currentRole !== 'guest') setCurrentRole('guest');
    } else if (path.startsWith('/reviewer')) {
      if (currentRole !== 'reviewer') setCurrentRole('reviewer');
    } else if (path.startsWith('/brand')) {
      if (currentRole !== 'brand') setCurrentRole('brand');
    } else if (path.startsWith('/admin')) {
      if (currentRole !== 'admin') setCurrentRole('admin');
    }
  }, [location.pathname, currentRole, setCurrentRole]);

  const currentRoleConfig = roleConfigs[currentRole] || roleConfigs.guest;

  const handleRoleSelect = (roleKey: UserRole) => {
    setCurrentRole(roleKey);
    setIsRoleDropdownOpen(false);
    navigate(roleConfigs[roleKey].path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentRole('guest');
                navigate('/');
              }}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 text-lg font-mono">
                    B$
                  </span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-white tracking-tight">
                    Bring<span className="text-emerald-400">Dollar</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    BD
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
                  {language === 'bn' ? 'অথেনটিক প্রোডাক্ট রিভিউ প্ল্যাটফর্ম' : 'Verified Review Marketplace'}
                </p>
              </div>
            </button>
          </div>

          {/* Center Persona Switcher Pill (Quick Role Simulator) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-semibold text-xs transition-all shadow-md ${currentRoleConfig.color} hover:brightness-110`}
            >
              <currentRoleConfig.icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {language === 'bn' ? currentRoleConfig.labelBn : currentRoleConfig.labelEn}
              </span>
              <span className="md:hidden capitalize font-mono text-[11px] font-bold">
                {currentRole}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70 ml-0.5" />
            </button>

            {/* Persona Switcher Dropdown */}
            {isRoleDropdownOpen && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  {language === 'bn' ? 'ব্যবহারকারী ভূমিকা নির্বাচন করুন' : 'Select User Persona'}
                </div>

                {(Object.keys(roleConfigs) as UserRole[]).map((roleKey) => {
                  const cfg = roleConfigs[roleKey];
                  const isSelected = currentRole === roleKey;
                  const Icon = cfg.icon;

                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleSelect(roleKey)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">
                          {language === 'bn' ? cfg.labelBn : cfg.labelEn}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Utilities: Language Toggle, Notifications, Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'bn' ? 'বাংলা' : 'ENG'}</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Thumbnail */}
            {currentRole === 'reviewer' ? (
              <div className="flex items-center gap-2 pl-1">
                <img
                  src={reviewerProfile.avatarUrl}
                  alt={reviewerProfile.fullName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    {reviewerProfile.displayName}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    {reviewerProfile.levelId.toUpperCase()}
                  </div>
                </div>
              </div>
            ) : currentRole === 'brand' ? (
              <div className="flex items-center gap-2">
                <StoreSwitcher />
                <div className="hidden xl:flex items-center gap-2 pl-1 border-l border-white/10 ml-1">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white leading-tight">
                      {brandProfile.companyName || 'Verified Owner'}
                    </div>
                    <div className="text-[10px] text-amber-400 font-medium">
                      Multi-Store Owner
                    </div>
                  </div>
                </div>
              </div>
            ) : currentRole === 'admin' ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                  ADM
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    Super Admin
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    Master Access
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCurrentRole('reviewer');
                  navigate('/reviewer');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

