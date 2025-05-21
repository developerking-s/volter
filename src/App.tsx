import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './lib/hooks/useAuth';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServerPage from './pages/ServerPage';
import ProfilePage from './pages/ProfilePage';
import ServerSettingsPage from './pages/ServerSettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Update the document title based on the application state
    document.title = user ? 'Volter | Dashboard' : 'Volter | Connect and Chat';
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/app" replace /> : <HomePage />} />
      <Route path="/login" element={user ? <Navigate to="/app" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/app" replace /> : <RegisterPage />} />
      
      {/* Protected routes */}
      <Route path="/app" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/app/server/:serverId" element={user ? <ServerPage /> : <Navigate to="/login" replace />} />
      <Route path="/app/server/:serverId/settings" element={user ? <ServerSettingsPage /> : <Navigate to="/login" replace />} />
      <Route path="/app/profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;