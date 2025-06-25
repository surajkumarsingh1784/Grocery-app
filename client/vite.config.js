import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    outDir: 'dist', // makes sure it outputs to dist
  },
  // 👇 Vercel needs this to support client-side routing (React Router)
  resolve: {
    alias: {},
  },
  // 👇 If SSR doesn't work, fallback to index.html for all routes
  preview: {
    port: 4173,
    strictPort: true,
  }
})

