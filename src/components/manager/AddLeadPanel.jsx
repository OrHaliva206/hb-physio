import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, PenLine } from 'lucide-react';
import VoiceButton from './VoiceButton';
import LeadEditForm from './LeadEditForm';
import Spinner from '../ui/Spinner';
import { parseLeadText } from '../../utils/aiParser';

const EMPTY_LEAD = {
  name: '', phone: '', address: '', complaint: '',
  preferredHours: '', blackoutTimes: '', recurring: false, rawText: '',
};

export default function AddLeadPanel() {
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  async function handleParse() {
    if (!rawText.trim()) return;
    setIsParsing(true);
    const result = await parseLeadText(rawText);
    setParsedData(result);
    setIsParsing(false);
  }

  function handleReset() {
    setRawText('');
    setParsedData(null);
    setIsParsing(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-s-4 border-s-[#E86A3E] mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-start rounded-2xl"
        style={{ backgroundColor: '#FFFBF5' }}
      >
        <span className="font-semibold text-gray-800">+ הוסף ליד חדש</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
          {!parsedData ? (
            <>
              <label className="block text-sm font-medium text-gray-700">הדבק הודעה גולמית</label>
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                rows={4}
                placeholder="לדוגמה: דניאלה לוי, תל אביב, 054-3321987, כאבי גב תחתון, זמינה בבוקר..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A3E] resize-none"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <VoiceButton onTranscript={t => setRawText(t)} />
                <button
                  onClick={handleParse}
                  disabled={!rawText.trim() || isParsing}
                  className="flex items-center gap-2 px-4 py-2 bg-[#E86A3E] text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles size={15} />
                  הוסף
                </button>
                <button
                  onClick={() => setParsedData(EMPTY_LEAD)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <PenLine size={15} />
                  הוסף ידנית
                </button>
              </div>
              {isParsing && <Spinner text="מנתח טקסט..." />}
            </>
          ) : (
            <LeadEditForm
              initialData={parsedData}
              onCancel={handleReset}
              onPublished={() => { handleReset(); setOpen(false); }}
            />
          )}
        </div>
      )}
    </div>
  );
}
