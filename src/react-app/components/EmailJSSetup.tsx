import { EMAIL_CONFIG } from '@/shared/email-config';
import { useEffect, useState } from 'react';

const EmailJSSetup = () => {
  // Загружаем сохранённую конфигурацию или используем дефолтную
  const loadSavedConfig = () => {
    try {
      const saved = localStorage.getItem('emailjs_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved config:', error);
    }
    
    return {
      serviceId: EMAIL_CONFIG.SERVICE_ID,
      templateId: EMAIL_CONFIG.TEMPLATE_ID,
      userId: EMAIL_CONFIG.USER_ID,
      targetEmail: EMAIL_CONFIG.TARGET_EMAIL
    };
  };

  const [config, setConfig] = useState(loadSavedConfig());

  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isEmailJSLoaded, setIsEmailJSLoaded] = useState(false);

  useEffect(() => {
    // Загружаем EmailJS SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    
    script.onload = () => {
      setIsEmailJSLoaded(true);
      console.log('EmailJS loaded successfully');
    };
    
    script.onerror = () => {
      setStatusMessage('Failed to load EmailJS SDK');
      setTestStatus('error');
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const testEmailSending = async () => {
    if (!isEmailJSLoaded) {
      setStatusMessage('EmailJS SDK not loaded yet');
      setTestStatus('error');
      return;
    }

    setTestStatus('loading');
    setStatusMessage('Отправляем тестовое письмо...');

    try {
      // Инициализируем EmailJS
      const emailJS = (window as unknown as Record<string, unknown>).emailjs as {
        init: (id: string) => void;
        send: (serviceId: string, templateId: string, data: Record<string, unknown>) => Promise<unknown>;
      };
      
      if (!emailJS) {
        throw new Error('EmailJS not available');
      }
      
      emailJS.init(config.userId);

      // Тестовые данные для отправки
      const testData = {
        to_email: config.targetEmail,
        subject: '🧪 Test Email from BrandedBY Logger',
        message: `
Привет!

Это тестовое письмо от системы логирования BrandedBY.

Время отправки: ${new Date().toLocaleString('ru-RU')}
Конфигурация:
- Service ID: ${config.serviceId}
- Template ID: ${config.templateId}
- User ID: ${config.userId}
- Target Email: ${config.targetEmail}

Если вы получили это письмо, значит настройка работает правильно! ✅

Тестовые логи:
[INFO] Application started successfully
[INFO] User visited homepage  
[WARNING] This is a test warning message
[ERROR] This is a test error message

---
Автоматическое сообщение от BrandedBY Logger System
        `,
        app_name: 'BrandedBY',
        timestamp: new Date().toISOString(),
        session_id: 'test-session-' + Date.now(),
        log_count: 4,
        user_id: 'test-user'
      };

      // Отправляем через EmailJS
      const response = await emailJS.send(
        config.serviceId,
        config.templateId, 
        testData
      );

      console.log('Email sent successfully:', response);
      
      // Сохраняем конфигурацию в localStorage
      localStorage.setItem('emailjs_config', JSON.stringify(config));
      
      setTestStatus('success');
      setStatusMessage(`✅ Письмо успешно отправлено на ${config.targetEmail}! Конфигурация сохранена.`);
      
    } catch (error: unknown) {
      console.error('Email sending failed:', error);
      setTestStatus('error');
      
      const errorObj = error as { status?: number; text?: string; message?: string };
      
      if (errorObj.status === 400) {
        setStatusMessage('❌ Ошибка 400: Проверьте Service ID и Template ID');
      } else if (errorObj.status === 401) {
        setStatusMessage('❌ Ошибка 401: Неверный User ID (Public Key)');
      } else if (errorObj.status === 402) {
        setStatusMessage('❌ Ошибка 402: Превышен лимит EmailJS');  
      } else if (errorObj.status === 404) {
        setStatusMessage('❌ Ошибка 404: Service или Template не найден');
      } else {
        setStatusMessage(`❌ Ошибка: ${errorObj.text || errorObj.message || 'Неизвестная ошибка'}`);
      }
    }
  };

  const setupInstructions = [
    {
      step: 1,
      title: 'Register on EmailJS',
      description: 'Go to https://www.emailjs.com/ and create a free account'
    },
    {
      step: 2, 
      title: 'Создайте Gmail Service',
      description: 'В панели EmailJS: Email Services → Add New Service → Gmail → Авторизуйтесь'
    },
    {
      step: 3,
      title: 'Создайте Email Template', 
      description: 'Email Templates → Create New Template → используйте переменные: {{to_email}}, {{subject}}, {{message}}'
    },
    {
      step: 4,
      title: 'Получите ключи',
      description: 'Account → API Keys → скопируйте Service ID, Template ID и User ID'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            📧 EmailJS Configuration & Testing
          </h2>
          <p className="text-gray-600 mt-1">
            Настройка отправки логов на вашу почту
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Configuration Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4">⚙️ Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service ID
                  </label>
                  <input
                    type="text"
                    value={config.serviceId}
                    onChange={(e) => setConfig({...config, serviceId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="service_xxxxxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template ID
                  </label>
                  <input
                    type="text"
                    value={config.templateId}
                    onChange={(e) => setConfig({...config, templateId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="template_xxxxxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID (Public Key)
                  </label>
                  <input
                    type="text"
                    value={config.userId}
                    onChange={(e) => setConfig({...config, userId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user_xxxxxxxxxxxxxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ваша Email для получения логов
                  </label>
                  <input
                    type="email"
                    value={config.targetEmail}
                    onChange={(e) => setConfig({...config, targetEmail: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your-email@gmail.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={testEmailSending}
                  disabled={testStatus === 'loading' || !isEmailJSLoaded}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                    testStatus === 'loading' 
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {testStatus === 'loading' ? '📤 Отправляем...' : '🧪 Отправить тестовое письмо'}
                </button>
              </div>

              {statusMessage && (
                <div className={`mt-4 p-4 rounded-lg ${
                  testStatus === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : testStatus === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-800'  
                    : 'bg-blue-50 border border-blue-200 text-blue-800'
                }`}>
                  {statusMessage}
                </div>
              )}

              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📊 Status</h4>
                <p className="text-sm text-gray-600">
                  EmailJS SDK: {isEmailJSLoaded ? '✅ Loaded' : '⏳ Loading...'}
                </p>
                <p className="text-sm text-gray-600">
                  Configuration: {config.serviceId !== 'service_test123' ? '✅ Custom' : '⚠️ Default'}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">📋 Setup Instructions</h3>
              
              <div className="space-y-4">
                {setupInstructions.map((instruction) => (
                  <div key={instruction.step} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {instruction.step}
                      </div>
                      <h4 className="font-medium text-gray-900">{instruction.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-11">{instruction.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Quick Template</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  Используйте этот шаблон для EmailJS:
                </p>
                <div className="bg-yellow-100 p-3 rounded text-xs font-mono text-yellow-800">
                  Subject: {`{{subject}}`}<br/>
                  To: {`{{to_email}}`}<br/>
                  Message: {`{{message}}`}
                </div>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">✅ После настройки</h4>
                <p className="text-sm text-green-700">
                  Логи будут автоматически отправляться:
                </p>
                <ul className="text-sm text-green-700 mt-1 ml-4 list-disc">
                  <li>Ошибки - немедленно</li>
                  <li>Обычные логи - каждые 30 секунд</li>
                  <li>При закрытии приложения</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailJSSetup;