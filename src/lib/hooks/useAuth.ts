import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { 
    user, 
    isLoading, 
    error, 
    login, 
    register, 
    logout, 
    loadUser, 
    updateStatus, 
    clearError 
  } = useAuthStore();

  useEffect(() => {
    loadUser();
    
    // Set up event listeners for window focus/blur to update status
    const handleFocus = () => {
      if (user) updateStatus('online');
    };
    
    const handleBlur = () => {
      if (user) updateStatus('idle');
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [loadUser, user, updateStatus]);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    updateStatus
  };
}