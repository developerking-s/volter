export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  custom_status?: string;
  created_at: string;
}

export interface Server {
  id: string;
  name: string;
  icon_url?: string;
  owner_id: string;
  created_at: string;
  description?: string;
  members: ServerMember[];
  channels: Channel[];
}

export interface ServerMember {
  user_id: string;
  server_id: string;
  role: 'owner' | 'admin' | 'member';
  nickname?: string;
  joined_at: string;
  user: User;
}

export interface Channel {
  id: string;
  server_id: string;
  name: string;
  type: 'text' | 'voice';
  position: number;
  created_at: string;
  messages: Message[];
}

export interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  user: User;
  attachments?: Attachment[];
  reactions?: Reaction[];
}

export interface Attachment {
  id: string;
  message_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number;
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ServerState {
  servers: Server[];
  currentServer: Server | null;
  isLoading: boolean;
  error: string | null;
}