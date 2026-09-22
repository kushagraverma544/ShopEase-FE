/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (command === 'build' && mode === 'production' && !env.VITE_API_BASE_URL) {
    // Fail the build loudly instead of shipping a client that silently
    // 404s every API call against its own origin (see .env.production.example).
    throw new Error('VITE_API_BASE_URL is not set. Production builds must provide the API Gateway URL.')
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/catalog': {
          target: 'http://localhost:8083',
          changeOrigin: true,
        },
        '/auth': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        '/me': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        // Scoped to the seller-application API paths only (not a blanket
        // '/seller' prefix) — that would also swallow the '/seller/*'
        // frontend routes (dashboard, listings) on a hard navigation/refresh,
        // since those share the prefix but must be served the SPA shell.
        '/seller/application-status': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        '/seller/apply': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        '/seller/profile': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        '/seller/history': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        // Scoped to /admin/sellers only (not a blanket '/admin' prefix), same
        // reasoning as the /seller/* entries above — a future /admin/* FE
        // route (e.g. a customers or analytics page) shouldn't get swallowed
        // by this proxy on a hard refresh. Target assumed to be the same
        // user-service as the other Keycloak-backed endpoints above; confirm
        // with BE if this 404s.
        '/admin/sellers': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
      },
    },
    build: {
      sourcemap: false,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
      css: true,
    },
  }
})
