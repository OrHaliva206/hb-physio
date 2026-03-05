const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `אתה עוזר חילוץ נתונים עבור מרפאת פיזיותרפיה. חלץ פרטי מטופל מהודעה בעברית והחזר אך ורק JSON תקין עם השדות הבאים:
- name: שם מלא של המטופל
- phone: מספר טלפון ישראלי (פורמט: 05X-XXXXXXX)
- address: כתובת מלאה כולל עיר
- complaint: תלונה רפואית / סיבת הפנייה
- preferredHours: שעות מועדפות לטיפול
- blackoutTimes: זמנים בהם לא יכולים להיפגש
- recurring: true אם צריך טיפול חוזר, אחרת false
אם שדה לא מוזכר, השאר אותו כמחרוזת ריקה (או false לבוליאן).`;

async function groqParse(rawText) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: rawText },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!res.ok) throw new Error(`LLM error: ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

function mockParse(rawText) {
  const IL_PHONE_RE = /0(5[0-9])[- ]?(\d{7})/;
  const HE_NAME_RE = /^([\u05D0-\u05EA ]{2,20})/;
  const phoneMatch = rawText.match(IL_PHONE_RE);
  const nameMatch = rawText.match(HE_NAME_RE);
  return {
    name: nameMatch ? nameMatch[1].trim() : '',
    phone: phoneMatch ? `0${phoneMatch[1]}-${phoneMatch[2]}` : '',
    address: '', complaint: '', preferredHours: '', blackoutTimes: '', recurring: false,
  };
}

export async function parseLeadText(rawText) {
  const parsed = GROQ_API_KEY
    ? await groqParse(rawText)
    : mockParse(rawText);
  return { ...parsed, rawText };
}
