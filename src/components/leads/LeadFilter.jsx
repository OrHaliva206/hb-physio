import { Search } from 'lucide-react';

export default function LeadFilter({ value, onChange }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="סנן לפי מיקום..."
        className="w-full border border-gray-200 rounded-xl pe-9 ps-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A3E] bg-white"
      />
    </div>
  );
}
