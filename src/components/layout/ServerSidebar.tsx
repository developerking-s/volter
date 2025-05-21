import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Settings, Hash, User, Users, Volume2 } from 'lucide-react';
import { useServers } from '../../lib/hooks/useServers';
import { useAuth } from '../../lib/hooks/useAuth';
import { Server } from '../../lib/types';
import Avatar from '../ui/Avatar';
import { cn, getInitials } from '../../lib/utils';
import CreateServerModal from '../modals/CreateServerModal';

export default function ServerSidebar() {
  const { servers, createServer } = useServers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleServerClick = (server: Server) => {
    navigate(`/app/server/${server.id}`);
  };
  
  const handleCreateServer = async (name: string, description: string) => {
    if (!user) return;
    try {
      const newServer = await createServer(name, description, user.id);
      navigate(`/app/server/${newServer.id}`);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create server:', error);
    }
  };
  
  return (
    <>
      <div className="w-[72px] bg-gray-900 h-screen flex flex-col items-center py-4 border-r border-gray-800">
        {/* Home button */}
        <Link 
          to="/app" 
          className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold mb-4 hover:rounded-2xl transition-all"
        >
          V
        </Link>
        
        <div className="w-8 h-0.5 bg-gray-700 rounded-full my-2"></div>
        
        {/* Server list */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center gap-3 py-2">
          {servers.map((server) => (
            <button
              key={server.id}
              className={cn(
                'server-icon group relative',
                server.icon_url ? '' : 'bg-indigo-600'
              )}
              onClick={() => handleServerClick(server)}
            >
              {server.icon_url ? (
                <img 
                  src={server.icon_url} 
                  alt={server.name} 
                  className="w-full h-full object-cover rounded-full group-hover:rounded-2xl transition-all" 
                />
              ) : (
                getInitials(server.name)
              )}
              
              {/* Server tooltip */}
              <div className="absolute left-16 p-2 bg-gray-800 rounded shadow-lg text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {server.name}
              </div>
              
              {/* Active indicator */}
              <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full transform scale-y-0 transition-transform origin-left group-hover:scale-y-100"></div>
            </button>
          ))}
        </div>
        
        {/* Add server button */}
        <button
          className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white mb-2 hover:rounded-2xl transition-all group relative"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle size={24} />
          
          {/* Tooltip */}
          <div className="absolute left-16 p-2 bg-gray-800 rounded shadow-lg text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            Add a Server
          </div>
        </button>
        
        {/* Profile button */}
        {user && (
          <Link
            to="/app/profile"
            className="group relative"
          >
            <Avatar
              src={user.avatar_url}
              alt={user.username}
              status={user.status}
              className="cursor-pointer"
            />
            
            {/* Tooltip */}
            <div className="absolute left-16 p-2 bg-gray-800 rounded shadow-lg text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              Your Profile
            </div>
          </Link>
        )}
      </div>
      
      <CreateServerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateServer}
      />
    </>
  );
}