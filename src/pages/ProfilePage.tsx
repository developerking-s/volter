import { useState, useEffect } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Save, User, CheckCircle } from 'lucide-react';
import ServerSidebar from '../components/layout/ServerSidebar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { updateUserProfile } from '../lib/supabase';

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [customStatus, setCustomStatus] = useState('');
  const [status, setStatus] = useState<'online' | 'idle' | 'dnd' | 'offline'>('online');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    document.title = 'Volter | Profile Settings';
    
    if (user) {
      setUsername(user.username);
      setAvatarUrl(user.avatar_url || '');
      setCustomStatus(user.custom_status || '');
      setStatus(user.status);
    }
  }, [user]);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUserProfile(user.id, {
        username,
        avatar_url: avatarUrl,
        status,
        custom_status: customStatus,
      });
      
      await loadUser();
      setIsSaved(true);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
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
            <User size={28} className="text-indigo-400 mr-3" />
            <h1 className="text-2xl font-bold">Profile Settings</h1>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="text-center">
                  <Avatar
                    src={avatarUrl}
                    alt={username}
                    size="xl"
                    status={status}
                  />
                  <div className="mt-4 text-sm text-gray-400">
                    Preview
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <Input
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your display name"
                  />
                  
                  <Input
                    label="Avatar URL"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    helperText="Enter a URL for your profile picture"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className={`px-3 py-2 rounded-md flex items-center ${
                          status === 'online' 
                            ? 'bg-gray-700 ring-2 ring-green-500' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setStatus('online')}
                      >
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        Online
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-2 rounded-md flex items-center ${
                          status === 'idle' 
                            ? 'bg-gray-700 ring-2 ring-yellow-500' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setStatus('idle')}
                      >
                        <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                        Idle
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-2 rounded-md flex items-center ${
                          status === 'dnd' 
                            ? 'bg-gray-700 ring-2 ring-red-500' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setStatus('dnd')}
                      >
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                        Do Not Disturb
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-2 rounded-md flex items-center ${
                          status === 'offline' 
                            ? 'bg-gray-700 ring-2 ring-gray-500' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setStatus('offline')}
                      >
                        <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                        Invisible
                      </button>
                    </div>
                  </div>
                  
                  <Input
                    label="Custom Status"
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    placeholder="What are you up to?"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="flex items-center"
                >
                  {isSaved ? (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="bg-gray-700 rounded-md px-4 py-2 text-gray-300">
                  {user.email}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Created
                </label>
                <div className="bg-gray-700 rounded-md px-4 py-2 text-gray-300">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="mr-3">
                  Change Password
                </Button>
                <Button variant="danger">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}