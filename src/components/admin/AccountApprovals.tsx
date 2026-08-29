import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, UserPlus, Smartphone, Briefcase, Shield, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'reviewer' | 'brand' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const roleIcon: Record<AdminAccount['role'], any> = {
  reviewer: Smartphone,
  brand: Briefcase,
  admin: Shield,
};

export const AccountApprovals: React.FC = () => {
  const { language, addToast } = useApp();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const load = useCallback(async (status: 'pending' | 'all') => {
    setIsLoading(true);
    try {
      const path = status === 'pending' ? '/admin/accounts?status=pending' : '/admin/accounts';
      const data = await api.get<AdminAccount[]>(path);
      setAccounts(data);
    } catch (err: any) {
      addToast('Failed to load accounts', err?.message || '', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const handleDecision = async (id: string, decision: 'approve' | 'reject') => {
    setBusyId(id);
    try {
      await api.patch(`/admin/accounts/${id}/${decision}`, {});
      addToast(
        decision === 'approve' ? 'Account Approved' : 'Account Rejected',
        decision === 'approve' ? 'The user can now log in.' : 'The signup request was rejected.',
        decision === 'approve' ? 'success' : 'info'
      );
      setAccounts((prev) =>
        filter === 'pending'
          ? prev.filter((a) => a.id !== id)
          : prev.map((a) => (a.id === id ? { ...a, status: decision === 'approve' ? 'approved' : 'rejected' } : a))
      );
    } catch (err: any) {
      addToast('Action Failed', err?.message || '', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {language === 'bn' ? 'সাইন আপ অনুমোদন' : 'Signup Approvals'}
              </h4>
              <p className="text-xs text-white/50 mt-0.5">
                {language === 'bn'
                  ? 'নতুন রিভিউয়ার ও ব্র্যান্ড অ্যাকাউন্ট অনুমোদন করুন'
                  : 'Review and approve new reviewer & brand accounts'}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-black/30 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'pending' ? 'bg-emerald-500 text-slate-950' : 'text-white/50 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-white/50 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'সব' : 'All'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-white/40">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-10 text-sm text-white/40">
            {language === 'bn' ? 'কোনো অনুরোধ নেই' : 'No signup requests here.'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {accounts.map((acc) => {
              const Icon = roleIcon[acc.role];
              return (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white truncate">{acc.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px] font-bold capitalize">
                          {acc.role}
                        </span>
                        {acc.status !== 'pending' && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              acc.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {acc.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 truncate">
                        {acc.email} {acc.phone ? `• ${acc.phone}` : ''}
                      </p>
                    </div>
                  </div>

                  {acc.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled={busyId === acc.id}
                        onClick={() => handleDecision(acc.id, 'reject')}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/70 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {language === 'bn' ? 'বাতিল' : 'Reject'}
                      </button>
                      <button
                        disabled={busyId === acc.id}
                        onClick={() => handleDecision(acc.id, 'approve')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {language === 'bn' ? 'অনুমোদন' : 'Approve'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
