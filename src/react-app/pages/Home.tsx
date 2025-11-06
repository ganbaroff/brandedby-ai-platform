import ConfigStatus from "@/react-app/components/ConfigStatus";
import FaceMorphingDemo from "@/react-app/components/FaceMorphingDemo";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import celebritiesData from "@/shared/celebrities.json";
import logger from "@/shared/logger";
import {
    ArrowRight,
    Camera,
    Check,
    Play,
    Sparkles,
    Upload,
    Users,
    Video,
    X,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  // Show 9 celebrities on the main page
  const celebrities = celebritiesData.slice(0, 9);
  const navigate = useNavigate();
  const [videoModal, setVideoModal] = useState<{ url: string; title: string; celebrity: string } | null>(null);

  // Load Google Fonts
  useEffect(() => {
    logger.info('Home page loaded', { 
      celebritiesCount: celebrities.length,
      timestamp: new Date().toISOString()
    });

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
      logger.info('Home page unmounted');
    };
  }, [celebrities.length]);

  const packages = [
    {
      name: 'Standard',
      price: 6,
      duration: '30-second',
      features: [
        'Basic templates',
        'Standard quality',
        '48-hour access',
        'With watermark'
      ],
      popular: false,
      color: 'from-gray-600 to-gray-700'
    },
    {
      name: 'Pro',
      price: 19,
      duration: '60-second',
      features: [
        'Custom location upload',
        'HD quality',
        'No watermark',
        'Premium templates',
        'Priority generation'
      ],
      popular: true,
      color: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Premium',
      price: 49,
      duration: '90-second',
      features: [
        'Unlimited locations',
        '4K quality',
        'No watermark',
        'All premium templates',
        'Multiple characters',
        'Instant generation',
        'API access'
      ],
      popular: false,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Animation */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="relative container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-purple-200 rounded-full px-3 py-2 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                <span className="font-medium text-purple-800">AI-Powered Video Generation</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create Videos
                </span>
                <br />
                <span className="text-gray-900">With Celebrities</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Choose from 9 Azerbaijani celebrities or upload your selfie to generate 
                personalized, professional videos with cutting-edge AI technology.
              </p>

              {/* CTA Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => {
                    logger.logUserAction('hero_choose_celebrity_clicked', { 
                      page: 'home',
                      section: 'hero'
                    });
                    navigate('/celebrities');
                  }}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Choose Celebrity</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => {
                    logger.logUserAction('hero_upload_selfie_clicked', { 
                      page: 'home',
                      section: 'hero'
                    });
                    navigate('/selfie-upload');
                  }}
                  className="group bg-white text-gray-900 border-2 border-gray-200 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Upload Selfie</span>
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>

              {/* Features - Mobile Optimized */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">HD Quality</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">Real-time</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">No Watermark</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">Fast Export</span>
                </div>
              </div>
            </div>

            {/* Right Animation Block */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <FaceMorphingDemo />
              </div>
            </div>

          </div>

          {/* Stats Row - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 border-t border-white/30">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">9</div>
              <div className="text-xs sm:text-sm text-gray-600">Celebrities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">30+</div>
              <div className="text-xs sm:text-sm text-gray-600">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">4K</div>
              <div className="text-xs sm:text-sm text-gray-600">Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Celebrities Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Celebrities</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of 9 popular Azerbaijani celebrities to create your personalized video content
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {celebrities.map((celebrity) => (
              <div 
                key={celebrity.id} 
                onClick={() => {
                  logger.logUserAction('celebrity_card_clicked', { 
                    celebrityId: celebrity.id,
                    celebrityName: celebrity.name,
                    page: 'home',
                    section: 'featured_celebrities'
                  });
                  navigate(`/celebrity/${celebrity.id}`);
                }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-4 sm:p-6 flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 transform"
              >
                <img
                  src={celebrity.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'}
                  alt={celebrity.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-3 sm:mb-4"
                />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 text-center">{celebrity.name}</h3>
                <div className="text-purple-600 font-medium mb-2 text-sm sm:text-base">{celebrity.role}</div>
                <p className="text-gray-600 text-xs sm:text-sm text-center mb-3 line-clamp-2 px-2">{celebrity.description}</p>
                
                {/* Niches - Mobile Optimized */}
                <div className="flex flex-wrap gap-1 justify-center mb-3 px-2">
                  {JSON.parse(celebrity.niches).slice(0, 3).map((niche: string) => (
                    <span key={niche} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">{niche}</span>
                  ))}
                  {JSON.parse(celebrity.niches).length > 3 && (
                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">+{JSON.parse(celebrity.niches).length - 3}</span>
                  )}
                </div>

                {/* Rating and Action */}
                <div className="w-full flex items-center justify-between">
                  <div className="text-yellow-500 font-semibold flex items-center gap-1 text-sm">
                    <span>★</span> {celebrity.rating}
                  </div>
                  <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                    Tap to create
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Celebrities Button */}
          <div className="text-center mt-8 sm:mt-12">
            <button 
              onClick={() => {
                logger.logUserAction('view_all_celebrities_clicked', { 
                  page: 'home',
                  section: 'featured_celebrities'
                });
                navigate('/celebrities');
              }}
              className="group bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>View All Celebrities</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Create professional videos in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: 1,
                icon: Users,
                title: 'Choose Your Star',
                description: 'Select from 9 Azerbaijani celebrities or upload your own selfie for personalization.'
              },
              {
                step: 2,
                icon: Video,
                title: 'Customize Content',
                description: 'Pick from 30+ templates, add custom locations, and describe your perfect video.'
              },
              {
                step: 3,
                icon: Zap,
                title: 'Generate & Download',
                description: 'Our AI creates your personalized video in minutes. Download and share instantly.'
              }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4 sm:space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-0">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the package that fits your needs. No hidden fees, no subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div 
                key={pkg.name}
                className={`relative bg-white rounded-3xl p-8 border-2 ${
                  pkg.popular ? 'border-purple-200 shadow-2xl shadow-purple-500/20' : 'border-gray-200'
                } hover:border-purple-300 transition-all duration-300 transform hover:scale-105`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                    <div className="mt-4">
                      <span className="text-5xl font-bold text-gray-900">${pkg.price}</span>
                      <span className="text-gray-600 ml-2">per video</span>
                    </div>
                    <p className="text-gray-600 mt-2">{pkg.duration} video</p>
                  </div>

                  <ul className="space-y-3 text-left">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      pkg.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Example Videos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the quality and creativity of AI-generated celebrity videos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Business Promotion',
                celebrity: 'Aysel Məmmədova',
                thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                comparison: 'AI vs. Real: See the difference in branding impact.'
              },
              {
                title: 'Birthday Greeting',
                celebrity: 'Murad Əliyev',
                thumbnail: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop',
                videoUrl: 'https://www.w3schools.com/html/movie.mp4',
                comparison: 'Personalized AI greeting vs. traditional card.'
              },
              {
                title: 'Novruz Celebration',
                celebrity: 'Leyla Həsənova',
                thumbnail: 'https://images.unsplash.com/photo-1576680663932-303084e7e60c?w=600&h=400&fit=crop',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                comparison: 'Cultural celebration with AI-generated video.'
              }
            ].map((video, index) => (
              <div key={index} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setVideoModal({ url: video.videoUrl, title: video.title, celebrity: video.celebrity })}
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-purple-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-gray-600">Featuring {video.celebrity}</p>
                  <p className="text-xs text-gray-500 mt-2">{video.comparison}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Video Modal */}
          {videoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full relative">
                <button onClick={() => setVideoModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"> <X /> </button>
                <h3 className="text-2xl font-bold mb-2">{videoModal.title}</h3>
                <p className="text-gray-600 mb-4">Featuring {videoModal.celebrity}</p>
                <video src={videoModal.url} controls autoPlay className="w-full rounded-xl shadow" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Magic?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who have already created stunning personalized videos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/celebrities')}
              className="group bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Users className="w-6 h-6" />
              <span>Choose Celebrity</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/selfie-upload')}
              className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Camera className="w-6 h-6" />
              <span>Upload Selfie</span>
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Config Status Panel */}
      <ConfigStatus />
    </div>
  );
}
