<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[400px] space-y-4">
      <div class="bg-white border border-[#dbdbdb] rounded-xl shadow-sm p-8 md:p-10 flex flex-col items-center">
        <!-- Logo -->
        <div class="text-center mb-8 flex flex-col items-center">
            <div class="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 rotate-3">
                <Icon name="lucide:lock" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-xl font-bold text-gray-900 mb-2">¿Tienes problemas para entrar?</h1>
            <p class="text-sm text-gray-500">Introduce tu correo electrónico y te enviaremos un enlace para recuperar el acceso a tu cuenta.</p>
        </div>
        
        <form @submit.prevent="handleForgot" class="w-full space-y-4">
          <div class="relative">
            <Icon name="lucide:mail" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="email"
              type="email" 
              placeholder="Correo electrónico" 
              class="ig-input pl-11"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="ig-btn-primary w-full !mt-6 h-11 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-100 active:scale-[0.98]"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-5 w-5 animate-spin mr-2" />
            <span v-else>Enviar enlace de recuperación</span>
          </button>
        </form>

        <div class="w-full flex items-center my-6">
            <div class="flex-1 h-[1px] bg-gray-200"></div>
            <span class="mx-4 text-xs font-bold text-gray-400 uppercase">o</span>
            <div class="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        <NuxtLink to="/register" class="text-sm font-bold text-gray-900 hover:text-gray-600">Crear cuenta nueva</NuxtLink>
      </div>

      <!-- Back to Login -->
      <div class="bg-white border border-[#dbdbdb] rounded-xl p-4 text-center text-sm">
        <NuxtLink to="/login" class="font-bold text-gray-900 hover:text-gray-600">Volver al inicio de sesión</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const loading = ref(false)
const toast = useToast()
const { $api } = useNuxtApp()

definePageMeta({
  layout: false
})

async function handleForgot() {
  loading.value = true
  try {
    await $api('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    toast.success('¡Correo enviado!', 'Si el correo existe en nuestra base de datos, recibirás un enlace de recuperación.')
    email.value = ''
  } catch (err) {
    toast.error('Error', err.response?._data?.message || 'No se pudo enviar el correo.')
  } finally {
    loading.value = false
  }
}
</script>
