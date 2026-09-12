<template>
  <div class="min-h-screen bg-[#fafafa]">
    <!-- Navbar (Instagram 2024 Style) -->
    <nav
      class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 h-[60px] flex items-center shadow-sm">
      <div class="max-w-5xl w-full mx-auto px-4 flex justify-between items-center gap-8">
        <!-- Logo -->
        <div class="flex-shrink-0 cursor-pointer group flex items-center gap-2" @click="router.push('/marketplace')">
          <img src="/logo.png" alt="Moments Logo" class="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
          <h1
            class="text-2xl font-black tracking-tighter italic group-hover:scale-105 transition-transform duration-300 text-[#3ef4a1]">
            Moments
          </h1>
        </div>

        <!-- Search (Desktop - Centralized) -->
        <div class="hidden md:flex relative flex-1 max-w-sm" v-click-outside="closeSearch">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon name="lucide:search" class="w-4 h-4" />
          </div>
          <input v-model="searchQuery" @input="handleSearch" @focus="isSearchFocused = true" type="text"
            placeholder="Buscar eventos, fotógrafos, usuarios..."
            class="w-full bg-gray-100/70 rounded-xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border-none transition-all placeholder:text-gray-400" />
          <button v-if="searchQuery" @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full">
            <Icon name="lucide:x" class="w-3 h-3" />
          </button>

          <!-- Search Dropdown Overlay -->
          <div v-if="isSearchFocused && (searchQuery.length > 0 || isSearching)"
            class="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/10 overflow-hidden z-50">
            <div v-if="isSearching" class="p-4 flex justify-center items-center text-gray-400 gap-2 text-xs">
              <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin text-indigo-500" />
              <span>Buscando...</span>
            </div>
            <div v-else-if="!hasResults && searchQuery" class="p-5 text-center text-gray-400 text-sm">
              <Icon name="lucide:search-x" class="w-6 h-6 mx-auto mb-1 text-gray-300" />
              No se encontraron resultados para "{{ searchQuery }}"
            </div>
            <div v-else class="max-h-[380px] overflow-y-auto python-scrollbar divide-y divide-gray-50">
              <!-- Photographers Section -->
              <div v-if="searchPhotographers.length > 0">
                <div class="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/80 flex items-center justify-between">
                  <span>Fotógrafos</span>
                  <span class="text-indigo-600 font-semibold">{{ searchPhotographers.length }}</span>
                </div>
                <div v-for="p in searchPhotographers" :key="'photographer-' + p.id" @click="goToPhotographer(p.username)"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50/50 cursor-pointer transition-colors">
                  <div
                    class="w-9 h-9 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-indigo-50 flex items-center justify-center">
                    <img v-if="p.profilePhotoUrl" :src="p.profilePhotoUrl" alt="" class="w-full h-full object-cover">
                    <span v-else class="text-xs font-bold text-indigo-500">{{ p.username.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="flex flex-col min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-semibold text-gray-800 truncate">{{ p.username }}</span>
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-600 flex items-center gap-0.5">
                        <Icon name="lucide:camera" class="w-2.5 h-2.5" /> Fotógrafo
                      </span>
                    </div>
                    <span class="text-[11px] text-gray-400">{{ p.followerCount || 0 }} seguidores</span>
                  </div>
                </div>
              </div>

              <!-- Users Section -->
              <div v-if="searchUsers.length > 0">
                <div class="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/80 flex items-center justify-between">
                  <span>Usuarios</span>
                  <span class="text-indigo-600 font-semibold">{{ searchUsers.length }}</span>
                </div>
                <div v-for="u in searchUsers" :key="'user-' + u.id" @click="goToUser(u.username)"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div
                    class="w-9 h-9 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img v-if="u.profilePhotoUrl" :src="u.profilePhotoUrl" alt="" class="w-full h-full object-cover">
                    <span v-else class="text-xs font-bold text-gray-500">{{ u.username.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="flex flex-col min-w-0 flex-1">
                    <span class="text-sm font-semibold text-gray-800 truncate">{{ u.username }}</span>
                    <span class="text-[11px] text-gray-400 truncate">{{ u.firstName ? (u.firstName + ' ' + (u.lastName || '')) : 'Usuario' }}</span>
                  </div>
                </div>
              </div>

              <!-- Events Section -->
              <div v-if="searchEvents.length > 0">
                <div class="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/80 flex items-center justify-between">
                  <span>Eventos</span>
                  <span class="text-indigo-600 font-semibold">{{ searchEvents.length }}</span>
                </div>
                <div v-for="e in searchEvents" :key="'event-' + e.id" @click="goToEvent(e)"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50/50 cursor-pointer transition-colors">
                  <div
                    class="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img v-if="e.coverPhotoUrl" :src="e.coverPhotoUrl" alt="" class="w-full h-full object-cover">
                    <Icon v-else name="lucide:image" class="w-4 h-4 text-gray-400" />
                  </div>
                  <div class="flex flex-col min-w-0 flex-1">
                    <span class="text-sm font-semibold text-gray-800 truncate">{{ e.title }}</span>
                    <span class="text-[11px] text-gray-400 truncate">{{ e.location || 'Evento' }} • Por @{{ e.photographerUsername }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Icons -->
        <div class="flex items-center gap-4 sm:gap-6">
          <button @click="router.push('/marketplace')" class="p-2 hover:bg-gray-100 rounded-full transition-all group"
            title="Home">
            <Icon name="lucide:home" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <button @click="router.push('/photographers')" class="p-2 hover:bg-gray-100 rounded-full transition-all group"
            title="Explore Photographers">
            <Icon name="lucide:search" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <!-- Photographers: Create Post/Event -->
          <button v-if="authStore.isPhotographer" @click="router.push('/dashboard/photographer')"
            class="p-2 hover:bg-gray-100 rounded-full transition-all group" title="Dashboard">
            <Icon name="lucide:plus-square" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>



          <!-- Buyers: Cart -->
          <button v-if="authStore.isCustomer" @click="cartStore.showCart = true"
            class="relative p-2 hover:bg-gray-100 rounded-full transition-all group" title="Cart">
            <Icon name="lucide:shopping-cart" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
            <span v-if="cartStore.items.length > 0" class="absolute top-0 right-0 w-4 h-4 bg-[#3ef4a1] text-[9px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
              {{ cartStore.items.length }}
            </span>
          </button>

          <!-- Profile / Auth -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
            <button @click="goToMyProfile"
              class="h-8 w-8 rounded-full border border-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-indigo-500 transition-all p-0.5">
              <div
                class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:user" class="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <button @click="handleLogout"
              class="hidden sm:block text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
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
    <div
      class="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 h-16 flex items-center justify-around z-50 px-4">
      <Icon name="lucide:home" @click="router.push('/marketplace')" class="w-6 h-6 text-gray-800" />
      <Icon name="lucide:search" @click="router.push('/photographers')" class="w-6 h-6 text-gray-400" />
      <Icon name="lucide:plus-square" v-if="authStore.isPhotographer" @click="router.push('/dashboard/photographer')"
        class="w-6 h-6 text-gray-400" />
      <div v-if="authStore.isCustomer" class="relative" @click="cartStore.showCart = true">
        <Icon name="lucide:shopping-cart" class="w-6 h-6 text-gray-400" />
        <span v-if="cartStore.items.length > 0" class="absolute -top-2 -right-2 w-4 h-4 bg-[#3ef4a1] text-[9px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
          {{ cartStore.items.length }}
        </span>
      </div>
      <div @click="goToMyProfile"
        class="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
        <Icon name="lucide:user" class="w-4 h-4 text-gray-400" />
      </div>
    </div>

    <!-- Global Confirmation Modal -->
    <ConfirmModal :is-open="confirm.isOpen.value" :title="confirm.title.value" :message="confirm.message.value"
      :confirm-text="confirm.confirmText.value" :cancel-text="confirm.cancelText.value" :icon="confirm.icon.value"
      @confirm="confirm.onConfirm" @cancel="confirm.onCancel" />

    <!-- Cart Drawer Component -->
    <CartDrawer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const confirm = useConfirm()

// --- Búsqueda Global (Eventos, Fotógrafos, Usuarios) ---
const searchQuery = ref('')
const isSearching = ref(false)
const isSearchFocused = ref(false)
const searchEvents = ref([])
const searchPhotographers = ref([])
const searchUsers = ref([])
let searchTimeout = null

const hasResults = computed(() => searchEvents.value.length > 0 || searchPhotographers.value.length > 0 || searchUsers.value.length > 0)

function handleSearch() {
  clearTimeout(searchTimeout)
  const query = searchQuery.value.trim()
  if (!query) {
    searchEvents.value = []
    searchPhotographers.value = []
    searchUsers.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const config = useRuntimeConfig()
      const [eventsRes, photographersRes, usersRes] = await Promise.all([
        $fetch(`${config.public.apiBase}/events?query=${encodeURIComponent(query)}&size=10`).catch(() => ({ content: [] })),
        $fetch(`${config.public.apiBase}/users/photographers?query=${encodeURIComponent(query)}`).catch(() => []),
        $fetch(`${config.public.apiBase}/users/search?query=${encodeURIComponent(query)}`).catch(() => [])
      ])

      // Parse eventos correctamente desde PaginatedResponse ({ content: [...] })
      const rawEvents = eventsRes?.content ? eventsRes.content : (Array.isArray(eventsRes) ? eventsRes : [])
      searchEvents.value = rawEvents.slice(0, 5)

      // Fotógrafos
      const rawPhotographers = Array.isArray(photographersRes) ? photographersRes : []
      searchPhotographers.value = rawPhotographers.slice(0, 5)

      // Usuarios
      const rawUsers = Array.isArray(usersRes) ? usersRes : []
      searchUsers.value = rawUsers.slice(0, 5)
    } catch (e) {
      console.error("Error global search", e)
    } finally {
      isSearching.value = false
    }
  }, 250)
}

function clearSearch() {
  searchQuery.value = ''
  searchEvents.value = []
  searchPhotographers.value = []
  searchUsers.value = []
  isSearchFocused.value = false
}

function closeSearch() {
  isSearchFocused.value = false
}

function goToEvent(event) {
  closeSearch()
  const identifier = event.uuid || event.id
  router.push(`/marketplace/events/${identifier}`)
}

function goToPhotographer(username) {
  closeSearch()
  router.push(`/photographers/${username}`)
}

function goToUser(username) {
  closeSearch()
  router.push(`/profile/${username}`)
}

function goToMyProfile() {
  if (authStore.isPhotographer) {
    router.push('/dashboard/photographer')
  } else if (authStore.isCustomer) {
    router.push('/dashboard/customer')
  } else if (authStore.isAuthenticated) {
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
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
