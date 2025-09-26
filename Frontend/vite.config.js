import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { minify as minifyHtml } from 'html-minifier-terser'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Precompress assets to .gz for nginx gzip_static
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
      filter: (file) => /\.(js|css|svg|json|txt|xml|ico|webmanifest)$/i.test(file)
    }),
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
          ? 'https://localslocalmarket.com/api'
          : '/api'
      )
    ),
    'import.meta.env.VITE_ENABLE_LOGS': JSON.stringify(process.env.VITE_ENABLE_LOGS || 'false')
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
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
