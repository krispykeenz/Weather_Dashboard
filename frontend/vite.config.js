import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => {
  const isDemoMode = process.env.VITE_DEMO_MODE === 'true'

  return {
    // GitHub Pages serves from a repo subpath; use relative asset paths for demo builds.
    base: isDemoMode ? './' : '/',
    plugins: [vue()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  }
})
