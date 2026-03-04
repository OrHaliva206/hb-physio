import { useLeads } from '../context/LeadsContext';

export function useNotifications() {
  const { toasts, dismissToast } = useLeads();
  return { toasts, dismissToast };
}
