import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    nuxtApp.vueApp.use(vue3GoogleLogin, {
        clientId: config.public.googleClientId || '394351432713-v07qogji3mrdvpj92359bquvdul7b1dv.apps.googleusercontent.com'
    })
})

