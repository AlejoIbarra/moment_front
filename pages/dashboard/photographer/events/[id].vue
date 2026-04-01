<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Event Header (Instagram Style) -->
    <div class="mb-12 border-b border-gray-100 pb-8 px-4">
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
            <span class="font-medium text-gray-900">{{ photos.length }} photos</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
           <button class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-all text-sm">
             Edit Event
           </button>
           <button @click="deleteEvent" class="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all text-sm">
             Delete
           </button>
        </div>
      </div>
    </div>

    <!-- Upload Section (Premium Box) -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-12">
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
           <h3 class="text-lg font-bold text-gray-900">Upload New Photos</h3>
           <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Base Price</span>
              <div class="flex items-center gap-1">
                <span class="text-sm font-bold text-gray-900">$</span>
                <input type="number" v-model="defaultPrice" step="0.01" 
                       class="w-16 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 p-0">
              </div>
           </div>
        </div>

        <div 
           class="group relative border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
           @drop.prevent="handleDrop"
           @dragover.prevent
           @click="$refs.fileInput.click()"
        >
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Icon name="lucide:cloud-upload" class="w-8 h-8 text-indigo-600" />
            </div>
            <p class="text-gray-900 font-bold mb-1">Drag and drop your shots here</p>
            <p class="text-gray-400 text-xs">High resolution JPG or PNG only</p>
          </div>
          <input type="file" class="hidden" multiple accept="image/jpeg, image/png" ref="fileInput" @change="handleFileSelect">
        </div>

        <!-- Pre-upload list -->
        <div v-if="selectedFiles.length > 0" class="mt-8 space-y-3">
          <div v-for="(file, index) in selectedFiles" :key="index" 
               class="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
            <div class="flex items-center gap-3">
               <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Icon name="lucide:image" class="w-5 h-5 text-gray-400" />
               </div>
               <div>
                 <p class="text-sm font-bold text-gray-900 line-clamp-1">{{ file.name }}</p>
                 <p class="text-[10px] uppercase font-bold text-indigo-600 tracking-widest mt-0.5">
                   <template v-if="uploadStatus[index] === 'uploading'">Uploading...</template>
                   <template v-else-if="uploadStatus[index] === 'done'">Completed</template>
                   <template v-else-if="uploadStatus[index] === 'error'">Failed</template>
                   <template v-else>Ready</template>
                 </p>
               </div>
            </div>
            <button v-if="!uploadStatus[index]" @click.stop="removeFile(index)" class="text-gray-400 hover:text-red-500">
              <Icon name="lucide:trash-2" class="w-5 h-5" />
            </button>
          </div>

          <div class="pt-4" v-if="!isUploading">
             <button @click="uploadFiles" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98]">
               Share to Feed
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Grid (Instagram Style) -->
    <div>
      <div class="flex items-center justify-between mb-8 px-4">
        <h3 class="text-xl font-bold text-gray-900">Event Gallery</h3>
        <div class="flex gap-4">
          <button class="text-gray-400 p-2 hover:text-gray-900 transition-colors"><Icon name="lucide:grid" class="w-5 h-5" /></button>
          <button class="text-gray-400 p-2 hover:text-gray-900 transition-colors"><Icon name="lucide:list" class="w-5 h-5" /></button>
        </div>
      </div>

      <div v-if="photos.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <Icon name="lucide:image-off" class="w-12 h-12 text-gray-200 mb-4" />
        <p class="text-gray-400 font-medium">No photos published yet for this event.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-8 hover:cursor-pointer">
        <div v-for="photo in photos" :key="photo.id" class="group relative aspect-square bg-gray-100 overflow-hidden md:rounded-2xl">
           <!-- Processing Overlay -->
           <div v-if="photo.watermarkedR2Url === 'PROCESSING'" class="absolute inset-0 z-10 bg-gray-100 flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processing</span>
           </div>
           
           <img v-else :src="photo.watermarkedR2Url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
           
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div class="flex items-center gap-6 text-white">
                <div class="flex flex-col items-center">
                   <span class="text-xl font-bold">${{ photo.price.toFixed(2) }}</span>
                   <span class="text-[10px] uppercase font-bold tracking-widest opacity-80">Sale Price</span>
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
            <div v-if="isCover(photo)" class="absolute top-4 left-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg z-20">
                Cover Photo
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEventsStore } from '~/stores/events'
import { usePhotosStore } from '~/stores/photos'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()

const eventId = route.params.id
const event = ref(null)

const defaultPrice = ref(5.00)
const selectedFiles = ref([])
const uploadStatus = ref([])
const isUploading = ref(false)

onMounted(async () => {
    if (!authStore.isPhotographer) {
        router.push('/')
        return
    }
    await fetchEvent()
    await fetchPhotos()
})

const photos = computed(() => photosStore.eventPhotos)

async function fetchEvent() {
    event.value = await eventsStore.fetchEventById(eventId)
}

async function fetchPhotos() {
    await photosStore.fetchPhotosByEvent(eventId)
}

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
}

function removeFile(index) {
    selectedFiles.value.splice(index, 1)
    uploadStatus.value.splice(index, 1)
}

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
    
    // Cleanup successfully uploaded files
    const newFiles = []
    const newStatus = []
    for(let i=0; i<selectedFiles.value.length; i++) {
        if (uploadStatus.value[i] === 'error') {
            newFiles.push(selectedFiles.value[i])
            newStatus.push(uploadStatus.value[i])
        }
    }
    selectedFiles.value = newFiles
    uploadStatus.value = newStatus
}

async function deletePhoto(photoId) {
    if (!confirm('Are you sure you want to delete this photo?')) return
    const success = await photosStore.deletePhoto(photoId)
    if (success) {
        await fetchPhotos()
    } else {
        alert('Failed to delete photo')
    }
}

async function deleteEvent() {
    if (!confirm('Are you sure you want to delete this event? This will also delete all photos.')) return
    try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/events/${eventId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        router.push('/dashboard/photographer')
    } catch (e) {
        console.error(e)
        alert('Failed to delete event')
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
        alert('Cover photo set successfully!')
    } catch (e) {
        console.error(e)
        alert('Failed to set cover photo')
    }
}
</script>
