import AccessibilityWidget from "@/react-app/components/AccessibilityWidget";
import BlogSection from "@/react-app/components/BlogSection";
import EnhancedPackageButton from "@/react-app/components/EnhancedPackageButton";
import FaceMorphingDemo from "@/react-app/components/FaceMorphingDemo";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import PerformanceWidget from "@/react-app/components/PerformanceWidget";
import { useHomeSEO } from "@/react-app/hooks/useSEO";
import { analytics } from "@/shared/advanced-analytics";
import celebritiesData from "@/shared/celebrities.json";
import logger from "@/shared/logger";
import {
    ArrowRight,
    Camera,
    Play,
    Sparkles,
    Star,
    Video,
    X,
    Zap
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const Home = memo(function Home() {
  // SEO optimization for home page
  useHomeSEO();
  
  const navigate = useNavigate();
  const [videoModal, setVideoModal] = useState<{ url: string; title: string; celebrity: string } | null>(null);

  // Memoized celebrities data - show all available celebrities
  const celebrities = useMemo(() => celebritiesData, []);

  // Memoized close modal callback
  const closeModal = useCallback(() => setVideoModal(null), []);

  // Load Google Fonts and track page view
  useEffect(() => {
    logger.info('Home page loaded', { 
      celebritiesCount: celebrities.length,
      timestamp: new Date().toISOString()
    });
    
    // Track home page view
    analytics.trackEvent('user', 'page_view', 'home');
  }, [celebrities.length]);

  // Memoized packages data - static content, no need to recalculate
  const packages = useMemo(() => [
    {
      name: 'Standard',
      price: 6,
      duration: '30-second',
      features: [
        '500 generation tokens',
        'Basic celebrity templates',
        'Standard quality output',
        'Community support'
      ],
      popular: false,
      color: 'from-neutral-600 to-neutral-700'
    },
    {
      name: 'Pro',
      price: 19,
      duration: '60-second',
      features: [
        '2,000 generation tokens',
        'Premium celebrity library',
        'HD quality rendering',
        'Custom backgrounds',
        'Priority processing queue'
      ],
      popular: true,
      color: 'from-primary-500 to-secondary-500'
    },
    {
      name: 'Premium',
      price: 49,
      duration: '90-second',
      features: [
        '10,000 generation tokens',
        'Full celebrity collection',
        '4K ultra-high quality',
        'Unlimited custom scenarios',
        'Multi-character videos',
        'Instant token refresh',
        'Developer API access'
      ],
      popular: false,
      color: 'from-secondary-500 to-accent-500'
    }
  ], []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden min-h-[60vh] sm:min-h-[70vh] lg:min-h-[90vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-gradient opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-secondary-50/60 to-accent-50/80" />
        
        {/* Floating Elements - Hidden on mobile for better UX */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full animate-float" />
        <div className="hidden md:block absolute top-32 right-16 w-16 h-16 bg-secondary-200/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="hidden lg:block absolute bottom-40 left-20 w-12 h-12 bg-accent-200/30 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Video Generation
              </div>
              
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Create Amazing
                <span className="gradient-text block">AI Videos</span>
                <span className="text-neutral-700">with Celebrities</span>
              </h1>
              
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed max-w-lg">
                Transform your selfies into stunning videos featuring your favorite celebrities. 
                Powered by cutting-edge AI technology for ultra-realistic results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => navigate('/celebrities')}
                  className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-brand text-white font-semibold rounded-2xl shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <button 
                  onClick={() => setVideoModal({ url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "AI Video Demo", celebrity: "Demo" })}
                  className="group flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-neutral-200 rounded-2xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 ml-0.5" />
                  </div>
                  <span className="font-medium text-neutral-700 text-sm sm:text-base">Watch Demo</span>
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 pt-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-neutral-800">50K+</div>
                  <div className="text-xs sm:text-sm text-neutral-600">Videos Created</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-neutral-800">4.9★</div>
                  <div className="text-xs sm:text-sm text-neutral-600">User Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-neutral-800">24/7</div>
                  <div className="text-xs sm:text-sm text-neutral-600">Support</div>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative lg:block animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Main Demo Container */}
                <div className="glass rounded-3xl p-6 shadow-2xl">
                  <div className="aspect-video bg-gradient-dark rounded-2xl relative overflow-hidden">
                    <FaceMorphingDemo />
                    
                    {/* Overlay UI Elements */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">Live Generation</span>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                      HD Quality
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800">AI Processing</div>
                        <div className="text-sm text-neutral-600">Generation in progress...</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold gradient-text">98%</div>
                  </div>
                </div>
                
                {/* Floating Cards - Hidden on small screens to prevent content overlap */}
                <div className="hidden sm:flex absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-xl items-center justify-center animate-float">
                  <Camera className="w-8 h-8 text-primary-600" />
                </div>
                
                <div className="hidden sm:flex absolute -bottom-4 -left-4 w-16 h-16 bg-secondary-500 rounded-2xl shadow-xl items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <Video className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrity Gallery Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Choose Your <span className="gradient-text">Celebrity</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
              Create videos with the world's biggest stars. More celebrities added weekly!
            </p>
            
            <button
              onClick={() => navigate('/celebrities')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              View All Celebrities
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {celebrities.map((celebrity) => {
              let niches: string[] = [];
              try {
                niches = JSON.parse(celebrity.niches);
              } catch {
                niches = ['Entertainment'];
              }

              return (
                <div
                  key={celebrity.id}
                  onClick={() => navigate(`/celebrity/${celebrity.id}`)}
                  className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={celebrity.image_url}
                      alt={celebrity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-neutral-900 text-sm sm:text-base lg:text-lg mb-1 group-hover:text-primary-600 transition-colors truncate">
                      {celebrity.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3 truncate">{celebrity.role}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                      {niches.slice(0, 2).map((niche, index) => (
                        <span
                          key={index}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-primary-100 text-primary-700 rounded-full"
                        >
                          {niche}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.floor(celebrity.rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`}
                          />
                        ))}
                        <span className="text-xs text-neutral-600 ml-1">{celebrity.rating}</span>
                      </div>
                      <div className="text-xs text-neutral-500">#{celebrity.popularity}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-neutral-900 to-neutral-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto">
              Flexible pricing for everyone. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative p-8 bg-white rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105 ${pkg.popular ? 'ring-4 ring-primary-400 scale-105' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-brand text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{pkg.name}</h3>
                  <div className="text-5xl font-bold text-neutral-900 mb-2">
                    ${pkg.price}
                  </div>
                  <div className="text-neutral-600">{pkg.duration} video</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <EnhancedPackageButton packageData={pkg} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-brand">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Create Magic?
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Join thousands of creators who are already making stunning AI videos. 
            Start your journey today and bring your imagination to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => navigate('/celebrities')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Creating Now
            </button>
            
            <button
              onClick={() => navigate('/celebrities')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Explore Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Video Modal */}
      {videoModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden max-w-4xl w-full animate-scale-in">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <div>
                <h3 id="video-modal-title" className="text-xl font-bold text-neutral-900">{videoModal.title}</h3>
                <p className="text-neutral-600">Featuring {videoModal.celebrity}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                aria-label="Close video modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={videoModal.url}
                title={videoModal.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
      <AccessibilityWidget />
      <PerformanceWidget />
    </div>
  );
});

export default Home;