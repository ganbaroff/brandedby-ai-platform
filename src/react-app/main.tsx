import App from "@/react-app/App.tsx";
import ErrorBoundary from "@/react-app/components/ErrorBoundary.tsx";
import "@/react-app/index.css";
import logger from "@/shared/logger";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Инициализируем логирование
logger.info('Application starting', { 
  url: window.location.href,
  userAgent: navigator.userAgent 
});

// Запускаем периодическую отправку логов
logger.startPeriodicLogging();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
