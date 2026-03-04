import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { mockLeads } from '../data/mockLeads';
import { STATUS_LABELS } from '../config';

const LeadsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_LEAD':
      return [action.lead, ...state];
    case 'UPDATE_LEAD':
      return state.map(l => l.id === action.lead.id ? action.lead : l);
    case 'DELETE_LEAD':
      return state.filter(l => l.id !== action.id);
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

  useEffect(() => {
    localStorage.setItem('hb_leads', JSON.stringify(leads));
  }, [leads]);

  function emitToast(message) {
    const id = Date.now() + Math.random();
    setToasts(q => [...q, { id, message }]);
    setTimeout(() => setToasts(q => q.filter(t => t.id !== id)), 4000);
  }

  function dismissToast(id) {
    setToasts(q => q.filter(t => t.id !== id));
  }

  function addLead(leadData) {
    const lead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'open',
      claimedBy: null,
    };
    dispatch({ type: 'ADD_LEAD', lead });
    emitToast(`ליד חדש נוסף: ${lead.name}`);
  }

  function updateStatus(id, status, claimedBy = null) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const updated = { ...lead, status, claimedBy };
    dispatch({ type: 'UPDATE_LEAD', lead: updated });
    emitToast(`סטטוס עודכן: ${STATUS_LABELS[status]}`);
  }

  function deleteLead(id) {
    const lead = leads.find(l => l.id === id);
    dispatch({ type: 'DELETE_LEAD', id });
    emitToast(`ליד נמחק: ${lead?.name || ''}`);
  }

  return (
    <LeadsContext.Provider value={{ leads, toasts, dismissToast, addLead, updateStatus, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  return useContext(LeadsContext);
}
