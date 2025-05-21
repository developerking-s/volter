import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Hash, Volume2, Plus, Settings, UserPlus, ChevronDown, 
  ChevronRight, LogOut
} from 'lucide-react';
import { useServers } from '../../lib/hooks/useServers';
import { useAuth } from '../../lib/hooks/useAuth';
import { Channel, ServerMember } from '../../lib/types';
import Avatar from '../ui/Avatar';
import { cn } from '../../lib/utils';

export default function ChannelSidebar() {
  const { serverId } = useParams<{ serverId: string }>();
  const { currentServer, fetchServerDetails } = useServers();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [textChannelsExpanded, setTextChannelsExpanded] = useState(true);
  const [voiceChannelsExpanded, setVoiceChannelsExpanded] = useState(true);
  const [membersExpanded, setMembersExpanded] = useState(true);
  
  // Fetch server details if needed
  if (serverId && (!currentServer || currentServer.id !== serverId)) {
    fetchServerDetails(serverId);
  }
  
  if (!currentServer) {
    return (
      <div className="w-60 bg-gray-800 h-screen border-r border-gray-700 flex flex-col">
        <div className="p-4 flex items-center justify-center">
          <div className="h-6 w-32 bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Loading skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-700 animate-pulse rounded"></div>
            <div className="h-8 w-full bg-gray-700 animate-pulse rounded"></div>
            <div className="h-8 w-full bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const textChannels = currentServer.channels?.filter(c => c.type === 'text') || [];
  const voiceChannels = currentServer.channels?.filter(c => c.type === 'voice') || [];
  const members = currentServer.members || [];
  
  const onlineMembers = members.filter(m => m.user.status === 'online' || m.user.status === 'idle' || m.user.status === 'dnd');
  const offlineMembers = members.filter(m => m.user.status === 'offline');
  
  // Get the current user's role in this server
  const currentUserMember = members.find(m => m.user_id === user?.id);
  const isOwnerOrAdmin = currentUserMember?.role === 'owner' || currentUserMember?.role === 'admin';
  
  const handleChannelClick = (channel: Channel) => {
    navigate(`/app/server/${serverId}?channel=${channel.id}`);
  };
  
  return (
    <div className="w-60 bg-gray-800 h-screen border-r border-gray-700 flex flex-col">
      {/* Server Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-bold text-white truncate">{currentServer.name}</h2>
        {isOwnerOrAdmin && (
          <button 
            className="text-gray-400 hover:text-white"
            onClick={() => navigate(`/app/server/${serverId}/settings`)}
          >
            <Settings size={16} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Text Channels */}
        <div>
          <div 
            className="flex items-center mb-1 group cursor-pointer"
            onClick={() => setTextChannelsExpanded(!textChannelsExpanded)}
          >
            {textChannelsExpanded ? (
              <ChevronDown size={16} className="text-gray-400 mr-1" />
            ) : (
              <ChevronRight size={16} className="text-gray-400 mr-1" />
            )}
            <span className="uppercase text-xs font-semibold text-gray-400 tracking-wider">Text Channels</span>
            
            {isOwnerOrAdmin && (
              <button 
                className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white"
                title="Create Channel"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          
          {textChannelsExpanded && (
            <div className="space-y-1 ml-1">
              {textChannels.map((channel) => (
                <button
                  key={channel.id}
                  className="channel w-full text-left text-gray-400 hover:text-white"
                  onClick={() => handleChannelClick(channel)}
                >
                  <Hash size={18} />
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
              
              {textChannels.length === 0 && (
                <div className="text-gray-500 text-sm italic p-2">
                  No text channels yet
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Voice Channels */}
        <div>
          <div 
            className="flex items-center mb-1 group cursor-pointer"
            onClick={() => setVoiceChannelsExpanded(!voiceChannelsExpanded)}
          >
            {voiceChannelsExpanded ? (
              <ChevronDown size={16} className="text-gray-400 mr-1" />
            ) : (
              <ChevronRight size={16} className="text-gray-400 mr-1" />
            )}
            <span className="uppercase text-xs font-semibold text-gray-400 tracking-wider">Voice Channels</span>
            
            {isOwnerOrAdmin && (
              <button 
                className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white"
                title="Create Channel"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          
          {voiceChannelsExpanded && (
            <div className="space-y-1 ml-1">
              {voiceChannels.map((channel) => (
                <button
                  key={channel.id}
                  className="channel w-full text-left text-gray-400 hover:text-white"
                  onClick={() => handleChannelClick(channel)}
                >
                  <Volume2 size={18} />
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
              
              {voiceChannels.length === 0 && (
                <div className="text-gray-500 text-sm italic p-2">
                  No voice channels yet
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Members */}
        <div>
          <div 
            className="flex items-center mb-1 group cursor-pointer"
            onClick={() => setMembersExpanded(!membersExpanded)}
          >
            {membersExpanded ? (
              <ChevronDown size={16} className="text-gray-400 mr-1" />
            ) : (
              <ChevronRight size={16} className="text-gray-400 mr-1" />
            )}
            <span className="uppercase text-xs font-semibold text-gray-400 tracking-wider">
              Members — {members.length}
            </span>
            
            {isOwnerOrAdmin && (
              <button 
                className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white"
                title="Invite People"
              >
                <UserPlus size={16} />
              </button>
            )}
          </div>
          
          {membersExpanded && (
            <div className="space-y-4">
              {/* Online members */}
              {onlineMembers.length > 0 && (
                <div className="space-y-1 ml-1">
                  <div className="text-xs text-gray-500 mb-2">ONLINE — {onlineMembers.length}</div>
                  {onlineMembers.map((member) => (
                    <MemberItem key={member.user_id} member={member} />
                  ))}
                </div>
              )}
              
              {/* Offline members */}
              {offlineMembers.length > 0 && (
                <div className="space-y-1 ml-1">
                  <div className="text-xs text-gray-500 mb-2">OFFLINE — {offlineMembers.length}</div>
                  {offlineMembers.map((member) => (
                    <MemberItem key={member.user_id} member={member} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* User panel */}
      {user && (
        <div className="p-2 border-t border-gray-700 bg-gray-900 flex items-center">
          <Avatar
            src={user.avatar_url}
            alt={user.username}
            status={user.status}
            size="sm"
          />
          <div className="ml-2 flex-1 min-w-0">
            <div className="font-medium text-white truncate">{user.username}</div>
            <div className="text-xs text-gray-400 truncate">
              {user.status === 'online' ? 'Online' : 
               user.status === 'idle' ? 'Idle' : 
               user.status === 'dnd' ? 'Do Not Disturb' : 'Offline'}
            </div>
          </div>
          <button 
            className="text-gray-400 hover:text-white"
            title="Leave Server"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function MemberItem({ member }: { member: ServerMember }) {
  return (
    <div className="flex items-center p-2 rounded hover:bg-gray-700 group">
      <Avatar
        src={member.user.avatar_url}
        alt={member.user.username}
        status={member.user.status}
        size="sm"
      />
      <div className="ml-2 flex-1 min-w-0">
        <div className={cn(
          'font-medium truncate',
          member.role === 'owner' ? 'text-indigo-400' : 
          member.role === 'admin' ? 'text-green-400' : 'text-gray-300'
        )}>
          {member.nickname || member.user.username}
        </div>
        {member.role !== 'member' && (
          <div className="text-xs text-gray-400 truncate capitalize">
            {member.role}
          </div>
        )}
      </div>
    </div>
  );
}