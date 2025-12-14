<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUIStore } from '@/stores/ui'
import BaseDropdown from '@/components/base/BaseDropdown.vue'

const { userName, userAvatar, logout } = useAuth()
const uiStore = useUIStore()

// Establishment dropdown state
const establishments = ref([
  { id: 1, name: 'Establishment 1' },
  { id: 2, name: 'Establishment 2' },
  { id: 3, name: 'Establishment 3' }
])
const selectedEstablishment = ref(establishments.value[0])
const establishmentSearch = ref('')

const filteredEstablishments = computed(() => {
  if (!establishmentSearch.value) return establishments.value
  return establishments.value.filter(e => 
    e.name.toLowerCase().includes(establishmentSearch.value.toLowerCase())
  )
})

function selectEstablishment(establishment) {
  selectedEstablishment.value = establishment
  establishmentSearch.value = ''
}

function toggleMobileSidebar() {
  uiStore.toggleMobileSidebar()
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white border-b border-slate-200">
    <!-- Mobile Header -->
    <div class="lg:hidden px-4 py-3">
      <div class="flex items-center gap-3">
        <!-- Establishment Dropdown -->
        <BaseDropdown align="left" class="flex-1">
          <template #trigger>
            <button class="w-full flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-full bg-white hover:bg-slate-50 cursor-pointer transition-colors">
              <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span class="flex-1 text-left text-sm text-slate-600 truncate">{{ selectedEstablishment.name }}</span>
              <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </template>
          <div class="min-w-[220px]">
            <!-- Search Input -->
            <div class="p-2 border-b border-slate-100">
              <div class="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input 
                  v-model="establishmentSearch"
                  type="text" 
                  :placeholder="selectedEstablishment.name"
                  class="flex-1 text-sm text-slate-600 placeholder-slate-400 bg-transparent border-none focus:outline-none"
                >
              </div>
            </div>
            <!-- Establishment List -->
            <div class="py-1 max-h-[200px] overflow-y-auto">
              <button
                v-for="establishment in filteredEstablishments"
                :key="establishment.id"
                class="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                @click="selectEstablishment(establishment)"
              >
                <span>{{ establishment.name }}</span>
                <svg 
                  v-if="selectedEstablishment.id === establishment.id" 
                  class="w-4 h-4 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
              <p v-if="filteredEstablishments.length === 0" class="px-4 py-3 text-sm text-slate-400 text-center">
                No establishments found
              </p>
            </div>
          </div>
        </BaseDropdown>
        
        <!-- Globe/Language -->
        <button class="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
        </button>
        
        <!-- User Avatar -->
        <BaseDropdown align="right">
          <template #trigger>
            <button class="cursor-pointer">
              <img
                :src="userAvatar"
                :alt="userName"
                class="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
              >
            </button>
          </template>
          <div class="py-1 min-w-[160px]">
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="text-sm font-medium text-slate-900">{{ userName }}</p>
              <p class="text-xs text-slate-500">Manager</p>
            </div>
            <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
              Profile
            </a>
            <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
              Settings
            </a>
            <hr class="my-1 border-slate-200">
            <button
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </BaseDropdown>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden lg:flex h-14 px-6 items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center gap-4">
        <!-- New Feature Banner -->
        <div class="flex items-center gap-2 px-1 py-1 bg-slate-900 rounded-full">
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
        <!-- Establishment Selector -->
        <BaseDropdown align="right">
          <template #trigger>
            <button class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span class="text-sm text-slate-700">{{ selectedEstablishment.name }}</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </template>
          <div class="min-w-[220px]">
            <!-- Search Input -->
            <div class="p-2 border-b border-slate-100">
              <div class="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input 
                  v-model="establishmentSearch"
                  type="text" 
                  :placeholder="selectedEstablishment.name"
                  class="flex-1 text-sm text-slate-600 placeholder-slate-400 bg-transparent border-none focus:outline-none"
                >
              </div>
            </div>
            <!-- Establishment List -->
            <div class="py-1 max-h-[200px] overflow-y-auto">
              <button
                v-for="establishment in filteredEstablishments"
                :key="establishment.id"
                class="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                @click="selectEstablishment(establishment)"
              >
                <span>{{ establishment.name }}</span>
                <svg 
                  v-if="selectedEstablishment.id === establishment.id" 
                  class="w-4 h-4 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
              <p v-if="filteredEstablishments.length === 0" class="px-4 py-3 text-sm text-slate-400 text-center">
                No establishments found
              </p>
            </div>
          </div>
        </BaseDropdown>

        <!-- Language Selector -->
        <BaseDropdown align="right">
          <template #trigger>
            <button class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
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
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">English</a>
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">French</a>
          </div>
        </BaseDropdown>

        <!-- User Profile -->
        <BaseDropdown align="right">
          <template #trigger>
            <button class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <img
                :src="userAvatar"
                :alt="userName"
                class="w-8 h-8 rounded-full object-cover"
              >
              <div class="text-left">
                <p class="text-sm font-medium text-slate-900 leading-tight">{{ userName }}</p>
                <p class="text-xs text-slate-500">Manager</p>
              </div>
            </button>
          </template>
          <div class="py-1">
            <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
              Profile
            </a>
            <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
              Settings
            </a>
            <hr class="my-1 border-slate-200">
            <button
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
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
