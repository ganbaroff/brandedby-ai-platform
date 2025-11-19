/**
 * SEO Hook for React Components
 * Easy integration of SEO meta tags and structured data
 */

import { SEOManager, type MetaTags, type StructuredData } from '@/shared/seo-manager';
import { useEffect } from 'react';

interface UseSEOOptions {
  meta: Partial<MetaTags>;
  structuredData?: StructuredData;
}

/**
 * Hook for managing SEO meta tags and structured data
 */
export const useSEO = ({ meta, structuredData }: UseSEOOptions) => {
  useEffect(() => {
    // Set meta tags
    SEOManager.setMetaTags(meta);

    // Add structured data if provided
    if (structuredData) {
      SEOManager.addStructuredData(structuredData);
    }

    // Cleanup function to reset to default
    return () => {
      if (window.location.pathname === '/') {
        // Reset to home meta on unmount if not already on home
        SEOManager.setMetaTags(SEOManager.getHomeMeta());
        SEOManager.addStructuredData(SEOManager.getOrganizationData());
      }
    };
  }, [meta, structuredData]);
};

/**
 * Hook for home page SEO
 */
export const useHomeSEO = () => {
  useSEO({
    meta: SEOManager.getHomeMeta(),
    structuredData: SEOManager.getOrganizationData()
  });

  useEffect(() => {
    // Also add website structured data
    SEOManager.addStructuredData(SEOManager.getWebsiteData());
  }, []);
};

/**
 * Hook for celebrities page SEO
 */
export const useCelebritiesSEO = () => {
  useSEO({
    meta: SEOManager.getCelebritiesMeta()
  });
};

/**
 * Hook for individual celebrity SEO
 */
export const useCelebritySEO = (celebrity: {
  name: string;
  role: string;
  description: string;
  image_url: string;
  id: number;
}) => {
  useSEO({
    meta: SEOManager.getCelebrityMeta(celebrity),
    structuredData: SEOManager.getCelebrityStructuredData(celebrity)
  });
};

/**
 * Hook for blog post SEO
 */
export const useBlogPostSEO = (post: {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image_url?: string;
  id: number;
}) => {
  useSEO({
    meta: SEOManager.getBlogPostMeta(post),
    structuredData: SEOManager.getBlogPostStructuredData(post)
  });
};