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
        
        <button type="button" class="w-full mt-3 bg-[#0095f6] hover:bg-[#1877f2] text-white rounded-lg h-8 flex items-center justify-center text-sm font-bold transition-all mb-4 gap-2">
          <Icon name="lucide:facebook" class="w-5 h-5" />
          Iniciar sesión con Facebook
        </button>

        <div class="w-full flex items-center mb-4 gap-4">
            <div class="flex-1 h-[1px] bg-[#dbdbdb]"></div>
            <span class="text-[13px] font-bold text-[#737373] uppercase">o</span>
            <div class="flex-1 h-[1px] bg-[#dbdbdb]"></div>
        </div>

        <form @submit.prevent="handleRegister" class="w-full flex flex-col gap-1.5">
          <!-- Role Selection -->
          <div class="flex p-1 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] mb-2">
              <button 
                type="button"
                @click="registrationForm.role = 'customer'"
                :class="[registrationForm.role === 'customer' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400']"
                class="flex-1 py-1 rounded-[2px] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Icon name="lucide:user" class="w-3.5 h-3.5" />
                Cliente
              </button>
              <button 
                type="button"
                @click="registrationForm.role = 'photographer'"
                :class="[registrationForm.role === 'photographer' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400']"
                class="flex-1 py-1 rounded-[2px] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Icon name="lucide:camera" class="w-3.5 h-3.5" />
                Fotógrafo
              </button>
          </div>

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
            Al registrarte, aceptas nuestras <NuxtLink to="/terms" class="text-[#00376b]">Condiciones</NuxtLink>, la <NuxtLink to="/privacy" class="text-[#00376b]">Política de privacidad</NuxtLink> y la Política de cookies.
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
import { useAuthStore } from '~/stores/auth'

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
