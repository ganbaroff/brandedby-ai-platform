import { CelebrityFilter } from "@/react-app/components/celebrity/CelebrityFiltersSimple";
import CelebrityRegionSelector, { CelebrityRegion } from "@/react-app/components/CelebrityRegionSelector";
import EnhancedImage from "@/react-app/components/EnhancedImage";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import ScrollProgressIndicator from "@/react-app/components/ScrollProgressIndicator";
import SplineViewer from "@/react-app/components/SplineViewer";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { useHomeSEO } from "@/react-app/hooks/useSEO";
import { CelebrityManager, type Celebrity } from "@/shared/admin-data-utils";
import {
    AlertCircle,
    ArrowRight,
    Heart,
    Mic,
    Quote,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
    Zap
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = memo(function Home() {
  // SEO optimization for home page - MUST be called first
  useHomeSEO();

  const navigate = useNavigate();
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loadingCelebrities, setLoadingCelebrities] = useState(true);
  const [celebritiesError, setCelebritiesError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<CelebrityRegion>('international');

  // Cache for performance optimization
  const [celebritiesCache, setCelebritiesCache] = useState<Map<CelebrityRegion, Celebrity[]>>(new Map());

  // State for error handling
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CelebrityFilter>({
    searchQuery: '',
    popularityRange: [0, 100],
    niches: [],
    status: 'all',
    dateRange: { from: undefined, to: undefined },
    minRating: 0,
    minFollowers: 0,
  });

  const heroCelebrities = useMemo(() => {
    return celebrities.slice(0, 4);
  }, [celebrities]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    celebrities.forEach((celebrity) => {
      try {
        const parsed = JSON.parse(celebrity.niches) as string[];
        parsed.forEach((niche) => categories.add(niche));
      } catch {
        // ignore parse errors, use default categories only
      }
    });
    return Array.from(categories).sort();
  }, [celebrities]);

  const loadCelebrities = useCallback(async (region: CelebrityRegion = selectedRegion) => {
    setLoadingCelebrities(true);
    setCelebritiesError(null);

    try {
      // Use cache if available
      const cached = celebritiesCache.get(region);
      if (cached) {
        setCelebrities(cached);
        setLoadingCelebrities(false);
        return;
      }

      const data = await CelebrityManager.loadCelebrities(region);
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data received from server');
      }

      // Cache the data
      setCelebritiesCache(prev => new Map(prev).set(region, data));
      setCelebrities(data);
    } catch (error) {
      console.error("Failed to load celebrities:", error);
      setCelebritiesError("Failed to load list. Please check your internet connection and try again.");
      setHasError(true);
      setError(error instanceof Error ? error.message : 'Failed to load celebrities');
    } finally {
      setLoadingCelebrities(false);
    }
  }, [selectedRegion, celebritiesCache]);

  // Simple filter by search only
  const filteredCelebrities = useMemo(() => {
    if (!celebrities || celebrities.length === 0) return [];

    return celebrities.filter((celebrity) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          celebrity.name.toLowerCase().includes(query) ||
          celebrity.role.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.niches && filters.niches.length > 0) {
        try {
          const niches = JSON.parse(celebrity.niches) as string[];
          const matchesCategory = niches.some((niche) => filters.niches.includes(niche));
          if (!matchesCategory) return false;
        } catch {
          return false;
        }
      }

      return true;
    });
  }, [celebrities, filters.searchQuery, filters.niches]);

  // Handle region change
  const handleRegionChange = useCallback((region: CelebrityRegion) => {
    setSelectedRegion(region);
    loadCelebrities(region);
  }, [loadCelebrities]);

  // Load celebrities data
  useEffect(() => {
    loadCelebrities();
  }, [loadCelebrities]);

  // Error boundary fallback - AFTER all hooks
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ScrollProgressIndicator position="right" showPercentage={false} />

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 lg:py-20 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* Animated gradient orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/4 sm:top-1/3 -right-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute -bottom-20 left-1/4 sm:left-1/3 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-pink-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          
          {/* Mesh grid overlay */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-center">
            {/* Hero Content (adaptive) */}
            <div className="text-center lg:text-left mx-auto lg:mx-0 max-w-2xl xl:max-w-3xl lg:col-span-7 xl:col-span-8">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                AI Celebrity
                <span className="gradient-text"> Video Studio</span>
              </h1>
              <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Instantly generate short, personalized videos featuring iconic stars. Upload a clear photo,
                pick a celebrity style and get HD results in seconds.
              </p>

              {/* Key benefits */}
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600" aria-hidden>
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-800 font-medium">Realistic face & voice synthesis</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600" aria-hidden>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-800 font-medium">Official face & voice licenses</span>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/celebrities')}
                  className="group btn-primary-animated w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5 translate-x-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={loginWithGoogle}
                    className="btn-secondary-shine w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl font-semibold text-sm sm:text-base md:text-lg border-2 border-gray-300 hover:border-purple-400 hover:shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                  >
                    <span>Sign in with Google</span>
                  </button>
                )}
              </div>

              {/* Charity note */}
              <p className="mt-4 text-xs sm:text-sm text-gray-500 flex items-center justify-center lg:justify-start gap-2">
                <Heart className="w-4 h-4 text-rose-500" aria-hidden />
                10% of revenue supports charitable organizations
              </p>
            </div>

            {/* Hero Visual with animated faces */}
            <div className="relative lg:col-span-5 xl:col-span-4">
              <div className="w-full aspect-[4/3] sm:aspect-video md:aspect-auto md:h-64 lg:h-72 min-h-[360px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-glow-sm relative">

                {/* Spline 3D scene (desktop only by default). Add ?spline=react to URL to test React variant */}
                <div className="absolute inset-0 z-[10] block">
                  <SplineViewer url="https://prod.spline.design/MEyQ2UjiS6lP74oW/scene.splinecode" className="w-full h-full" />
                </div>

                {/* Cover Spline watermark with a subtle brand badge (desktop) */}
                <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-[15] pointer-events-none block">
                  <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-white/80 backdrop-blur text-[9px] sm:text-[10px] font-semibold text-gray-700 shadow">
                    BrandedBY
                  </div>
                </div>

                {/* Animated floating faces (reduced, desktop only) */}
                <div className="pointer-events-none absolute inset-0 z-[20] hidden lg:block">
                  {heroCelebrities.slice(0, 2).map((celebrity, index) => {
                    const positions = [
                      { className: "left-6 top-6 w-14 h-14 xl:w-16 xl:h-16", delay: "0s" },
                      { className: "right-6 bottom-6 w-12 h-12 xl:w-14 xl:h-14", delay: "0.8s" },
                    ];

                    const position = positions[index] ?? positions[0];
                    const imageSrc = celebrity.image_url?.trim()
                      ? celebrity.image_url
                      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80";

                    return (
                      <div
                        key={celebrity.id}
                        className={`absolute rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-400 opacity-90 animate-float hero-face ${position.className}`}
                        style={{ animationDelay: position.delay }}
                      >
                        <EnhancedImage
                          src={imageSrc}
                          alt={celebrity.name}
                          className="w-full h-full object-cover"
                          sizes="(max-width: 640px) 56px, (max-width: 1024px) 64px, 96px"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 mb-4">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">See It In Action</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Watch the <span className="gradient-text">Magic Happen</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              From photo to professional video in seconds. See real examples of AI-generated celebrity videos.
            </p>
          </div>

          {/* Video Player or Placeholder */}
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
              {/* Placeholder for demo video */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 hover:bg-white/20 transition-all cursor-pointer group">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1 group-hover:scale-110 transition-transform"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Demo Video Coming Soon</h3>
                <p className="text-gray-300 text-center max-w-md">
                  Watch how BrandedBY transforms your photos into stunning AI-generated videos with celebrity styles
                </p>
              </div>

              {/* Video thumbnail overlay (when real video is added) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Video stats/features below */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {[
                { icon: Zap, label: '30 seconds', sublabel: 'Generation Time' },
                { icon: Star, label: '1080p HD', sublabel: 'Video Quality' },
                { icon: Users, label: '20+ Stars', sublabel: 'Celebrities' },
                { icon: Sparkles, label: 'AI Powered', sublabel: 'Technology' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Celebrity Gallery Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold text-neutral-900 mb-4 sm:mb-6">
              Choose Your <span className="gradient-text">Celebrity</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto mb-6 sm:mb-8">
              Create videos with the world's biggest stars. More celebrities added weekly!
            </p>
          </div>

          {/* Celebrity Region Selector */}
          <div className="w-full max-w-4xl mx-auto mb-6 px-4 flex justify-center">
            <CelebrityRegionSelector 
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
            />
          </div>

          {/* Search and Filter */}
          <div className="w-full max-w-4xl mx-auto mb-12 px-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search celebrities..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label="Search celebrities by name or role"
                  />
                </div>
                <div className="w-full sm:w-56">
                  <select
                    value={filters.niches[0] ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        niches: value ? [value] : [],
                      }));
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label="Filter by category"
                  >
                    <option value="">All categories</option>
                    {allCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
          </div>

          {loadingCelebrities ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl aspect-square" />
                  <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
                  <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : celebritiesError ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading celebrities</h3>
              <p className="text-gray-600 mb-6">{celebritiesError}</p>
              <button
                onClick={loadCelebrities}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredCelebrities.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No celebrities found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6" role="list" aria-label="Celebrity results">
              {filteredCelebrities.map((celebrity) => {
                let niches: string[] = [];
                try {
                  niches = JSON.parse(celebrity.niches);
                } catch (e) {
                  console.error('Error parsing niches:', e);
                }

                return (
                  <div
                    key={celebrity.id}
                    onClick={() => navigate(`/celebrity/${celebrity.id}`)}
                    className="group relative bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500"
                    role="listitem"
                    aria-label={`Open details for ${celebrity.name}`}
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <EnhancedImage
                        src={celebrity.image_url || ''}
                        alt={celebrity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        webpSrcSet={(celebrity.image_url || '').toLowerCase().endsWith('.webp') ? (celebrity.image_url || '') : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-3 md:p-4">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-bold text-[11px] xs:text-xs sm:text-sm md:text-base overflow-hidden line-clamp-1">{celebrity.name}</h3>
                          <p className="hidden sm:block text-white/90 text-xs line-clamp-1 overflow-hidden">{celebrity.role}</p>
                        </div>
                      </div>
                      {/* Mobile touch feedback */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
                    </div>
                    {niches.length > 0 && (
                      <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 md:px-2.5 rounded-full text-[10px] md:text-xs font-medium bg-primary-100 text-primary-800">
                          {niches[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/celebrities')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base"
              aria-label="View all celebrities"
            >
              View All Celebrities
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users creating amazing AI-powered videos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Content Creator",
                avatar: "https://i.pravatar.cc/150?img=1",
                rating: 5,
                text: "BrandedBy transformed my content creation process! The AI-generated celebrity videos are incredibly realistic and engaging. My followers love it!"
              },
              {
                name: "Michael Chen",
                role: "Marketing Director",
                avatar: "https://i.pravatar.cc/150?img=2",
                rating: 5,
                text: "The quality is outstanding! We've used it for multiple campaigns and the results exceeded our expectations. The token system is very fair."
              },
              {
                name: "Emma Williams",
                role: "Social Media Manager",
                avatar: "https://i.pravatar.cc/150?img=3",
                rating: 5,
                text: "Easy to use, professional results, and amazing customer support. This platform has become essential for our social media strategy!"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-purple-200 mb-4" />
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                    width="48"
                    height="48"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">50K+</p>
              <p className="text-sm text-gray-600">Videos Created</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">4.9/5</p>
              <p className="text-sm text-gray-600">User Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">99%</p>
              <p className="text-sm text-gray-600">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default Home;
