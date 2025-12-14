import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userName = computed(() => authStore.userName)
  const userAvatar = computed(() => authStore.userAvatar)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  async function login(credentials) {
    const success = await authStore.login(credentials)
    if (success) {
      router.push('/')
    }
    return success
  }

  function logout() {
    authStore.logout()
    router.push('/login')
  }

  return {
    isAuthenticated,
    user,
    userName,
    userAvatar,
    loading,
    error,
    login,
    logout
  }
}

