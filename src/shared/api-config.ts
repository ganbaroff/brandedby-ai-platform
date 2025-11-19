/**
 * API Configuration Management
 * Handles storage and retrieval of API keys and configurations for external services
 */

export interface APIConfig {
  id: string;
  name: string;
  type: 'analytics' | 'social' | 'payment' | 'email' | 'other';
  status: 'active' | 'inactive' | 'testing';
  config: {
    apiKey?: string;
    pixelId?: string;
    trackingId?: string;
    webhookUrl?: string;
    clientId?: string;
    clientSecret?: string;
    [key: string]: string | number | boolean | undefined;
  };
  metadata: {
    description: string;
    documentation?: string;
    testEndpoint?: string;
    requiredFields: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export const API_TEMPLATES: Omit<APIConfig, 'id' | 'createdAt' | 'updatedAt' | 'config'>[] = [
  {
    name: 'Facebook Pixel',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Track conversions and optimize Facebook ads',
      documentation: 'https://developers.facebook.com/docs/facebook-pixel',
      requiredFields: ['pixelId'],
    },
  },
  {
    name: 'Google Analytics 4',
    type: 'analytics', 
    status: 'inactive',
    metadata: {
      description: 'Track website traffic and user behavior',
      documentation: 'https://developers.google.com/analytics/devguides/collection/ga4',
      requiredFields: ['trackingId'],
    },
  },
  {
    name: 'Google Tag Manager',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Manage marketing and analytics tags',
      documentation: 'https://developers.google.com/tag-manager',
      requiredFields: ['trackingId'],
    },
  },
  {
    name: 'TikTok Pixel',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Track TikTok ad performance and conversions',
      documentation: 'https://ads.tiktok.com/help/article/standard-events-parameters',
      requiredFields: ['pixelId'],
    },
  },
  {
    name: 'Twitter Pixel',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Track Twitter ad conversions',
      documentation: 'https://business.twitter.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites.html',
      requiredFields: ['pixelId'],
    },
  },
  {
    name: 'LinkedIn Insight Tag',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Track LinkedIn ad performance',
      documentation: 'https://www.linkedin.com/help/lms/answer/a427660',
      requiredFields: ['trackingId'],
    },
  },
  {
    name: 'Snapchat Pixel',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Track Snapchat ad conversions',
      documentation: 'https://businesshelp.snapchat.com/s/article/snap-pixel',
      requiredFields: ['pixelId'],
    },
  },
  {
    name: 'Hotjar',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'User behavior analytics and heatmaps',
      documentation: 'https://help.hotjar.com/hc/en-us/articles/115009336727',
      requiredFields: ['trackingId'],
    },
  },
  {
    name: 'Mixpanel',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Advanced product analytics',
      documentation: 'https://developer.mixpanel.com/docs',
      requiredFields: ['apiKey'],
    },
  },
  {
    name: 'Amplitude',
    type: 'analytics',
    status: 'inactive',
    metadata: {
      description: 'Product intelligence platform',
      documentation: 'https://developers.amplitude.com/',
      requiredFields: ['apiKey'],
    },
  },
  {
    name: 'Custom Webhook',
    type: 'other',
    status: 'inactive',
    metadata: {
      description: 'Send events to custom webhook endpoint',
      documentation: '',
      requiredFields: ['webhookUrl'],
    },
  },
];

class APIConfigManager {
  private configs: Map<string, APIConfig> = new Map();
  private storageKey = 'brandedby_api_configs';

  constructor() {
    this.loadFromStorage();
  }

  // Load configurations from localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const configs = JSON.parse(stored);
        configs.forEach((config: APIConfig) => {
          this.configs.set(config.id, config);
        });
      }
    } catch (error) {
      console.error('Failed to load API configs from storage:', error);
    }
  }

  // Save configurations to localStorage
  private saveToStorage() {
    try {
      const configs = Array.from(this.configs.values());
      localStorage.setItem(this.storageKey, JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to save API configs to storage:', error);
    }
  }

  // Generate unique ID for new configurations
  private generateId(): string {
    return `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add or update API configuration
  setConfig(configData: Omit<APIConfig, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const config: APIConfig = {
      ...configData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.configs.set(id, config);
    this.saveToStorage();
    return id;
  }

  // Update existing configuration
  updateConfig(id: string, updates: Partial<Omit<APIConfig, 'id' | 'createdAt'>>): boolean {
    const existing = this.configs.get(id);
    if (!existing) return false;

    const updated: APIConfig = {
      ...existing,
      ...updates,
      id, // Preserve ID
      createdAt: existing.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    this.configs.set(id, updated);
    this.saveToStorage();
    return true;
  }

  // Get configuration by ID
  getConfig(id: string): APIConfig | null {
    return this.configs.get(id) || null;
  }

  // Get all configurations
  getAllConfigs(): APIConfig[] {
    return Array.from(this.configs.values());
  }

  // Get configurations by type
  getConfigsByType(type: APIConfig['type']): APIConfig[] {
    return this.getAllConfigs().filter(config => config.type === type);
  }

  // Get active configurations
  getActiveConfigs(): APIConfig[] {
    return this.getAllConfigs().filter(config => config.status === 'active');
  }

  // Remove configuration
  removeConfig(id: string): boolean {
    const result = this.configs.delete(id);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  // Test API configuration
  async testConfig(id: string): Promise<{ success: boolean; message: string }> {
    const config = this.getConfig(id);
    if (!config) {
      return { success: false, message: 'Configuration not found' };
    }

    try {
      // Simple validation for required fields
      const missingFields = config.metadata.requiredFields.filter(
        field => !config.config[field]
      );

      if (missingFields.length > 0) {
        return { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        };
      }

      // For now, just validate the structure
      // In a real implementation, you would make actual API calls to test
      return { success: true, message: 'Configuration is valid' };
    } catch (error) {
      return { success: false, message: `Test failed: ${error}` };
    }
  }

  // Export configurations (for backup)
  exportConfigs(): string {
    return JSON.stringify(this.getAllConfigs(), null, 2);
  }

  // Import configurations (for restore)
  importConfigs(data: string): { success: boolean; message: string; imported: number } {
    try {
      const configs = JSON.parse(data) as APIConfig[];
      let imported = 0;

      configs.forEach(config => {
        // Regenerate IDs to avoid conflicts
        const newConfig = {
          ...config,
          id: this.generateId(),
          updatedAt: new Date().toISOString(),
        };
        this.configs.set(newConfig.id, newConfig);
        imported++;
      });

      this.saveToStorage();
      return { success: true, message: 'Import successful', imported };
    } catch (error) {
      return { success: false, message: `Import failed: ${error}`, imported: 0 };
    }
  }
}

// Global instance
export const apiConfigManager = new APIConfigManager();

// Helper functions for tracking integration
export function getTrackingScript(config: APIConfig): string {
  switch (config.name) {
    case 'Facebook Pixel':
      return `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${config.config.pixelId}');
        fbq('track', 'PageView');
      `;
    
    case 'Google Analytics 4':
      return `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.config.trackingId}');
      `;
    
    case 'Google Tag Manager':
      return `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${config.config.trackingId}');
      `;
    
    default:
      return '';
  }
}

export function getTrackingPixels(config: APIConfig): string {
  switch (config.name) {
    case 'Facebook Pixel':
      return `<noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${config.config.pixelId}&ev=PageView&noscript=1"
      /></noscript>`;
    
    default:
      return '';
  }
}