/**
 * Image Optimization Utilities
 * Centralized image processing and optimization functions
 */

// Default fallback images for different contexts
export const DEFAULT_IMAGES = {
  celebrity: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg=='
};

// Image optimization configurations
export const IMAGE_CONFIGS = {
  quality: {
    low: 60,
    medium: 80,
    high: 95
  },
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    xlarge: { width: 1920, height: 1920 }
  }
};

/**
 * Optimizes image URL with parameters
 */
export function optimizeImageUrl(
  url: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    fit?: 'crop' | 'scale' | 'fill';
  } = {}
): string {
  if (!url || !url.startsWith('http')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    
    // Add optimization parameters
    if (options.width) urlObj.searchParams.set('w', options.width.toString());
    if (options.height) urlObj.searchParams.set('h', options.height.toString());
    if (options.quality) urlObj.searchParams.set('q', options.quality.toString());
    if (options.format) urlObj.searchParams.set('auto', 'format,compress');
    if (options.fit) urlObj.searchParams.set('fit', options.fit);
    
    // Ensure HTTPS for security
    urlObj.protocol = 'https:';
    
    return urlObj.toString();
  } catch (error) {
    console.warn('Failed to optimize image URL:', error);
    return url;
  }
}

/**
 * Generates responsive image srcSet
 */
export function generateSrcSet(baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280]): string {
  if (!baseUrl || !baseUrl.startsWith('http')) {
    return baseUrl;
  }

  return sizes
    .map(size => `${optimizeImageUrl(baseUrl, { width: size, quality: 80 })} ${size}w`)
    .join(', ');
}

/**
 * Validates image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check image dimensions (if needed)
  return { valid: true };
}

/**
 * Compresses image file for upload
 */
export function compressImage(file: File, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1920x1920)
      const maxDimension = 1920;
      let { width, height } = img;

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Preloads critical images for better performance
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

/**
 * Preloads multiple images with progress tracking
 */
export async function preloadImages(
  urls: string[], 
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  let loaded = 0;
  const total = urls.length;

  const promises = urls.map(async (url) => {
    try {
      await preloadImage(url);
      loaded++;
      onProgress?.(loaded, total);
    } catch (error) {
      console.warn(`Failed to preload image: ${url}`, error);
      loaded++; // Count as processed even if failed
      onProgress?.(loaded, total);
    }
  });

  await Promise.allSettled(promises);
}

/**
 * Lazy loading observer for images
 */
export function createLazyImageObserver(callback: (entry: IntersectionObserverEntry) => void) {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  );
}