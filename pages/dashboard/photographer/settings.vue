<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center gap-4 mb-8">
      <button @click="$router.push('/dashboard/photographer')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Icon name="lucide:arrow-left" class="w-6 h-6 text-gray-800" />
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Configuración de Perfil</h1>
    </div>

    <!-- Profile Photo -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Foto de Perfil</h3>
      <div class="flex items-center gap-6">
        <div class="relative group cursor-pointer" @click="$refs.profileInput.click()">
          <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[3px]">
            <div class="w-full h-full rounded-full bg-white p-[3px]">
              <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:camera" class="w-10 h-10 text-gray-300" />
              </div>
            </div>
          </div>
          <div class="absolute inset-0 rounded-full bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="lucide:upload" class="w-6 h-6 text-white" />
          </div>
          <input type="file" ref="profileInput" class="hidden" accept="image/*" @change="uploadProfilePhoto" />
        </div>
        <div>
          <p class="font-bold text-gray-900">{{ authStore.user?.username }}</p>
          <p class="text-sm text-gray-500">Haz clic en la foto para cambiarla</p>
          <p v-if="uploadingProfile" class="text-xs text-indigo-600 font-semibold mt-1">Subiendo...</p>
        </div>
      </div>
    </div>

    <!-- Watermark Logo -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Logo de Marca de Agua</h3>
      <p class="text-sm text-gray-500 mb-4">
        Este logo se superpondrá en tus fotos como marca de agua. Recomendamos un PNG con fondo transparente.
      </p>

      <div class="flex flex-col sm:flex-row items-start gap-6">
        <!-- Current Logo Preview -->
        <div class="relative group cursor-pointer" @click="$refs.logoInput.click()">
          <div class="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-indigo-400 hover:bg-indigo-50 transition-all">
            <img v-if="watermarkLogoUrl" :src="watermarkLogoUrl" alt="Watermark Logo" class="w-full h-full object-contain p-2" />
            <div v-else class="text-center">
              <Icon name="lucide:image-plus" class="w-10 h-10 text-gray-300 mx-auto mb-1" />
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subir Logo</span>
            </div>
          </div>
          <div v-if="watermarkLogoUrl" class="absolute inset-0 rounded-2xl bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="lucide:upload" class="w-8 h-8 text-white" />
          </div>
          <input type="file" ref="logoInput" class="hidden" accept="image/png, image/svg+xml, image/jpeg" @change="uploadWatermarkLogo" />
        </div>

        <div class="flex-1">
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-2 text-gray-600">
              <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Formato recomendado: <strong>PNG</strong> con fondo transparente</span>
            </div>
            <div class="flex items-start gap-2 text-gray-600">
              <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Se aplicará con <strong>50% de opacidad</strong> sobre tus fotos</span>
            </div>
            <div class="flex items-start gap-2 text-gray-600">
              <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Tamaño mínimo sugerido: <strong>300x300 px</strong></span>
            </div>
          </div>
          <p v-if="uploadingLogo" class="text-xs text-indigo-600 font-semibold mt-3">Subiendo logo...</p>
          <p v-if="logoSuccess" class="text-xs text-green-600 font-semibold mt-3">✓ Logo actualizado correctamente</p>

          <button v-if="watermarkLogoUrl" @click="removeLogo"
                  class="mt-4 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
            Eliminar Logo
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div v-if="watermarkLogoUrl" class="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Vista Previa de Marca de Agua</h3>
      <div class="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="text-gray-500 text-sm">Ejemplo de cómo se verá tu marca de agua</p>
        </div>
        <img :src="watermarkLogoUrl" class="relative w-1/3 opacity-50" style="transform: rotate(-30deg)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

const uploadingProfile = ref(false)
const uploadingLogo = ref(false)
const logoSuccess = ref(false)
const watermarkLogoUrl = ref('')

onMounted(async () => {
    if (!authStore.isPhotographer) {
        router.push('/')
        return
    }
    // Fetch current watermark logo
    try {
        const res = await $api('/users/watermark-logo')
        watermarkLogoUrl.value = res.url || ''
    } catch (e) {
        console.error(e)
    }
})

async function uploadProfilePhoto(event) {
    const file = event.target.files[0]
    if (!file) return
    uploadingProfile.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await $api('/photos/upload-public', { method: 'POST', body: formData })
        await $api('/users/profile-photo', { method: 'PUT', body: res.url })
        authStore.user.profilePhotoUrl = res.url
    } catch (e) {
        console.error(e)
        alert('Error al subir la foto de perfil')
    } finally {
        uploadingProfile.value = false
    }
}

async function uploadWatermarkLogo(event) {
    const file = event.target.files[0]
    if (!file) return
    uploadingLogo.value = true
    logoSuccess.value = false
    try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await $api('/photos/upload-public', { method: 'POST', body: formData })
        await $api('/users/watermark-logo', { method: 'PUT', body: res.url })
        watermarkLogoUrl.value = res.url
        logoSuccess.value = true
        setTimeout(() => { logoSuccess.value = false }, 3000)
    } catch (e) {
        console.error(e)
        alert('Error al subir el logo')
    } finally {
        uploadingLogo.value = false
    }
}

async function removeLogo() {
    if (!confirm('¿Eliminar tu logo de marca de agua?')) return
    try {
        await $api('/users/watermark-logo', { method: 'PUT', body: '' })
        watermarkLogoUrl.value = ''
    } catch (e) {
        console.error(e)
        alert('Error al eliminar')
    }
}
</script>
