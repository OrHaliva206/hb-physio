import { useRef, useEffect, useState } from 'react';
import { Phone, MapPin, Clock, Ban, RefreshCw, Trash2, User, HeartPulse, ChevronDown } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLeads } from '../../context/LeadsContext';
import { useAuth } from '../../context/AuthContext';
import { STATUS_COLORS, STATUS_LABELS } from '../../config';

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

export default function LeadCard({ lead }) {
  const { updateStatus, deleteLead } = useLeads();
  const { role, name } = useAuth();
  const borderColor = STATUS_COLORS[lead.status]?.border || 'border-gray-300';

  function handleDelete() {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הליד של ${lead.name}?`)) {
      deleteLead(lead.id);
    }
  }

  function handleStatusChange(newStatus) {
    const claimedBy = newStatus === 'open' ? null : (name || 'פיזיו');
    updateStatus(lead.id, newStatus, claimedBy);
  }

  const dateStr = new Date(lead.createdAt).toLocaleDateString('he-IL', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-s-4 ${borderColor} p-4 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{lead.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
        </div>
        {role === 'manager' && (
          <button onClick={handleDelete} className="text-gray-300 hover:text-red-400 transition-colors mt-0.5">
            <Trash2 size={16} />
          </button>
        )}
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
    </div>
  );
}
