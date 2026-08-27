import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Gift,
  Clock,
  ArrowRight,
  ChevronRight,
  Package,
  Trophy,
  AlertTriangle,
  Award,
  Zap,
  Search,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Calendar,
  Layers,
  Video,
  Info,
  Check,
  X,
  Bell,
  Star,
  MapPin,
  Smartphone,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  Percent,
  Timer,
  FileText,
  BadgeAlert,
  Flame,
  Truck,
  Heart,
} from 'lucide-react';
import { formatBdt, formatNumber, formatDate, formatRelativeTime, toBengaliDigits } from '../../utils/formatters';
import { TrustScoreRing } from '../common/TrustScoreRing';
import { XpProgressBar } from '../common/XpProgressBar';
import { StatusChip } from '../common/StatusChip';
import { REVIEWER_LEVELS } from '../../utils/levels';
import { Campaign, CampaignBrief } from '../../types';
import { CampaignDetailModal } from '../common/CampaignDetailModal';

export const ReviewerDashboard: React.FC = () => {
  const {
    reviewerProfile,
    assignments,
    campaigns,
    language,
    setActiveReviewerTab,
    transactions,
    applyToCampaign,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addToast,
    triggerConfetti,
  } = useApp();
  const navigate = useNavigate();

  // Navigation & Search / Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterChip, setSelectedFilterChip] = useState<'all' | 'recommended' | 'highest_paying' | 'newly_added' | 'ending_soon' | 'keep_product' | 'return_required' | 'eligible_only'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [savedCampaignIds, setSavedCampaignIds] = useState<string[]>(['camp-1']);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Private Brand Invitations State
  const [privateInvites, setPrivateInvites] = useState([
    {
      id: 'invite-aura-1',
      brandName: 'Aura Naturals BD',
      brandLogoUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=120&auto=format&fit=crop&q=80',
      productName: 'Royal Oud Luxury Attar & Beard Elixir',
      productImageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&auto=format&fit=crop&q=80',
      payoutBdt: 3000,
      vipBonusBdt: 500,
      productValueBdt: 4500,
      testingDurationDays: 5,
      contentType: '4K Vertical Review',
      invitationExpiry: '2 days left',
      messageBn: 'আমরা আপনার পূর্ববর্তী পারফিউম রিভিউ দেখে মুগ্ধ! আমাদের নতুন রয়্যাল উদ কালেকশনের বিশেষ ভিআইপি রিভিউয়ার হিসেবে আপনাকে আমন্ত্রণ জানাচ্ছি।',
      messageEn: 'We loved your fragrance review authentic delivery! We invite you as an exclusive VIP creator for our new Royal Oud Collection.',
    },
    {
      id: 'invite-zenith-1',
      brandName: 'Zenith Audio Labs',
      brandLogoUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&auto=format&fit=crop&q=80',
      productName: 'AeroPulse ANC Wireless Gaming Earbuds',
      productImageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
      payoutBdt: 2500,
      vipBonusBdt: 300,
      productValueBdt: 3800,
      testingDurationDays: 4,
      contentType: 'Latency & Mic Test Video',
      invitationExpiry: '3 days left',
      messageBn: 'গেমিং অডিওর লেটেন্সি ও নয়েজ ক্যান্সেলেশন টেস্টের জন্য আপনার টেকনিক্যাল রিভিউ চাই।',
      messageEn: 'Direct invitation to test low-latency gaming mode and dual mic noise cancelling.',
    },
  ]);

  // Modal States
  const [appliedCampaignIds, setAppliedCampaignIds] = useState<string[]>(['camp-1', 'camp-2']);
  const [selectedCampaignForDetails, setSelectedCampaignForDetails] = useState<Campaign | null>(null);
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState<Campaign | null>(null);
  const [applyAgreeTerms, setApplyAgreeTerms] = useState(true);
  const [applyConfirmAddress, setApplyConfirmAddress] = useState(true);

  const currentLevel = REVIEWER_LEVELS[reviewerProfile.levelId];
  const activeTasks = assignments.filter((a) => a.status !== 'approved' && a.status !== 'closed');
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  // Financial Balances
  const availableBalance = transactions
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => {
      if (t.type === 'task_earning' || t.type === 'ambassador_payout') return acc + t.amountBdt;
      if (t.type === 'withdrawal') return acc - t.amountBdt;
      return acc;
    }, 0);

  const pendingBalance = activeTasks.reduce((acc, a) => acc + a.payoutBdt, 0);

  // Calculate Match Score for a campaign based on reviewer profile
  const calculateMatchScore = (camp: Campaign): number => {
    let score = 85;
    const campCat = (camp.category || '').toLowerCase();
    if (campCat && reviewerProfile.contentInterests?.some(cat => {
      const c = (cat || '').toLowerCase();
      return c && (campCat.includes(c) || c.includes(campCat));
    })) {
      score += 10;
    }
    if (camp.minReviewerLevel === 'starter' || reviewerProfile.levelId === 'pro' || reviewerProfile.levelId === 'elite' || reviewerProfile.levelId === 'brand_ambassador') {
      score += 4;
    }
    return Math.min(score, 99);
  };

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      // Search matching
      const query = (searchQuery || '').toLowerCase().trim();
      if (query) {
        const matchesName = (camp.productName || '').toLowerCase().includes(query);
        const matchesBrand = (camp.brandName || '').toLowerCase().includes(query);
        const matchesCategory = (camp.category || '').toLowerCase().includes(query);
        const matchesTitle = (camp.title || '').toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesTitle) {
          return false;
        }
      }

      // Quick Chip filter
      if (selectedFilterChip === 'recommended') {
        if (calculateMatchScore(camp) < 90) return false;
      } else if (selectedFilterChip === 'highest_paying') {
        if (camp.reviewerRewardBdt < 1500) return false;
      } else if (selectedFilterChip === 'newly_added') {
        // keep recent
      } else if (selectedFilterChip === 'ending_soon') {
        // ending soon
      } else if (selectedFilterChip === 'keep_product') {
        if (camp.isReturnRequired) return false;
      } else if (selectedFilterChip === 'return_required') {
        if (!camp.isReturnRequired) return false;
      } else if (selectedFilterChip === 'eligible_only') {
        if (camp.minTrustScore > reviewerProfile.trustScore) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && camp.category !== selectedCategory) {
        return false;
      }

      // Duration filter
      if (selectedDuration === 'quick' && camp.brief.testingDurationDays > 3) return false;
      if (selectedDuration === 'standard' && (camp.brief.testingDurationDays < 4 || camp.brief.testingDurationDays > 7)) return false;
      if (selectedDuration === 'indepth' && camp.brief.testingDurationDays < 8) return false;

      // Level filter
      if (selectedLevel !== 'all' && camp.minReviewerLevel !== selectedLevel) {
        return false;
      }

      return true;
    });
  }, [campaigns, searchQuery, selectedFilterChip, selectedCategory, selectedDuration, selectedLevel, reviewerProfile]);

  // High Value Opportunities (≥ ৳2,000)
  const highValueCampaigns = useMemo(() => {
    return campaigns.filter((c) => c.reviewerRewardBdt >= 2000 && c.status === 'active');
  }, [campaigns]);

  // Recommended Opportunities (Match score >= 90%)
  const recommendedCampaigns = useMemo(() => {
    return campaigns.filter((c) => calculateMatchScore(c) >= 90 && c.status === 'active');
  }, [campaigns]);

  // Newly Added Campaigns
  const newlyAddedCampaigns = useMemo(() => {
    return [...campaigns].reverse().slice(0, 4);
  }, [campaigns]);

  // Toggle Save Campaign
  const toggleSaveCampaign = (campaignId: string) => {
    if (savedCampaignIds.includes(campaignId)) {
      setSavedCampaignIds(savedCampaignIds.filter(id => id !== campaignId));
      addToast(
        language === 'bn' ? 'সংরক্ষণ তালিকা থেকে সরানো হয়েছে' : 'Opportunity Removed',
        language === 'bn' ? 'ক্যাম্পেইনটি আপনার বুকমার্ক থেকে সরানো হয়েছে।' : 'Opportunity removed from saved bookmarks.',
        'info'
      );
    } else {
      setSavedCampaignIds([...savedCampaignIds, campaignId]);
      addToast(
        language === 'bn' ? 'বুকমার্ক সংরক্ষিত' : 'Opportunity Bookmarked',
        language === 'bn' ? 'ক্যাম্পেইনটি আপনার সেভ করা তালিকায় যোগ হয়েছে।' : 'Saved to your bookmarked opportunities list.',
        'success'
      );
    }
  };

  // Handle Invitation Accept
  const handleAcceptInvite = (inviteId: string) => {
    const invite = privateInvites.find(i => i.id === inviteId);
    if (!invite) return;

    setPrivateInvites(privateInvites.filter(i => i.id !== inviteId));
    triggerConfetti();
    addToast(
      language === 'bn' ? 'ভিআইপি ইনভাইটেশন গৃহীত হয়েছে! 🌟' : 'VIP Invitation Accepted! 🌟',
      language === 'bn'
        ? `${invite.brandName} এর সাথে সরাসরি টাস্ক তৈরি হয়েছে। ট্র্যাকিং দেখতে "আমার টাস্ক" অপশনে যান।`
        : `Exclusive direct task created with ${invite.brandName}. Check My Tasks for courier updates.`,
      'success'
    );
  };

  // Handle Invitation Decline
  const handleDeclineInvite = (inviteId: string) => {
    setPrivateInvites(privateInvites.filter(i => i.id !== inviteId));
    addToast(
      language === 'bn' ? 'ইনভাইটেশন বাতিল করা হয়েছে' : 'Invitation Declined',
      language === 'bn' ? 'ব্র্যান্ডকে আপনার সিদ্ধান্তের কথা জানানো হয়েছে।' : 'Brand has been notified with respect.',
      'info'
    );
  };

  // Handle Campaign Application Submit
  const handleConfirmApplication = () => {
    if (!selectedCampaignForApply) return;

    applyToCampaign(selectedCampaignForApply.id);
    setSelectedCampaignForApply(null);
    triggerConfetti();
    addToast(
      language === 'bn' ? 'আবেদন সফলভাবে গৃহীত হয়েছে! 🎉' : 'Application Submitted! 🎉',
      language === 'bn'
        ? 'ব্র্যান্ড শীঘ্রই প্রোডাক্ট কুরিয়ার করবে। ডেলিভারি হলে আপনি নোটিফিকেশন পাবেন।'
        : 'Brand will review and dispatch the product via courier. You will receive tracking details.',
      'success'
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 pb-28 sm:pb-32 space-y-7">
      {/* ========================================================================= */}
      {/* 1. Personalized Greeting & Notification Button */}
      {/* ========================================================================= */}
      <div
        id="home-greeting-banner"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative shrink-0">
            <img
              src={reviewerProfile.avatarUrl}
              alt={reviewerProfile.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md ring-2 ring-slate-900">
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-extrabold text-white">
                {language === 'bn' ? `স্বাগতম, ${reviewerProfile.fullName}!` : `Welcome back, ${reviewerProfile.fullName}!`}
              </h2>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                {language === 'bn' ? 'ভেরিফাইড রিভিউয়ার' : 'Verified Reviewer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{reviewerProfile.displayName}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {reviewerProfile.district}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls: Notification Bell with Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          <div className="relative">
            <button
              id="home-notification-btn"
              type="button"
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="relative p-2.5 sm:p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shadow-md group focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono animate-pulse shadow-md">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotificationDrawer && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl z-50 p-4 space-y-3 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                      {notifications.length}
                    </span>
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      {language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark all read'}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      {language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No notifications'}
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          notif.isRead
                            ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                            : 'bg-emerald-500/10 border-emerald-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-white leading-snug">
                            {language === 'bn' ? notif.titleBn || notif.titleEn : notif.titleEn}
                          </h5>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {language === 'bn' ? notif.messageBn || notif.messageEn : notif.messageEn}
                        </p>
                        <span className="text-[9px] text-slate-500 block mt-1.5">
                          {formatRelativeTime(notif.createdAt, language)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveReviewerTab('profile');
              navigate('/reviewer/profile');
            }}
            className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>{language === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Verification Badge, Current Level and Trust Score */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Verification Status */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              {language === 'bn' ? 'ভেরিফিকেশন স্ট্যাটাস' : 'Identity Verification'}
            </span>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
              <span>{language === 'bn' ? 'সম্পূর্ণ ভেরিফাইড' : 'Verified Level 1'}</span>
              <span className="text-emerald-400 text-xs font-bold">✓</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {language === 'bn' ? 'NID ও ফেস রিকগনিশন সফল' : 'NID & Biometrics Passed'}
            </span>
          </div>
        </div>

        {/* Current Level Pill */}
        <div
          onClick={() => {
            setActiveReviewerTab('profile');
            navigate('/reviewer/profile');
          }}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl shrink-0">
              {currentLevel.badgeIcon}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                {language === 'bn' ? 'বর্তমান টিয়ার' : 'Creator Tier'}
              </span>
              <div className="text-sm font-bold text-white mt-0.5">
                {language === 'bn' ? currentLevel.nameBn : currentLevel.nameEn}
              </div>
              <span className="text-[10px] text-amber-400/90 font-medium">
                {language === 'bn' ? 'উচ্চমূল্যের ক্যাম্পেইনে অগ্রাধিকার' : 'Priority high-payout access'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Trust Score Ring */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              {language === 'bn' ? 'ট্রাস্ট স্কোর রেটিং' : 'Trust Score'}
            </span>
            <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
              {reviewerProfile.trustScore}/100
            </div>
            <span className="text-[10px] text-emerald-400/90 font-medium">
              {language === 'bn' ? 'অসাধারণ (Top 5%)' : 'Excellent (Top 5%)'}
            </span>
          </div>
          <TrustScoreRing score={reviewerProfile.trustScore} lang={language} size={50} strokeWidth={4} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Available Balance, Pending Earnings and Career XP Summary */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        {/* Metric Balances Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Available Wallet Balance */}
          <div
            id="home-wallet-card"
            onClick={() => {
              setActiveReviewerTab('wallet');
              navigate('/reviewer/wallet');
            }}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'bn' ? 'ওয়ালেট ব্যালেন্স' : 'Available Wallet'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {formatBdt(availableBalance, language)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Withdrawable'}</span>
              <span className="text-emerald-400 font-bold">bKash/Nagad</span>
            </div>
          </div>

          {/* Spendable Reward Coins */}
          <div
            id="home-rewards-card"
            onClick={() => {
              setActiveReviewerTab('rewards');
              navigate('/reviewer/rewards');
            }}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 shadow-lg cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                {language === 'bn' ? 'Reward Coins' : 'Reward Coins'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              {formatNumber(reviewerProfile.rewardCoins, language)} <span className="text-xs font-normal text-slate-400">🪙</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'রিওয়ার্ড শপ' : 'Reward Vault'}</span>
              <span className="text-amber-400 font-bold">{language === 'bn' ? 'গ্যাজেট রিডিম' : 'Redeem Free'}</span>
            </div>
          </div>

          {/* Pending Escrow Earnings */}
          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {language === 'bn' ? 'অপেক্ষমাণ এস্ক্রো' : 'Pending in Escrow'}
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
              {formatBdt(pendingBalance, language)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {activeTasks.length} {language === 'bn' ? 'টি চলমান টাস্কের জন্য সুরক্ষিত' : 'tasks currently active'}
            </div>
          </div>
        </div>

        {/* Career XP Progress Bar */}
        <XpProgressBar
          careerXp={reviewerProfile.careerXp}
          levelId={reviewerProfile.levelId}
          lang={language}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4. Search Bar */}
      {/* ========================================================================= */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            id="home-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'ক্যাম্পেইন, প্রোডাক্ট, ব্র্যান্ড বা ক্যাটাগরি সার্চ করুন...'
                : 'Search opportunities, brands, products or keywords...'
            }
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 shadow-xl transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. Category Filters & Horizontal Scrollable Filter Chips */}
      {/* ========================================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'ফিল্টার ও বাছাই' : 'Filter Opportunities'}</span>
          </span>
          {(selectedFilterChip !== 'all' || selectedCategory !== 'all' || selectedDuration !== 'all' || selectedLevel !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedFilterChip('all');
                setSelectedCategory('all');
                setSelectedDuration('all');
                setSelectedLevel('all');
                setSearchQuery('');
              }}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'bn' ? 'রিসেট করুন' : 'Reset All'}</span>
            </button>
          )}
        </div>

        {/* Scrollable Quick Filter Chips (Mobile optimized) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', labelBn: 'সকল সুযোগ', labelEn: 'All Opportunities' },
            { id: 'recommended', labelBn: '✨ রিকমেন্ডেড (High Match)', labelEn: '✨ Recommended' },
            { id: 'highest_paying', labelBn: '💰 সর্বোচ্চ পেআউট (৳১,৫০০+)', labelEn: '💰 Highest Paying' },
            { id: 'newly_added', labelBn: '🔥 নতুন ক্যাম্পেইন', labelEn: '🔥 Newly Added' },
            { id: 'ending_soon', labelBn: '⏳ সমাপ্তির পথে', labelEn: '⏳ Ending Soon' },
            { id: 'keep_product', labelBn: '🎁 প্রোডাক্ট উপহার (নো রিটার্ন)', labelEn: '🎁 Keep Product' },
            { id: 'return_required', labelBn: '📦 কুরিয়ার রিটার্ন', labelEn: '📦 Return Required' },
            { id: 'eligible_only', labelBn: '✓ আমার যোগ্য ক্যাম্পেইন', labelEn: '✓ Eligible Only' },
          ].map((chip) => {
            const isSelected = selectedFilterChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedFilterChip(chip.id as any)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-semibold text-xs transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/20 scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                {language === 'bn' ? chip.labelBn : chip.labelEn}
              </button>
            );
          })}
        </div>

        {/* Secondary Category & Testing Duration Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
            <option value="স্মার্ট গ্যাজেটস">{language === 'bn' ? 'স্মার্ট গ্যাজেটস' : 'Smart Gadgets'}</option>
            <option value="সুগন্ধি ও আতর">{language === 'bn' ? 'সুগন্ধি ও আতর' : 'Fragrance & Attar'}</option>
            <option value="স্কিনকেয়ার">{language === 'bn' ? 'স্কিনকেয়ার' : 'Skincare & Beauty'}</option>
            <option value="অডিও ও মিউজিক">{language === 'bn' ? 'অডিও ও মিউজিক' : 'Audio & Tech'}</option>
          </select>

          {/* Testing Duration Dropdown */}
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">{language === 'bn' ? 'যেকোনো টেস্টিং সময়' : 'Any Testing Duration'}</option>
            <option value="quick">{language === 'bn' ? 'দ্রুত (≤ ৩ দিন)' : 'Quick (≤ 3 Days)'}</option>
            <option value="standard">{language === 'bn' ? 'স্ট্যান্ডার্ড (৪-৭ দিন)' : 'Standard (4-7 Days)'}</option>
            <option value="indepth">{language === 'bn' ? 'ইন-ডেপথ (৮+ দিন)' : 'In-depth (8+ Days)'}</option>
          </select>

          {/* Reviewer Level Dropdown */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">{language === 'bn' ? 'যেকোনো লেভেল যোগ্যতা' : 'Any Required Level'}</option>
            <option value="starter">{language === 'bn' ? 'স্টার্টার লেভেল' : 'Starter Level'}</option>
            <option value="verified">{language === 'bn' ? 'ভেরিফাইড লেভেল' : 'Verified Level'}</option>
            <option value="pro">{language === 'bn' ? 'প্রো লেভেল' : 'Pro Level'}</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. “Available Opportunities” Campaign Feed (Interactive Cards) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>{language === 'bn' ? 'উপলব্ধ সুযোগসমূহ (ক্যাম্পেইন ফিড)' : 'Available Opportunities'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold">
              {filteredCampaigns.length}
            </span>
          </h3>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'কোনো ক্যাম্পেইন পাওয়া যায়নি' : 'No matching opportunities found'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {language === 'bn'
                ? 'আপনার ফিল্টার বা সার্চ শব্দ পরিবর্তন করে পুনরায় চেষ্টা করুন।'
                : 'Try adjusting your search keywords or resetting your filter chips.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCampaigns.map((camp) => {
              const matchScore = calculateMatchScore(camp);
              const isSaved = savedCampaignIds.includes(camp.id);
              const isEligible = reviewerProfile.trustScore >= camp.minTrustScore;
              const remainingSpots = camp.totalReviewersTarget - camp.reviewersHired;

              return (
                <div
                  key={camp.id}
                  id={`campaign-card-${camp.id}`}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Card Header: Brand info, Category & Bookmark Toggle */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={camp.brandLogoUrl}
                          alt={camp.brandName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">
                            {camp.brandName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {camp.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Match Score Badge */}
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          {matchScore}% Match
                        </span>
                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => toggleSaveCampaign(camp.id)}
                          className={`p-1.5 rounded-xl border transition-all ${
                            isSaved
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                          aria-label="Save Opportunity"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Product Image and Details */}
                    <div className="flex items-start gap-3.5 mb-3.5">
                      <img
                        src={camp.productImageUrl}
                        alt={camp.productName}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                          {camp.productName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{language === 'bn' ? 'রিটেল মূল্য:' : 'Retail:'} <strong className="text-slate-200">{formatBdt(camp.productRetailPriceBdt, language)}</strong></span>
                          <span>•</span>
                          <span className="text-cyan-400 font-semibold">{camp.brief.videoOrientation === 'vertical' ? 'Vertical 9:16' : 'Horizontal'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {camp.brief.testingDurationDays} {language === 'bn' ? 'দিন টেস্টিং' : 'days test'}
                          </span>
                          <span>•</span>
                          <span className={camp.isReturnRequired ? 'text-amber-400' : 'text-emerald-400'}>
                            {camp.isReturnRequired ? (language === 'bn' ? 'কুরিয়ার রিটার্ন' : 'Return required') : (language === 'bn' ? 'প্রোডাক্ট গিফট' : 'Keep product')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics Pill Grid */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-3.5 text-center text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">{language === 'bn' ? 'রিভিউ পেআউট' : 'Reviewer Payout'}</span>
                        <strong className="text-emerald-400 font-mono text-sm font-bold block mt-0.5">
                          {formatBdt(camp.reviewerRewardBdt, language)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">{language === 'bn' ? 'ক্যারিয়ার XP' : 'Reward XP'}</span>
                        <strong className="text-amber-400 font-mono text-sm font-bold block mt-0.5">
                          +{camp.careerXpReward} XP
                        </strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">{language === 'bn' ? 'অবশিষ্ট আসন' : 'Positions'}</span>
                        <strong className="text-cyan-400 font-mono text-sm font-bold block mt-0.5">
                          {remainingSpots}/{camp.totalReviewersTarget}
                        </strong>
                      </div>
                    </div>

                    {/* Eligibility & Application Deadline */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 border-b border-slate-800/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {language === 'bn' ? 'ডেডলাইন:' : 'Deadline:'} <strong className="text-slate-300">{formatDate(camp.applicationDeadline, language)}</strong>
                      </span>
                      <span className={`font-semibold flex items-center gap-1 ${isEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isEligible ? '✓ ' + (language === 'bn' ? 'যোগ্য' : 'Eligible') : '⚠️ ' + (language === 'bn' ? 'লেভেল প্রয়োজন' : 'Tier Required')}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions: View Details & Apply Now */}
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCampaignForDetails(camp)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCampaignForApply(camp)}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'আবেদন করুন' : 'Apply Now'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 7. Private Brand Invitations */}
      {/* ========================================================================= */}
      {privateInvites.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>{language === 'bn' ? 'প্রাইভেট ব্র্যান্ড ইনভাইটেশন (ভিআইপি)' : 'Private Brand Invitations'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold font-mono">
                {privateInvites.length} VIP Invites
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {privateInvites.map((invite) => (
              <div
                key={invite.id}
                className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-950 border border-purple-500/40 shadow-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={invite.brandLogoUrl}
                      alt={invite.brandName}
                      className="w-10 h-10 rounded-xl object-cover border border-purple-500/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-white">{invite.brandName}</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                          VIP Direct
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{invite.invitationExpiry}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/30">
                    +{formatBdt(invite.vipBonusBdt, language)} VIP Bonus
                  </span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/20">
                  <img
                    src={invite.productImageUrl}
                    alt={invite.productName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{invite.productName}</h5>
                    <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                      {language === 'bn' ? 'মোট আয়:' : 'Total Payout:'} <strong className="text-emerald-400 font-bold">{formatBdt(invite.payoutBdt + invite.vipBonusBdt, language)}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                  "{language === 'bn' ? invite.messageBn : invite.messageEn}"
                </p>

                {/* Actions: Accept & Decline */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDeclineInvite(invite.id)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    {language === 'bn' ? 'প্রত্যাখ্যান করুন' : 'Decline'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptInvite(invite.id)}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ইনভাইটেশন গ্রহণ করুন' : 'Accept Invitation'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. High-value Opportunities Spotlight */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? 'উচ্চমূল্যের সুযোগ (৳২,০০০+ পেআউট)' : 'High-Value Opportunities'}</span>
          </h3>
          <span className="text-xs text-amber-400 font-semibold font-mono">
            {highValueCampaigns.length} Premium Campaigns
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {highValueCampaigns.slice(0, 2).map((camp) => (
            <div
              key={`high-val-${camp.id}`}
              onClick={() => setSelectedCampaignForDetails(camp)}
              className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-950 border border-amber-500/30 hover:border-amber-500/60 shadow-xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={camp.productImageUrl}
                  alt={camp.productName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    High Payout
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1 group-hover:text-amber-300 transition-colors">
                    {camp.productName}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {camp.brandName} • {camp.brief.testingDurationDays} {language === 'bn' ? 'দিন টেস্টিং' : 'days test'}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                  {formatBdt(camp.reviewerRewardBdt, language)}
                </div>
                <span className="text-[10px] text-amber-400 font-bold block">
                  +{camp.careerXpReward} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. Recommended Opportunities */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{language === 'bn' ? 'আপনার প্রোফাইল অনুযায়ী রিকমেন্ডেড' : 'Recommended For Your Profile'}</span>
          </h3>
          <span className="text-xs text-cyan-400 font-semibold">
            90%+ Match
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {recommendedCampaigns.slice(0, 2).map((camp) => (
            <div
              key={`rec-${camp.id}`}
              onClick={() => setSelectedCampaignForDetails(camp)}
              className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-xl flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={camp.productImageUrl}
                  alt={camp.productName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30">
                    {calculateMatchScore(camp)}% Match
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1 group-hover:text-cyan-300 transition-colors">
                    {camp.productName}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {camp.category} • {camp.isReturnRequired ? 'Return' : 'Keep Gift'}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                  {formatBdt(camp.reviewerRewardBdt, language)}
                </div>
                <span className="text-[10px] text-cyan-400 font-bold block">
                  +{camp.careerXpReward} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. Newly Added Campaigns */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'সদ্য যুক্ত হওয়া ক্যাম্পেইন' : 'Newly Added Campaigns'}</span>
          </h3>
          <span className="text-xs text-slate-400">
            {language === 'bn' ? 'লাইভ এস্ক্রো ভেরিফাইড' : 'Live Escrow Verified'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {newlyAddedCampaigns.map((camp) => (
            <div
              key={`new-${camp.id}`}
              onClick={() => setSelectedCampaignForDetails(camp)}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg space-y-2 group"
            >
              <img
                src={camp.productImageUrl}
                alt={camp.productName}
                className="w-full h-24 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition-transform"
              />
              <div className="space-y-0.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-semibold block truncate">
                  {camp.brandName}
                </span>
                <h5 className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                  {camp.productName}
                </h5>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold font-mono">{formatBdt(camp.reviewerRewardBdt, language)}</span>
                  <span className="text-[10px] text-amber-400 font-bold">+{camp.careerXpReward}XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 11. Active Task Summary */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'চলমান টাস্ক ও অ্যাসাইনমেন্ট' : 'Active Task Workspace'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {activeTasks.length}
            </span>
          </h3>
          <button
            type="button"
            onClick={() => {
              setActiveReviewerTab('tasks');
              navigate('/reviewer/tasks');
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
          >
            <span>{language === 'bn' ? 'সব টাস্ক দেখুন' : 'Open Workspace'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeTasks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
            {language === 'bn' ? 'বর্তমানে কোনো সক্রিয় টাস্ক নেই। উপরের নতুন ক্যাম্পেইনে আবেদন করুন।' : 'No active tasks in progress. Apply to campaigns above.'}
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  setActiveReviewerTab('tasks');
                  navigate('/reviewer/tasks');
                }}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg group"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={task.productImageUrl}
                      alt={task.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {task.productName}
                      </h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{task.brandName}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold font-mono">{formatBdt(task.payoutBdt, language)}</span>
                      </div>
                    </div>
                  </div>
                  <StatusChip status={task.status} lang={language} size="sm" />
                </div>

                {task.status === 'revision_requested' && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span className="truncate">
                      {language === 'bn' ? 'ব্র্যান্ডের সংশোধন অনুরোধ এসেছে: বিস্তারিত দেখতে টাস্ক খুলুন।' : 'Revision requested by brand. Open task to respond.'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>
                    {language === 'bn' ? 'ডেডলাইন:' : 'Deadline:'} <strong className="text-slate-300">{language === 'bn' ? '১০ নভেম্বর' : 'Nov 10'}</strong>
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span>{language === 'bn' ? 'ওয়ার্কস্পেস খুলুন' : 'Open Workspace'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 12. Upcoming Deadlines */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? 'আসন্ন ডেডলাইন ও মাইলস্টোন' : 'Upcoming Deadlines & Milestones'}</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {language === 'bn' ? 'সময়মতো সাবমিট করলে +২০ XP বোনাস' : '+20 XP on-time bonus'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-white font-bold block">Pulse Pro Smartwatch</span>
              <span className="text-slate-400 text-[11px]">{language === 'bn' ? 'ভিডিও রিভিউ সাবমিশন' : 'Video Review Submission'}</span>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold font-mono">
              24h {language === 'bn' ? 'বাকি' : 'left'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-white font-bold block">Al-Amanat Royal Oud</span>
              <span className="text-slate-400 text-[11px]">{language === 'bn' ? 'কুরিয়ার রিসিভ কনফার্মেশন' : 'Courier Delivery Confirmation'}</span>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold font-mono">
              {language === 'bn' ? 'পৌঁছেছে' : 'Delivered'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 13. Level and Brand Ambassador Progress */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-900 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xl shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                {language === 'bn' ? 'ব্র্যান্ড অ্যাম্বাসেডর পাথওয়ে' : 'Brand Ambassador Pathway'}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                {language === 'bn' ? 'মাসিক ৳১,০০,০০০ পর্যন্ত' : 'Up to ৳100,000/mo'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {reviewerProfile.isAmbassador
                ? language === 'bn' ? 'আপনি বর্তমানে Aura Naturals BD এর সক্রিয় ব্র্যান্ড অ্যাম্বাসেডর!' : 'Active partner for Aura Naturals BD with fixed monthly retainer.'
                : language === 'bn' ? 'ট্রাস্ট স্কোর ৯০+ এবং ১০টি সফল রিভিউ সম্পন্ন করলেই আনলক হবে ব্র্যান্ড রিটেইনার অফার।' : 'Reach 90+ trust score and 10 completed reviews to unlock direct brand retainer offers.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveReviewerTab('profile');
            navigate('/reviewer/profile');
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all whitespace-nowrap self-end sm:self-center"
        >
          {language === 'bn' ? 'অ্যাম্বাসেডর শর্তাবলী' : 'View Ambassador Hub'}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 14. Recent Activity Feed */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'সাম্প্রতিক প্ল্যাটফর্ম কার্যক্রম' : 'Recent Platform Activity'}</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {language === 'bn' ? 'লাইভ ইভেন্ট হিস্ট্রি' : 'Live Event History'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-semibold block">{language === 'bn' ? 'রিভিউ অনুমোদন ও পেমেন্ট রিলিজ' : 'Review Approved & Payout Released'}</span>
                <span className="text-slate-400 text-[10px]">Royal Oud Luxury Attar • Aura Naturals BD</span>
              </div>
            </div>
            <span className="text-emerald-400 font-mono font-bold">+৳1,500</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <div>
                <span className="text-white font-semibold block">{language === 'bn' ? 'ক্যারিয়ার XP বোনাস অর্জিত' : 'Career XP Milestone Bonus'}</span>
                <span className="text-slate-400 text-[10px]">{language === 'bn' ? 'সময়মতো হাই-কোয়ালিটি ভিডিও রিভিউ জমা দেওয়ার জন্য' : 'On-time 4K video review submission'}</span>
              </div>
            </div>
            <span className="text-amber-400 font-mono font-bold">+150 XP</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Campaign Details Modal (6 Tabs + Do's & Don'ts + Acknowledgement) */}
      {/* ========================================================================= */}
      {selectedCampaignForDetails && (
        <CampaignDetailModal
          campaign={selectedCampaignForDetails}
          isOpen={Boolean(selectedCampaignForDetails)}
          onClose={() => setSelectedCampaignForDetails(null)}
          onApply={(campaignId) => {
            const camp = selectedCampaignForDetails;
            setSelectedCampaignForDetails(null);
            setSelectedCampaignForApply(camp);
          }}
          isApplied={appliedCampaignIds.includes(selectedCampaignForDetails.id)}
          hasAssignment={assignments.some((a) => a.campaignId === selectedCampaignForDetails.id)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: Campaign Application Confirmation Modal */}
      {/* ========================================================================= */}
      {selectedCampaignForApply && (
        <div
          id="campaign-apply-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
        >
          <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 my-8 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-400">{language === 'bn' ? 'ক্যাম্পেইন আবেদন' : 'Campaign Application'}</span>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  {selectedCampaignForApply.productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaignForApply(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Address Verification */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {language === 'bn' ? 'কুরিয়ার ডেলিভারি ঠিকানা নিশ্চিতকরণ' : 'Courier Shipping Address Confirmation'}
              </span>
              <p className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-medium">
                {reviewerProfile.deliveryAddress?.fullAddress || 'ফ্ল্যাট ৪বি, গ্রিন ডেল এপার্টমেন্ট, রোড ৮, ধানমন্ডি, ঢাকা'}
              </p>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={applyConfirmAddress}
                  onChange={(e) => setApplyConfirmAddress(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
                />
                <span className="text-slate-300 text-[11px]">
                  {language === 'bn' ? 'এই ঠিকানায় প্রোডাক্ট কুরিয়ার ডেলিভারি গ্রহণযোগ্য' : 'Confirm this shipping address is current and accessible'}
                </span>
              </label>
            </div>

            {/* Honesty Commitment Agreement */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyAgreeTerms}
                  onChange={(e) => setApplyAgreeTerms(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700 mt-0.5"
                />
                <span className="text-slate-300 leading-relaxed text-[11px]">
                  {language === 'bn'
                    ? 'আমি স্বীকার করছি যে আমি অন্তত ৫ দিন বাস্তব ব্যবহারের পর নিরপেক্ষ রিভিউ দেব এবং কোনো বিভ্রান্তিকর বা অতিরঞ্জিত দাবি করব না।'
                    : 'I agree to test the product genuinely for the specified duration and submit an honest, objective critique abiding by BringDollar guidelines.'}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCampaignForApply(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 hover:text-white"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!applyAgreeTerms || !applyConfirmAddress}
                onClick={handleConfirmApplication}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'আবেদন নিশ্চিত করুন' : 'Confirm Application'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
