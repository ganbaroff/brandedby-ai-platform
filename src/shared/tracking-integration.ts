/**
 * Tracking Integration System
 * Dynamically loads and manages tracking scripts based on API configurations
 */

import { analytics } from "@/shared/advanced-analytics";
import { APIConfig, apiConfigManager, getTrackingPixels, getTrackingScript } from "@/shared/api-config";
import logger from "@/shared/logger";

// Global window interface extensions for tracking libraries
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: {
      (...args: unknown[]): void;
      queue?: unknown[];
    };
    ttq?: {
      track: (event: string, data?: Record<string, unknown>) => void;
      page: () => void;
    };
    hj?: (...args: unknown[]) => void;
    _hjSettings?: { hjid: number; hjsv: number };
  }
}

interface TrackingEvent {
  event: string;
  data?: Record<string, string | number | boolean>;
  value?: number;
  currency?: string;
}

class TrackingIntegration {
  private loadedScripts: Set<string> = new Set();
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  // Initialize tracking integrations
  async initialize() {
    if (this.initialized) return;

    try {
      const activeConfigs = apiConfigManager.getActiveConfigs();
      
      // Load tracking scripts for active configurations
      for (const config of activeConfigs) {
        await this.loadTrackingScript(config);
      }

      // Add pixels to page
      this.injectTrackingPixels(activeConfigs);

      this.initialized = true;
      logger.info('Tracking integrations initialized', {
        activeIntegrations: activeConfigs.map(c => c.name),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to initialize tracking integrations', { error });
    }
  }

  // Load tracking script for a specific configuration
  private async loadTrackingScript(config: APIConfig): Promise<void> {
    if (this.loadedScripts.has(config.id)) return;

    try {
      const script = getTrackingScript(config);
      if (!script) return;

      // Create script element based on the service
      switch (config.name) {
        case 'Google Analytics 4':
          await this.loadGoogleAnalytics(config);
          break;
        case 'Google Tag Manager':
          await this.loadGoogleTagManager(config);
          break;
        case 'Facebook Pixel':
          await this.loadFacebookPixel(config);
          break;
        case 'TikTok Pixel':
          await this.loadTikTokPixel(config);
          break;
        case 'Hotjar':
          await this.loadHotjar(config);
          break;
        default:
          // For other services, inject the script directly
          this.injectScript(script, config.id);
      }

      this.loadedScripts.add(config.id);
    } catch (error) {
      logger.error(`Failed to load tracking script for ${config.name}`, { error });
    }
  }

  // Load Google Analytics 4
  private async loadGoogleAnalytics(config: APIConfig): Promise<void> {
    const trackingId = config.config.trackingId as string;
    if (!trackingId) return;

    // Load gtag script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(gtagScript);

    // Initialize gtag
    const initScript = document.createElement('script');
    initScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(initScript);

    // Make gtag available globally for tracking
    window.gtag = window.gtag || function(...args: unknown[]){
      (window.dataLayer = window.dataLayer || []).push(args);
    };
  }

  // Load Google Tag Manager
  private async loadGoogleTagManager(config: APIConfig): Promise<void> {
    const trackingId = config.config.trackingId as string;
    if (!trackingId) return;

    // GTM Head script
    const gtmScript = document.createElement('script');
    gtmScript.textContent = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${trackingId}');
    `;
    document.head.appendChild(gtmScript);

    // GTM noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${trackingId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.appendChild(noscript);
  }

  // Load Facebook Pixel
  private async loadFacebookPixel(config: APIConfig): Promise<void> {
    const pixelId = config.config.pixelId as string;
    if (!pixelId) return;

    const fbqScript = document.createElement('script');
    fbqScript.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbqScript);

    // Make fbq available globally
    window.fbq = window.fbq || function(...args: unknown[]){
      (window.fbq!.queue = window.fbq!.queue || []).push(args);
    };
  }

  // Load TikTok Pixel
  private async loadTikTokPixel(config: APIConfig): Promise<void> {
    const pixelId = config.config.pixelId as string;
    if (!pixelId) return;

    const ttqScript = document.createElement('script');
    ttqScript.textContent = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
        ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
        return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},
        ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
        var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(ttqScript);
  }

  // Load Hotjar
  private async loadHotjar(config: APIConfig): Promise<void> {
    const trackingId = config.config.trackingId as string;
    if (!trackingId) return;

    const hjScript = document.createElement('script');
    hjScript.textContent = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${trackingId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(hjScript);
  }

  // Inject tracking pixels
  private injectTrackingPixels(configs: APIConfig[]): void {
    configs.forEach(config => {
      const pixel = getTrackingPixels(config);
      if (pixel) {
        const pixelElement = document.createElement('div');
        pixelElement.innerHTML = pixel;
        document.body.appendChild(pixelElement);
      }
    });
  }

  // Generic script injection
  private injectScript(scriptContent: string, configId: string): void {
    const script = document.createElement('script');
    script.textContent = scriptContent;
    script.setAttribute('data-config-id', configId);
    document.head.appendChild(script);
  }

  // Track conversion event across all active platforms
  trackConversion(event: TrackingEvent): void {
    const activeConfigs = apiConfigManager.getActiveConfigs();

    activeConfigs.forEach(config => {
      try {
        switch (config.name) {
          case 'Facebook Pixel':
            this.trackFacebookEvent(event);
            break;
          case 'Google Analytics 4':
            this.trackGoogleAnalyticsEvent(event);
            break;
          case 'TikTok Pixel':
            this.trackTikTokEvent(event);
            break;
          case 'Custom Webhook':
            this.trackWebhookEvent(config, event);
            break;
        }
      } catch (error) {
        logger.error(`Failed to track event on ${config.name}`, { error, event });
      }
    });

    // Also track in our internal analytics
    analytics.trackEvent('conversion', event.event, 'tracking-integration', {
      ...event.data,
      value: event.value,
      currency: event.currency
    });
  }

  // Track Facebook Pixel events
  private trackFacebookEvent(event: TrackingEvent): void {
    const fbq = window.fbq;
    if (!fbq) return;

    const eventData: Record<string, string | number> = {};
    if (event.value) eventData.value = event.value;
    if (event.currency) eventData.currency = event.currency;
    if (event.data) Object.assign(eventData, event.data);

    fbq('track', event.event, eventData);
  }

  // Track Google Analytics events
  private trackGoogleAnalyticsEvent(event: TrackingEvent): void {
    const gtag = window.gtag;
    if (!gtag) return;

    const eventData: Record<string, string | number> = {};
    if (event.value) eventData.value = event.value;
    if (event.currency) eventData.currency = event.currency;
    if (event.data) Object.assign(eventData, event.data);

    gtag('event', event.event, eventData);
  }

  // Track TikTok Pixel events
  private trackTikTokEvent(event: TrackingEvent): void {
    const ttq = window.ttq;
    if (!ttq) return;

    const eventData: Record<string, string | number> = {};
    if (event.value) eventData.value = event.value;
    if (event.currency) eventData.currency = event.currency;
    if (event.data) Object.assign(eventData, event.data);

    ttq.track(event.event, eventData);
  }

  // Track webhook events
  private async trackWebhookEvent(config: APIConfig, event: TrackingEvent): Promise<void> {
    const webhookUrl = config.config.webhookUrl as string;
    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: event.event,
          data: event.data,
          value: event.value,
          currency: event.currency,
          timestamp: new Date().toISOString(),
          source: 'brandedby-ai'
        })
      });
    } catch (error) {
      logger.error('Failed to send webhook event', { error, webhookUrl });
    }
  }

  // Page view tracking
  trackPageView(path?: string): void {
    const activeConfigs = apiConfigManager.getActiveConfigs();

    activeConfigs.forEach(config => {
      try {
        switch (config.name) {
          case 'Facebook Pixel': {
            const fbq = window.fbq;
            if (fbq) fbq('track', 'PageView');
            break;
          }
          case 'Google Analytics 4': {
            const gtag = window.gtag;
            if (gtag) {
              gtag('config', config.config.trackingId, {
                page_path: path || window.location.pathname
              });
            }
            break;
          }
          case 'TikTok Pixel': {
            const ttq = window.ttq;
            if (ttq) ttq.page();
            break;
          }
        }
      } catch (error) {
        logger.error(`Failed to track page view on ${config.name}`, { error });
      }
    });
  }

  // Reload integrations when configurations change
  async reloadIntegrations(): Promise<void> {
    // Remove existing scripts
    this.loadedScripts.clear();
    
    // Remove tracking scripts from DOM
    const existingScripts = document.querySelectorAll('script[data-config-id]');
    existingScripts.forEach(script => script.remove());

    this.initialized = false;
    await this.initialize();
  }

  // Get status of all integrations
  getIntegrationsStatus(): { name: string; loaded: boolean; active: boolean }[] {
    const allConfigs = apiConfigManager.getAllConfigs();
    
    return allConfigs.map(config => ({
      name: config.name,
      loaded: this.loadedScripts.has(config.id),
      active: config.status === 'active'
    }));
  }
}

// Global tracking integration instance
export const trackingIntegration = new TrackingIntegration();

// Convenience functions for common tracking events
export const trackingEvents = {
  // E-commerce events
  purchase: (orderId: string, value: number, currency = 'USD', itemCount?: number) => {
    trackingIntegration.trackConversion({
      event: 'Purchase',
      data: { order_id: orderId, item_count: itemCount || 1 },
      value,
      currency
    });
  },

  addToCart: (contentId: string, value: number, currency = 'USD') => {
    trackingIntegration.trackConversion({
      event: 'AddToCart',
      data: { content_id: contentId },
      value,
      currency
    });
  },

  initiateCheckout: (value: number, currency = 'USD', numItems = 1) => {
    trackingIntegration.trackConversion({
      event: 'InitiateCheckout',
      data: { num_items: numItems },
      value,
      currency
    });
  },

  // Lead generation events
  lead: (leadType: string, value?: number) => {
    trackingIntegration.trackConversion({
      event: 'Lead',
      data: { lead_type: leadType },
      value
    });
  },

  completeRegistration: (method: string) => {
    trackingIntegration.trackConversion({
      event: 'CompleteRegistration',
      data: { registration_method: method }
    });
  },

  // Content engagement
  viewContent: (contentType: string, contentId: string) => {
    trackingIntegration.trackConversion({
      event: 'ViewContent',
      data: { content_type: contentType, content_id: contentId }
    });
  },

  // Video generation specific events
  videoGenerated: (celebrityId: string, packageType: string, value: number) => {
    trackingIntegration.trackConversion({
      event: 'VideoGenerated',
      data: { 
        celebrity_id: celebrityId, 
        package_type: packageType,
        content_type: 'ai_video'
      },
      value
    });
  },

  packageSelected: (packageType: string, value: number) => {
    trackingIntegration.trackConversion({
      event: 'PackageSelected',
      data: { package_type: packageType },
      value
    });
  }
};

// Initialize tracking when module is loaded
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      trackingIntegration.initialize();
    });
  } else {
    trackingIntegration.initialize();
  }
}