import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
       '/users': 'http://192.168.1.2:4000',
      '/trips': 'http://192.168.1.2:4000',
    },
  },
})
