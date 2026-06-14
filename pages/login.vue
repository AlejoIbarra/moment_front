<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[400px] space-y-4">
      <div class="bg-white border border-[#dbdbdb] rounded-xl shadow-sm p-8 md:p-10 flex flex-col items-center">
        <!-- Logo -->
        <div class="text-center mb-10 flex flex-col items-center">
            <div class="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 rotate-3">
                <Icon name="lucide:camera" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-4xl font-black tracking-tighter italic mb-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent" style="font-family: 'Inter', sans-serif;">Moment</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Bienvenido de nuevo</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="w-full space-y-4">
          <div class="relative">
            <Icon name="lucide:at-sign" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="loginForm.username"
              type="text" 
              placeholder="Usuario o correo" 
              class="ig-input pl-11"
              required
            />
          </div>

          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="loginForm.password"
              type="password" 
              placeholder="Contraseña" 
              class="ig-input pl-11"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="ig-btn-primary w-full !mt-8 h-12 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-100 active:scale-[0.98]"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-5 w-5 animate-spin mr-2" />
            <span v-else>Entrar</span>
          </button>
        </form>

        <div class="w-full flex items-center my-8">
            <div class="flex-1 h-[1px] bg-gray-200"></div>
            <span class="mx-4 text-xs font-bold text-gray-400 uppercase">o</span>
            <div class="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        <NuxtLink to="/forgot-password" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">¿Olvidaste tu contraseña?</NuxtLink>
      </div>

      <!-- Sign Up Redirect -->
      <div class="bg-white border border-[#dbdbdb] rounded-xl p-6 text-center text-sm">
        <span class="text-gray-500">¿No tienes una cuenta?</span>
        <NuxtLink to="/register" class="ml-1 font-bold text-indigo-600 hover:text-indigo-700">Regístrate</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    const success = await authStore.login(loginForm.username, loginForm.password)
    if (success) {
      toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente.')
      router.push('/marketplace')
    } else {
      toast.error('Error de acceso', 'Usuario o contraseña incorrectos.')
    }
  } catch (err) {
    toast.error('Error', 'Ocurrió un problema al intentar entrar.')
  } finally {
    loading.value = false
  }
}
</script>
