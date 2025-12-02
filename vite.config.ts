import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [...mochaPlugins(process.env as any), react(), cloudflare()],
  server: {
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          ui: ['lucide-react'],
          admin: ['src/react-app/pages/AdminPanel.tsx', 'src/react-app/components/RichTextEditor.tsx'],
          analytics: ['src/react-app/components/AnalyticsDashboard.tsx', 'src/react-app/components/BulkOperations.tsx']
        }
      }
    },
    target: 'es2020',
    minify: 'terser',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'lucide-react'],
    exclude: []
  },
  esbuild: {
    target: 'es2020'
  }
});
