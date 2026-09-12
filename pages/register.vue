<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[350px] flex flex-col items-center">
      
      <!-- Register Card -->
      <div class="bg-white border border-[#dbdbdb] rounded-sm p-10 w-full mb-3 flex flex-col items-center">
        <!-- Logo Text -->
        <div class="text-center mb-4 flex flex-col items-center">
            <h1 class="text-5xl font-bold tracking-tight italic text-gray-900" style="font-family: 'Inter', sans-serif;">Moments</h1>
            <p class="text-[13px] font-bold text-[#737373] mt-3 leading-tight">{{ $t('register.subtitle') || 'Regístrate para ver fotos y videos de tus eventos favoritos.' }}</p>
        </div>
        
        
        <!-- OAuth Buttons -->
        <div v-if="!showOAuthComplete" class="w-full flex flex-col gap-2 mt-4">
          <button type="button" @click="handleGoogleClick" class="w-full bg-white border border-[#dbdbdb] hover:bg-gray-50 text-gray-700 rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all gap-2 shadow-sm">
            <Icon name="logos:google-icon" class="w-4 h-4" />
            Continuar con Google
          </button>

          <button type="button" @click="handleInstagramLogin" class="w-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all gap-2 shadow-sm">
            <Icon name="lucide:instagram" class="w-5 h-5" />
            Continuar con Instagram
          </button>
        </div>


        <div v-if="!showOAuthComplete" class="w-full flex items-center mb-4 gap-4">
            <div class="flex-1 h-[1px] bg-[#dbdbdb]"></div>
            <span class="text-[13px] font-bold text-[#737373] uppercase">o</span>
            <div class="flex-1 h-[1px] bg-[#dbdbdb]"></div>
        </div>

        <form v-if="!showOAuthComplete" @submit.prevent="handleRegister" class="w-full flex flex-col gap-1.5">
          <!-- Inputs Group -->
          <div class="grid grid-cols-2 gap-1.5">
              <input 
                v-model="registrationForm.firstName"
                type="text" 
                placeholder="Nombre" 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
                required
              />
              <input 
                v-model="registrationForm.lastName"
                type="text" 
                placeholder="Apellido" 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
                required
              />
          </div>

          <input 
            v-model="registrationForm.email"
            type="email" 
            :placeholder="$t('register.email') || 'Correo electrónico'" 
            class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
            required
          />

          <input 
            v-model="confirmEmail"
            type="email" 
            placeholder="Confirmar correo electrónico" 
            class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
            required
          />

          <input 
            v-model="registrationForm.username"
            type="text" 
            :placeholder="$t('register.username') || 'Nombre de usuario'" 
            class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
            required
          />

          <!-- Teléfono -->
          <div class="flex gap-1.5">
            <select 
              v-model="selectedCountryCode"
              class="w-1/3 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400 appearance-none text-center cursor-pointer"
              required
            >
              <option value="+57">🇨🇴 +57</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+54">🇦🇷 +54</option>
              <option value="+56">🇨🇱 +56</option>
              <option value="+51">🇵🇪 +51</option>
              <option value="+593">🇪🇨 +593</option>
              <option value="+58">🇻🇪 +58</option>
            </select>
            <input 
              v-model="phoneLocalNumber"
              type="tel" 
              placeholder="Teléfono" 
              class="flex-1 w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          <input 
            v-model="registrationForm.password"
            type="password" 
            :placeholder="$t('register.password') || 'Contraseña'" 
            class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
            required
          />

          <input 
            v-model="confirmPassword"
            type="password" 
            placeholder="Confirmar contraseña" 
            class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
            required
          />
          
          <p class="text-[11px] text-[#737373] text-center my-3 leading-relaxed">
            Al registrarte, aceptas nuestras <NuxtLink to="/terms-user" class="text-[#00376b]">Condiciones</NuxtLink>, la <NuxtLink to="/privacy" class="text-[#00376b]">Política de privacidad</NuxtLink> y la Política de cookies.
          </p>

          <button 
            type="submit" 
            class="w-full bg-[#4cb5f9] hover:bg-[#0095f6] text-white rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all"
            :disabled="loading || !isFormValid"
            :class="{ 'opacity-70 cursor-not-allowed': loading || !isFormValid }"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <span v-else>Registrarte</span>
          </button>

          <!-- Link to Photographer Access -->
          <div class="mt-3 pt-3 border-t border-[#dbdbdb] text-center">
            <p class="text-[11px] text-[#737373] mb-1">¿Eres fotógrafo profesional?</p>
            <NuxtLink to="/photographer-access" class="text-[11px] text-[#0095f6] font-bold hover:text-[#00376b] flex items-center justify-center gap-1">
              <Icon name="lucide:camera" class="w-3 h-3" />
              Solicita acceso como fotógrafo
            </NuxtLink>
          </div>
        </form>

        <!-- Formulario Completar Registro OAuth -->
        <form v-if="showOAuthComplete" @submit.prevent="submitOAuthComplete" class="w-full flex flex-col gap-2">
          <div class="text-center mb-2">
            <Icon name="lucide:user-plus" class="w-12 h-12 text-gray-900 mx-auto mb-3" />
            <p class="text-sm text-gray-800 font-medium">Completa tu perfil</p>
            <p class="text-[11px] text-gray-500 mt-1 mb-4 leading-relaxed">
              Hola {{ oauthData.firstName }}, para terminar tu registro con {{ oauthData.oauthProvider }}, por favor dinos cómo quieres llamarte y tu teléfono.
            </p>
          </div>

          <div class="w-full">
            <input 
              v-model="oauthForm.username"
              type="text" 
              placeholder="Nombre de usuario" 
              class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
              required
            />
          </div>
          
          <div class="flex gap-1.5">
            <select 
              v-model="oauthForm.countryCode"
              class="w-1/3 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400 appearance-none text-center cursor-pointer"
              required
            >
              <option value="+57">🇨🇴 +57</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+54">🇦🇷 +54</option>
              <option value="+56">🇨🇱 +56</option>
              <option value="+51">🇵🇪 +51</option>
              <option value="+593">🇪🇨 +593</option>
              <option value="+58">🇻🇪 +58</option>
            </select>
            <input 
              v-model="oauthForm.phoneLocal"
              type="tel" 
              placeholder="Teléfono" 
              class="flex-1 w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-xs focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          <!-- Role Selector -->
          <div class="mt-3 mb-1">
            <p class="text-[11px] font-bold text-gray-600 mb-2 text-center uppercase tracking-wider">¿Cómo quieres usar Moments?</p>
            <div class="grid grid-cols-2 gap-2">
              <!-- Usuario Normal -->
              <button
                type="button"
                @click="oauthForm.role = 'customer'"
                :class="[
                  'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center cursor-pointer',
                  oauthForm.role === 'customer'
                    ? 'border-[#0095f6] bg-[#0095f6]/8'
                    : 'border-[#dbdbdb] bg-[#fafafa] hover:border-gray-400'
                ]"
              >
                <Icon name="lucide:user" :class="['w-5 h-5', oauthForm.role === 'customer' ? 'text-[#0095f6]' : 'text-gray-500']" />
                <span :class="['text-[10px] font-bold leading-tight', oauthForm.role === 'customer' ? 'text-[#0095f6]' : 'text-gray-600']">
                  Usuario<br/>Comprador
                </span>
              </button>
              <!-- Fotógrafo -->
              <button
                type="button"
                @click="oauthForm.role = 'PHOTOGRAPHER'"
                :class="[
                  'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center cursor-pointer',
                  oauthForm.role === 'PHOTOGRAPHER'
                    ? 'border-[#3ef4a1] bg-[#3ef4a1]/8'
                    : 'border-[#dbdbdb] bg-[#fafafa] hover:border-gray-400'
                ]"
              >
                <Icon name="lucide:camera" :class="['w-5 h-5', oauthForm.role === 'PHOTOGRAPHER' ? 'text-[#22c55e]' : 'text-gray-500']" />
                <span :class="['text-[10px] font-bold leading-tight', oauthForm.role === 'PHOTOGRAPHER' ? 'text-[#22c55e]' : 'text-gray-600']">
                  Fotógrafo<br/>Vendedor
                </span>
              </button>
            </div>

            <!-- Photographer legal notice -->
            <div v-if="oauthForm.role === 'PHOTOGRAPHER'" class="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
              <p class="text-[10px] text-amber-700 leading-relaxed text-center">
                Al registrarte como fotógrafo, aceptas los
                <NuxtLink to="/terms-photographer" target="_blank" class="font-bold text-amber-800 underline">Términos del Fotógrafo</NuxtLink>.
                Eres el único responsable del contenido y los derechos de autor.
              </p>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="w-full mt-2 bg-[#0095f6] text-white rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all"
            :disabled="loading || !oauthForm.username || !oauthForm.phoneLocal"
            :class="{ 'opacity-70 cursor-not-allowed': loading || !oauthForm.username || !oauthForm.phoneLocal }"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <span v-else>Finalizar Registro</span>
          </button>

          <button 
            type="button" 
            @click="showOAuthComplete = false"
            class="text-[11px] text-blue-900 mt-4 text-center w-full hover:underline"
          >
            Cancelar
          </button>
        </form>

      </div>

      <!-- Login Box -->
      <div class="bg-white border border-[#dbdbdb] rounded-sm p-5 w-full text-center">
        <p class="text-sm text-gray-900">¿Tienes una cuenta? <NuxtLink to="/login" class="text-[#0095f6] font-bold hover:text-[#00376b]">Entrar</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { googleTokenLogin } from 'vue3-google-login'

import { useAuthStore } from '~/stores/auth'


const showOAuthComplete = ref(false)
const oauthData = reactive({
  token: '',
  oauthProvider: '',
  firstName: '',
  email: ''
})
const oauthForm = reactive({
  username: '',
  countryCode: '+57',
  phoneLocal: '',
  role: 'customer'
})

const submitOAuthComplete = async () => {
  loading.value = true
  try {
    const payload = {
      token: oauthData.token,
      provider: oauthData.oauthProvider.toLowerCase(),
      username: oauthForm.username,
      phone: `${oauthForm.countryCode}${oauthForm.phoneLocal}`,
      role: oauthForm.role
    }
    await authStore.completeOAuthRegistration(payload)
    const roleMsg = oauthForm.role === 'PHOTOGRAPHER' ? 'Tu cuenta como fotógrafo ha sido creada.' : 'Tu cuenta ha sido creada y configurada.'
    toast.success('¡Registro Exitoso!', roleMsg)
    const redirectPath = oauthForm.role === 'PHOTOGRAPHER' ? '/dashboard/photographer' : '/marketplace'
    router.push(redirectPath)
  } catch (err) {
    const errorMsg = err.response?._data?.message || 'Error al completar el registro.'
    toast.error('Error', errorMsg)
  } finally {
    loading.value = false
  }
}

// OAuth Logic
const handleGoogleClick = () => {
  loading.value = true
  googleTokenLogin().then((response) => {
    handleGoogleLogin(response)
  }).catch((err) => {
    console.error('Google login error:', err)
    loading.value = false
  })
}

const handleGoogleLogin = async (response) => {
  loading.value = true
  try {
    const token = response?.credential || response?.access_token || response?.code
    if (token) {
      const res = await authStore.googleLogin(token)
      if (res?.requiresRegistration) {
        router.push('/complete-profile')
      } else {
        toast.success('¡Bienvenido!', 'Has iniciado sesión con Google.')
        router.push('/marketplace')
      }
    } else {
      console.warn('Google response received without token:', response)
    }
  } catch (err) {
    const errorMsg = err.response?._data?.message || err.data?.message || 'Error al iniciar sesión con Google.'
    toast.error('Error', errorMsg)
  } finally {
    loading.value = false
  }
}

const handleInstagramLogin = () => {
  const config = useRuntimeConfig()
  const appId = config.public.instagramClientId
  if (!appId) {
    toast.error('Configuración requerida', 'Debes configurar NUXT_PUBLIC_INSTAGRAM_CLIENT_ID en tus variables de entorno.')
    return
  }
  const redirectUri = encodeURIComponent(window.location.origin + '/login')
  const instaLoginUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`
  
  window.location.href = instaLoginUrl
}



definePageMeta({
  layout: false
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const registrationForm = reactive({
  username: '',
  password: '',
  email: '',
  role: 'customer',
  firstName: '',
  lastName: '',
  phone: ''
})

const confirmEmail = ref('')
const confirmPassword = ref('')
const selectedCountryCode = ref('+57') // Default to Colombia
const phoneLocalNumber = ref('')
const loading = ref(false)

const isFormValid = computed(() => {
  return registrationForm.firstName && 
         registrationForm.lastName && 
         registrationForm.email && 
         confirmEmail.value === registrationForm.email &&
         registrationForm.username && 
         phoneLocalNumber.value && 
         registrationForm.password.length >= 6 && 
         confirmPassword.value === registrationForm.password;
});

async function handleRegister() {
  // 1. Validar confirmación de correo
  if (registrationForm.email !== confirmEmail.value) {
    toast.error('Correos no coinciden', 'El correo de confirmación no coincide con el correo ingresado.')
    return
  }

  // 2. Validar confirmación de contraseña
  if (registrationForm.password !== confirmPassword.value) {
    toast.error('Contraseñas no coinciden', 'La contraseña de confirmación no coincide con la contraseña ingresada.')
    return
  }

  // 3. Concatenar código de país con número local
  registrationForm.phone = `${selectedCountryCode.value}${phoneLocalNumber.value.trim()}`

  loading.value = true
  try {
    const result = await authStore.register({ ...registrationForm })
    
    if (result.success) {
      toast.success('¡Cuenta creada!', 'Tu registro se ha completado con éxito.')
      router.push('/login')
    } else {
      toast.error('Error en el registro', result.error || 'El usuario o correo ya están en uso.')
    }
  } catch (err) {
    toast.error('Error inesperado', 'Por favor intenta de nuevo más tarde.')
  } finally {
    loading.value = false
  }
}
</script>
