<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Photographer Portal
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Exclusive access for event photographers
        </p>
      </div>
      
      <!-- Login / Register Tabs -->
      <div class="flex justify-center border-b border-gray-200">
        <button @click="mode = 'login'" :class="[mode === 'login' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200']">
          Sign In
        </button>
        <button @click="mode = 'register'" :class="[mode === 'register' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200']">
          Register
        </button>
      </div>

      <!-- Login Form -->
      <form v-if="mode === 'login'" class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="login-username" class="sr-only">Username</label>
            <input id="login-username" type="text" v-model="loginForm.username" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" />
          </div>
          <div>
            <label for="login-password" class="sr-only">Password</label>
            <input id="login-password" type="password" v-model="loginForm.password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
          </div>
        </div>
        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none">
            Enter Dashboard
          </button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-if="mode === 'register'" class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="reg-username" class="sr-only">Username</label>
            <input id="reg-username" type="text" v-model="registerForm.username" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" />
          </div>
          <div>
            <label for="reg-email" class="sr-only">Email address</label>
            <input id="reg-email" type="email" v-model="registerForm.email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
          </div>
          <div>
            <label for="reg-password" class="sr-only">Password</label>
            <input id="reg-password" type="password" v-model="registerForm.password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
          </div>
        </div>
        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none">
            Apply as Photographer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const config = useRuntimeConfig()

const mode = ref('login') // 'login' or 'register'
const error = ref('')

const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '', role: 'PHOTOGRAPHER' })

async function handleLogin() {
  error.value = ''
  try {
    const data = await $fetch(`${config.public.apiBase}/auth/signin`, {
      method: 'POST',
      body: loginForm.value
    })
    authStore.setAuth(data)
    
    if (authStore.isPhotographer) {
        router.push('/dashboard/photographer')
    } else {
        error.value = 'Access Denied. You are not registered as a Photographer.'
        authStore.logout()
    }
  } catch (e) {
    error.value = 'Invalid username or password'
  }
}

async function handleRegister() {
  error.value = ''
  try {
    await $fetch(`${config.public.apiBase}/auth/signup`, {
      method: 'POST',
      body: registerForm.value
    })
    
    // Switch to login tab
    mode.value = 'login'
    loginForm.value.username = registerForm.value.username
    loginForm.value.password = registerForm.value.password // auto-fill for convenience
    error.value = 'Registration successful. Please sign in.'
  } catch (e) {
    error.value = e.response?._data || 'Registration failed'
  }
}
</script>
