export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      const authRedirect = useAuthRedirect()
      authRedirect.saveIntendedRedirect(to.fullPath)
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
})
