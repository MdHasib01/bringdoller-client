import { ReviewerLevel, ReviewerLevelId } from '../types';

export const REVIEWER_LEVELS: Record<ReviewerLevelId, ReviewerLevel> = {
  starter: {
    id: 'starter',
    nameBn: 'স্টার্টার রিভিউয়ার',
    nameEn: 'Starter Reviewer',
    minXp: 0,
    badgeIcon: '🌱',
    color: '#94a3b8',
    perksBn: [
      'ডেমো টেস্ট অ্যাপ্রুভাল পেলে প্রথম টাস্ক আনলক',
      'প্রতি টাস্কে সর্বোচ্চ ৳৫০০ পর্যন্ত আয়',
      'কমিউনিটি সাপোর্ট ও বেসিক একাডেমি'
    ],
    perksEn: [
      'Access to entry-level test tasks upon approval',
      'Earn up to ৳500 per task',
      'Basic Academy training access'
    ],
    maxTaskPayoutBdt: 500,
    priorityAccess: false,
    ambassadorEligible: false,
  },
  verified: {
    id: 'verified',
    nameBn: 'ভেরিফায়েড রিভিউয়ার',
    nameEn: 'Verified Reviewer',
    minXp: 500,
    badgeIcon: '🛡️',
    color: '#10b981',
    perksBn: [
      'NID ও ডেমো টেস্ট ভেরিফাইড ব্যাজ',
      'প্রতি টাস্কে সর্বোচ্চ ৳১,২০০ পর্যন্ত আয়',
      'রিওয়ার্ড স্টোর থেকে গিফট গ্যাজেট রিডিম করার সুযোগ'
    ],
    perksEn: [
      'Verified Trust Badge on profile',
      'Earn up to ৳1,200 per task',
      'Redeem gadget rewards from Store'
    ],
    maxTaskPayoutBdt: 1200,
    priorityAccess: false,
    ambassadorEligible: false,
  },
  trusted_voice: {
    id: 'trusted_voice',
    nameBn: 'ট্রাস্টেড ভয়েস',
    nameEn: 'Trusted Voice',
    minXp: 1500,
    badgeIcon: '⭐',
    color: '#06b6d4',
    perksBn: [
      'হাই-ডিমান্ড প্রোডাক্টে প্রায়োরিটি ম্যাচিং',
      'প্রতি টাস্কে সর্বোচ্চ ৳২,৫০০ পর্যন্ত আয়',
      'ফাস্ট-ট্র্যাক পেআউট ও ইনস্ট্যান্ট সাপোর্ট'
    ],
    perksEn: [
      'Priority matching for high-demand products',
      'Earn up to ৳2,500 per task',
      'Fast-track withdrawal approvals'
    ],
    maxTaskPayoutBdt: 2500,
    priorityAccess: true,
    ambassadorEligible: false,
  },
  pro: {
    id: 'pro',
    nameBn: 'প্রো রিভিউয়ার',
    nameEn: 'Pro Reviewer',
    minXp: 3500,
    badgeIcon: '🔥',
    color: '#8b5cf6',
    perksBn: [
      'স্মার্ট গ্যাজেট ও ইলেকট্রনিক্স প্রিমিয়াম ক্যাম্পেইন',
      'প্রতি টাস্কে সর্বোচ্চ ৳৫,০০০ পর্যন্ত আয়',
      'ব্র্যান্ডের সাথে ডিরেক্ট কোলাবোরেশন লিংক'
    ],
    perksEn: [
      'Premium electronics & tech campaigns',
      'Earn up to ৳5,000 per task',
      'Direct brand collaboration channel'
    ],
    maxTaskPayoutBdt: 5000,
    priorityAccess: true,
    ambassadorEligible: true,
  },
  elite: {
    id: 'elite',
    nameBn: 'এলিট রিভিউয়ার',
    nameEn: 'Elite Reviewer',
    minXp: 7500,
    badgeIcon: '💎',
    color: '#ec4899',
    perksBn: [
      'ফ্ল্যাগশিপ লঞ্চ ক্যাম্পেইনে এক্সক্লুসিভ অ্যাক্সেস',
      'প্রতি টাস্কে সর্বোচ্চ ৳১০,০০০ পর্যন্ত আয়',
      'টপ লিডারবোর্ড ক্যাশ বোনাস ও ভিআইপি রিওয়ার্ডস'
    ],
    perksEn: [
      'Exclusive flagship launch campaigns',
      'Earn up to ৳10,000 per task',
      'VIP reward redemptions & leaderboard cash bonus'
    ],
    maxTaskPayoutBdt: 10000,
    priorityAccess: true,
    ambassadorEligible: true,
  },
  brand_choice: {
    id: 'brand_choice',
    nameBn: 'ব্র্যান্ড চয়েস',
    nameEn: 'Brand Choice',
    minXp: 15000,
    badgeIcon: '👑',
    color: '#f59e0b',
    perksBn: [
      'টপ ন্যাশনাল ব্র্যান্ডগুলোর পছন্দের তালিকাভুক্ত',
      'প্রতি টাস্কে সর্বোচ্চ ৳২০,০০০ পর্যন্ত আয়',
      'লং-টার্ম রিভিউয়ার কন্ট্রাক্ট অফার'
    ],
    perksEn: [
      'Shortlisted by top tier national brands',
      'Earn up to ৳20,000 per task',
      'Direct recurring retainer offers'
    ],
    maxTaskPayoutBdt: 20000,
    priorityAccess: true,
    ambassadorEligible: true,
  },
  brand_ambassador: {
    id: 'brand_ambassador',
    nameBn: 'ব্র্যান্ড অ্যাম্বাসেডর',
    nameEn: 'Brand Ambassador',
    minXp: 30000,
    badgeIcon: '🌟',
    color: '#f43f5e',
    perksBn: [
      '৳১,০০,০০০ পর্যন্ত ব্র্যান্ড অ্যাম্বাসেডর কন্ট্রাক্ট এলিজিবিলিটি',
      'বার্ষিক এক্সক্লুসিভ ব্র্যান্ড পার্টনারশিপ',
      'পিংডলার অফিশিয়াল ক্রিয়েটর কাউন্সিল মেম্বারশিপ'
    ],
    perksEn: [
      'Eligible for up to ৳1,00,000 Brand Ambassador contracts',
      'Yearly exclusive brand sponsorships',
      'PingDollar Official Creator Council Member'
    ],
    maxTaskPayoutBdt: 100000,
    priorityAccess: true,
    ambassadorEligible: true,
  },
};

export const LEVEL_ORDER: ReviewerLevelId[] = [
  'starter',
  'verified',
  'trusted_voice',
  'pro',
  'elite',
  'brand_choice',
  'brand_ambassador',
];

export function getLevelByXp(xp: number): ReviewerLevel {
  let current = REVIEWER_LEVELS.starter;
  for (const lvlId of LEVEL_ORDER) {
    if (xp >= REVIEWER_LEVELS[lvlId].minXp) {
      current = REVIEWER_LEVELS[lvlId];
    }
  }
  return current;
}

export function getNextLevel(levelId: ReviewerLevelId): ReviewerLevel | null {
  const currentIndex = LEVEL_ORDER.indexOf(levelId);
  if (currentIndex < LEVEL_ORDER.length - 1) {
    return REVIEWER_LEVELS[LEVEL_ORDER[currentIndex + 1]];
  }
  return null;
}
