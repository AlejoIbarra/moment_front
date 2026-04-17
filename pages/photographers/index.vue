<template>
  <div class="ig-container pt-8 px-4">
    <!-- Header -->
    <div class="mb-10 text-center">
      <h1 class="text-2xl font-bold text-[#262626] mb-2">Explore Photographers</h1>
      <p class="text-sm text-gray-500">Discover talented creators and follow their work.</p>
    </div>

    <!-- Search Bar -->
    <div class="max-w-[400px] mx-auto mb-12">
      <div class="relative">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          class="ig-input pl-10 h-10 !bg-white border-[#dbdbdb] focus:border-gray-400"
          placeholder="Search creators..."
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Results List -->
    <div class="max-w-[600px] mx-auto space-y-4">
      <div v-if="pending" class="flex flex-col items-center py-20 text-gray-400">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-2" />
          <span class="text-xs font-bold uppercase tracking-widest">Searching...</span>
      </div>
      
      <div v-else-if="photographers.length === 0" class="text-center py-20 bg-white border border-[#dbdbdb] rounded-sm text-gray-500">
          No photographers found matching "{{ searchQuery }}".
      </div>

      <div v-else class="space-y-2">
        <div 
          v-for="photographer in photographers" 
          :key="photographer.id" 
          class="flex items-center justify-between p-4 bg-white border border-[#dbdbdb] rounded-sm hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-4 cursor-pointer" @click="goToProfile(photographer.username)">
            <div class="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                <div class="bg-white p-[1px] rounded-full w-full h-full">
                    <div class="w-full h-full rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img v-if="photographer.profilePhotoUrl" :src="photographer.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
                        <span v-else class="text-lg font-bold text-indigo-600">{{ photographer.username.charAt(0).toUpperCase() }}</span>
                    </div>
                </div>
            </div>
            <div>
                <p class="text-sm font-semibold text-[#262626]">{{ photographer.username }}</p>
                <p class="text-xs text-gray-500">{{ photographer.followerCount }} followers</p>
            </div>
          </div>

          <div class="flex space-x-2">
              <button 
                v-if="authStore.isCustomer"
                @click="toggleFollow(photographer)"
                :class="[
                    photographer.isFollowing 
                    ? 'bg-white border border-[#dbdbdb] text-[#262626] hover:bg-gray-50' 
                    : 'ig-btn-primary'
                ]"
                class="px-4 py-1.5 text-xs font-semibold rounded-[4px]"
              >
                {{ photographer.isFollowing ? 'Following' : 'Follow' }}
              </button>
              <button @click="goToProfile(photographer.username)" class="px-4 py-1.5 text-xs font-semibold border border-[#dbdbdb] rounded-[4px] hover:bg-gray-50">
                  Profile
              </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Suggested For You (Visual Filler) -->
    <div v-if="!searchQuery && !pending" class="max-w-[600px] mx-auto mt-12">
        <h3 class="text-sm font-semibold text-gray-500 mb-4">Suggested for you</h3>
        <div class="space-y-4 opacity-40 grayscale pointer-events-none">
             <div class="flex items-center justify-between">
                 <div class="flex items-center space-x-3">
                     <div class="w-8 h-8 rounded-full bg-gray-200"></div>
                     <div class="space-y-1">
                         <div class="h-2 w-20 bg-gray-200 rounded"></div>
                         <div class="h-2 w-10 bg-gray-100 rounded"></div>
                     </div>
                 </div>
                 <div class="h-6 w-14 bg-gray-100 rounded"></div>
             </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const config = useRuntimeConfig()

const searchQuery = ref(route.query.q || '')
const photographers = ref([])
const pending = ref(true)

onMounted(async () => {
    await fetchPhotographers()
})

async function fetchPhotographers() {
    pending.value = true
    try {
        const url = new URL(`${config.public.apiBase}/users/photographers`)
        if (searchQuery.value) {
            url.searchParams.append('query', searchQuery.value)
        }
        
        const data = await $fetch(url.toString(), {
            headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
        })
        photographers.value = data
    } catch (e) {
        console.error(e)
    } finally {
        pending.value = false
    }
}

let searchTimeout = null
function handleSearch() {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(fetchPhotographers, 300)
}

async function toggleFollow(photographer) {
    try {
        const method = photographer.isFollowing ? 'DELETE' : 'POST'
        await $fetch(`${config.public.apiBase}/users/photographers/${photographer.id}/follow`, {
            method,
            headers: { 'Authorization': `Bearer ${authStore.token}` }
        })
        photographer.isFollowing = !photographer.isFollowing
        photographer.followerCount += photographer.isFollowing ? 1 : -1
    } catch (e) {
        console.error(e)
        alert('Action failed. Make sure you are logged in.')
    }
}

function goToProfile(username) {
    router.push(`/photographers/${username}`)
}
</script>
