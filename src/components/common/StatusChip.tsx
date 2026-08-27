import React from 'react';
import { VerificationStatus, AssignmentStatus, Language } from '../../types';

interface StatusChipProps {
  status: VerificationStatus | AssignmentStatus | string;
  lang?: Language;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, lang = 'bn', size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      // Verification Statuses
      case 'verified':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          labelBn: 'ভেরিফাইড',
          labelEn: 'Verified',
        };
      case 'under_review':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400 animate-pulse',
          labelBn: 'পর্যালোচনাধীন',
          labelEn: 'Under Review',
        };
      case 'rejected':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400',
          labelBn: 'বাতিলকৃত',
          labelEn: 'Rejected',
        };
      case 'resubmission_required':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
          dot: 'bg-purple-400',
          labelBn: 'পুনরায় সাবমিশন প্রয়োজন',
          labelEn: 'Resubmit Required',
        };
      case 'not_submitted':
        return {
          bg: 'bg-slate-700/30 border-slate-600/30 text-slate-400',
          dot: 'bg-slate-400',
          labelBn: 'অসম্পূর্ণ',
          labelEn: 'Not Submitted',
        };

      // Assignment / Task Statuses
      case 'assigned':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
          dot: 'bg-blue-400',
          labelBn: 'টাস্ক অর্পিত',
          labelEn: 'Assigned',
        };
      case 'product_preparing':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          labelBn: 'প্রোডাক্ট প্রস্তুত হচ্ছে',
          labelEn: 'Preparing Product',
        };
      case 'product_dispatched':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          dot: 'bg-cyan-400',
          labelBn: 'কুরিয়ারে পাঠানো হয়েছে',
          labelEn: 'Dispatched',
        };
      case 'product_received':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
          dot: 'bg-indigo-400',
          labelBn: 'প্রোডাক্ট রিসিভড',
          labelEn: 'Product Received',
        };
      case 'testing_started':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400 animate-ping',
          labelBn: 'টেস্টিং চলছে ⏱️',
          labelEn: 'Testing in Progress',
        };
      case 'submitted':
      case 'under_quality_review':
        return {
          bg: 'bg-violet-500/15 border-violet-500/40 text-violet-300',
          dot: 'bg-violet-400 animate-pulse',
          labelBn: 'কোয়ালিটি রিভিউ চলছে',
          labelEn: 'Under QA Review',
        };
      case 'revision_requested':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          dot: 'bg-rose-400 animate-pulse',
          labelBn: 'সংশোধন প্রয়োজন ⚠️',
          labelEn: 'Revision Requested',
        };
      case 'approved':
      case 'payment_released':
        return {
          bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          labelBn: 'অনুমোদিত ও পেইড ✨',
          labelEn: 'Approved & Paid',
        };
      case 'return_pending':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          labelBn: 'রিটার্ন অপেক্ষমাণ 📦',
          labelEn: 'Return Pending',
        };
      case 'return_completed':
      case 'closed':
        return {
          bg: 'bg-slate-700/40 border-slate-600/40 text-slate-300',
          dot: 'bg-slate-400',
          labelBn: 'সম্পন্ন ও বন্ধ',
          labelEn: 'Closed & Completed',
        };

      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          dot: 'bg-slate-400',
          labelBn: status,
          labelEn: status,
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span className="whitespace-nowrap">{lang === 'bn' ? config.labelBn : config.labelEn}</span>
    </span>
  );
};
