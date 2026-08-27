import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Home, ArrowLeft, Smartphone, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setCurrentRole } = useApp();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 text-center relative z-10">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/10">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 mb-3 tracking-tighter">
          404
        </div>

        <h1 className="text-xl font-bold text-white mb-2">
          {language === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
        </h1>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          {language === 'bn'
            ? 'আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল।'
            : 'The page you are looking for might have been removed or the URL is incorrect.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              setCurrentRole('guest');
              navigate('/');
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোম পেজে যান' : 'Back to Home'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentRole('reviewer');
              navigate('/reviewer');
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'রিভিউয়ার অ্যাপ' : 'Reviewer App'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
