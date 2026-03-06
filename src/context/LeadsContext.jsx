import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { mockLeads } from '../data/mockLeads';
import { STATUS_LABELS } from '../config';
import { sendPushNotification } from '../utils/pushNotification';

const LeadsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_LEAD':
      return [action.lead, ...state];
    case 'UPDATE_LEAD':
      return state.map(l => l.id === action.lead.id ? action.lead : l);
    case 'DELETE_LEAD':
      return state.filter(l => l.id !== action.id);
    case 'ADD_NOTE':
      return state.map(l => l.id === action.leadId
        ? { ...l, notes: [...(l.notes || []), action.note] }
        : l
      );
    default:
      return state;
  }
}

export function LeadsProvider({ children }) {
  const [leads, dispatch] = useReducer(reducer, null, () => {
    const stored = localStorage.getItem('hb_leads');
    return stored ? JSON.parse(stored) : mockLeads;
  });

  const [toasts, setToasts] = useState([]);

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('hb_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('hb_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('hb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  function emitToast(message) {
    const id = Date.now() + Math.random();
    setToasts(q => [...q, { id, message }]);
    setTimeout(() => setToasts(q => q.filter(t => t.id !== id)), 4000);
  }

  function dismissToast(id) {
    setToasts(q => q.filter(t => t.id !== id));
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function addLead(leadData) {
    const lead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'open',
      claimedBy: null,
      priority: leadData.priority || 'normal',
      notes: [],
    };
    dispatch({ type: 'ADD_LEAD', lead });
    emitToast(`ליד חדש נוסף: ${lead.name}`);
  }

  function updateStatus(id, status, claimedBy = null, authorName = null) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const updated = { ...lead, status, claimedBy };
    dispatch({ type: 'UPDATE_LEAD', lead: updated });
    emitToast(`סטטוס עודכן: ${STATUS_LABELS[status]}`);
    if (authorName) {
      const notification = {
        id: crypto.randomUUID(),
        leadName: lead.name,
        authorName,
        newStatus: status,
        createdAt: new Date().toISOString(),
      };
      setNotifications(n => [notification, ...n]);
      sendPushNotification(
        'HB Physio — עדכון סטטוס',
        `${authorName} עדכן את ${lead.name} ל-${STATUS_LABELS[status]}`
      );
    }
  }

  function updatePriority(id, priority) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    dispatch({ type: 'UPDATE_LEAD', lead: { ...lead, priority } });
  }

  function deleteLead(id) {
    const lead = leads.find(l => l.id === id);
    dispatch({ type: 'DELETE_LEAD', id });
    emitToast(`ליד נמחק: ${lead?.name || ''}`);
  }

  function addNote(leadId, text, authorName) {
    const note = {
      id: crypto.randomUUID(),
      text,
      author: authorName,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOTE', leadId, note });
  }

  return (
    <LeadsContext.Provider value={{
      leads, toasts, dismissToast,
      notifications, clearNotifications,
      addLead, updateStatus, updatePriority, deleteLead, addNote,
    }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  return useContext(LeadsContext);
}
