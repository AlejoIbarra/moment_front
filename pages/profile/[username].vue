<template>
  <div class="min-h-screen bg-gray-50/50 pb-20">
    <!-- Premium Header Background -->
    <div class="h-64 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20 -mt-24 relative z-10">
      <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!profile" class="text-center py-20 -mt-24 relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl max-w-5xl mx-auto p-10">
      <div class="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:user-x" class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">User not found</h3>
      <p class="text-gray-500">This profile doesn't exist or has been removed.</p>
    </div>

    <div v-else class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
      <!-- Profile Card -->
      <div class="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-900/5 rounded-3xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 transition-all hover:shadow-indigo-900/10">
        
        <!-- Avatar -->
        <div class="relative shrink-0">
          <div class="w-36 h-36 md:w-44 md:h-44 rounded-[2rem] bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-xl transition-transform duration-500 hover:scale-105 hover:rotate-3">
            <div class="w-full h-full rounded-[1.8rem] bg-white p-1">
              <div class="w-full h-full rounded-[1.6rem] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="profile.profilePhotoUrl" :src="profile.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
                <Icon v-else name="lucide:user" class="w-16 h-16 text-gray-300" />
              </div>
            </div>
          </div>
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg bg-indigo-600 text-white border-2 border-white">
            <span v-if="profile.role === 'PHOTOGRAPHER'">📷 Fotógrafo</span>
            <span v-else>✨ {{ profile.title || 'Coleccionista' }}</span>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 text-center md:text-left mt-2 md:mt-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ profile.username }}</h2>
              <div class="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span class="text-sm font-medium text-gray-400">Miembro desde {{ profile.memberSince }}</span>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button v-if="isOwnProfile" @click="router.push('/dashboard/customer')"
                class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                <Icon name="lucide:edit-3" class="w-4 h-4" />
                Editar Perfil
              </button>
            </div>
          </div>

          <p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0 whitespace-pre-wrap">
            {{ profile.description || (profile.role === 'PHOTOGRAPHER' 
                ? 'Fotógrafo profesional capturando los mejores momentos.' 
                : 'Coleccionista de grandes recuerdos.') }}
          </p>

          <div class="flex items-center justify-center md:justify-start gap-8 mt-6 pt-6 border-t border-gray-100">
            <div class="text-center md:text-left">
              <span class="block text-2xl font-black text-indigo-600">{{ collection.length }}</span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Fotos</span>
            </div>
            <div class="text-center md:text-left cursor-pointer group" @click="openFollowModal('followers')">
              <span class="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{{ profile.followerCount }}</span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Seguidores</span>
            </div>
            <div class="text-center md:text-left cursor-pointer group" @click="openFollowModal('following')">
              <span class="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{{ profile.followingCount }}</span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Seguidos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Tabs -->
      <div class="flex flex-wrap justify-center gap-2 mb-10 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 mx-auto w-fit">
        <button @click="currentTab = 'collection'" :class="['flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300',
          currentTab === 'collection' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:grid" class="w-4 h-4" />
          Colección
        </button>
        <button @click="currentTab = 'saved'" :class="['flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300',
          currentTab === 'saved' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:bookmark" class="w-4 h-4" />
          Guardadas
        </button>
      </div>

      <!-- Collection Grid -->
      <div class="relative animate-fade-in">
        <div v-if="loadingCollection" class="flex justify-center py-32">
          <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="collection.length === 0 && currentTab === 'collection'" class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div class="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
            <Icon name="lucide:camera" class="w-12 h-12 text-indigo-500" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Sin fotos</h3>
          <p class="text-gray-500 mb-8 max-w-md">{{ isOwnProfile ? 'Empieza a coleccionar momentos del marketplace.' : 'Este usuario aún no tiene fotos.' }}</p>
          <NuxtLink v-if="isOwnProfile" to="/marketplace" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2">
            Explorar el Marketplace <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Photos Grid (Premium) -->
        <div v-else-if="currentTab === 'collection'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="photo in collection" :key="photo.photoId"
            class="bg-white rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 hover:-translate-y-1 relative aspect-square"
            @click="openPhotoDetail(photo)">
            
            <img :src="photo.watermarkedUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
              <h4 class="text-white font-bold text-lg leading-tight mb-1">{{ photo.eventTitle }}</h4>
              <p class="text-gray-300 text-sm flex items-center gap-1.5">
                <Icon name="lucide:camera" class="w-3.5 h-3.5" />
                {{ photo.photographerUsername }}
              </p>
            </div>
            
            <div class="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
              <span class="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black text-gray-800 shadow-sm border border-white/50 flex items-center gap-1">
                <Icon name="lucide:image" class="w-3 h-3 text-indigo-500" /> View
              </span>
            </div>
          </div>
        </div>

        <!-- Saved Tab Placeholder -->
        <div v-else-if="currentTab === 'saved'" class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
            <Icon name="lucide:bookmark" class="w-12 h-12 text-gray-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Guardadas</h3>
          <p class="text-gray-500">Guarda fotos para revisarlas más tarde.</p>
        </div>
      </div>

      <!-- Photo Detail Modal -->
      <div v-if="selectedPhoto" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" @click.self="selectedPhoto = null">
        <button @click="selectedPhoto = null" class="absolute top-6 right-6 text-white/70 hover:text-white z-10">
          <Icon name="lucide:x" class="h-8 w-8" />
        </button>

        <div class="bg-white w-full max-w-4xl max-h-[85vh] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl" @click.stop>
          <!-- Photo -->
          <div class="flex-1 bg-black flex items-center justify-center">
            <img :src="selectedPhoto.watermarkedUrl" class="max-w-full max-h-full object-contain" />
          </div>

          <!-- Details -->
          <div class="w-full md:w-[320px] p-6 flex flex-col justify-between bg-white border-l border-gray-100">
            <div>
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-gray-100">
                  <span class="text-sm font-bold text-indigo-600">{{ selectedPhoto.photographerUsername?.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">@{{ selectedPhoto.photographerUsername }}</p>
                  <p class="text-xs text-gray-500">{{ selectedPhoto.eventTitle }}</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-xs text-gray-500 font-medium">Purchased</span>
                  <span class="text-sm font-bold text-gray-900">{{ formatDate(selectedPhoto.purchasedAt) }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-xs text-gray-500 font-medium">Price Paid</span>
                  <span class="text-sm font-bold text-green-600">${{ selectedPhoto.price?.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <button v-if="isOwnProfile" @click="downloadPhoto(selectedPhoto.photoId)"
              class="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg">
              <Icon name="lucide:download" class="w-5 h-5" />
              Download Original
            </button>
          </div>
        </div>
      </div>

      <!-- Followers/Following Modal -->
      <div v-if="showFollowListModal" class="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeFollowListModal">
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 capitalize">{{ followModalType === 'followers' ? 'Seguidores' : 'Seguidos' }}</h3>
            <button @click="closeFollowListModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="lucide:x" class="w-6 h-6" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div v-if="followListLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
            <div v-else-if="followList.length === 0" class="text-center py-8 text-gray-400">
              <Icon :name="followModalType === 'followers' ? 'lucide:users' : 'lucide:user-plus'" class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Sin {{ followModalType === 'followers' ? 'seguidores' : 'seguidos' }} aún.</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="user in followList" :key="user.id" class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 cursor-pointer overflow-hidden" @click="goToUserProfile(user.username)">
                  <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <img v-if="user.profilePhotoUrl" :src="user.profilePhotoUrl" class="w-full h-full object-cover" />
                    <Icon v-else name="lucide:user" class="text-gray-300 w-5 h-5" />
                  </div>
                  <div class="truncate">
                    <p class="text-sm font-bold text-gray-900 truncate">@{{ user.username }}</p>
                    <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">{{ user.role === 'PHOTOGRAPHER' ? 'Fotógrafo' : 'Coleccionista' }}</span>
                  </div>
                </div>
                <button
                  v-if="authStore.isAuthenticated && authStore.user?.username !== user.username && user.role === 'PHOTOGRAPHER'"
                  @click="toggleFollowUser(user)"
                  :class="['px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex-shrink-0 active:scale-95',
                    user.isFollowing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100']"
                >
                  {{ user.isFollowing ? 'Dejar de seguir' : 'Seguir' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const toast = useToast()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const config = useRuntimeConfig()

const username = route.params.username
const profile = ref(null)
const collection = ref([])
const loading = ref(true)
const loadingCollection = ref(false)
const currentTab = ref('collection')
const selectedPhoto = ref(null)

// Followers/Following Lists
const showFollowListModal = ref(false)
const followModalType = ref('followers')
const followList = ref([])
const followListLoading = ref(false)

async function openFollowModal(type) {
  followModalType.value = type
  showFollowListModal.value = true
  followListLoading.value = true
  try {
    const encodedUsername = encodeURIComponent(route.params.username)
    const data = await $fetch(`${config.public.apiBase}/users/profile/${encodedUsername}/${type}`, {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    })
    followList.value = data
  } catch (error) {
    console.error('Error fetching follow list:', error)
    toast.error('Error', 'No se pudo cargar la lista.')
    followList.value = []
  } finally {
    followListLoading.value = false
  }
}

function closeFollowListModal() {
  showFollowListModal.value = false
  followList.value = []
}

function goToUserProfile(targetUsername) {
  closeFollowListModal()
  router.push(`/profile/${encodeURIComponent(targetUsername)}`)
}

async function toggleFollowUser(user) {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para seguir usuarios.')
    return
  }
  try {
    if (user.isFollowing) {
      await $fetch(`${config.public.apiBase}/users/photographers/${user.id}/follow`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      user.isFollowing = false
    } else {
      await $fetch(`${config.public.apiBase}/users/photographers/${user.id}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      user.isFollowing = true
    }
    await fetchProfile()
  } catch (error) {
    console.error('Error toggling follow status:', error)
    toast.error('Error', 'No se pudo actualizar el estado de seguimiento.')
  }
}

const isOwnProfile = computed(() => {
  return authStore.isAuthenticated && authStore.user?.username === username
})

onMounted(async () => {
  await fetchProfile()
  await fetchCollection()
})

watch(() => route.params.username, async (newVal) => {
  if (newVal) {
    selectedPhoto.value = null
    closeFollowListModal()
    profile.value = null
    await fetchProfile()
    await fetchCollection()
  }
})

async function fetchProfile() {
  loading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/users/profile/${encodeURIComponent(username)}`)
    profile.value = data
  } catch (e) {
    console.error('Profile not found:', e)
    profile.value = null
  } finally {
    loading.value = false
  }
}

async function fetchCollection() {
  loadingCollection.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/users/profile/${encodeURIComponent(username)}/collection`)
    collection.value = data
  } catch (e) {
    console.error('Collection fetch error:', e)
    collection.value = []
  } finally {
    loadingCollection.value = false
  }
}

function openPhotoDetail(photo) {
  selectedPhoto.value = photo
  document.body.style.overflow = 'hidden'
}

async function downloadPhoto(photoId) {
  try {
    const res = await $fetch(`${config.public.apiBase}/photos/${photoId}/download`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const downloadUrl = res.presignedUrl || res
    
    if (downloadUrl && typeof downloadUrl === 'string') {
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `moment-photo-${photoId}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(objectUrl)
    } else {
      toast.error('Error', 'Failed to get download link')
    }
  } catch (e) {
    toast.error('Error', 'Failed to download photo')
    console.error(e)
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Watch for modal close
watch(selectedPhoto, (val) => {
  if (!val) document.body.style.overflow = ''
})
</script>
