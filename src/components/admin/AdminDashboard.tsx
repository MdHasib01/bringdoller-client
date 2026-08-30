import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Users,
  DollarSign,
  FileCheck,
  Building2,
  Package,
  Truck,
  Layers,
  UserPlus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { formatBdt } from '../../utils/formatters';
import { ReviewerDirectory } from './ReviewerDirectory';
import { BrandsDirectory } from './BrandsDirectory';
import { ProductDirectory } from './ProductDirectory';
import { DeliveryCommandCenter } from './DeliveryCommandCenter';
import { AssignmentExplorer } from './AssignmentExplorer';
import { AccountApprovals } from './AccountApprovals';

type TabKey =
  | 'signups'
  | 'reviewers'
  | 'stores'
  | 'products'
  | 'logistics'
  | 'hierarchy'
  | 'verifications'
  | 'disputes'
  | 'escrow';

interface NavItem {
  key: TabKey;
  icon: LucideIcon;
  labelBn: string;
  labelEn: string;
  badge?: number;
  urgent?: boolean;
}

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

  const [activeTab, setActiveTab] = useState<TabKey>('signups');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const totalEscrowHeld = campaigns.reduce((acc, c) => acc + c.reviewerRewardBdt * c.totalSlots, 0);

  const pendingStoresCount = stores.filter(s => s.verificationStatus === 'under_admin_review' || s.verificationStatus === 'submitted').length;
  const inTransitCount = deliveries.filter(d => d.status === 'in_transit' || d.status === 'dispatched' || d.status === 'out_for_delivery').length;

  const navItems: NavItem[] = [
    { key: 'signups', icon: UserPlus, labelBn: 'সাইন আপ অনুমোদন', labelEn: 'Signup Approvals' },
    { key: 'reviewers', icon: Users, labelBn: 'রিভিউয়ার ডিরেক্টরি', labelEn: 'Reviewer Directory', badge: reviewerDirectoryList.length },
    { key: 'stores', icon: Building2, labelBn: 'ব্র্যান্ড ও স্টোর', labelEn: 'Brands & Stores', badge: pendingStoresCount || undefined, urgent: true },
    { key: 'products', icon: Package, labelBn: 'প্রোডাক্ট ক্যাটালগ', labelEn: 'Product Catalog' },
    { key: 'logistics', icon: Truck, labelBn: 'কুরিয়ার কমান্ড সেন্টার', labelEn: 'Courier Logistics', badge: inTransitCount || undefined },
    { key: 'hierarchy', icon: Layers, labelBn: 'হায়ারার্কি ম্যাপ', labelEn: 'Hierarchy Explorer' },
    { key: 'verifications', icon: FileCheck, labelBn: 'ভেরিফিকেশন কিউ', labelEn: 'Verification Queue' },
    { key: 'disputes', icon: AlertTriangle, labelBn: 'ডিসপিউট ও আরবিট্রেশন', labelEn: 'Dispute Arbitration', badge: disputes.length },
    { key: 'escrow', icon: DollarSign, labelBn: 'এস্ক্রো ও হেলথ', labelEn: 'Escrow & Health' },
  ];

  const activeNavItem = navItems.find((item) => item.key === activeTab) || navItems[0];

  const goToTab = (key: TabKey) => {
    setActiveTab(key);
    setIsMobileNavOpen(false);
  };

  const NavList: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => goToTab(item.key)}
            title={collapsed ? (language === 'bn' ? item.labelBn : item.labelEn) : undefined}
            className={`w-full flex items-center gap-3 rounded-xl text-xs font-bold transition-all ${
              collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
            } ${
              isActive
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="relative shrink-0">
              <Icon className="w-4.5 h-4.5" />
              {collapsed && !!item.badge && (
                <span
                  className={`absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    item.urgent ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/20 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </span>

            {!collapsed && (
              <>
                <span className="flex-1 min-w-0 text-left truncate">
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </span>
                {!!item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      item.urgent
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-black/20 text-slate-950'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex items-start">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-white/10 bg-slate-950/60 backdrop-blur-xl transition-all duration-200 ${
          isSidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        <div className={`flex items-center gap-2.5 p-4 border-b border-white/10 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-4.5 h-4.5" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-xs font-black text-white truncate">
                {language === 'bn' ? 'অ্যাডমিন কমান্ড সেন্টার' : 'Admin Command Center'}
              </div>
              <div className="text-[10px] text-white/40 truncate">BringDollar</div>
            </div>
          )}
        </div>

        <NavList collapsed={isSidebarCollapsed} />

        <div className="p-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
            title={isSidebarCollapsed ? (language === 'bn' ? 'সাইডবার বড় করুন' : 'Expand sidebar') : (language === 'bn' ? 'সাইডবার ছোট করুন' : 'Collapse sidebar')}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Off-canvas Drawer — portaled to <body> so it isn't capped by
          <main>'s own stacking context (z-10 relative) and always paints
          above the sticky global header (z-40). */}
      {isMobileNavOpen &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[100] flex">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)} />
            <aside className="relative w-[80%] max-w-[280px] h-full bg-slate-950 border-r border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between gap-2.5 p-4 border-b border-white/10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate">
                      {language === 'bn' ? 'অ্যাডমিন কমান্ড সেন্টার' : 'Admin Command Center'}
                    </div>
                    <div className="text-[10px] text-white/40 truncate">BringDollar</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 shrink-0"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <NavList collapsed={false} />
            </aside>
          </div>,
          document.body
        )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-16 z-30 flex items-center gap-3 px-4 py-3 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 shrink-0"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
          <span className="text-sm font-bold text-white truncate">
            {language === 'bn' ? activeNavItem.labelBn : activeNavItem.labelEn}
          </span>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 pb-24 space-y-6">
          {/* Admin Header */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-lg hidden sm:flex">
                🛡️
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {language === 'bn' ? 'BringDollar অ্যাডমিন কমান্ড সেন্টার' : 'BringDollar Admin Command Center'}
                </h2>
                <p className="text-xs text-white/50">
                  {language === 'bn' ? 'রিভিউয়ার ডিরেক্টরি, মাল্টি-স্টোর অনুমোদন, কুরিয়ার কমান্ড ও আরবিট্রেশন' : 'Reviewer Directory, Multi-Brand Approvals, Courier Logistics & Arbitration'}
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
                      ✓ {language === 'bn' ? 'NID বায়োমেট্রিক ও ফেস ম্যাচ' : 'NID & Face Match'}
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
                  {language === 'bn' ? 'কোনো সক্রিয় ডিসপিউট নেই। প্ল্যাটফর্মের পরিবেশ সম্পূর্ণ স্বাভাবিক।' : 'No active disputes. System operating smoothly.'}
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
                        <strong>{language === 'bn' ? 'রিভিউয়ারের অভিযোগ:' : 'Reviewer Claim:'}</strong> "{disp.reviewerClaim}"
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => resolveDispute(disp.id, 'favored_reviewer', language === 'bn' ? 'রিভিউয়ারের সৎ দুর্বলতা উল্লেখ নীতিসম্মত এবং সুরক্ষিত।' : 'Reviewer critical feedback is protected by platform policy.')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
                      >
                        {language === 'bn' ? 'রিভিউয়ারের পক্ষে রায় দিন (পেমেন্ট রিলিজ)' : 'Favor Reviewer (Release Payment)'}
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'favored_brand', language === 'bn' ? 'ব্র্যান্ডের তথ্যগত সংশোধনের দাবি যুক্তিসঙ্গত।' : 'Brand factual revision justified.')}
                        className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/10"
                      >
                        {language === 'bn' ? 'ব্র্যান্ডের পক্ষে রায় দিন' : 'Favor Brand'}
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
      </div>
    </div>
  );
};
