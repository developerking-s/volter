import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, LogOut, Moon, User } from 'lucide-react';
import { useAuth } from '../../lib/hooks/useAuth';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-500">
          Volter
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {!user ? (
              <>
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/app" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        {user ? (
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2">
                <Avatar 
                  src={user.avatar_url} 
                  alt={user.username} 
                  status={user.status}
                />
                <span className="text-gray-300">{user.username}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link
                  to="/app/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <Link
                  to="/app/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:block">
            <Link to="/login">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>
          </div>
        )}
        
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 py-4">
          <div className="container mx-auto px-4">
            <ul className="space-y-4">
              {!user ? (
                <>
                  <li>
                    <Link 
                      to="/" 
                      className="block text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/login" 
                      className="block text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center space-x-3 pb-4 border-b border-gray-700">
                    <Avatar 
                      src={user.avatar_url} 
                      alt={user.username} 
                      status={user.status}
                    />
                    <span className="text-gray-300">{user.username}</span>
                  </li>
                  <li>
                    <Link 
                      to="/app" 
                      className="block text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/app/profile" 
                      className="block text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/app/settings" 
                      className="block text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-300 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}