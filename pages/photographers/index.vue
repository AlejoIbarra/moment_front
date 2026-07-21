<template>
  <div class="ig-container pt-8 px-4">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-[#262626] mb-2">Explorar</h1>
      <p class="text-sm text-gray-500">Descubre eventos, fotógrafos y usuarios.</p>
    </div>

    <!-- Search Bar -->
    <div class="max-w-[500px] mx-auto mb-6">
      <div class="relative">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          class="ig-input pl-10 h-10 !bg-white border-[#dbdbdb] focus:border-gray-400"
          placeholder="Buscar eventos, fotógrafos o usuarios..."
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="max-w-[600px] mx-auto mb-6">
      <div class="flex border-b border-[#dbdbdb]">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-widest border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-[#262626] text-[#262626]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          ]"
        >
          <Icon :name="tab.icon" class="h-3.5 w-3.5" />
          {{ tab.label }}
          <span
            v-if="getTabCount(tab.id) > 0"
            class="ml-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          >{{ getTabCount(tab.id) }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="max-w-[600px] mx-auto">

      <!-- ===== TAB: EVENTOS ===== -->
      <div v-show="activeTab === 'events'">
        <div v-if="pendingEvents" class="flex flex-col items-center py-20 text-gray-400">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-2" />
          <span class="text-xs font-bold uppercase tracking-widest">Buscando...</span>
        </div>
        <div v-else-if="events.length === 0" class="text-center py-20 bg-white border border-[#dbdbdb] rounded-sm text-gray-500 text-sm">
          No se encontraron eventos<span v-if="searchQuery"> para "{{ searchQuery }}"</span>.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="event in events"
            :key="event.id"
            class="flex items-center gap-4 p-4 bg-white border border-[#dbdbdb] rounded-sm hover:bg-gray-50 transition-colors cursor-pointer"
            @click="goToEvent(event.uuid || event.id)"
          >
            <div class="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                v-if="event.coverPhotoUrl || (event.previewPhotos && event.previewPhotos.length > 0)"
                :src="event.coverPhotoUrl || event.previewPhotos[0]"
                class="w-full h-full object-cover"
                alt="Event cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="lucide:image" class="h-6 w-6 text-gray-300" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-[#262626] truncate">{{ event.title }}</p>
              <p class="text-xs text-gray-500 truncate">{{ event.location }} · {{ formatDate(event.date) }}</p>
              <p class="text-xs text-gray-400 mt-0.5">por @{{ event.photographerUsername }}</p>
            </div>
            <div class="flex-shrink-0 text-right">
              <span class="text-xs text-gray-400">{{ event.photoCount }} fotos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== TAB: FOTÓGRAFOS ===== -->
      <div v-show="activeTab === 'photographers'">
        <div v-if="pendingPhotographers" class="flex flex-col items-center py-20 text-gray-400">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-2" />
          <span class="text-xs font-bold uppercase tracking-widest">Buscando...</span>
        </div>
        <div v-else-if="photographers.length === 0" class="text-center py-20 bg-white border border-[#dbdbdb] rounded-sm text-gray-500 text-sm">
          No se encontraron fotógrafos<span v-if="searchQuery"> para "{{ searchQuery }}"</span>.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="photographer in photographers"
            :key="photographer.id"
            class="flex items-center justify-between p-4 bg-white border border-[#dbdbdb] rounded-sm hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-4 cursor-pointer" @click="goToProfile(photographer.username)">
              <div class="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex-shrink-0">
                <div class="bg-white p-[1px] rounded-full w-full h-full">
                  <div class="w-full h-full rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img v-if="photographer.profilePhotoUrl" :src="photographer.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                    <span v-else class="text-lg font-bold text-indigo-600">{{ photographer.username.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold text-[#262626]">{{ photographer.username }}</p>
                <p class="text-xs text-gray-500">{{ photographer.followerCount }} seguidores · <span class="text-indigo-400 font-medium">Fotógrafo</span></p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                v-if="authStore.isAuthenticated && authStore.user?.username !== photographer.username"
                @click="toggleFollow(photographer)"
                :class="[
                  photographer.isFollowing
                    ? 'bg-white border border-[#dbdbdb] text-[#262626] hover:bg-gray-50'
                    : 'ig-btn-primary'
                ]"
                class="px-4 py-1.5 text-xs font-semibold rounded-[4px]"
              >
                {{ photographer.isFollowing ? 'Siguiendo' : 'Seguir' }}
              </button>
              <button @click="goToProfile(photographer.username)" class="px-4 py-1.5 text-xs font-semibold border border-[#dbdbdb] rounded-[4px] hover:bg-gray-50">
                Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== TAB: USUARIOS ===== -->
      <div v-show="activeTab === 'users'">
        <div v-if="pendingUsers" class="flex flex-col items-center py-20 text-gray-400">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-2" />
          <span class="text-xs font-bold uppercase tracking-widest">Buscando...</span>
        </div>
        <div v-else-if="users.length === 0" class="text-center py-20 bg-white border border-[#dbdbdb] rounded-sm text-gray-500 text-sm">
          No se encontraron usuarios<span v-if="searchQuery"> para "{{ searchQuery }}"</span>.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between p-4 bg-white border border-[#dbdbdb] rounded-sm hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-4 cursor-pointer" @click="goToProfile(user.username)">
              <div class="w-12 h-12 rounded-full flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                <img v-if="user.profilePhotoUrl" :src="user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                <span v-else class="text-lg font-bold text-gray-500">{{ user.username.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-[#262626]">{{ user.username }}</p>
                <p class="text-xs text-gray-500">{{ user.followerCount }} seguidores · <span class="text-gray-400">Usuario</span></p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                v-if="authStore.isAuthenticated && authStore.user?.username !== user.username"
                @click="toggleFollow(user)"
                :class="[
                  user.isFollowing
                    ? 'bg-white border border-[#dbdbdb] text-[#262626] hover:bg-gray-50'
                    : 'ig-btn-primary'
                ]"
                class="px-4 py-1.5 text-xs font-semibold rounded-[4px]"
              >
                {{ user.isFollowing ? 'Siguiendo' : 'Seguir' }}
              </button>
              <button @click="goToProfile(user.username)" class="px-4 py-1.5 text-xs font-semibold border border-[#dbdbdb] rounded-[4px] hover:bg-gray-50">
                Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const events = ref([])
const photographers = ref([])
const users = ref([])

const pendingEvents = ref(false)
const pendingPhotographers = ref(false)
const pendingUsers = ref(false)

// ── Tabs ───────────────────────────────────────────────
const tabs = [
  { id: 'events',        label: 'Eventos',    icon: 'lucide:calendar' },
  { id: 'photographers', label: 'Fotógrafos', icon: 'lucide:camera'   },
  { id: 'users',         label: 'Usuarios',   icon: 'lucide:users'    },
]

function getTabCount(tabId) {
  if (tabId === 'events') return events.value.length
  if (tabId === 'photographers') return photographers.value.length
  if (tabId === 'users') return users.value.length
  return 0
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
    url.searchParams.append('size', '30')
    const data = await $fetch(url.toString(), {
      headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
    })
    events.value = data.content ?? data
  } catch (e) {
    console.error('Error fetching events:', e)
    events.value = []
  } finally {
    pendingEvents.value = false
  }
}

async function fetchPhotographers() {
  pendingPhotographers.value = true
  try {
    const url = new URL(`${config.public.apiBase}/users/photographers`)
    if (searchQuery.value) url.searchParams.append('query', searchQuery.value)
    const data = await $fetch(url.toString(), {
      headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
    })
    photographers.value = data
  } catch (e) {
    console.error('Error fetching photographers:', e)
    photographers.value = []
  } finally {
    pendingPhotographers.value = false
  }
}

async function fetchUsers() {
  pendingUsers.value = true
  try {
    const url = new URL(`${config.public.apiBase}/users/search`)
    if (searchQuery.value) url.searchParams.append('query', searchQuery.value)
    const data = await $fetch(url.toString(), {
      headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
    })
    users.value = data
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
  searchTimeout = setTimeout(fetchAll, 350)
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
  router.push(`/profile/${username}`)
}

function goToEvent(id) {
  router.push(`/marketplace/${id}`)
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
