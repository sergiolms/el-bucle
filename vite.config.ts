import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/el-bucle/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/@firebase/firestore') ||
            id.includes('node_modules/@firebase/webchannel-wrapper') ||
            id.includes('node_modules/firebase/firestore')
          ) {
            return 'firebase-firestore'
          }

          if (
            id.includes('node_modules/firebase/node_modules/@firebase/auth') ||
            id.includes('node_modules/firebase/auth')
          ) {
            return 'firebase-auth'
          }

          if (
            id.includes('node_modules/@firebase/analytics') ||
            id.includes('node_modules/@firebase/installations')
          ) {
            return 'firebase-analytics'
          }

          if (
            id.includes('node_modules/firebase/app') ||
            id.includes('node_modules/@firebase/app') ||
            id.includes('node_modules/@firebase/component') ||
            id.includes('node_modules/@firebase/logger') ||
            id.includes('node_modules/@firebase/util')
          ) {
            return 'firebase-core'
          }

          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react')) {
            return 'ui-vendor'
          }

          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'react-vendor'
          }
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'El Bucle - Ficha de Personaje',
        short_name: 'El Bucle',
        description: 'Aplicación para gestionar fichas de personaje del librojuego El Bucle',
        theme_color: '#ff00ff',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/el-bucle/',
        start_url: '/el-bucle/',
        icons: [
          {
            src: '/el-bucle/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/el-bucle/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Personaje',
            short_name: 'Personaje',
            description: 'Ver atributos y estado del personaje',
            url: '/el-bucle/?tab=character',
            icons: [{ src: '/el-bucle/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Equipo',
            short_name: 'Equipo',
            description: 'Gestionar inventario y pistas',
            url: '/el-bucle/?tab=equipment',
            icons: [{ src: '/el-bucle/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Combate',
            short_name: 'Combate',
            description: 'Sistema de combate',
            url: '/el-bucle/?tab=combat',
            icons: [{ src: '/el-bucle/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Notas',
            short_name: 'Notas',
            description: 'Sistema de investigación y notas',
            url: '/el-bucle/?tab=notes',
            icons: [{ src: '/el-bucle/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Historial',
            short_name: 'Historial',
            description: 'Consultar checkpoints y progreso temporal',
            url: '/el-bucle/?tab=history',
            icons: [{ src: '/el-bucle/icon-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
