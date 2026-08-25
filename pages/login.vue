<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[350px] flex flex-col items-center">
      
      <!-- Contenedor Principal (Login Box) -->
      <div class="bg-white border border-[#dbdbdb] rounded-sm p-10 w-full mb-3 flex flex-col items-center">
        <!-- Logo Text (Instagram style script) -->
        <div class="text-center mb-8 flex flex-col items-center">
            <h1 class="text-5xl font-bold tracking-tight italic text-gray-900" style="font-family: 'Inter', sans-serif;">Moments</h1>
        </div>
        
        <form v-if="!show2fa" @submit.prevent="handleLogin" class="w-full flex flex-col gap-1.5">
          <div class="w-full">
            <input 
              v-model="loginForm.username"
              type="text" 
              placeholder="Teléfono, usuario o correo electrónico" 
              class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          <div class="w-full relative">
            <input 
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Contraseña" 
              class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] pl-2 pr-10 py-[9px] text-xs focus:outline-none focus:border-gray-400"
              required
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-800 hover:text-gray-400 focus:outline-none"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          
          <button 
            type="submit" 
            class="w-full mt-3 bg-[#4cb5f9] text-white rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all hover:bg-[#0095f6]"
            :disabled="loading || !loginForm.username || loginForm.password.length < 6"
            :class="{ 'opacity-70 cursor-not-allowed': loading || !loginForm.username || loginForm.password.length < 6 }"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <span v-else>Iniciar sesión</span>
          </button>
        </form>

        <!-- Formulario de 2FA -->
        <form v-else @submit.prevent="handleVerify2fa" class="w-full flex flex-col gap-2">
          <div class="text-center mb-2">
            <Icon name="lucide:shield-check" class="w-12 h-12 text-gray-900 mx-auto mb-3" />
            <p class="text-sm text-gray-800 font-medium">Ingresa el código</p>
            <p class="text-[11px] text-gray-500 mt-1 mb-4 leading-relaxed">
              Enviamos un código de seguridad a {{ targetEmail }}.
            </p>
          </div>

          <div class="w-full">
            <input 
              v-model="code2fa"
              type="text" 
              placeholder="Código de 6 dígitos" 
              class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400 text-center tracking-[0.2em]"
              maxlength="6"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="w-full mt-2 bg-[#0095f6] text-white rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all"
            :disabled="loading || code2fa.length < 6"
            :class="{ 'opacity-70 cursor-not-allowed': loading || code2fa.length < 6 }"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <span v-else>Confirmar</span>
          </button>

          <button 
            type="button" 
            @click="show2fa = false"
            class="text-[11px] text-blue-900 mt-4 text-center w-full hover:underline"
          >
            Volver al inicio de sesión
          </button>
        </form>



        <NuxtLink v-if="!show2fa" to="/forgot-password" class="text-xs text-[#00376b] hover:text-[#00376b]/70 transition-colors mt-2">¿Olvidaste tu contraseña?</NuxtLink>
      </div>
      
      <!-- Sign Up Box -->
      <div class="bg-white border border-[#dbdbdb] rounded-sm p-5 w-full text-center">
        <p class="text-sm text-gray-900">¿No tienes una cuenta? <NuxtLink to="/register" class="text-[#0095f6] font-bold hover:text-[#00376b]">Regístrate</NuxtLink></p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
const showPassword = ref(false)
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
      const redirectPath = useRoute().query.redirect || '/marketplace'
      router.push(redirectPath)
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
      const redirectPath = useRoute().query.redirect || '/marketplace'
      router.push(redirectPath)
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
