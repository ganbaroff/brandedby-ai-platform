import Breadcrumbs, { BreadcrumbContainer } from "@/react-app/components/Breadcrumbs";
import EnhancedImage from "@/react-app/components/EnhancedImage";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import SearchFilter, { FilterOptions } from "@/react-app/components/SearchFilter";
import { CelebrityGridSkeleton } from "@/react-app/components/SkeletonLoaders";
import { useCelebritiesSEO } from "@/react-app/hooks/useSEO";
import { CelebrityManager, type Celebrity } from "@/shared/admin-data-utils";
import { analytics } from "@/shared/advanced-analytics";
import { Star, TrendingUp, Users, Zap } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const Celebrities = memo(function Celebrities() {
  // SEO optimization for celebrities page
  useCelebritiesSEO();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [celebritiesData, setCelebritiesData] = useState<Celebrity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minRating: 0,
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await CelebrityManager.loadCelebrities();
        setCelebritiesData(data);
      } catch (error) {
        console.error("Failed to load celebrities:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Parse niches helper
  const parseNiches = useCallback((nichesJson: string): string[] => {
    try {
      return JSON.parse(nichesJson);
    } catch {
      return ['Entertainment'];
    }
  }, []);

  // Get all unique categories for filter
  const allCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    celebritiesData.forEach(celebrity => {
      const niches = parseNiches(celebrity.niches);
      niches.forEach(niche => categoriesSet.add(niche));
    });
    return Array.from(categoriesSet).sort();
  }, [celebritiesData, parseNiches]);

  // Filter and sort celebrities
  const filteredCelebrities = useMemo(() => {
    const filtered = celebritiesData.filter(celebrity => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = celebrity.name.toLowerCase().includes(query);
        const matchesRole = celebrity.role.toLowerCase().includes(query);
        const matchesDescription = celebrity.description?.toLowerCase().includes(query) || false;
        const matchesNiches = parseNiches(celebrity.niches).some(niche => 
          niche.toLowerCase().includes(query)
        );
        
        if (!matchesName && !matchesRole && !matchesDescription && !matchesNiches) {
          return false;
        }
      }

      // Category filter
      if (filters.category) {
        const niches = parseNiches(celebrity.niches);
        if (!niches.includes(filters.category)) {
          return false;
        }
      }

      // Rating filter
      if (filters.minRating > 0) {
        if (celebrity.rating < filters.minRating) {
          return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'popularity':
        default:
          aValue = a.popularity;
          bValue = b.popularity;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      }

      return 0;
    });

    return filtered;
  }, [celebritiesData, searchQuery, filters, parseNiches]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const getNicheColor = useCallback((niche: string) => {
    const colors: Record<string, string> = {
      'Business': 'bg-primary-100 text-primary-800',
      'Entertainment': 'bg-secondary-100 text-secondary-800',
      'Technology': 'bg-accent-100 text-accent-800',
      'Music': 'bg-purple-100 text-purple-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Comedy': 'bg-yellow-100 text-yellow-800',
      'Action Films': 'bg-red-100 text-red-800',
      'Fashion': 'bg-pink-100 text-pink-800',
      'Youth Culture': 'bg-indigo-100 text-indigo-800',
      'Literature': 'bg-green-100 text-green-800',
      'Pop Culture': 'bg-blue-100 text-blue-800'
    };
    return colors[niche] || 'bg-neutral-100 text-neutral-800';
  }, []);

  // Stats for the top section
  const stats = useMemo(() => ({
    total: celebritiesData.length,
    categories: allCategories.length,
    avgRating: celebritiesData.length > 0 
      ? (celebritiesData.reduce((sum, celeb) => sum + celeb.rating, 0) / celebritiesData.length).toFixed(1)
      : "0.0"
  }), [celebritiesData, allCategories.length]);

  // Track page view
  useEffect(() => {
    analytics.trackEvent('user', 'page_view', 'celebrities');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumbs */}
      <BreadcrumbContainer>
        <Breadcrumbs />
      </BreadcrumbContainer>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <Users className="w-4 h-4 text-primary-600" />
              <span className="text-primary-700 font-medium">{stats.total} Global Celebrities</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Choose Your <span className="gradient-text">Celebrity</span>
            </h1>
            
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
              Create stunning AI videos with the world's biggest stars. From Hollywood actors to music legends, 
              find the perfect celebrity for your project.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">{stats.total}</div>
                <div className="text-sm text-neutral-600">Celebrities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">{stats.categories}</div>
                <div className="text-sm text-neutral-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">{stats.avgRating}★</div>
                <div className="text-sm text-neutral-600">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto">
            <SearchFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              categories={allCategories}
              placeholder="Search by name, role, or category..."
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {searchQuery || filters.category ? 'Search Results' : 'All Celebrities'}
              </h2>
              <p className="text-neutral-600 mt-1">
                {filteredCelebrities.length} {filteredCelebrities.length === 1 ? 'celebrity' : 'celebrities'} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Trending Now</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && <CelebrityGridSkeleton count={12} />}

          {/* No Results */}
          {!loading && filteredCelebrities.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">No celebrities found</h3>
              <p className="text-neutral-600 max-w-md mx-auto mb-6">
                Try adjusting your search terms or filters to find more results.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    category: '',
                    minRating: 0,
                    sortBy: 'popularity',
                    sortOrder: 'desc'
                  });
                }}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Celebrity Grid */}
          {!loading && filteredCelebrities.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCelebrities.map((celebrity, index) => {
                const niches = parseNiches(celebrity.niches);

                return (
                  <div
                    key={celebrity.id}
                    onClick={() => {
                      analytics.trackEvent('celebrity', 'click', celebrity.name);
                      navigate(`/celebrity/${celebrity.id}`);
                    }}
                    className="group cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-scale-in"
                    style={{ '--animation-delay': `${index * 50}ms` } as React.CSSProperties}
                  >
                    {/* Image */}
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <EnhancedImage
                        src={celebrity.image_url}
                        alt={celebrity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Popularity Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-neutral-800 px-3 py-1 rounded-full text-sm font-semibold">
                        #{celebrity.popularity}
                      </div>
                      
                      {/* Quick Action Button */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-full py-3 bg-white/90 backdrop-blur-sm text-neutral-900 font-semibold rounded-xl hover:bg-white transition-colors">
                          Create Video
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {celebrity.name}
                          </h3>
                          <p className="text-neutral-600 text-sm">{celebrity.role}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-neutral-700">{celebrity.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {celebrity.description}
                      </p>
                      
                      {/* Niches */}
                      <div className="flex flex-wrap gap-2">
                        {niches.slice(0, 3).map((niche, nicheIndex) => (
                          <span
                            key={nicheIndex}
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getNicheColor(niche)}`}
                          >
                            {niche}
                          </span>
                        ))}
                        {niches.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600">
                            +{niches.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-brand">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Can't Find Your Celebrity?
          </h2>
          
          <p className="text-xl text-white/90 mb-8">
            We're constantly adding new celebrities to our platform. 
            Request your favorite star and get notified when they're available!
          </p>
          
          <button
            onClick={() => navigate('/selfie-upload')}
            className="px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Request Celebrity
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default Celebrities;