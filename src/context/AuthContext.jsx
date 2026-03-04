import { createContext, useContext, useState } from 'react';
import { validatePassword } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('hb_auth');
    return stored ? JSON.parse(stored) : { role: null, name: '', pendingRole: null };
  });

  function login(password) {
    const detectedRole = validatePassword(password);
    if (!detectedRole) return false;

    if (detectedRole === 'manager') {
      const next = { role: 'manager', name: 'מנהל', pendingRole: null };
      localStorage.setItem('hb_auth', JSON.stringify(next));
      setAuth(next);
    } else {
      const stored = JSON.parse(localStorage.getItem('hb_auth') || '{}');
      if (stored.name && stored.role === 'physio') {
        const next = { role: 'physio', name: stored.name, pendingRole: null };
        localStorage.setItem('hb_auth', JSON.stringify(next));
        setAuth(next);
      } else {
        // Physio without a saved name — ask for it first
        setAuth({ role: null, name: '', pendingRole: 'physio' });
      }
    }
    return detectedRole;
  }

  function setName(name) {
    const next = { role: 'physio', name, pendingRole: null };
    localStorage.setItem('hb_auth', JSON.stringify(next));
    setAuth(next);
  }

  function logout() {
    localStorage.removeItem('hb_auth');
    setAuth({ role: null, name: '', pendingRole: null });
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, setName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
