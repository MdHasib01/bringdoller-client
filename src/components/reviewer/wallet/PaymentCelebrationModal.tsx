import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, X, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';
import { AnimatedBalanceCounter } from './AnimatedBalanceCounter';
import { FallingDollarsCanvas } from './FallingDollarsCanvas';
import { soundManager } from '../../../utils/soundEffects';
import confetti from 'canvas-confetti';

export interface PaymentCelebrationData {
  amount: number;
  campaignTitle: string;
  productName?: string;
  storeName?: string;
  transactionId?: string;
  careerXp?: number;
  rewardCoins?: number;
}

interface PaymentCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentCelebrationData | null;
  language: 'bn' | 'en';
}

export const PaymentCelebrationModal: React.FC<PaymentCelebrationModalProps> = ({
  isOpen,
  onClose,
  data,
  language,
}) => {
  useEffect(() => {
    if (isOpen && data) {
      // Trigger sound & haptics
      soundManager.playPaymentChime();
      soundManager.triggerHaptic([50, 40, 90, 40, 140]);

      // Fire celebratory confetti burst
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5, x: 0.5 },
          colors: ['#F59E0B', '#10B981', '#06B6D4', '#FEF08A'],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-hidden">
        {/* Falling Dollars Canvas overlay in celebration mode */}
        <FallingDollarsCanvas intensity="celebration" isCelebrating={true} layer="all" />

        {/* Modal Window with 3D Depth Glass Design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative max-w-md w-full rounded-3xl bg-slate-900/95 border border-emerald-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.25)] text-center z-10 space-y-5"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Celebratory Icon with Radial Rings */}
          <div className="relative inline-flex items-center justify-center mx-auto">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] text-slate-950 relative z-10">
              <DollarSign className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Main Titles */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'এস্ক্রো ডিসবার্সমেন্ট নিশ্চিত' : 'Escrow Payout Verified'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? 'পেমেন্ট সফলভাবে জমা হয়েছে!' : 'Payment Received'}
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              {language === 'bn'
                ? 'আপনার ওয়ালেট ব্যালেন্সে নতুন আয় যুক্ত করা হয়েছে।'
                : 'Funds have been credited instantly to your available balance.'}
            </p>
          </div>

          {/* Received Amount Showcase with Animated Counter */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-emerald-500/20 space-y-1">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block">
              {language === 'bn' ? 'অর্জিত অর্থ' : 'Amount Credited'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight flex items-center justify-center gap-1">
              <span className="text-2xl text-emerald-300 font-normal">+</span>
              <AnimatedBalanceCounter
                value={data.amount}
                language={language}
                highlightGlow={true}
                durationMs={1400}
                className="text-3xl sm:text-4xl"
              />
            </div>

            {/* Campaign & Task Info */}
            <div className="pt-2 border-t border-white/10 text-xs text-white/80 flex items-center justify-center gap-1.5 truncate">
              <span className="text-white/40">{language === 'bn' ? 'ক্যাম্পেইন:' : 'Campaign:'}</span>
              <span className="font-semibold text-white truncate max-w-[220px]">
                {data.campaignTitle}
              </span>
            </div>

            {/* Bonuses if available */}
            {(Boolean(data.careerXp) || Boolean(data.rewardCoins)) && (
              <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-bold">
                {Boolean(data.careerXp) && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    +{data.careerXp} XP
                  </span>
                )}
                {Boolean(data.rewardCoins) && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    +{data.rewardCoins} 🪙 Coins
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'ওয়ালেটে ফিরে যান' : 'Continue to Wallet'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
