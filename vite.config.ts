import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react({
      // Use the new JSX runtime
      jsxImportSource: "react",
      // Enable Babel optimizations only in production (disabled when plugin not present)
      babel: isProduction ? {} : {},
    }),

    // Generate chunk analysis report (production only)
    ...(isProduction
      ? [
          visualizer({
            filename: "./dist/bundle-stats.html",
            open: process.env.NODE_ENV !== "CI",
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),

    // Optimize images (production only)
    ...(isProduction
      ? [
          ViteImageOptimizer({
            png: {
              quality: 80,
            },
            jpeg: {
              quality: 80,
            },
            jpg: {
              quality: 80,
            },
            webp: {
              lossless: true,
            },
          }),
        ]
      : []),

    // Enable compression (production only)
    ...(isProduction
      ? [
          compression({
            algorithms: ["gzip"],
            exclude: [/\.(br|gz)$/i],
            deleteOriginalAssets: false,
          }),
        ]
      : []),

    // Temporarily disable PWA plugin to fix dev server
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: 'BrandedBy AI Platform',
    //     short_name: 'BrandedBy',
    //     description: 'AI-powered celebrity video generation platform',
    //     theme_color: '#2563eb',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     orientation: 'portrait',
    //     scope: '/',
    //     start_url: '/',
    //     icons: [
    //       {
    //         src: 'icons/icon-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'icons/icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/api\.brandedby\.*/,
    //         handler: "NetworkFirst",
    //         options: {
    //           cacheName: "api-cache",
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
    //           },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
  server: {
    host: true, // Allow external connections
    // Disable proxy in development to avoid connection errors
    // Frontend will use fallback local data from celebrities.json
    proxy: isProduction ? {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false,
      },
    } : undefined,
    // Enable HMR with faster refresh
    hmr: {
      overlay: true,
    },
    // Enable pre-bundling of dependencies
    preTransformRequests: true,
  },

  // Improve build performance
  worker: {
    format: "es",
    plugins: () => [
      // Add any worker-specific plugins here
    ],
  },

  // Cache optimization
  cacheDir: ".vite/cache",
  build: {
    // Simplified build to fix circular imports
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    cssCodeSplit: true,

    // Target modern browsers
    target: "es2020",
  },
  // Resolve configuration
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "tslib",
        replacement: path.resolve(__dirname, "node_modules/tslib/tslib.js"),
      },
      // Add any other aliases here
    ],
    // File extensions to try when resolving imports
    extensions: [
      ".mjs",
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
      ".css",
      ".scss",
    ],
    // Use browser field in package.json
    mainFields: ["browser", "module", "main"],
  },

  // Dependency optimization
  optimizeDeps: {
    // Include dependencies that should be pre-bundled
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "tslib",
    ],

    // Exclude dependencies that should not be pre-bundled
    exclude: [],

    // Enable dependency pre-bundling
    force: true,

    // Enable esbuild optimizations
    esbuildOptions: {
      target: "es2020",
      // Other esbuild options
    },
  },

  // ESBuild configuration
  esbuild: {
    target: "es2020",
    // Enable tree shaking
    treeShaking: true,
    // JSX factory
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    // Sourcemap configuration
    sourcemap: !isProduction,
    // Other esbuild options
  },

  // Log level
  logLevel: isProduction ? "error" : "info",

  // Clear screen on build
  clearScreen: true,
});
