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
        { name: 'description', content: 'Descubre, compra y descarga las mejores fotografías profesionales de tus eventos y momentos más memorables de forma rápida y segura en Moments.' },
        { name: 'keywords', content: 'moments, fotos de eventos, comprar fotos, galeria de fotos, fotografo profesional, recuerdos digitales, marketplace de fotografia' },
        { name: 'author', content: 'Moments' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'theme-color', content: '#6366f1' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Moments - Galería Digital y Marketplace de Fotografía de Eventos' },
        { property: 'og:description', content: 'Descubre, compra y descarga las mejores fotografías profesionales de tus eventos y momentos más memorables de forma rápida y segura en Moments.' },
        { property: 'og:url', content: 'https://www.moments-gallery.com' },
        { property: 'og:image', content: 'https://www.moments-gallery.com/og-image.png' },
        { property: 'og:site_name', content: 'Moments' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Moments - Galería Digital y Marketplace de Fotografía de Eventos' },
        { name: 'twitter:description', content: 'Descubre, compra y descarga las mejores fotografías profesionales de tus eventos y momentos más memorables de forma rápida y segura en Moments.' },
        { name: 'twitter:image', content: 'https://www.moments-gallery.com/og-image.png' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.moments-gallery.com' },
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
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
