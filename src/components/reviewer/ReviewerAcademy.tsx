import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Play,
  Award,
  Video,
  Mic,
  ShieldAlert,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters';

export const ReviewerAcademy: React.FC = () => {
  const { language, setActiveReviewerTab } = useApp();
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState<number[]>([1]);
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      titleBn: '১. ন্যাচারাল কথা বলা ও স্ক্রিপ্ট পরিহার',
      titleEn: '1. Natural Delivery & Avoiding Scripts',
      duration: '৫ মিনিট',
      xpReward: 50,
      icon: Mic,
      summaryBn: 'রোবটিক বিজ্ঞাপনী সুর পরিহার করে একজন বন্ধুকে পণ্যটির ভালো-মন্দ পরামর্শ দেওয়ার মতো স্বাভাবিকভাবে কথা বলুন।',
      summaryEn: 'Speak naturally like advising a friend without sounding like a robotic TV commercial.',
      pointsBn: [
        'কখনো স্ক্রিন দেখে লাইন মুখস্থ পড়ার চেষ্টা করবেন না।',
        'নিজস্ব অনুভূতি ও প্রথম অভিজ্ঞতার বিস্ময় ফুটিয়ে তুলুন।',
        'কথা বলার সময় চোখের দৃষ্টি ক্যামেরার লেন্সে রাখুন।',
      ],
      pointsEn: [
        'Never read memorized lines off a teleprompter or second screen.',
        'Convey genuine excitement and real first impressions.',
        'Keep eye contact with the camera lens for viewer trust.',
      ],
    },
    {
      id: 2,
      titleBn: '২. আলো ও অডিও স্পষ্টতা টেকনিক',
      titleEn: '2. Lighting & Audio Clarity Techniques',
      duration: '৬ মিনিট',
      durationEn: '6 mins',
      xpReward: 50,
      icon: Video,
      summaryBn: 'ভালো আলো ও স্পষ্ট শব্দ আপনার রিভিউয়ের মান ও ব্র্যান্ড অনুমোদন দ্রুত করে।',
      summaryEn: 'Clean natural light and crisp noise-free audio speed up brand approval.',
      pointsBn: [
        'জানালার দিনের আলোর মুখোমুখি দাঁড়িয়ে শুট করুন।',
        'ফ্যানের বাতাসের আওয়াজ কমাতে লাপেল মাইক ব্যবহার করুন।',
        'ব্যাকগ্রাউন্ড পরিচ্ছন্ন ও অপ্রয়োজনীয় জঞ্জালমুক্ত রাখুন।',
      ],
      pointsEn: [
        'Face window daylight directly rather than filming in backlighting.',
        'Use a lapel mic or silent room to eliminate ceiling fan whir.',
        'Keep background tidy and uncluttered for professional focus.',
      ],
    },
    {
      id: 3,
      titleBn: '৩. সৎ সুবিধা ও দুর্বলতার ভারসাম্য',
      titleEn: '3. Balancing Honest Pros & Cons',
      duration: '৮ মিনিট',
      durationEn: '8 mins',
      xpReward: 100,
      icon: ShieldAlert,
      summaryBn: 'BringDollar-এর সততা নীতি অনুযায়ী কোনো প্রোডাক্টের কেবল প্রশংসা করা নিষিদ্ধ—অন্তত ১টি বাস্তব সীমাবদ্ধতা উল্লেখ করুন।',
      summaryEn: 'Always mention real limitations. Pure exaggerated praise lowers trust score.',
      pointsBn: [
        'কোন ধরনের মানুষের জন্য প্রোডাক্টটি উপযুক্ত এবং কার জন্য নয় তা স্পষ্ট করুন।',
        'প্যাকেজিং বা পরিমাণের কোনো ঘাটতি থাকলে উল্লেখ করুন।',
        'সততার কারণে ব্র্যান্ড আপনার পেমেন্ট বাতিল করতে পারবে না—এটি প্ল্যাটফর্ম সুরক্ষিত।',
      ],
      pointsEn: [
        'Clarify who the product is perfect for and who might find it unsuitable.',
        'Mention any minor drawbacks in packaging, scent opening, or build quality.',
        'Brands cannot withhold payout for authentic critique—protected by escrow.',
      ],
    },
  ];

  const handleCompleteLesson = (id: number) => {
    if (!completedModules.includes(id)) {
      setCompletedModules([...completedModules, id]);
    }
    setActiveModule(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 sm:pb-32 space-y-6">
      {/* Back button to Profile */}
      <button
        type="button"
        onClick={() => {
          setActiveReviewerTab('profile');
          navigate('/reviewer/profile');
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'প্রোফাইলে ফিরুন' : 'Back to Profile'}</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {language === 'bn' ? 'ক্রিয়েটর একাডেমি ও প্রশিক্ষণ' : 'Creator Academy'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/50">
            {language === 'bn' ? 'প্রোডাক্ট টেস্টিং স্কিল উন্নত করুন, কোর্স সম্পন্ন করে বোনাস XP অর্জন করুন' : 'Master authentic product reviewing and earn bonus XP'}
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>
            {language === 'bn' ? `${toBengaliDigits(completedModules.length)} / ${toBengaliDigits(modules.length)} কোর্স সম্পন্ন` : `${completedModules.length}/${modules.length} Completed`}
          </span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((m) => {
          const isDone = completedModules.includes(m.id);
          const Icon = m.icon;

          return (
            <div
              key={m.id}
              className={`p-5 rounded-3xl bg-white/5 border backdrop-blur-xl transition-all ${
                isDone ? 'border-emerald-500/30' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
                        {language === 'bn' ? m.duration : m.durationEn}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        +{m.xpReward} XP
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {language === 'bn' ? m.titleBn : m.titleEn}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {language === 'bn' ? m.summaryBn : m.summaryEn}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModule(m.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 self-end sm:self-center ${
                    isDone
                      ? 'bg-white/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'পুনরায় দেখুন' : 'Review'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{language === 'bn' ? 'ক্লাস শুরু করুন' : 'Start Lesson'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Lesson Drawer */}
              {activeModule === m.id && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {language === 'bn' ? 'মূল শিক্ষণীয় বিষয়সমূহ:' : 'Key Takeaways:'}
                  </h4>
                  <ul className="space-y-2 text-xs text-white/80">
                    {(language === 'bn' ? m.pointsBn : m.pointsEn).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCompleteLesson(m.id)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
                    >
                      {language === 'bn' ? 'পাঠ সম্পন্ন করলাম (+XP গ্রহণ করুন)' : 'Complete & Claim XP'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
