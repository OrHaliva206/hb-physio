import { useRef, useEffect, useState } from 'react';
import { Phone, MapPin, Clock, Ban, RefreshCw, Trash2, User, HeartPulse, ChevronDown, Flame, MessageSquare, Send } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLeads } from '../../context/LeadsContext';
import { useAuth } from '../../context/AuthContext';
import { STATUS_COLORS, STATUS_LABELS, PRIORITY_LABEL } from '../../config';

const ALL_STATUSES = ['open', 'handling', 'contacted', 'flexible'];

function StatusDropdown({ currentStatus, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const colors = STATUS_COLORS[currentStatus];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${colors.button}`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
        <span className="truncate max-w-[160px]">{STATUS_LABELS[currentStatus]}</span>
        <ChevronDown size={13} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 start-0 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[220px]">
          {ALL_STATUSES.filter(s => s !== currentStatus).map(status => {
            const c = STATUS_COLORS[status];
            return (
              <button
                key={status}
                onClick={() => { onChange(status); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-start hover:bg-gray-50 transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
                <span className="text-gray-700">{STATUS_LABELS[status]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NotesSection({ lead }) {
  const { addNote } = useLeads();
  const { name, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const notes = lead.notes || [];

  function handleAdd() {
    if (!text.trim()) return;
    addNote(lead.id, text.trim(), name || (role === 'manager' ? 'מנהל' : 'פיזיו'));
    setText('');
  }

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
    <div className="border-t border-gray-100 pt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <MessageSquare size={13} />
        <span>הערות</span>
        {notes.length > 0 && (
          <span className="bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-medium">{notes.length}</span>
        )}
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {notes.length > 0 && (
            <div className="space-y-1.5">
              {notes.map(note => (
                <div key={note.id} className="bg-gray-50 rounded-lg px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-gray-700">{note.author}</span>
                    <span className="text-gray-400">{relativeTime(note.createdAt)}</span>
                  </div>
                  <p className="text-gray-600">{note.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="הוסף הערה..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#E86A3E]"
            />
            <button
              onClick={handleAdd}
              disabled={!text.trim()}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#E86A3E] text-white rounded-lg text-xs font-medium hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadCard({ lead }) {
  const { updateStatus, updatePriority, deleteLead } = useLeads();
  const { role, name } = useAuth();
  const borderColor = STATUS_COLORS[lead.status]?.border || 'border-gray-300';
  const isUrgent = lead.priority === 'urgent';

  function handleDelete() {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הליד של ${lead.name}?`)) {
      deleteLead(lead.id);
    }
  }

  function handleStatusChange(newStatus) {
    const claimedBy = newStatus === 'open' ? null : (name || 'פיזיו');
    updateStatus(lead.id, newStatus, claimedBy, name || (role === 'manager' ? 'מנהל' : 'פיזיו'));
  }

  const dateStr = new Date(lead.createdAt).toLocaleDateString('he-IL', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-s-4 ${borderColor} overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
      {/* Urgent banner */}
      {isUrgent && (
        <div className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame size={13} className="animate-pulse" />
            דחוף — יצירת קשר מיידי
          </div>
          {role === 'manager' && (
            <button
              onClick={() => updatePriority(lead.id, 'normal')}
              className="text-red-200 hover:text-white text-[10px] font-normal underline transition-colors"
            >
              הסר
            </button>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base">{lead.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {role === 'manager' && !isUrgent && (
            <button
              onClick={() => updatePriority(lead.id, 'urgent')}
              title="סמן כדחוף"
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 transition-colors"
            >
              <Flame size={15} />
            </button>
          )}
          {role === 'manager' && (
            <button onClick={handleDelete} className="text-gray-300 hover:text-red-400 transition-colors p-1">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-[#E86A3E] shrink-0" />
          <span dir="ltr" className="font-mono">{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#E86A3E] shrink-0" />
          <span>{lead.address}</span>
        </div>
        {lead.complaint && (
          <div className="flex items-start gap-2">
            <HeartPulse size={14} className="text-[#E86A3E] shrink-0 mt-0.5" />
            <span>{lead.complaint}</span>
          </div>
        )}
        {lead.preferredHours && (
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#E86A3E] shrink-0" />
            <span>{lead.preferredHours}</span>
          </div>
        )}
        {lead.blackoutTimes && (
          <div className="flex items-center gap-2">
            <Ban size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-500">לא זמין: {lead.blackoutTimes}</span>
          </div>
        )}
        {lead.recurring && (
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="text-amber-400 shrink-0" />
            <span className="text-amber-700 font-medium text-xs">טיפול חוזר</span>
          </div>
        )}
        {lead.claimedBy && (
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-500 text-xs">בטיפול: {lead.claimedBy}</span>
          </div>
        )}
      </div>

      {/* Status dropdown */}
      <div className="pt-1">
        <StatusDropdown currentStatus={lead.status} onChange={handleStatusChange} />
      </div>

      {/* Notes */}
      <NotesSection lead={lead} />
      </div>
    </div>
  );
}
