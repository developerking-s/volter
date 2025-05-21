/*
  # Initial Schema Setup for Volter

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User's unique identifier
      - `email` (text, unique) - User's email address
      - `username` (text) - User's display name
      - `avatar_url` (text) - URL to user's avatar image
      - `status` (text) - User's status (online, idle, dnd, offline)
      - `custom_status` (text) - User's custom status message
      - `created_at` (timestamptz) - When user was created
    
    - `servers`
      - `id` (uuid, primary key) - Server's unique identifier
      - `name` (text) - Server's name
      - `icon_url` (text) - URL to server's icon image
      - `owner_id` (uuid, references users.id) - User ID of server owner
      - `description` (text) - Server description
      - `created_at` (timestamptz) - When server was created
    
    - `server_members`
      - `user_id` (uuid, references users.id) - User ID of member
      - `server_id` (uuid, references servers.id) - Server ID
      - `role` (text) - Member's role in server (owner, admin, member)
      - `nickname` (text) - Member's nickname in this server
      - `joined_at` (timestamptz) - When member joined the server
    
    - `channels`
      - `id` (uuid, primary key) - Channel's unique identifier
      - `server_id` (uuid, references servers.id) - Server ID that channel belongs to
      - `name` (text) - Channel name
      - `type` (text) - Channel type (text, voice)
      - `position` (integer) - Channel position in list
      - `created_at` (timestamptz) - When channel was created
    
    - `messages`
      - `id` (uuid, primary key) - Message's unique identifier
      - `channel_id` (uuid, references channels.id) - Channel ID that message belongs to
      - `user_id` (uuid, references users.id) - User ID of message author
      - `content` (text) - Message content
      - `created_at` (timestamptz) - When message was sent
      - `updated_at` (timestamptz) - When message was last edited
      
    - `attachments`
      - `id` (uuid, primary key) - Attachment's unique identifier
      - `message_id` (uuid, references messages.id) - Message ID that attachment belongs to
      - `file_url` (text) - URL to the attachment file
      - `file_type` (text) - MIME type of the file
      - `file_name` (text) - Original filename
      - `file_size` (integer) - Size of the file in bytes
    
    - `reactions`
      - `id` (uuid, primary key) - Reaction's unique identifier
      - `message_id` (uuid, references messages.id) - Message ID that reaction belongs to
      - `user_id` (uuid, references users.id) - User ID of who added the reaction
      - `emoji` (text) - Emoji used for the reaction
      - `created_at` (timestamptz) - When reaction was added
  
  2. Security
    - Enable RLS on all tables
    - Set up appropriate policies for each table
    - Authenticated users can read/write their own data
    - Server members can read server data they belong to
    - Message authors can edit/delete their own messages
    - Server owners/admins have extended permissions
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'offline',
  custom_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create servers table
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create server_members junction table
CREATE TABLE IF NOT EXISTS server_members (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  nickname TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, server_id)
);

-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL
);

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read their own data" 
  ON users 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can read other users' basic data" 
  ON users 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update their own data" 
  ON users 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Create policies for servers table
CREATE POLICY "Anyone can read servers" 
  ON servers 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Server owners can update their servers" 
  ON servers 
  FOR UPDATE 
  TO authenticated 
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create servers" 
  ON servers 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Server owners can delete their servers" 
  ON servers 
  FOR DELETE 
  TO authenticated 
  USING (owner_id = auth.uid());

-- Create policies for server_members table
CREATE POLICY "Server members can read member list" 
  ON server_members 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM server_members sm 
      WHERE sm.server_id = server_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Server admins can manage members" 
  ON server_members 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM server_members sm 
      WHERE sm.server_id = server_id AND sm.user_id = auth.uid() 
      AND (sm.role = 'owner' OR sm.role = 'admin')
    )
  );

CREATE POLICY "Users can join servers" 
  ON server_members 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Create policies for channels table
CREATE POLICY "Server members can read channels" 
  ON channels 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM server_members sm 
      WHERE sm.server_id = server_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Server admins can manage channels" 
  ON channels 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM server_members sm 
      WHERE sm.server_id = server_id AND sm.user_id = auth.uid() 
      AND (sm.role = 'owner' OR sm.role = 'admin')
    )
  );

-- Create policies for messages table
CREATE POLICY "Channel members can read messages" 
  ON messages 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM channels c 
      JOIN server_members sm ON c.server_id = sm.server_id 
      WHERE c.id = channel_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in channels they have access to" 
  ON messages 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM channels c 
      JOIN server_members sm ON c.server_id = sm.server_id 
      WHERE c.id = channel_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages" 
  ON messages 
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages" 
  ON messages 
  FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Create policies for attachments table
CREATE POLICY "Channel members can read attachments" 
  ON attachments 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM messages m 
      JOIN channels c ON m.channel_id = c.id 
      JOIN server_members sm ON c.server_id = sm.server_id 
      WHERE m.id = message_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add attachments to their messages" 
  ON attachments 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m 
      WHERE m.id = message_id AND m.user_id = auth.uid()
    )
  );

-- Create policies for reactions table
CREATE POLICY "Channel members can read reactions" 
  ON reactions 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM messages m 
      JOIN channels c ON m.channel_id = c.id 
      JOIN server_members sm ON c.server_id = sm.server_id 
      WHERE m.id = message_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions to messages they can see" 
  ON reactions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM messages m 
      JOIN channels c ON m.channel_id = c.id 
      JOIN server_members sm ON c.server_id = sm.server_id 
      WHERE m.id = message_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove their own reactions" 
  ON reactions 
  FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Create indexes for improved performance
CREATE INDEX idx_server_members_server_id ON server_members(server_id);
CREATE INDEX idx_server_members_user_id ON server_members(user_id);
CREATE INDEX idx_channels_server_id ON channels(server_id);
CREATE INDEX idx_messages_channel_id ON messages(channel_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_attachments_message_id ON attachments(message_id);
CREATE INDEX idx_reactions_message_id ON reactions(message_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);