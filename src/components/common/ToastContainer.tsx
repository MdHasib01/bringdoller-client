import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
            default:
              return <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10';
            case 'error':
              return 'border-rose-500/40 bg-slate-900/95 shadow-rose-500/10';
            case 'warning':
              return 'border-amber-500/40 bg-slate-900/95 shadow-amber-500/10';
            default:
              return 'border-cyan-500/40 bg-slate-900/95 shadow-cyan-500/10';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
