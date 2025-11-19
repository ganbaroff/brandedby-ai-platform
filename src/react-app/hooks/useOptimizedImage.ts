/**
 * Image Optimization Hook
 * Lazy loading, responsive images, and WebP conversion
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { OptimizedImage } from '../../shared/performance-optimizer';

interface UseOptimizedImageOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Hook for optimized image loading with lazy loading and WebP support
 */
export const useOptimizedImage = (options: UseOptimizedImageOptions) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (options.loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [options.loading]);

  // Handle load and error events
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    options.onLoad?.();
  }, [options]);

  const handleError = useCallback(() => {
    setIsError(true);
    options.onError?.();
  }, [options]);

  // Generate optimized src with WebP support
  const getOptimizedSrc = useCallback((src: string, quality = 80) => {
    // For external URLs, add optimization parameters
    if (src.startsWith('http')) {
      const url = new URL(src);
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('auto', 'format,compress');
      return url.toString();
    }
    return src;
  }, []);

  const src = isInView ? getOptimizedSrc(options.src, options.quality) : (options.placeholder || '');

  return {
    imgRef,
    src,
    isLoaded,
    isError,
    isInView,
    handleLoad,
    handleError
  };
};

/**
 * Optimized Image Component with lazy loading and responsive behavior
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  aspectRatio?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 80,
  loading = 'lazy',
  priority = false,
  placeholder,
  aspectRatio,
  sizes,
  onLoad,
  onError
}) => {
  const {
    imgRef,
    src: optimizedSrc,
    isLoaded,
    isError,
    isInView,
    handleLoad,
    handleError
  } = useOptimizedImage({
    src,
    alt,
    width,
    height,
    quality,
    loading: priority ? 'eager' : loading,
    placeholder,
    onLoad,
    onError
  });

  return React.createElement(
    'div',
    {
      ref: imgRef,
      className: `relative overflow-hidden ${className}`,
      style: {
        aspectRatio: aspectRatio,
        backgroundColor: isLoaded ? 'transparent' : '#f3f4f6'
      }
    },
    // Placeholder while loading
    !isLoaded && !isError && isInView && React.createElement(
      'div',
      { className: 'absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center' },
      React.createElement('div', { className: 'w-8 h-8 bg-gray-300 rounded' })
    ),
    // Error state
    isError && React.createElement(
      'div',
      { className: 'absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm' },
      'Failed to load image'
    ),
    // Actual image
    isInView && !isError && React.createElement('img', {
      src: optimizedSrc,
      alt: alt,
      width: width,
      height: height,
      loading: priority ? 'eager' : 'lazy',
      sizes: sizes,
      className: `transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } w-full h-full object-cover`,
      onLoad: handleLoad,
      onError: handleError
    })
  );
};

export default ResponsiveImage;