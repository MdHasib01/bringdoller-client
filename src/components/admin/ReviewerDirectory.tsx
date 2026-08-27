import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Shield,
  Star,
  Award,
  Truck,
  Package,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  ChevronRight,
  UserCheck,
  UserX,
  PlusCircle,
  MinusCircle,
  ExternalLink,
  Crown,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';
import { ReviewerProfile, ReviewerAccountStatus } from '../../types';

export const ReviewerDirectory: React.FC = () => {
  const {
    reviewerDirectoryList,
    language,
    adminVerifyReviewerNid,
    adminUpdateReviewerStatus,
    adminAdjustTrustScore,
    adminToggleAmbassadorStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReviewer, setSelectedReviewer] = useState<ReviewerProfile | null>(null);
  const [trustScoreDelta, setTrustScoreDelta] = useState<number>(5);
  const [trustScoreReason, setTrustScoreReason] = useState<string>('Exemplary video testing quality');
  const [statusNote, setStatusNote] = useState<string>('');

  const filterChips = [
    { id: 'all', label: language === 'bn' ? 'সকল রিভিউয়ার' : 'All Reviewers', count: reviewerDirectoryList.length },
    { id: 'verified', label: language === 'bn' ? 'ভেরিফায়েড' : 'Verified', count: reviewerDirectoryList.filter(r => r.verificationStatus === 'verified').length },
    { id: 'pending', label: language === 'bn' ? 'আবেদন অপেক্ষমাণ' : 'Pending Review', count: reviewerDirectoryList.filter(r => r.verificationStatus === 'under_review' || r.verificationStatus === 'pending_submission').length },
    { id: 'pro_elite', label: language === 'bn' ? 'প্রো ও এলিট' : 'Pro & Elite', count: reviewerDirectoryList.filter(r => r.levelId === 'pro' || r.levelId === 'elite').length },
    { id: 'active_deliveries', label: language === 'bn' ? 'সক্রিয় পার্সেল' : 'Active Deliveries', count: reviewerDirectoryList.filter(r => (r.activeDeliveriesCount || 0) > 0).length },
    { id: 'returns_pending', label: language === 'bn' ? 'রিটার্ন অপেক্ষমাণ' : 'Returns Pending', count: reviewerDirectoryList.filter(r => (r.pendingReturnsCount || 0) > 0).length },
    { id: 'flagged', label: language === 'bn' ? 'সতর্কতা / ঝুঁকি' : 'Restricted / Risk', count: reviewerDirectoryList.filter(r => r.accountStatus === 'warning' || r.accountStatus === 'restricted' || r.accountStatus === 'suspended').length },
  ];

  const filteredReviewers = reviewerDirectoryList.filter((r) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) {
      if (filterStatus === 'verified') return r.verificationStatus === 'verified';
      if (filterStatus === 'pending') return r.verificationStatus === 'under_review' || r.verificationStatus === 'pending_submission';
      if (filterStatus === 'pro_elite') return r.levelId === 'pro' || r.levelId === 'elite';
      if (filterStatus === 'active_deliveries') return (r.activeDeliveriesCount || 0) > 0;
      if (filterStatus === 'returns_pending') return (r.pendingReturnsCount || 0) > 0;
      if (filterStatus === 'flagged') return r.accountStatus === 'warning' || r.accountStatus === 'restricted' || r.accountStatus === 'suspended';
      return true;
    }

    const fName = (r.fullName || '').toLowerCase();
    const rCode = (r.reviewerCode || r.reviewerId || '').toLowerCase();
    const rId = (r.id || '').toLowerCase();
    const dist = (r.district || r.deliveryAddress?.district || '').toLowerCase();
    const email = (r.email || '').toLowerCase();
    const matchesBrand = Boolean(r.assignedBrands && r.assignedBrands.some(b => (b || '').toLowerCase().includes(q)));

    const matchesSearch =
      fName.includes(q) ||
      rCode.includes(q) ||
      rId.includes(q) ||
      dist.includes(q) ||
      email.includes(q) ||
      matchesBrand;

    if (!matchesSearch) return false;

    if (filterStatus === 'verified') return r.verificationStatus === 'verified';
    if (filterStatus === 'pending') return r.verificationStatus === 'under_review' || r.verificationStatus === 'pending_submission';
    if (filterStatus === 'pro_elite') return r.levelId === 'pro' || r.levelId === 'elite';
    if (filterStatus === 'active_deliveries') return (r.activeDeliveriesCount || 0) > 0;
    if (filterStatus === 'returns_pending') return (r.pendingReturnsCount || 0) > 0;
    if (filterStatus === 'flagged') return r.accountStatus === 'warning' || r.accountStatus === 'restricted' || r.accountStatus === 'suspended';

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            {language === 'bn' ? 'রিভিউয়ার ডিরেক্টরি (Reviewer Directory)' : 'Reviewer Directory & Talent Network'}
          </h3>
          <p className="text-xs text-white/50">
            {language === 'bn'
              ? 'প্ল্যাটফর্মের সকল সক্রিয় ও যাচাইকৃত রিভিউয়ারের সার্বিক পারফরম্যান্স, ট্রাস্ট স্কোর এবং অ্যাসাইনমেন্ট ডেটা'
              : 'Complete view of all registered product testers, trust metrics, assignments, and logistics'}
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'নাম, আইডি, ব্র্যান্ড বা জেলা দিয়ে খুঁজুন...' : 'Search by name, ID, brand, district...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilterStatus(chip.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === chip.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            <span>{chip.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterStatus === chip.id ? 'bg-black/20 text-slate-950 font-black' : 'bg-white/10 text-white/60'}`}>
              {chip.count}
            </span>
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{language === 'bn' ? 'রিভিউয়ার ও আইডি' : 'Reviewer & ID'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ভেরিফিকেশন' : 'Status'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'লেভেল' : 'Level'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ট্রাস্ট স্কোর' : 'Trust Score'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'রেটিং' : 'Rating'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'রিভিউ ও সক্রিয়' : 'Reviews / Active'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'অ্যাসাইনড ব্র্যান্ড ও পণ্য' : 'Assigned Brands'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ডেলিভারি স্ট্যাটাস' : 'Delivery Status'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'মোট আয়' : 'Total Earnings'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredReviewers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-white/40">
                    {language === 'bn' ? 'কোনো রিভিউয়ার পাওয়া যায়নি।' : 'No reviewers found matching criteria.'}
                  </td>
                </tr>
              ) : (
                filteredReviewers.map((reviewer) => {
                  const isVerified = reviewer.verificationStatus === 'verified';
                  const trustColor =
                    reviewer.trustScore >= 90
                      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                      : reviewer.trustScore >= 75
                      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

                  return (
                    <tr
                      key={reviewer.id}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => setSelectedReviewer(reviewer)}
                    >
                      {/* Reviewer Photo & Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={reviewer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                              alt={reviewer.fullName}
                              className="w-10 h-10 rounded-xl object-cover border border-white/10 ring-2 ring-emerald-500/20"
                            />
                            {isVerified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 text-[10px] font-black shadow">
                                ✓
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                              {reviewer.fullName}
                              {reviewer.isAmbassador && (
                                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                              )}
                            </div>
                            <div className="text-[11px] text-white/40 font-mono flex items-center gap-1">
                              <span>{reviewer.reviewerCode || reviewer.id}</span>
                              <span>•</span>
                              <span>{reviewer.district}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Verification Status Badge */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                            isVerified
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : reviewer.verificationStatus === 'under_review'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : reviewer.verificationStatus === 'resubmission_required'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {isVerified ? 'Verified' : reviewer.verificationStatus.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-3">
                        <span className="capitalize font-bold text-white/90">
                          {reviewer.levelId}
                        </span>
                      </td>

                      {/* Trust Score */}
                      <td className="py-3.5 px-3">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border font-mono font-bold text-xs ${trustColor}`}>
                          <Shield className="w-3 h-3" />
                          <span>{reviewer.trustScore}</span>
                        </div>
                      </td>

                      {/* Average Rating */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{reviewer.averageRating || 4.9}</span>
                        </div>
                      </td>

                      {/* Reviews & Active Assignments */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">
                          {reviewer.completedReviewsCount || 0} {language === 'bn' ? 'সম্পন্ন' : 'done'}
                        </div>
                        <div className="text-[10px] text-emerald-400">
                          {reviewer.activeAssignmentsCount || 0} {language === 'bn' ? 'চলমান' : 'active'}
                        </div>
                      </td>

                      {/* Assigned Brands */}
                      <td className="py-3.5 px-3">
                        <div className="max-w-[160px] truncate text-white/80 font-medium">
                          {reviewer.assignedBrands && reviewer.assignedBrands.length > 0
                            ? reviewer.assignedBrands.join(', ')
                            : (language === 'bn' ? 'কোনো ব্র্যান্ড নেই' : 'None yet')}
                        </div>
                        {reviewer.currentCampaignName && (
                          <div className="text-[10px] text-white/40 truncate max-w-[160px]">
                            {reviewer.currentCampaignName}
                          </div>
                        )}
                      </td>

                      {/* Delivery Status */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-sky-400 font-medium text-[11px]">
                          <Truck className="w-3 h-3" />
                          <span className="capitalize">{reviewer.latestDeliveryStatus ? reviewer.latestDeliveryStatus.replace('_', ' ') : 'Delivered'}</span>
                        </span>
                      </td>

                      {/* Total Earnings */}
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        {formatBdt(reviewer.totalEarningsBdt || 0, language)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReviewer(reviewer);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-slate-950 text-white/80 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'বিস্তারিত' : 'View 360°'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviewer 360 Profile Drawer / Modal */}
      {selectedReviewer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <img
                  src={selectedReviewer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={selectedReviewer.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{selectedReviewer.fullName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      {selectedReviewer.levelId}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 font-mono mt-0.5">
                    ID: {selectedReviewer.reviewerCode || selectedReviewer.id} • Joined {selectedReviewer.joinedDate || '2025'} • {selectedReviewer.district}, Bangladesh
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReviewer(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-white/50 block">{language === 'bn' ? 'ট্রাস্ট স্কোর' : 'Trust Score'}</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{selectedReviewer.trustScore} / 100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-white/50 block">{language === 'bn' ? 'গড় কোয়ালিটি রেটিং' : 'Average Rating'}</span>
                <span className="text-xl font-black text-amber-400 font-mono flex items-center gap-1">
                  ⭐ {selectedReviewer.averageRating || 4.9}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-white/50 block">{language === 'bn' ? 'অন-টাইম কমপ্লিশন' : 'On-Time Rate'}</span>
                <span className="text-xl font-black text-sky-400 font-mono">98.5%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-white/50 block">{language === 'bn' ? 'মোট উপার্জন' : 'Total Earnings'}</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{formatBdt(selectedReviewer.totalEarningsBdt || 0, language)}</span>
              </div>
            </div>

            {/* Contact & Verification Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  {language === 'bn' ? 'ব্যক্তিগত ও যোগাযোগ তথ্য' : 'Personal & Contact Info'}
                </h4>
                <div className="space-y-1.5 text-xs text-white/80">
                  <div className="flex justify-between">
                    <span className="text-white/40">{language === 'bn' ? 'ইমেইল:' : 'Email:'}</span>
                    <span className="font-mono">{selectedReviewer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">{language === 'bn' ? 'ফোন নম্বর:' : 'Phone:'}</span>
                    <span className="font-mono">{selectedReviewer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">{language === 'bn' ? 'জাতীয় পরিচয়পত্র (NID):' : 'NID Number:'}</span>
                    <span className="font-mono">{selectedReviewer.nidNumber || '19942691028300049'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">{language === 'bn' ? 'কুরিয়ার ঠিকানা:' : 'Shipping Address:'}</span>
                    <span className="text-right truncate max-w-[200px]">{selectedReviewer.shippingAddress?.fullAddress || 'Dhanmondi, Dhaka'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-400" />
                  {language === 'bn' ? 'ট্রাস্ট স্কোর ব্রেকডাউন' : 'Trust Score Dimensions'}
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/70">Video Quality & Honesty</span>
                      <span className="text-emerald-400 font-bold font-mono">96%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/70">Deadline Compliance</span>
                      <span className="text-sky-400 font-bold font-mono">98%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/70">Return Parcel Integrity</span>
                      <span className="text-amber-400 font-bold font-mono">100%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand & Assignment Relationships */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-400" />
                {language === 'bn' ? 'ব্র্যান্ড ও অ্যাসাইনমেন্ট ইতিহাস' : 'Brand & Assignment History'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-bold text-white">Aura Naturals BD Official</div>
                  <div className="text-[11px] text-white/50">Royal Oudh & Amber Attar 12ml • Testing In Progress</div>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">ST-94827104</span>
                    <span className="text-white/40">Delivered on Nov 5</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-bold text-white">Zenith Tech Wear Store</div>
                  <div className="text-[11px] text-white/50">Zenith Pulse Pro Smartwatch • Revision Requested</div>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">RT-82719011</span>
                    <span className="text-amber-400">Return Required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Management Controls */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                {language === 'bn' ? 'অ্যাডমিন মডারেশন অ্যাকশন' : 'Admin Moderation & Governance Controls'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Adjust Trust Score */}
                <div className="space-y-2">
                  <label className="text-xs text-white/70 block font-semibold">
                    {language === 'bn' ? 'ট্রাস্ট স্কোর পরিবর্তন করুন (+ / -):' : 'Adjust Trust Score Points:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adminAdjustTrustScore(selectedReviewer.id, -5, 'Admin manual penalty')}
                      className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <MinusCircle className="w-4 h-4" /> -5 Pts
                    </button>
                    <button
                      onClick={() => adminAdjustTrustScore(selectedReviewer.id, 5, 'Admin manual reward')}
                      className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <PlusCircle className="w-4 h-4" /> +5 Pts
                    </button>
                    <button
                      onClick={() => adminAdjustTrustScore(selectedReviewer.id, 10, 'Outstanding video QA')}
                      className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <PlusCircle className="w-4 h-4" /> +10 Pts
                    </button>
                  </div>
                </div>

                {/* Account Status / Ambassador */}
                <div className="space-y-2">
                  <label className="text-xs text-white/70 block font-semibold">
                    {language === 'bn' ? 'অ্যাকাউন্ট স্ট্যাটাস ও রোল:' : 'Account Status & Ambassador:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adminToggleAmbassadorStatus(selectedReviewer.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        selectedReviewer.isAmbassador
                          ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <Crown className="w-4 h-4" />
                      {selectedReviewer.isAmbassador ? 'Ambassador Active' : 'Grant Ambassador'}
                    </button>

                    <button
                      onClick={() => adminVerifyReviewerNid(selectedReviewer.id, true)}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Verify NID
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReviewer(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close Drawer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
