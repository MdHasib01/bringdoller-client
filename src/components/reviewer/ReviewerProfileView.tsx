import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Smartphone,
  MapPin,
  Calendar,
  Lock,
  Star,
  Award,
  Video,
  ExternalLink,
  Gift,
  Trophy,
  GraduationCap,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Settings,
  Bell,
  Globe,
  HelpCircle,
  Mail,
  Phone,
  CheckCircle2,
  ChevronDown,
  Info,
  CreditCard,
  MessageCircle,
  SlidersHorizontal,
  Flame,
  Check,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Zap,
  Camera,
  Layers,
  Edit3,
  X,
  Plus,
  LogOut,
  AlertCircle,
  Eye,
  Percent,
} from 'lucide-react';
import { TrustScoreRing } from '../common/TrustScoreRing';
import { XpProgressBar } from '../common/XpProgressBar';
import { maskNid, maskPhone, formatBdt, formatNumber, formatDate, toBengaliDigits } from '../../utils/formatters';
import { REVIEWER_LEVELS } from '../../utils/levels';

export const ReviewerProfileView: React.FC = () => {
  const {
    reviewerProfile,
    language,
    setLanguage,
    assignments,
    setActiveReviewerTab,
    setCurrentRole,
    addToast,
  } = useApp();
  const navigate = useNavigate();

  const currentLevel = REVIEWER_LEVELS[reviewerProfile.levelId] || REVIEWER_LEVELS['pro'];
  const completedReviews = assignments.filter((a) => a.status === 'approved');

  // Active section filter or scroll state
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Modals state
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [showPerformanceDetailsModal, setShowPerformanceDetailsModal] = useState<boolean>(false);
  const [showPayoutModal, setShowPayoutModal] = useState<boolean>(false);
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketMessage, setTicketMessage] = useState<string>('');

  // Form states for Edit Profile
  const [editFullName, setEditFullName] = useState<string>(reviewerProfile.fullName);
  const [editDisplayName, setEditDisplayName] = useState<string>(reviewerProfile.displayName);
  const [editBio, setEditBio] = useState<string>(reviewerProfile.bio || 'Tech & Fragrance Review Specialist based in Dhaka');
  const [editAddress, setEditAddress] = useState<string>(reviewerProfile.deliveryAddress?.fullAddress || '');
  const [editDistrict, setEditDistrict] = useState<string>(reviewerProfile.deliveryAddress?.district || 'ঢাকা');
  const [editPhone, setEditPhone] = useState<string>(reviewerProfile.deliveryAddress?.phone || reviewerProfile.phone);

  // Preferences toggles
  const [notifSMS, setNotifSMS] = useState(reviewerProfile.appPreferences?.smsNotifications ?? true);
  const [notifPush, setNotifPush] = useState(reviewerProfile.appPreferences?.pushNotifications ?? true);
  const [notifWhatsApp, setNotifWhatsApp] = useState(reviewerProfile.appPreferences?.whatsappNotifications ?? true);
  const [notifCampaignAlerts, setNotifCampaignAlerts] = useState(reviewerProfile.appPreferences?.campaignAlerts ?? true);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(reviewerProfile.appPreferences?.showOnLeaderboard ?? true);

  // FAQ open accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      qEn: 'How does the BringDollar Escrow Guarantee protect my payout?',
      qBn: 'BringDollar এস্ক্রো কীভাবে আমার রিভিউ পেমেন্ট সুরক্ষিত রাখে?',
      aEn: 'Brands pre-fund 100% of the campaign budget into BringDollar escrow before dispatching products. As long as you submit an honest review adhering to platform guidelines, your payout is automatically released upon verification.',
      aBn: 'ক্যাম্পেইন চালুর আগেই ব্র্যান্ড প্ল্যাটফর্মে সম্পূর্ণ পেমেন্ট এস্ক্রো জমা রাখে। সততার সাথে নির্দেশনামাফিক রিভিউ সাবমিট করলে ব্র্যান্ড কোনোভাবেই আপনার টাকা আটকে রাখতে পারবে না।',
    },
    {
      qEn: 'Am I required to praise the product in my review?',
      qBn: 'রিভিউতে পণ্যের শুধু ভালো দিক বলতে হবে?',
      aEn: 'No! Exaggerated praise is strictly prohibited. You are required to highlight both genuine pros and at least one real limitation or critique for consumer authenticity.',
      aBn: 'একদমই না! কৃত্রিম প্রশংসা কঠোরভাবে নিষিদ্ধ। প্ল্যাটফর্ম নীতি অনুযায়ী অন্তত ১টি বাস্তব দুর্বলতা বা সীমাবদ্ধতা উল্লেখ করা বাধ্যতামূলক।',
    },
    {
      qEn: 'How do I unlock Brand Ambassador status?',
      qBn: 'ব্র্যান্ড অ্যাম্বাসেডর হতে কী কী প্রয়োজন?',
      aEn: 'Reviewers who maintain a Trust Score of 90+, complete at least 10 verified tests, and reach Pro level automatically become eligible for monthly retainer ambassador contracts (up to ৳100,000/mo).',
      aBn: 'ট্রাস্ট স্কোর ৯০+, ন্যূনতম ১০টি সফল রিভিউ এবং প্রো লেভেলে পৌঁছালে টপ ব্র্যান্ড থেকে সরাসরি মাসিক রিটেইনার চুক্তির প্রস্তাব উন্মুক্ত হয়।',
    },
    {
      qEn: 'How does the product return process work?',
      qBn: 'প্রোডাক্ট রিটার্ন প্রক্রিয়া কীভাবে সম্পন্ন হয়?',
      aEn: 'For campaigns marked "Return Required", the brand provides a prepaid return shipping label via Pathao or Steadfast. Simply hand over the boxed product to the courier pickup agent.',
      aBn: 'রিটার্ন আবশ্যক ক্যাম্পেইনের জন্য ব্র্যান্ড প্রি-পেইড রিটার্ন লেবেল প্রদান করে। কুরিয়ার এজেন্ট আপনার বাসা থেকে বিনামূল্যে পার্সেল সংগ্রহ করবে।',
    }
  ];

  const handleSaveProfile = () => {
    setShowEditProfileModal(false);
    addToast(
      language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile Updated',
      language === 'bn' ? 'আপনার ব্যক্তিগত তথ্য ও ডেলিভারি ঠিকানা সংরক্ষিত হয়েছে।' : 'Your profile details and address have been successfully updated.',
      'success'
    );
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setShowTicketModal(false);
    setTicketSubject('');
    setTicketMessage('');
    addToast(
      language === 'bn' ? 'সাপোর্ট টিকিট সাবমিট হয়েছে' : 'Support Ticket Submitted',
      language === 'bn' ? 'আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।' : 'Our operations team will review your inquiry within 4 hours.',
      'success'
    );
  };

  // Border glow styles based on reviewer level
  const getLevelGlowClass = (levelId: string) => {
    switch (levelId) {
      case 'brand_choice':
        return 'ring-4 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)]';
      case 'elite':
        return 'ring-4 ring-purple-400 shadow-[0_0_25px_rgba(192,132,252,0.35)]';
      case 'pro':
        return 'ring-4 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]';
      case 'trusted_voice':
        return 'ring-4 ring-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)]';
      default:
        return 'ring-3 ring-emerald-500/50 shadow-lg';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 pb-28 sm:pb-32 space-y-6 text-slate-100">
      
      {/* ========================================================================= */}
      {/* PROFILE HEADER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 border border-slate-800/90 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-5">
        
        {/* Top bar with Edit Profile action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Level-based glowing avatar */}
            <div className="relative shrink-0">
              <img
                src={reviewerProfile.avatarUrl}
                alt={reviewerProfile.fullName}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover bg-slate-800 ${getLevelGlowClass(reviewerProfile.levelId)}`}
              />
              <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] shadow-lg border border-slate-900 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {reviewerProfile.fullName}
                </h1>
                {reviewerProfile.isAmbassador && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                    👑 Brand Ambassador
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                <span className="font-mono text-emerald-400 font-semibold">{reviewerProfile.reviewerId || 'BD-REV-84920'}</span>
                <span>•</span>
                <span>@{reviewerProfile.displayName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {reviewerProfile.district}
                </span>
              </div>

              {/* Badges / Rating row */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  {currentLevel.badgeIcon} {language === 'bn' ? currentLevel.nameBn : currentLevel.nameEn}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.9 / 5.0 Rating
                </span>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-800/80 text-emerald-400 font-semibold border border-slate-700">
                  96% Profile Complete
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 shadow-md transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Trust Score</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{reviewerProfile.trustScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PROFILE PERFORMANCE CARD */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {language === 'bn' ? 'পারফরম্যান্স ও লেভেল মেট্রিক্স' : 'Performance & Level Metrics'}
            </h2>
          </div>
          <button
            onClick={() => setShowPerformanceDetailsModal(true)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Performance Details'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Career XP</span>
            <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
              {formatNumber(reviewerProfile.careerXp, language)}
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Reward Coins</span>
            <span className="text-base font-black text-amber-300 font-mono mt-0.5 block">
              {formatNumber(reviewerProfile.rewardCoins, language)} 🪙
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Completed</span>
            <span className="text-base font-black text-white font-mono mt-0.5 block">
              {reviewerProfile.tasksCompleted} Reviews
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">On-Time Rate</span>
            <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
              98.5%
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Quality Rating</span>
            <span className="text-base font-black text-sky-400 font-mono mt-0.5 block">
              4.92 ★
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Rank Position</span>
            <span className="text-base font-black text-purple-400 font-mono mt-0.5 block">
              #3 Elite BD
            </span>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <XpProgressBar
          careerXp={reviewerProfile.careerXp}
          levelId={reviewerProfile.levelId}
          lang={language}
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION NAV FILTER PILLS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'all', label: language === 'bn' ? 'সকল বিভাগ' : 'All Sections' },
          { id: 'growth', label: language === 'bn' ? '১. গ্রোথ ও রেপুটেশন' : '1. Growth & Reputation' },
          { id: 'rewards', label: language === 'bn' ? '২. রিওয়ার্ড ও আর্নিং' : '2. Rewards & Earnings' },
          { id: 'info', label: language === 'bn' ? '৩. রিভিউয়ার তথ্য' : '3. Information' },
          { id: 'verification', label: language === 'bn' ? '৪. ভেরিফিকেশন' : '4. Verification' },
          { id: 'payment', label: language === 'bn' ? '৫. পেমেন্ট ও বিলিং' : '5. Payment & Billing' },
          { id: 'preferences', label: language === 'bn' ? '৬. সেটিংস' : '6. Settings' },
          { id: 'support', label: language === 'bn' ? '৭. সাপোর্ট' : '7. Support & Help' },
          { id: 'actions', label: language === 'bn' ? '৮. অ্যাকাউন্ট অ্যাকশন' : '8. Actions' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSection(sec.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSection === sec.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 8 DEDICATED PROFILE SECTIONS */}
      {/* ========================================================================= */}
      <div className="space-y-6">

        {/* SECTION 1: GROWTH AND REPUTATION */}
        {(selectedSection === 'all' || selectedSection === 'growth') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? '১. গ্রোথ ও রেপুটেশন হাব' : '1. Growth & Reputation'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">Level {currentLevel.badgeIcon}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trust Score Breakdown */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2.5 text-xs">
                <span className="font-bold text-slate-300 block uppercase tracking-wider text-[11px]">
                  Trust Score Breakdown (94/100)
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">On-Time Video Submissions:</span>
                    <span className="text-emerald-400 font-bold">100% (+30 pts)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Video & Audio QA Score:</span>
                    <span className="text-emerald-400 font-bold">96% (+25 pts)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Objective Honesty & Critique:</span>
                    <span className="text-emerald-400 font-bold">95% (+24 pts)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Zero Dispute Record:</span>
                    <span className="text-emerald-400 font-bold">100% (+15 pts)</span>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2.5 text-xs">
                <span className="font-bold text-slate-300 block uppercase tracking-wider text-[11px]">
                  Earned Achievement Badges
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🌿</span>
                    <div>
                      <span className="font-bold text-white block">Fragrance Pro</span>
                      <span className="text-[10px] text-slate-400">5+ Attar Reviews</span>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🎥</span>
                    <div>
                      <span className="font-bold text-white block">4K Master</span>
                      <span className="text-[10px] text-slate-400">Crisp Audio & Video</span>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                      <span className="font-bold text-white block">Fast Delivery</span>
                      <span className="text-[10px] text-slate-400">&lt; 48hr Turnaround</span>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <div>
                      <span className="font-bold text-white block">Zero Dispute</span>
                      <span className="text-[10px] text-slate-400">100% Clean Record</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: REWARDS AND EARNINGS HUB */}
        {(selectedSection === 'all' || selectedSection === 'rewards') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? '২. রিওয়ার্ড ও আর্নিং হাব' : '2. Rewards & Earnings Hub'}
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold">3 Integrated Modules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Rewards Shop */}
              <div
                onClick={() => {
                  setActiveReviewerTab('rewards');
                  navigate('/reviewer/rewards');
                }}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-950 border border-amber-500/25 hover:border-amber-500/50 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {formatNumber(reviewerProfile.rewardCoins, language)} 🪙
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Reward Coins Vault</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Redeem your coins for gadgets, lighting kits and gift cards.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-amber-400 flex items-center justify-between">
                  <span>Open Vault</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Leaderboard Hub */}
              <div
                onClick={() => {
                  setActiveReviewerTab('leaderboard');
                  navigate('/reviewer/leaderboard');
                }}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-slate-950 border border-emerald-500/25 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Rank #3 BD</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Leaderboard & Ranks</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Track national creator standings & monthly performance bonuses.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>View Leaderboard</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Creator Academy */}
              <div
                onClick={() => {
                  setActiveReviewerTab('academy');
                  navigate('/reviewer/academy');
                }}
                className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-slate-950 border border-indigo-500/25 hover:border-indigo-500/50 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300">1/3 Certified</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Reviewer Academy</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Master video lighting, honest testing rubrics and earn XP.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-indigo-400 flex items-center justify-between">
                  <span>Enter Academy</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: REVIEWER INFORMATION */}
        {(selectedSection === 'all' || selectedSection === 'info') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? '৩. রিভিউয়ার ব্যক্তিগত ও ডেলিভারি তথ্য' : '3. Reviewer Information'}
                </h3>
              </div>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">Full Legal Name</span>
                <span className="font-bold text-white text-sm block">{reviewerProfile.fullName}</span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">Primary Phone (SMS / Courier)</span>
                <span className="font-bold text-slate-200 text-sm block font-mono">
                  {maskPhone(reviewerProfile.phone)}
                </span>
              </div>

              <div className="col-span-1 sm:col-span-2 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Courier Shipping Address
                </span>
                <span className="font-medium text-slate-200 block text-xs leading-relaxed">
                  {reviewerProfile.deliveryAddress?.fullAddress || 'ফ্ল্যাট ৪বি, গ্রিন ডেল এপার্টমেন্ট, রোড ৮, ধানমন্ডি, ঢাকা'}
                </span>
              </div>

              {/* Recording Setup */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Device & Camera Gear
                </span>
                <span className="font-medium text-white block">
                  {reviewerProfile.deviceInfo?.primaryPhone || 'iPhone 14 Pro 4K 60fps'}
                </span>
                <span className="text-[11px] text-slate-500">Softbox Lighting & Wireless Lavalier Mic</span>
              </div>

              {/* Content Niches */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-slate-400 block">Content Categories of Interest</span>
                <div className="flex flex-wrap gap-1">
                  {(reviewerProfile.contentInterests || ['স্মার্ট গ্যাজেটস', 'আতর', 'স্কিনকেয়ার', 'অডিও গিয়ার']).map((cat) => (
                    <span key={cat} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-500/20 font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: VERIFICATION AND TRUST */}
        {(selectedSection === 'all' || selectedSection === 'verification') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? '৪. ভেরিফিকেশন ও ট্রাস্ট স্ট্যান্ডার্ড' : '4. Verification & Trust'}
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-semibold">
                100% Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">National NID</span>
                  <span className="text-emerald-400 font-bold">✓ Verified</span>
                </div>
                <span className="font-mono text-white text-xs block mt-1">
                  {maskNid(reviewerProfile.nidNumberMasked || '19982692601004812')}
                </span>
                <span className="text-[10px] text-slate-500">Government Smart Card</span>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Demo Video QA</span>
                  <span className="text-emerald-400 font-bold">✓ Passed</span>
                </div>
                <span className="font-medium text-white text-xs block mt-1">
                  1080p Voice & Lighting Test
                </span>
                <span className="text-[10px] text-slate-500">Audited by BringDollar QA</span>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Return Reliability</span>
                  <span className="text-emerald-400 font-bold">100% Score</span>
                </div>
                <span className="font-medium text-white text-xs block mt-1">
                  0 Unreturned Items
                </span>
                <span className="text-[10px] text-slate-500">High-value safe keeper</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: PAYMENT AND BILLING */}
        {(selectedSection === 'all' || selectedSection === 'payment') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? '৫. পেমেন্ট মেথড ও বিলিং' : '5. Payment & Billing'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveReviewerTab('wallet');
                  navigate('/reviewer/wallet');
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Manage Wallet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Primary Payout Method</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-bold">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                    bK
                  </div>
                  <div>
                    <span className="font-bold text-white block">bKash Personal Account</span>
                    <span className="font-mono text-slate-400">{maskPhone(reviewerProfile.phone)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-slate-400 block">Tax & Escrow Status</span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">TIN Status:</span>
                    <span className="text-white font-mono">TIN-8942-XXXX (Verified)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escrow Dispute Protection:</span>
                    <span className="text-emerald-400 font-bold">100% Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: PREFERENCES AND SETTINGS */}
        {(selectedSection === 'all' || selectedSection === 'preferences') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? '৬. সেটিংস ও প্রিফারেন্স' : '6. Settings & Preferences'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Notification Toggles */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
                <span className="font-bold text-slate-300 block uppercase tracking-wider text-[11px]">
                  Alerts & Notifications
                </span>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">SMS Courier Alerts</span>
                      <span className="text-[10px] text-slate-400">Tracking & package dispatch updates</span>
                    </div>
                    <button
                      onClick={() => setNotifSMS(!notifSMS)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${notifSMS ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${notifSMS ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">WhatsApp Direct Alerts</span>
                      <span className="text-[10px] text-slate-400">Private brand invitations & fast reminders</span>
                    </div>
                    <button
                      onClick={() => setNotifWhatsApp(!notifWhatsApp)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${notifWhatsApp ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${notifWhatsApp ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Public Leaderboard Visibility</span>
                      <span className="text-[10px] text-slate-400">Show handle and rank to community</span>
                    </div>
                    <button
                      onClick={() => setShowOnLeaderboard(!showOnLeaderboard)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${showOnLeaderboard ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${showOnLeaderboard ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-300 block uppercase tracking-wider text-[11px] mb-1">
                    Platform Language (Anek Bangla)
                  </span>
                  <p className="text-slate-400 text-xs mb-3">
                    BringDollar is English-first with full bilingual Bengali integration.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        language === 'en'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs block font-bold">🇬🇧 English</span>
                      <span className="text-[10px] text-slate-500">Default Primary</span>
                    </button>

                    <button
                      onClick={() => setLanguage('bn')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        language === 'bn'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs block font-bold">🇧🇩 বাংলা</span>
                      <span className="text-[10px] text-slate-500">বাংলা সংস্করণ</span>
                    </button>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 text-center block pt-2">
                  System Font: Anek Bangla
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: SUPPORT AND HELP */}
        {(selectedSection === 'all' || selectedSection === 'support') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? '৭. সাপোর্ট ও সাহায্য কেন্দ্র' : '7. Support & Help'}
                </h3>
              </div>
              <button
                onClick={() => setShowTicketModal(true)}
                className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 font-bold hover:bg-emerald-500/20"
              >
                + New Support Ticket
              </button>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden transition-all text-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 font-bold text-white hover:text-emerald-400"
                  >
                    <span>{language === 'bn' ? faq.qBn : faq.qEn}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>

                  {openFaq === idx && (
                    <div className="px-3.5 pb-3.5 text-slate-300 leading-relaxed border-t border-slate-800/50 pt-2 bg-slate-900/30">
                      {language === 'bn' ? faq.aBn : faq.aEn}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Direct Contact Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <a
                href="mailto:support@bringdollar.com"
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold block">support@bringdollar.com</span>
                  <span className="text-[10px] text-slate-400">Escrow & QA Inquiry</span>
                </div>
              </a>

              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold block">Live WhatsApp Helpdesk</span>
                  <span className="text-[10px] text-slate-400">Immediate Courier & Task Resolution</span>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* SECTION 8: ACCOUNT ACTIONS */}
        {(selectedSection === 'all' || selectedSection === 'actions') && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                {language === 'bn' ? '৮. অ্যাকাউন্ট অ্যাকশন ও রোল সুইচ' : '8. Account Actions & Role'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Switch to Brand */}
              <button
                onClick={() => {
                  setCurrentRole('brand');
                  navigate('/brand');
                  addToast('Role Switched', 'You are now viewing Brand Campaign Operations.', 'info');
                }}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 text-left space-y-1 transition-all group"
              >
                <span className="font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Switch to Brand</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-slate-400 block">Manage & fund product campaigns</span>
              </button>

              {/* Switch to Admin */}
              <button
                onClick={() => {
                  setCurrentRole('admin');
                  navigate('/admin');
                  addToast('Role Switched', 'You are now viewing Escrow & QA Administration.', 'info');
                }}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 text-left space-y-1 transition-all group"
              >
                <span className="font-bold text-white group-hover:text-purple-400 flex items-center justify-between">
                  <span>Switch to Admin / QA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-slate-400 block">Review audit & escrow payouts</span>
              </button>

              {/* Deactivate / Safety */}
              <button
                onClick={() => {
                  addToast('Protected Account', 'Contact BringDollar support to process account deactivation.', 'info');
                }}
                className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/40 text-left space-y-1 transition-all text-rose-300"
              >
                <span className="font-bold block">Deactivate Account</span>
                <span className="text-[11px] text-slate-400 block">Safely archive reviews & balance</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EDIT PROFILE */}
      {/* ========================================================================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                Edit Reviewer Profile
              </h3>
              <button onClick={() => setShowEditProfileModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Display Handle</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reviewer Bio</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Courier Delivery Full Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PERFORMANCE DETAILS */}
      {/* ========================================================================= */}
      {showPerformanceDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Detailed Performance Breakdown
              </h3>
              <button onClick={() => setShowPerformanceDetailsModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-slate-300">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">Career Milestones:</span>
                <p className="text-slate-400">
                  Total of 14 verified reviews completed across Fragrance, Smartwatches, and Facial Serums. 100% on-time completion with 0 dispute deductions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Average Audio Quality</span>
                  <span className="font-bold text-emerald-400 text-sm">9.8 / 10</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Average Video Clarity</span>
                  <span className="font-bold text-emerald-400 text-sm">9.7 / 10</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowPerformanceDetailsModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUPPORT TICKET */}
      {/* ========================================================================= */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleCreateTicket} className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Submit Support Ticket
              </h3>
              <button type="button" onClick={() => setShowTicketModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Issue Category / Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Courier tracking delay or Video upload question"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide all details, tracking ID or task reference..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
