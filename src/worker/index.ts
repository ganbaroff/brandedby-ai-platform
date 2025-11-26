import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./api/auth";
import { blogPosts } from "./api/blog-posts";
import { celebrities } from "./api/celebrities";
import { files } from "./api/files";
import { payments } from "./api/payments";
import { projects } from "./api/projects";
import { stripe } from "./api/stripe";
import { templates } from "./api/templates";

type AppContext = {
  Bindings: Env;
  Variables: {
    clientIp: string;
  };
};

const app = new Hono<AppContext>();

// ==================== RATE LIMITING ====================
// In-memory store for rate limiting (reset every hour)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

function checkRateLimit(ip: string, endpoint: string, limit: number = 100, windowMs: number = 60000): boolean {
  const key = getRateLimitKey(ip, endpoint);
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

// ==================== SECURITY HEADERS MIDDLEWARE ====================
app.use("*", async (c, next) => {
  // Get client IP for rate limiting
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  
  // Store IP for later use
  c.set('clientIp', ip);

  // Rate limiting for API endpoints
  if (c.req.path.startsWith('/api/')) {
    // Stricter limits for sensitive endpoints
    const sensitiveEndpoints = ['/api/payments', '/api/stripe', '/api/oauth/sessions'];
    const isPrivate = sensitiveEndpoints.some(ep => c.req.path.includes(ep));
    const limit = isPrivate ? 20 : 100;
    const window = isPrivate ? 60000 : 60000; // 1 minute

    if (!checkRateLimit(ip, c.req.path, limit, window)) {
      return c.json({ error: 'Too many requests' }, 429);
    }
  }

  // Security Headers
  const headers = new Headers();
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://checkout.stripe.com https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.stripe.com https://checkout.stripe.com wss://*; " +
    "frame-src 'self' https://checkout.stripe.com; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self' https://checkout.stripe.com;"
  );
  
  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Feature Policy / Permissions Policy
  headers.set('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  // Strict Transport Security (HSTS)
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Remove server info
  headers.set('Server', 'Cloudflare');

  // Apply headers to response
  await next();
  
  headers.forEach((value, key) => {
    c.header(key, value);
  });
});

// ==================== CORS Configuration ====================
app.use("*", cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://brandedby.com',
    'https://www.brandedby.com',
    'https://*.brandedby.workers.dev'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  maxAge: 86400,
  credentials: true
}));

// API routes
app.route('/api/oauth', auth);
app.route('/api/users', auth);
app.route('/api/payments', payments);
app.route('/api/projects', projects);
app.route('/api/files', files);
app.route('/api/stripe', stripe);

// API Routes

app.route('/api/celebrities', celebrities);
app.route('/api/templates', templates);
app.route('/api/blog-posts', blogPosts);

// Health check endpoint
app.get("/api/health", (c) => {
  return c.json({
    success: true,
    message: "BrandedBY API is running",
    timestamp: new Date().toISOString()
  });
});

// Fallback for SPA routing - serve the index.html for non-API routes
app.get("*", async () => {
  // In production, this would serve the built React app
  // For development, Vite handles this
  return new Response("SPA Route - handled by Vite in development", {
    status: 200,
    headers: { "Content-Type": "text/html" }
  });
});

export default app;
