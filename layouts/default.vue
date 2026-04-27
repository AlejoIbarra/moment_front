<template>
  <div class="min-h-screen bg-[#fafafa]">
    <!-- Navbar (Instagram 2024 Style) -->
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 h-[60px] flex items-center shadow-sm">
      <div class="max-w-5xl w-full mx-auto px-4 flex justify-between items-center gap-8">
        <!-- Logo -->
        <div class="flex-shrink-0 cursor-pointer group" @click="router.push('/marketplace')">
          <h1 class="text-2xl font-black tracking-tighter italic bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
            Moment
          </h1>
        </div>

        <!-- Search (Desktop - Centralized) -->
        <div class="hidden md:flex relative flex-1 max-w-sm" v-click-outside="closeSearch">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon name="lucide:search" class="w-4 h-4" />
          </div>
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            @focus="isSearchFocused = true"
            type="text" 
            placeholder="Search events, photographers..." 
            class="w-full bg-gray-100/50 rounded-xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 border-none transition-all placeholder:text-gray-400"
          />
          <button v-if="searchQuery" @click="clearSearch" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full">
             <Icon name="lucide:x" class="w-3 h-3" />
          </button>
          
          <!-- Search Dropdown Overlay -->
          <div v-if="isSearchFocused && (searchQuery.length > 0 || isSearching)" class="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/5 overflow-hidden z-50">
             <div v-if="isSearching" class="p-4 flex justify-center items-center text-gray-400">
                <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
             </div>
             <div v-else-if="!hasResults && searchQuery" class="p-4 text-center text-gray-400 text-sm">
                No se encontraron resultados
             </div>
             <div v-else class="max-h-[300px] overflow-y-auto python-scrollbar">
                <!-- Photographers Section -->
                <div v-if="searchPhotographers.length > 0">
                   <div class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">Fotógrafos</div>
                   <div v-for="p in searchPhotographers" :key="p.id" @click="goToPhotographer(p.username)" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                         <img v-if="p.profilePhotoUrl" :src="p.profilePhotoUrl" alt="" class="w-full h-full object-cover">
                         <span v-else class="text-xs font-bold text-indigo-500">{{ p.username.charAt(0).toUpperCase() }}</span>
                      </div>
                      <div class="flex flex-col">
                         <span class="text-sm font-semibold text-gray-800">{{ p.username }}</span>
                         <span class="text-[11px] text-gray-500">{{ p.followerCount || 0 }} seguidores</span>
                      </div>
                   </div>
                </div>

                <!-- Events Section -->
                <div v-if="searchEvents.length > 0">
                   <div class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-t border-gray-50">Eventos</div>
                   <div v-for="e in searchEvents" :key="e.id" @click="goToEvent(e.id)" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div class="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                         <img v-if="e.coverPhotoUrl" :src="e.coverPhotoUrl" alt="" class="w-full h-full object-cover">
                         <Icon v-else name="lucide:image" class="w-4 h-4 text-gray-400" />
                      </div>
                      <div class="flex flex-col">
                         <span class="text-sm font-semibold text-gray-800 line-clamp-1">{{ e.title }}</span>
                         <span class="text-[11px] text-gray-500 line-clamp-1">{{ e.location }} • {{ e.photographerUsername }}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Action Icons -->
        <div class="flex items-center gap-4 sm:gap-6">
          <button @click="router.push('/marketplace')" class="p-2 hover:bg-gray-100 rounded-full transition-all group" title="Home">
            <Icon name="lucide:home" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <button @click="router.push('/photographers')" class="p-2 hover:bg-gray-100 rounded-full transition-all group" title="Explore Photographers">
            <Icon name="lucide:search" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <!-- Photographers: Create Post/Event -->
          <button v-if="authStore.isPhotographer" @click="router.push('/dashboard/photographer')" 
                  class="p-2 hover:bg-gray-100 rounded-full transition-all group" title="Dashboard">
            <Icon name="lucide:plus-square" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <!-- Buyers: Wallet -->
          <button v-if="authStore.isCustomer" @click="router.push('/dashboard/customer')" 
                  class="p-2 hover:bg-gray-100 rounded-full transition-all group" title="My Purchases">
            <Icon name="lucide:shopping-bag" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <!-- Profile / Auth -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
             <button @click="goToMyProfile" class="h-8 w-8 rounded-full border border-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-indigo-500 transition-all p-0.5">
                <div class="w-full h-full rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center">
                   <Icon name="lucide:user" class="w-5 h-5 text-gray-400" />
                </div>
             </button>
             
             <button @click="handleLogout" class="hidden sm:block text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
               Logout
             </button>
          </div>
          
          <button v-else @click="router.push('/login')" 
                  class="bg-black text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10">
            Log In
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Rendering -->
    <main class="pt-[80px] min-h-[calc(100vh-80px)]">
      <div class="animate-slide-in">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <div class="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 h-16 flex items-center justify-around z-50 px-4">
       <Icon name="lucide:home" @click="router.push('/marketplace')" class="w-6 h-6 text-gray-800" />
       <Icon name="lucide:search" @click="router.push('/photographers')" class="w-6 h-6 text-gray-400" />
       <Icon name="lucide:plus-square" v-if="authStore.isPhotographer" @click="router.push('/dashboard/photographer')" class="w-6 h-6 text-gray-400" />
       <Icon name="lucide:shopping-bag" v-if="authStore.isCustomer" @click="router.push('/dashboard/customer')" class="w-6 h-6 text-gray-400" />
       <div @click="goToMyProfile" class="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <Icon name="lucide:user" class="w-4 h-4 text-gray-400" />
       </div>
    </div>
 
    <!-- Global Confirmation Modal -->
    <ConfirmModal
      :is-open="confirm.isOpen.value"
      :title="confirm.title.value"
      :message="confirm.message.value"
      :confirm-text="confirm.confirmText.value"
      :cancel-text="confirm.cancelText.value"
      :icon="confirm.icon.value"
      @confirm="confirm.onConfirm"
      @cancel="confirm.onCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const confirm = useConfirm()

// --- Búsqueda Global ---
const searchQuery = ref('')
const isSearching = ref(false)
const isSearchFocused = ref(false)
const searchEvents = ref([])
const searchPhotographers = ref([])
let searchTimeout = null

const hasResults = computed(() => searchEvents.value.length > 0 || searchPhotographers.value.length > 0)

function handleSearch() {
    clearTimeout(searchTimeout)
    if (!searchQuery.value.trim()) {
        searchEvents.value = []
        searchPhotographers.value = []
        isSearching.value = false
        return
    }
    
    isSearching.value = true
    searchTimeout = setTimeout(async () => {
        try {
            const config = useRuntimeConfig()
            const [eventsRes, photographersRes] = await Promise.all([
                $fetch(`${config.public.apiBase}/events?query=${encodeURIComponent(searchQuery.value)}`).catch(() => []),
                $fetch(`${config.public.apiBase}/users/photographers?query=${encodeURIComponent(searchQuery.value)}`).catch(() => [])
            ])
            searchEvents.value = Array.isArray(eventsRes) ? eventsRes.slice(0, 5) : []
            searchPhotographers.value = Array.isArray(photographersRes) ? photographersRes.slice(0, 5) : []
        } catch (e) {
            console.error("Error global search", e)
        } finally {
            isSearching.value = false
        }
    }, 400)
}

function clearSearch() {
    searchQuery.value = ''
    searchEvents.value = []
    searchPhotographers.value = []
    isSearchFocused.value = false
}

function closeSearch() {
    isSearchFocused.value = false
}

function goToEvent(id) {
    closeSearch()
    router.push(`/marketplace/events/${id}`)
}

function goToPhotographer(username) {
    closeSearch()
    router.push(`/photographers/${username}`)
}

function goToMyProfile() {
    if (authStore.isPhotographer) {
        router.push('/dashboard/photographer')
    } else if (authStore.isCustomer) {
        router.push('/dashboard/customer')
    } else {
        router.push('/login')
    }
}

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

useHead({
  script: [
    { src: 'https://checkout.wompi.co/widget.js' }
  ]
})

// Click outside directive implementation
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
