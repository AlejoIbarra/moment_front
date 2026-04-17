<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Event Header -->
    <div class="mb-8 border-b border-gray-100 pb-8">
      <div class="flex items-center gap-4 mb-6">
        <button @click="$router.push('/dashboard/photographer')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Icon name="lucide:arrow-left" class="w-6 h-6 text-gray-800" />
        </button>
        <h2 class="text-2xl font-bold text-gray-900" v-if="event">{{ event.title }}</h2>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-wrap gap-6 text-sm">
          <div class="flex items-center gap-2 text-gray-500">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            <span class="font-medium text-gray-900">{{ event?.date }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <Icon name="lucide:map-pin" class="w-4 h-4" />
            <span class="font-medium text-gray-900">{{ event?.location }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <Icon name="lucide:image" class="w-4 h-4" />
            <span class="font-medium text-gray-900">{{ photos.length }} fotos</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
           <button @click="deleteEvent" class="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all text-sm">
             Eliminar Evento
           </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- TABS: Fotos | Paquetes                     -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="flex border-b border-gray-200 mb-8">
      <button
        v-for="tab in ['photos', 'packages']"
        :key="tab"
        :class="['flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors',
                  activeTab === tab ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600']"
        @click="activeTab = tab"
      >
        <Icon :name="tab === 'photos' ? 'lucide:image' : 'lucide:package'" class="w-4 h-4" />
        {{ tab === 'photos' ? 'Fotos' : 'Paquetes' }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- TAB: FOTOS (Upload + Gallery)              -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeTab === 'photos'">
      <!-- Upload Section -->
      <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-10">
        <div class="p-6 md:p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-900">Subir Fotos</h3>
            <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Precio Base</span>
              <div class="flex items-center gap-1">
                <span class="text-sm font-bold text-gray-900">$</span>
                <input type="number" v-model="defaultPrice" step="100" min="0"
                       class="w-20 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 p-0 text-right">
                <span class="text-xs text-gray-400">COP</span>
              </div>
            </div>
          </div>

          <!-- Dropzone -->
          <div
            class="group relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @click="$refs.fileInput.click()"
          >
            <div class="flex flex-col items-center">
              <div class="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon name="lucide:cloud-upload" class="w-7 h-7 text-indigo-600" />
              </div>
              <p class="text-gray-900 font-bold mb-1">Arrastra y suelta tus fotos aquí</p>
              <p class="text-gray-400 text-xs">JPG o PNG en alta resolución</p>
            </div>
            <input type="file" class="hidden" multiple accept="image/jpeg, image/png" ref="fileInput" @change="handleFileSelect">
          </div>

          <!-- Preview Grid (Thumbnails) -->
          <div v-if="selectedFiles.length > 0" class="mt-6">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm font-bold text-gray-900">{{ selectedFiles.length }} fotos seleccionadas</p>
              <button @click="clearFiles" class="text-xs text-red-500 hover:text-red-600 font-semibold">Limpiar todo</button>
            </div>

            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              <div v-for="(file, index) in selectedFiles" :key="index"
                   class="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <!-- Thumbnail Preview -->
                <img :src="filePreviews[index]" class="w-full h-full object-cover" v-if="filePreviews[index]" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="lucide:image" class="w-6 h-6 text-gray-300" />
                </div>

                <!-- Status Overlay -->
                <div v-if="uploadStatus[index] === 'uploading'"
                     class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
                <div v-else-if="uploadStatus[index] === 'done'"
                     class="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <Icon name="lucide:check-circle" class="w-8 h-8 text-green-600" />
                </div>
                <div v-else-if="uploadStatus[index] === 'error'"
                     class="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <Icon name="lucide:x-circle" class="w-8 h-8 text-red-600" />
                </div>

                <!-- Delete Button -->
                <button v-if="!uploadStatus[index]"
                        @click.stop="removeFile(index)"
                        class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                  <Icon name="lucide:x" class="w-3 h-3" />
                </button>

                <!-- Filename -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-[9px] text-white font-medium truncate">{{ file.name }}</p>
                </div>
              </div>
            </div>

            <button v-if="!isUploading" @click="uploadFiles"
                    class="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Icon name="lucide:upload" class="w-5 h-5" />
              Subir {{ selectedFiles.length }} foto{{ selectedFiles.length > 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Galería del Evento</h3>
        </div>

        <div v-if="photos.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="lucide:image-off" class="w-12 h-12 text-gray-200 mb-4" />
          <p class="text-gray-400 font-medium">Aún no hay fotos en este evento.</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
          <div v-for="photo in photos" :key="photo.id" class="group relative aspect-square bg-gray-100 overflow-hidden md:rounded-xl">
            <!-- Processing Overlay -->
            <div v-if="photo.watermarkedR2Url === 'PROCESSING'" class="absolute inset-0 z-10 bg-gray-100 flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Procesando</span>
            </div>

            <img v-else :src="photo.watermarkedR2Url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">

            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div class="flex items-center gap-6 text-white">
                <div class="flex flex-col items-center">
                  <span class="text-xl font-bold">${{ formatPrice(photo.price) }}</span>
                  <span class="text-[10px] uppercase font-bold tracking-widest opacity-80">COP</span>
                </div>
                <div class="flex flex-col gap-2">
                  <button @click.stop="setAsCover(photo)"
                          :class="['w-10 h-10 rounded-full flex items-center justify-center transition-all',
                                   isCover(photo) ? 'bg-yellow-400 text-white' : 'bg-white/20 backdrop-blur-md hover:bg-yellow-400 hover:text-white']">
                    <Icon :name="isCover(photo) ? 'lucide:star' : 'lucide:image'" class="w-5 h-5" />
                  </button>
                  <button @click.stop="deletePhoto(photo.id)"
                          class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Cover Badge -->
            <div v-if="isCover(photo)" class="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg z-20">
              Portada
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- TAB: PAQUETES                              -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeTab === 'packages'">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">Paquetes para este Evento</h3>
        <button @click="showPackageModal = true" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-md">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Crear Paquete
        </button>
      </div>

      <!-- Packages Grid -->
      <div v-if="eventPackages.length === 0" class="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div class="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
          <Icon name="lucide:package" class="w-8 h-8 text-gray-400" />
        </div>
        <h4 class="text-lg font-bold text-gray-900 mb-2">Sin paquetes</h4>
        <p class="text-gray-500 text-sm mb-4 max-w-xs">Crea ofertas especiales para tus clientes. Ejemplo: 3 fotos por $10.000</p>
        <button @click="showPackageModal = true" class="text-indigo-600 font-bold text-sm hover:text-indigo-700">
          + Crear mi primer paquete
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="pkg in eventPackages" :key="pkg.id"
             class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
          <!-- Header with photo count -->
          <div class="p-5 pb-0 flex items-start justify-between">
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none">{{ pkg.photoCount }}</span>
              <span class="text-sm font-semibold text-gray-500">{{ pkg.photoCount === 1 ? 'foto' : 'fotos' }}</span>
            </div>
            <div class="flex gap-1">
              <button @click="editPackage(pkg)" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                <Icon name="lucide:pencil" class="w-4 h-4" />
              </button>
              <button @click="confirmDeletePackage(pkg)" class="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <!-- Body -->
          <div class="p-5">
            <h4 class="text-base font-bold text-gray-900 mb-1">{{ pkg.name }}</h4>
            <p v-if="pkg.description" class="text-sm text-gray-500 mb-3">{{ pkg.description }}</p>
          </div>
          <!-- Price Footer -->
          <div class="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black text-gray-900">${{ formatPrice(pkg.price) }}</span>
              <span class="text-xs font-bold text-gray-400">COP</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MODAL: Crear / Editar Paquete              -->
    <!-- ═══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showPackageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">{{ editingPkg ? 'Editar Paquete' : 'Crear Paquete' }}</h3>
            <button @click="closePackageModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="lucide:x" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="savePackage" class="p-6 space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Nombre</label>
              <input v-model="pkgForm.name" type="text" required placeholder='Ej: "Pack Premium"'
                     class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Cantidad de Fotos</label>
                <input v-model.number="pkgForm.photoCount" type="number" min="1" required
                       class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Precio (COP)</label>
                <input v-model.number="pkgForm.price" type="number" min="0" step="100" required
                       class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Descripción (opcional)</label>
              <textarea v-model="pkgForm.description" rows="2" placeholder="Describe la oferta..."
                        class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <!-- Live Preview -->
            <div class="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-dashed border-indigo-300 text-center">
              <div class="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
                {{ pkgForm.photoCount || 0 }} {{ (pkgForm.photoCount || 0) === 1 ? 'foto' : 'fotos' }}
              </div>
              <div class="text-base font-bold text-gray-900">{{ pkgForm.name || '...' }}</div>
              <div class="text-2xl font-black text-indigo-600 mt-1">${{ formatPrice(pkgForm.price) }} <span class="text-xs font-semibold text-gray-400">COP</span></div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="closePackageModal"
                      class="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
                Cancelar
              </button>
              <button type="submit"
                      class="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                {{ editingPkg ? 'Guardar' : 'Crear Paquete' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useEventsStore } from '~/stores/events'
import { usePhotosStore } from '~/stores/photos'
import { usePackagesStore } from '~/stores/packages'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()
const packagesStore = usePackagesStore()

const eventId = route.params.id
const event = ref(null)
const activeTab = ref('photos')

const defaultPrice = ref(5000)
const selectedFiles = ref([])
const filePreviews = ref([])
const uploadStatus = ref([])
const isUploading = ref(false)

// Packages
const showPackageModal = ref(false)
const editingPkg = ref(null)
const pkgForm = ref({
  name: '',
  photoCount: 1,
  price: 5000,
  description: ''
})

onMounted(async () => {
    if (!authStore.isPhotographer) {
        router.push('/')
        return
    }
    await fetchEvent()
    await fetchPhotos()
    await packagesStore.fetchPackagesForEvent(eventId)
})

const photos = computed(() => photosStore.eventPhotos)
const eventPackages = computed(() => packagesStore.eventPackages)

async function fetchEvent() {
    event.value = await eventsStore.fetchEventById(eventId)
}

async function fetchPhotos() {
    await photosStore.fetchPhotosByEvent(eventId)
}

// ─── File Selection with Preview ────────────────────────────────
function handleFileSelect(e) {
    addFiles(Array.from(e.target.files))
}

function handleDrop(e) {
    if (e.dataTransfer.files) {
        addFiles(Array.from(e.dataTransfer.files))
    }
}

function addFiles(files) {
    const validFiles = files.filter(f => f.type.startsWith('image/'))
    selectedFiles.value = [...selectedFiles.value, ...validFiles]
    uploadStatus.value = new Array(selectedFiles.value.length).fill(null)

    // Generate thumbnail previews
    generatePreviews()
}

function generatePreviews() {
    filePreviews.value = []
    for (const file of selectedFiles.value) {
        const url = URL.createObjectURL(file)
        filePreviews.value.push(url)
    }
}

function removeFile(index) {
    // Revoke old preview URL
    if (filePreviews.value[index]) {
        URL.revokeObjectURL(filePreviews.value[index])
    }
    selectedFiles.value.splice(index, 1)
    uploadStatus.value.splice(index, 1)
    filePreviews.value.splice(index, 1)
}

function clearFiles() {
    filePreviews.value.forEach(url => URL.revokeObjectURL(url))
    selectedFiles.value = []
    uploadStatus.value = []
    filePreviews.value = []
}

// ─── Upload ─────────────────────────────────────────────────────
async function uploadFiles() {
    if (selectedFiles.value.length === 0) return
    isUploading.value = true

    for (let i = 0; i < selectedFiles.value.length; i++) {
        if (uploadStatus.value[i]) continue

        const file = selectedFiles.value[i]
        uploadStatus.value[i] = 'uploading'

        try {
            const result = await photosStore.uploadPhoto(eventId, file, defaultPrice.value)
            if (result) {
                uploadStatus.value[i] = 'done'
            } else {
                uploadStatus.value[i] = 'error'
            }
        } catch (e) {
            console.error(e)
            uploadStatus.value[i] = 'error'
        }
    }

    isUploading.value = false
    await fetchPhotos()

    // Cleanup successfully uploaded files after 1.5s
    setTimeout(() => {
        const newFiles = []
        const newStatus = []
        const newPreviews = []
        for (let i = 0; i < selectedFiles.value.length; i++) {
            if (uploadStatus.value[i] === 'error') {
                newFiles.push(selectedFiles.value[i])
                newStatus.push(uploadStatus.value[i])
                newPreviews.push(filePreviews.value[i])
            } else if (filePreviews.value[i]) {
                URL.revokeObjectURL(filePreviews.value[i])
            }
        }
        selectedFiles.value = newFiles
        uploadStatus.value = newStatus
        filePreviews.value = newPreviews
    }, 1500)
}

// ─── Photo Actions ──────────────────────────────────────────────
async function deletePhoto(photoId) {
    if (!confirm('¿Eliminar esta foto?')) return
    const success = await photosStore.deletePhoto(photoId)
    if (success) {
        await fetchPhotos()
    } else {
        alert('Error al eliminar la foto')
    }
}

async function deleteEvent() {
    if (!confirm('¿Eliminar este evento y todas sus fotos?')) return
    try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/events/${eventId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        router.push('/dashboard/photographer')
    } catch (e) {
        console.error(e)
        alert('Error al eliminar el evento')
    }
}

function isCover(photo) {
    return event.value?.coverPhotoUrl === photo.watermarkedR2Url
}

async function setAsCover(photo) {
    try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/events/${eventId}/cover-photo`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photo.watermarkedR2Url)
        })
        event.value.coverPhotoUrl = photo.watermarkedR2Url
    } catch (e) {
        console.error(e)
        alert('Error al establecer foto de portada')
    }
}

// ─── Package Methods ────────────────────────────────────────────
function editPackage(pkg) {
    editingPkg.value = pkg
    pkgForm.value = {
        name: pkg.name,
        photoCount: pkg.photoCount,
        price: pkg.price || 0,
        description: pkg.description || ''
    }
    showPackageModal.value = true
}

function closePackageModal() {
    showPackageModal.value = false
    editingPkg.value = null
    pkgForm.value = { name: '', photoCount: 1, price: 5000, description: '' }
}

async function savePackage() {
    try {
        const data = { ...pkgForm.value, eventId: Number(eventId) }
        if (editingPkg.value) {
            const result = await packagesStore.updatePackage(editingPkg.value.id, data)
            if (!result) { alert('Error al actualizar'); return }
        } else {
            const result = await packagesStore.createPackage(data)
            if (!result) { alert('Error al crear paquete'); return }
        }
        closePackageModal()
        await packagesStore.fetchPackagesForEvent(eventId)
    } catch (e) {
        console.error(e)
    }
}

async function confirmDeletePackage(pkg) {
    if (!confirm(`¿Eliminar el paquete "${pkg.name}"?`)) return
    await packagesStore.deletePackage(pkg.id)
    await packagesStore.fetchPackagesForEvent(eventId)
}

function formatPrice(price) {
    if (!price && price !== 0) return '0'
    return Number(price).toLocaleString('es-CO')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
