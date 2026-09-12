<template>
  <div class="max-w-5xl mx-auto pt-6 pb-16 px-4">
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
        <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-[#3ef4a1]" />
        Explorador Visual Moments
      </span>
      <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Explorar Partidos y Álbumes</h1>
      <p class="text-sm text-gray-500">Encuentra tus fotos por partido, torneo, equipo, ciudad o fotógrafo profesional.</p>
    </div>

    <!-- Search Bar -->
    <div class="max-w-2xl mx-auto mb-6">
      <div class="relative">
        <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          class="w-full pl-12 pr-12 h-12 bg-white rounded-2xl border border-gray-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 font-medium"
          placeholder="Buscar por partido (ej: 'Final Fútbol', 'Millonarios'), torneo, fotógrafo..."
          @input="handleSearch"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <!-- Quick chips -->
      <div class="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
        <span class="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">Sugerencias:</span>
        <button
          v-for="chip in popularChips"
          :key="chip"
          @click="selectChip(chip)"
          class="px-2.5 py-1 rounded-xl bg-gray-100/80 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 transition-colors font-medium border border-transparent hover:border-indigo-100"
        >
          {{ chip }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="max-w-xl mx-auto mb-8">
      <div class="flex p-1 bg-gray-100/80 rounded-2xl border border-gray-200/50">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl transition-all',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm shadow-black/5'
              : 'text-gray-500 hover:text-gray-800'
          ]"
        >
          <Icon :name="tab.icon" class="h-4 w-4" />
          <span>{{ tab.label }}</span>
          <span
            v-if="getTabCount(tab.id) > 0"
            :class="[
              'ml-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full',
              activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-600'
            ]"
          >
            {{ getTabCount(tab.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="w-full">

      <!-- ===== TAB: EVENTOS & PARTIDOS (VISUAL GRID) ===== -->
      <div v-show="activeTab === 'events'">
        <div v-if="pendingEvents" class="flex flex-col items-center py-20 text-gray-400">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-3 text-indigo-500" />
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Buscando partidos y álbumes...</span>
        </div>

        <div v-else-if="events.length === 0" class="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 text-sm max-w-lg mx-auto p-8">
          <Icon name="lucide:search-x" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 class="font-bold text-gray-800 text-base mb-1">No se encontraron partidos o álbumes</h3>
          <p class="text-xs text-gray-400">
            {{ searchQuery ? `No hay resultados para "${searchQuery}". Intenta con otros términos.` : 'No hay eventos disponibles en este momento.' }}
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventVisualCard
            v-for="event in events"
            :key="'event-grid-' + (event.uuid || event.id)"
            :event="event"
            :compact="false"
            @click="goToEvent(event)"
          />
        </div>
      </div>

      <!-- ===== TAB: FOTÓGRAFOS ===== -->
      <div v-show="activeTab === 'photographers'">
        <div v-if="pendingPhotographers" class="flex flex-col items-center py-20 text-gray-400">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-3 text-indigo-500" />
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Cargando fotógrafos...</span>
        </div>

        <div v-else-if="photographers.length === 0" class="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 text-sm max-w-lg mx-auto p-8">
          <Icon name="lucide:camera" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 class="font-bold text-gray-800 text-base mb-1">No se encontraron fotógrafos</h3>
          <p class="text-xs text-gray-400">No encontramos fotógrafos coincidentes con tu búsqueda.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div
            v-for="photographer in visiblePhotographers"
            :key="'p-card-' + photographer.id"
            class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div class="flex items-center space-x-3.5 cursor-pointer" @click="goToProfile(photographer.username)">
              <div class="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-[#3ef4a1] to-indigo-500 flex-shrink-0">
                <div class="bg-white p-[2px] rounded-full w-full h-full">
                  <div class="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden">
                    <img v-if="photographer.profilePhotoUrl" :src="photographer.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                    <span v-else class="text-base font-bold text-indigo-600">{{ photographer.username.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-gray-900 truncate hover:text-indigo-600 transition-colors">{{ photographer.username }}</p>
                <p class="text-xs text-gray-400">{{ photographer.followerCount || 0 }} seguidores</p>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 mt-0.5">
                  <Icon name="lucide:camera" class="w-3 h-3" /> Fotógrafo Verificado
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-gray-50">
              <button
                v-if="authStore.isAuthenticated && authStore.user?.username !== photographer.username"
                @click="toggleFollow(photographer)"
                :class="[
                  'flex-1 py-1.5 px-3 text-xs font-bold rounded-xl transition-all',
                  photographer.isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-800 shadow-sm'
                ]"
              >
                {{ photographer.isFollowing ? 'Siguiendo' : 'Seguir' }}
              </button>
              <button
                @click="goToProfile(photographer.username)"
                class="flex-1 py-1.5 px-3 text-xs font-bold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Ver Perfil
              </button>
            </div>
          </div>
        </div>

        <div v-if="photographersLimit < photographers.length" class="text-center mt-6">
          <button @click="photographersLimit += 12" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors">
            Cargar más fotógrafos
          </button>
        </div>
      </div>

      <!-- ===== TAB: USUARIOS ===== -->
      <div v-show="activeTab === 'users'">
        <div v-if="pendingUsers" class="flex flex-col items-center py-20 text-gray-400">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-3 text-indigo-500" />
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Buscando usuarios...</span>
        </div>

        <div v-else-if="users.length === 0" class="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 text-sm max-w-lg mx-auto p-8">
          <Icon name="lucide:users" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 class="font-bold text-gray-800 text-base mb-1">No se encontraron usuarios</h3>
          <p class="text-xs text-gray-400">Prueba con otro nombre de usuario.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div
            v-for="user in visibleUsers"
            :key="'u-card-' + user.id"
            class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div class="flex items-center space-x-3.5 cursor-pointer" @click="goToProfile(user.username)">
              <div class="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="user.profilePhotoUrl" :src="user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                <span v-else class="text-base font-bold text-gray-500">{{ user.username.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-gray-900 truncate hover:text-indigo-600 transition-colors">{{ user.username }}</p>
                <p class="text-xs text-gray-400 truncate">{{ user.firstName ? (user.firstName + ' ' + (user.lastName || '')) : 'Usuario' }}</p>
                <span class="text-[10px] text-gray-400">{{ user.followerCount || 0 }} seguidores</span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-gray-50">
              <button
                v-if="authStore.isAuthenticated && authStore.user?.username !== user.username"
                @click="toggleFollow(user)"
                :class="[
                  'flex-1 py-1.5 px-3 text-xs font-bold rounded-xl transition-all',
                  user.isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-800 shadow-sm'
                ]"
              >
                {{ user.isFollowing ? 'Siguiendo' : 'Seguir' }}
              </button>
              <button
                @click="goToProfile(user.username)"
                class="flex-1 py-1.5 px-3 text-xs font-bold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Ver Perfil
              </button>
            </div>
          </div>
        </div>

        <div v-if="usersLimit < users.length" class="text-center mt-6">
          <button @click="usersLimit += 12" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors">
            Cargar más usuarios
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const config = useRuntimeConfig()

// ── State ──────────────────────────────────────────────
const searchQuery = ref(route.query.q || '')
const activeTab = ref(route.query.tab || 'events')

const popularChips = [
  '⚽ Fútbol',
  '🏆 Final',
  '🎾 Tenis',
  '🏃 Atletismo',
  '🏀 Baloncesto',
  'Bogotá'
]

watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
})

watch(searchQuery, (newQuery) => {
  const query = { ...route.query }
  if (newQuery) {
    query.q = newQuery
  } else {
    delete query.q
  }
  router.replace({ query })
})

const events = ref([])
const photographers = ref([])
const users = ref([])

const pendingEvents = ref(false)
const pendingPhotographers = ref(false)
const pendingUsers = ref(false)

const photographersLimit = ref(12)
const usersLimit = ref(12)

const visiblePhotographers = computed(() => photographers.value.slice(0, photographersLimit.value))
const visibleUsers = computed(() => users.value.slice(0, usersLimit.value))

// ── Tabs ───────────────────────────────────────────────
const tabs = [
  { id: 'events',        label: 'Partidos y Álbumes', icon: 'lucide:trophy'   },
  { id: 'photographers', label: 'Fotógrafos',         icon: 'lucide:camera'   },
  { id: 'users',         label: 'Usuarios',           icon: 'lucide:users'    },
]

function getTabCount(tabId) {
  if (tabId === 'events') return events.value.length
  if (tabId === 'photographers') return photographers.value.length
  if (tabId === 'users') return users.value.length
  return 0
}

function selectChip(chip) {
  searchQuery.value = chip.replace(/^[^a-zA-Z0-9áéíóúÁÉÍÓÚ]+/, '').trim()
  fetchAll()
}

function clearSearch() {
  searchQuery.value = ''
  fetchAll()
}

// ── Fetch ──────────────────────────────────────────────
async function fetchAll() {
  await Promise.all([fetchEvents(), fetchPhotographers(), fetchUsers()])
}

async function fetchEvents() {
  pendingEvents.value = true
  try {
    const url = new URL(`${config.public.apiBase}/events`)
    if (searchQuery.value) url.searchParams.append('query', searchQuery.value)
    url.searchParams.append('page', '0')
    url.searchParams.append('size', '40')
    const data = await $fetch(url.toString(), {
      headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
    })
    events.value = data.content ?? data ?? []
  } catch (e) {
    console.error('Error fetching events:', e)
    events.value = []
  } finally {
    pendingEvents.value = false
  }
}

async function fetchPhotographers() {
  pendingPhotographers.value = true
  photographersLimit.value = 12
  try {
    const url = new URL(`${config.public.apiBase}/users/photographers`)
    if (searchQuery.value) {
      url.searchParams.append('query', searchQuery.value)
    }
    const data = await $fetch(url.toString(), {
      headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
    })
    photographers.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Error fetching photographers:', e)
    photographers.value = []
  } finally {
    pendingPhotographers.value = false
  }
}

async function fetchUsers() {
  pendingUsers.value = true
  usersLimit.value = 12
  try {
    const url = new URL(`${config.public.apiBase}/users/search`)
    if (searchQuery.value) {
      url.searchParams.append('query', searchQuery.value)
    }
    const data = await $fetch(url.toString(), {
      headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
    })
    users.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Error fetching users:', e)
    users.value = []
  } finally {
    pendingUsers.value = false
  }
}

// ── Search debounce ────────────────────────────────────
let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(fetchAll, 300)
}

// ── Follow ─────────────────────────────────────────────
async function toggleFollow(person) {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para seguir a alguien.')
    return
  }
  try {
    const method = person.isFollowing ? 'DELETE' : 'POST'
    await $fetch(`${config.public.apiBase}/users/${person.id}/follow`, {
      method,
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    person.isFollowing = !person.isFollowing
    person.followerCount += person.isFollowing ? 1 : -1
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudo completar la acción.')
  }
}

// ── Navigation ─────────────────────────────────────────
function goToProfile(username) {
  router.push(`/profile/${encodeURIComponent(username)}`)
}

function goToEvent(event) {
  const identifier = event.uuid || event.id
  router.push(`/marketplace/events/${identifier}`)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

// ── Init ───────────────────────────────────────────────
onMounted(fetchAll)
</script>
