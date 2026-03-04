import { useState } from 'react';
import { useLeads } from '../../context/LeadsContext';
import LeadCard from './LeadCard';
import LeadFilter from './LeadFilter';
import { ArrowUpDown } from 'lucide-react';

const SORTS = [
  { value: 'date', label: 'תאריך' },
  { value: 'location', label: 'מיקום' },
];

export default function LeadFeed() {
  const { leads } = useLeads();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');

  const filtered = leads
    .filter(l => !filter || l.address?.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      return (a.address || '').localeCompare(b.address || '', 'he');
    });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <LeadFilter value={filter} onChange={setFilter} />
        </div>
        <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden bg-white shrink-0">
          <span className="ps-3 pe-1">
            <ArrowUpDown size={14} className="text-gray-400" />
          </span>
          {SORTS.map(s => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                sort === s.value
                  ? 'bg-[#E86A3E] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">אין לידים להצגה</p>
          {filter && <p className="text-sm mt-1">נסה לשנות את הסינון</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lead => <LeadCard key={lead.id} lead={lead} />)}
        </div>
      )}
    </div>
  );
}
