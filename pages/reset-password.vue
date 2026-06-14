<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[400px] space-y-4">
      <div class="bg-white border border-[#dbdbdb] rounded-xl shadow-sm p-8 md:p-10 flex flex-col items-center">
        <!-- Logo -->
        <div class="text-center mb-8 flex flex-col items-center">
            <div class="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                <Icon name="lucide:shield-check" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-xl font-bold text-gray-900 mb-2">Crear nueva contraseña</h1>
            <p class="text-sm text-gray-500">Introduce tu nueva contraseña para recuperar el acceso.</p>
        </div>
        
        <form @submit.prevent="handleReset" class="w-full space-y-4">
          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="newPassword"
              type="password" 
              placeholder="Nueva contraseña" 
              class="ig-input pl-11"
              required
            />
          </div>

          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="confirmPassword"
              type="password" 
              placeholder="Confirmar nueva contraseña" 
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
            <span v-else>Cambiar contraseña</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const token = route.query.token
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const toast = useToast()
const { $api } = useNuxtApp()

definePageMeta({
  layout: false
})

onMounted(() => {
  if (!token) {
    toast.error('Enlace inválido', 'No se encontró un token de recuperación.')
    router.push('/login')
  }
})

async function handleReset() {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Error', 'Las contraseñas no coinciden.')
    return
  }

  loading.value = true
  try {
    await $api('/auth/reset-password', {
      method: 'POST',
      body: { 
        token: token,
        newPassword: newPassword.value 
      }
    })
    toast.success('¡Hecho!', 'Tu contraseña ha sido actualizada.')
    router.push('/login')
  } catch (err) {
    toast.error('Error', err.response?._data?.message || 'No se pudo restablecer la contraseña.')
  } finally {
    loading.value = false
  }
}
</script>
