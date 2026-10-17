import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      const activeToken = authStore.token || (process.client ? localStorage.getItem('token') : null)
      if (activeToken) {
        options.headers = options.headers || {}
        if (Array.isArray(options.headers)) {
          options.headers.push(['Authorization', `Bearer ${activeToken}`])
        } else if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${activeToken}`)
        } else {
          options.headers.Authorization = `Bearer ${activeToken}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // Only logout if it's not the signin endpoint itself failing (handled in auth store)
        if (!response.url.includes('/auth/signin')) {
          authStore.logout()
          // Use nuxtApp.$router which is the standardized way in plugins
          navigateTo('/login')
        }
      }
    }
  })

  return {
    provide: {
      api: apiFetch
    }
  }
})
