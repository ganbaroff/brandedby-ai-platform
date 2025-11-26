## BrandedBY - AI Celebrity Video Generator

This app was created using https://getmocha.com.
Need help or want to join the community? Join our [Discord](https://discord.gg/shDEGBSe2d).

### 🚀 Быстрый старт

To run the devserver:

```bash
npm install
npm run dev
```

### 🌐 Развертывание (Cloudflare Pages или быстрый вариант — Vercel)

**Cloudflare Pages (текущий быстрый путь, 5 минут)**

Полные инструкции в файле: [`DEPLOY_INSTRUCTIONS_RU.md`](./DEPLOY_INSTRUCTIONS_RU.md)

Коротко:

1. Создайте аккаунт: https://dash.cloudflare.com/sign-up
2. Получите API токен: https://dash.cloudflare.com/profile/api-tokens
3. Добавьте secrets в GitHub (Settings → Secrets and variables)
4. Создайте проект в Cloudflare Pages
5. Ваш сайт будет доступен: **https://brandedby.pages.dev** ✅

**Быстрый альтернативный вариант: Vercel (рекомендую если нужны минимальные настройки)**

- Vercel подключается к GitHub, автоматически строит проект и создаёт preview для PR — не требует ручной настройки Cloudflare токенов или Account ID.
- Подробная инструкция: [`VERCEL_SETUP.md`](./VERCEL_SETUP.md)

### 📊 Текущий статус

- ✅ **Production Ready** - Все тесты проходят (19/19)
- ✅ **Optimized Build** - 331.97 kB (101.13 kB gzipped)
- ✅ **Mobile Responsive** - xs/sm/md/lg/xl breakpoints
- ✅ **Analytics Tracking** - User engagement metrics
- ✅ **Error Handling** - Comprehensive error boundaries
- ✅ **CI/CD Ready** - GitHub Actions workflow configured
