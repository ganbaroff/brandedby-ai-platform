import App from "@/react-app/App.tsx";
import EnhancedErrorBoundary from "@/react-app/components/EnhancedErrorBoundary.tsx";
import "@/react-app/index.css";
import { addBreadcrumb, initSentry } from "@/react-app/sentry.config";
import logger from "@/shared/logger";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Initialize Sentry for error tracking
initSentry();

// Инициализируем логирование
logger.info('Application starting', { 
  url: window.location.href,
  userAgent: navigator.userAgent 
});

// Add breadcrumb for app initialization
addBreadcrumb('App initialization', {
  timestamp: new Date().toISOString(),
  environment: import.meta.env.MODE
});

// Запускаем периодическую отправку логов
logger.startPeriodicLogging();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EnhancedErrorBoundary>
      <App />
    </EnhancedErrorBoundary>
  </StrictMode>
);
