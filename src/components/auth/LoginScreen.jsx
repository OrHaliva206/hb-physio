import { useState } from 'react';
import { X, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function ProfilePicker({ onUsePassword }) {
  const { profiles, loginFromProfile, deleteProfile } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E86A3E] mb-3">
            <span className="text-white font-extrabold text-2xl tracking-tight">HB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">HB Physio</h1>
          <p className="text-sm text-gray-500 mt-1">מי את/ה?</p>
        </div>

        <div className="space-y-2">
          {profiles.map(profile => (
            <div key={profile.id} className="relative group">
              <button
                onClick={() => loginFromProfile(profile)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#E86A3E] hover:bg-orange-50 transition-all text-start"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 ${
                  profile.role === 'manager' ? 'bg-[#E86A3E]' : 'bg-gray-400'
                }`}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.role === 'manager' ? 'מנהל' : 'פיזיותרפיסט'}</p>
                </div>
              </button>
              <button
                onClick={() => deleteProfile(profile.id)}
                className="absolute top-2 end-2 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-red-50"
                title="הסר פרופיל"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onUsePassword}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1 flex items-center justify-center gap-1.5"
        >
          <Users size={14} />
          כניסה עם סיסמה
        </button>
      </div>
    </div>
  );
}

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

function PasswordScreen({ onBack }) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

        {onBack && (
          <button
            onClick={onBack}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            חזור לבחירת פרופיל
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginScreen({ pendingName }) {
  const { profiles } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  if (pendingName) return <NameScreen />;

  if (profiles.length > 0 && !showPassword) {
    return <ProfilePicker onUsePassword={() => setShowPassword(true)} />;
  }

  return (
    <PasswordScreen onBack={profiles.length > 0 ? () => setShowPassword(false) : null} />
  );
}
