import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, X, CheckCheck, Sparkles, AlertCircle, DollarSign, Trophy, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, language, setActiveReviewerTab, setCurrentRole } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'level_up':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'revision':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notification Center'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} ${language === 'bn' ? 'টি নতুন বার্তা' : 'unread alerts'}`
                  : language === 'bn' ? 'সব নোটিফিকেশন পড়া হয়েছে' : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সব পঠিত' : 'Mark all read'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <Bell className="w-12 h-12 text-slate-600 mb-2 stroke-1" />
              <p className="text-sm text-slate-400">
                {language === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.type === 'opportunity') {
                    setCurrentRole('reviewer');
                    setActiveReviewerTab('opportunities');
                    navigate('/reviewer');
                    onClose();
                  } else if (notif.type === 'revision') {
                    setCurrentRole('reviewer');
                    setActiveReviewerTab('tasks');
                    navigate('/reviewer/tasks');
                    onClose();
                  } else if (notif.type === 'payment') {
                    setCurrentRole('reviewer');
                    setActiveReviewerTab('wallet');
                    navigate('/reviewer/wallet');
                    onClose();
                  } else if (notif.type === 'level_up') {
                    setCurrentRole('reviewer');
                    setActiveReviewerTab('profile');
                    navigate('/reviewer/profile');
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60'
                    : 'bg-slate-800/80 border-emerald-500/30 hover:bg-slate-800 shadow-lg shadow-emerald-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                        {language === 'bn' ? notif.titleBn : notif.titleEn}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatRelativeTime(notif.createdAt, language)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {language === 'bn' ? notif.messageBn : notif.messageEn}
                    </p>

                    {(notif.type === 'opportunity' || notif.type === 'revision') && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
