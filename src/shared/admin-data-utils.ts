// Enhanced data persistence for Admin Panel
// Handles localStorage operations with error handling and data validation

export interface Celebrity {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  category: string;
}

// Storage keys
const STORAGE_KEYS = {
  CELEBRITIES: 'brandedby_celebrities',
  BLOG_POSTS: 'brandedby_blog_posts',
  LAST_SAVE: 'brandedby_last_save'
} as const;

// Data persistence utilities
export class DataPersistence {
  // Save data to localStorage with error handling
  static saveToStorage<T>(key: string, data: T): boolean {
    try {
      const serializedData = JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      });
      localStorage.setItem(key, serializedData);
      localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
      console.log(`✅ Data saved to ${key}:`, data);
      return true;
    } catch (error) {
      console.error(`❌ Error saving data to ${key}:`, error);
      return false;
    }
  }

  // Load data from localStorage with validation
  static loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        console.log(`📂 No data found for ${key}, using default`);
        return defaultValue;
      }

      const parsed = JSON.parse(stored);
      
      // Handle both old format (direct data) and new format (with metadata)
      const data = parsed.data || parsed;
      console.log(`✅ Data loaded from ${key}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error loading data from ${key}:`, error);
      return defaultValue;
    }
  }

  // Get storage statistics
  static getStorageStats(): { 
    celebrities: number, 
    blogPosts: number, 
    lastSave: string | null,
    storageUsed: string
  } {
    const celebrities = this.loadFromStorage(STORAGE_KEYS.CELEBRITIES, []);
    const blogPosts = this.loadFromStorage(STORAGE_KEYS.BLOG_POSTS, []);
    const lastSave = localStorage.getItem(STORAGE_KEYS.LAST_SAVE);
    
    // Calculate storage usage
    let storageUsed = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        storageUsed += localStorage.getItem(key)?.length || 0;
      }
    }
    
    return {
      celebrities: Array.isArray(celebrities) ? celebrities.length : 0,
      blogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0,
      lastSave,
      storageUsed: `${(storageUsed / 1024).toFixed(2)} KB`
    };
  }

  // Clear all data (for development/testing)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🗑️ All data cleared');
  }

  // Export data for backup
  static exportData(): string {
    const celebrities = this.loadFromStorage(STORAGE_KEYS.CELEBRITIES, []);
    const blogPosts = this.loadFromStorage(STORAGE_KEYS.BLOG_POSTS, []);
    
    const exportData = {
      celebrities,
      blogPosts,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Import data from backup
  static importData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      
      if (importedData.celebrities) {
        this.saveToStorage(STORAGE_KEYS.CELEBRITIES, importedData.celebrities);
      }
      
      if (importedData.blogPosts) {
        this.saveToStorage(STORAGE_KEYS.BLOG_POSTS, importedData.blogPosts);
      }
      
      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }
}

// Celebrity data management
export class CelebrityManager {
  static saveCelebrities(celebrities: Celebrity[]): boolean {
    return DataPersistence.saveToStorage(STORAGE_KEYS.CELEBRITIES, celebrities);
  }

  static loadCelebrities(): Celebrity[] {
    const defaultCelebrities: Celebrity[] = [
      {
        id: 1,
        name: "Taylor Swift",
        image: "https://images.unsplash.com/photo-1494790108755-2616c27ac65b?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        description: "Global music superstar and songwriter",
        category: "Musician"
      },
      {
        id: 2,
        name: "Ryan Reynolds",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        description: "Canadian-American actor and producer",
        category: "Actor"
      },
      {
        id: 3,
        name: "Zendaya",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        description: "American actress and singer",
        category: "Actor"
      }
    ];

    return DataPersistence.loadFromStorage(STORAGE_KEYS.CELEBRITIES, defaultCelebrities);
  }
}

// Blog post data management
export class BlogManager {
  static saveBlogPosts(posts: BlogPost[]): boolean {
    return DataPersistence.saveToStorage(STORAGE_KEYS.BLOG_POSTS, posts);
  }

  static loadBlogPosts(): BlogPost[] {
    const defaultPosts: BlogPost[] = [
      {
        id: 1,
        title: 'AI Photography Revolution',
        content: `<p>Artificial intelligence is fundamentally changing the way we create and process photographs. New technologies allow for incredibly realistic image generation in seconds.</p>

<h2>What makes AI photography special?</h2>
<p>AI technologies open unlimited possibilities for creativity:</p>
<ul>
<li><strong>Instant creation</strong> - image generation in seconds</li>
<li><strong>Personalization</strong> - adaptation to your preferences</li>
<li><strong>High quality</strong> - professional results without experience</li>
</ul>

<h2>Industry applications</h2>
<p>From film industry to social media - AI photography is changing all areas of visual content.</p>`,
        excerpt: 'How AI technologies are transforming photography and video production',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&auto=format&q=80',
        author: 'BrandedBy Team',
        publishedAt: '2025-11-06',
        category: 'Technology'
      },
      {
        id: 2,
        title: 'Creating Personal Videos with Celebrities',
        content: `<p>Learn how our platform allows you to create unique videos where you can interact with your favorite celebrities.</p>

<h2>Step-by-step process</h2>
<ol>
<li><strong>Upload selfie</strong> - quality face photo</li>
<li><strong>Choose celebrity</strong> - from our star database</li>
<li><strong>Configure settings</strong> - duration and video style</li>
<li><strong>Get result</strong> - HD video in minutes</li>
</ol>

<h2>Tips for best results</h2>
<p>For maximum realistic results, follow these recommendations:</p>
<ul>
<li>Use clear photo with good lighting</li>
<li>Face should be fully visible</li>
<li>Avoid sunglasses and covering accessories</li>
</ul>`,
        excerpt: 'Step-by-step guide to creating AI videos with selfies',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop&auto=format&q=80',
        author: 'Alex Johnson',
        publishedAt: '2025-11-05',
        category: 'Tutorial'
      },
      {
        id: 3,
        title: 'The Future of Entertainment: AI and Personalization',
        content: `<p>Exploring how artificial intelligence is shaping the future of the entertainment industry and creating new forms of interaction.</p>

<h2>AI Entertainment Trends</h2>
<p>The entertainment industry is experiencing a revolution thanks to AI:</p>

<h3>1. Personalized Content</h3>
<p>AI analyzes user preferences and creates unique content for everyone.</p>

<h3>2. Interactive Media</h3>
<p>Viewers become part of the story, influencing the plot in real time.</p>

<h3>3. Virtual Actors</h3>
<p>AI characters become increasingly realistic and emotional.</p>

<h2>What awaits us?</h2>
<p>In the near future we will see:</p>
<ul>
<li>Fully personalized movies</li>
<li>AI friends and companions</li>
<li>Interactive AR/VR worlds</li>
</ul>`,
        excerpt: 'A look into the future of AI entertainment and personalized content',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=500&fit=crop&auto=format&q=80',
        author: 'Maria Garcia',
        publishedAt: '2025-11-04',
        category: 'AI'
      }
    ];

    return DataPersistence.loadFromStorage(STORAGE_KEYS.BLOG_POSTS, defaultPosts);
  }

  static generateNewId(posts: BlogPost[]): number {
    return posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  }

  static validatePost(post: Partial<BlogPost>): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    if (!post.title?.trim()) errors.push('Title is required');
    if (!post.content?.trim()) errors.push('Content is required');
    if (!post.excerpt?.trim()) errors.push('Excerpt is required');
    if (!post.author?.trim()) errors.push('Author is required');
    if (!post.category?.trim()) errors.push('Category is required');
    if (!post.publishedAt) errors.push('Publish date is required');

    return { valid: errors.length === 0, errors };
  }
}

// Development utilities
export class DevTools {
  static logStorageContents(): void {
    console.group('🔍 Storage Contents');
    console.log('Celebrities:', CelebrityManager.loadCelebrities());
    console.log('Blog Posts:', BlogManager.loadBlogPosts());
    console.log('Storage Stats:', DataPersistence.getStorageStats());
    console.groupEnd();
  }

  static seedTestData(): void {
    console.log('🌱 Seeding test data...');
    
    // Add test celebrities
    const testCelebrities: Celebrity[] = [
      {
        id: 4,
        name: "Dwayne Johnson",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        description: "American actor and former professional wrestler",
        category: "Actor"
      },
      {
        id: 5,
        name: "Ariana Grande",
        image: "https://images.unsplash.com/photo-1494790108755-2616c27ac65b?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        description: "American singer, songwriter and actress",
        category: "Musician"
      }
    ];

    const existingCelebrities = CelebrityManager.loadCelebrities();
    const mergedCelebrities = [...existingCelebrities, ...testCelebrities];
    CelebrityManager.saveCelebrities(mergedCelebrities);

    // Add test blog post
    const testPost: BlogPost = {
      id: 4,
      title: 'Getting Started with AI Video Generation',
      content: '<p>This is a comprehensive guide to getting started with AI video generation on our platform.</p><h2>Basic Steps</h2><p>Follow these simple steps to create your first AI video...</p>',
      excerpt: 'Complete beginner guide to AI video generation',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop&auto=format&q=80',
      author: 'Tutorial Team',
      publishedAt: '2025-11-06',
      category: 'Tutorial'
    };

    const existingPosts = BlogManager.loadBlogPosts();
    const mergedPosts = [...existingPosts, testPost];
    BlogManager.saveBlogPosts(mergedPosts);

    console.log('✅ Test data seeded successfully');
  }
}

// Make functions available globally for console access
declare global {
  interface Window {
    AdminDataUtils: {
      DataPersistence: typeof DataPersistence;
      CelebrityManager: typeof CelebrityManager;
      BlogManager: typeof BlogManager;
      DevTools: typeof DevTools;
    };
  }
}

if (typeof window !== 'undefined') {
  window.AdminDataUtils = {
    DataPersistence,
    CelebrityManager,
    BlogManager,
    DevTools
  };
}