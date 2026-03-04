const IL_PHONE_RE = /0(5[0-9])[- ]?(\d{7})/;
const HE_NAME_RE = /^([\u05D0-\u05EA ]{2,20})/;

export async function parseLeadText(rawText) {
  await new Promise(r => setTimeout(r, 1500));

  const phoneMatch = rawText.match(IL_PHONE_RE);
  const phone = phoneMatch ? `0${phoneMatch[1]}-${phoneMatch[2]}` : '';

  const nameMatch = rawText.match(HE_NAME_RE);
  const name = nameMatch ? nameMatch[1].trim() : '';

  return {
    name,
    phone,
    address: '',
    complaint: '',
    preferredHours: '',
    blackoutTimes: '',
    recurring: false,
    rawText,
  };
}
