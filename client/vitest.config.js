import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// Separate from vite.config.js on purpose: tests don't need Tailwind or the
// react-compiler Babel preset, and keeping this lean avoids transform issues.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    // The default forks pool times out starting workers on this Windows
    // setup; threads is reliable here.
    pool: 'threads',
    setupFiles: ['./src/test/setup.js'],
    css: false,
    // Match the app's reduced-motion guard: canvas-confetti already checks
    // prefers-reduced-motion itself, so no special handling needed here.
  },
})
