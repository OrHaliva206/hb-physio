import { X, Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

function Toast({ toast }) {
  const { dismissToast } = useNotifications();
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 min-w-[220px] max-w-xs border-s-4 border-s-[#E86A3E] animate-in slide-in-from-bottom-2">
      <Bell size={16} className="text-[#E86A3E] shrink-0" />
      <span className="text-sm text-gray-700 flex-1">{toast.message}</span>
      <button
        onClick={() => dismissToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useNotifications();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 start-4 z-50 flex flex-col gap-2">
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
