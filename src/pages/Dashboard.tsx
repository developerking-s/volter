import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { useServers } from '../lib/hooks/useServers';
import ServerSidebar from '../components/layout/ServerSidebar';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import CreateServerModal from '../components/modals/CreateServerModal';

export default function Dashboard() {
  const { user } = useAuth();
  const { servers, createServer } = useServers();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    document.title = 'Volter | Home';
  }, []);
  
  if (!user) {
    return null;
  }
  
  const handleCreateServer = async (name: string, description: string) => {
    try {
      const newServer = await createServer(name, description, user.id);
      navigate(`/app/server/${newServer.id}`);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create server:', error);
    }
  };
  
  // Filter servers based on search query
  const filteredServers = searchQuery
    ? servers.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : servers;
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ServerSidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center">
          <h1 className="text-xl font-bold">Home</h1>
          <div className="relative ml-auto w-full max-w-md">
            <input
              type="text"
              placeholder="Search servers..."
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Welcome message */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <Avatar
                src={user.avatar_url}
                alt={user.username}
                size="lg"
                status={user.status}
              />
              <div className="ml-4">
                <h2 className="text-2xl font-bold">Welcome back, {user.username}!</h2>
                <p className="text-gray-400">
                  {servers.length > 0 
                    ? `You're a member of ${servers.length} server${servers.length !== 1 ? 's' : ''}.` 
                    : 'You haven\'t joined any servers yet.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Server list */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Servers</h2>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <PlusCircle size={18} className="mr-2" /> Create Server
              </Button>
            </div>
            
            {filteredServers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServers.map((server) => (
                  <div 
                    key={server.id} 
                    className="bg-gray-800 rounded-lg p-5 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`/app/server/${server.id}`)}
                  >
                    <div className="flex items-center">
                      {server.icon_url ? (
                        <img 
                          src={server.icon_url} 
                          alt={server.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg">
                          {server.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="font-semibold text-white">{server.name}</h3>
                        <p className="text-sm text-gray-400 truncate max-w-[14rem]">
                          {server.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">
                  {searchQuery 
                    ? 'No servers found matching your search.' 
                    : 'You haven\'t joined any servers yet.'}
                </p>
                {!searchQuery && (
                  <Button 
                    variant="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create Your First Server
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Discover section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Discover Popular Servers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* These would normally be fetched from an API */}
              <ServerCard 
                name="Gaming Hub" 
                description="The place for all gamers to connect, chat, and play together."
                memberCount={15243}
              />
              <ServerCard 
                name="Developer's Den" 
                description="Community for developers to share knowledge and collaborate on projects."
                memberCount={8762}
              />
              <ServerCard 
                name="Art Gallery" 
                description="Share your artwork, get feedback, and connect with other artists."
                memberCount={4231}
              />
            </div>
          </div>
        </div>
      </main>
      
      <CreateServerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateServer}
      />
    </div>
  );
}

function ServerCard({ name, description, memberCount }: { 
  name: string; 
  description: string;
  memberCount: number;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-5 hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg">
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-gray-400">{memberCount.toLocaleString()} members</p>
        </div>
      </div>
      <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
      <Button variant="outline" size="sm" className="mt-3 w-full">
        Join Server
      </Button>
    </div>
  );
}