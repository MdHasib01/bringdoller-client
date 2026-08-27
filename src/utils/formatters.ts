import { Language } from '../types';

const BENGALI_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(input: number | string): string {
  const str = input.toString();
  return str.replace(/[0-9]/g, (w) => BENGALI_NUMERALS[+w]);
}

export function formatBdt(amount: number, lang: Language = 'en'): string {
  const formattedEn = new Intl.NumberFormat('en-IN').format(amount);
  if (lang === 'bn') {
    return `৳${toBengaliDigits(formattedEn)}`;
  }
  return `৳${formattedEn}`;
}

export function formatNumber(num: number, lang: Language = 'en'): string {
  const formattedEn = new Intl.NumberFormat('en-IN').format(num);
  if (lang === 'bn') {
    return toBengaliDigits(formattedEn);
  }
  return formattedEn;
}

export function formatDate(dateString: string, lang: Language = 'en'): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    
    if (lang === 'bn') {
      const day = toBengaliDigits(d.getDate());
      const year = toBengaliDigits(d.getFullYear());
      const monthsBn = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      return `${day} ${monthsBn[d.getMonth()]}, ${year}`;
    }
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string, lang: Language = 'en'): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diffSec < 60) {
      return lang === 'bn' ? 'এইমাত্র' : 'Just now';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return lang === 'bn' 
        ? `${toBengaliDigits(diffMin)} মিনিট আগে` 
        : `${diffMin}m ago`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      return lang === 'bn' 
        ? `${toBengaliDigits(diffHours)} ঘণ্টা আগে` 
        : `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
      return lang === 'bn' 
        ? `${toBengaliDigits(diffDays)} দিন আগে` 
        : `${diffDays}d ago`;
    }
    return formatDate(dateString, lang);
  } catch {
    return dateString;
  }
}

export function maskNid(nid: string): string {
  if (!nid) return '•••• •••• ••••';
  if (nid.length <= 4) return nid;
  const lastFour = nid.slice(-4);
  return `•••• •••• ••${lastFour}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return '017••••••00';
  if (phone.length < 7) return phone;
  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}•••••${end}`;
}
