import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isPhotographer = computed(() => user.value?.roles?.includes('ROLE_PHOTOGRAPHER'))
  const isCustomer = computed(() => user.value?.roles?.includes('ROLE_CUSTOMER'))

  function setAuth(data: any) {
    if (process.client) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data))
    }
    token.value = data.token
    user.value = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
        profilePhotoUrl: data.profilePhotoUrl,
        description: data.description,
        title: data.title
    }
  }

  function updateUserData(updates: any) {
    if (user.value) {
        user.value = { ...user.value, ...updates }
        if (process.client) {
            localStorage.setItem('user', JSON.stringify(user.value))
        }
    }
  }

  function logout() {
    if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
    token.value = null
    user.value = null
  }

  function init() {
    if (process.client) {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
        }
    }
  }

  async function login(username, password) {
    const { $api } = useNuxtApp()
    try {
      const data = await $api('/auth/signin', {
        method: 'POST',
        body: { username, password }
      })
      setAuth(data)
      return true
    } catch (e) {
      console.error('Login error:', e)
      return false
    }
  }

  async function register(userData) {
    const { $api } = useNuxtApp()
    try {
      await $api('/auth/signup', {
        method: 'POST',
        body: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role.toUpperCase()
        }
      })
      return true
    } catch (e) {
      console.error('Registration error:', e)
      return false
    }
  }

  return { token, user, isAuthenticated, isPhotographer, isCustomer, setAuth, updateUserData, logout, init, login, register }
})
