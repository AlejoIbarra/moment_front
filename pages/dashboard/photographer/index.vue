<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Profile Header (Instagram Style) -->
    <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-200 pb-12">
      <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
        <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-1 transition-transform group-hover:scale-105">
          <div class="w-full h-full rounded-full bg-white p-1">
            <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 italic">
              <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
              <Icon v-else name="lucide:camera" class="w-16 h-16 text-gray-300" />
            </div>
          </div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
           <Icon name="lucide:upload" class="w-8 h-8" />
        </div>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />
      </div>

      <!-- Profile Info -->
      <div class="flex-1 text-center md:text-left">
        <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <h2 class="text-2xl font-light text-gray-800">{{ authStore.user?.username || 'Photographer' }}</h2>
          <div class="flex items-center justify-center md:justify-start gap-2">
            <button class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors">
              {{ $t('common.save') }}
            </button>
            <button @click="showCreateModal = true" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
               <Icon name="lucide:plus" class="w-4 h-4" />
               {{ $t('dashboard.photographer.create_event') }}
            </button>
            <button class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
               <Icon name="lucide:wallet" class="w-4 h-4" />
               ${{ walletStore.balance.toFixed(2) }}
            </button>
          </div>
        </div>

        <div class="flex justify-center md:justify-start gap-6 mb-4 text-sm">
          <span><strong class="text-gray-900">{{ events.length }}</strong> {{ $t('dashboard.photographer.my_events').toLowerCase() }}</span>
          <span><strong class="text-gray-900">Professional</strong> account</span>
        </div>

        <div class="text-sm">
          <p class="font-semibold text-gray-900">Verified Photographer</p>
          <p class="text-gray-500">Capturing the soul of every event. Managing your portfolio from here.</p>
        </div>
      </div>
    </div>

    <!-- Tabs (Instagram Style) -->
    <div class="flex justify-center gap-12 border-t border-gray-200">
      <div class="flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px text-gray-900 border-gray-900">
        <Icon name="lucide:grid" class="w-3 h-3" />
        {{ $t('dashboard.photographer.my_events') }}
      </div>
    </div>

    <!-- Events Grid -->
    <div class="mt-8">
      <div v-if="pending" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      
      <div v-else-if="events.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-20 h-20 rounded-full border-2 border-gray-900 flex items-center justify-center mb-4">
          <Icon name="lucide:plus" class="w-10 h-10 text-gray-900" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('dashboard.photographer.no_events') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('dashboard.photographer.start_selling') }}</p>
        <button @click="showCreateModal = true" class="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
          {{ $t('dashboard.photographer.create_event') }}
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="event in events" :key="event.id" 
             @click="goToEvent(event.id)"
             class="group relative bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
          <div class="aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden">
             <!-- If event has a cover URL we'd use it, otherwise a premium placeholder -->
             <div class="w-full h-full flex items-center justify-center text-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform duration-500">
                <Icon name="lucide:image" class="w-12 h-12" />
             </div>
             <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all"></div>
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
               <Icon name="lucide:calendar" class="w-3 h-3" />
               {{ event.date }}
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{{ event.title }}</h3>
            <p class="text-sm text-gray-500 flex items-center gap-1 mb-4">
               <Icon name="lucide:map-pin" class="w-3 h-3" />
               {{ event.location }}
            </p>
            <div class="flex items-center justify-between pt-4 border-t border-gray-50">
               <span class="text-xs text-gray-400">View & Manage</span>
               <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Event Modal (Premium Instagram Style) -->
    <Transition name="fade">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
        <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">{{ $t('dashboard.photographer.create_event') }}</h3>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="lucide:x" class="w-6 h-6" />
            </button>
          </div>
          
          <form @submit.prevent="createEvent" class="p-6 space-y-5">
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Event Title</label>
              <input v-model="newEvent.title" type="text" required placeholder="e.g. Wedding of Alex & Maria"
                     class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
                <input v-model="newEvent.date" type="date" required
                       class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
                <input v-model="newEvent.location" type="text" required placeholder="City or Venue"
                       class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none">
              </div>
            </div>
            
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
              <textarea v-model="newEvent.description" rows="3" placeholder="Describe the vibe of this event..."
                        class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"></textarea>
            </div>
            
            <div class="pt-4 flex gap-3">
              <button type="button" @click="showCreateModal = false"
                      class="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
                {{ $t('common.cancel') }}
              </button>
              <button type="submit"
                      class="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                {{ $t('common.save') }}
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
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'

const { $api } = useNuxtApp()
const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()

const fileInput = ref(null)
const uploading = ref(false)
const showCreateModal = ref(false)

const newEvent = ref({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: ''
})

onMounted(async () => {
    if (!authStore.isPhotographer) {
        router.push('/')
        return
    }
    
    await walletStore.fetchBalance()
    await eventsStore.fetchMyEvents()
})

const events = computed(() => eventsStore.myEvents)
const pending = computed(() => eventsStore.loading)

async function createEvent() {
    try {
        const success = await eventsStore.createEvent(newEvent.value)
        if (success) {
            showCreateModal.value = false
            newEvent.value = { title: '', date: new Date().toISOString().split('T')[0], location: '', description: '' }
        } else {
            alert('Failed to create event. Please check inputs.')
        }
    } catch (e) {
        console.error('Failed to create event', e)
    }
}

function goToEvent(id) {
    router.push(`/dashboard/photographer/events/${id}`)
}

async function onFileSelected(event) {
    const file = event.target.files[0]
    if (!file) return

    uploading.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        
        // Upload to R2 via backend
        const res = await $api('/photo/upload-public', {
            method: 'POST',
            body: formData
        })
        
        const photoUrl = res.url
        // Update user profile photo
        await $api('/users/profile-photo', {
            method: 'PUT',
            body: photoUrl
        })
        
        authStore.user.profilePhotoUrl = photoUrl
        alert('Profile photo updated!')
    } catch (e) {
        console.error(e)
        alert('Upload failed.')
    } finally {
        uploading.value = false
    }
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
