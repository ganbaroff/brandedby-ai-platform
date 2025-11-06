import { useAuth } from "@getmocha/users-service/react";
import { LogOut, Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const { user, redirectToLogin, logout } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await logout();
      navigate('/');
    } else {
      await redirectToLogin();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrandedBY
              </h1>
              <p className="text-xs text-gray-500 -mt-1">AI Video Generator</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/celebrities')}
              className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Celebrities
            </button>
            <button 
              onClick={() => navigate('/blog')}
              className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Блог
            </button>
            <button 
              onClick={() => navigate('/selfie-upload')}
              className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Upload Selfie
            </button>
            <button 
              onClick={() => navigate('/#pricing')}
              className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Pricing
            </button>
          </nav>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/admin-panel')}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={handleAuthAction}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuthAction}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
