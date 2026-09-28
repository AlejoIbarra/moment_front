<template>
  <div class="min-h-screen bg-[#0a0d14] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
    
    <!-- Background Ambient Glows -->
    <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 blur-[140px] pointer-events-none"></div>

    <!-- Header Navigation -->
    <header class="relative z-10 border-b border-white/10 bg-gray-950/60 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Icon name="lucide:camera" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold tracking-tight text-white font-serif italic">Moments</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <NuxtLink 
            v-if="photoData?.eventUuid || photoData?.eventId" 
            :to="`/marketplace/events/${photoData.eventUuid || photoData.eventId}`"
            class="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10"
          >
            <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
            <span>Volver al Evento</span>
          </NuxtLink>

          <NuxtLink 
            to="/marketplace" 
            class="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 transition-colors border border-indigo-500/30"
          >
            Marketplace
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">

      <!-- 1. LOADING & REVELANDO STATE -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div class="relative w-24 h-24 mb-6">
          <div class="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping"></div>
          <div class="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
          <div class="absolute inset-3 rounded-full bg-indigo-950/60 backdrop-blur-md flex items-center justify-center border border-indigo-500/30 shadow-inner">
            <Icon name="lucide:sparkles" class="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Revelando Fotografía Digital...</h2>
        <p class="text-sm text-gray-400 max-w-md">
          Conectando con el almacenamiento seguro de Moments para preparar tu archivo en máxima resolución.
        </p>
      </div>

      <!-- 2. RECURSO NO ENCONTRADO / ERROR STATE -->
      <div v-else-if="errorMessage || notFound" class="flex flex-col items-center justify-center py-12 text-center animate-fade-in max-w-xl mx-auto">
        <div class="relative mb-6">
          <div class="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-xl shadow-red-500/10">
            <Icon name="lucide:image-off" class="w-10 h-10 text-red-400" />
          </div>
          <div class="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-[10px] font-bold text-red-300 uppercase tracking-wider">
            404
          </div>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Recurso No Encontrado
        </h1>

        <p class="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
          {{ errorMessage || 'Esta fotografía fue retirada o eliminada por el fotógrafo del evento y ya no se encuentra disponible en Moments.' }}
        </p>

        <!-- Help Info Box -->
        <div class="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-8 text-left backdrop-blur-sm">
          <div class="flex items-start gap-3">
            <Icon name="lucide:info" class="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div class="text-xs sm:text-sm text-gray-400 space-y-2">
              <p>
                <strong class="text-gray-200">¿Compraste esta fotografía previamente?</strong><br>
                Los enlaces directos de almacenamiento privado caducan tras un periodo por motivos de protección contra descargas no autorizadas.
              </p>
              <p>
                Puedes volver a tu panel de cliente para solicitar una clave de revelado vigente o verificar el estado de tus compras.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full">
          <NuxtLink 
            to="/marketplace" 
            class="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Icon name="lucide:compass" class="w-4 h-4" />
            <span>Explorar Marketplace</span>
          </NuxtLink>

          <NuxtLink 
            to="/dashboard/customer" 
            class="w-full sm:flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Icon name="lucide:shopping-bag" class="w-4 h-4" />
            <span>Mis Fotos Compradas</span>
          </NuxtLink>
        </div>

        <NuxtLink to="/" class="mt-6 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Volver al Inicio de Moments
        </NuxtLink>
      </div>

      <!-- 3. SUCCESS / REVEALED BRIDGE STATE -->
      <div v-else-if="photoData" class="space-y-8 animate-fade-in">
        
        <!-- Top Status Banner -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Fotografía Revelada
              </span>
              <span class="text-xs text-gray-500">•</span>
              <span class="text-xs text-gray-400">Máxima Resolución Original</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {{ photoData.eventTitle || 'Fotografía de Evento' }}
            </h1>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2 self-end sm:self-center">
            <button 
              @click="copyDirectLink" 
              class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
              :title="copied ? '¡Copiado!' : 'Copiar enlace'"
            >
              <Icon :name="copied ? 'lucide:check' : 'lucide:share-2'" class="w-4 h-4" :class="{ 'text-emerald-400': copied }" />
              <span>{{ copied ? '¡Enlace Copiado!' : 'Compartir' }}</span>
            </button>
          </div>
        </div>

        <!-- Main Photo Reveal Canvas -->
        <div class="relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          <!-- Image View Container -->
          <div class="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center max-h-[70vh] min-h-[340px]">
            
            <!-- Photo Render -->
            <img 
              :src="revealedImageUrl" 
              :alt="photoData.eventTitle"
              class="max-h-[70vh] w-auto object-contain transition-all duration-700 ease-out"
              :class="imageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'"
              @load="imageLoaded = true"
              @error="handleImageError"
            />

            <!-- Shimmer Loading Overlay -->
            <div v-if="!imageLoaded" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm">
              <Icon name="lucide:loader-2" class="w-8 h-8 text-indigo-400 animate-spin mb-3" />
              <p class="text-xs text-gray-400 font-medium">Cargando archivo original...</p>
            </div>

            <!-- Quality Badge Tag -->
            <div class="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
              <div class="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/90 flex items-center gap-1.5 shadow-lg">
                <Icon name="lucide:badge-check" class="w-4 h-4 text-indigo-400" />
                <span>Calidad Original de Cámara</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Details & Download Action Card -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          <!-- Photographer & Event Info -->
          <div class="lg:col-span-1 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-3 block">Detalles del Archivo</span>
              
              <!-- Photographer -->
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0 border border-white/20">
                  <img v-if="photoData.photographerAvatar" :src="photoData.photographerAvatar" class="w-full h-full object-cover" />
                  <span v-else>{{ (photoData.photographerName || photoData.photographerUsername || 'M').charAt(0).toUpperCase() }}</span>
                </div>
                <div class="overflow-hidden">
                  <p class="text-sm font-bold text-white truncate">{{ photoData.photographerName || photoData.photographerUsername }}</p>
                  <p class="text-xs text-indigo-400">@{{ photoData.photographerUsername }}</p>
                </div>
              </div>

              <!-- Metadata List -->
              <div class="space-y-2.5 text-xs text-gray-300 border-t border-white/5 pt-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Nombre del archivo:</span>
                  <span class="font-mono text-gray-200 truncate max-w-[160px]">{{ photoData.filename || 'Moments_Original.jpg' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Formato:</span>
                  <span class="uppercase font-semibold text-gray-200">{{ photoData.extension?.replace('.', '') || 'Original' }}</span>
                </div>
                <div v-if="photoData.createdAt" class="flex items-center justify-between">
                  <span class="text-gray-500">Fecha de captura:</span>
                  <span>{{ formatDate(photoData.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- View Event Link -->
            <NuxtLink 
              v-if="photoData.eventUuid || photoData.eventId"
              :to="`/marketplace/events/${photoData.eventUuid || photoData.eventId}`" 
              class="mt-4 pt-3 border-t border-white/5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group"
            >
              <span>Ver todas las fotos del evento</span>
              <Icon name="lucide:arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>

          <!-- Download Action Area -->
          <div class="lg:col-span-2 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/40 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div class="flex items-center gap-2 text-indigo-400 mb-2">
                <Icon name="lucide:shield-check" class="w-5 h-5 text-indigo-400" />
                <span class="text-xs font-bold uppercase tracking-wider">Descarga Oficial y Segura</span>
              </div>
              <h2 class="text-xl font-bold text-white mb-2">Tu fotografía está lista para guardar</h2>
              <p class="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
                Este archivo contiene la imagen original sin compresión adicional ni marcas de agua. Haz clic abajo para iniciar la descarga directamente en tu dispositivo.
              </p>
            </div>

            <!-- Primary Download Button -->
            <div class="space-y-3">
              <button 
                v-if="photoData.canDownload || photoData.downloadUrl"
                @click="triggerDownload" 
                :disabled="isDownloading"
                class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:via-indigo-500 hover:to-violet-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Icon v-if="isDownloading" name="lucide:loader-2" class="w-6 h-6 animate-spin" />
                <Icon v-else-if="downloadComplete" name="lucide:check-circle-2" class="w-6 h-6 text-emerald-300" />
                <Icon v-else name="lucide:download" class="w-6 h-6" />
                
                <span>
                  {{ isDownloading ? 'Guardando Fotografía...' : (downloadComplete ? '¡Descarga Iniciada!' : 'Descargar Fotografía en Alta Calidad') }}
                </span>
              </button>

              <!-- Not Authorized / Needs Purchase -->
              <div v-else class="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p class="text-xs text-amber-300 mb-3">
                  Para descargar esta fotografía original en alta calidad debes adquirirla o iniciar sesión con la cuenta compradora.
                </p>
                <NuxtLink 
                  :to="`/marketplace/events/${photoData.eventUuid || photoData.eventId}`"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg transition-all"
                >
                  <Icon name="lucide:shopping-cart" class="w-4 h-4" />
                  <span>Comprar Fotografía</span>
                </NuxtLink>
              </div>

              <!-- Extra Tip -->
              <p class="text-[11px] text-gray-500 text-center">
                El archivo se guardará automáticamente en tu carpeta de descargas o galería.
              </p>
            </div>
          </div>
        </div>

      </div>

    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/5 py-6 text-center text-xs text-gray-600">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Moments App. Todos los derechos reservados.</p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/terms" class="hover:text-gray-400 transition-colors">Términos</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-gray-400 transition-colors">Privacidad</NuxtLink>
          <NuxtLink to="/marketplace" class="hover:text-gray-400 transition-colors">Marketplace</NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePhotosStore } from '~/stores/photos'
import confetti from 'canvas-confetti'

const route = useRoute()
const router = useRouter()
const photosStore = usePhotosStore()

const isLoading = ref(true)
const notFound = ref(false)
const errorMessage = ref('')
const photoData = ref(null)
const imageLoaded = ref(false)
const isDownloading = ref(false)
const downloadComplete = ref(false)
const copied = ref(false)

const revealedImageUrl = computed(() => {
  return photoData.value?.downloadUrl || photoData.value?.previewUrl || ''
})

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

async function loadPhotoInfo() {
  isLoading.value = true
  errorMessage.value = ''
  notFound.value = false

  try {
    // 1. Identify the search target from route param or query parameters
    const paramId = route.params.id
    const queryUrl = route.query.url
    const queryTarget = route.query.target
    const queryPhotoId = route.query.photoId

    const target = queryUrl || queryTarget || queryPhotoId || paramId

    if (!target) {
      notFound.value = true
      errorMessage.value = 'No se especificó ninguna fotografía para descargar.'
      isLoading.value = false
      return
    }

    // 2. If it's a numeric ID, call getDownloadInfo directly
    if (/^\d+$/.test(target)) {
      try {
        const info = await photosStore.getDownloadInfo(target)
        if (info) {
          photoData.value = info
          checkUrlValidity(info.downloadUrl)
          return
        }
      } catch (err) {
        if (err?.response?.status === 404 || err?.status === 404 || err?.data?.error) {
          notFound.value = true
          errorMessage.value = err?.data?.error || err?.data?.message || 'Recurso no encontrado. La fotografía ya no existe o fue eliminada por el fotógrafo.'
          return
        }
      }
    }

    // 3. Otherwise, use resolveDownload which handles full URLs, R2 keys, or UUIDs
    try {
      const resolved = await photosStore.resolveDownload(target)
      if (resolved) {
        photoData.value = resolved
        checkUrlValidity(resolved.downloadUrl)
        return
      }
    } catch (err) {
      if (err?.response?.status === 404 || err?.status === 404 || err?.data?.error) {
        notFound.value = true
        errorMessage.value = err?.data?.error || err?.data?.message || 'Recurso no encontrado. La fotografía especificada no existe o fue eliminada.'
        return
      }
    }

    // 4. If queryUrl was passed directly, try verifying it as a direct link
    if (queryUrl && typeof queryUrl === 'string') {
      const isValid = await verifyDirectUrl(queryUrl)
      if (isValid) {
        photoData.value = {
          downloadUrl: queryUrl,
          previewUrl: queryUrl,
          eventTitle: 'Fotografía Revelada',
          filename: 'Moments_foto_original.jpg',
          canDownload: true
        }
        return
      } else {
        notFound.value = true
        errorMessage.value = 'El enlace de la fotografía ha caducado o el recurso fue retirado de almacenamiento.'
        return
      }
    }

    notFound.value = true
    errorMessage.value = 'Recurso no encontrado. La fotografía no está disponible.'

  } catch (globalErr) {
    notFound.value = true
    errorMessage.value = globalErr?.data?.error || globalErr?.message || 'No fue posible cargar la información de descarga.'
  } finally {
    isLoading.value = false
  }
}

async function verifyDirectUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

async function checkUrlValidity(downloadUrl) {
  if (!downloadUrl) return
  try {
    // Silently test HEAD on the presigned URL
    const res = await fetch(downloadUrl, { method: 'HEAD' })
    if (!res.ok && (res.status === 403 || res.status === 404)) {
      notFound.value = true
      errorMessage.value = 'El enlace de descarga ha caducado o el archivo original fue eliminado por el fotógrafo.'
    }
  } catch {
    // CORS or network might prevent HEAD, fallback to normal rendering
  }
}

function handleImageError() {
  imageLoaded.value = true
  notFound.value = true
  errorMessage.value = 'Recurso no encontrado. El archivo de la fotografía no está accesible o fue eliminado.'
}

async function triggerDownload() {
  const url = photoData.value?.downloadUrl
  if (!url) return

  isDownloading.value = true
  downloadComplete.value = false

  try {
    const filename = photoData.value?.filename || 'Moments_Fotografia_Original.jpg'

    // Try high-quality Blob stream first
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`)
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)

    downloadComplete.value = true

    // Confetti Celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      })
    } catch {}

  } catch (e) {
    console.warn('Blob fetch failed, falling back to direct navigation trigger:', e)
    // Fallback: direct window anchor
    const link = document.createElement('a')
    link.href = url
    link.download = photoData.value?.filename || 'Moments_Foto.jpg'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    downloadComplete.value = true
  } finally {
    isDownloading.value = false
    setTimeout(() => {
      downloadComplete.value = false
    }, 4000)
  }
}

function copyDirectLink() {
  if (typeof window === 'undefined') return
  const currentUrl = window.location.href
  navigator.clipboard.writeText(currentUrl).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  })
}

onMounted(() => {
  loadPhotoInfo()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
