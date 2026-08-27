import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Campaign } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Trophy,
  AlertTriangle,
  RotateCcw,
  Gift,
  ArrowRight,
  Info,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';

export const ReviewerOpportunities: React.FC = () => {
  const { campaigns, reviewerProfile, applyToCampaign, language, assignments, setActiveReviewerTab } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const categories = [
    { id: 'all', labelBn: 'সব ক্যাটাগরি', labelEn: 'All Categories' },
    { id: 'স্মার্ট গ্যাজেটস', labelBn: 'স্মার্ট গ্যাজেটস', labelEn: 'Smart Gadgets' },
    { id: 'পারফিউম ও আতর', labelBn: 'পারফিউম ও আতর', labelEn: 'Perfumes' },
    { id: 'স্কিনকেয়ার', labelBn: 'স্কিনকেয়ার', labelEn: 'Skincare' },
    { id: 'লাইফস্টাইল', labelBn: 'লাইফস্টাইল', labelEn: 'Lifestyle' },
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q ||
      (c.productName || '').toLowerCase().includes(q) ||
      (c.brandName || '').toLowerCase().includes(q) ||
      (c.title || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const isAlreadyApplied = (campaignId: string) => {
    return assignments.some((a) => a.campaignId === campaignId);
  };

  const handleOpenDetails = (c: Campaign) => {
    setSelectedCampaign(c);
    setShowApplyModal(true);
  };

  const handleConfirmApply = () => {
    if (!selectedCampaign) return;
    applyToCampaign(selectedCampaign.id);
    setShowApplyModal(false);
    setActiveReviewerTab('tasks');
    navigate('/reviewer/tasks');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 sm:pb-32 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>{language === 'bn' ? 'প্রোডাক্ট টেস্টিং ক্যাম্পেইন' : 'Product Testing Campaigns'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {language === 'bn'
              ? 'ভেরিফাইড ব্র্যান্ডের প্রি-ফান্ডেড পেইড রিভিউ টাস্ক'
              : 'Pre-funded paid testing opportunities from verified brands'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'ক্যাম্পেইন বা ব্র্যান্ড সার্চ করুন...' : 'Search campaigns...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? cat.labelBn : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((camp) => {
          const alreadyApplied = isAlreadyApplied(camp.id);

          return (
            <div
              key={camp.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {/* Product Header */}
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={camp.productImageUrl}
                    alt={camp.productName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {camp.category}
                      </span>
                      {camp.isReturnRequired ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1 font-semibold">
                          <RotateCcw className="w-2.5 h-2.5" />
                          {language === 'bn' ? 'রিটার্ন প্রযোজ্য' : 'Return Required'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 font-semibold">
                          <Gift className="w-2.5 h-2.5" />
                          {language === 'bn' ? 'প্রোডাক্ট নিজের কাছে থাকবে' : 'Keep Product'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-1">
                      {camp.productName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>{camp.brandName}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-mono">
                        {language === 'bn' ? 'মূল্য:' : 'Value:'} {formatBdt(camp.productValueBdt, language)}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {camp.campaignObjective}
                </p>

                {/* Key Metrics row */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'bn' ? 'রিভিউ পেআউট' : 'Review Payout'}</span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">
                      {formatBdt(camp.reviewerRewardBdt, language)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'bn' ? 'টেস্টিং মেয়াদ' : 'Testing Days'}</span>
                    <span className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">
                      {language === 'bn' ? `${toBengaliDigits(camp.testingDurationDays)} দিন` : `${camp.testingDurationDays} days`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'bn' ? 'রিওয়ার্ড' : 'Rewards'}</span>
                    <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">
                      +{camp.careerXpReward} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'স্লট বাকি:' : 'Slots left:'}{' '}
                  <strong className="text-slate-200 font-mono">
                    {language === 'bn' ? toBengaliDigits(camp.slotsRemaining) : camp.slotsRemaining}
                  </strong>{' '}
                  / {language === 'bn' ? toBengaliDigits(camp.totalSlots) : camp.totalSlots}
                </div>

                {alreadyApplied ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'bn' ? 'আবেদন করা হয়েছে' : 'Applied'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenDetails(camp)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'বিস্তারিত ও আবেদন' : 'Details & Apply'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Details & Apply Modal */}
      {showApplyModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCampaign.productImageUrl}
                  alt={selectedCampaign.productName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-800"
                />
                <div>
                  <h3 className="text-base font-extrabold text-white">{selectedCampaign.productName}</h3>
                  <p className="text-xs text-slate-400">{selectedCampaign.brandName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'রিভিউয়ার ক্যাশ পেমেন্ট:' : 'Cash Payout:'}</span>
                <strong className="text-emerald-400 font-mono font-bold">{formatBdt(selectedCampaign.reviewerRewardBdt, language)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'ক্যাম্পেইন XP ও Coins:' : 'XP & Coins:'}</span>
                <strong className="text-amber-400 font-mono">+{selectedCampaign.careerXpReward} XP, +{selectedCampaign.rewardCoinsReward} Coins</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'প্রোডাক্ট টেস্ট মেয়াদ:' : 'Testing Duration:'}</span>
                <span className="text-white">{selectedCampaign.testingDurationDays} {language === 'bn' ? 'দিন বাস্তব ব্যবহার' : 'days real testing'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'প্রোডাক্ট পজিশন:' : 'Product Possession:'}</span>
                <span className="text-cyan-300 font-semibold">{selectedCampaign.isReturnRequired ? (language === 'bn' ? 'রিটার্ন কুরিয়ার বাধ্যতামূলক' : 'Return Required') : (language === 'bn' ? 'রিভিউয়ারের কাছেই থাকবে (Keep)' : 'Keep Product')}</span>
              </div>
            </div>

            {/* Campaign Rules & Mandatory Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'bn' ? 'রিভিউ নির্দেশনা ও পয়েন্টসমূহ' : 'Review Guidelines'}
              </h4>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div>📌 <strong>{language === 'bn' ? 'অবশ্যই উল্লেখ করবেন:' : 'Mandatory Points:'}</strong> {selectedCampaign.mandatoryTalkingPoints.join(', ')}</div>
                <div className="text-amber-300">
                  ⚠️ <strong>{language === 'bn' ? 'সততা শর্ত:' : 'Honesty Rule:'}</strong>{' '}
                  {language === 'bn'
                    ? 'অন্তত ১টি বাস্তব দুর্বলতা বা সীমাবদ্ধতা উল্লেখ করবেন। কোনো অতিরঞ্জিত বা অবাস্তব প্রশংসা গ্রহণযোগ্য নয়।'
                    : 'Include at least 1 genuine limitation or critique. Forced positive praise is prohibited.'}
                </div>
                <div className="text-rose-300">🚫 <strong>{language === 'bn' ? 'নিষিদ্ধ দাবি:' : 'Prohibited:'}</strong> {selectedCampaign.prohibitedClaims.join(', ')}</div>
              </div>
            </div>

            {/* Confirmation CTAs */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'আবেদন নিশ্চিত করুন' : 'Confirm Application'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
