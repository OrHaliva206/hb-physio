import { useState } from 'react';
import { useLeads } from '../../context/LeadsContext';

const fields = [
  { key: 'name',           label: 'שם מטופל',        type: 'text',     required: true },
  { key: 'phone',          label: 'טלפון',            type: 'text',     dir: 'ltr' },
  { key: 'address',        label: 'כתובת / מיקום',   type: 'text' },
  { key: 'complaint',      label: 'סיבת פנייה',       type: 'textarea' },
  { key: 'preferredHours', label: 'שעות מועדפות',    type: 'text' },
  { key: 'blackoutTimes',  label: 'זמנים חסומים',    type: 'text' },
];

export default function LeadEditForm({ initialData, onCancel, onPublished }) {
  const { addLead } = useLeads();
  const [form, setForm] = useState(initialData);

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name?.trim()) return;
    addLead(form);
    onPublished();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
        יש לבדוק ולהשלים את הפרטים לפני פרסום
      </div>

      {fields.map(f => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={form[f.key] || ''}
              onChange={e => handleChange(f.key, e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A3E] resize-none"
            />
          ) : (
            <input
              type="text"
              dir={f.dir || 'auto'}
              value={form[f.key] || ''}
              onChange={e => handleChange(f.key, e.target.value)}
              required={f.required}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A3E]"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <input
          id="recurring"
          type="checkbox"
          checked={form.recurring || false}
          onChange={e => handleChange('recurring', e.target.checked)}
          className="accent-[#E86A3E] w-4 h-4"
        />
        <label htmlFor="recurring" className="text-sm text-gray-700">טיפול חוזר</label>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-[#E86A3E] text-white rounded-lg py-2 text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          פרסם ליד
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
