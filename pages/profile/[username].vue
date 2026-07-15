<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!profile" class="text-center py-20">
      <div class="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:user-x" class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">User not found</h3>
      <p class="text-gray-500">This profile doesn't exist or has been removed.</p>
    </div>

    <template v-else>
      <!-- Profile Header (Instagram Style) -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-200 pb-12">
        <!-- Avatar -->
        <div class="relative">
          <div
            class="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 transition-transform hover:scale-105"
            :class="profile.role === 'PHOTOGRAPHER' 
              ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' 
              : 'bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-600'">
            <div class="w-full h-full rounded-full bg-white p-1">
              <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                <img v-if="profile.profilePhotoUrl" :src="profile.profilePhotoUrl" alt="Profile"
                  class="w-full h-full object-cover">
                <Icon v-else name="lucide:user" class="w-16 h-16 text-gray-300" />
              </div>
            </div>
          </div>
          <!-- Role Badge -->
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md"
            :class="profile.role === 'PHOTOGRAPHER' 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'">
            <span v-if="profile.role === 'PHOTOGRAPHER'">📷 Photographer</span>
            <span v-else>✨ {{ profile.title || 'Collector' }}</span>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="flex-1 text-center md:text-left">
          <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h2 class="text-2xl font-light text-gray-800">{{ profile.username }}</h2>
            <div class="flex items-center justify-center md:justify-start gap-2">
              <button v-if="isOwnProfile" @click="router.push('/dashboard/customer')"
                class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors">
                Edit Profile
              </button>
              <button v-if="isOwnProfile" @click="router.push('/dashboard/customer')"
                class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
                <Icon name="lucide:wallet" class="w-4 h-4" />
                Wallet
              </button>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex justify-center md:justify-start gap-8 mb-4 text-sm">
            <span><strong class="text-gray-900">{{ collection.length }}</strong> photos</span>
            <span @click="openFollowModal('followers')" class="cursor-pointer hover:underline"><strong class="text-gray-900">{{ profile.followerCount }}</strong> followers</span>
            <span @click="openFollowModal('following')" class="cursor-pointer hover:underline"><strong class="text-gray-900">{{ profile.followingCount }}</strong> following</span>
          </div>

          <div class="text-sm">
            <p class="font-semibold text-gray-900">Member since {{ profile.memberSince }}</p>
            <p class="text-gray-500 mt-1 whitespace-pre-wrap">
              {{ profile.description || (profile.role === 'PHOTOGRAPHER' 
                ? 'Professional photographer capturing life\'s best moments.' 
                : 'Collecting amazing moments through the lens of the world\'s best photographers.') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs (Instagram Style) -->
      <div class="flex justify-center gap-12 border-t border-gray-200">
        <button @click="currentTab = 'collection'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
          currentTab === 'collection' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
          <Icon name="lucide:grid" class="w-3 h-3" />
          Collection
        </button>
        <button @click="currentTab = 'saved'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
          currentTab === 'saved' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
          <Icon name="lucide:bookmark" class="w-3 h-3" />
          Saved
        </button>
      </div>

      <!-- Collection Grid -->
      <div class="mt-8">
        <div v-if="loadingCollection" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>

        <div v-else-if="collection.length === 0 && currentTab === 'collection'" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-20 h-20 rounded-full border-2 border-gray-900 flex items-center justify-center mb-4">
            <Icon name="lucide:camera" class="w-10 h-10 text-gray-900" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No photos yet</h3>
          <p class="text-gray-500 mb-6">{{ isOwnProfile ? 'Start collecting moments from the marketplace!' : 'This user hasn\'t collected any photos yet.' }}</p>
          <NuxtLink v-if="isOwnProfile" to="/marketplace" class="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
            Browse Marketplace
          </NuxtLink>
        </div>

        <!-- Photos Grid (3 columns Instagram style) -->
        <div v-else-if="currentTab === 'collection'" class="grid grid-cols-3 gap-1 md:gap-4">
          <div v-for="photo in collection" :key="photo.photoId"
            class="relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer rounded-sm md:rounded-lg"
            @click="openPhotoDetail(photo)">
            <img :src="photo.watermarkedUrl"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
            
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6">
              <div class="flex items-center gap-2 text-white font-bold text-sm">
                <Icon name="lucide:camera" class="w-5 h-5" />
                <span>{{ photo.eventTitle }}</span>
              </div>
            </div>

            <!-- Package badge (if part of a bundle) -->
            <div class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-700">
                by @{{ photo.photographerUsername }}
              </span>
            </div>
          </div>
        </div>

        <!-- Saved Tab Placeholder -->
        <div v-else-if="currentTab === 'saved'" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
            <Icon name="lucide:bookmark" class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Saved</h3>
          <p class="text-gray-500">Save photos to revisit them later.</p>
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
    const data = await $fetch(`${config.public.apiBase}/users/profile/${route.params.username}/${type}`, {
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
  router.push(`/profile/${targetUsername}`)
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
    const data = await $fetch(`${config.public.apiBase}/users/profile/${username}`)
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
    const data = await $fetch(`${config.public.apiBase}/users/profile/${username}/collection`)
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
    window.open(downloadUrl, '_blank')
  } catch (e) {
    toast.error('Download Error', 'Failed to download photo')
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
