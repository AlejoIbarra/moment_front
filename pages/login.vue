<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
    <div class="w-full max-w-[350px] space-y-3">
      <!-- Login Card -->
      <div class="ig-card p-10 flex flex-col items-center">
        <h1 class="text-4xl font-black tracking-tighter italic mb-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent" style="font-family: 'Inter', sans-serif;">Moment</h1>
        
        <form @submit.prevent="handleLogin" class="w-full space-y-2">
          <input 
            v-model="loginForm.username"
            type="text" 
            :placeholder="$t('login.username')" 
            class="ig-input h-[38px]"
            required
          />
          <input 
            v-model="loginForm.password"
            type="password" 
            :placeholder="$t('login.password')" 
            class="ig-input h-[38px]"
            required
          />
          
          <button 
            type="submit" 
            class="ig-btn-primary w-full !mt-4 h-[30px] flex items-center justify-center"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin mr-2" />
            {{ $t('login.submit') }}
          </button>
        </form>

        <p v-if="error" class="text-red-500 text-xs text-center mt-4">{{ error }}</p>
      </div>

      <!-- Sign Up Redirect -->
      <div class="ig-card p-6 text-center text-sm">
        {{ $t('login.no_account') }}
        <button @click="router.push('/register')" class="text-[#0095f6] font-semibold">Sign up</button>
      </div>

      <!-- Get the app -->
      <div class="text-center pt-2">
          <p class="text-sm">Get the app.</p>
          <div class="flex justify-center space-x-2 mt-4">
              <!-- App store badges placeholders -->
              <div class="h-10 w-32 bg-black rounded-md flex items-center justify-center text-white text-[10px] font-bold">App Store</div>
              <div class="h-10 w-32 bg-black rounded-md flex items-center justify-center text-white text-[10px] font-bold">Google Play</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false // Custom layout for login
})

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const success = await authStore.login(loginForm.username, loginForm.password)
    if (success) {
      router.push('/marketplace')
    } else {
      error.value = 'Invalid username or password'
    }
  } catch (err) {
    error.value = 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>
