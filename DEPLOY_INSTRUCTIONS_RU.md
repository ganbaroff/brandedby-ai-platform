# 🚀 ИНСТРУКЦИИ ПО РАЗВЕРТЫВАНИЮ (5 МИНУТ)

## Развертывание на Cloudflare Pages (БЕСПЛАТНО)

### ✅ Шаг 1: Создайте аккаунт Cloudflare
https://dash.cloudflare.com/sign-up

### ✅ Шаг 2: Получите API токен
1. https://dash.cloudflare.com/profile/api-tokens
2. "Create Token" → "Edit Cloudflare Workers" → Создать
3. Скопируйте токен

### ✅ Шаг 3: Получите Account ID
https://dash.cloudflare.com/ (справа внизу - Account ID)

### ✅ Шаг 4: Добавьте Secrets в GitHub
1. https://github.com/ganbaroff/brandedby-ai-platform
2. Settings → Secrets and variables → Actions
3. New secret:
   - `CLOUDFLARE_API_TOKEN` = (токен из шага 2)
   - `CLOUDFLARE_ACCOUNT_ID` = (ID из шага 3)

### ✅ Шаг 5: Создайте проект в Cloudflare Pages
1. https://dash.cloudflare.com/
2. Pages → Create a project → Connect to Git
3. Выберите: `brandedby-ai-platform`
4. Framework: **None**
5. Build command: `npm run build`
6. Output directory: `dist/client`
7. Deploy!

## 🎉 РЕЗУЛЬТАТ

✅ Сайт доступен по адресу: **https://brandedby.pages.dev**
✅ Автоматическое обновление при каждом push в main
✅ Бесплатный SSL сертификат
✅ CDN по всему миру

## 📝 Уже готово!

- ✅ GitHub Actions workflow добавлен (.github/workflows/deploy.yml)
- ✅ Вся документация в этом файле

Просто следуйте 5 шагам выше!
