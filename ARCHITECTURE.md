# 🏗️ BrandedBy Architecture & Structure

## 📐 **SYSTEM ARCHITECTURE:**

```
┌─────────────────────────────────────────────────────────────────┐
│                      BRANDEDBY PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React 19)                    │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Home Page          • Celebrity Gallery                 │  │
│  │ • Blog Section       • Payment Flow                      │  │
│  │ • Dashboard          • Admin Panel                       │  │
│  │ • Selfie Upload      • User Settings                     │  │
│  │ • Performance 80% Optimized                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓              ↓              ↓             ↓          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        MIDDLEWARE & SERVICES (Custom Hooks)              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • useAuth (mocha)  • useSEO         • useFileUpload     │  │
│  │ • useStripe        • useServiceWorker • usePerformance  │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓              ↓              ↓             ↓          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          API LAYER (Cloudflare Worker + Hono)            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ GET   /api/celebrities                                  │  │
│  │ POST  /api/auth/login                                   │  │
│  │ POST  /api/payments/process                             │  │
│  │ POST  /api/upload                                       │  │
│  │ GET   /api/projects/:id                                 │  │
│  │ POST  /api/google-auth (🔜)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓              ↓              ↓             ↓          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           DATABASE LAYER (SQLite)                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • users          • projects      • payments              │  │
│  │ • celebrities    • blog_posts    • sessions              │  │
│  │ • uploads        • analytics     • transactions          │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓                          ↓                           │
│  ┌──────────────────┐  ┌──────────────────────────────────┐   │
│  │  EXTERNAL APIs   │  │  STORAGE & SERVICES              │   │
│  ├──────────────────┤  ├──────────────────────────────────┤   │
│  │ • Stripe         │  │ • Cloudflare R2 (Images)         │   │
│  │ • EmailJS        │  │ • Cloudflare KV (Cache)          │   │
│  │ • Google OAuth   │  │ • Service Worker (Offline)       │   │
│  │ • Mocha Auth     │  │ • IndexedDB (Local)              │   │
│  └──────────────────┘  └──────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 **PROJECT STRUCTURE:**

```
BrandedBy/
├── 📦 package.json
├── ⚙️ vite.config.ts
├── 🔧 tailwind.config.js
├── 📝 wrangler.json
├── 🛡️ tsconfig.json
│
├── src/
│   ├── react-app/
│   │   ├── App.tsx (Main router)
│   │   ├── main.tsx (Entry point)
│   │   ├── index.css (Global styles)
│   │   │
│   │   ├── pages/ (13 page components)
│   │   │   ├── Home.tsx ⭐
│   │   │   ├── Celebrities.tsx ⭐
│   │   │   ├── CelebrityDetail.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── Payment.tsx ⭐
│   │   │   ├── SelfieUpload.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Admin.tsx
│   │   │   └── ... 5 more
│   │   │
│   │   ├── components/ (28 reusable components)
│   │   │   ├── Header.tsx ⭐
│   │   │   ├── Footer.tsx ⭐
│   │   │   ├── FaceMorphingDemo.tsx ⭐ (3D animation)
│   │   │   ├── PaymentProcessor.tsx ⭐
│   │   │   ├── ErrorBoundary.tsx ⭐
│   │   │   ├── SearchFilter.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── PerformanceWidget.tsx
│   │   │   └── ... 19 more
│   │   │
│   │   ├── hooks/ (Custom React hooks)
│   │   │   ├── useAuth.ts
│   │   │   ├── useStripePayment.ts
│   │   │   ├── useFileUpload.ts
│   │   │   ├── useSEO.ts
│   │   │   └── useServiceWorker.ts
│   │   │
│   │   ├── contexts/
│   │   │   └── UserContext.tsx
│   │   │
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── worker/
│   │   ├── index.ts (Main worker)
│   │   ├── env.d.ts
│   │   │
│   │   ├── api/
│   │   │   ├── auth.ts ⭐
│   │   │   ├── celebrities.ts
│   │   │   ├── payments.ts ⭐
│   │   │   ├── projects.ts
│   │   │   ├── files.ts
│   │   │   └── google-auth.ts 🔜
│   │   │
│   │   └── db/
│   │       └── index.ts
│   │
│   └── shared/
│       ├── types.ts
│       ├── celebrities.json (14 celebrities data)
│       ├── logger.ts
│       ├── analytics.ts
│       └── performance-optimizer.ts
│
├── migrations/ (Database migrations)
│   ├── 1.sql (Initial schema)
│   ├── 2.sql (Updates)
│   └── 3_add_indexes.sql 🔜
│
├── public/
│   ├── index.html (Main HTML)
│   ├── favicon.ico
│   ├── manifest.json (PWA)
│   ├── robots.txt 🔜
│   └── sitemap.xml 🔜
│
├── 📄 README.md
├── 📄 .env.example 🔜
└── 📄 docs/
    ├── GOOGLE_AUTH_SETUP.md ✅
    ├── QUICK_WINS.md ✅
    ├── PROJECT_AUDIT_REPORT.md ✅
    └── PROJECT_OVERVIEW.md ✅
```

---

## 🔄 **DATA FLOW DIAGRAM:**

### **1. User Login Flow:**

```
User Browser
    ↓
[Login Button] → Header.tsx
    ↓
useAuth Hook → mocha auth service
    ↓
Request → API /auth/login (Cloudflare Worker)
    ↓
Database → Check user credentials
    ↓
JWT Token ← Return to frontend
    ↓
[Set in localStorage] → AuthContext
    ↓
Navigate to Dashboard ✅
```

### **2. Payment Flow:**

```
User selects package
    ↓
[Pay Button] → Payment.tsx
    ↓
Stripe.js → Create payment intent
    ↓
Request → API /payments/create (Cloudflare Worker)
    ↓
Stripe API ← Process payment
    ↓
Webhook → Update database
    ↓
[Success notification] ✅
```

### **3. Celebrity Video Creation:**

```
User uploads selfie
    ↓
[Upload] → SelfieUpload.tsx
    ↓
useFileUpload → Validation
    ↓
Request → API /upload (Cloudflare Worker)
    ↓
Cloudflare R2 ← Store image
    ↓
Database ← Record project
    ↓
Queue video generation 🔜
    ↓
[Notification when ready] ✅
```

---

## 🔗 **EXTERNAL INTEGRATIONS:**

```
┌─────────────────────────────────────────────────────┐
│              THIRD-PARTY SERVICES                    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  📊 AUTHENTICATION                                  │
│  ├─ Mocha Users Service ✅                          │
│  └─ Google OAuth 🔜 (Doc: GOOGLE_AUTH_SETUP.md)    │
│                                                       │
│  💳 PAYMENTS                                         │
│  └─ Stripe API ✅ (Doc: PaymentProcessor.tsx)       │
│                                                       │
│  📧 COMMUNICATIONS                                   │
│  └─ EmailJS ✅ (Doc: EmailJSSetup.tsx)              │
│                                                       │
│  🌐 HOSTING & CDN                                    │
│  ├─ Cloudflare Workers ✅ (Serverless)             │
│  ├─ Cloudflare R2 ✅ (Object storage)              │
│  ├─ Cloudflare KV ✅ (Cache)                        │
│  └─ Cloudflare Pages 🔜 (Static hosting)           │
│                                                       │
│  🎨 AI/ML (Future)                                   │
│  └─ Face morphing API 🔜                             │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 📊 **DATABASE SCHEMA:**

```sql
┌──────────────────────────────────────────────────────┐
│                   USERS TABLE                        │
├──────────────────────────────────────────────────────┤
│ id (PK)                                              │
│ email (UNIQUE)                                       │
│ name                                                 │
│ picture_url                                          │
│ google_id (UNIQUE, NULLABLE) 🔜                     │
│ created_at                                           │
│ updated_at                                           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              CELEBRITIES TABLE                       │
├──────────────────────────────────────────────────────┤
│ id (PK)                                              │
│ name                                                 │
│ role                                                 │
│ image_url                                            │
│ niches (JSON)                                        │
│ rating                                               │
│ popularity                                           │
│ created_at                                           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│               PAYMENTS TABLE                         │
├──────────────────────────────────────────────────────┤
│ id (PK)                                              │
│ user_id (FK)                                         │
│ amount                                               │
│ currency                                             │
│ status (pending/completed/failed)                   │
│ stripe_payment_id                                    │
│ package_type                                         │
│ created_at                                           │
│ updated_at                                           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│               PROJECTS TABLE                         │
├──────────────────────────────────────────────────────┤
│ id (PK)                                              │
│ user_id (FK)                                         │
│ celebrity_id (FK)                                    │
│ selfie_url                                           │
│ status (processing/completed/failed)                │
│ video_url (NULLABLE)                                │
│ metadata (JSON)                                      │
│ created_at                                           │
│ updated_at                                           │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 **DEPLOYMENT ARCHITECTURE:**

```
                    ┌─────────────────┐
                    │   DNS (Vercel)  │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐      ┌────────▼──────┐
        │ Cloudflare     │      │ Cloudflare    │
        │ Pages          │      │ Workers       │
        │ (Static HTML)  │      │ (API)         │
        └────────┬───────┘      └────────┬──────┘
                 │                       │
                 └───────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │  Cloudflare     │
                    │  • R2 (Storage) │
                    │  • KV (Cache)   │
                    │  • Analytics    │
                    └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │    Database     │
                    │    (SQLite)     │
                    └─────────────────┘
```

---

## 📈 **PERFORMANCE OPTIMIZATION:**

```
✅ CODE SPLITTING
   Home.tsx (lazy load)
   Celebrities.tsx (lazy load)
   Admin.tsx (lazy load)

✅ IMAGE OPTIMIZATION
   Lazy loading via loading="lazy"
   Object-fit: cover for thumbnails
   Responsive images with CSS

✅ BUNDLE OPTIMIZATION
   Tailwind CSS tree-shaking
   Unused dependency cleanup
   Terser minification

✅ RUNTIME OPTIMIZATION
   React.memo() in components
   useCallback for handlers
   useMemo for expensive calculations
   Debounced search (300ms)

✅ CACHING STRATEGY
   Service Worker precaching
   Browser cache headers
   CDN edge caching
   IndexedDB for offline data
```

---

## 🎯 **NEXT IMPROVEMENTS:**

```
PRIORITY 1 (This week)
├─ Google OAuth implementation ⏳
├─ Security headers (10 min) ⏳
└─ Rate limiting (30 min) ⏳

PRIORITY 2 (Next week)
├─ Unit tests (Vitest) ⏳
├─ Image optimization (WebP) ⏳
└─ Database indexes ⏳

PRIORITY 3 (Month 2)
├─ Advanced analytics ⏳
├─ Content CMS ⏳
└─ Mobile app (React Native) ⏳

PRIORITY 4 (Future)
├─ AI face generation 🔮
├─ Real-time collaboration 🔮
└─ Video streaming 🔮
```

---

## 📞 **KEY CONTACTS & RESOURCES:**

- **Frontend Docs:** React 19, TypeScript, Vite
- **Backend Docs:** Hono, Cloudflare Workers
- **Database:** SQLite with better-sqlite3
- **Styling:** Tailwind CSS + custom CSS
- **Auth:** Mocha Users Service
- **Payments:** Stripe API

---

_Architecture diagram: November 19, 2025_  
_Status: MVP Architecture Complete_  
_Next: Implementation & Testing_
