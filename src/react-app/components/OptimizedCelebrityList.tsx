/**
 * Optimized Celebrity List Component
 * Memoized celebrity rendering with performance optimizations
 */

import { Star, TrendingUp, Users } from 'lucide-react';
import { memo, useCallback } from 'react';
import type { Celebrity } from '../../shared/types';
import EnhancedImage from './EnhancedImage';

interface CelebrityCardProps {
  celebrity: Celebrity;
  index: number;
  onClick: (celebrity: Celebrity) => void;
  parseNiches: (niches: string) => string[];
}

// Memoized celebrity card component
const CelebrityCard = memo(function CelebrityCard({ 
  celebrity, 
  index, 
  onClick, 
  parseNiches 
}: CelebrityCardProps) {
  const niches = parseNiches(celebrity.niches);

  const handleClick = useCallback(() => {
    onClick(celebrity);
  }, [celebrity, onClick]);

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-scale-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden relative">
        <EnhancedImage
          src={celebrity.image_url || '/api/placeholder/300/400'}
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
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{celebrity.name}</h3>
            <p className="text-sm text-neutral-600">{celebrity.role}</p>
          </div>
          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-yellow-700">{celebrity.rating}</span>
          </div>
        </div>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{celebrity.description}</p>
        
        {/* Niches */}
        <div className="flex flex-wrap gap-2 mb-4">
          {niches.slice(0, 2).map((niche, nicheIndex) => (
            <span
              key={nicheIndex}
              className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
            >
              {niche}
            </span>
          ))}
          {niches.length > 2 && (
            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
              +{niches.length - 2} more
            </span>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Popularity {celebrity.popularity}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
});

interface OptimizedCelebrityListProps {
  celebrities: Celebrity[];
  parseNiches: (niches: string) => string[];
  onCelebrityClick: (celebrity: Celebrity) => void;
  loading?: boolean;
}

// Main optimized list component
const OptimizedCelebrityList = memo(function OptimizedCelebrityList({
  celebrities,
  parseNiches,
  onCelebrityClick,
  loading = false
}: OptimizedCelebrityListProps) {
  // Stable callback to prevent re-renders
  const handleCelebrityClick = useCallback((celebrity: Celebrity) => {
    onCelebrityClick(celebrity);
  }, [onCelebrityClick]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-gray-200" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded" />
                <div className="h-2 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {celebrities.map((celebrity, index) => (
        <CelebrityCard
          key={celebrity.id}
          celebrity={celebrity}
          index={index}
          onClick={handleCelebrityClick}
          parseNiches={parseNiches}
        />
      ))}
    </div>
  );
});

export default OptimizedCelebrityList;