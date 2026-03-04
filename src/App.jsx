import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadsProvider } from './context/LeadsContext';
import LoginScreen from './components/auth/LoginScreen';
import AppShell from './components/AppShell';
import ToastContainer from './components/ui/Toast';

function AppRouter() {
  const { role, pendingRole } = useAuth();
  if (!role) return <LoginScreen pendingName={pendingRole === 'physio'} />;
  return (
    <>
      <AppShell />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LeadsProvider>
        <AppRouter />
      </LeadsProvider>
    </AuthProvider>
  );
}
