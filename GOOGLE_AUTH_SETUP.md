# 🔐 Настройка Google OAuth авторизации - BrandedBy

## 📋 **ПОШАГОВАЯ ИНСТРУКЦИЯ:**

### 1️⃣ **Создание проекта в Google Cloud Console**

1. **Перейдите на https://console.cloud.google.com**
2. **Создайте новый проект:**
   - Нажмите "Select a project" → "New Project"
   - Название: `BrandedBy AI Platform`
   - Organization: ваша организация (необязательно)
   - Нажмите "CREATE"

### 2️⃣ **Настройка OAuth Consent Screen**

1. **Перейдите в APIs & Services → OAuth consent screen**
2. **Выберите User Type:**
   - **External** (для продакшена)
   - **Internal** (только для Google Workspace)
3. **Заполните обязательные поля:**
   ```
   App name: BrandedBy AI Platform
   User support email: ваш email
   Application home page: https://yourapp.com
   Application privacy policy: https://yourapp.com/privacy
   Application terms of service: https://yourapp.com/terms
   Developer contact email: ваш email
   ```

### 3️⃣ **Создание OAuth 2.0 Client ID**

1. **Перейдите в APIs & Services → Credentials**
2. **Нажмите "+ CREATE CREDENTIALS" → OAuth client ID**
3. **Application type:** Web application
4. **Name:** BrandedBy Web Client
5. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://yourdomain.com
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:5173/auth/callback
   https://yourdomain.com/auth/callback
   ```

### 4️⃣ **Получение Client ID и Client Secret**

После создания вы получите:

```
Client ID: 123456789-abcdefg.googleusercontent.com
Client Secret: GOCSPX-1234567890abcdefghijklmnop
```

## 🔧 **ИНТЕГРАЦИЯ В КОД:**

### **Установка библиотек:**

```bash
npm install @google-cloud/oauth2 google-auth-library
# или
npm install react-google-login
```

### **Environment Variables (.env):**

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=123456789-abcdefg.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-1234567890abcdefghijklmnop

# Redirect URLs
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
```

### **React компонент Google Login:**

```tsx
// src/components/GoogleAuth.tsx
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export default function GoogleAuth() {
  const handleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode(credentialResponse.credential) as GoogleUser;

      // Отправить данные на ваш backend
      fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleToken: credentialResponse.credential,
          user: decoded,
        }),
      });
    }
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
      />
    </GoogleOAuthProvider>
  );
}
```

### **Интеграция в Header.tsx:**

```tsx
// В Header.tsx замените существующую auth логику:
import GoogleAuth from './GoogleAuth';

// В JSX замените кнопку "Sign In":
{user ? (
  // ... существующий код для авторизованного пользователя
) : (
  <GoogleAuth />
)}
```

## 🛡️ **BACKEND ОБРАБОТКА (Node.js/Express):**

### **Установка зависимостей:**

```bash
npm install google-auth-library jsonwebtoken
```

### **API Route для Google Auth:**

```typescript
// routes/auth.ts
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleAuth(req, res) {
  try {
    const { googleToken } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Find or create user in your database
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        provider: "google",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
}
```

## 📱 **МОБИЛЬНАЯ АДАПТАЦИЯ Google Login:**

```tsx
// Адаптивная Google кнопка
<GoogleLogin
  onSuccess={handleSuccess}
  onError={handleError}
  theme="outline"
  size={window.innerWidth < 640 ? "medium" : "large"}
  text={window.innerWidth < 640 ? "signin" : "signin_with"}
  width={window.innerWidth < 640 ? "100%" : "auto"}
/>
```

## 🔒 **БЕЗОПАСНОСТЬ:**

### **Обязательные проверки:**

- ✅ Проверка токена на backend
- ✅ Валидация audience (Client ID)
- ✅ Проверка истечения токена
- ✅ Rate limiting для auth endpoints
- ✅ HTTPS в продакшене

### **Environment Security:**

```env
# Никогда не коммитьте в git!
GOOGLE_CLIENT_SECRET=секретный_ключ
JWT_SECRET=очень_длинный_случайный_ключ
```

## 🧪 **ТЕСТИРОВАНИЕ:**

### **Локальное тестирование:**

1. Добавьте `http://localhost:5173` в Authorized origins
2. Используйте тестовый Google аккаунт
3. Проверьте Network tab в DevTools

### **Production checklist:**

- [ ] Обновить Authorized origins с реальным доменом
- [ ] Настроить HTTPS certificates
- [ ] Добавить error handling
- [ ] Настроить monitoring

---

## 🎯 **ИТОГОВАЯ ИНТЕГРАЦИЯ:**

После настройки пользователи смогут:

- ✅ Входить через Google одним кликом
- ✅ Автоматическая регистрация при первом входе
- ✅ Безопасное хранение данных
- ✅ Адаптивный интерфейс на всех устройствах

**Примерное время настройки: 2-3 часа**

---

_Руководство создано: November 14, 2025_  
_Статус: Готово к реализации_
