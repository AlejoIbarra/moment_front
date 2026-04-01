<template>
  <div class="ig-container pt-4 px-4">
    <!-- Breadcrumbs / Back -->
    <div class="mb-6">
      <button @click="router.push('/marketplace')" class="flex items-center text-xs font-semibold text-gray-500 hover:text-[#262626] uppercase tracking-wider">
        <Icon name="lucide:chevron-left" class="h-4 w-4 mr-1" />
        Back to Feed
      </button>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-gray-400" />
    </div>
    
    <div v-else-if="!event" class="text-center py-20 text-gray-500">
        Event not found.
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
             <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Your Balance</p>
             <p class="text-lg font-bold text-indigo-600">${{ walletStore.balance.toFixed(2) }}</p>
           </div>
           <button @click="router.push('/dashboard/customer')" class="ig-btn-primary">Top Up</button>
        </div>
      </div>

      <!-- Description Section -->
      <div class="max-w-2xl">
          <h3 class="text-sm font-bold text-[#262626] uppercase tracking-wider mb-2">About this event</h3>
          <p class="text-gray-600 leading-relaxed">{{ event.description || 'Welcome to the gallery! Browse through the captured moments and purchase your favorites in high resolution.' }}</p>
      </div>

      <!-- Gallery Grid -->
      <div>
        <div class="flex items-center justify-between border-b border-[#dbdbdb] pb-4 mb-8">
            <h2 class="text-sm font-bold text-[#262626] uppercase tracking-[0.2em]">Gallery ({{ photos.length }})</h2>
            <div class="flex space-x-4 text-gray-400">
                <Icon name="lucide:grid" class="h-5 w-5 text-[#262626]" />
                <Icon name="lucide:list" class="h-5 w-5 cursor-not-allowed opacity-30" />
            </div>
        </div>

        <div v-if="pendingPhotos" class="flex justify-center py-12 text-gray-400">
            <Icon name="lucide:loader-2" class="h-6 w-6 animate-spin mr-2" />
            <span>Loading photos...</span>
        </div>
        
        <div v-else-if="photos.length === 0" class="text-center py-20 bg-white border border-dashed border-gray-200 rounded-lg text-gray-400">
            No photos have been uploaded yet.
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="photo in photos" :key="photo.id" class="group bg-white rounded-lg border border-[#dbdbdb] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer" @click="openLightbox(photo)">
            <!-- Photo Wrapper -->
            <div class="aspect-square bg-gray-50 relative overflow-hidden">
                <img :src="photo.watermarkedR2Url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">${{ photo.price.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox & Comments Overlay -->
      <div v-if="selectedPhoto" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" @click.self="closeLightbox">
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
                    <span>Purchase Original</span>
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
                            <button class="text-xs font-bold text-indigo-600 hover:text-indigo-700">Follow</button>
                        </div>

            <!-- Comments Section Component -->
            <CommentSection 
                :comments="comments"
                :is-submitting="postingComment"
                :current-username="authStore.user?.username"
                @submit="postComment"
                @delete="deleteComment"
            />
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
const walletStore = useWalletStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()

const eventId = route.params.id
const event = ref(null)
const isBuying = ref(null)

const selectedPhoto = ref(null)
const comments = ref([])
const loadingComments = ref(false)
const newComment = ref('')
const postingComment = ref(false)

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await walletStore.fetchBalance()
    }
    await fetchEvent()
    await fetchPhotos()
})

const photos = computed(() => photosStore.eventPhotos)
const pending = computed(() => eventsStore.loading)
const pendingPhotos = computed(() => photosStore.loading)

async function fetchEvent() {
    event.value = await eventsStore.fetchEventById(eventId)
}

async function fetchPhotos() {
    await photosStore.fetchPhotosByEvent(eventId)
}

async function buyPhoto(photo) {
    if (walletStore.balance < photo.price) {
        alert('Insufficient balance! Please top up your wallet.')
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
        alert('Purchase successful! You can download your original photo from your dashboard.')
        
        if (res.presignedUrl && confirm('Do you want to download the original photo now?')) {
            window.open(res.presignedUrl, '_blank')
        }
    } catch (e) {
        alert(e.response?._data || 'Purchase failed')
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
        const data = await $fetch(`${config.public.apiBase}/comments/photo/${selectedPhoto.value.id}`)
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
        alert('Failed to post comment')
    } finally {
        postingComment.value = false
    }
}

async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return
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
        alert('Failed to delete comment')
    }
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
