/**
 * SEO and Meta Tags Management System
 * Dynamic meta tags, Open Graph, Twitter Cards, and structured data
 */

interface MetaTags {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  twitterSite?: string;
  twitterCreator?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

class SEOManager {
  private static readonly DEFAULT_META: Partial<MetaTags> = {
    title: 'BrandedBy - AI Video Generation with Celebrity Personas',
    description: 'Create stunning AI-generated videos featuring celebrity personas. Advanced technology for personalized content creation.',
    keywords: ['AI video generation', 'celebrity AI', 'video creation', 'artificial intelligence', 'content creation'],
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@brandedby_ai',
    robots: 'index, follow',
    author: 'BrandedBy Team'
  };

  private static readonly SITE_URL = 'https://brandedby.ai';
  private static readonly SITE_NAME = 'BrandedBy';

  /**
   * Set meta tags for the current page
   */
  static setMetaTags(meta: Partial<MetaTags>): void {
    const tags: MetaTags = { ...this.DEFAULT_META, ...meta } as MetaTags;

    // Set document title
    document.title = tags.title;

    // Clear existing meta tags
    this.clearMetaTags();

    // Basic meta tags
    this.setMetaTag('description', tags.description);
    this.setMetaTag('keywords', tags.keywords?.join(', ') || '');
    this.setMetaTag('author', tags.author || '');
    this.setMetaTag('robots', tags.robots || '');

    // Canonical URL
    if (tags.canonical) {
      this.setLinkTag('canonical', tags.canonical);
    }

    // Open Graph tags
    this.setMetaProperty('og:title', tags.ogTitle || tags.title);
    this.setMetaProperty('og:description', tags.ogDescription || tags.description);
    this.setMetaProperty('og:type', tags.ogType || 'website');
    this.setMetaProperty('og:site_name', this.SITE_NAME);
    this.setMetaProperty('og:url', tags.ogUrl || this.getCurrentUrl());
    
    if (tags.ogImage) {
      this.setMetaProperty('og:image', this.getFullImageUrl(tags.ogImage));
      this.setMetaProperty('og:image:alt', tags.ogTitle || tags.title);
      this.setMetaProperty('og:image:width', '1200');
      this.setMetaProperty('og:image:height', '630');
    }

    // Twitter Card tags
    this.setMetaTag('twitter:card', tags.twitterCard || 'summary_large_image');
    this.setMetaTag('twitter:title', tags.ogTitle || tags.title);
    this.setMetaTag('twitter:description', tags.ogDescription || tags.description);
    if (tags.twitterSite) {
      this.setMetaTag('twitter:site', tags.twitterSite);
    }
    if (tags.twitterCreator) {
      this.setMetaTag('twitter:creator', tags.twitterCreator);
    }
    if (tags.ogImage) {
      this.setMetaTag('twitter:image', this.getFullImageUrl(tags.ogImage));
    }

    // Article-specific tags
    if (tags.ogType === 'article') {
      if (tags.publishedTime) {
        this.setMetaProperty('article:published_time', tags.publishedTime);
      }
      if (tags.modifiedTime) {
        this.setMetaProperty('article:modified_time', tags.modifiedTime);
      }
      if (tags.author) {
        this.setMetaProperty('article:author', tags.author);
      }
    }

    console.log('📄 SEO Meta tags updated:', tags.title);
  }

  /**
   * Generate meta tags for home page
   */
  static getHomeMeta(): Partial<MetaTags> {
    return {
      title: 'BrandedBy - AI Video Generation with Celebrity Personas',
      description: 'Create stunning AI-generated videos featuring celebrity personas. Advanced technology for personalized content creation with Hollywood-quality results.',
      keywords: ['AI video generation', 'celebrity AI', 'video creation', 'artificial intelligence', 'content creation', 'deepfake', 'synthetic media'],
      ogImage: '/images/og-home.jpg',
      ogUrl: this.SITE_URL,
      canonical: this.SITE_URL
    };
  }

  /**
   * Generate meta tags for celebrities page
   */
  static getCelebritiesMeta(): Partial<MetaTags> {
    return {
      title: 'Celebrity AI Models - BrandedBy',
      description: 'Browse our collection of AI celebrity models for video generation. Choose from actors, musicians, influencers and create personalized content.',
      keywords: ['celebrity AI models', 'AI actors', 'synthetic celebrities', 'video generation models'],
      ogImage: '/images/og-celebrities.jpg',
      ogUrl: `${this.SITE_URL}/celebrities`,
      canonical: `${this.SITE_URL}/celebrities`
    };
  }

  /**
   * Generate meta tags for specific celebrity
   */
  static getCelebrityMeta(celebrity: {
    name: string;
    role: string;
    description: string;
    image_url: string;
    id: number;
  }): Partial<MetaTags> {
    return {
      title: `${celebrity.name} AI Model - ${celebrity.role} | BrandedBy`,
      description: `Create AI videos with ${celebrity.name}. ${celebrity.description.substring(0, 150)}...`,
      keywords: [celebrity.name, celebrity.role, 'AI video', 'celebrity AI', 'video generation'],
      ogTitle: `${celebrity.name} - AI Video Generation`,
      ogDescription: celebrity.description,
      ogImage: celebrity.image_url,
      ogUrl: `${this.SITE_URL}/celebrity/${celebrity.id}`,
      ogType: 'profile',
      canonical: `${this.SITE_URL}/celebrity/${celebrity.id}`
    };
  }

  /**
   * Generate meta tags for blog post
   */
  static getBlogPostMeta(post: {
    title: string;
    excerpt: string;
    author: string;
    publishedAt: string;
    image_url?: string;
    id: number;
  }): Partial<MetaTags> {
    return {
      title: `${post.title} | BrandedBy Blog`,
      description: post.excerpt,
      keywords: ['AI technology', 'video generation', 'artificial intelligence', 'tech blog'],
      ogTitle: post.title,
      ogDescription: post.excerpt,
      ogImage: post.image_url || '/images/og-blog-default.jpg',
      ogUrl: `${this.SITE_URL}/blog/${post.id}`,
      ogType: 'article',
      author: post.author,
      publishedTime: new Date(post.publishedAt).toISOString(),
      canonical: `${this.SITE_URL}/blog/${post.id}`
    };
  }

  /**
   * Add structured data (JSON-LD)
   */
  static addStructuredData(data: StructuredData): void {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);

    console.log('🔍 Structured data added:', data['@type']);
  }

  /**
   * Generate organization structured data
   */
  static getOrganizationData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BrandedBy',
      url: this.SITE_URL,
      logo: `${this.SITE_URL}/images/logo.png`,
      description: 'AI video generation platform for creating content with celebrity personas',
      sameAs: [
        'https://twitter.com/brandedby_ai',
        'https://linkedin.com/company/brandedby',
        'https://github.com/brandedby'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-0123',
        contactType: 'Customer Service',
        availableLanguage: ['English']
      }
    };
  }

  /**
   * Generate website structured data
   */
  static getWebsiteData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BrandedBy',
      url: this.SITE_URL,
      description: 'AI video generation platform for creating content with celebrity personas',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Generate person structured data for celebrity
   */
  static getCelebrityStructuredData(celebrity: {
    name: string;
    role: string;
    description: string;
    image_url: string;
    id: number;
  }): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: celebrity.name,
      jobTitle: celebrity.role,
      description: celebrity.description,
      image: this.getFullImageUrl(celebrity.image_url),
      url: `${this.SITE_URL}/celebrity/${celebrity.id}`,
      sameAs: [],
      knowsAbout: ['Acting', 'Entertainment', 'AI Technology']
    };
  }

  /**
   * Generate article structured data for blog post
   */
  static getBlogPostStructuredData(post: {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishedAt: string;
    image_url?: string;
    id: number;
  }): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      articleBody: post.content,
      author: {
        '@type': 'Person',
        name: post.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'BrandedBy',
        logo: {
          '@type': 'ImageObject',
          url: `${this.SITE_URL}/images/logo.png`
        }
      },
      datePublished: new Date(post.publishedAt).toISOString(),
      dateModified: new Date(post.publishedAt).toISOString(),
      image: post.image_url ? this.getFullImageUrl(post.image_url) : `${this.SITE_URL}/images/og-blog-default.jpg`,
      url: `${this.SITE_URL}/blog/${post.id}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.SITE_URL}/blog/${post.id}`
      }
    };
  }

  // Private helper methods
  private static setMetaTag(name: string, content: string): void {
    if (!content) return;
    
    let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = name;
      document.head.appendChild(tag);
    }
    tag.content = content;
  }

  private static setMetaProperty(property: string, content: string): void {
    if (!content) return;
    
    let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.content = content;
  }

  private static setLinkTag(rel: string, href: string): void {
    if (!href) return;
    
    let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!tag) {
      tag = document.createElement('link');
      tag.rel = rel;
      document.head.appendChild(tag);
    }
    tag.href = href;
  }

  private static clearMetaTags(): void {
    // Remove dynamic meta tags (keep essential ones)
    const selectors = [
      'meta[name="description"]',
      'meta[name="keywords"]',
      'meta[name="author"]',
      'meta[name="robots"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]',
      'meta[property^="article:"]',
      'link[rel="canonical"]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    });
  }

  private static getCurrentUrl(): string {
    return window.location.href;
  }

  private static getFullImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${this.SITE_URL}${imageUrl}`;
  }
}

export { SEOManager, type MetaTags, type StructuredData };
