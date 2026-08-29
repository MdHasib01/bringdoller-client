import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentStatus } from '../../types';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Truck,
  Video,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Send,
  AlertCircle,
  FileText,
  Star,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Eye,
  CheckSquare,
  Square,
  Info,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';
import { StatusChip } from '../common/StatusChip';
import { VideoRecorder } from '../common/VideoRecorder';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';
import { CampaignDetailModal } from '../common/CampaignDetailModal';

export const ReviewerTaskWorkspace: React.FC = () => {
  const {
    assignments,
    campaigns,
    confirmProductReceived,
    startTesting,
    submitAssignmentReview,
    resubmitAssignmentReview,
    raiseDispute,
    language,
    addToast,
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    assignments[0]?.id || ''
  );

  const selectedTask = assignments.find((a) => a.id === selectedTaskId) || assignments[0];
  const relatedCampaign = campaigns.find((c) => c.id === selectedTask?.campaignId);

  // Submission form state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [writtenReview, setWrittenReview] = useState('');
  const [pros, setPros] = useState<string[]>([
    'দীর্ঘস্থায়ী ও আকর্ষণীয় সুবাস (৮ ঘণ্টা+)',
    'প্রিমিয়াম গ্লাস বটল ও নিখুঁত স্প্রে নোজল',
  ]);
  const [newPro, setNewPro] = useState('');
  const [cons, setCons] = useState<string[]>(['প্রথম ৫ মিনিট সুবাস কিছুটা কড়া লাগে']);
  const [newCon, setNewCon] = useState('');
  const [rating, setRating] = useState(4);
  const [disclosureAgreed, setDisclosureAgreed] = useState(true);

  // Interactive Pre-submission Checklist items
  const [checkFollowedDos, setCheckFollowedDos] = useState(true);
  const [checkAvoidedDonts, setCheckAvoidedDonts] = useState(true);
  const [checkFullTestingPeriod, setCheckFullTestingPeriod] = useState(true);
  const [checkAuthenticProsCons, setCheckAuthenticProsCons] = useState(true);

  // Dispute modal state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  // Brief modal state
  const [showBriefModal, setShowBriefModal] = useState(false);

  // Re-acknowledgement modal for brief update
  const [showReAckModal, setShowReAckModal] = useState(false);
  const [hasReAcknowledged, setHasReAcknowledged] = useState(true);

  if (!selectedTask) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <Package className="w-12 h-12 mx-auto mb-3 text-slate-600" />
        <h3 className="text-base font-bold text-white mb-1">
          {language === 'bn' ? 'কোনো সক্রিয় টাস্ক পাওয়া যায়নি' : 'No active tasks found'}
        </h3>
        <p className="text-xs">
          {language === 'bn' ? 'হোমপেজ থেকে নতুন ক্যাম্পেইনে আবেদন করে প্রোডাক্ট টেস্টিং শুরু করুন।' : 'Apply to campaigns from Home to start testing.'}
        </p>
      </div>
    );
  }

  const handleAddPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const handleAddCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const isPreSubmissionChecklistComplete =
    checkFollowedDos &&
    checkAvoidedDonts &&
    checkFullTestingPeriod &&
    checkAuthenticProsCons &&
    disclosureAgreed &&
    cons.length >= 1 &&
    Boolean(videoUrl);

  const handleSubmitReview = () => {
    if (!videoUrl) {
      addToast('Video Required', language === 'bn' ? 'অনুগ্রহ করে রিভিউ ভিডিও রেকর্ড বা আপলোড করুন।' : 'Please record or upload a review video.', 'error');
      return;
    }
    if (cons.length === 0) {
      addToast('Authenticity Policy', language === 'bn' ? 'সততা নীতি অনুযায়ী অন্তত ১টি সীমাবদ্ধতা বা দুর্বলতা উল্লেখ করা বাধ্যতামূলক।' : 'Must mention at least 1 limitation or con.', 'error');
      return;
    }
    if (!disclosureAgreed) {
      addToast('Disclosure Required', language === 'bn' ? 'ডিসক্লোজার নীতিতে সম্মতি দেওয়া আবশ্যক।' : 'You must agree to the honest review disclosure.', 'error');
      return;
    }

    if (selectedTask.status === 'revision_requested') {
      resubmitAssignmentReview(selectedTask.id, {
        videoUrl,
        writtenReview,
        pros,
        cons,
        rating,
      });
      addToast('Revised Review Submitted', 'Your updated review has been submitted for verification.', 'success');
    } else {
      submitAssignmentReview(selectedTask.id, {
        videoUrl,
        writtenReview,
        pros,
        cons,
        rating,
      });
      addToast('Review Submitted', 'Your review has been submitted to Escrow QA & Brand.', 'success');
    }
  };

  const handleConfirmDispute = () => {
    if (!disputeReason.trim()) return;
    raiseDispute(selectedTask.id, disputeReason);
    setShowDisputeModal(false);
    setDisputeReason('');
    addToast('Dispute Submitted', 'BringDollar arbitration team will review within 24 hours.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 pb-28 sm:pb-32 space-y-6 text-slate-100">
      
      {/* Top Header & Task Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg sm:text-xl font-extrabold text-white">
              {language === 'bn' ? 'টাস্ক ওয়ার্কস্পেস ও সাবমিশন' : 'Reviewer Task Workspace'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn' ? 'প্রোডাক্ট ট্র্যাকিং, টেস্টিং প্রগ্রেস ও সৎ রিভিউ সাবমিশন হাব' : 'Manage active assignments, test protocols, and escrow submissions'}
          </p>
        </div>

        {/* Task selector if multiple */}
        {assignments.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Switch Task:</span>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.productName} ({a.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Brief Version Update Alert Banner */}
      {selectedTask.briefVersionAccepted !== 'v1.0' && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">
                {language === 'bn' ? 'ক্যাম্পেইন নির্দেশিকা আপডেট হয়েছে' : 'Campaign Brief Updated by Brand'}
              </span>
              <p className="text-amber-200 text-[11px] mt-0.5">
                {language === 'bn'
                  ? 'ব্র্যান্ড সম্প্রতি নির্দেশনায় নতুন পয়েন্ট যুক্ত করেছে। সাবমিট করার আগে নতুন ব্রিফটি দেখে নিন।'
                  : 'The brand has updated instructions. Please view and acknowledge the latest guidelines.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBriefModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold whitespace-nowrap shadow-md hover:bg-amber-400"
          >
            {language === 'bn' ? 'নতুন ব্রিফ দেখুন' : 'View Updated Brief'}
          </button>
        </div>
      )}

      {/* Task Overview Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={selectedTask.productImageUrl}
              alt={selectedTask.productName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0 bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                  {selectedTask.brandName}
                </span>
                <StatusChip status={selectedTask.status} lang={language} size="sm" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{selectedTask.productName}</h3>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{language === 'bn' ? 'পেআউট:' : 'Payout:'}</span>
                <strong className="text-emerald-400 font-mono font-bold">{formatBdt(selectedTask.payoutBdt, language)}</strong>
                <span>•</span>
                <span className="text-amber-400 font-mono font-bold">+{selectedTask.careerXp} XP</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-xs">
            <span className="text-slate-400">{language === 'bn' ? 'সাবমিশন ডেডলাইন' : 'Deadline'}</span>
            <span className="font-bold text-white font-mono">{selectedTask.deadline}</span>
          </div>
        </div>

        {/* Task Lifecycle Actions / Progress Steps */}
        <div>
          {/* Step: Product Dispatched */}
          {selectedTask.status === 'product_dispatched' && (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {language === 'bn' ? 'কুরিয়ারে প্রোডাক্ট পাঠানো হয়েছে' : 'Product Dispatched by Courier'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {language === 'bn' ? 'ট্র্যাকিং কোড:' : 'Tracking Code:'}{' '}
                    <span className="font-mono text-cyan-300 font-bold">{selectedTask.deliveryTrackingCode || 'STEADFAST-99420'}</span> (Steadfast Courier)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  confirmProductReceived(selectedTask.id);
                  addToast('Received', 'Product marked as received. Start testing!', 'success');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'পণ্য হাতে পেয়েছি' : 'Confirm Received'}</span>
              </button>
            </div>
          )}

          {/* Step: Product Received -> Ready to Start Testing */}
          {selectedTask.status === 'product_received' && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {language === 'bn' ? 'প্রোডাক্ট রিসিভড - এবার টেস্টিং শুরু করুন' : 'Product Received - Ready to Start Testing'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {language === 'bn'
                      ? 'সঠিক মূল্যায়নের জন্য অনুগ্রহ করে নির্দেশিত দিন নিয়মিত ব্যবহার করুন।'
                      : 'Please test the product regularly for the required duration before recording.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  startTesting(selectedTask.id);
                  addToast('Testing Started', 'Testing countdown is now active.', 'info');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>{language === 'bn' ? 'টেস্টিং কাউন্টডাউন শুরু' : 'Start Testing Countdown'}</span>
              </button>
            </div>
          )}

          {/* Step: Revision Requested Banner */}
          {selectedTask.status === 'revision_requested' && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {language === 'bn' ? 'সংশোধন অনুরোধ (Revision Requested)' : 'Revision Requested by Brand'}
                    </h4>
                    <span className="text-[10px] text-rose-300 font-mono">
                      {selectedTask.revisionCount}/2 {language === 'bn' ? 'টি অনুরোধ' : 'revisions'}
                    </span>
                  </div>
                  <p className="text-xs text-rose-200 mt-1 leading-relaxed bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/60 font-medium">
                    "{selectedTask.revisionFeedback || 'ভিডিওর শেষ অংশে আতরের স্থায়িত্ব নিয়ে আপনার নিজস্ব অভিজ্ঞতার সারাংশ স্পষ্ট শোনা যায়নি। অনুগ্রহ করে স্পষ্ট অডিও সহ পুনরায় সাবমিট করুন।'}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(true)}
                  className="text-rose-300 hover:underline font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'অনুরোধটি অযৌক্তিক মনে হলে ডিসপিউট তুলুন' : 'Raise Dispute with Admin'}</span>
                </button>
                <span className="text-slate-400 text-[11px]">
                  {language === 'bn' ? 'সংশোধিত ভিডিও নিচে রেকর্ড/আপলোড করুন' : 'Submit revised video below'}
                </span>
              </div>
            </div>
          )}

          {/* Step: Approved & Paid */}
          {selectedTask.status === 'approved' && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {language === 'bn' ? 'রিভিউ অনুমোদিত ও পেমেন্ট রিলিজড! ✨' : 'Review Approved & Payment Released!'}
                  </h4>
                  <p className="text-xs text-emerald-300">
                    {formatBdt(selectedTask.payoutBdt, language)} {language === 'bn' ? 'সরাসরি আপনার ওয়ালেটে জমা হয়েছে।' : 'credited to your wallet.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick link to view full campaign 6-tab modal */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {language === 'bn' ? 'ক্যাম্পেইন ব্রিফ ভার্সন:' : 'Brief Version:'}{' '}
            <strong className="text-emerald-400 font-mono">{selectedTask.briefVersionAccepted || 'v1.0'}</strong>
          </span>
          <button
            type="button"
            onClick={() => setShowBriefModal(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সম্পূর্ণ ক্যাম্পেইন ব্রিফ ও নির্দেশিকা দেখুন' : 'View Full 6-Tab Brief & Rules'}</span>
          </button>
        </div>
      </div>

      {/* Video Recorder Studio */}
      <VideoRecorder
        lang={language}
        productContextName={selectedTask.productName}
        minDurationSeconds={60}
        maxDurationSeconds={180}
        onRecorded={(url) => {
          setVideoUrl(url);
          addToast('Video Attached', 'Review video file attached successfully.', 'success');
        }}
      />

      {/* Written Review & Pros/Cons Input Form */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
        <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>{language === 'bn' ? 'রিভিউ ও রেটিং বিবরণ' : 'Review Details & Honest Evaluation'}</span>
        </h3>

        {/* Rating Stars */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {language === 'bn' ? 'আপনার সামগ্রিক রেটিং' : 'Overall Product Rating'}
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-300 ml-2 font-mono">
              {rating}.0 / 5.0
            </span>
          </div>
        </div>

        {/* Pros & Cons Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pros */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-emerald-400 block">
              👍 {language === 'bn' ? 'ভালো দিকসমূহ (Pros)' : 'Pros / Highlights'}
            </span>
            <div className="space-y-1.5">
              {pros.map((p, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span>• {p}</span>
                  <button
                    type="button"
                    onClick={() => setPros(pros.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400 text-xs ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPro}
                onChange={(e) => setNewPro(e.target.value)}
                placeholder={language === 'bn' ? 'নতুন সুবিধা যোগ করুন...' : 'Add a pro...'}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPro}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Cons (Mandatory) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 block">
                👎 {language === 'bn' ? 'সীমাবদ্ধতা / দুর্বলতা (Cons)' : 'Cons / Limitations'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                {language === 'bn' ? 'অন্তত ১টি বাধ্যতামূলক' : '1 Mandatory'}
              </span>
            </div>
            <div className="space-y-1.5">
              {cons.map((c, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span>• {c}</span>
                  <button
                    type="button"
                    onClick={() => setCons(cons.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400 text-xs ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCon}
                onChange={(e) => setNewCon(e.target.value)}
                placeholder={language === 'bn' ? 'বাস্তব দুর্বলতা লিখুন...' : 'Add a con...'}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-rose-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCon}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {language === 'bn' ? 'বিস্তারিত লিখিত অভিজ্ঞতা' : 'Written Experience Summary'}
          </label>
          <textarea
            rows={3}
            value={writtenReview}
            onChange={(e) => setWrittenReview(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:border-emerald-500 focus:outline-none"
            placeholder={language === 'bn' ? 'ব্যবহারের অনুভূতি, পণ্যের গুণমান, সুবাস কতক্ষণ থাকে ইত্যাদি বিস্তারিত লিখুন...' : 'Write your full testing review...'}
          />
        </div>

        {/* Mandatory Pre-Submission Compliance Checklist */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'সাবমিশন পূর্ববর্তী যাচাই তালিকা (Pre-Submission Checklist)' : 'Mandatory Pre-Submission Checklist'}</span>
          </span>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={checkFollowedDos}
                onChange={(e) => setCheckFollowedDos(e.target.checked)}
                className="rounded text-emerald-500 bg-slate-900 border-slate-700"
              />
              <span>{language === 'bn' ? 'আমি ক্যাম্পেইনের সকল বাধ্যতামূলক Do’s পয়েন্ট মেনে চলেছি' : 'I have incorporated all mandatory campaign DO points'}</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={checkAvoidedDonts}
                onChange={(e) => setCheckAvoidedDonts(e.target.checked)}
                className="rounded text-emerald-500 bg-slate-900 border-slate-700"
              />
              <span>{language === 'bn' ? 'আমি কোনো নিষিদ্ধ Don’ts (যেমন: মিথ্যা দাবি বা অন্য ব্র্যান্ডের অবমূল্যায়ন) করিনি' : 'I have strictly avoided all prohibited DONTs (unrealistic claims)'}</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={checkFullTestingPeriod}
                onChange={(e) => setCheckFullTestingPeriod(e.target.checked)}
                className="rounded text-emerald-500 bg-slate-900 border-slate-700"
              />
              <span>{language === 'bn' ? 'আমি পর্যাপ্ত সময় পণ্যটি বাস্তব জীবনে ব্যবহার করে টেস্ট করেছি' : 'I tested the product thoroughly for the prescribed duration'}</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={disclosureAgreed}
                onChange={(e) => setDisclosureAgreed(e.target.checked)}
                className="rounded text-emerald-500 bg-slate-900 border-slate-700"
              />
              <span>{language === 'bn' ? 'BringDollar নিরপেক্ষ কনজিউমার টেস্টিং ডিসক্লোজার নিশ্চিত করছি' : 'BringDollar authentic consumer disclosure verified'}</span>
            </label>
          </div>
        </div>

        {/* Submit Review Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            {isPreSubmissionChecklistComplete ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All checks passed
              </span>
            ) : (
              <span className="text-amber-400">
                {language === 'bn' ? 'সাবমিট করতে ভিডিও এবং সব চেকমার্ক পূরণ করুন' : 'Attach video & complete all checklist items to submit'}
              </span>
            )}
          </span>

          <button
            type="button"
            disabled={!isPreSubmissionChecklistComplete}
            onClick={handleSubmitReview}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>
              {selectedTask.status === 'revision_requested'
                ? language === 'bn' ? 'সংশোধিত রিভিউ পুনরায় জমা দিন' : 'Resubmit Revised Review'
                : language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Honest Review'}
            </span>
          </button>
        </div>
      </div>

      {/* Raise Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'অ্যাডমিন আরবিট্রেশন ও ডিসপিউট' : 'Raise Dispute with Admin'}
                </h3>
              </div>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'ব্র্যান্ড যদি সৎ সমালোচনা মুছে ফেলতে চাপ দেয় বা নীতিবহির্ভূত সংশোধন চায়, তবে বিস্তারিত লিখুন। প্ল্যাটফর্ম অ্যাডমিন নিরপেক্ষভাবে সিদ্ধান্ত নেবে।'
                : 'If the brand is asking you to remove genuine criticism or violating terms, submit your dispute for admin review.'}
            </p>

            <textarea
              rows={4}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-rose-500 focus:outline-none"
              placeholder={language === 'bn' ? 'ডিসপিউটের স্পষ্ট কারণ ও ব্র্যান্ডের বার্তা উল্লেখ করুন...' : 'Describe why this revision is unfair...'}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDispute}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                {language === 'bn' ? 'ডিসপিউট সাবমিট করুন' : 'Submit Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail Brief Modal */}
      {showBriefModal && relatedCampaign && (
        <CampaignDetailModal
          campaign={relatedCampaign}
          isOpen={showBriefModal}
          onClose={() => setShowBriefModal(false)}
          onApply={() => {
            setShowBriefModal(false);
            setHasReAcknowledged(true);
            addToast('Brief Acknowledged', 'You have re-acknowledged the updated campaign guidelines.', 'success');
          }}
          readOnly={true}
        />
      )}
    </div>
  );
};
