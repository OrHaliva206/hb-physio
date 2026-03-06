import { createContext, useContext, useState, useEffect } from 'react';
import { validatePassword } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('hb_auth');
    return stored ? JSON.parse(stored) : { role: null, name: '', pendingRole: null };
  });

  const [profiles, setProfiles] = useState(() => {
    const stored = localStorage.getItem('hb_profiles');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('hb_profiles', JSON.stringify(profiles));
  }, [profiles]);

  function addProfile(role, name) {
    const exists = profiles.find(p => p.name === name && p.role === role);
    if (exists) return;
    setProfiles(prev => [...prev, { id: crypto.randomUUID(), name, role, createdAt: new Date().toISOString() }]);
  }

  function deleteProfile(id) {
    setProfiles(prev => prev.filter(p => p.id !== id));
  }

  function loginFromProfile(profile) {
    const next = { role: profile.role, name: profile.name, pendingRole: null };
    localStorage.setItem('hb_auth', JSON.stringify(next));
    setAuth(next);
  }

  function login(password) {
    const detectedRole = validatePassword(password);
    if (!detectedRole) return false;

    if (detectedRole === 'manager') {
      const next = { role: 'manager', name: 'מנהל', pendingRole: null };
      localStorage.setItem('hb_auth', JSON.stringify(next));
      setAuth(next);
      addProfile('manager', 'מנהל');
    } else {
      const stored = JSON.parse(localStorage.getItem('hb_auth') || '{}');
      if (stored.name && stored.role === 'physio') {
        const next = { role: 'physio', name: stored.name, pendingRole: null };
        localStorage.setItem('hb_auth', JSON.stringify(next));
        setAuth(next);
      } else {
        setAuth({ role: null, name: '', pendingRole: 'physio' });
      }
    }
    return detectedRole;
  }

  function setName(name) {
    const next = { role: 'physio', name, pendingRole: null };
    localStorage.setItem('hb_auth', JSON.stringify(next));
    setAuth(next);
    addProfile('physio', name);
  }

  function logout() {
    localStorage.removeItem('hb_auth');
    setAuth({ role: null, name: '', pendingRole: null });
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, setName, profiles, loginFromProfile, deleteProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
