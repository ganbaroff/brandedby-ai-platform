/**
 * Advanced Analytics & User Behavior Tracking
 * Comprehensive system for tracking user interactions, conversion funnel, and business metrics
 */

import React, { useCallback, useEffect, useState } from 'react';

// Types for analytics events
export interface AnalyticsEvent {
  id: string;
  event: string;
  category: 'user' | 'celebrity' | 'payment' | 'performance' | 'conversion';
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
  page: string;
  userAgent: string;
  referrer: string;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: AnalyticsEvent[];
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    os: string;
    browser: string;
  };
  location?: {
    country?: string;
    city?: string;
    timezone: string;
  };
}

export interface ConversionFunnel {
  landingPage: number;
  celebrityView: number;
  selfieUpload: number;
  paymentPage: number;
  completed: number;
  abandoned: number;
}

/**
 * Advanced Analytics Manager
 */
class AdvancedAnalytics {
  private static instance: AdvancedAnalytics;
  private sessionId: string;
  private session: UserSession;
  private events: AnalyticsEvent[] = [];
  private isTracking = true;
  
  private constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.initializeSession();
    this.setupEventListeners();
  }

  public static getInstance(): AdvancedAnalytics {
    if (!AdvancedAnalytics.instance) {
      AdvancedAnalytics.instance = new AdvancedAnalytics();
    }
    return AdvancedAnalytics.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): UserSession {
    return {
      sessionId: this.sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: [],
      device: this.detectDevice(),
      location: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };
  }

  private detectDevice() {
    const ua = navigator.userAgent;
    let deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop';
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      deviceType = 'mobile';
    }

    // Detect OS
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'MacOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    // Detect Browser
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    return { type: deviceType, os, browser };
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('user', 'page_hidden', 'visibility');
      } else {
        this.trackEvent('user', 'page_visible', 'visibility');
        this.session.lastActivity = Date.now();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('user', 'page_unload', 'navigation');
      this.saveSession();
    });

    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        this.trackEvent('user', 'click', 'interaction', {
          element: target.tagName,
          text: target.textContent?.slice(0, 50),
          className: target.className
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.trackEvent('user', 'form_submit', 'conversion', {
        formId: form.id,
        formName: form.name
      });
    });
  }

  public trackEvent(
    category: AnalyticsEvent['category'],
    action: string,
    label?: string,
    metadata?: Record<string, unknown>,
    value?: number
  ) {
    if (!this.isTracking) return;

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      event: `${category}_${action}`,
      category,
      action,
      label,
      value,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      metadata,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    this.events.push(event);
    this.session.events.push(event);
    this.session.lastActivity = Date.now();

    // Send to analytics service (simulate)
    this.sendToAnalyticsService(event);

    console.log('📊 Analytics Event:', event);
  }

  public trackPageView(page: string, title?: string) {
    this.session.pageViews++;
    this.trackEvent('user', 'page_view', page, { 
      title: title || document.title,
      url: window.location.href
    });
  }

  public trackConversion(step: keyof ConversionFunnel, value?: number) {
    this.trackEvent('conversion', `funnel_${step}`, 'conversion_funnel', { step }, value);
  }

  public trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.trackEvent('performance', `metric_${metric}`, 'performance_monitoring', { 
      metric, 
      unit 
    }, value);
  }

  public trackError(error: Error, context?: string) {
    this.trackEvent('user', 'error', 'error_tracking', {
      message: error.message,
      stack: error.stack?.slice(0, 500),
      context
    });
  }

  private async sendToAnalyticsService(event: AnalyticsEvent) {
    try {
      // In real implementation, send to your analytics service
      // await fetch('/api/analytics/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
      
      // For now, store in localStorage for development
      const stored = localStorage.getItem('brandedby_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 1000 events in localStorage
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }
      
      localStorage.setItem('brandedby_analytics', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  private saveSession() {
    try {
      localStorage.setItem('brandedby_session', JSON.stringify(this.session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  public getSession(): UserSession {
    return { ...this.session };
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public getAnalyticsSummary() {
    const events = this.getEvents();
    const now = Date.now();
    const sessionDuration = now - this.session.startTime;

    const eventsByCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pageViews = events.filter(e => e.action === 'page_view').length;
    const clicks = events.filter(e => e.action === 'click').length;
    const errors = events.filter(e => e.action === 'error').length;

    return {
      sessionDuration,
      totalEvents: events.length,
      pageViews,
      clicks,
      errors,
      eventsByCategory,
      device: this.session.device,
      lastActivity: this.session.lastActivity
    };
  }

  public enableTracking() {
    this.isTracking = true;
    this.trackEvent('user', 'tracking_enabled', 'privacy');
  }

  public disableTracking() {
    this.isTracking = false;
    console.log('📊 Analytics tracking disabled');
  }

  public clearData() {
    this.events = [];
    this.session.events = [];
    localStorage.removeItem('brandedby_analytics');
    localStorage.removeItem('brandedby_session');
    this.trackEvent('user', 'data_cleared', 'privacy');
  }
}

// Export singleton instance
export const analytics = AdvancedAnalytics.getInstance();

/**
 * React hook for analytics
 */
export const useAnalytics = () => {
  const [summary, setSummary] = useState(analytics.getAnalyticsSummary());
  
  const trackEvent = useCallback((
    category: AnalyticsEvent['category'],
    action: string,
    label?: string,
    metadata?: Record<string, unknown>,
    value?: number
  ) => {
    analytics.trackEvent(category, action, label, metadata, value);
    setSummary(analytics.getAnalyticsSummary());
  }, []);

  const trackPageView = useCallback((page: string, title?: string) => {
    analytics.trackPageView(page, title);
    setSummary(analytics.getAnalyticsSummary());
  }, []);

  const trackConversion = useCallback((step: keyof ConversionFunnel, value?: number) => {
    analytics.trackConversion(step, value);
    setSummary(analytics.getAnalyticsSummary());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(analytics.getAnalyticsSummary());
    }, 30000); // Update summary every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    summary,
    session: analytics.getSession(),
    events: analytics.getEvents(),
    enableTracking: analytics.enableTracking.bind(analytics),
    disableTracking: analytics.disableTracking.bind(analytics),
    clearData: analytics.clearData.bind(analytics)
  };
};

/**
 * HOC for automatic page view tracking
 */
export const withAnalytics = <P extends object>(
  Component: React.ComponentType<P>,
  pageName: string
) => {
  return (props: P) => {
    const { trackPageView } = useAnalytics();

    useEffect(() => {
      trackPageView(pageName);
    }, [trackPageView]);

    return React.createElement(Component, props);
  };
};

export default analytics;