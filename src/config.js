export const MANAGER_PASS = 'manager123';
export const PHYSIO_PASS = 'physio456';

export const STATUS_LABELS = {
  open: 'פתוח',
  handling: 'מטפל - יוצר קשר בקרוב',
  contacted: 'נוצר קשר',
  flexible: 'גמיש, מטפל/ת אחר יכולים ליצור קשר',
};

export const PRIORITY_LABEL = { urgent: 'דחוף' };

export const STATUS_COLORS = {
  open:      { badge: 'bg-blue-100 text-blue-700',    border: 'border-blue-400',   button: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-400' },
  handling:  { badge: 'bg-amber-100 text-amber-700',  border: 'border-amber-400',  button: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400' },
  contacted: { badge: 'bg-green-100 text-green-700',  border: 'border-green-500',  button: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500' },
  flexible:  { badge: 'bg-orange-100 text-orange-700', border: 'border-orange-400', button: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
};
