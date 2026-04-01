<template>
  <div class="ig-container">
    <!-- Stories/Featured Photographers (Instagram Style) -->
    <div v-if="photographers.length > 0" class="mb-8 flex space-x-4 overflow-x-auto pb-4 pt-4 no-scrollbar">
      <div v-for="p in photographers" :key="p.id" class="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer" @click="router.push(`/photographers/${p.id}`)">
        <div class="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
           <div class="bg-white p-[2px] rounded-full">
              <div class="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                <img v-if="p.profilePhotoUrl" :src="p.profilePhotoUrl" alt="Photographer" class="w-full h-full object-cover">
                <span v-else class="text-xs text-indigo-400 font-bold uppercase">{{ p.username.charAt(0) }}</span>
              </div>
           </div>
        </div>
        <span class="text-[11px] text-gray-500 truncate w-16 text-center">{{ p.username }}</span>
      </div>
    </div>

    <!-- Dual Search Bar (Subtle) -->
    <div class="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <div class="relative flex-1">
        <input 
          v-model="eventQuery"
          type="text" 
          placeholder="Search events..." 
          class="ig-input h-9 !bg-white"
          @input="handleEventSearch"
        />
      </div>
      <div class="relative flex-1">
        <input 
          v-model="photographerQuery"
          type="text" 
          placeholder="Find photographers..." 
          class="ig-input h-9 !bg-white"
          @keyup.enter="searchPhotographers"
        />
      </div>
    </div>

    <!-- Feed -->
    <div class="max-w-[470px] mx-auto space-y-6">
      <div v-if="pending" class="text-center py-20 text-gray-400">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mx-auto mb-2" />
        <span>Loading feed...</span>
      </div>
      
      <div v-else-if="events.length === 0" class="text-center py-20 text-gray-500 ig-card">
          No events found.
      </div>

      <!-- Event Post Card -->
      <div v-for="event in events" :key="event.id" class="ig-card">
        <!-- Card Header -->
        <div class="p-3 flex justify-between items-center">
          <div class="flex items-center space-x-3 cursor-pointer" @click="router.push(`/photographers/${event.photographerId}`)">
            <div class="w-8 h-8 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center overflow-hidden">
               <img v-if="event.photographerProfilePhotoUrl" :src="event.photographerProfilePhotoUrl" alt="Photographer" class="w-full h-full object-cover">
               <span v-else class="text-xs font-bold text-indigo-600">{{ event.photographerUsername?.charAt(0).toUpperCase() || 'P' }}</span>
            </div>
            <span class="text-sm font-semibold text-[#262626]">{{ event.photographerUsername || 'photographer' }}</span>
          </div>
          <Icon name="lucide:more-horizontal" class="h-5 w-5 text-gray-500 cursor-pointer" />
        </div>

        <!-- Card Image/Main Content -->
        <div class="aspect-square bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center border-y border-gray-100 cursor-pointer group relative overflow-hidden" @click="goToEvent(event.id)">
            <img v-if="event.coverPhotoUrl" :src="event.coverPhotoUrl" alt="Event Cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <template v-else>
                <!-- Collage fallback: just 3 small placeholders in a nice grid for now -->
                <div class="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 p-1 bg-gray-50">
                    <div class="bg-indigo-100 rounded-sm flex items-center justify-center row-span-2">
                        <Icon name="lucide:camera" class="h-12 w-12 text-white" />
                    </div>
                    <div class="bg-indigo-50 rounded-sm"></div>
                    <div class="bg-indigo-100/50 rounded-sm flex items-center justify-center">
                         <Icon name="lucide:image" class="h-6 w-6 text-white" />
                    </div>
                </div>
            </template>
            <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                 <h3 class="text-xl font-bold text-white line-clamp-1">{{ event.title }}</h3>
                 <p class="text-sm text-gray-200">{{ event.location }}</p>
            </div>
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                {{ event.date }}
            </div>
        </div>

        <!-- Card Actions -->
        <div class="p-3 pb-2 flex justify-between">
          <div class="flex space-x-4">
             <Icon name="lucide:heart" class="h-6 w-6 cursor-pointer hover:text-red-500 transition-colors" />
             <Icon name="lucide:message-circle" class="h-6 w-6 cursor-pointer hover:text-gray-500 transition-colors" />
             <Icon name="lucide:send" class="h-6 w-6 cursor-pointer hover:text-gray-500 transition-colors" />
          </div>
          <Icon name="lucide:bookmark" class="h-6 w-6 cursor-pointer hover:text-gray-500 transition-colors" />
        </div>

        <!-- Card Description -->
        <div class="px-3 pb-4 space-y-1">
          <p class="text-sm font-semibold text-[#262626]">0 likes</p>
          <p class="text-sm text-[#262626]">
            <span class="font-semibold mr-2">{{ event.photographerUsername }}</span>
            {{ event.description || 'Check out the photos from this incredible event!' }}
          </p>
          <button @click="goToEvent(event.id)" class="text-sm text-gray-500 mt-1">View all comments</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '~/stores/events'

const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()

const eventQuery = ref('')
const photographerQuery = ref('')
const photographers = ref([])

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await walletStore.fetchBalance()
    }
    await eventsStore.fetchEvents()
    await fetchPhotographers()
})

async function fetchPhotographers() {
    try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/users/photographers`)
        photographers.value = data.slice(0, 10)
    } catch (e) {
        console.error(e)
    }
}

const events = computed(() => eventsStore.events)
const pending = computed(() => eventsStore.loading)

let searchTimeout = null
function handleEventSearch() {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        eventsStore.fetchEvents(eventQuery.value)
    }, 300)
}

async function searchPhotographers() {
    if (!photographerQuery.value) return
    router.push({ path: '/photographers', query: { q: photographerQuery.value } })
}

function goToEvent(id) {
    router.push(`/marketplace/events/${id}`)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
