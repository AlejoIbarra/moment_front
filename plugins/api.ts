import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      if (authStore.token) {
        options.headers = options.headers || {}
        if (Array.isArray(options.headers)) {
          options.headers.push(['Authorization', `Bearer ${authStore.token}`])
        } else if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${authStore.token}`)
        } else {
          options.headers.Authorization = `Bearer ${authStore.token}`
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
