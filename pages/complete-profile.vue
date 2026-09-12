<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[400px] flex flex-col items-center">
      
      <!-- Card Principal -->
      <div class="bg-white border border-[#dbdbdb] rounded-lg p-8 w-full shadow-sm flex flex-col items-center">
        <!-- Logo -->
        <div class="text-center mb-6">
          <h1 class="text-4xl font-bold tracking-tight italic text-gray-900 mb-1" style="font-family: 'Inter', sans-serif;">Moments</h1>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Crea tu cuenta</p>
        </div>

        <!-- Encabezado con foto/avatar y bienvenida -->
        <div class="text-center mb-6 w-full">
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-md overflow-hidden">
            <img v-if="oauthData.profilePhotoUrl" :src="oauthData.profilePhotoUrl" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ oauthData.firstName ? oauthData.firstName.charAt(0).toUpperCase() : 'U' }}</span>
          </div>
          <h2 class="text-lg font-bold text-gray-900">¡Casi listo, {{ oauthData.firstName || 'Usuario' }}!</h2>
          <p class="text-xs text-gray-500 mt-1">
            Completa estos datos para activar tu cuenta vinculada con 
            <span class="font-semibold text-gray-700 capitalize">{{ oauthData.oauthProvider || 'Google' }}</span>.
          </p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-3.5">
          <!-- Email (Solo lectura) -->
          <div>
            <label class="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wide">Correo electrónico</label>
            <div class="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-600 cursor-not-allowed">
              <Icon :name="oauthData.oauthProvider?.toLowerCase() === 'instagram' ? 'lucide:instagram' : 'logos:google-icon'" class="w-4 h-4 flex-shrink-0" :class="oauthData.oauthProvider?.toLowerCase() === 'instagram' ? 'text-[#e1306c]' : ''" />
              <span class="truncate font-medium">{{ oauthData.email || 'correo@ejemplo.com' }}</span>
            </div>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wide">Nombre de usuario</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">@</span>
              <input 
                v-model="form.username"
                type="text" 
                placeholder="tunombre" 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-md pl-7 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                required
              />
            </div>
            <p class="text-[10px] text-gray-400 mt-1">Este será tu identificador único en Moments.</p>
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wide">Teléfono de contacto</label>
            <div class="flex gap-1.5">
              <select 
                v-model="form.countryCode"
                class="w-28 bg-[#fafafa] border border-[#dbdbdb] rounded-md px-2 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-center cursor-pointer font-medium"
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
                v-model="form.phoneLocal"
                type="tel" 
                placeholder="300 123 4567" 
                class="flex-1 w-full bg-[#fafafa] border border-[#dbdbdb] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <!-- Selector de Rol -->
          <div class="pt-2">
            <label class="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wide text-center">¿Cómo quieres usar Moments?</label>
            <div class="grid grid-cols-2 gap-2.5">
              <!-- Comprador -->
              <button
                type="button"
                @click="form.role = 'customer'"
                :class="[
                  'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center cursor-pointer',
                  form.role === 'customer'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-sm'
                    : 'border-gray-200 bg-[#fafafa] text-gray-600 hover:border-gray-300'
                ]"
              >
                <Icon name="lucide:user" class="w-5 h-5" :class="form.role === 'customer' ? 'text-blue-600' : 'text-gray-400'" />
                <span class="text-[11px] font-bold leading-tight">Usuario<br/>Comprador</span>
              </button>

              <!-- Fotógrafo -->
              <button
                type="button"
                @click="form.role = 'PHOTOGRAPHER'"
                :class="[
                  'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center cursor-pointer',
                  form.role === 'PHOTOGRAPHER'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-700 shadow-sm'
                    : 'border-gray-200 bg-[#fafafa] text-gray-600 hover:border-gray-300'
                ]"
              >
                <Icon name="lucide:camera" class="w-5 h-5" :class="form.role === 'PHOTOGRAPHER' ? 'text-emerald-600' : 'text-gray-400'" />
                <span class="text-[11px] font-bold leading-tight">Fotógrafo<br/>Vendedor</span>
              </button>
            </div>

            <!-- Aviso Fotógrafo -->
            <div v-if="form.role === 'PHOTOGRAPHER'" class="mt-2.5 p-2.5 rounded-md bg-amber-50 border border-amber-200 text-center">
              <p class="text-[11px] text-amber-800 leading-relaxed">
                Al registrarte como fotógrafo, aceptas los
                <NuxtLink to="/terms-photographer" target="_blank" class="font-bold underline text-amber-900">Términos de Fotógrafo</NuxtLink>.
                Serás responsable del copyright y fotos que publiques.
              </p>
            </div>
          </div>

          <!-- Botón de Envío -->
          <button 
            type="submit" 
            class="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 flex items-center justify-center text-sm font-bold transition-all shadow-sm"
            :disabled="loading || !form.username || !form.phoneLocal"
            :class="{ 'opacity-70 cursor-not-allowed': loading || !form.username || !form.phoneLocal }"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin mr-2" />
            <span>{{ loading ? 'Creando cuenta...' : 'Finalizar y Entrar' }}</span>
          </button>

          <!-- Cancelar -->
          <button 
            type="button" 
            @click="cancelOAuth"
            class="text-xs text-gray-500 hover:text-gray-800 text-center w-full py-1 transition-colors"
          >
            Cancelar y volver al login
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const swal = useSwal()

const loading = ref(false)

const oauthData = reactive({
  token: '',
  oauthProvider: 'Google',
  firstName: '',
  lastName: '',
  email: '',
  profilePhotoUrl: ''
})

const form = reactive({
  username: '',
  countryCode: '+57',
  phoneLocal: '',
  role: 'customer'
})

onMounted(() => {
  const pending = authStore.getPendingOAuth()
  if (!pending || !pending.token) {
    // Si no hay datos pendientes de Google/Facebook, redirigir al login
    router.replace('/login')
    return
  }

  oauthData.token = pending.token
  oauthData.oauthProvider = pending.oauthProvider || 'Google'
  oauthData.firstName = pending.firstName || ''
  oauthData.lastName = pending.lastName || ''
  oauthData.email = pending.email || ''
  oauthData.profilePhotoUrl = pending.profilePhotoUrl || ''

  // Sugerir username inicial a partir del email o nombre
  if (pending.email) {
    form.username = pending.email.split('@')[0].replace(/[^a-zA-Z0-9._]/g, '').toLowerCase()
  }
})

const handleSubmit = async () => {
  if (!form.username || !form.phoneLocal) {
    toast.error('Campos requeridos', 'Por favor completa todos los datos.')
    return
  }

  loading.value = true
  try {
    const payload = {
      token: oauthData.token,
      provider: (oauthData.oauthProvider || 'google').toLowerCase(),
      username: form.username.trim(),
      phone: `${form.countryCode}${form.phoneLocal.trim()}`,
      role: form.role
    }

    const res = await authStore.completeOAuthRegistration(payload)
    if (res?.success) {
      toast.success('¡Bienvenido a Moments!', 'Tu cuenta ha sido creada exitosamente.')
      if (form.role === 'PHOTOGRAPHER') {
        router.push('/dashboard/photographer')
      } else {
        router.push('/marketplace')
      }
    }
  } catch (err) {
    const errorMsg = err.response?._data?.message || err.data?.message || 'Error al completar el registro.'
    swal.error('No se pudo registrar', errorMsg)
  } finally {
    loading.value = false
  }
}

const cancelOAuth = () => {
  authStore.clearPendingOAuth()
  router.push('/login')
}
</script>
