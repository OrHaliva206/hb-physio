import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadsContext';
import LeadFeed from './leads/LeadFeed';
import AddLeadPanel from './manager/AddLeadPanel';
import { LogOut, Users, Bell } from 'lucide-react';
import { STATUS_LABELS } from '../config';
import { requestNotificationPermission } from '../utils/pushNotification';

function NotificationPanel({ notifications, clearNotifications, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function relativeTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'עכשיו';
    if (mins < 60) return `לפני ${mins} דק׳`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `לפני ${hrs} שע׳`;
    return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  }

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 end-0 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 w-80 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-gray-800 text-sm">עדכוני סטטוס</span>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            נקה הכל
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-400 text-sm">אין עדכונים חדשים</div>
      ) : (
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
          {notifications.map(n => (
            <div key={n.id} className="px-4 py-3">
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-semibold">{n.authorName}</span>
                {' עדכן את '}
                <span className="font-semibold">{n.leadName}</span>
                {' ל-'}
                <span className="text-[#E86A3E] font-medium">{STATUS_LABELS[n.newStatus]}</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{relativeTime(n.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppShell() {
  const { role, name, logout } = useAuth();
  const { notifications, clearNotifications } = useLeads();
  const [bellOpen, setBellOpen] = useState(false);
  const isManager = role === 'manager';

  useEffect(() => {
    if (isManager) requestNotificationPermission();
  }, [isManager]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF8F2' }}>
      {/* Header */}
      <header className="border-b border-[#F0E8DC] shadow-sm sticky top-0 z-30" style={{ backgroundColor: '#FFFBF5' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#E86A3E]">
              <span className="text-white font-extrabold text-sm tracking-tight">HB</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 leading-tight text-base">HB Physio</h1>
              <p className="text-xs text-gray-400 leading-tight">
                {isManager ? 'מנהל' : name || 'פיזיותרפיסט'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isManager && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-orange-50 text-[#E86A3E] font-medium px-2.5 py-1 rounded-full border border-orange-100">
                <Users size={12} />
                מנהל
              </span>
            )}

            {/* Bell notification button — visible to manager */}
            {isManager && (
              <div className="relative">
                <button
                  onClick={() => setBellOpen(o => !o)}
                  className="relative flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="עדכוני סטטוס"
                >
                  <Bell size={17} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -end-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <NotificationPanel
                    notifications={notifications}
                    clearNotifications={() => { clearNotifications(); setBellOpen(false); }}
                    onClose={() => setBellOpen(false)}
                  />
                )}
              </div>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm px-2 py-1"
              title="התנתק"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">יציאה</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">
        {isManager && <AddLeadPanel />}
        <LeadFeed />
      </main>
    </div>
  );
}
