import { Link } from 'react-router-dom';
import { ArrowRight, Users, MessageSquare, Server, Shield } from 'lucide-react';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-gray-900"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your Place to <span className="text-indigo-400">Talk</span> and <span className="text-indigo-400">Connect</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Volter is the easiest way to communicate over voice, video, and text. 
                Chat, hang out, and stay close with your friends and communities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto">
                    Get Started <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
              Everything you need to build your community
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<Users size={32} />}
                title="Create Communities"
                description="Build servers for your friends, gaming groups, or global communities"
              />
              <FeatureCard 
                icon={<MessageSquare size={32} />}
                title="Real-time Chat"
                description="Send messages, share files, and stay connected in real-time"
              />
              <FeatureCard 
                icon={<Server size={32} />}
                title="Organized Channels"
                description="Create text and voice channels to keep conversations organized"
              />
              <FeatureCard 
                icon={<Shield size={32} />}
                title="Secure & Private"
                description="Control who can join your servers with powerful moderation tools"
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-indigo-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join millions of users already on Volter. Create your account today and start building your community.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-indigo-700">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-indigo-500 mb-2">Volter</div>
              <p className="text-gray-400">Your place to talk and connect</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="text-white font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Download</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Nitro</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Jobs</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">© 2025 Volter, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-all">
      <div className="text-indigo-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}