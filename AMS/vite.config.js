import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    include: ['flowbite']
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: mode === 'production' 
          ? process.env.VITE_API_URL 
          : 'http://localhost:7243',
        changeOrigin: true,
        secure: mode === 'production',
      },
      '/attendanceHub': {
        target: mode === 'production' 
          ? process.env.VITE_SIGNALR_URL 
          : 'http://localhost:7243',
        changeOrigin: true,
        secure: mode === 'production',
        ws: true // Enable WebSocket proxy
      }
    }
  },
  define: {
    'process.env': {}
  },
  build: {
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['flowbite', '@microsoft/signalr']
        }
      }
    }
  }
}))