import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-service-worker',
      closeBundle() {
        try {
          const src = resolve(__dirname, 'public/service-worker.js')
          const dest = resolve(__dirname, 'dist/service-worker.js')
          
          if (!existsSync(src)) {
            console.log('⚠️ Service Worker not found, skipping copy')
            return
          }
          
          const destDir = dirname(dest)
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true })
          }
          
          copyFileSync(src, dest)
          console.log('✅ Service Worker copied to dist')
        } catch (err) {
          console.warn('⚠️ Failed to copy Service Worker:', err.message)
        }
      }
    }
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
