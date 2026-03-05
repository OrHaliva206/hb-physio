import { useAuth } from '../context/AuthContext';
import LeadFeed from './leads/LeadFeed';
import AddLeadPanel from './manager/AddLeadPanel';
import { LogOut, Users } from 'lucide-react';

export default function AppShell() {
  const { role, name, logout } = useAuth();
  const isManager = role === 'manager';

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
