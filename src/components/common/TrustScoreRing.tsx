import React from 'react';
import { toBengaliDigits } from '../../utils/formatters';
import { Language } from '../../types';

interface TrustScoreRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  lang?: Language;
  showLabel?: boolean;
}

export const TrustScoreRing: React.FC<TrustScoreRingProps> = ({
  score,
  size = 72,
  strokeWidth = 6,
  lang = 'bn',
  showLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 90) return { stroke: '#10b981', text: 'text-emerald-400', labelBn: 'খুবই বিশ্বস্ত', labelEn: 'Excellent' };
    if (score >= 75) return { stroke: '#06b6d4', text: 'text-cyan-400', labelBn: 'বিশ্বস্ত', labelEn: 'Good' };
    if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-400', labelBn: 'মাঝারি', labelEn: 'Moderate' };
    return { stroke: '#f43f5e', text: 'text-rose-400', labelBn: 'ঝুঁকিপূর্ণ', labelEn: 'At Risk' };
  };

  const colorConfig = getColor();

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-base sm:text-lg font-bold font-mono ${colorConfig.text}`}>
            {lang === 'bn' ? toBengaliDigits(score) : score}
          </span>
          <span className="text-[9px] text-slate-400 font-medium -mt-1">/100</span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium">
            {lang === 'bn' ? 'ট্রাস্ট স্কোর' : 'Trust Score'}
          </span>
          <span className={`text-xs font-semibold ${colorConfig.text}`}>
            {lang === 'bn' ? colorConfig.labelBn : colorConfig.labelEn}
          </span>
        </div>
      )}
    </div>
  );
};
