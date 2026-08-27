import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
  DollarSign,
  Gift,
  Video,
  Lock,
  ChevronDown,
  Smartphone,
  Briefcase,
  Star,
  Users,
  Eye,
} from 'lucide-react';
import { formatBdt } from '../../utils/formatters';

interface LandingPageProps {
  onOpenAuth?: (role: 'reviewer' | 'brand' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { language, setCurrentRole } = useApp();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleReviewerClick = () => {
    setCurrentRole('reviewer');
    if (onOpenAuth) onOpenAuth('reviewer');
    navigate('/reviewer');
  };

  const handleBrandClick = () => {
    setCurrentRole('brand');
    if (onOpenAuth) onOpenAuth('brand');
    navigate('/brand');
  };


  const faqs = [
    {
      qBn: 'BringDollar-এ কীভাবে আয় শুরু করব?',
      qEn: 'How do I start earning on BringDollar?',
      aBn: 'খুব সহজ! প্রথমে "Reviewer হিসেবে শুরু করুন" চাপুন, NID ও বেসিক তথ্য দিয়ে একটি ছোট ডেমো ভিডিও টেস্ট সাবমিট করুন। অ্যাডমিন অনুমোদন পাওয়ার পরই পেইড ক্যাম্পেইনে যুক্ত হয়ে আয় করতে পারবেন।',
      aEn: 'Sign up as a reviewer, submit your NID and record a short demo video test. Once approved by admin QA, you can apply for paid campaigns.',
    },
    {
      qBn: 'রিভিউতে কি প্রোডাক্টের খারাপ দিক বলা যাবে?',
      qEn: 'Can I mention negative points in my review?',
      aBn: 'হ্যাঁ, ১০০%! BringDollar কোনো ফেক রিভিউ বা জোরপূর্বক প্রশংসা সমর্থন করে না। আপনার প্রকৃত অভিজ্ঞতা, ভালো দিক এবং সীমাবদ্ধতা উভয়ই নির্দ্বিধায় তুলে ধরবেন। সততার সাথে রিভিউ দিলে আপনার ট্রাস্ট স্কোর আরও বৃদ্ধি পাবে।',
      aEn: 'Yes, 100%! BringDollar does not force fake positive reviews. Honest pros and genuine limitations are fully protected by platform policy.',
    },
    {
      qBn: 'Career XP এবং Reward Coins এর মধ্যে পার্থক্য কী?',
      qEn: 'What is the difference between Career XP and Reward Coins?',
      aBn: 'Career XP আপনার স্থায়ী ক্যারিয়ার প্রগ্রেস যা কখনো কমে না এবং এটি আপনার লেভেল ও লিডারবোর্ড র‍্যাঙ্ক নির্ধারণ করে। অন্যদিকে Reward Coins হলো খরচযোগ্য পয়েন্ট যা দিয়ে আপনি হেডফোন, স্মার্টওয়াচ, ক্যামেরা কিট ইত্যাদি গ্যাজেট রিডিম করতে পারেন।',
      aEn: 'Career XP is permanent and determines your level. Reward Coins are spendable points to redeem gadgets without affecting your level.',
    },
    {
      qBn: 'ব্র্যান্ড অ্যাম্বাসেডর হওয়ার সুযোগ কীভাবে পাওয়া যায়?',
      qEn: 'How can I become a Brand Ambassador?',
      aBn: 'ধারাবাহিকভাবে উচ্চমানের ও সৎ রিভিউ সাবমিট করে যখন আপনি প্রো বা এলিট লেভেলে পৌঁছাবেন এবং ট্রাস্ট স্কোর ৯০+ থাকবে, তখন টপ ব্র্যান্ডগুলো আপনাকে সরাসরি মাসিক ৳১,০০,০০০ পর্যন্ত দীর্ঘমেয়াদী কন্ট্রাক্টের ইনভাইটেশন পাঠাবে।',
      aEn: 'By maintaining a 90+ Trust Score and reaching Pro/Elite levels, verified reviewers receive direct Brand Ambassador offers up to ৳100,000.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-150px] left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[-100px] right-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[140px] animate-pulse-glow" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md shadow-lg shadow-emerald-500/5">
          <ShieldCheck className="w-4 h-4" />
          <span>
            {language === 'bn'
              ? 'BringDollar — বাংলাদেশের ১ম ভেরিফাইড প্রোডাক্ট টেস্টিং ও সৎ রিভিউ মার্কেটপ্লেস'
              : 'BringDollar — Bangladesh’s #1 Verified Product Testing & Honest Review Marketplace'}
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.25] sm:leading-[1.2] mb-6">
          {language === 'bn' ? (
            <>
              “আপনার <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">বাস্তব অভিজ্ঞতাই গড়ে তুলুক</span> নতুন আয়ের সম্ভাবনা।”
            </>
          ) : (
            <>
              “Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Real Experience</span> Into Your Next Earning Opportunity.”
            </>
          )}
        </h1>

        {/* Hero Subheadline */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          {language === 'bn'
            ? 'যাচাইকৃত পণ্য টেস্ট করুন, খাঁটি রিভিউ শেয়ার করুন, রিওয়ার্ড আয় করুন এবং প্রিমিয়াম ব্র্যান্ড অ্যাম্বাসেডর হওয়ার সুযোগ পান।'
            : 'Test verified products, share authentic reviews, earn rewards and grow toward premium Brand Ambassador opportunities.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
          <button
            type="button"
            onClick={handleReviewerClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{language === 'bn' ? 'রিভিউয়ার হিসেবে যোগ দিন' : 'Become a Reviewer'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleBrandClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>{language === 'bn' ? 'ভেরিফাইড রিভিউয়ার খুঁজুন' : 'Find Verified Reviewers'}</span>
          </button>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-emerald-400 font-bold text-xl sm:text-2xl font-mono mb-1">
              {language === 'bn' ? '৳১,২০০+' : '৳1,200+'}
            </div>
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'প্রতি টাস্কে সম্ভাব্য আয়' : 'Avg Payout per Task'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-cyan-400 font-bold text-xl sm:text-2xl font-mono mb-1">
              {language === 'bn' ? '১০০%' : '100%'}
            </div>
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'সৎ মতামত সুরক্ষা নীতি' : 'Honesty Protected'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-amber-400 font-bold text-xl sm:text-2xl font-mono mb-1">
              {language === 'bn' ? '৳১,০০,০০০' : '৳100,000'}
            </div>
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'অ্যাম্বাসেডর কন্ট্রাক্ট' : 'Ambassador Deals'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-purple-400 font-bold text-xl sm:text-2xl font-mono mb-1">bKash/Nagad</div>
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'নিরাপদ এস্ক্রো পেআউট' : 'Escrow Secured'}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Journey Section */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              {language === 'bn' ? 'কীভাবে কাজ করে BringDollar?' : 'How BringDollar Works'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              {language === 'bn'
                ? 'ব্র্যান্ড ও আসল কনজিউমারদের মাঝে ৩টি স্বচ্ছ ও সহজ ধাপ'
                : '3 transparent steps connecting authentic users with premium brands'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg mb-4">
                ১
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'bn' ? '১. ভেরিফিকেশন ও ম্যাচিং' : '1. Verify & Match'}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'NID ও ছোট ডেমো রিভিউ দিয়ে ভেরিফায়েড ব্যাজ নিন। আপনার ক্যাটাগরি ও পছন্দের ব্র্যান্ডের টাস্কে আবেদন করুন।'
                  : 'Get verified with your NID and short demo test. Get matched with relevant product campaigns.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg mb-4">
                ২
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'bn' ? '২. প্রোডাক্ট টেস্ট ও ভিডিও তৈরি' : '2. Test & Record'}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'প্রোডাক্ট হাতে পেয়ে নির্দিষ্ট দিন সক্রিয়ভাবে ব্যবহার করুন। কোনো মুখস্থ স্ক্রিপ্ট ছাড়া বাস্তব ভালো-মন্দ রেকর্ড করুন।'
                  : 'Receive product, test over the required duration, and record your balanced experience naturally.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg mb-4">
                ৩
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'bn' ? '৩. আয়, রিওয়ার্ড ও লেভেল আপ' : '3. Earn, Redeem & Level Up'}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'রিভিউ অনুমোদন পেলে সরাসরি বিকাশ/নগদে ক্যাশ পেআউট পান, গ্যাজেট কয়েন রিডিম করুন এবং অ্যাম্বাসেডর হওয়ার পথে এগিয়ে যান।'
                  : 'Get instant cash payout via bKash/Nagad, earn Reward Coins for gadgets, and unlock brand sponsorship.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authenticity & Non-Forced Positive Review Pledge */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Lock className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <div className="inline-block text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                {language === 'bn' ? 'রিভিউ সততা অঙ্গীকার' : 'Authenticity & Disclosure Pledge'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {language === 'bn'
                  ? 'কোনো ফেক রিভিউ বা জোরপূর্বক ইতিবাচক প্রচার নয়'
                  : 'No Forced Positive Reviews or Fake Hype'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {language === 'bn'
                  ? 'BringDollar-এ প্রতিটি পেইড বা গিফটেড প্রোডাক্ট পরীক্ষার সাথে স্পষ্ট ডিসক্লোজার সংযুক্ত থাকে। রিভিউয়ারের সৎ দুর্বলতা বা সমালোচনা ব্র্যান্ড মুছতে বলতে পারে না—সংশোধন অনুরোধ কেবল তথ্যগত ভুল বা মিসিং শটের জন্য গ্রহণযোগ্য।'
                  : 'Every paid or gifted test on BringDollar is accompanied by transparent disclosure. Brands cannot reject authentic criticism.'}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'bn' ? 'সৎ দুর্বলতা উল্লেখ বাধ্যতামূলক' : 'Pros & Cons Protected'}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'bn' ? 'নিরপেক্ষ অ্যাডমিন আরবিট্রেশন' : 'Fair Admin Arbitration'}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'bn' ? 'প্রি-ফান্ডেড এস্ক্রো সিকিউরিটি' : 'Escrow Protected Payouts'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Ambassador Program Spotlight */}
      <section className="py-16 bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
                <Trophy className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লং-টার্ম ক্যারিয়ার প্রোগ্রাম' : 'Long-Term Career Growth'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                {language === 'bn'
                  ? '৳১,০০,০০০ পর্যন্ত ব্র্যান্ড অ্যাম্বাসেডর সুযোগ'
                  : 'Up to ৳100,000 Brand Ambassador Contracts'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                {language === 'bn'
                  ? 'ধারাবাহিকভাবে সঠিক ও আকর্ষণীয় রিভিউ তৈরি করে ট্রাস্টেড ভয়েস বা প্রো লেভেলে উন্নীত হলে টপ ন্যাশনাল ব্র্যান্ডগুলো আপনাকে সরাসরি মাসিক রিটার্নাল কন্ট্রাক্ট অফার করবে।'
                  : 'High-trust reviewers with verified track records receive exclusive ambassador offers and monthly retainers.'}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      {language === 'bn' ? 'বার্ষিক এক্সক্লুসিভ ব্র্যান্ড পার্টনারশিপ' : 'Exclusive Brand Partnerships'}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {language === 'bn' ? 'নির্দিষ্ট ক্যাটাগরিতে ব্র্যান্ডের প্রধান মুখ হিসেবে কাজ করার সুযোগ।' : 'Become the leading voice for your preferred category.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      {language === 'bn' ? 'ফ্ল্যাগশিপ গ্যাজেট ও আনরিলিজড প্রোডাক্ট' : 'Flagship Gear & Early Access'}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {language === 'bn' ? 'বাজারে আসার আগেই নতুন প্রোডাক্ট সবার আগে টেস্ট করার সুযোগ।' : 'Test unreleased products before the public launch.'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReviewerClick}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <span>{language === 'bn' ? 'ক্যারিয়ার লেভেল শুরু করুন' : 'Start Your Journey'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Level Card Showcase */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl relative">
              <div className="text-xs font-bold text-slate-400 mb-4 flex items-center justify-between">
                <span>{language === 'bn' ? 'লেভেল রোডম্যাপ' : 'Level Progression'}</span>
                <span className="text-emerald-400 font-mono">XP System</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌱</span>
                    <div>
                      <div className="text-xs font-bold text-white">Starter Reviewer</div>
                      <div className="text-[11px] text-slate-400">
                        {language === 'bn' ? '০ - ৪৯৯ XP • ৳৫০০/টাস্ক' : '0 - 499 XP • ৳500/task'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Level 1</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <div className="text-xs font-bold text-emerald-300">Verified Reviewer</div>
                      <div className="text-[11px] text-slate-300">
                        {language === 'bn' ? '৫০০ - ১,৪৯৯ XP • ৳১,২০০/টাস্ক' : '500 - 1,499 XP • ৳1,200/task'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Level 2</span>
                </div>

                <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔥</span>
                    <div>
                      <div className="text-xs font-bold text-violet-300">Pro Reviewer</div>
                      <div className="text-[11px] text-slate-300">
                        {language === 'bn' ? '৩,৫০০ - ৭,৪৯৯ XP • ৳৫,০০০/টাস্ক' : '3,500 - 7,499 XP • ৳5,000/task'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold">Level 4</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌟</span>
                    <div>
                      <div className="text-xs font-bold text-amber-300">Brand Ambassador</div>
                      <div className="text-[11px] text-amber-200">
                        {language === 'bn' ? '৩০,০০০+ XP • ৳১,০০,০০০ কন্ট্রাক্ট' : '30,000+ XP • ৳100,000 Retainer'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold">Top Rank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'bn' ? 'BringDollar ব্যবহারের সব প্রয়োজনীয় তথ্য' : 'Everything you need to know about BringDollar'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {language === 'bn' ? faq.qBn : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1 pt-3">
                    {language === 'bn' ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-slate-950 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">Bring<span className="text-emerald-400">Dollar</span></span>
              <span className="text-[10px] text-slate-400">© 2026 BringDollar BD. All Rights Reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-white cursor-pointer">{language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</span>
              <span className="hover:text-white cursor-pointer">{language === 'bn' ? 'শর্তাবলী' : 'Terms of Service'}</span>
              <span className="hover:text-white cursor-pointer">{language === 'bn' ? 'সততা গাইডলাইন' : 'Authenticity Guide'}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto">
            {language === 'bn'
              ? 'BringDollar একটি স্বাধীন প্রোডাক্ট-টেস্টিং ও রিভিউ প্ল্যাটফর্ম। প্রতিটি রিভিউতে যথাযথ ডিসক্লোজার থাকা বাধ্যতামূলক।'
              : 'BringDollar is a verified product-testing marketplace. Transparent disclosure is strictly enforced.'}
          </p>
        </div>
      </footer>
    </div>
  );
};
