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
        <div class="hidden md:flex relative flex-1 max-w-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon name="lucide:search" class="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search events, photographers..." 
            class="w-full bg-gray-100/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 border-none transition-all placeholder:text-gray-400"
          />
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
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

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
