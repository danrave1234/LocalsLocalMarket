import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_BASE': JSON.stringify(
      process.env.VITE_API_BASE || (
        process.env.NODE_ENV === 'production' 
          ? 'https://api.localslocalmarket.com/api'
          : 'http://localhost:8080/api'
      )
    ),
  },
  server: {
    // Proxy removed since we're using direct localhost:8080 URLs
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
