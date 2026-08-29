import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Smartphone,
  Briefcase,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

type SignupRole = 'reviewer' | 'brand';

export const SignupPage: React.FC = () => {
  const { language } = useApp();
  const { signup } = useAuth();
  const [searchParams] = useSearchParams();

  const initialRole: SignupRole = searchParams.get('role') === 'brand' ? 'brand' : 'reviewer';

  const [role, setRole] = useState<SignupRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(language === 'bn' ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, password, role });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || (language === 'bn' ? 'সাইন আপ ব্যর্থ হয়েছে' : 'Signup failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-white mb-2">
            {language === 'bn' ? 'অনুরোধ জমা হয়েছে' : 'Request Submitted'}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {language === 'bn'
              ? 'আপনার সাইন আপ অনুরোধ অ্যাডমিনের কাছে পাঠানো হয়েছে। অনুমোদনের পর আপনি লগইন করতে পারবেন।'
              : "Your signup request has been sent to an admin for review. You'll be able to log in once it's approved."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
          >
            {language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to home'}
        </Link>

        <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create an Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'bn'
                ? 'সাইন আপের পর অ্যাডমিন আপনার অ্যাকাউন্ট যাচাই করে অনুমোদন দেবেন।'
                : "After signup, an admin will review and approve your account."}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs mb-5">
            <button
              type="button"
              onClick={() => setRole('reviewer')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'reviewer' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              {language === 'bn' ? 'রিভিউয়ার' : 'Reviewer'}
            </button>
            <button
              type="button"
              onClick={() => setRole('brand')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'brand' ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              {language === 'bn' ? 'ব্র্যান্ড' : 'Brand'}
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {role === 'brand'
                  ? language === 'bn'
                    ? 'ব্র্যান্ড / যোগাযোগের নাম'
                    : 'Brand / Contact Name'
                  : language === 'bn'
                  ? 'পূর্ণ নাম'
                  : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Your name'}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'ইমেইল' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'ফোন (ঐচ্ছিক)' : 'Phone (optional)'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-1"
            >
              {isSubmitting ? (
                language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...'
              ) : (
                <>
                  <span>{language === 'bn' ? 'সাইন আপ করুন' : 'Sign Up'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold">
              {language === 'bn' ? 'সাইন ইন করুন' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
