import React from 'react';
import { ReviewerLevelId, Language } from '../../types';
import { REVIEWER_LEVELS, getLevelByXp, getNextLevel } from '../../utils/levels';
import { toBengaliDigits, formatNumber } from '../../utils/formatters';
import { Sparkles, Trophy } from 'lucide-react';

interface XpProgressBarProps {
  careerXp: number;
  levelId: ReviewerLevelId;
  lang?: Language;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({
  careerXp,
  levelId,
  lang = 'bn' as Language,
}) => {
  const currentLevel = REVIEWER_LEVELS[levelId] || getLevelByXp(careerXp);
  const nextLevel = getNextLevel(levelId);

  const prevMinXp = currentLevel.minXp;
  const nextMinXp = nextLevel ? nextLevel.minXp : prevMinXp + 50000;
  
  const xpInCurrentLevel = Math.max(0, careerXp - prevMinXp);
  const xpNeededForNext = nextMinXp - prevMinXp;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 shadow-lg relative overflow-hidden">
      {/* Subtle ambient gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: currentLevel.color }}
      />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-md border border-white/10"
            style={{ background: `${currentLevel.color}20` }}
          >
            {currentLevel.badgeIcon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">
                {lang === 'bn' ? 'বর্তমান লেভেল' : 'Current Level'}
              </span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {lang === 'bn' ? currentLevel.nameBn : currentLevel.nameEn}
            </h4>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">
            {lang === 'bn' ? 'পার্মানেন্ট XP' : 'Permanent XP'}
          </div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">
            {formatNumber(careerXp, lang)} <span className="text-xs font-normal text-slate-400">XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative z-10">
        <div className="h-2.5 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, #10b981 0%, ${currentLevel.color} 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-400">
            {lang === 'bn' ? 'এই লেভেলের অগ্রগতি:' : 'Level Progress:'}{' '}
            <strong className="text-slate-200">{lang === 'bn' ? toBengaliDigits(progressPercent) : progressPercent}%</strong>
          </span>

          {nextLevel ? (
            <span className="text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>
                {lang === 'bn' ? 'পরবর্তী লেভেল:' : 'Next Level:'}{' '}
                <strong className="text-amber-300">{lang === 'bn' ? nextLevel.nameBn : nextLevel.nameEn}</strong>{' '}
                ({formatNumber(nextMinXp - careerXp, lang)} XP বাকি)
              </span>
            </span>
          ) : (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              👑 {lang === 'bn' ? 'সর্বোচ্চ ক্রিয়েটর র‍্যাঙ্ক অর্জিত!' : 'Top Rank Reached!'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
