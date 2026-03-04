import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useEffect } from 'react';

export default function VoiceButton({ onTranscript }) {
  const { isSupported, isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) onTranscript(transcript);
  }, [transcript]);

  if (!isSupported) {
    return (
      <button
        disabled
        title="הדפדפן לא תומך בהקלטת קול (נדרש Chrome)"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed text-sm"
      >
        <MicOff size={16} />
        הקלטה לא זמינה
      </button>
    );
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      {isListening ? 'הפסק הקלטה' : 'הקלט קול'}
    </button>
  );
}
