import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || 'Guest')
  const userAvatar = computed(() => user.value?.avatar || '')

  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      const result = await authService.login(credentials)
      user.value = result.user
      token.value = result.token
      
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('token', result.token)
      
      return true
    } catch (e) {
      error.value = e.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userName,
    userAvatar,
    login,
    logout
  }
})

