<script setup>
import { useAuth } from '@/composables/useAuth'
import { useUIStore } from '@/stores/ui'
import BaseDropdown from '@/components/base/BaseDropdown.vue'

const { userName, userAvatar, logout } = useAuth()
const uiStore = useUIStore()

function toggleMobileSidebar() {
  uiStore.toggleMobileSidebar()
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white border-b border-slate-200">
    <div class="h-14 px-6 flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          @click="toggleMobileSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- New Feature Banner -->
        <div class="hidden sm:flex items-center gap-2 px-1 py-1 bg-slate-900 rounded-full">
          <span class="px-2.5 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
            New Feature
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </span>
          <span class="text-sm text-white pr-3">Control Center is now live !</span>
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-2">
        <!-- User Selector -->
        <BaseDropdown align="right">
          <template #trigger>
            <button class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span class="text-sm text-slate-700">Frank</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </template>
          <div class="py-1">
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Frank</a>
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">John</a>
          </div>
        </BaseDropdown>

        <!-- Language Selector -->
        <BaseDropdown align="right">
          <template #trigger>
            <button class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
              <span class="text-sm text-slate-700">English</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </template>
          <div class="py-1">
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">English</a>
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">French</a>
          </div>
        </BaseDropdown>

        <!-- User Profile -->
        <BaseDropdown align="right">
          <template #trigger>
            <button class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">
              <img
                :src="userAvatar"
                :alt="userName"
                class="w-8 h-8 rounded-full object-cover"
              >
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-slate-900 leading-tight">{{ userName }}</p>
                <p class="text-xs text-slate-500">Manager</p>
              </div>
            </button>
          </template>
          <div class="py-1">
            <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Profile
            </a>
            <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Settings
            </a>
            <hr class="my-1 border-slate-200">
            <button
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </BaseDropdown>
      </div>
    </div>
  </header>
</template>
