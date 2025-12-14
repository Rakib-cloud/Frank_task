<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useAuth } from '@/composables/useAuth'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()
const { logout } = useAuth()

const isOpen = computed(() => uiStore.mobileSidebarOpen)

const menuItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Products', path: '/products', icon: 'product' },
  { name: 'Review Management', path: '/reviews', icon: 'review' },
  { name: 'Team Members', path: '/team', icon: 'team' },
  { name: 'My Campaigns', path: '/campaigns', icon: 'campaign' },
  { name: 'Rewards', path: '/rewards', icon: 'reward' },
  { name: 'Competitor Analysis', path: '/competitors', icon: 'competitor' },
  { name: 'Plan & Billings', path: '/billing', icon: 'billing' },
  { name: 'My Network', path: '/network', icon: 'network' },
  { name: 'Settings', path: '/settings', icon: 'settings' }
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigateTo(path) {
  router.push(path)
  uiStore.closeMobileSidebar()
}

function close() {
  uiStore.closeMobileSidebar()
}

function handleLogout() {
  logout()
  uiStore.closeMobileSidebar()
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        @click="close"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition name="sidebar">
      <aside
        v-if="isOpen"
        class="fixed left-0 top-0 z-50 h-screen w-60 bg-white flex flex-col lg:hidden shadow-xl"
      >
        <!-- Header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="6" height="6" rx="1.5" fill="#3B82F6"/>
              <rect x="13" y="4" width="6" height="6" rx="1.5" fill="#3B82F6"/>
              <rect x="22" y="4" width="6" height="6" rx="1.5" fill="#3B82F6"/>
              <rect x="4" y="13" width="6" height="6" rx="1.5" fill="#3B82F6"/>
              <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#3B82F6"/>
              <rect x="4" y="22" width="6" height="6" rx="1.5" fill="#3B82F6"/>
              <rect x="13" y="22" width="6" height="6" rx="1.5" fill="#3B82F6"/>
            </svg>
            <span class="text-lg font-semibold text-slate-900">MyFrank</span>
          </div>
          <button
            class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
            @click="close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 py-4 px-3 overflow-y-auto">
          <ul class="space-y-1">
            <li v-for="item in menuItems" :key="item.path">
              <button
                :class="[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                ]"
                @click="navigateTo(item.path)"
              >
                <!-- Icons same as desktop -->
                <svg v-if="item.icon === 'home'" class="w-5 h-5" :fill="isActive(item.path) ? 'currentColor' : 'none'" :stroke="isActive(item.path) ? 'none' : 'currentColor'" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <svg v-else-if="item.icon === 'product'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <svg v-else-if="item.icon === 'review'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                <svg v-else-if="item.icon === 'team'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <svg v-else-if="item.icon === 'campaign'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <svg v-else-if="item.icon === 'reward'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                </svg>
                <svg v-else-if="item.icon === 'competitor'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <svg v-else-if="item.icon === 'billing'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <svg v-else-if="item.icon === 'network'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
                <svg v-else-if="item.icon === 'settings'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{{ item.name }}</span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Sign Out -->
        <div class="p-3 border-t border-slate-100">
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            @click="handleLogout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
