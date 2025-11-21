import { useAuth } from "@getmocha/users-service/react";
import { LogOut, Menu, Sparkles, User, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Header = memo(function Header() {
  const navigate = useNavigate();
  const { user, redirectToLogin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthAction = useCallback(async () => {
    if (user) {
      await logout();
      navigate('/');
    } else {
      await redirectToLogin();
    }
    setMobileMenuOpen(false);
  }, [user, logout, navigate, redirectToLogin]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  }, [navigate]);

  // Закрывать меню при изменении размера экрана на десктоп
  useEffect(() => {
    const handleResize = () => {
      // Более точная проверка breakpoint md (768px)
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    // Добавить debounce для оптимизации
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [mobileMenuOpen]);

  // Блокировать скролл при открытом меню
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Принудительно скрывать меню на десктопе при загрузке
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    // Проверить при монтировании компонента
    checkScreenSize();
  }, []);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
      role="banner"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-1 xs:space-x-2 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="BrandedBy - Go to homepage"
          >
            <div className="p-1.5 xs:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg xs:rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-sm xs:text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrandedBY
              </h1>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">AI Video Generator</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8" id="navigation" role="navigation" aria-label="Main navigation">
            <button 
              onClick={() => navigate('/celebrities')}
              className="text-sm lg:text-base text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
              aria-label="Browse celebrity AI models"
            >
              Celebrities
            </button>
            <button 
              onClick={() => navigate('/blog')}
              className="text-sm lg:text-base text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Blog
            </button>
            <button 
              onClick={() => navigate('/selfie-upload')}
              className="text-sm lg:text-base text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Upload
            </button>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="text-sm lg:text-base text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
            >
              Pricing
            </button>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base text-gray-700 hover:text-purple-600 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/admin-panel')}
                  className="flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base text-gray-700 hover:text-orange-600 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-orange-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden lg:inline">Admin</span>
                </button>
                <button
                  onClick={handleAuthAction}
                  className="flex items-center space-x-1 lg:space-x-2 bg-gray-100 text-gray-700 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm lg:text-base"
                >
                  <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthAction}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button - только на мобильных устройствах */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl transition-all duration-200"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <Menu className={`absolute w-6 h-6 transition-all duration-300 ${
                mobileMenuOpen 
                  ? 'rotate-180 opacity-0 scale-75' 
                  : 'rotate-0 opacity-100 scale-100'
              }`} />
              <X className={`absolute w-6 h-6 transition-all duration-300 ${
                mobileMenuOpen 
                  ? 'rotate-0 opacity-100 scale-100' 
                  : 'rotate-180 opacity-0 scale-75'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - только на мобильных устройствах */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
        mobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Mobile Menu Panel */}
        <div className={`absolute top-16 left-0 right-0 bottom-0 bg-white transform transition-transform duration-300 ease-out overflow-y-auto ${
          mobileMenuOpen 
            ? 'translate-y-0' 
            : '-translate-y-full'
        }`}>
          <nav className="flex flex-col p-4 space-y-2" role="navigation" aria-label="Mobile navigation">
              <button 
                onClick={() => handleNavigate('/celebrities')}
                className="w-full text-left px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-purple-200"
                aria-label="Browse celebrity AI models"
              >
                Celebrities
              </button>
              <button 
                onClick={() => handleNavigate('/blog')}
                className="w-full text-left px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-purple-200"
              >
                Blog
              </button>
              <button 
                onClick={() => handleNavigate('/selfie-upload')}
                className="w-full text-left px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-purple-200"
              >
                Upload Selfie
              </button>
              <button 
                onClick={() => {
                  handleNavigate('/');
                  setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-purple-200"
              >
                Pricing
              </button>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-6 space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => handleNavigate('/dashboard')}
                      className="w-full flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-purple-200"
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => handleNavigate('/admin-panel')}
                      className="w-full flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-orange-200"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Admin Panel</span>
                    </button>
                    <button
                      onClick={handleAuthAction}
                      className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAuthAction}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
    </header>
  );
});

export default Header;
