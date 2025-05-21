import { create } from 'zustand';
import { AuthState, User } from '../types';
import { getCurrentUser, signIn, signOut, signUp } from '../supabase';

export const useAuthStore = create<
  AuthState & {
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    setUser: (user: User | null) => void;
    updateStatus: (status: 'online' | 'idle' | 'dnd' | 'offline') => Promise<void>;
    clearError: () => void;
  }
>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  
  setUser: (user) => set({ user }),
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await signIn(email, password);
      if (user) {
        const userData = await getCurrentUser();
        set({ user: userData, isLoading: false });
      } else {
        set({ isLoading: false, error: 'Failed to get user data after login' });
      }
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },
  
  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await signUp(email, password, username);
      if (user) {
        const userData = await getCurrentUser();
        set({ user: userData, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },
  
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },
  
  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false, error: (error as Error).message });
    }
  },
  
  updateStatus: async (status) => {
    const { user } = get();
    if (!user) return;
    
    try {
      const updatedUser = await updateUserProfile(user.id, { status });
      set({ user: updatedUser });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  clearError: () => set({ error: null }),
}));

async function updateUserProfile(id: string, { status }: { status: 'online' | 'idle' | 'dnd' | 'offline' }) {
  // This is a placeholder that should call the actual function from supabase.ts
  const { supabase } = await import('../supabase');
  const { data, error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}