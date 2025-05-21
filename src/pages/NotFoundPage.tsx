import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="text-9xl font-bold text-indigo-500 mb-4">404</div>
      <h1 className="text-4xl font-bold mb-6">Page Not Found</h1>
      <p className="text-gray-400 text-center max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button className="flex items-center">
          <Home size={18} className="mr-2" />
          Return Home
        </Button>
      </Link>
    </div>
  );
}