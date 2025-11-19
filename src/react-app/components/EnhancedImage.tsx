/**
 * Enhanced Image Component with Fallbacks and Error Handling
 */

import React, { useEffect, useRef, useState } from 'react';

interface EnhancedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: Event) => void;
}

const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Default fallback for celebrity images
  const defaultFallback = fallbackSrc || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80`;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('Image failed to load:', currentSrc);
    
    if (currentSrc !== defaultFallback) {
      // Try fallback image
      setCurrentSrc(defaultFallback);
      setHasError(false);
    } else {
      // Even fallback failed
      setHasError(true);
      setIsLoading(false);
    }
    
    onError?.(event.nativeEvent);
  };

  // Reset when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 image-loading">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 image-error">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 rounded mb-2 mx-auto"></div>
            <div className="text-xs">Image unavailable</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}

      {/* Placeholder while not in view */}
      {!isInView && loading === 'lazy' && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-xs text-gray-400">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedImage;