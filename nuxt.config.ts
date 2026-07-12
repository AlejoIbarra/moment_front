export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Moments - Galería Digital y Marketplace de Fotografía de Eventos',
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#6366f1' }
      ]
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' }
    ],
    defaultLocale: 'es',
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default'
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8080/api'
        : (process.env.NUXT_PUBLIC_API_BASE || 'https://moment-back.onrender.com/api')
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
