<template>
  <div class="ig-container pt-4 px-4">
    <!-- Breadcrumbs / Back -->
    <div class="mb-6">
      <button @click="router.push('/marketplace')" class="flex items-center text-xs font-semibold text-gray-500 hover:text-[#262626] uppercase tracking-wider">
        <Icon name="lucide:chevron-left" class="h-4 w-4 mr-1" />
        Volver al Feed
      </button>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-gray-400" />
    </div>
    
    <div v-else-if="!event" class="text-center py-20 text-gray-500">
        Evento no encontrado.
    </div>

    <div v-else class="space-y-10 pb-20">
      <!-- Event Header -->
      <div class="ig-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-indigo-50 rounded-full">
            <Icon name="lucide:calendar" class="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-[#262626]">{{ event.title }}</h1>
            <p class="text-sm text-gray-500">{{ event.location }} • {{ event.date }}</p>
          </div>
        </div>
        
        <div v-if="authStore.isAuthenticated && authStore.isCustomer" class="flex items-center space-x-4">
           <div class="text-right">
             <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Tu Saldo</p>
             <p class="text-lg font-bold text-indigo-600">$ {{ walletStore.balance.toFixed(2) }}</p>
           </div>
           <button @click="router.push('/dashboard/customer')" class="ig-btn-primary">Recargar</button>
        </div>
      </div>

      <!-- Description Section -->
      <div class="max-w-2xl">
          <h3 class="text-sm font-bold text-[#262626] uppercase tracking-wider mb-2">Acerca de este evento</h3>
          <p class="text-gray-600 leading-relaxed">{{ event.description || '¡Bienvenido a la galería! Explora los momentos capturados y compra tus favoritos en alta resolución.' }}</p>
      </div>

      <!-- Package Deals Section -->
      <div v-if="authStore.isCustomer && packages.length > 0 && photos.length >= 3">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
            <Icon name="lucide:package" class="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#262626] uppercase tracking-[0.2em]">Paquetes</h3>
            <p class="text-xs text-gray-500">Ahorra más comprando en cantidad</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div v-for="pkg in availablePackages" :key="pkg.id"
            :class="[
              'relative bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl group overflow-hidden',
              selectedPackage?.id === pkg.id ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg' : 'border-gray-200 hover:border-indigo-300'
            ]"
            @click="selectPackage(pkg)">
            
            <!-- Popular badge for middle package -->
            <div v-if="pkg.photoCount === 5" class="absolute -top-0.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-b-lg">
              Más Popular
            </div>

            <!-- Discount badge -->
            <div class="absolute top-3 right-3">
              <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                -{{ pkg.discountPercentage }}%
              </span>
            </div>

            <div class="text-center pt-2">
              <div class="text-3xl mb-2">
                {{ pkg.photoCount === 3 ? '📸' : pkg.photoCount === 5 ? '🎯' : '💎' }}
              </div>
              <h4 class="text-lg font-bold text-gray-900 mb-1">{{ pkg.name }}</h4>
              <p class="text-sm text-gray-500 mb-3">{{ pkg.photoCount }} fotos</p>
              
              <!-- Estimated price -->
              <div v-if="avgPhotoPrice > 0" class="space-y-1">
                <p class="text-xs text-gray-400 line-through">$ {{ (avgPhotoPrice * pkg.photoCount).toFixed(2) }}</p>
                <p class="text-xl font-bold text-indigo-600">$ {{ ((avgPhotoPrice * pkg.photoCount) * (1 - pkg.discountPercentage / 100)).toFixed(2) }}</p>
                <p class="text-[10px] text-green-600 font-semibold">Ahorras $ {{ ((avgPhotoPrice * pkg.photoCount) * (pkg.discountPercentage / 100)).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Selected indicator -->
            <div v-if="selectedPackage?.id === pkg.id" class="mt-4 text-center">
              <span class="text-xs font-bold text-indigo-600 flex items-center justify-center gap-1">
                <Icon name="lucide:check-circle" class="w-4 h-4" />
                Seleccionado — Elige {{ pkg.photoCount }} fotos abajo
              </span>
            </div>
          </div>
        </div>

        <!-- Selection mode banner -->
        <div v-if="selectionMode" class="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Icon name="lucide:mouse-pointer-click" class="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p class="text-sm font-bold text-indigo-900">Selecciona {{ selectedPackage.photoCount }} fotos</p>
              <p class="text-xs text-indigo-600">{{ selectedPhotos.length }} / {{ selectedPackage.photoCount }} seleccionadas</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="cancelSelection" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button 
              @click="purchasePackage"
              :disabled="selectedPhotos.length !== selectedPackage.photoCount || isPurchasingPackage"
              :class="[
                'px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-md',
                selectedPhotos.length === selectedPackage.photoCount 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]">
              {{ isPurchasingPackage ? 'Procesando...' : 'Comprar Paquete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Grid -->
        <div class="flex items-center justify-between border-b border-[#dbdbdb] pb-4 mb-6">
            <h2 class="text-sm font-bold text-[#262626] uppercase tracking-[0.2em]">Galería ({{ displayedPhotos.length }})</h2>
            <div class="flex space-x-4 text-gray-400">
                <Icon name="lucide:grid" class="h-5 w-5 text-[#262626]" />
                <Icon name="lucide:list" class="h-5 w-5 cursor-not-allowed opacity-30" />
            </div>
        </div>

        <!-- Search Widget (Bib number / Face search) -->
        <div class="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1 w-full flex flex-col md:flex-row gap-4">
            <!-- Search by bib number -->
            <div class="flex-1 relative">
              <input
                v-model="bibQuery"
                type="text"
                placeholder="Buscar por número de dorsal (ej. 1203)..."
                class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                @keyup.enter="searchByBib"
              />
              <Icon name="lucide:hash" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                v-if="bibQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                Limpiar
              </button>
            </div>
            
            <button @click="searchByBib" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2">
              <Icon name="lucide:search" class="w-4 h-4" />
              Buscar
            </button>
          </div>
          
          <div class="h-px md:h-10 w-full md:w-px bg-gray-200"></div>
          
          <!-- Search by Face Upload button -->
          <div class="flex-shrink-0 w-full md:w-auto">
            <button @click="triggerFaceSearch" class="w-full cursor-pointer group flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 rounded-xl text-sm font-bold text-gray-700 shadow-sm transition-all">
              <Icon name="lucide:scan-face" class="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              Buscar por Rostro
            </button>
            <input
              ref="faceInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFaceUpload"
            />
          </div>
        </div>

        <div v-if="isSearching" class="mb-6 flex justify-between items-center bg-indigo-50/55 border border-indigo-100 p-4 rounded-xl">
          <p class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <Icon name="lucide:filter-x" class="w-4 h-4 text-indigo-500" />
            Resultados de búsqueda: {{ displayedPhotos.length }} fotos encontradas
          </p>
          <button @click="clearSearch" class="text-xs font-bold text-indigo-600 hover:underline">Mostrar todo</button>
        </div>

        <div v-if="pendingPhotos && photos.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="i in 6" :key="i" class="aspect-square bg-gray-200 animate-pulse rounded-lg border border-gray-100"></div>
        </div>
        
        <div v-else-if="photos.length === 0" class="text-center py-20 bg-white border border-dashed border-gray-200 rounded-lg text-gray-400">
            Aún no se han subido fotos.
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="photo in displayedPhotos" :key="photo.id" 
            :class="[
              'group bg-white rounded-lg border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative',
              selectionMode ? 'ring-2' : 'border-[#dbdbdb]',
              isPhotoSelected(photo.id) ? 'ring-indigo-500 border-indigo-500' : selectionMode ? 'ring-transparent border-[#dbdbdb]' : ''
            ]"
            @click="handlePhotoClick(photo)">

            <!-- Selection checkbox overlay -->
            <div v-if="selectionMode" class="absolute top-3 left-3 z-10">
              <div :class="[
                'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md',
                isPhotoSelected(photo.id) 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white/80 backdrop-blur-sm border-white text-transparent'
              ]">
                <Icon name="lucide:check" class="w-4 h-4" />
              </div>
            </div>

            <!-- Selection number badge -->
            <div v-if="selectionMode && isPhotoSelected(photo.id)" class="absolute top-3 right-3 z-10">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                {{ getSelectionIndex(photo.id) }}
              </span>
            </div>

            <!-- Photo Wrapper -->
            <div class="aspect-square bg-gray-50 relative overflow-hidden">
                <!-- Similarity Match Badge -->
                <div v-if="photo.similarity" class="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md z-10 flex items-center gap-1">
                  <Icon name="lucide:sparkles" class="w-3 h-3 animate-pulse" />
                  {{ (photo.similarity * 100).toFixed(1) }}% Match
                </div>

                <img :src="photo.watermarkedR2Url" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold" :class="{ 'hidden': selectionMode && isPhotoSelected(photo.id) }">$ {{ photo.price.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- Infinite Scroll Sentinel for Photos -->
        <div ref="photosSentinel" class="w-full h-20 flex items-center justify-center mt-8">
            <div v-if="photosStore.loading && photos.length > 0" class="flex items-center text-gray-400">
                <Icon name="lucide:loader-2" class="h-6 w-6 animate-spin mr-2" />
                <span class="text-sm font-medium">Cargando más fotos...</span>
            </div>
        </div>
      </div>

      <!-- Lightbox & Comments Overlay (only when not in selection mode) -->
      <div v-if="selectedPhoto && !selectionMode" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" @click.self="closeLightbox">
        <button @click="closeLightbox" class="absolute top-6 right-6 text-white/70 hover:text-white">
          <Icon name="lucide:x" class="h-8 w-8" />
        </button>

        <div class="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl" @click.stop>
          <!-- Left: Photo View -->
          <div class="flex-1 bg-black flex items-center justify-center relative group">
            <img :src="selectedPhoto.watermarkedR2Url" class="max-w-full max-h-full object-contain" />
            
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button v-if="authStore.isCustomer" @click="buyPhoto(selectedPhoto)" class="bg-white text-[#262626] px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-50 flex items-center space-x-2">
                    <Icon name="lucide:shopping-bag" class="h-5 w-5" />
                    <span>Comprar Original</span>
                </button>
            </div>
          </div>

          <!-- Right: Social & Comments -->
          <div class="w-full md:w-[400px] flex flex-col h-full bg-white border-l border-gray-100">
                        <!-- Photographer Info -->
                        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                     <img v-if="event.photographerProfilePhotoUrl" :src="event.photographerProfilePhotoUrl" alt="Photographer" class="w-full h-full object-cover">
                                     <span v-else class="text-xs font-bold text-indigo-600">{{ event.photographerUsername?.charAt(0).toUpperCase() }}</span>
                                </div>
                                <span class="text-sm font-bold text-gray-900">{{ event.photographerUsername }}</span>
                            </div>
                            <button class="text-xs font-bold text-indigo-600 hover:text-indigo-700">Seguir</button>
                        </div>

            <!-- Like Action -->
            <div class="p-4 border-b border-gray-50 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="handleTogglePhotoLike" class="transition-transform active:scale-90">
                        <Icon 
                          :name="selectedPhoto.isLiked ? 'lucide:heart' : 'lucide:heart'" 
                          :class="['w-7 h-7', selectedPhoto.isLiked ? 'text-red-500 fill-current' : 'text-gray-900']" 
                        />
                    </button>
                    <button @click="focusCommentInput" class="hover:text-gray-500">
                        <Icon name="lucide:message-circle" class="w-7 h-7" />
                    </button>
                    <button class="hover:text-gray-500">
                        <Icon name="lucide:send" class="w-7 h-7" />
                    </button>
                </div>
                <button class="hover:text-gray-500">
                    <Icon name="lucide:bookmark" class="w-7 h-7" />
                </button>
            </div>

            <div class="px-4 py-2 border-b border-gray-50">
                <p class="text-sm font-bold text-gray-900">{{ selectedPhoto.likesCount || 0 }} Me gusta</p>
                <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{{ formatDate(selectedPhoto.createdAt) }}</p>
            </div>

            <!-- Comments Section Component -->
            <CommentSection 
                :comments="comments"
                :is-submitting="postingComment"
                :current-username="authStore.user?.username"
                @submit="postComment"
                @delete="deleteComment"
                @like="handleCommentLike"
            />
          </div>
        </div>
      </div>


    <!-- Face Scanner Animation Modal -->
    <div v-if="scanning" class="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <!-- Preview image -->
        <img v-if="selfiePreview" :src="selfiePreview" class="w-full h-full object-cover opacity-80" />
        
        <!-- Laser line -->
        <div class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-lg shadow-indigo-500/50 animate-laser"></div>
        
        <!-- Grid overlay -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      </div>
      
      <div class="mt-8 text-center max-w-sm">
        <h3 class="text-white font-extrabold text-lg flex items-center justify-center gap-2">
          <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin text-indigo-400" />
          {{ scanStatus }}
        </h3>
        <p class="text-slate-400 text-xs mt-2">Analizando características y rasgos faciales para encontrar tus mejores momentos en el evento...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEventsStore } from '~/stores/events'
import { usePhotosStore } from '~/stores/photos'
import { usePackagesStore } from '~/stores/packages'
import { useIntersectionObserver } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()
const packagesStore = usePackagesStore()
const { confirm } = useConfirm()
const toast = useToast()

const eventId = route.params.id
const event = ref(null)
const isBuying = ref(null)

const photosSentinel = ref(null)

const selectedPhoto = ref(null)
const comments = ref([])
const loadingComments = ref(false)
const newComment = ref('')
const postingComment = ref(false)

// Photo Search by Bib number / Face Image
const bibQuery = ref('')
const isSearching = ref(false)
const searchResults = ref([])
const scanning = ref(false)
const scanStatus = ref('')
const selfiePreview = ref('')
const faceInput = ref(null)

function triggerFaceSearch() {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para usar la búsqueda por rostro.')
    router.push('/login')
    return
  }
  faceInput.value.click()
}

async function searchByBib() {
  if (!bibQuery.value.trim()) {
    clearSearch()
    return
  }
  isSearching.value = true
  photosStore.loading = true
  try {
    const data = await $fetch(`${useRuntimeConfig().public.apiBase}/events/${eventId}/photos/search?bibNumber=${bibQuery.value.trim()}`, {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    })
    searchResults.value = data
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudieron buscar fotos por número.')
    searchResults.value = []
  } finally {
    photosStore.loading = false
  }
}

function clearSearch() {
  bibQuery.value = ''
  isSearching.value = false
  searchResults.value = []
}

async function handleFaceUpload(evt) {
  const file = evt.target.files[0]
  if (!file) return

  // Preview
  selfiePreview.value = URL.createObjectURL(file)
  scanning.value = true
  scanStatus.value = 'Iniciando escáner facial...'

  const steps = [
    { status: 'Buscando rostro...', time: 1000 },
    { status: 'Extrayendo puntos característicos...', time: 2200 },
    { status: 'Comparando con fotos del evento...', time: 3500 },
    { status: '¡Búsqueda finalizada!', time: 4500 }
  ]

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, step.time - (steps[steps.indexOf(step)-1]?.time || 0)))
    scanStatus.value = step.status
  }

  // Now call backend API
  try {
    const formData = new FormData()
    formData.append('file', file)

    const data = await $fetch(`${useRuntimeConfig().public.apiBase}/events/${eventId}/photos/search-by-face`, {
      method: 'POST',
      body: formData,
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    })

    searchResults.value = data.map(item => ({
      ...item.photo,
      similarity: item.similarity
    }))
    isSearching.value = true
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudieron buscar fotos por rostro.')
    searchResults.value = []
    isSearching.value = false
  } finally {
    scanning.value = false
    selfiePreview.value = ''
  }
}

// Package selection state
const selectedPackage = ref(null)
const selectedPhotos = ref([])
const selectionMode = ref(false)
const isPurchasingPackage = ref(false)

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await walletStore.fetchBalance()
    }
    await fetchEvent()
    await photosStore.fetchPhotosByEvent(eventId, 0)
    await packagesStore.fetchPackages()
})

useIntersectionObserver(
    photosSentinel,
    ([{ isIntersecting }]) => {
        if (isIntersecting && photosStore.hasMore && !photosStore.loading) {
            photosStore.fetchPhotosByEvent(eventId, photosStore.currentPage + 1)
        }
    },
    { threshold: 0.5 }
)

const photos = computed(() => photosStore.eventPhotos)
const displayedPhotos = computed(() => {
  if (isSearching.value) {
    return searchResults.value
  }
  return photos.value
})
const pending = computed(() => eventsStore.loading)
const pendingPhotos = computed(() => photosStore.loading)
const packages = computed(() => packagesStore.packages)

// Only show packages where enough photos exist in the event
const availablePackages = computed(() => {
  return packages.value.filter(pkg => photos.value.length >= pkg.photoCount)
})

const avgPhotoPrice = computed(() => {
  if (photos.value.length === 0) return 0
  const total = photos.value.reduce((sum, p) => sum + p.price, 0)
  return total / photos.value.length
})

function selectPackage(pkg) {
  if (selectedPackage.value?.id === pkg.id) {
    cancelSelection()
    return
  }
  selectedPackage.value = pkg
  selectedPhotos.value = []
  selectionMode.value = true
}

function cancelSelection() {
  selectedPackage.value = null
  selectedPhotos.value = []
  selectionMode.value = false
}

function isPhotoSelected(photoId) {
  return selectedPhotos.value.includes(photoId)
}

function getSelectionIndex(photoId) {
  return selectedPhotos.value.indexOf(photoId) + 1
}

function handlePhotoClick(photo) {
  if (selectionMode.value) {
    togglePhotoSelection(photo.id)
  } else {
    openLightbox(photo)
  }
}

function togglePhotoSelection(photoId) {
  const index = selectedPhotos.value.indexOf(photoId)
  if (index > -1) {
    selectedPhotos.value.splice(index, 1)
  } else if (selectedPhotos.value.length < selectedPackage.value.photoCount) {
    selectedPhotos.value.push(photoId)
  }
}

async function purchasePackage() {
  if (!selectedPackage.value || selectedPhotos.value.length !== selectedPackage.value.photoCount) return

  isPurchasingPackage.value = true
  try {
    const result = await packagesStore.buyPackage(
      selectedPackage.value.id,
      parseInt(eventId),
      selectedPhotos.value
    )

    await walletStore.fetchBalance()
    
    const downloadNow = await confirm({
      title: '¡Compra exitosa!',
      message: `🎉 ${result.message}\nTotal: $${result.totalPaid}\n¿Quieres descargar tus fotos ahora?`,
      confirmText: 'Descargar ahora',
      cancelText: 'Después'
    })
 
    if (downloadNow && result.presignedUrls) {
      result.presignedUrls.forEach(url => window.open(url, '_blank'))
    }

    cancelSelection()
  } catch (e) {
    toast.error('Error de compra', e.response?._data || 'La compra del paquete falló')
  } finally {
    isPurchasingPackage.value = false
  }
}

async function fetchEvent() {
    event.value = await eventsStore.fetchEventById(eventId)
}

async function buyPhoto(photo) {
    if (walletStore.balance < photo.price) {
        toast.warning('Saldo insuficiente', 'Por favor recarga tu billetera.')
        return
    }

    isBuying.value = photo.id
    try {
        const config = useRuntimeConfig()
        const res = await $fetch(`${config.public.apiBase}/payment/buy`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            },
            body: {
                photoId: photo.id
            }
        })
        
        await walletStore.fetchBalance()
        toast.success('¡Compra exitosa!', 'Puedes descargar tu foto original desde tu panel.')
        
        const downloadNow = await confirm({
            title: '¡Compra exitosa!',
            message: '¿Quieres descargar la foto original ahora?',
            confirmText: 'Descargar',
            cancelText: 'Después'
        })
        if (downloadNow && res.presignedUrl) {
            window.open(res.presignedUrl, '_blank')
        }
    } catch (e) {
        toast.error('Error', e.response?._data || 'La compra falló')
        isBuying.value = null
    }
}

async function openLightbox(photo) {
    selectedPhoto.value = photo
    document.body.style.overflow = 'hidden'
    await fetchComments()
}

function closeLightbox() {
    selectedPhoto.value = null
    document.body.style.overflow = ''
}

async function fetchComments() {
    if (!selectedPhoto.value) return
    loadingComments.value = true
    try {
        const config = useRuntimeConfig()
        const headers = authStore.isAuthenticated ? { Authorization: `Bearer ${authStore.token}` } : {}
        const data = await $fetch(`${config.public.apiBase}/comments/photo/${selectedPhoto.value.id}`, {
            headers
        })
        comments.value = data
    } catch (e) {
        console.error('Error fetching comments:', e)
    } finally {
        loadingComments.value = false
    }
}

async function postComment(content) {
    if (!content || postingComment.value) return
    postingComment.value = true
    try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/comments/photo/${selectedPhoto.value.id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            },
            body: content
        })
        comments.value.unshift(data)
    } catch (e) {
        toast.error('Error', 'Error al publicar comentario')
    } finally {
        postingComment.value = false
    }
}

async function deleteComment(commentId) {
    const ok = await confirm({
        title: '¿Eliminar comentario?',
        message: '¿Estás seguro de que quieres eliminar este comentario?'
    })
    if (ok) {
        try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        comments.value = comments.value.filter(c => c.id !== commentId)
    } catch (e) {
        toast.error('Error', 'Error al eliminar comentario')
    }
  }
}

async function handleCommentLike(commentId) {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    const res = await eventsStore.toggleCommentLike(commentId)
    if (res) {
        const comment = comments.value.find(c => c.id === commentId)
        if (comment) {
            comment.isLiked = res.isLiked
            comment.likesCount = res.likesCount
        }
    }
}

async function handleTogglePhotoLike() {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    const res = await photosStore.toggleLike(selectedPhoto.value.id)
    if (res) {
        selectedPhoto.value.isLiked = res.liked
        selectedPhoto.value.likesCount = res.likesCount
    }
}

function focusCommentInput() {
    // This will depend on implementation of CommentSection, but for now just a placeholder
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
@keyframes laser {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
.animate-laser {
  animation: laser 3s infinite linear;
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
