import { useEffect } from 'react';
import { useServerStore } from '../store/serverStore';
import { useAuth } from './useAuth';

export function useServers() {
  const { 
    servers, 
    currentServer, 
    isLoading, 
    error, 
    fetchUserServers, 
    fetchServerDetails, 
    setCurrentServer, 
    createServer,
    clearError
  } = useServerStore();
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserServers(user.id);
    }
  }, [user, fetchUserServers]);

  return {
    servers,
    currentServer,
    isLoading,
    error,
    fetchServerDetails,
    setCurrentServer,
    createServer,
    clearError
  };
}