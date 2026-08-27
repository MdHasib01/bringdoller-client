import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Trophy, Medal, Crown, Sparkles, Filter, ShieldCheck, ArrowLeft } from 'lucide-react';
import { formatNumber, toBengaliDigits } from '../../utils/formatters';
import { REVIEWER_LEVELS } from '../../utils/levels';

export const ReviewerLeaderboard: React.FC = () => {
  const { leaderboard, language, reviewerProfile, setActiveReviewerTab } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('allTime');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  const districts = ['all', 'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi'];

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (selectedDistrict === 'all') return true;
    return item.district === selectedDistrict;
  });

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
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {language === 'bn' ? 'জাতীয় ক্রিয়েটর লিডারবোর্ড' : 'National Creator Leaderboard'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/50">
            {language === 'bn' ? 'স্থায়ী Career XP ও ট্রাস্ট স্কোরের ভিত্তিতে মাসিক সম্মাননা' : 'Rankings determined by permanent Career XP and Trust Score'}
          </p>
        </div>

        {/* Time Period Filter Tabs */}
        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl">
          {(['weekly', 'monthly', 'allTime'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                period === p
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {p === 'weekly' && (language === 'bn' ? 'সাপ্তাহিক' : 'Weekly')}
              {p === 'monthly' && (language === 'bn' ? 'মাসিক' : 'Monthly')}
              {p === 'allTime' && (language === 'bn' ? 'সর্বকালের' : 'All-Time')}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {filteredLeaderboard.slice(0, 3).map((user, idx) => {
          const rank = idx + 1;
          const level = REVIEWER_LEVELS[user.levelId];

          return (
            <div
              key={user.id}
              className={`rounded-3xl p-5 backdrop-blur-xl border flex flex-col items-center text-center relative overflow-hidden ${
                rank === 1
                  ? 'bg-gradient-to-b from-amber-500/20 via-white/5 to-transparent border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] sm:-translate-y-2'
                  : rank === 2
                  ? 'bg-white/5 border-slate-400/30'
                  : 'bg-white/5 border-amber-700/30'
              }`}
            >
              <div className="absolute top-3 left-3 text-xl">
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </div>

              <div className="relative mb-3 mt-1">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-lg"
                />
                {user.isAmbassador && (
                  <span className="absolute -bottom-1 -right-1 text-sm" title="Brand Ambassador">
                    👑
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white mb-0.5">{user.fullName}</h4>
              <p className="text-[11px] text-white/50 mb-3">{user.district}</p>

              <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">
                  {language === 'bn' ? level?.nameBn : level?.nameEn || 'Reviewer'}
                </span>
                <span className="font-extrabold text-amber-400 font-mono">
                  {formatNumber(user.careerXp, language)} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-white/50 font-semibold">
          <span>{language === 'bn' ? 'র‍্যাঙ্ক ও রিভিউয়ার' : 'Rank & Reviewer'}</span>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">{language === 'bn' ? 'ট্রাস্ট স্কোর' : 'Trust Score'}</span>
            <span>Career XP</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredLeaderboard.map((item, idx) => {
            const isMe = item.id === reviewerProfile.id;
            const level = REVIEWER_LEVELS[item.levelId];

            return (
              <div
                key={item.id}
                className={`py-3.5 flex items-center justify-between gap-3 px-2 rounded-2xl transition-colors ${
                  isMe ? 'bg-emerald-500/10 border border-emerald-500/30' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-xs text-white/60 font-mono">
                    {language === 'bn' ? toBengaliDigits(idx + 1) : idx + 1}
                  </span>
                  <img
                    src={item.avatarUrl}
                    alt={item.fullName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs sm:text-sm font-bold text-white">
                        {item.fullName}
                      </h5>
                      {isMe && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold">
                          YOU
                        </span>
                      )}
                      {item.isAmbassador && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                          Ambassador
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/40">
                      {item.district} • {item.totalReviewsCompleted} {language === 'bn' ? 'টি রিভিউ' : 'reviews'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <span className="hidden sm:inline text-xs font-bold text-emerald-400 font-mono">
                    {item.trustScore}%
                  </span>
                  <span className="text-sm font-black text-amber-400 font-mono">
                    {formatNumber(item.careerXp, language)} <span className="text-[10px] font-normal text-white/50">XP</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
