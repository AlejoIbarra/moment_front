export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  function applyScopeLocale(path: string) {
    if (typeof window === 'undefined') return

    const i18n = nuxtApp.$i18n
    if (!i18n) return

    const currentLoc = typeof i18n.locale === 'object' ? i18n.locale.value : i18n.locale

    if (path === '/') {
      // 1. Landing Page Scope
      const landingLocale = localStorage.getItem('moment_landing_locale') || 'es'
      if (currentLoc !== landingLocale) {
        if (typeof i18n.setLocale === 'function') {
          i18n.setLocale(landingLocale)
        } else if (typeof i18n.locale === 'object') {
          i18n.locale.value = landingLocale
        }
      }
      if (document.documentElement) {
        document.documentElement.lang = landingLocale
      }
    } else {
      // 2. Platform / App Scope (Dashboard, Feed, Marketplace, Cart, etc.)
      // Configured via /dashboard/photographer/settings
      const platformLocale = localStorage.getItem('moment_platform_locale') || localStorage.getItem('moment_selected_locale') || 'es'
      if (currentLoc !== platformLocale) {
        if (typeof i18n.setLocale === 'function') {
          i18n.setLocale(platformLocale)
        } else if (typeof i18n.locale === 'object') {
          i18n.locale.value = platformLocale
        }
      }
      if (document.documentElement) {
        document.documentElement.lang = platformLocale
      }
    }
  }

  // Initial execution once client mounts
  if (process.client) {
    applyScopeLocale(router.currentRoute.value.path)

    router.afterEach((to) => {
      applyScopeLocale(to.path)
    })
  }
})
