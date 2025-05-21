import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../supabase';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { loadUser, setUser } = useAuthStore();

  useEffect(() => {
    // Load the current user when the provider mounts
    loadUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Get user profile data
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (!error && data) {
              setUser(data);
            }
          }
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser, setUser]);

  return <>{children}</>;
}