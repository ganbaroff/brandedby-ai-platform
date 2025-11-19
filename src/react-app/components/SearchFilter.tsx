/**
 * Advanced Search & Filter Component
 * Modern search with real-time filtering and animations
 */

import { Filter, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  categories?: string[];
  placeholder?: string;
  showFilters?: boolean;
}

interface FilterOptions {
  category: string;
  minRating: number;
  sortBy: 'name' | 'rating' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

const SearchFilter = memo(function SearchFilter({
  onSearch,
  onFilter,
  categories = [],
  placeholder = "Search celebrities...",
  showFilters = true
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minRating: 0,
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Filter change handler
  const handleFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  }, [filters, onFilter]);

  const clearFilters = useCallback(() => {
    const defaultFilters: FilterOptions = {
      category: '',
      minRating: 0,
      sortBy: 'popularity',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  }, [onFilter]);

  const hasActiveFilters = filters.category || filters.minRating > 0 || filters.sortBy !== 'popularity';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-16 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-lg placeholder-neutral-500"
          />
          
          {/* Clear Search */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-14 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {/* Filter Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`absolute right-2 p-2 rounded-xl transition-all duration-200 ${
                showFilterPanel || hasActiveFilters
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && showFilterPanel && (
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 shadow-lg animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                  className="w-full p-3 border border-neutral-300 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Minimum Rating
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange({ minRating: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider-primary"
                />
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{filters.minRating === 0 ? 'Any' : `${filters.minRating}+`}</span>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                className="w-full p-3 border border-neutral-300 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              >
                <option value="popularity">Popularity</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange({ sortOrder: e.target.value as FilterOptions['sortOrder'] })}
                className="w-full p-3 border border-neutral-300 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filters.category && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              Category: {filters.category}
              <button
                onClick={() => handleFilterChange({ category: '' })}
                className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              Rating: {filters.minRating}+
              <button
                onClick={() => handleFilterChange({ minRating: 0 })}
                className="hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.sortBy !== 'popularity' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
              Sort: {filters.sortBy} ({filters.sortOrder})
              <button
                onClick={() => handleFilterChange({ sortBy: 'popularity', sortOrder: 'desc' })}
                className="hover:bg-neutral-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default SearchFilter;
export type { FilterOptions, SearchFilterProps };
