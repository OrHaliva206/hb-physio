import { useState, useRef, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function useSpeechRecognition() {
  const isSupported = !!SpeechRecognition;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;
    const rec = new SpeechRecognition();
    rec.lang = 'he-IL';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e) => {
      const result = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      setTranscript(result);
    };

    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    recognitionRef.current = rec;
    return () => rec.abort();
  }, [isSupported]);

  function startListening() {
    if (!isSupported || isListening) return;
    setTranscript('');
    setIsListening(true);
    recognitionRef.current.start();
  }

  function stopListening() {
    if (!isListening) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }

  function resetTranscript() {
    setTranscript('');
  }

  return { isSupported, isListening, transcript, startListening, stopListening, resetTranscript };
}
