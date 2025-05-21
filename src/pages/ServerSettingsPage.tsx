import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Save, Trash2, PlusCircle } from 'lucide-react';
import { useServers } from '../lib/hooks/useServers';
import { useAuth } from '../lib/hooks/useAuth';
import ServerSidebar from '../components/layout/ServerSidebar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ServerSettingsPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const { currentServer, fetchServerDetails } = useServers();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch server details if needed
  useEffect(() => {
    if (serverId && (!currentServer || currentServer.id !== serverId)) {
      fetchServerDetails(serverId);
    }
  }, [serverId, currentServer, fetchServerDetails]);
  
  // Set form values when server data is loaded
  useEffect(() => {
    if (currentServer) {
      setName(currentServer.name);
      setDescription(currentServer.description || '');
      setIconUrl(currentServer.icon_url || '');
    }
  }, [currentServer]);
  
  if (!currentServer) {
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        <ServerSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </main>
      </div>
    );
  }
  
  // Check if user is server owner
  const isOwner = currentServer.owner_id === user?.id;
  
  if (!isOwner) {
    navigate(`/app/server/${serverId}`);
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would update the server details
      console.log('Update server with:', { name, description, iconUrl });
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to server
      navigate(`/app/server/${serverId}`);
    } catch (error) {
      console.error('Failed to update server:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ServerSidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex items-center mb-8">
            <Settings size={28} className="text-indigo-400 mr-3" />
            <h1 className="text-2xl font-bold">Server Settings</h1>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Server Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter server name"
                required
              />
              
              <Input
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's your server about?"
              />
              
              <Input
                label="Server Icon URL"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                helperText="Enter a URL for your server icon"
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Channels</h2>
              <Button variant="secondary" size="sm" className="flex items-center">
                <PlusCircle size={16} className="mr-2" />
                Add Channel
              </Button>
            </div>
            
            <div className="space-y-2">
              {currentServer.channels?.map((channel) => (
                <div 
                  key={channel.id} 
                  className="flex items-center justify-between bg-gray-700 p-3 rounded-md"
                >
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">
                      {channel.type === 'text' ? '#' : '🔊'}
                    </span>
                    <span>{channel.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 rounded-md hover:bg-gray-600 text-gray-400 hover:text-white">
                      <Settings size={16} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-gray-600 text-gray-400 hover:text-white">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            <div className="space-y-2">
              {currentServer.members?.map((member) => (
                <div 
                  key={member.user_id} 
                  className="flex items-center justify-between bg-gray-700 p-3 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm mr-3">
                      {member.user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium">{member.user.username}</span>
                    {member.role !== 'member' && (
                      <span className="ml-2 text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full capitalize">
                        {member.role}
                      </span>
                    )}
                  </div>
                  {member.user_id !== user?.id && (
                    <div className="flex items-center space-x-2">
                      <select 
                        className="bg-gray-600 text-white text-sm rounded-md border-none py-1 pl-2 pr-6"
                        defaultValue={member.role}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button className="p-1.5 rounded-md hover:bg-gray-600 text-red-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-gray-400 mb-4">
              Deleting a server is permanent and cannot be undone. Please be certain.
            </p>
            <Button variant="danger">
              Delete Server
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}