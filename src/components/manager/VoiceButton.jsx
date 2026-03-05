import { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { transcribeAudio } from '../../utils/whisper';
import { parseLeadText } from '../../utils/aiParser';

const STATES = {
  idle:         { label: 'הקלט',      icon: Mic,     cls: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  recording:    { label: 'הפסק',       icon: MicOff,  cls: 'bg-red-500 text-white animate-pulse' },
  transcribing: { label: 'מתמלל...', icon: Loader2, cls: 'bg-gray-100 text-gray-400 cursor-not-allowed' },
  parsing:      { label: 'מנתח...',   icon: Loader2, cls: 'bg-gray-100 text-gray-400 cursor-not-allowed' },
};

export default function VoiceButton({ onParsed, onError }) {
  const [state, setState] = useState('idle');
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        try {
          setState('transcribing');
          const transcript = await transcribeAudio(blob);
          setState('parsing');
          const parsed = await parseLeadText(transcript);
          onParsed(parsed);
        } catch (err) {
          onError?.(err.message);
        }
        setState('idle');
      };

      recorder.start();
      recorderRef.current = recorder;
      setState('recording');
    } catch {
      onError?.('לא ניתן לגשת למיקרופון');
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  const isProcessing = state === 'transcribing' || state === 'parsing';
  const { label, icon: Icon, cls } = STATES[state];

  return (
    <button
      onClick={state === 'recording' ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${cls}`}
    >
      <Icon size={16} className={isProcessing ? 'animate-spin' : ''} />
      {label}
    </button>
  );
}
