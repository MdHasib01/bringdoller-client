import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  Wallet,
  Building,
  Smartphone,
  ShieldCheck,
  Download,
  Filter,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { formatBdt, toBengaliDigits, formatRelativeTime } from '../../utils/formatters';
import { FallingDollarsCanvas } from './wallet/FallingDollarsCanvas';
import { AnimatedBalanceCounter } from './wallet/AnimatedBalanceCounter';
import { PaymentCelebrationModal, PaymentCelebrationData } from './wallet/PaymentCelebrationModal';
import { soundManager } from '../../utils/soundEffects';

export const ReviewerWallet: React.FC = () => {
  const {
    reviewerProfile,
    transactions,
    withdrawFunds,
    language,
    assignments,
    addToast,
  } = useApp();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [accountNumber, setAccountNumber] = useState(reviewerProfile.payoutMethod?.accountNumber || '01712345678');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(3000);

  // Sound preference state
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundManager.muted);

  // Payment Celebration Modal state
  const [celebrationData, setCelebrationData] = useState<PaymentCelebrationData | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Tracks if the initial visit animation has run for this session/component
  const hasTriggeredVisitAnim = useRef<boolean>(false);
  const [visitAnimPhase, setVisitAnimPhase] = useState<'active' | 'ambient'>('active');

  useEffect(() => {
    if (!hasTriggeredVisitAnim.current) {
      hasTriggeredVisitAnim.current = true;
      // Play soft initial coin chime if sound is enabled
      soundManager.playCoinDrop();
      
      const timer = setTimeout(() => {
        setVisitAnimPhase('ambient');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleSound = () => {
    const nextState = !isSoundMuted;
    soundManager.muted = nextState;
    setIsSoundMuted(nextState);
    if (!nextState) {
      soundManager.playCoinDrop();
    }
  };

  const availableBalance = transactions
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => {
      if (t.type === 'task_earning' || t.type === 'ambassador_payout') return acc + t.amountBdt;
      if (t.type === 'withdrawal') return acc - t.amountBdt;
      return acc;
    }, 0);

  const pendingEscrow = assignments
    .filter((a) => a.status !== 'approved' && a.status !== 'closed')
    .reduce((acc, a) => acc + a.payoutBdt, 0);

  const totalEarnedLifetime = transactions
    .filter((t) => (t.type === 'task_earning' || t.type === 'ambassador_payout') && t.status === 'completed')
    .reduce((acc, t) => acc + t.amountBdt, 0);

  const handleConfirmWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > availableBalance) {
      alert(language === 'bn' ? 'পর্যাপ্ত ব্যালেন্স নেই।' : 'Insufficient available balance.');
      return;
    }
    if (withdrawAmount < 500) {
      alert(language === 'bn' ? 'সর্বনিম্ন উত্তোলনের পরিমাণ ৫০০ টাকা।' : 'Minimum withdrawal amount is ৳500.');
      return;
    }
    withdrawFunds(withdrawAmount, withdrawMethod, accountNumber);
    setShowWithdrawModal(false);
  };

  // Trigger test payment celebration
  const triggerTestCelebration = () => {
    setCelebrationData({
      amount: 1500,
      campaignTitle: language === 'bn' ? 'প্রিমিয়াম কাশ্মিরী স্যাফরন আতর রিভিউ' : 'Premium Saffron Attar Video Review',
      storeName: 'Al-Haramain Perfumes BD',
      productName: 'Organic Royal Oudh Attar (12ml)',
      transactionId: `TX-REL-${Date.now().toString().slice(-6)}`,
      careerXp: 80,
      rewardCoins: 50,
    });
    setIsCelebrating(true);
  };

  return (
    <div className="relative min-h-[85vh] overflow-hidden">
      {/* 1. Background Layer Falling Dollars Canvas (Moves behind cards to create 3D depth) */}
      <FallingDollarsCanvas
        intensity={visitAnimPhase === 'active' ? 'normal' : 'ambient'}
        layer="background"
        className="z-0 opacity-80"
      />

      <div className="max-w-4xl mx-auto px-4 py-6 pb-28 sm:pb-32 space-y-6 relative z-10">
        {/* Header with Sound & Celebration Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>{language === 'bn' ? 'উপার্জন ও ওয়ালেট' : 'Earnings & Wallet'}</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                24/7 Escrow
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/50 mt-0.5">
              {language === 'bn'
                ? 'নিরাপদ এস্ক্রো পেমেন্ট ও বিকাশ/নগদে সরাসরি তাত্ক্ষণিক উত্তোলন'
                : 'Secure escrow payouts via bKash & Nagad instant disbursement'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSound}
              title={isSoundMuted ? 'Unmute sound effects' : 'Mute sound effects'}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline text-[11px]">{isSoundMuted ? (language === 'bn' ? 'সাউন্ড অফ' : 'Muted') : (language === 'bn' ? 'সাউন্ড অন' : 'Sound')}</span>
            </button>

            {/* Test Payment Celebration Button */}
            <button
              onClick={triggerTestCelebration}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>{language === 'bn' ? 'পেমেন্ট সেলিব্রেশন' : 'Test Payout FX'}</span>
            </button>

            {/* Main Withdraw Action Button */}
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all transform active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{language === 'bn' ? 'টাকা উত্তোলন করুন' : 'Withdraw Funds'}</span>
            </button>
          </div>
        </div>

        {/* Balance Bento Grid (3D Depth Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Available for Withdrawal */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/40 backdrop-blur-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.12)] group hover:border-emerald-400 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-white/60 mb-2 relative z-10">
              <span className="font-semibold">{language === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Available Balance'}</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono relative z-10">
              <AnimatedBalanceCounter
                value={availableBalance}
                language={language}
                highlightGlow={true}
                durationMs={1600}
              />
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-2 flex items-center gap-1 relative z-10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'যেকোনো সময় bKash/Nagad এ ট্রান্সফারযোগ্য' : 'Instant 24/7 payout ready'}</span>
            </div>
          </div>

          {/* Pending in Escrow */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] group hover:border-cyan-400/60 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-white/60 mb-2 relative z-10">
              <span className="font-semibold">{language === 'bn' ? 'অপেক্ষমাণ আয় (এস্ক্রো)' : 'Pending in Escrow'}</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono relative z-10">
              <AnimatedBalanceCounter
                value={pendingEscrow}
                language={language}
                durationMs={1500}
              />
            </div>
            <div className="text-[11px] text-white/50 mt-2 relative z-10">
              {assignments.length} {language === 'bn' ? 'টি চলমান টাস্ক অনুমোদনের পর জমা হবে' : 'tasks in review queue'}
            </div>
          </div>

          {/* Lifetime Earnings */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] group hover:border-amber-400/60 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-white/60 mb-2 relative z-10">
              <span className="font-semibold">{language === 'bn' ? 'সর্বমোট অর্জিত আয়' : 'Lifetime Earnings'}</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono relative z-10">
              <AnimatedBalanceCounter
                value={totalEarnedLifetime}
                language={language}
                durationMs={1800}
              />
            </div>
            <div className="text-[11px] text-white/50 mt-2 relative z-10">
              {reviewerProfile.totalReviewsCompleted} {language === 'bn' ? 'টি সফল রিভিউ থেকে' : 'reviews completed'}
            </div>
          </div>
        </div>

        {/* 2. Foreground Layer Falling Dollars (subtle foreground sparkles, pointer-events-none) */}
        <FallingDollarsCanvas
          intensity={visitAnimPhase === 'active' ? 'normal' : 'ambient'}
          layer="foreground"
          className="z-20 opacity-70"
        />

        {/* Transaction History Table */}
        <div className="bg-slate-900/85 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl space-y-4 shadow-xl relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {language === 'bn' ? 'লেনদেনের হিস্ট্রি' : 'Transaction History'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/5 text-white/60 border border-white/10">
                {transactions.length}
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? '১০০% ভেরিফাইড' : 'Verified Ledger'}</span>
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-white/40 text-xs">
                {language === 'bn' ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No transactions recorded yet.'}
              </div>
            ) : (
              transactions.map((tx) => {
                const isCredit = tx.type === 'task_earning' || tx.type === 'ambassador_payout';

                return (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isCredit
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                          {language === 'bn' ? tx.descriptionBn : tx.descriptionEn}
                        </h5>
                        <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{formatRelativeTime(tx.createdAt, language)}</span>
                          {tx.method && (
                            <>
                              <span>•</span>
                              <span className="uppercase font-mono text-white/60 font-semibold">{tx.method}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-sm sm:text-base font-extrabold font-mono ${
                          isCredit ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {isCredit ? '+' : '-'} {formatBdt(tx.amountBdt, language)}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                          tx.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {tx.status === 'completed'
                          ? language === 'bn' ? 'সফল' : 'Completed'
                          : language === 'bn' ? 'প্রক্রিয়াধীন' : 'Processing'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Payment Celebration Modal */}
      <PaymentCelebrationModal
        isOpen={isCelebrating}
        onClose={() => {
          setIsCelebrating(false);
          setCelebrationData(null);
        }}
        data={celebrationData}
        language={language}
      />

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'টাকা উত্তোলন (Payout)' : 'Withdraw Funds'}
                </h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  {language === 'bn' ? 'পেমেন্ট চ্যানেল সিলেক্ট করুন' : 'Select Payout Channel'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bkash', 'nagad', 'bank'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWithdrawMethod(m)}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        withdrawMethod === m
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  {language === 'bn' ? `${withdrawMethod.toUpperCase()} অ্যাকাউন্ট নম্বর` : `${withdrawMethod.toUpperCase()} Account Number`}
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  placeholder="017xxxxxxxx"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/70">{language === 'bn' ? 'উত্তোলনের পরিমাণ (টাকা)' : 'Withdrawal Amount (BDT)'}</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {language === 'bn' ? 'সর্বোচ্চ:' : 'Max:'} {formatBdt(availableBalance, language)}
                  </span>
                </div>
                <input
                  type="number"
                  min={500}
                  max={availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-base font-bold font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                ⚡ {language === 'bn' ? 'bKash/Nagad এ ইনস্ট্যান্ট ডিসবার্সমেন্ট (০% প্ল্যাটফর্ম ফি)' : 'Instant zero-fee transfer to your mobile wallet'}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white/70 text-xs font-semibold hover:text-white"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  {language === 'bn' ? 'উত্তোলন নিশ্চিত করুন' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
