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

      <!-- Package Deals Section -->
      <div v-if="authStore.isCustomer && packages.length > 0 && photos.length >= 3">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
            <Icon name="lucide:package" class="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#262626] uppercase tracking-[0.2em]">Bundle Deals</h3>
            <p class="text-xs text-gray-500">Save more when you buy in bulk</p>
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
              Most Popular
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
              <p class="text-sm text-gray-500 mb-3">{{ pkg.photoCount }} photos</p>
              
              <!-- Estimated price -->
              <div v-if="avgPhotoPrice > 0" class="space-y-1">
                <p class="text-xs text-gray-400 line-through">${{ (avgPhotoPrice * pkg.photoCount).toFixed(2) }}</p>
                <p class="text-xl font-bold text-indigo-600">${{ ((avgPhotoPrice * pkg.photoCount) * (1 - pkg.discountPercentage / 100)).toFixed(2) }}</p>
                <p class="text-[10px] text-green-600 font-semibold">You save ${{ ((avgPhotoPrice * pkg.photoCount) * (pkg.discountPercentage / 100)).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Selected indicator -->
            <div v-if="selectedPackage?.id === pkg.id" class="mt-4 text-center">
              <span class="text-xs font-bold text-indigo-600 flex items-center justify-center gap-1">
                <Icon name="lucide:check-circle" class="w-4 h-4" />
                Selected — Choose {{ pkg.photoCount }} photos below
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
              <p class="text-sm font-bold text-indigo-900">Select {{ selectedPackage.photoCount }} photos</p>
              <p class="text-xs text-indigo-600">{{ selectedPhotos.length }} / {{ selectedPackage.photoCount }} selected</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="cancelSelection" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
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
              {{ isPurchasingPackage ? 'Processing...' : 'Buy Package' }}
            </button>
          </div>
        </div>
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
          <div v-for="photo in photos" :key="photo.id" 
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
                <img :src="photo.watermarkedR2Url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold" :class="{ 'hidden': selectionMode && isPhotoSelected(photo.id) }">${{ photo.price.toFixed(2) }}</div>
            </div>
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
import { usePackagesStore } from '~/stores/packages'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()
const packagesStore = usePackagesStore()

const eventId = route.params.id
const event = ref(null)
const isBuying = ref(null)

const selectedPhoto = ref(null)
const comments = ref([])
const loadingComments = ref(false)
const newComment = ref('')
const postingComment = ref(false)

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
    await fetchPhotos()
    await packagesStore.fetchPackages()
})

const photos = computed(() => photosStore.eventPhotos)
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
    
    const downloadNow = confirm(
      `🎉 ${result.message}\n\nTotal: $${result.totalPaid}\nYou saved: $${result.savedAmount}\n\nDownload your photos now?`
    )

    if (downloadNow && result.presignedUrls) {
      result.presignedUrls.forEach(url => window.open(url, '_blank'))
    }

    cancelSelection()
  } catch (e) {
    alert(e.response?._data || 'Package purchase failed')
  } finally {
    isPurchasingPackage.value = false
  }
}

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
