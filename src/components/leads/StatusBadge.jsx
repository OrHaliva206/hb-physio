import { STATUS_LABELS, STATUS_COLORS } from '../../config';

export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.open;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
