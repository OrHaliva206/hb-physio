import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function NameScreen() {
  const { setName } = useAuth();
  const [nameInput, setNameInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setName(nameInput.trim());
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-5">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E86A3E] mb-3">
            <span className="text-white font-extrabold text-lg">HB</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">מה שמך?</h2>
          <p className="text-sm text-gray-500 mt-1">השם יופיע על לידים שתתבע</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            autoFocus
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="שם פרטי"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#E86A3E]"
          />
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="w-full bg-[#E86A3E] text-white rounded-xl py-3 font-semibold text-base hover:bg-orange-600 disabled:opacity-40 transition-colors"
          >
            כניסה למערכת
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginScreen({ pendingName }) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (pendingName) return <NameScreen />;

  function handleLogin(e) {
    e.preventDefault();
    const result = login(password);
    if (!result) setError('סיסמה שגויה, נסה שוב');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E86A3E] mb-3">
            <span className="text-white font-extrabold text-2xl tracking-tight">HB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">HB Physio</h1>
          <p className="text-sm text-gray-500 mt-1">מערכת ניהול פנימית</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="הזן סיסמה"
              autoFocus
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#E86A3E]"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#E86A3E] text-white rounded-xl py-3 font-semibold text-base hover:bg-orange-600 transition-colors"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
