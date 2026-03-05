const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function transcribeAudio(audioBlob) {
  if (!GROQ_API_KEY) throw new Error('Missing VITE_GROQ_API_KEY');

  const ext = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
  const formData = new FormData();
  formData.append('file', audioBlob, `recording.${ext}`);
  formData.append('model', 'whisper-large-v3');
  formData.append('language', 'he');
  formData.append('response_format', 'text');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    body: formData,
  });

  if (!res.ok) throw new Error(`Whisper error: ${res.status}`);
  return await res.text();
}
