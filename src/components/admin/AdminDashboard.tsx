import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  DollarSign,
  Briefcase,
  Video,
  FileCheck,
  Search,
  Eye,
  Sparkles,
  Building2,
  Package,
  Truck,
  Layers,
  Activity,
  Sliders,
  UserPlus,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';
import { ReviewerDirectory } from './ReviewerDirectory';
import { BrandsDirectory } from './BrandsDirectory';
import { ProductDirectory } from './ProductDirectory';
import { DeliveryCommandCenter } from './DeliveryCommandCenter';
import { AssignmentExplorer } from './AssignmentExplorer';
import { AccountApprovals } from './AccountApprovals';

export const AdminDashboard: React.FC = () => {
  const {
    reviewerProfile,
    approveReviewerVerification,
    disputes,
    resolveDispute,
    campaigns,
    stores,
    deliveries,
    reviewerDirectoryList,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'reviewers' | 'stores' | 'products' | 'logistics' | 'hierarchy' | 'signups' | 'verifications' | 'disputes' | 'escrow'
  >('signups');

  const totalEscrowHeld = campaigns.reduce((acc, c) => acc + c.reviewerRewardBdt * c.totalSlots, 0);

  const pendingStoresCount = stores.filter(s => s.verificationStatus === 'under_admin_review' || s.verificationStatus === 'submitted').length;
  const inTransitCount = deliveries.filter(d => d.status === 'in_transit' || d.status === 'dispatched' || d.status === 'out_for_delivery').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 space-y-8">
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-lg">
            🛡️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {language === 'bn' ? 'BringDollar অ্যাডমিন কমান্ড সেন্টার' : 'BringDollar Admin Command Center'}
            </h2>
            <p className="text-xs text-white/50">
              {language === 'bn' ? 'রিভিউয়ার ডিরেক্টরি, মাল্টি-স্টোর অনুমোদন, কুরিয়ার কমান্ড ও আরবিট্রেশন' : 'Reviewer Directory, Multi-Brand Approvals, Courier Logistics & Arbitration'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-white/50 block">{language === 'bn' ? 'মোট এস্ক্রো প্রটেকশন' : 'Total Escrow Protected'}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {formatBdt(totalEscrowHeld, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('signups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'signups'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'bn' ? 'সাইন আপ অনুমোদন' : 'Signup Approvals'}</span>
        </button>

        <button
          onClick={() => setActiveTab('reviewers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'reviewers'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'bn' ? 'রিভিউয়ার ডিরেক্টরি' : 'Reviewer Directory'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{reviewerDirectoryList.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'stores'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === 'bn' ? 'ব্র্যান্ড ও স্টোর' : 'Brands & Stores'}</span>
          {pendingStoresCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
              {pendingStoresCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{language === 'bn' ? 'প্রোডাক্ট ক্যাটালগ' : 'Product Catalog'}</span>
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'logistics'
              ? 'bg-purple-500 text-slate-950 font-black shadow-lg shadow-purple-500/20'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{language === 'bn' ? 'কুরিয়ার কমান্ড সেন্টার' : 'Courier Logistics'}</span>
          {inTransitCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{inTransitCount}</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'hierarchy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'bn' ? 'হায়ারার্কি ম্যাপ' : 'Hierarchy Explorer'}</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'verifications'
              ? 'bg-white/15 text-white border border-white/20'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{language === 'bn' ? 'ভেরিফিকেশন কিউ' : 'Verification Queue'}</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'disputes'
              ? 'bg-white/15 text-white border border-white/20'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{language === 'bn' ? 'ডিসপিউট ও আরবিট্রেশন' : 'Dispute Arbitration'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">{disputes.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'escrow'
              ? 'bg-white/15 text-white border border-white/20'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{language === 'bn' ? 'এস্ক্রো ও হেলথ' : 'Escrow & Health'}</span>
        </button>
      </div>

      {/* Tab 0: Signup Approvals */}
      {activeTab === 'signups' && <AccountApprovals />}

      {/* Tab 1: Reviewer Directory */}
      {activeTab === 'reviewers' && <ReviewerDirectory />}

      {/* Tab 2: Brands & Stores Directory */}
      {activeTab === 'stores' && <BrandsDirectory />}

      {/* Tab 3: Product Catalog */}
      {activeTab === 'products' && <ProductDirectory />}

      {/* Tab 4: Logistics & Delivery Center */}
      {activeTab === 'logistics' && <DeliveryCommandCenter />}

      {/* Tab 5: Hierarchy & Assignment Explorer */}
      {activeTab === 'hierarchy' && <AssignmentExplorer />}

      {/* Tab 6: Verifications */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={reviewerProfile.avatarUrl}
                  alt={reviewerProfile.fullName}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{reviewerProfile.fullName}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                      Pending QA
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    {reviewerProfile.phone} • {reviewerProfile.district} • NID: {reviewerProfile.nidNumberMasked}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => approveReviewerVerification(reviewerProfile.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'NID ও ডেমো অনুমোদন করুন' : 'Approve Reviewer'}</span>
                </button>
              </div>
            </div>

            {/* Vetting Criteria Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <strong className="text-emerald-400 block mb-1">
                  ✓ {language === 'bn' ? 'NID বায়োমেট্রিক ও ফেস ম্যাচ' : 'NID & Face Match'}
                </strong>
                <span className="text-white/60">
                  {language === 'bn' ? '১০ ডিজিট স্মার্ট NID ভেরিফাইড (৯৮% কনফিডেন্স)' : 'Smart NID verified (98% match)'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <strong className="text-emerald-400 block mb-1">
                  ✓ {language === 'bn' ? 'ডেমো ভিডিও রুব্রিক' : 'Demo Video Rubric'}
                </strong>
                <span className="text-white/60">
                  {language === 'bn' ? 'ন্যাচারাল কথা বলা, ভালো আলো ও স্পষ্ট অডিও (৪.৮/৫)' : 'Natural delivery, crisp audio & lighting (4.8/5)'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <strong className="text-emerald-400 block mb-1">
                  ✓ {language === 'bn' ? 'কোনো ফেক রিভিউ রেকর্ড নেই' : 'Clean Authenticity Record'}
                </strong>
                <span className="text-white/60">
                  {language === 'bn' ? 'ক্লিন হিস্ট্রি ও ট্রাস্ট স্কোর ১০০' : 'Zero fraud flags, Trust Score 100'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Disputes */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center text-xs text-white/50">
              {language === 'bn' ? 'কোনো সক্রিয় ডিসপিউট নেই। প্ল্যাটফর্মের পরিবেশ সম্পূর্ণ স্বাভাবিক।' : 'No active disputes. System operating smoothly.'}
            </div>
          ) : (
            disputes.map((disp) => (
              <div key={disp.id} className="p-6 rounded-3xl bg-white/5 border border-rose-500/30 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <h4 className="text-sm font-bold text-white">
                      {language === 'bn' ? `ডিসপিউট কেস #${disp.id}` : `Dispute Case #${disp.id}`}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                    {disp.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-white/80 space-y-1">
                  <div>
                    <strong>{language === 'bn' ? 'রিভিউয়ারের অভিযোগ:' : 'Reviewer Claim:'}</strong> "{disp.reviewerClaim}"
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => resolveDispute(disp.id, 'favored_reviewer', language === 'bn' ? 'রিভিউয়ারের সৎ দুর্বলতা উল্লেখ নীতিসম্মত এবং সুরক্ষিত।' : 'Reviewer critical feedback is protected by platform policy.')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
                  >
                    {language === 'bn' ? 'রিভিউয়ারের পক্ষে রায় দিন (পেমেন্ট রিলিজ)' : 'Favor Reviewer (Release Payment)'}
                  </button>
                  <button
                    onClick={() => resolveDispute(disp.id, 'favored_brand', language === 'bn' ? 'ব্র্যান্ডের তথ্যগত সংশোধনের দাবি যুক্তিসঙ্গত।' : 'Brand factual revision justified.')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/10"
                  >
                    {language === 'bn' ? 'ব্র্যান্ডের পক্ষে রায় দিন' : 'Favor Brand'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 8: Escrow */}
      {activeTab === 'escrow' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
            <span className="text-xs text-white/50 block mb-1">
              {language === 'bn' ? 'মোট ভেরিফাইড ক্যাম্পেইন' : 'Total Active Campaigns'}
            </span>
            <span className="text-2xl font-black text-white font-mono">
              {campaigns.length} {language === 'bn' ? 'টি' : ''}
            </span>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
            <span className="text-xs text-white/50 block mb-1">
              {language === 'bn' ? 'নিরাপদ এস্ক্রো ফান্ড' : 'Escrow Funds Secured'}
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{formatBdt(totalEscrowHeld, language)}</span>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
            <span className="text-xs text-white/50 block mb-1">
              {language === 'bn' ? 'প্ল্যাটফর্ম ট্রাস্ট ইনডেক্স' : 'Platform Trust Index'}
            </span>
            <span className="text-2xl font-black text-cyan-300 font-mono">
              {language === 'bn' ? '৯৯.৪%' : '99.4%'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
