import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { user, logout } = useAuth();
  const [showLanding, setShowLanding] = useState(true);

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('velon_has_visited');
    if (hasVisited || user) {
      setShowLanding(false);
    }
  }, [user]);

  const handleGetStarted = () => {
    localStorage.setItem('velon_has_visited', 'true');
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    localStorage.removeItem('velon_has_visited');
    setShowLanding(true);
  };

  if (showLanding && !user) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!user) {
    return <Login onBack={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}