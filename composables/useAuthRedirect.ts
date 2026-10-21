export const AUTH_REDIRECT_KEY = 'auth_intended_redirect'

export function useAuthRedirect() {
  const router = useRouter()
  const route = useRoute()

  function sanitizePath(raw: string): string | null {
    if (!raw || typeof raw !== 'string') return null
    let target = raw.trim()
    if (!target) return null

    // Decode multiple times if needed (in case of double/triple encoding)
    let passes = 3
    while (passes > 0 && /%(?:2f|3a|3f|26|23)/i.test(target)) {
      try {
        const decoded = decodeURIComponent(target)
        if (decoded === target) break
        target = decoded
        passes--
      } catch {
        break
      }
    }

    // If it's an absolute URL (e.g. from clipboard or external link)
    if (target.startsWith('http://') || target.startsWith('https://')) {
      try {
        const parsed = new URL(target)
        target = parsed.pathname + parsed.search + parsed.hash
      } catch {
        return null
      }
    }

    // Must start with '/' and must not be a protocol-relative '//'
    if (!target.startsWith('/') || target.startsWith('//')) {
      return null
    }

    // Do not redirect back to auth pages
    const lower = target.toLowerCase()
    if (lower === '/login' || lower.startsWith('/login?') ||
        lower === '/register' || lower.startsWith('/register?') ||
        lower === '/complete-profile' || lower.startsWith('/complete-profile?')) {
      return null
    }

    return target
  }

  function saveIntendedRedirect(raw?: string | null) {
    if (!process.client) return
    const path = sanitizePath(raw || '')
    if (path) {
      try {
        sessionStorage.setItem(AUTH_REDIRECT_KEY, path)
        localStorage.setItem(AUTH_REDIRECT_KEY, path)
      } catch (e) {
        console.warn('Could not save intended redirect to storage:', e)
      }
    }
  }

  function getSavedIntendedRedirect(): string | null {
    if (!process.client) return null
    try {
      const fromSession = sessionStorage.getItem(AUTH_REDIRECT_KEY)
      if (fromSession) {
        const clean = sanitizePath(fromSession)
        if (clean) return clean
      }
      const fromLocal = localStorage.getItem(AUTH_REDIRECT_KEY)
      if (fromLocal) {
        const clean = sanitizePath(fromLocal)
        if (clean) return clean
      }
    } catch (e) {
      console.warn('Could not read intended redirect from storage:', e)
    }
    return null
  }

  function clearIntendedRedirect() {
    if (!process.client) return
    try {
      sessionStorage.removeItem(AUTH_REDIRECT_KEY)
      localStorage.removeItem(AUTH_REDIRECT_KEY)
    } catch {}
  }

  function resolveAuthRedirect(explicitTarget?: any, fallback = '/marketplace'): string {
    // 1. Try explicit target (e.g. route.query.redirect)
    if (explicitTarget) {
      const candidate = Array.isArray(explicitTarget) ? explicitTarget[0] : explicitTarget
      const cleaned = sanitizePath(String(candidate))
      if (cleaned) {
        return cleaned
      }
    }

    // 2. Try current route query if not passed explicitly
    if (route?.query?.redirect) {
      const candidate = Array.isArray(route.query.redirect) ? route.query.redirect[0] : route.query.redirect
      const cleaned = sanitizePath(String(candidate))
      if (cleaned) {
        return cleaned
      }
    }

    // 3. Try stored redirect in sessionStorage/localStorage
    const saved = getSavedIntendedRedirect()
    if (saved) {
      return saved
    }

    // 4. Default fallback
    return fallback
  }

  function navigateAfterAuth(explicitTarget?: any, fallback = '/marketplace') {
    const target = resolveAuthRedirect(explicitTarget, fallback)
    clearIntendedRedirect()
    return router.push(target)
  }

  return {
    saveIntendedRedirect,
    getSavedIntendedRedirect,
    clearIntendedRedirect,
    resolveAuthRedirect,
    navigateAfterAuth,
    sanitizePath
  }
}
