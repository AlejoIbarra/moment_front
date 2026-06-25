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
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
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
      const data: any = await $api('/auth/signin', {
        method: 'POST',
        body: { username, password }
      })
      if (data.requires2fa) {
        return { requires2fa: true, username: data.username, email: data.email }
      }
      setAuth(data)
      return { requires2fa: false }
    } catch (e) {
      console.error('Login error:', e)
      throw e
    }
  }

  async function verify2fa(username, code) {
    const { $api } = useNuxtApp()
    try {
      const data: any = await $api('/auth/verify-2fa', {
        method: 'POST',
        body: { username, code }
      })
      setAuth(data)
      return true
    } catch (e) {
      console.error('2FA verification error:', e)
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
          role: userData.role.toUpperCase(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone
        }
      })
      return { success: true }
    } catch (e: any) {
      console.error('Registration error:', e)
      const data = e.response?._data || e.data
      let message = 'Error en el registro'
      if (data && data.message) {
        if (data.message.includes('Username is already taken')) {
          message = 'El nombre de usuario ya está registrado.'
        } else if (data.message.includes('Email is already in use')) {
          message = 'El correo electrónico ya está registrado.'
        } else {
          message = data.message
        }
      }
      return { success: false, error: message }
    }
  }

  return { token, user, isAuthenticated, isPhotographer, isCustomer, setAuth, updateUserData, logout, init, login, verify2fa, register }
})
