<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
    <div class="w-full max-w-[350px] space-y-3">
      <!-- Register Card -->
      <div class="ig-card p-10 flex flex-col items-center">
        <h1 class="text-4xl font-black tracking-tighter italic mb-4 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent" style="font-family: 'Inter', sans-serif;">Moment</h1>
        <p class="text-[17px] font-semibold text-gray-400 text-center mb-6 leading-5">{{ $t('register.subtitle') }}</p>
        
        <form @submit.prevent="handleRegister" class="w-full space-y-2">
          <input 
            v-model="registrationForm.email"
            type="email" 
            :placeholder="$t('register.email')" 
            class="ig-input h-[38px]"
            required
          />
          <input 
            v-model="registrationForm.username"
            type="text" 
            :placeholder="$t('register.username')" 
            class="ig-input h-[38px]"
            required
          />
          <input 
            v-model="registrationForm.password"
            type="password" 
            :placeholder="$t('register.password')" 
            class="ig-input h-[38px]"
            required
          />

          <!-- Role Selection -->
          <div class="flex space-x-2 mt-4">
              <button 
                type="button"
                @click="registrationForm.role = 'customer'"
                :class="[registrationForm.role === 'customer' ? 'ig-btn-primary' : 'bg-gray-100 text-gray-500 border border-gray-200']"
                class="flex-1 py-1.5 rounded-[4px] text-xs font-semibold"
              >
                {{ $t('register.customer') }}
              </button>
              <button 
                type="button"
                @click="registrationForm.role = 'photographer'"
                :class="[registrationForm.role === 'photographer' ? 'ig-btn-primary' : 'bg-gray-100 text-gray-500 border border-gray-200']"
                class="flex-1 py-1.5 rounded-[4px] text-xs font-semibold"
              >
                {{ $t('register.photographer') }}
              </button>
          </div>
          
          <button 
            type="submit" 
            class="ig-btn-primary w-full !mt-6 h-[30px] flex items-center justify-center"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="h-4 w-4 animate-spin mr-2" />
            {{ $t('register.submit') }}
          </button>
        </form>

        <p v-if="error" class="text-red-500 text-xs text-center mt-4">{{ error }}</p>
        
        <p class="text-xs text-center text-gray-400 mt-6 px-4">
            By signing up, you agree to our <strong>Terms</strong>, <strong>Privacy Policy</strong> and <strong>Cookies Policy</strong>.
        </p>
      </div>

      <!-- Log In Redirect -->
      <div class="ig-card p-6 text-center text-sm">
        {{ $t('register.has_account') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const router = useRouter()
const authStore = useAuthStore()

const registrationForm = reactive({
  username: '',
  password: '',
  email: '',
  role: 'customer'
})

const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    const success = await authStore.register({
      username: registrationForm.username,
      password: registrationForm.password,
      email: registrationForm.email,
      role: registrationForm.role
    })
    
    if (success) {
      router.push('/login')
    } else {
      error.value = 'Registration failed. Try a different username or email.'
    }
  } catch (err) {
    error.value = 'An error occurred during registration'
  } finally {
    loading.value = false
  }
}
</script>
