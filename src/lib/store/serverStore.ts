import { create } from 'zustand';
import { Server, ServerState } from '../types';
import { 
  createServer as apiCreateServer, 
  getUserServers, 
  getServerDetails 
} from '../supabase';

export const useServerStore = create<
  ServerState & {
    fetchUserServers: (userId: string) => Promise<void>;
    fetchServerDetails: (serverId: string) => Promise<void>;
    setCurrentServer: (server: Server | null) => void;
    createServer: (name: string, description: string, ownerId: string) => Promise<Server>;
    clearError: () => void;
  }
>((set) => ({
  servers: [],
  currentServer: null,
  isLoading: false,
  error: null,
  
  fetchUserServers: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const servers = await getUserServers(userId);
      set({ servers, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },
  
  fetchServerDetails: async (serverId) => {
    set({ isLoading: true, error: null });
    try {
      const server = await getServerDetails(serverId);
      set({ currentServer: server, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },
  
  setCurrentServer: (server) => set({ currentServer: server }),
  
  createServer: async (name, description, ownerId) => {
    set({ isLoading: true, error: null });
    try {
      const server = await apiCreateServer(name, description, ownerId);
      set((state) => ({ 
        servers: [...state.servers, server],
        isLoading: false 
      }));
      return server;
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}));