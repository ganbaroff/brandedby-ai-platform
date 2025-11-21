import { Instagram, Mail, Sparkles, Twitter, Youtube } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router";

const Footer = memo(function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would normally send to your newsletter service
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  }, [email]);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">BrandedBY</h3>
                <p className="text-sm text-gray-400">AI Video Generator</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create personalized celebrity videos with cutting-edge AI technology. 
              Choose from Azerbaijani celebrities or upload your selfie for professional results.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNavigation('/celebrities')} className="text-gray-400 hover:text-white transition-colors text-left">Celebrities</button></li>
              <li><button onClick={() => handleNavigation('/selfie-upload')} className="text-gray-400 hover:text-white transition-colors text-left">Upload Selfie</button></li>
              <li><button onClick={() => handleNavigation('/')} className="text-gray-400 hover:text-white transition-colors text-left">Home</button></li>
              <li><button onClick={() => { handleNavigation('/'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-400 hover:text-white transition-colors text-left">Pricing</button></li>
              <li><button onClick={() => handleNavigation('/blog')} className="text-gray-400 hover:text-white transition-colors text-left">Blog</button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@brandedby.com" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="mailto:faq@brandedby.com" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="mailto:contact@brandedby.com" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><button onClick={() => alert('Privacy Policy page coming soon')} className="text-gray-400 hover:text-white transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => alert('Terms of Service page coming soon')} className="text-gray-400 hover:text-white transition-colors text-left">Terms of Service</button></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="mailto:contact@brandedby.com" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Subscribe to our newsletter</p>
              <form onSubmit={handleSubscribe} className="flex flex-col xs:flex-row gap-2 xs:gap-0">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 bg-gray-800 rounded-lg xs:rounded-l-lg xs:rounded-r-none border-0 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg xs:rounded-r-lg xs:rounded-l-none text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  {subscribed ? "✓ Subscribed!" : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-gray-400 text-sm">
              © 2024 BrandedBY. All rights reserved.
            </p>
            {/* Admin Access Button */}
            <button
              onClick={() => handleNavigation('/admin-panel')}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors opacity-50 hover:opacity-100"
              title="Admin Panel Access"
            >
              Admin
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Made with ❤️ for the Azerbaijani community
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
