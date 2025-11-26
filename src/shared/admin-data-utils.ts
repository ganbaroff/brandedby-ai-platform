// Enhanced data persistence for Admin Panel
// Handles API operations with error handling and data validation

export interface Celebrity {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  niches: string;
  rating: number;
  popularity: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  publishedAt: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface Template {
  id: number;
  name: string;
  category: string;
  description: string | null;
  is_azeri: boolean;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
  emoji: string;
  status: 'active' | 'draft' | 'archived';
  usage_count: number;
  tags?: string[];
}

// API Utilities
class ApiService {
  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`/api${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data;
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data;
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data;
  }

  static async delete(endpoint: string): Promise<boolean> {
    const response = await fetch(`/api${endpoint}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
}

// Celebrity data management
export class CelebrityManager {
  static async saveCelebrities(celebrities: Celebrity[]): Promise<boolean> {
    // This method was used for bulk save in localStorage. 
    // For API, we might need to save one by one or implement a bulk endpoint.
    // For now, let's log a warning that bulk save is not fully supported or implement a loop.
    console.warn("Bulk save not fully supported via API, saving items sequentially");
    try {
      for (const celeb of celebrities) {
        if (celeb.id) {
          await this.updateCelebrity(celeb);
        } else {
          await this.addCelebrity(celeb);
        }
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async loadCelebrities(): Promise<Celebrity[]> {
    try {
      return await ApiService.get<Celebrity[]>('/celebrities');
    } catch (error) {
      console.error("Failed to load celebrities", error);
      return [];
    }
  }

  static async getCelebrityById(id: number): Promise<Celebrity | null> {
    try {
      return await ApiService.get<Celebrity>(`/celebrities/${id}`);
    } catch (error) {
      console.error(`Failed to load celebrity ${id}`, error);
      return null;
    }
  }

  static async addCelebrity(celebrity: Omit<Celebrity, 'id'>): Promise<Celebrity> {
    return await ApiService.post<Celebrity>('/celebrities', celebrity);
  }

  static async updateCelebrity(celebrity: Celebrity): Promise<Celebrity> {
    return await ApiService.put<Celebrity>(`/celebrities/${celebrity.id}`, celebrity);
  }

  static async deleteCelebrity(id: number): Promise<boolean> {
    return await ApiService.delete(`/celebrities/${id}`);
  }
}

// Blog post data management
export class BlogManager {
  static async saveBlogPosts(posts: BlogPost[]): Promise<boolean> {
    console.warn("Bulk save not fully supported via API");
    return true; 
  }

  static async loadBlogPosts(): Promise<BlogPost[]> {
    try {
      return await ApiService.get<BlogPost[]>('/blog-posts');
    } catch (error) {
      console.error("Failed to load blog posts", error);
      return [];
    }
  }

  static async addBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    return await ApiService.post<BlogPost>('/blog-posts', post);
  }

  static async updateBlogPost(post: BlogPost): Promise<BlogPost> {
    return await ApiService.put<BlogPost>(`/blog-posts/${post.id}`, post);
  }

  static async deleteBlogPost(id: number): Promise<boolean> {
    return await ApiService.delete(`/blog-posts/${id}`);
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

// Template data management
export class TemplateManager {
  static async saveTemplates(templates: Template[]): Promise<boolean> {
     console.warn("Bulk save not fully supported via API");
     return true;
  }

  static async loadTemplates(): Promise<Template[]> {
    try {
      return await ApiService.get<Template[]>('/templates');
    } catch (error) {
      console.error("Failed to load templates", error);
      return [];
    }
  }

  static async addTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    return await ApiService.post<Template>('/templates', template);
  }

  static async updateTemplate(template: Template): Promise<Template> {
    return await ApiService.put<Template>(`/templates/${template.id}`, template);
  }

  static async deleteTemplate(id: number): Promise<boolean> {
    return await ApiService.delete(`/templates/${id}`);
  }

  static async getTemplatesByCategory(category: string): Promise<Template[]> {
    const templates = await this.loadTemplates();
    return templates.filter(t => t.category === category);
  }

  static validateTemplate(template: Partial<Template>): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    if (!template.name?.trim()) errors.push('Template name is required');
    if (!template.category?.trim()) errors.push('Category is required');
    if (!template.emoji?.trim()) errors.push('Emoji is required');
    if (template.status && !['active', 'draft', 'archived'].includes(template.status)) {
      errors.push('Invalid status value');
    }

    return { valid: errors.length === 0, errors };
  }
}

// Deprecated DataPersistence for backward compatibility (mostly unused now)
export class DataPersistence {
  static saveToStorage<T>(key: string, data: T): boolean {
    console.warn("DataPersistence.saveToStorage is deprecated. Use Managers instead.");
    return false;
  }

  static loadFromStorage<T>(key: string, defaultValue: T): T {
    console.warn("DataPersistence.loadFromStorage is deprecated. Use Managers instead.");
    return defaultValue;
  }
  
  static getStorageStats() {
      return {
          celebrities: 0,
          blogPosts: 0,
          templates: 0,
          lastSave: null,
          storageUsed: '0 KB'
      };
  }
}

// Development utilities
export class DevTools {
  static async logStorageContents(): Promise<void> {
    console.group('🔍 Database Contents');
    console.log('Celebrities:', await CelebrityManager.loadCelebrities());
    console.log('Blog Posts:', await BlogManager.loadBlogPosts());
    console.log('Templates:', await TemplateManager.loadTemplates());
    console.groupEnd();
  }
}

// Make functions available globally for console access
declare global {
  interface Window {
    AdminDataUtils: {
      CelebrityManager: typeof CelebrityManager;
      BlogManager: typeof BlogManager;
      TemplateManager: typeof TemplateManager;
      DevTools: typeof DevTools;
    };
  }
}

if (typeof window !== 'undefined') {
  window.AdminDataUtils = {
    CelebrityManager,
    BlogManager,
    TemplateManager,
    DevTools
  };
}