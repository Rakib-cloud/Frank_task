<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { login, loading, error } = useAuth()

// Auto-fill credentials
const credentials = ref({
  username: 'admin',
  password: 'admin'
})

async function handleLogin() {
  await login(credentials.value)
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Login Form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="flex items-center gap-2 mb-10">
          <svg class="w-10 h-10" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="6" height="6" rx="1.5" fill="#3B82F6"/>
            <rect x="13" y="4" width="6" height="6" rx="1.5" fill="#3B82F6"/>
            <rect x="22" y="4" width="6" height="6" rx="1.5" fill="#3B82F6"/>
            <rect x="4" y="13" width="6" height="6" rx="1.5" fill="#3B82F6"/>
            <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#3B82F6"/>
            <rect x="4" y="22" width="6" height="6" rx="1.5" fill="#3B82F6"/>
            <rect x="13" y="22" width="6" height="6" rx="1.5" fill="#3B82F6"/>
          </svg>
          <span class="text-xl font-semibold text-slate-900">MyFrank</span>
        </div>

        <!-- Welcome Text -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p class="text-slate-500">Enter your credentials to access your account</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
        >
          {{ error }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <BaseInput
            v-model="credentials.username"
            label="Username"
            placeholder="Enter your username"
            size="lg"
            disabled
            required
          />

          <BaseInput
            v-model="credentials.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            size="lg"
            disabled
            required
          />

          <div class="flex items-center justify-end">
            <a href="#" class="text-sm text-blue-500 hover:text-blue-600 font-medium">
              Forgot password?
            </a>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            full-width
          >
            Sign In
          </BaseButton>
        </form>

        <!-- Footer -->
        <p class="mt-8 text-center text-sm text-slate-500">
          Don't have an account?
          <a href="#" class="text-blue-500 hover:text-blue-600 font-medium">
            Create account
          </a>
        </p>
      </div>
    </div>

    <!-- Right Side - Decorative (Lighter Blue) -->
    <div class="hidden lg:flex flex-1 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden items-center justify-center">
      <!-- Decorative Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-1/4 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
        <div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
      </div>

      <!-- Content - Centered -->
      <div class="relative z-10 text-white max-w-md px-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="p-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-3xl font-bold mb-1">2,847</p>
            <p class="text-white/80 text-sm">Total Reviews</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
              <svg class="w-6 h-6 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              4.8
            </p>
            <p class="text-white/80 text-sm">Average Rating</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-3xl font-bold mb-1">156</p>
            <p class="text-white/80 text-sm">Active Members</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-3xl font-bold mb-1">24</p>
            <p class="text-white/80 text-sm">Campaigns</p>
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">Manage Reviews & Grow Your Business</h2>
          <p class="text-white/80 leading-relaxed">
            MyFrank helps you manage reviews, track team performance, and analyze competitors - all in one place.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
