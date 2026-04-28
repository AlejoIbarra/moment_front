<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center cursor-pointer group" @click="router.push('/')">
            <h1
              class="text-2xl font-black tracking-tighter italic bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Moment
            </h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8" v-if="authStore.isAuthenticated">
            <NuxtLink v-if="authStore.isCustomer" to="/marketplace"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.marketplace') }}
            </NuxtLink>
            <NuxtLink v-if="authStore.isCustomer" to="/dashboard/customer"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.my_profile') }}
            </NuxtLink>
            <NuxtLink v-if="authStore.isPhotographer" to="/dashboard/photographer"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.dashboard') }}
            </NuxtLink>
            <NuxtLink to="/wallet"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.billetera') }}
            </NuxtLink>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
            <!-- Language Switcher -->
            <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-1 mr-2 border border-gray-100">
              <button v-for="locale in locales" :key="locale.code" @click="setLocale(locale.code)"
                :class="['px-2 py-1 text-xs font-bold rounded-md transition-all',
                  currentLocale === locale.code ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600']">
                {{ locale.code.toUpperCase() }}
              </button>
            </div>

            <NuxtLink to="/wallet"
              class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors group">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              <span class="text-sm font-bold">${{ walletStore.balance.toFixed(2) }}</span>
              <Icon name="lucide:plus" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NuxtLink>
            <NuxtLink
              :to="authStore.isPhotographer ? `/photographers/${authStore.user?.username}` : `/profile/${authStore.user?.username}`"
              class="flex items-center space-x-2 border-l border-gray-200 pl-4 hover:opacity-80 transition-opacity">
              <div v-if="authStore.user?.profilePhotoUrl"
                class="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <img :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
              </div>
              <div v-else
                class="w-8 h-8 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center">
                <span class="text-xs font-bold text-indigo-600">{{ authStore.user?.username?.charAt(0).toUpperCase() ||
                  'U' }}</span>
              </div>
              <span class="text-sm text-gray-500 hidden md:inline">{{ authStore.user?.username }}</span>
            </NuxtLink>
            <button @click="logout" class="text-gray-400 hover:text-gray-600 p-1" title="Logout">
              <Icon name="lucide:log-out" class="w-5 h-5" />
            </button>
          </div>
          <div v-else class="flex gap-4 items-center">
            <!-- Language Switcher for guests -->
            <div class="flex items-center gap-1 mr-2">
              <button v-for="locale in locales" :key="locale.code" @click="setLocale(locale.code)" :class="['text-xs font-bold uppercase transition-all px-2',
                currentLocale === locale.code ? 'text-indigo-600 underline' : 'text-gray-400 hover:text-gray-600']">
                {{ locale.code }}
              </button>
            </div>
            <NuxtLink to="/login" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">{{
              $t('common.login') }}</NuxtLink>
            <NuxtLink to="/register"
              class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-indigo-100">
              {{ $t('common.register') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const walletStore = useWalletStore()
const router = useRouter()
const { t, locale: currentLocale, locales, setLocale } = useI18n()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await walletStore.fetchBalance()
  }
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
