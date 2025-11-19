# 🚀 DEPLOYMENT & COMMANDS GUIDE

## Quick Commands Reference

### Development

```powershell
# Start dev server
npm run dev

# Type checking
npm run lint

# Run tests
npm run test

# View test UI
npm run test:ui

# Generate coverage
npm run test:coverage

# Build for production
npm run build

# Check deployment (dry-run)
npm run check
```

### Database Management

```powershell
# Generate Cloudflare types
npm run cf-typegen

# List all migrations
wrangler d1 migrations list

# Apply pending migrations
wrangler d1 migrations apply

# Query database directly
wrangler d1 query "SELECT * FROM users LIMIT 5;"

# Backup database
wrangler d1 backup create

# Create new migration
wrangler d1 migrations create add_feature_name
```

### Deployment

```powershell
# Dry-run deployment (test everything)
npm run check

# Deploy to Cloudflare
wrangler deploy

# Deploy with specific environment
wrangler deploy --env production

# Deploy only migrations
wrangler d1 migrations apply --remote

# View deployment logs
wrangler tail
```

---

## 🔧 Environment Setup

### 1. Create .env.local file

```bash
cp .env.example .env.local
```

### 2. Fill in required variables

```env
# REQUIRED - Get from Sentry dashboard
VITE_SENTRY_DSN=https://your-key@sentry.io/your-project

# REQUIRED - Get from Stripe dashboard
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key

# OPTIONAL - Already configured in service
# OAuth is handled by Mocha Users Service
```

### 3. Test configuration

```powershell
# Verify environment is loaded
npm run dev

# Check browser console for "Sentry initialized"
```

---

## 🧪 Testing Workflow

### Run all tests

```powershell
npm run test
```

### Run tests in watch mode

```powershell
npm run test -- --watch
```

### Run specific test file

```powershell
npm run test -- useFileUpload.test.ts
```

### Generate coverage report

```powershell
npm run test:coverage
```

### View coverage in browser

```powershell
npm run test:coverage
# Open coverage/index.html
```

---

## 🚀 Pre-Deployment Checklist

### 1. Security Verification

```powershell
# Check security headers are applied
curl -I https://your-domain.com

# Should include:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
# Strict-Transport-Security: max-age=31536000
```

### 2. Database Verification

```powershell
# Verify all indexes are created
wrangler d1 query "
  SELECT name FROM sqlite_master
  WHERE type='index'
  ORDER BY name;
"

# Should show indexes created in migration 3:
# idx_users_email
# idx_users_google_sub
# idx_projects_user_id
# etc.
```

### 3. Error Tracking Verification

```powershell
# Check Sentry connection
# Open browser console and run:
# window.Sentry.captureMessage('Test from console')

# Go to Sentry dashboard → Issues → Verify test event appears
```

### 4. Rate Limiting Verification

```powershell
# Test rate limiting (will get 429 after 100 requests)
for ($i = 1; $i -le 150; $i++) {
  $response = Invoke-WebRequest -Uri "https://api.brandedby.com/api/health" -ErrorAction SilentlyContinue
  if ($response.StatusCode -eq 429) {
    Write-Host "Rate limiting engaged at request $i"
    break
  }
  Write-Host "Request $i: $($response.StatusCode)"
}
```

### 5. Database Performance Verification

```powershell
# Before indexes (simulated):
# Query time: 250ms

# After indexes:
wrangler d1 query "
  SELECT COUNT(*) FROM users WHERE email LIKE '%.com';
"

# Should be <5ms
```

---

## 📊 Monitoring Commands

### View Sentry Issues

```
1. Go to https://sentry.io/dashboard/
2. Select project "BrandedBy"
3. Look for recent errors
4. Click on error to see full context
```

### View Cloudflare Workers Logs

```powershell
# Stream logs in real-time
wrangler tail

# Filter by endpoint
wrangler tail --format pretty --status 500
```

### View Database Queries

```powershell
# Query slow operations
wrangler d1 query "
  SELECT * FROM sqlite_master
  WHERE type='table'
  ORDER BY name;
"
```

---

## 🔐 Security Best Practices

### Rate Limiting Limits

```
Standard endpoints:     100 requests/minute
Auth endpoints:         20 requests/minute
Payment endpoints:      20 requests/minute
Stripe webhooks:        Unlimited (IP whitelisted)
```

### CSP Policy

```
- Blocks inline scripts (except for necessary ones)
- Only allows scripts from approved sources
- Blocks form submissions to unauthorized domains
- Allows iframes only from Stripe and your domain
```

### CORS Whitelist

```
- http://localhost:5173 (dev)
- http://localhost:3000 (dev)
- https://brandedby.com (production)
- https://www.brandedby.com (production)
- https://*.brandedby.workers.dev (Cloudflare)
```

---

## 🆘 Troubleshooting

### Tests failing?

```powershell
# Clear cache and reinstall
Remove-Item -Recurse node_modules
npm install
npm run test
```

### Sentry not capturing errors?

```javascript
// In browser console:
console.log(window.Sentry); // Should show Sentry object
Sentry.captureMessage("Test", "info"); // Should appear in dashboard
```

### Rate limiting too strict?

Edit `src/worker/index.ts`, line ~45-50:

```typescript
const limit = isPrivate ? 20 : 100; // Change these numbers
const window = isPrivate ? 60000 : 60000; // Adjust time window (ms)
```

### Database migration not applying?

```powershell
# Check migration status
wrangler d1 migrations list

# Force apply a specific migration
wrangler d1 migrations apply --step 3

# Rollback (if you have down.sql)
wrangler d1 migrations rollback
```

---

## 📈 Performance Monitoring

### Key Metrics to Track

```javascript
// In Sentry:
1. Error Rate - Target: <0.1%
2. P95 Response Time - Target: <500ms
3. Session Duration - Target: >3 min
4. User Retention - Target: >30%
5. Payment Success Rate - Target: >98%
```

### Custom Metrics (Example)

```typescript
// In src/react-app/sentry.config.ts
captureVideoGenerationMetrics(
  projectId: '123',
  celebrity: 'Brad Pitt',
  duration: 2500,  // 2.5 seconds
  success: true
);
```

---

## 🚀 Continuous Deployment

### GitHub Actions Setup (Optional)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test
      - run: npm run lint
      - run: npm run build
      - run: npm run check
      - run: wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 📞 Getting Help

### Resources

- Sentry Docs: https://docs.sentry.io/
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Vitest Docs: https://vitest.dev/
- Stripe API: https://stripe.com/docs/api

### Common Issues Channels

- GitHub Issues: https://github.com/yourusername/brandedby-ai-platform
- Sentry Support: https://sentry.zendesk.com/
- Cloudflare Support: https://support.cloudflare.com/

---

_Last updated: November 19, 2025_  
_Deployment ready: ✅_  
_All systems operational: ✅_
