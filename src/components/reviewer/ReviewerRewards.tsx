import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RewardItem } from '../../types';
import {
  Gift,
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Package,
  MapPin,
} from 'lucide-react';
import { formatNumber, toBengaliDigits } from '../../utils/formatters';
import { REVIEWER_LEVELS } from '../../utils/levels';

export const ReviewerRewards: React.FC = () => {
  const {
    rewards,
    reviewerProfile,
    redeemReward,
    language,
    setActiveReviewerTab,
  } = useApp();
  const navigate = useNavigate();

  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [shippingAddress, setShippingAddress] = useState(reviewerProfile.presentAddress || 'ধানমন্ডি, ঢাকা');
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const currentLevel = REVIEWER_LEVELS[reviewerProfile.levelId];

  const handleOpenRedeem = (item: RewardItem) => {
    setSelectedReward(item);
    setShowRedeemModal(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;
    redeemReward(selectedReward.id);
    setShowRedeemModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 sm:pb-32 space-y-6">
      {/* Back button to Profile */}
      <button
        type="button"
        onClick={() => {
          setActiveReviewerTab('profile');
          navigate('/reviewer/profile');
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'প্রোফাইলে ফিরুন' : 'Back to Profile'}</span>
      </button>

      {/* Header & Balance Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/30 via-white/5 to-transparent border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              {language === 'bn' ? 'গ্যাজেট ও গিফট রিওয়ার্ড স্টোর' : 'Creator Rewards Store'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'bn' ? 'রিওয়ার্ড কয়েন রিডিম করুন' : 'Redeem Reward Coins'}
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-md">
            {language === 'bn'
              ? 'কয়েন খরচ করে উচ্চমানের ক্রিয়েটর গ্যাজেট উপহার হিসেবে রিডিম করুন। এটি আপনার মূল Career XP বা লেভেল কমাবে না।'
              : 'Redeem high-quality gear with spendable coins. Your permanent Career XP is untouched.'}
          </p>
        </div>

        {/* Spendable Coins Card */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl shadow-lg">
            🪙
          </div>
          <div>
            <span className="text-xs text-amber-300 font-medium block">
              {language === 'bn' ? 'আপনার বর্তমান কয়েন' : 'Spendable Coins'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {formatNumber(reviewerProfile.rewardCoins, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rewards.map((item) => {
          const hasEnoughCoins = reviewerProfile.rewardCoins >= item.costCoins;
          const minLevelRequired = REVIEWER_LEVELS[item.minLevelRequired];
          const isLevelUnlocked = true; // In our demo state user has unlocked level

          return (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[4/3] w-full bg-slate-900/60 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-xs font-mono flex items-center gap-1">
                    <span>🪙</span>
                    <span>{formatNumber(item.costCoins, language)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] text-white/50 uppercase font-semibold tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">
                    {language === 'bn' ? item.titleBn : item.titleEn}
                  </h4>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                    {language === 'bn' ? item.descriptionBn : item.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  disabled={!hasEnoughCoins}
                  onClick={() => handleOpenRedeem(item)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    hasEnoughCoins
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {hasEnoughCoins ? (
                    <>
                      <Gift className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'রিডিম করুন' : 'Redeem Gift'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {formatNumber(item.costCoins - reviewerProfile.rewardCoins, language)}{' '}
                        {language === 'bn' ? 'কয়েন বাকি' : 'more coins needed'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'পুরস্কার রিডিম নিশ্চিতকরণ' : 'Confirm Reward Redemption'}
                </h3>
              </div>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <img
                src={selectedReward.imageUrl}
                alt={selectedReward.titleBn}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {language === 'bn' ? selectedReward.titleBn : selectedReward.titleEn}
                </h4>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {formatNumber(selectedReward.costCoins, language)} Coins
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}</span>
              </label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              📦 {language === 'bn' ? 'রিডিম সম্পন্ন হলে ৩-৫ কার্যদিবসের মধ্যে কুরিয়ারে ফ্রি হোম ডেলিভারি পৌঁছে যাবে।' : 'Free home delivery within 3-5 business days.'}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRedeemModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/70 text-xs font-semibold"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              >
                {language === 'bn' ? 'রিডিম সম্পন্ন করুন' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
