<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[450px] space-y-4">
      <!-- Register Card -->
      <div class="bg-white border border-[#dbdbdb] rounded-xl shadow-sm p-8 md:p-10 flex flex-col items-center">
        <!-- Logo/Title -->
        <div class="text-center mb-8 flex flex-col items-center">
            <div class="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 rotate-3">
                <Icon name="lucide:camera" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-4xl font-black tracking-tighter italic mb-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent" style="font-family: 'Inter', sans-serif;">Moment</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{{ $t('register.subtitle') }}</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="w-full space-y-4">
          <!-- Role Selection -->
          <div class="flex p-1 bg-gray-100 rounded-xl mb-6">
              <button 
                type="button"
                @click="registrationForm.role = 'customer'"
                :class="[registrationForm.role === 'customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
                class="flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Icon name="lucide:user" class="w-3.5 h-3.5" />
                {{ $t('register.customer') }}
              </button>
              <button 
                type="button"
                @click="registrationForm.role = 'photographer'"
                :class="[registrationForm.role === 'photographer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
                class="flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Icon name="lucide:camera" class="w-3.5 h-3.5" />
                {{ $t('register.photographer') }}
              </button>
          </div>

          <!-- Essential Data Group -->
          <div class="grid grid-cols-2 gap-3">
              <div class="relative">
                <Icon name="lucide:user" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
                <input 
                  v-model="registrationForm.firstName"
                  type="text" 
                  placeholder="Nombre" 
                  class="ig-input pl-11"
                  required
                />
              </div>
              <div class="relative">
                <Icon name="lucide:user" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
                <input 
                  v-model="registrationForm.lastName"
                  type="text" 
                  placeholder="Apellido" 
                  class="ig-input pl-11"
                  required
                />
              </div>
          </div>

          <div class="relative">
            <Icon name="lucide:mail" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="registrationForm.email"
              type="email" 
              :placeholder="$t('register.email')" 
              class="ig-input pl-10"
              required
            />
          </div>

          <div class="relative">
            <Icon name="lucide:at-sign" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="registrationForm.username"
              type="text" 
              :placeholder="$t('register.username')" 
              class="ig-input pl-10"
              required
            />
          </div>

          <div class="relative">
            <Icon name="lucide:phone" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="registrationForm.phone"
              type="tel" 
              placeholder="Teléfono" 
              class="ig-input pl-10"
              required
            />
          </div>

          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input 
              v-model="registrationForm.password"
              type="password" 
              :placeholder="$t('register.password')" 
              class="ig-input pl-10"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="ig-btn-primary w-full !mt-8 h-12 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-100 active:scale-[0.98]"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-5 w-5 animate-spin mr-2" />
            <span v-else>Registrarse</span>
          </button>
        </form>

        <p class="text-[11px] text-center text-gray-400 mt-8 px-4 leading-relaxed">
            Al registrarte, aceptas nuestras <NuxtLink to="/terms" class="font-bold hover:text-indigo-600">Condiciones</NuxtLink>, la <NuxtLink to="/privacy" class="font-bold hover:text-indigo-600">Política de privacidad</NuxtLink> y la <NuxtLink to="/cookies" class="font-bold hover:text-indigo-600">Política de cookies</NuxtLink>.
        </p>
      </div>

      <!-- Log In Redirect -->
      <div class="bg-white border border-[#dbdbdb] rounded-xl p-6 text-center text-sm">
        <span class="text-gray-500">{{ $t('register.has_account') }}</span>
        <NuxtLink to="/login" class="ml-1 font-bold text-indigo-600 hover:text-indigo-700">Entrar</NuxtLink>
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

const registrationForm = reactive({
  username: '',
  password: '',
  email: '',
  role: 'customer',
  firstName: '',
  lastName: '',
  phone: ''
})

const loading = ref(false)

async function handleRegister() {
  loading.value = true
  try {
    const success = await authStore.register({ ...registrationForm })
    
    if (success) {
      toast.success('¡Cuenta creada!', 'Tu registro se ha completado con éxito.')
      router.push('/login')
    } else {
      toast.error('Error en el registro', 'El usuario o correo ya están en uso.')
    }
  } catch (err) {
    toast.error('Error inesperado', 'Por favor intenta de nuevo más tarde.')
  } finally {
    loading.value = false
  }
}
</script>
