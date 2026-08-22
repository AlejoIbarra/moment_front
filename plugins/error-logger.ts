export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error("Vue Error Captured:", error, info)
  }
  
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error("Vue Hook Error:", error, info)
  })

  nuxtApp.hook('app:error', (error) => {
    console.error("App Error:", error)
  })
})
