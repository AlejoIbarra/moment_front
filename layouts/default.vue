<template>
  <div class="min-h-screen bg-[#fafafa]">
    <!-- Navbar (Instagram 2024 Style) -->
    <nav
      class="fixed top-0 w-full bg-white border-b border-gray-200 z-50 h-[60px] flex items-center shadow-xs">
      <div class="max-w-5xl w-full mx-auto px-4 flex justify-between items-center gap-8">
        <!-- Logo -->
        <div class="flex-shrink-0 cursor-pointer group flex items-center gap-2" @click="router.push('/marketplace')">
          <img src="/logo.png" alt="Moments Logo" class="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
          <h1
            class="text-2xl font-black tracking-tighter italic group-hover:scale-105 transition-transform duration-300 text-[#3ef4a1]">
            Moments
          </h1>
        </div>

        <!-- Search (Desktop - Centralized & Pro Visual) -->
        <div class="hidden md:flex relative flex-1 max-w-md" v-click-outside="closeSearch">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon name="lucide:search" class="w-4 h-4 text-gray-400" />
            </div>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              @input="handleSearch"
              @focus="isSearchFocused = true"
              @keydown.esc="closeSearch"
              @keydown.enter="handleEnterSearch"
              type="text"
              placeholder="Buscar partidos, torneos, fotógrafos, fotos..."
              class="w-full bg-gray-100/80 hover:bg-gray-100 focus:bg-white rounded-2xl py-2 pl-10 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent focus:border-indigo-200 transition-all placeholder:text-gray-400 font-medium"
            />
            <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors"
                title="Limpiar"
              >
                <Icon name="lucide:x" class="w-3.5 h-3.5" />
              </button>
              <kbd v-else class="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-md shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>

          <!-- Search Dropdown Overlay (Pro Visual Dropdown) -->
          <div
            v-if="isSearchFocused"
            class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[540px] lg:w-[620px] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl shadow-black/15 overflow-hidden z-50 animate-dropdown"
          >
            <!-- Category Filter Tabs -->
            <div class="flex items-center gap-1.5 px-3 py-2.5 border-b border-gray-100 bg-gray-50/70 overflow-x-auto text-xs font-semibold">
              <button
                v-for="cat in searchCategories"
                :key="cat.id"
                @click="searchActiveTab = cat.id"
                :class="[
                  'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap',
                  searchActiveTab === cat.id
                    ? 'bg-black text-white shadow-sm shadow-black/10'
                    : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                ]"
              >
                <Icon :name="cat.icon" class="w-3.5 h-3.5" />
                <span>{{ cat.label }}</span>
                <span
                  v-if="cat.count > 0"
                  :class="[
                    'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                    searchActiveTab === cat.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  ]"
                >
                  {{ cat.count }}
                </span>
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="isSearching" class="p-8 flex flex-col justify-center items-center text-gray-400 gap-2">
              <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-indigo-500" />
              <span class="text-xs font-medium text-gray-500">Buscando álbumes y fotos...</span>
            </div>

            <!-- Empty Search Initial Suggestions -->
            <div v-else-if="!searchQuery" class="p-4 space-y-3">
              <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 flex items-center gap-1.5">
                <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-[#3ef4a1]" />
                Búsquedas populares de partidos
              </div>
              <div class="flex flex-wrap gap-2 px-2">
                <button
                  v-for="sug in quickSuggestions"
                  :key="sug"
                  @click="applySuggestion(sug)"
                  class="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 border border-transparent text-xs font-medium text-gray-700 transition-all flex items-center gap-1.5"
                >
                  <Icon name="lucide:search" class="w-3 h-3 text-gray-400" />
                  <span>{{ sug }}</span>
                </button>
              </div>
            </div>

            <!-- No Results State -->
            <div v-else-if="!hasResults" class="p-8 text-center text-gray-400">
              <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                <Icon name="lucide:search-x" class="w-6 h-6" />
              </div>
              <p class="text-sm font-semibold text-gray-700">No encontramos resultados para "{{ searchQuery }}"</p>
              <p class="text-xs text-gray-400 mt-1">Prueba buscando por nombre del partido, torneo, fotógrafo o ciudad.</p>
            </div>

            <!-- Results List -->
            <div v-else class="max-h-[440px] overflow-y-auto python-scrollbar p-3 space-y-4">
              <!-- Events / Matches Section (Visual Collage Cards) -->
              <div v-if="(searchActiveTab === 'all' || searchActiveTab === 'events') && searchEvents.length > 0" class="space-y-2.5">
                <div class="px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Icon name="lucide:trophy" class="w-3.5 h-3.5 text-emerald-600" />
                    Partidos y Álbumes de Fotos ({{ searchEvents.length }})
                  </span>
                </div>
                <div class="space-y-3">
                  <EventVisualCard
                    v-for="e in searchEvents"
                    :key="'search-event-' + (e.uuid || e.id)"
                    :event="e"
                    :compact="true"
                    @click="goToEvent(e)"
                  />
                </div>
              </div>

              <!-- Photographers Section -->
              <div v-if="(searchActiveTab === 'all' || searchActiveTab === 'photographers') && searchPhotographers.length > 0" class="space-y-2">
                <div class="px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Icon name="lucide:camera" class="w-3.5 h-3.5 text-indigo-600" />
                    Fotógrafos ({{ searchPhotographers.length }})
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    v-for="p in searchPhotographers"
                    :key="'photographer-' + p.id"
                    @click="goToPhotographer(p.username)"
                    class="flex items-center gap-3 p-2.5 bg-gray-50/70 hover:bg-indigo-50/60 border border-gray-100 rounded-xl cursor-pointer transition-all group"
                  >
                    <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-indigo-50 flex items-center justify-center">
                      <img v-if="p.profilePhotoUrl" :src="p.profilePhotoUrl" alt="" class="w-full h-full object-cover">
                      <span v-else class="text-xs font-bold text-indigo-600">{{ p.username.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex flex-col min-w-0 flex-1">
                      <span class="text-xs font-bold text-gray-800 group-hover:text-indigo-600 truncate">{{ p.username }}</span>
                      <span class="text-[10px] text-gray-400">{{ p.followerCount || 0 }} seguidores</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Users Section -->
              <div v-if="(searchActiveTab === 'all' || searchActiveTab === 'users') && searchUsers.length > 0" class="space-y-2">
                <div class="px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Icon name="lucide:users" class="w-3.5 h-3.5 text-gray-600" />
                    Usuarios ({{ searchUsers.length }})
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    v-for="u in searchUsers"
                    :key="'user-' + u.id"
                    @click="goToUser(u.username)"
                    class="flex items-center gap-3 p-2.5 bg-gray-50/70 hover:bg-gray-100 border border-gray-100 rounded-xl cursor-pointer transition-all group"
                  >
                    <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      <img v-if="u.profilePhotoUrl" :src="u.profilePhotoUrl" alt="" class="w-full h-full object-cover">
                      <span v-else class="text-xs font-bold text-gray-600">{{ u.username.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex flex-col min-w-0 flex-1">
                      <span class="text-xs font-bold text-gray-800 group-hover:text-black truncate">{{ u.username }}</span>
                      <span class="text-[10px] text-gray-400 truncate">{{ u.firstName ? (u.firstName + ' ' + (u.lastName || '')) : 'Usuario' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer: View All in Explorer -->
            <div class="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span class="text-[11px] text-gray-400 hidden sm:inline-flex items-center gap-1">
                <kbd class="px-1 py-0.5 text-[9px] bg-white border border-gray-200 rounded">ESC</kbd> para cerrar
              </span>
              <button
                @click="goToExplorerWithQuery"
                class="ml-auto font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <span>Ver todos los resultados en el explorador</span>
                <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
              </button>
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
      class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 px-4 shadow-lg">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const confirm = useConfirm()

// --- Búsqueda Global Visual Pro (Eventos, Fotógrafos, Usuarios) ---
const searchInputRef = ref(null)
const searchQuery = ref('')
const isSearching = ref(false)
const isSearchFocused = ref(false)
const searchActiveTab = ref('all')
const searchEvents = ref([])
const searchPhotographers = ref([])
const searchUsers = ref([])
let searchTimeout = null

const quickSuggestions = [
  '⚽ Fútbol',
  '🏆 Final',
  '🎾 Tenis',
  '🏀 Baloncesto',
  '🏃 Atletismo',
  '📸 Fotógrafos Pro'
]

const hasResults = computed(() => searchEvents.value.length > 0 || searchPhotographers.value.length > 0 || searchUsers.value.length > 0)

const searchCategories = computed(() => [
  {
    id: 'all',
    label: 'Todo',
    icon: 'lucide:sparkles',
    count: searchEvents.value.length + searchPhotographers.value.length + searchUsers.value.length
  },
  {
    id: 'events',
    label: 'Partidos / Álbumes',
    icon: 'lucide:trophy',
    count: searchEvents.value.length
  },
  {
    id: 'photographers',
    label: 'Fotógrafos',
    icon: 'lucide:camera',
    count: searchPhotographers.value.length
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: 'lucide:users',
    count: searchUsers.value.length
  }
])

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
      searchEvents.value = rawEvents

      // Fotógrafos
      const rawPhotographers = Array.isArray(photographersRes) ? photographersRes : []
      searchPhotographers.value = rawPhotographers

      // Usuarios
      const rawUsers = Array.isArray(usersRes) ? usersRes : []
      searchUsers.value = rawUsers
    } catch (e) {
      console.error("Error global search", e)
    } finally {
      isSearching.value = false
    }
  }, 220)
}

function applySuggestion(sug) {
  searchQuery.value = sug.replace(/^[^a-zA-Z0-9áéíóúÁÉÍÓÚ]+/, '').trim()
  handleSearch()
}

function handleEnterSearch() {
  if (searchEvents.value.length === 1 && searchActiveTab.value === 'events') {
    goToEvent(searchEvents.value[0])
    return
  }
  goToExplorerWithQuery()
}

function goToExplorerWithQuery() {
  const q = searchQuery.value.trim()
  closeSearch()
  router.push({
    path: '/photographers',
    query: q ? { q, tab: searchActiveTab.value === 'all' ? 'events' : searchActiveTab.value } : {}
  })
}

function clearSearch() {
  searchQuery.value = ''
  searchEvents.value = []
  searchPhotographers.value = []
  searchUsers.value = []
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

// Global hotkey listener (Cmd+K / Ctrl+K)
function handleGlobalKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchFocused.value = true
    setTimeout(() => {
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    }, 50)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

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

.animate-dropdown {
  animation: dropdownAnim 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropdownAnim {
  from {
    opacity: 0;
    transform: translate(-50%, -8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
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
