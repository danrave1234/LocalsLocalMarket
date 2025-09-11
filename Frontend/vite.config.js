import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { minify as minifyHtml } from 'html-minifier-terser'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-minify',
      apply: 'build',
      transformIndexHtml: async (html) => {
        return await minifyHtml(html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
          keepClosingSlash: true,
        })
      },
    },
  ],
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
    minify: 'terser',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
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
