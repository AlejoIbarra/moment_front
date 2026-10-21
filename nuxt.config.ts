export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
      title: 'Moments | Moments App - Vender Fotos y Galería de Eventos con IA',
      meta: [
        { name: 'application-name', content: 'Moments' },
        { name: 'apple-mobile-web-app-title', content: 'Moments' },
        { name: 'description', content: 'Moments (Moments App) es la plataforma #1 para vender fotos y encontrar fotos de eventos en Latinoamérica. Vende fotos cobrando en tu moneda local con Mercado Pago y busca con reconocimiento facial por IA.' },
        { name: 'keywords', content: 'moments, moments app, moments fotos, vender fotos, vender fotos por internet, app de fotos, moments fotografia, moments gallery, donde vender fotos, comprar fotos eventos, fotografia eventos latinoamerica, reconocimiento facial fotos' },
        { name: 'author', content: 'Moments App' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'bingbot', content: 'index, follow' },
        { name: 'theme-color', content: '#07b667' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Moments' },
        { property: 'og:title', content: 'Moments | Moments App - Vender Fotos y Galería de Eventos con IA' },
        { property: 'og:description', content: 'Moments (Moments App): Vende fotos de eventos cobrando en moneda local y encuentra tus fotos al instante con reconocimiento facial por IA.' },
        { property: 'og:url', content: 'https://www.moments-gallery.com' },
        { property: 'og:image', content: 'https://www.moments-gallery.com/logo.png' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Moments | Moments App - Vender Fotos y Galería de Eventos con IA' },
        { name: 'twitter:description', content: 'Moments (Moments App): Vende fotos de eventos y encuentra recuerdos con reconocimiento facial por IA.' },
        { name: 'twitter:image', content: 'https://www.moments-gallery.com/logo.png' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.moments-gallery.com' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://pub-e35f618293704902a76169f02348a80e.r2.dev', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://pub-e35f618293704902a76169f02348a80e.r2.dev' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ],
      script: [
        { src: 'https://checkout.wompi.co/widget.js', async: true }
      ]
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/terms-user': { prerender: true },
    '/terms-photographer': { prerender: true },
    '/refunds': { prerender: true }
  },
  nitro: {
    compressPublicAssets: true
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],
  icon: {
    mode: 'svg',
    serverBundle: {
      collections: ['lucide', 'logos']
    },
    clientBundle: {
      scan: true,
      sizeLimitKb: 512
    },
    provider: 'server'
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' }
    ],
    defaultLocale: 'es',
    lazy: false,
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'es'
    }
  },
  css: [
    'vue-sonner/style.css',
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8080/api'
        : (process.env.NUXT_PUBLIC_API_BASE || 'https://moment-back.onrender.com/api'),
      apiUrl: process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : (process.env.NUXT_PUBLIC_API_URL || (process.env.NUXT_PUBLIC_API_BASE ? process.env.NUXT_PUBLIC_API_BASE.replace(/\/api\/?$/, '') : 'https://moment-back.onrender.com')),
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '394351432713-v07qogji3mrdvpj92359bquvdul7b1dv.apps.googleusercontent.com',
      instagramClientId: process.env.NUXT_PUBLIC_INSTAGRAM_CLIENT_ID || '2033785114674707'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
