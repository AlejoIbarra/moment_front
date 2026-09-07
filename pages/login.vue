<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[350px] flex flex-col items-center">
      
      <!-- Contenedor Principal (Login Box) -->
      <div class="bg-white border border-[#dbdbdb] rounded-sm p-10 w-full mb-3 flex flex-col items-center">
        <!-- Logo Text (Instagram style script) -->
        <div class="text-center mb-8 flex flex-col items-center">
            <h1 class="text-5xl font-bold tracking-tight italic text-gray-900" style="font-family: 'Inter', sans-serif;">Moments</h1>
        </div>
        
        
        <!-- OAuth Buttons -->
        <div v-if="!show2fa && !showOAuthComplete" class="w-full flex flex-col gap-2 mt-4">
          <GoogleLogin :callback="handleGoogleLogin">
            <button type="button" class="w-full bg-white border border-[#dbdbdb] hover:bg-gray-50 text-gray-700 rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all gap-2 shadow-sm">
              <Icon name="logos:google-icon" class="w-4 h-4" />
              Continuar con Google
            </button>
          </GoogleLogin>

          <button type="button" @click="handleFacebookLogin" class="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all gap-2 shadow-sm">
            <Icon name="lucide:facebook" class="w-5 h-5" />
            Continuar con Facebook
          </button>
        </div>

        <div v-if="!show2fa && !showOAuthComplete" class="w-full flex items-center my-4 gap-4">
            <div class="flex-1 h-[1px] bg-[#dbdbdb]"></div>
            <span class="text-[13px] font-bold text-[#737373] uppercase">o</span>
            <div class="flex-1 h-[1px] bg-[#dbdbdb]"></div>
        </div>

        <form v-if="!show2fa && !showOAuthComplete" @submit.prevent="handleLogin" class="w-full flex flex-col gap-1.5">
          <div class="w-full">
            <input 
              v-model="loginForm.username"
              type="text" 
              placeholder="Usuario o correo electrónico" 
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

            <!-- Photographer notice -->
            <div v-if="oauthForm.role === 'PHOTOGRAPHER'" class="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
              <p class="text-[10px] text-amber-700 leading-relaxed text-center">
                Al registrarte como fotógrafo, aceptas los
                <NuxtLink to="/terms-photographer" target="_blank" class="font-bold text-amber-800 underline">Términos del Fotógrafo</NuxtLink>.
                Eres responsable de los derechos de autor de tu contenido.
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


        <!-- Formulario de 2FA -->
        <form v-if="show2fa" @submit.prevent="handleVerify2fa" class="w-full flex flex-col gap-2">
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



        <NuxtLink v-if="!show2fa && !showOAuthComplete" to="/forgot-password" class="text-xs text-[#00376b] hover:text-[#00376b]/70 transition-colors mt-2">¿Olvidaste tu contraseña?</NuxtLink>
      </div>
      
      <!-- Sign Up Box -->
      <div class="bg-white border border-[#dbdbdb] rounded-sm p-5 w-full text-center">
        <p class="text-sm text-gray-900">¿No tienes una cuenta? <NuxtLink to="/register" class="text-[#0095f6] font-bold hover:text-[#00376b]">Regístrate</NuxtLink></p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useAuthStore } from '~/stores/auth'

onMounted(() => {
  // Manejar el retorno de Facebook (Manual OAuth Flow)
  const hash = window.location.hash;
  if (hash && hash.includes('access_token=')) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    if (token) {
      // Limpiar la URL
      window.history.replaceState(null, null, window.location.pathname);
      
      loading.value = true;
      authStore.facebookLogin(token).then((res) => {
        if (res?.requiresRegistration) {
          oauthData.token = token;
          oauthData.oauthProvider = 'Facebook';
          oauthData.firstName = res.firstName || 'Usuario';
          oauthData.email = res.email;
          showOAuthComplete.value = true;
        } else {
          toast.success('¡Bienvenido!', 'Has iniciado sesión con Facebook.');
          const redirectPath = route.query.redirect || '/marketplace';
          router.push(redirectPath);
        }
      }).catch(err => {
        swal.error('Error de acceso', 'Error al iniciar sesión con Facebook.');
      }).finally(() => {
        loading.value = false;
      });
    }
  }
});


// OAuth Logic
const handleGoogleLogin = async (response) => {
  loading.value = true
  try {
    if (response.credential) {
      const res = await authStore.googleLogin(response.credential)
      // Check if needs profile completion
      if (res?.requiresRegistration) {
        oauthData.token = response.credential
        oauthData.oauthProvider = 'Google'
        oauthData.firstName = res.firstName || 'Usuario'
        oauthData.email = res.email
        showOAuthComplete.value = true
      } else {
        toast.success('¡Bienvenido!', 'Has iniciado sesión con Google.')
        const redirectPath = route.query.redirect || '/marketplace'
        router.push(redirectPath)
      }
    }
  } catch (err) {
    const errorMsg = err.response?._data?.message || 'Error al iniciar sesión con Google.'
    swal.error('Error de acceso', errorMsg)
  } finally {
    loading.value = false
  }
}

const handleFacebookLogin = () => {
  // Flujo manual de OAuth: Es 100% confiable y no falla por FedCM ni bloqueadores de popups
  const appId = '1069753052575649';
  const redirectUri = encodeURIComponent(window.location.origin + '/login');
  const fbLoginUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&response_type=token&scope=email,public_profile`;
  
  // Redirigir al usuario
  window.location.href = fbLoginUrl;
}

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
    const roleMsg = oauthForm.role === 'PHOTOGRAPHER' ? 'Tu solicitud como fotógrafo ha sido registrada.' : 'Tu cuenta ha sido creada y configurada.'
    toast.success('¡Registro Exitoso!', roleMsg)
    const redirectPath = oauthForm.role === 'PHOTOGRAPHER' ? '/dashboard/photographer' : '/marketplace'
    router.push(redirectPath)
  } catch (err) {
    const errorMsg = err.response?._data?.message || 'Error al completar el registro.'
    swal.error('Error', errorMsg)
  } finally {
    loading.value = false
  }
}


definePageMeta({
  layout: false
})

const route = useRoute()
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

// OAuth Completion state
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
      const redirectPath = route.query.redirect || '/marketplace'
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
      const redirectPath = route.query.redirect || '/marketplace'
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
