// Упрощенный логгер без уведомлений

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    // Убираем уведомления инициализации для пользователей
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private createLogEntry(level: LogEntry['level'], message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      sessionId: this.sessionId,
      userId: this.getCurrentUserId()
    };
  }

  private getCurrentUserId(): string | undefined {
    // Попытка получить ID пользователя из localStorage или контекста
    try {
      const userData = localStorage.getItem('auth_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.email || 'anonymous';
      }
    } catch {
      // Игнорируем ошибки парсинга
    }
    return 'anonymous';
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Ограничиваем количество логов в памяти
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Только ошибки выводим в консоль (без уведомлений на сайте)
    if (entry.level === 'ERROR') {
      console.error(`[ERROR] ${entry.message}`, entry.context || '');
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('INFO', message, context);
    this.addLog(entry);
  }

  warning(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('WARNING', message, context);
    this.addLog(entry);
  }

  error(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('ERROR', message, context);
    this.addLog(entry);
  }

  debug(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('DEBUG', message, context);
    this.addLog(entry);
  }

  // Отправка логов на email через EmailJS (отключено для пользователей)
  private async sendLogsToEmail(logs: LogEntry[]) {
    // Убираем отправку логов и уведомления - только сохраняем локально
    this.saveLogsToLocalStorage(logs);
  }

  private getEmailConfig() {
    try {
      const stored = localStorage.getItem('emailjs_config');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading EmailJS config:', error);
    }
    
    return {
      serviceId: 'service_test123',
      templateId: 'template_test123', 
      userId: 'user_test123',
      targetEmail: 'your-email@gmail.com'
    };
  }

  private isConfigValid(config: Record<string, string>) {
    return config.serviceId && 
           config.templateId && 
           config.userId &&
           config.targetEmail &&
           config.serviceId !== 'service_test123' &&
           config.targetEmail !== 'your-email@gmail.com';
  }

  private saveLogsToLocalStorage(logs: LogEntry[]) {
    try {
      const failedLogs = JSON.parse(localStorage.getItem('failed_logs') || '[]');
      failedLogs.push(...logs);
      localStorage.setItem('failed_logs', JSON.stringify(failedLogs.slice(-200))); // Ограничиваем 200 логами
      // Убираем уведомление для пользователей
    } catch (storageError) {
      console.error('Failed to save logs to localStorage:', storageError);
    }
  }



  // Отправка всех накопленных логов
  sendAllLogs() {
    if (this.logs.length > 0) {
      this.sendLogsToEmail([...this.logs]);
    }
  }

  // Отправка логов по расписанию (каждые 5 минут)
  startPeriodicLogging() {
    setInterval(() => {
      if (this.logs.length > 0) {
        const logsToSend = [...this.logs];
        this.logs = []; // Очищаем после отправки
        this.sendLogsToEmail(logsToSend);
      }
    }, 5 * 60 * 1000); // 5 минут
  }

  // Получение всех логов
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Очистка логов
  clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }

  // Сохранение конфигурации EmailJS
  saveEmailConfig(config: { serviceId: string; templateId: string; userId: string; targetEmail: string }) {
    try {
      localStorage.setItem('emailjs_config', JSON.stringify(config));
      this.info('EmailJS configuration saved', { email: config.targetEmail });
      
      // Инициализируем EmailJS с новой конфигурацией
      if (window.emailjs) {
        window.emailjs.init(config.userId);
        this.info('EmailJS reinitialized with new config');
      }
    } catch (error) {
      this.error('Failed to save EmailJS config', { error });
    }
  }

  // Получение сохранённых логов для повторной отправки
  getFailedLogs(): LogEntry[] {
    try {
      const failedLogs = localStorage.getItem('failed_logs');
      return failedLogs ? JSON.parse(failedLogs) : [];
    } catch (error) {
      console.error('Error reading failed logs:', error);
      return [];
    }
  }

  // Повторная отправка сохранённых логов
  async retrySendingFailedLogs() {
    const failedLogs = this.getFailedLogs();
    if (failedLogs.length > 0) {
      this.info('Retrying to send failed logs', { count: failedLogs.length });
      await this.sendLogsToEmail(failedLogs);
      localStorage.removeItem('failed_logs');
    }
  }

  // Получение статуса конфигурации
  getConfigStatus() {
    const config = this.getEmailConfig();
    return {
      isValid: this.isConfigValid(config),
      config: config,
      emailJSLoaded: !!window.emailjs,
      failedLogsCount: this.getFailedLogs().length
    };
  }

  // Логирование действий пользователя
  logUserAction(action: string, details?: Record<string, unknown>) {
    this.info(`User Action: ${action}`, details);
  }

  // Логирование ошибок API
  logApiError(endpoint: string, error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    this.error(`API Error: ${endpoint}`, {
      error: errorMessage,
      stack: errorStack,
      endpoint
    });
  }

  // Логирование производительности
  logPerformance(operation: string, duration: number) {
    this.info(`Performance: ${operation}`, { duration: `${duration}ms` });
  }
}

// Создаем глобальный экземпляр
const logger = new Logger();

// Перехватываем необработанные ошибки
window.addEventListener('error', (event) => {
  logger.error('Unhandled Error', {
    message: event.error?.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

// Перехватываем необработанные промисы
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', {
    reason: event.reason,
    promise: event.promise
  });
});

export default logger;