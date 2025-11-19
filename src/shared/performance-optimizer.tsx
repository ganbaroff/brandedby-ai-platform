/**
 * Performance Optimization System
 * Code splitting, lazy loading, caching, and performance monitoring
 */

import { lazy } from 'react';

// Performance API types
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

// Lazy load heavy pages
export const LazyAdminPanel = lazy(() => import('../react-app/pages/AdminPanel'));
export const LazyCelebrities = lazy(() => import('../react-app/pages/Celebrities'));

// Lazy load heavy components  
export const LazyRichTextEditor = lazy(() => import('../react-app/components/RichTextEditor'));
export const LazyAnalyticsDashboard = lazy(() => import('../react-app/components/AnalyticsDashboard'));
export const LazyBulkOperations = lazy(() => import('../react-app/components/BulkOperations'));

/**
 * Image Optimization Component
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  priority = false
}) => {
  // Generate different image sizes for responsive loading
  const generateSrcSet = (baseSrc: string): string => {
    if (!baseSrc.startsWith('http')) {
      // For local images, we'd need a build-time optimization system
      return baseSrc;
    }
    
    // For external images, we can use URL parameters or CDN features
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=80 ${size}w`)
      .join(', ');
  };

  const defaultSizes = sizes || `
    (max-width: 320px) 280px,
    (max-width: 640px) 600px,
    (max-width: 768px) 728px,
    (max-width: 1024px) 984px,
    (max-width: 1280px) 1240px,
    1880px
  `;

  return (
    <img
      src={src}
      srcSet={generateSrcSet(src)}
      sizes={defaultSizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding="async"
      className={`${className} ${loading === 'lazy' ? 'will-change-transform' : ''}`}
      style={{
        contentVisibility: loading === 'lazy' ? 'auto' : 'visible',
      }}
    />
  );
};

/**
 * Performance Cache Manager
 */
class PerformanceCache {
  private static cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set item in cache with TTL
   */
  static set(key: string, data: unknown, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Get item from cache
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Clear expired items
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

/**
 * Performance Monitoring
 */
class PerformanceMonitor {
  private static metrics: Record<string, number[]> = {};

  /**
   * Measure function execution time
   */
  static measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(duration);
    
    // Keep only last 100 measurements
    if (this.metrics[name].length > 100) {
      this.metrics[name] = this.metrics[name].slice(-100);
    }
    
    return result;
  }

  /**
   * Measure async function execution time
   */
  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(duration);
    
    // Keep only last 100 measurements
    if (this.metrics[name].length > 100) {
      this.metrics[name] = this.metrics[name].slice(-100);
    }
    
    return result;
  }

  /**
   * Get performance statistics
   */
  static getStats(name?: string): Record<string, { avg: number; min: number; max: number; count: number }> {
    const stats: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    const metricsToProcess = name ? { [name]: this.metrics[name] } : this.metrics;
    
    for (const [key, values] of Object.entries(metricsToProcess)) {
      if (!values || values.length === 0) continue;
      
      stats[key] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    }
    
    return stats;
  }

  /**
   * Log slow operations
   */
  static logSlowOperations(threshold = 100): void {
    const stats = this.getStats();
    for (const [name, stat] of Object.entries(stats)) {
      if (stat.avg > threshold) {
        console.warn(`🐌 Slow operation detected: ${name} - Avg: ${stat.avg.toFixed(2)}ms`);
      }
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  static monitorWebVitals(): void {
    // Monitor First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log(`📊 FCP: ${entry.startTime.toFixed(2)}ms`);
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Monitor Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!((entry as LayoutShift).hadRecentInput)) {
          clsValue += (entry as LayoutShift).value;
        }
      }
      console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
    }).observe({ entryTypes: ['layout-shift'] });

    // Monitor First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`📊 FID: ${(entry as PerformanceEventTiming).processingStart - entry.startTime}ms`);
      }
    }).observe({ entryTypes: ['first-input'] });
  }
}

/**
 * Resource Preloader
 */
class ResourcePreloader {
  private static preloadedResources = new Set<string>();

  /**
   * Preload critical resources
   */
  static preloadCriticalResources(): void {
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/fonts/cal-sans-semibold.woff2',
      '/images/logo.png',
      '/images/hero-bg.jpg'
    ];

    criticalResources.forEach(resource => this.preloadResource(resource));
  }

  /**
   * Preload a specific resource
   */
  static preloadResource(url: string, as: 'script' | 'style' | 'image' | 'font' | 'fetch' = 'fetch'): void {
    if (this.preloadedResources.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    
    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
    this.preloadedResources.add(url);
  }

  /**
   * Prefetch resources for next navigation
   */
  static prefetchRoute(route: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }

  /**
   * Preconnect to external domains
   */
  static preconnectDomains(): void {
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://images.unsplash.com',
      'https://api.brandedby.ai'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

/**
 * Bundle Size Analyzer (Development Only)
 */
class BundleAnalyzer {
  /**
   * Analyze and log bundle information
   */
  static analyze(): void {
    if (process.env.NODE_ENV !== 'development') return;

    // Get all loaded scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;

    console.group('📦 Bundle Analysis');
    
    scripts.forEach(async (scriptElement) => {
      const script = scriptElement as HTMLScriptElement;
      try {
        const response = await fetch(script.src);
        const size = parseInt(response.headers.get('content-length') || '0');
        totalSize += size;
        console.log(`${script.src}: ${this.formatBytes(size)}`);
      } catch {
        console.log(`${script.src}: Size unknown`);
      }
    });

    setTimeout(() => {
      console.log(`Total estimated size: ${this.formatBytes(totalSize)}`);
      console.groupEnd();
    }, 1000);
  }

  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Auto-initialize performance monitoring
if (typeof window !== 'undefined') {
  // Cleanup cache every 10 minutes
  setInterval(() => PerformanceCache.cleanup(), 10 * 60 * 1000);
  
  // Monitor web vitals
  PerformanceMonitor.monitorWebVitals();
  
  // Preload critical resources
  ResourcePreloader.preloadCriticalResources();
  ResourcePreloader.preconnectDomains();
  
  // Analyze bundle in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => BundleAnalyzer.analyze(), 3000);
  }
}

export {
    BundleAnalyzer, PerformanceCache,
    PerformanceMonitor,
    ResourcePreloader
};
