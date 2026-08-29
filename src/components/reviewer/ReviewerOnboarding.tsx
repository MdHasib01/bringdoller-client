import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  Upload,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Play,
  Lock,
} from 'lucide-react';
import { VideoRecorder } from '../common/VideoRecorder';
import { maskNid } from '../../utils/formatters';

export const ReviewerOnboarding: React.FC = () => {
  const {
    reviewerProfile,
    submitOnboardingStep,
    submitDemoReview,
    language,
    setActiveReviewerTab,
  } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(reviewerProfile.onboardingStep || 1);

  // Form states
  const [fullName, setFullName] = useState(reviewerProfile.fullName || '');
  const [phone, setPhone] = useState(reviewerProfile.phone || '');
  const [email, setEmail] = useState(reviewerProfile.email || '');
  const [dob, setDob] = useState(reviewerProfile.dateOfBirth || '1998-05-14');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(reviewerProfile.gender || 'male');
  const [address, setAddress] = useState(reviewerProfile.presentAddress || 'ধানমন্ডি, ঢাকা');
  const [district, setDistrict] = useState(reviewerProfile.district || 'Dhaka');
  const [prefLang, setPrefLang] = useState<'bn' | 'en' | 'both'>('bn');

  // Step 2 NID
  const [nidNumber, setNidNumber] = useState('19982692601004812');
  const [nidFront, setNidFront] = useState<string | null>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');
  const [nidBack, setNidBack] = useState<string | null>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');
  const [selfie, setSelfie] = useState<string | null>(reviewerProfile.avatarUrl);
  const [consentChecked, setConsentChecked] = useState(true);

  // Step 3 Profile
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'স্মার্ট গ্যাজেটস',
    'পারফিউম ও আতর',
    'স্কিনকেয়ার',
  ]);
  const [cameraPhone, setCameraPhone] = useState('iPhone 14 / Samsung Galaxy');
  const [payoutType, setPayoutType] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [payoutNumber, setPayoutNumber] = useState('01712345678');

  // Step 4 Demo Review
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const [demoNotes, setDemoNotes] = useState('');

  const districts = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh', 'Gazipur', 'Cumilla'];

  const interestsList = [
    'স্মার্ট গ্যাজেটস',
    'পারফিউম ও আতর',
    'স্কিনকেয়ার',
    'লাইফস্টাইল এক্সেসরিজ',
    'অডিও ও হেডফোন',
    'কিচেন ও হোম এপ্লায়েন্স',
    'মেনস গ্রুমিং',
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOnboardingStep(1, {
      fullName,
      phone,
      email,
      dateOfBirth: dob,
      gender,
      presentAddress: address,
      district,
      preferredLanguage: prefLang,
    });
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOnboardingStep(2, {
      nidNumberMasked: nidNumber,
      nidFrontUrl: nidFront || undefined,
      nidBackUrl: nidBack || undefined,
      selfieUrl: selfie || undefined,
      verificationStatus: 'under_review',
    });
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOnboardingStep(3, {
      contentInterests: selectedInterests,
      deviceInfo: {
        primaryPhone: cameraPhone,
        cameraQuality: '4K HD',
        hasMic: true,
        hasRingLight: true,
      },
      payoutMethod: {
        type: payoutType,
        accountNumber: payoutNumber,
      },
    });
    setStep(4);
  };

  const handleStep4Submit = () => {
    if (!demoVideoUrl) {
      alert(language === 'bn' ? 'অনুগ্রহ করে প্রথমে ডেমো ভিডিও রেকর্ড বা আপলোড করুন।' : 'Please record or upload a demo video first.');
      return;
    }
    submitDemoReview(demoVideoUrl, demoNotes);
    setStep(5);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Steps Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {language === 'bn' ? `ধাপ ${step} এর ৫` : `Step ${step} of 5`}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {step === 1 && (language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information')}
              {step === 2 && (language === 'bn' ? 'জাতীয় পরিচয়পত্র ও মুখমণ্ডল ভেরিফিকেশন' : 'Identity Verification')}
              {step === 3 && (language === 'bn' ? 'রিভিউয়ার প্রোফাইল ও ডিভাইস' : 'Reviewer Profile & Devices')}
              {step === 4 && (language === 'bn' ? 'ডেমো রিভিউ অডিশন টেস্ট' : 'Demo Review Audition Test')}
              {step === 5 && (language === 'bn' ? 'আবেদনের স্ট্যাটাস ও টাইমলাইন' : 'Application Status & Timeline')}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-base font-mono">
            {step}/5
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i < step
                  ? 'bg-emerald-500'
                  : i === step
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'পূর্ণ নাম (NID অনুযায়ী)' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="যেমন: তানভীর আহমেদ"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="017xxxxxxxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="your.name@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'জেলা' : 'District'}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'bn' ? 'বর্তমান ঠিকানা (প্রোডাক্ট ডেলিভারির জন্য)' : 'Present Delivery Address'}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="বাড়ি নং, রোড নং, থানা, জেলা"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>{language === 'bn' ? 'পরবর্তী ধাপ (NID ভেরিফিকেশন)' : 'Next Step (NID Verification)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Identity Verification */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-6 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-400 block mb-0.5">
                {language === 'bn' ? '১০০% নিরাপদ এনক্রিপ্টেড ডাটা স্টোরেজ' : '100% Secure Masked Data Storage'}
              </strong>
              {language === 'bn'
                ? 'আপনার NID নম্বর ও ডকুমেন্টস সম্পূর্ণ মাস্কড ও সুরক্ষিত থাকে। কোনো ব্র্যান্ড বা তৃতীয় পক্ষ আপনার মূল NID তথ্য দেখতে পারবে না।'
                : 'Sensitive identity data is masked and never exposed to brands.'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'bn' ? '১০ বা ১৭ ডিজিটের NID নম্বর' : 'NID Number (10 or 17 digits)'}
            </label>
            <input
              type="text"
              required
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="1998xxxxxxxxxxxxx"
            />
            <div className="text-[11px] text-slate-400 mt-1">
              {language === 'bn' ? 'সাবমিটের পর পাবলিক ভিউতে দেখাবে:' : 'Masked display:'}{' '}
              <span className="font-mono text-emerald-400">{maskNid(nidNumber)}</span>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Front */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                {language === 'bn' ? 'NID সামনের অংশ' : 'NID Front'}
              </span>
              <div className="aspect-[4/3] rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 mb-2 overflow-hidden">
                {nidFront ? (
                  <img src={nidFront} alt="NID Front" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setNidFront('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80')}
                className="text-xs text-emerald-400 hover:underline"
              >
                {language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image'}
              </button>
            </div>

            {/* Back */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                {language === 'bn' ? 'NID পেছনের অংশ' : 'NID Back'}
              </span>
              <div className="aspect-[4/3] rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 mb-2 overflow-hidden">
                {nidBack ? (
                  <img src={nidBack} alt="NID Back" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setNidBack('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80')}
                className="text-xs text-emerald-400 hover:underline"
              >
                {language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image'}
              </button>
            </div>

            {/* Selfie / Liveness */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                {language === 'bn' ? 'লাইভ সেলফি / ফেস ম্যাচ' : 'Live Selfie'}
              </span>
              <div className="aspect-[4/3] rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 mb-2 overflow-hidden">
                {selfie ? (
                  <img src={selfie} alt="Selfie" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelfie(reviewerProfile.avatarUrl)}
                className="text-xs text-emerald-400 hover:underline"
              >
                {language === 'bn' ? 'সেলফি তুলুন' : 'Capture Selfie'}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              required
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-800"
            />
            <span>
              {language === 'bn'
                ? 'আমি নিশ্চিত করছি যে প্রদত্ত NID ও তথ্যসমূহ আমার নিজের এবং আমি BringDollar-এর রিভিউয়ার ভেরিফিকেশন ও সততা শর্তাবলীতে সম্মত।'
                : 'I confirm that the submitted NID and biometric information belongs to me and agree to the BringDollar platform verification terms.'}
            </span>
          </label>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'পূর্ববর্তী ধাপ' : 'Back'}</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>{language === 'bn' ? 'পরবর্তী ধাপ (প্রোফাইল সেটআপ)' : 'Next Step (Profile Setup)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Reviewer Profile */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-6 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {language === 'bn' ? 'আপনার পছন্দের প্রোডাক্ট ক্যাটাগরি (যেগুলোতে রিভিউ দিতে চান)' : 'Select Preferred Product Categories'}
            </label>
            <div className="flex flex-wrap gap-2">
              {interestsList.map((cat) => {
                const isSelected = selectedInterests.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedInterests(selectedInterests.filter((i) => i !== cat));
                      } else {
                        setSelectedInterests([...selectedInterests, cat]);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && '✓ '} {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'রেকর্ডিং মোবাইল / ক্যামেরা মডেল' : 'Recording Device Model'}
              </label>
              <input
                type="text"
                required
                value={cameraPhone}
                onChange={(e) => setCameraPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="যেমন: iPhone 14 Pro, Samsung Galaxy S23"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'পেমেন্ট মেথড (পেআউট পাওয়ার জন্য)' : 'Payout Method'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['bkash', 'nagad', 'bank'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayoutType(m)}
                    className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                      payoutType === m
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'bn' ? `${payoutType.toUpperCase()} একাউন্ট নম্বর` : `${payoutType.toUpperCase()} Account Number`}
            </label>
            <input
              type="text"
              required
              value={payoutNumber}
              onChange={(e) => setPayoutNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="017xxxxxxxx"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'পূর্ববর্তী ধাপ' : 'Back'}</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>{language === 'bn' ? 'পরবর্তী ধাপ (ডেমো অডিশন)' : 'Next Step (Demo Audition)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Demo Review Test */}
      {step === 4 && (
        <div className="space-y-6 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {/* Sample Product Scenario */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-slate-900 border border-emerald-500/30">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">🧪</span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? 'ডেমো টেস্টিং দৃশ্যপট: রয়াল উদ ও আম্বার আতর' : 'Demo Test Scenario: Royal Oudh & Amber Attar'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {language === 'bn'
                    ? '“মনে করুন আপনি এই আতরটি ৪-৫ দিন নিয়মিত ব্যবহার করেছেন। এর বোতলের মান, প্রথম ৫ মিনিটের সুবাস বনাম কয়েক ঘণ্টা পরের অনুভূতি, স্থায়িত্ব এবং কার জন্য এটি উপযুক্ত হবে তা নিজের ভাষায় বলুন। কোনো মুখস্থ বিজ্ঞাপনী স্ক্রিপ্ট পড়বেন না।”'
                    : '“Imagine using this luxury perfume oil for a few days. Naturally describe scent changes, longevity, packaging, and who it is suitable for. Do not memorize a script.”'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
              <div>💡 {language === 'bn' ? 'পর্যাপ্ত আলোতে থাকুন' : 'Good natural lighting'}</div>
              <div>🎙️ {language === 'bn' ? 'ক্লিয়ার ভয়েসে বলুন' : 'Clear voice without noise'}</div>
              <div>⚖️ {language === 'bn' ? 'ভালো ও মন্দ উভয় দিক বলুন' : 'Mention pros & 1 con'}</div>
            </div>
          </div>

          {/* Interactive Video Recorder */}
          <VideoRecorder
            lang={language}
            productContextName="রয়াল উদ আতর অডিশন"
            minDurationSeconds={60}
            maxDurationSeconds={120}
            onRecorded={(url) => setDemoVideoUrl(url)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'bn' ? 'অতিরিক্ত মন্তব্য বা নোট (ঐচ্ছিক)' : 'Additional Notes (Optional)'}
            </label>
            <textarea
              rows={2}
              value={demoNotes}
              onChange={(e) => setDemoNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
              placeholder={language === 'bn' ? 'রিভিউ নিয়ে আপনার কোনো বিশেষ বক্তব্য থাকলে লিখুন...' : 'Any additional comments...'}
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'পূর্ববর্তী ধাপ' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleStep4Submit}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>{language === 'bn' ? 'ডেমো অডিশন সাবমিট করুন' : 'Submit Demo Audition'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Application Status Timeline */}
      {step === 5 && (
        <div className="space-y-6 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
            <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white mb-1">
              {reviewerProfile.isApplicationApproved
                ? language === 'bn' ? '🎉 অভিনন্দন! আপনার প্রোফাইল সম্পূর্ণ ভেরিফাইড' : '🎉 Approved! Your Account is Live'
                : language === 'bn' ? 'আবেদন সফলভাবে পর্যালোচনাধীন আছে' : 'Application is Under Review'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {reviewerProfile.isApplicationApproved
                ? language === 'bn'
                  ? 'আপনার NID ও ডেমো টেস্ট সফলভাবে মূল্যায়িত হয়েছে। এখন পেইড ক্যাম্পেইনে আবেদন করুন।'
                  : 'Your profile has been fully vetted and approved.'
                : language === 'bn'
                ? 'আমাদের কোয়ালিটি টিম সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে NID ও ডেমো টেস্ট মূল্যায়ন করে ফলাফল প্রকাশ করে।'
                : 'QA Team will evaluate your demo test and identity verification within 24-48 hours.'}
            </p>
          </div>

          {/* Animated Timeline */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4 max-w-md mx-auto">
            {/* Stage 1 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">{language === 'bn' ? 'প্রোফাইল তথ্য জমা সম্পন্ন' : 'Profile Completed'}</h5>
                <p className="text-[11px] text-slate-400">{language === 'bn' ? 'ব্যক্তিগত তথ্য ও ডেলিভারি ঠিকানা সংরক্ষিত।' : 'Personal info saved.'}</p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                reviewerProfile.verificationStatus === 'verified'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">{language === 'bn' ? 'NID ও ফেস ম্যাচিং' : 'NID & Biometrics'}</h5>
                <p className="text-[11px] text-slate-400">
                  {reviewerProfile.verificationStatus === 'verified'
                    ? language === 'bn' ? 'ভেরিফিকেশন সফল।' : 'Verified.'
                    : language === 'bn' ? 'অ্যাডমিন কিউতে আছে।' : 'In QA Queue.'}
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                reviewerProfile.isApplicationApproved
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">{language === 'bn' ? 'ডেমো অডিশন মূল্যায়ন' : 'Demo Test QA'}</h5>
                <p className="text-[11px] text-slate-400">
                  {reviewerProfile.isApplicationApproved
                    ? language === 'bn' ? '৮টি রুব্রিকে ৪.৮/৫ রেটিং অর্জন!' : 'Rated 4.8/5 on 8-factor rubric!'
                    : language === 'bn' ? 'ন্যাচারাল ডেলিভারি পর্যবেক্ষণ চলছে।' : 'Under live evaluation.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveReviewerTab('home');
                navigate('/reviewer');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{language === 'bn' ? 'রিভিউয়ার ড্যাশবোর্ডে প্রবেশ করুন' : 'Enter Reviewer Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
