import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    cors: true, // Enable CORS for all origins
  },
  plugins: [react()],
})
