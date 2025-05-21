import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  
  if (error) throw error;
  
  if (data.user) {
    // Create user profile
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      username,
      status: 'online',
      created_at: new Date().toISOString(),
    });
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Update user status to online
  if (data.user) {
    await supabase
      .from('users')
      .update({ status: 'online' })
      .eq('id', data.user.id);
  }
  
  return data;
}

export async function signOut() {
  // Get the current user before signing out
  const { data: { user } } = await supabase.auth.getUser();
  
  // Update user status to offline if user exists
  if (user) {
    await supabase
      .from('users')
      .update({ status: 'offline' })
      .eq('id', user.id);
  }
  
  // Sign out
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  
  if (user) {
    // Get the user's profile data
    const { data, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) throw profileError;
    return data;
  }
  
  return null;
}

// Server helper functions
export async function createServer(name: string, description: string, ownerId: string) {
  // Create the server
  const { data: serverData, error: serverError } = await supabase
    .from('servers')
    .insert({
      name,
      description,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (serverError) throw serverError;
  
  // Add owner as a member with 'owner' role
  const { error: memberError } = await supabase
    .from('server_members')
    .insert({
      server_id: serverData.id,
      user_id: ownerId,
      role: 'owner',
      joined_at: new Date().toISOString(),
    });
  
  if (memberError) throw memberError;
  
  // Create a default 'general' text channel
  const { error: channelError } = await supabase
    .from('channels')
    .insert({
      server_id: serverData.id,
      name: 'general',
      type: 'text',
      position: 0,
      created_at: new Date().toISOString(),
    });
  
  if (channelError) throw channelError;
  
  return serverData;
}

export async function getUserServers(userId: string) {
  const { data, error } = await supabase
    .from('server_members')
    .select(`
      server_id,
      servers:server_id(*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  
  return data.map(item => item.servers);
}

export async function getServerDetails(serverId: string) {
  const { data, error } = await supabase
    .from('servers')
    .select(`
      *,
      members:server_members(
        *,
        user:user_id(id, username, avatar_url, status)
      ),
      channels:channels(*)
    `)
    .eq('id', serverId)
    .single();
  
  if (error) throw error;
  
  return data;
}

// Channel helper functions
export async function createChannel(serverId: string, name: string, type: 'text' | 'voice', position: number) {
  const { data, error } = await supabase
    .from('channels')
    .insert({
      server_id: serverId,
      name,
      type,
      position,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
}

export async function getChannelMessages(channelId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      user:user_id(id, username, avatar_url),
      attachments:attachments(*)
    `)
    .eq('channel_id', channelId)
    .order('created_at');
  
  if (error) throw error;
  
  return data;
}

export async function sendMessage(channelId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      channel_id: channelId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
}

// Profile helper functions
export async function updateUserProfile(userId: string, profileData: Partial<{
  username: string;
  avatar_url: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  custom_status: string;
}>) {
  const { data, error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
}