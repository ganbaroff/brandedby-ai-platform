// Sentry Error Tracking Configuration
// File: src/react-app/sentry.config.ts
// Purpose: Centralized Sentry initialization for error tracking and monitoring

import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Only initialize in production
  if (import.meta.env.PROD) {
    Sentry.init({
      // DSN from environment variable (set in deployment)
      dsn: import.meta.env.VITE_SENTRY_DSN,
      
      // Environment
      environment: import.meta.env.MODE,
      
      // Release version
      release: import.meta.env.VITE_APP_VERSION || "0.1.0",
      
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      
      // Configure attachments (for more context)
      attachStacktrace: true,
      
      // Breadcrumb configuration
      maxBreadcrumbs: 50,
      
      // Integrations are auto-included by default
      
      // Filter out certain errors
      beforeSend(event, hint) {
        // Ignore network errors from third-party services
        if (event.exception) {
          const error = hint.originalException;
          if (
            error instanceof TypeError &&
            error.message.includes("Failed to fetch")
          ) {
            return null; // Drop the event
          }
        }
        
        // Ignore known non-critical errors
        if (event.tags?.errorType === "non-critical") {
          return null;
        }
        
        return event;
      },
      
      // Custom error filtering
      denyUrls: [
        // Browser extensions
        /^moz-extension:\/\//,
        /^chrome-extension:\/\//,
        // Third-party scripts
        /sentry\.io/,
      ],
    });
  }
};

// Wrapper for capturing exceptions with additional context
export const captureException = (
  error: Error | unknown,
  context?: Record<string, unknown>
) => {
  if (import.meta.env.PROD) {
    if (context) {
      Sentry.withScope((scope) => {
        Object.entries(context).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            scope.setContext(key, value as Record<string, unknown>);
          }
        });
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  }
};

// Wrapper for capturing messages
export const captureMessage = (
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info"
) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level);
  }
};

// Add breadcrumb for tracking user actions
export const addBreadcrumb = (
  message: string,
  data?: Record<string, unknown>,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info"
) => {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb({
      message,
      data,
      level,
      timestamp: Date.now() / 1000,
    });
  }
};

// Set user context
export const setUserContext = (userId: string, email?: string, name?: string) => {
  if (import.meta.env.PROD) {
    Sentry.setUser({
      id: userId,
      email,
      username: name,
    });
  }
};

// Clear user context
export const clearUserContext = () => {
  if (import.meta.env.PROD) {
    Sentry.setUser(null);
  }
};

// Capture video generation metrics
export const captureVideoGenerationMetrics = (
  projectId: string,
  celebrity: string,
  duration: number,
  success: boolean,
  error?: string
) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage("Video Generation Event", "info");
    Sentry.setContext("video_generation", {
      projectId,
      celebrity,
      duration,
      success,
      error,
      timestamp: new Date().toISOString(),
    });
  }
};

// Capture payment metrics
export const capturePaymentMetrics = (
  amount: number,
  currency: string,
  paymentMethod: string,
  success: boolean,
  error?: string
) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage("Payment Event", "info");
    Sentry.setContext("payment", {
      amount,
      currency,
      paymentMethod,
      success,
      error,
      timestamp: new Date().toISOString(),
    });
  }
};

export default Sentry;
