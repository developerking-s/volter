import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Send, PlusCircle, Smile, Paperclip } from 'lucide-react';
import { useServers } from '../lib/hooks/useServers';
import { useAuth } from '../lib/hooks/useAuth';
import ServerSidebar from '../components/layout/ServerSidebar';
import ChannelSidebar from '../components/layout/ChannelSidebar';
import Avatar from '../components/ui/Avatar';
import { Channel, Message as MessageType } from '../lib/types';
import { formatRelativeTime } from '../lib/utils';
import { sendMessage, getChannelMessages } from '../lib/supabase';

export default function ServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get('channel');
  const { currentServer, fetchServerDetails } = useServers();
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch server details if needed
  useEffect(() => {
    if (serverId && (!currentServer || currentServer.id !== serverId)) {
      fetchServerDetails(serverId);
    }
  }, [serverId, currentServer, fetchServerDetails]);
  
  // Set current channel
  useEffect(() => {
    if (currentServer?.channels) {
      if (channelId) {
        const channel = currentServer.channels.find(c => c.id === channelId);
        if (channel) {
          setCurrentChannel(channel);
          return;
        }
      }
      
      // Default to first text channel if no channel is specified or found
      const firstTextChannel = currentServer.channels.find(c => c.type === 'text');
      if (firstTextChannel) {
        setCurrentChannel(firstTextChannel);
      }
    }
  }, [currentServer, channelId]);
  
  // Fetch messages for the current channel
  useEffect(() => {
    if (currentChannel) {
      document.title = `#${currentChannel.name} | ${currentServer?.name || 'Volter'}`;
      
      const fetchMessages = async () => {
        try {
          const channelMessages = await getChannelMessages(currentChannel.id);
          setMessages(channelMessages || []);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };
      
      fetchMessages();
    }
  }, [currentChannel, currentServer]);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !currentChannel || !user) return;
    
    try {
      const newMessage = await sendMessage(currentChannel.id, user.id, messageInput);
      setMessages([...messages, { ...newMessage, user }]);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  if (!currentServer || !currentChannel) {
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        <ServerSidebar />
        <ChannelSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ServerSidebar />
      <ChannelSidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Channel header */}
        <header className="h-14 border-b border-gray-800 px-4 flex items-center">
          <div className="flex items-center">
            {currentChannel.type === 'text' ? (
              <span className="text-gray-400 mr-2">#</span>
            ) : (
              <span className="text-gray-400 mr-2">🔊</span>
            )}
            <h2 className="font-semibold">{currentChannel.name}</h2>
          </div>
          <div className="ml-4 text-sm text-gray-400 border-l border-gray-700 pl-4">
            {currentChannel.type === 'text' 
              ? 'Text Channel' 
              : 'Voice Channel'}
          </div>
        </header>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="text-6xl mb-4">👋</div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                Welcome to #{currentChannel.name}!
              </h3>
              <p>This is the beginning of this channel.</p>
              <p>Be the first to send a message!</p>
            </div>
          )}
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-gray-800">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <button 
              type="button" 
              className="p-2 rounded-full text-gray-400 hover:text-gray-300 hover:bg-gray-700"
            >
              <PlusCircle size={20} />
            </button>
            
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message #${currentChannel.name}`}
              className="flex-1 bg-gray-700 rounded-md px-4 py-2 mx-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <button 
              type="button" 
              className="p-2 rounded-full text-gray-400 hover:text-gray-300 hover:bg-gray-700"
            >
              <Paperclip size={20} />
            </button>
            
            <button 
              type="button" 
              className="p-2 rounded-full text-gray-400 hover:text-gray-300 hover:bg-gray-700 mr-2"
            >
              <Smile size={20} />
            </button>
            
            <button 
              type="submit" 
              className="p-2 rounded-full text-gray-400 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!messageInput.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function Message({ message }: { message: MessageType }) {
  return (
    <div className="flex group hover:bg-gray-800 p-2 rounded-md -mx-2">
      <Avatar
        src={message.user.avatar_url}
        alt={message.user.username}
        size="md"
      />
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-medium text-white">{message.user.username}</span>
          <span className="ml-2 text-xs text-gray-400">
            {formatRelativeTime(message.created_at)}
          </span>
        </div>
        <div className="text-gray-300 break-words">{message.content}</div>
      </div>
    </div>
  );
}