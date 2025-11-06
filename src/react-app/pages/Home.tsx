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
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="relative container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">AI-Powered Video Generation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Videos
              </span>
              <br />
              <span className="text-gray-900">With Celebrities</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Choose from 9 Azerbaijani celebrities or upload your selfie to generate 
              personalized, professional videos with cutting-edge AI technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => {
                  logger.logUserAction('hero_choose_celebrity_clicked', { 
                    page: 'home',
                    section: 'hero'
                  });
                  navigate('/celebrities');
                }}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Users className="w-6 h-6" />
                <span>Choose Celebrity</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => {
                  logger.logUserAction('hero_upload_selfie_clicked', { 
                    page: 'home',
                    section: 'hero'
                  });
                  navigate('/selfie-upload');
                }}
                className="group bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Camera className="w-6 h-6" />
                <span>Upload Selfie</span>
                <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">9</div>
                <div className="text-gray-600">Celebrities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">30+</div>
                <div className="text-gray-600">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4K</div>
                <div className="text-gray-600">Quality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Face Generation Demo */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                AI-Powered Character Generation
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Watch our advanced AI create and morph unique characters in real-time. 
                From celebrities to custom faces, our technology brings any vision to life.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Real-time face generation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Seamless morphing transitions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Photorealistic quality</span>
                </div>
              </div>
            </div>
            <FaceMorphingDemo />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Featured Celebrities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
                className="bg-white rounded-2xl shadow p-6 flex flex-col items-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
              >
                <img
                  src={celebrity.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'}
                  alt={celebrity.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{celebrity.name}</h3>
                <div className="text-purple-600 font-medium mb-2">{celebrity.role}</div>
                <p className="text-gray-600 text-sm text-center mb-2 line-clamp-2">{celebrity.description}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {JSON.parse(celebrity.niches).map((niche: string) => (
                    <span key={niche} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">{niche}</span>
                  ))}
                </div>
                <div className="text-yellow-500 font-semibold flex items-center gap-1">
                  <span>★</span> {celebrity.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create professional videos in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={item.step} className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <item.icon className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
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
