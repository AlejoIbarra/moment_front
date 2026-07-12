<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[400px] space-y-4">
      <div class="bg-white border border-[#dbdbdb] rounded-xl shadow-sm p-8 md:p-10 flex flex-col items-center">
        <!-- Logo -->
        <div class="text-center mb-10 flex flex-col items-center">
            <div class="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 rotate-3">
                <Icon name="lucide:camera" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-4xl font-black tracking-tighter italic mb-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent" style="font-family: 'Inter', sans-serif;">Moments</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Bienvenido de nuevo</p>
        </div>
        
        <form v-if="!show2fa" @submit.prevent="handleLogin" class="w-full space-y-4">
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

        <!-- Formulario de 2FA -->
        <form v-else @submit.prevent="handleVerify2fa" class="w-full space-y-4">
          <div class="text-center mb-2">
            <p class="text-xs text-gray-500 leading-relaxed">
              Hemos enviado un código de verificación de 6 dígitos a tu correo:
            </p>
            <p class="text-sm font-bold text-gray-700 mt-1 mb-4">
              {{ targetEmail }}
            </p>
          </div>

          <div class="relative">
            <Icon name="lucide:key-round" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="code2fa"
              type="text" 
              placeholder="Código de 6 dígitos" 
              class="ig-input pl-11 text-center font-bold tracking-[0.2em] text-base"
              maxlength="6"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="ig-btn-primary w-full !mt-8 h-12 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-100 active:scale-[0.98]"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-5 w-5 animate-spin mr-2" />
            <span v-else>Verificar Código</span>
          </button>

          <button 
            type="button" 
            @click="show2fa = false"
            class="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors w-full text-center block !mt-4"
          >
            &larr; Volver al inicio de sesión
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
const swal = useSwal()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const show2fa = ref(false)
const code2fa = ref('')
const targetEmail = ref('')
const targetUsername = ref('')

async function handleLogin() {
  loading.value = true
  try {
    const res = await authStore.login(loginForm.username, loginForm.password)
    if (res.requires2fa) {
      targetEmail.value = res.email
      targetUsername.value = res.username
      show2fa.value = true
      toast.info('Código enviado', 'Ingresa el código que enviamos a tu correo.')
    } else {
      toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente.')
      router.push('/marketplace')
    }
  } catch (err) {
    const errorMsg = err.response?._data?.message || 'Usuario o contraseña incorrectos.'
    swal.error('Error de acceso', errorMsg)
  } finally {
    loading.value = false
  }
}

async function handleVerify2fa() {
  loading.value = true
  try {
    const success = await authStore.verify2fa(targetUsername.value, code2fa.value)
    if (success) {
      toast.success('¡Bienvenido!', 'Código verificado con éxito.')
      router.push('/marketplace')
    } else {
      swal.error('Código inválido', 'El código de verificación es incorrecto o expiró.')
    }
  } catch (err) {
    swal.error('Error', 'Ocurrió un problema al verificar el código.')
  } finally {
    loading.value = false
  }
}
</script>
