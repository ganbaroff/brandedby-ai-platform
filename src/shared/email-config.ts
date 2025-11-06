// EmailJS Configuration для отправки логов
export const EMAIL_CONFIG = {
  // Тестовые ключи - замените после регистрации на emailjs.com
  SERVICE_ID: 'service_test123', // Замените на ваш Service ID
  TEMPLATE_ID: 'template_test123', // Замените на ваш Template ID
  USER_ID: 'user_test123', // Замените на ваш User ID (Public Key)
  
  // Gmail куда отправлять логи - УКАЖИТЕ ВАШУ ПОЧТУ
  TARGET_EMAIL: 'your-email@gmail.com', // ⬅️ ЗАМЕНИТЕ НА ВАШУ ПОЧТУ
  
  // Настройки отправки
  SEND_ERRORS_IMMEDIATELY: true,
  BATCH_SEND_INTERVAL: 30 * 1000, // 30 секунд для тестирования
  MAX_LOGS_PER_BATCH: 10 // Меньше логов для тестирования
};

// Функция для инициализации EmailJS
export const initializeEmailJS = async () => {
  try {
    // Загружаем EmailJS SDK если еще не загружен
    if (!window.emailjs) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          window.emailjs.init(EMAIL_CONFIG.USER_ID);
          resolve(true);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    } else {
      window.emailjs.init(EMAIL_CONFIG.USER_ID);
      return true;
    }
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

// Расширяем глобальный интерфейс Window для EmailJS
declare global {
  interface Window {
    emailjs: {
      init: (userId: string) => void;
      send: (serviceId: string, templateId: string, params: Record<string, unknown>) => Promise<Response>;
    };
  }
}