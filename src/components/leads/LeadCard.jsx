import { Phone, MapPin, Clock, Ban, RefreshCw, Trash2, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLeads } from '../../context/LeadsContext';
import { useAuth } from '../../context/AuthContext';
import { STATUS_COLORS } from '../../config';

const STATUS_OPTIONS = [
  { value: 'open',      label: 'פתוח' },
  { value: 'handling',  label: 'מטפל - יוצר קשר בקרוב' },
  { value: 'contacted', label: 'נוצר קשר' },
  { value: 'flexible',  label: 'עניין גמיש' },
];

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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-s-4 ${borderColor} p-4 space-y-3`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{lead.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={lead.status} />
          {role === 'manager' && (
            <button onClick={handleDelete} className="text-gray-300 hover:text-red-400 transition-colors">
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
            <span className="text-[#E86A3E] shrink-0 font-bold text-xs mt-0.5">Rx</span>
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
            <RefreshCw size={14} className="text-[#F2C96C] shrink-0" />
            <span className="text-[#b8960a] font-medium text-xs">טיפול חוזר</span>
          </div>
        )}
        {lead.claimedBy && (
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-500 text-xs">בטיפול: {lead.claimedBy}</span>
          </div>
        )}
      </div>

      {/* Status actions */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {STATUS_OPTIONS.filter(o => o.value !== lead.status).map(opt => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-[#E86A3E] hover:text-[#E86A3E] transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
