<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Campaigns', path: '/campaigns', icon: 'campaign' },
  { name: 'Review', path: '/reviews', icon: 'review' },
  { name: 'Members', path: '/team', icon: 'team' },
  { name: 'More', path: '', icon: 'more' }
]

function isActive(path) {
  if (path === '') return false
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigateTo(path) {
  if (path) {
    router.push(path)
  }
}

const emit = defineEmits(['open-menu'])

function handleClick(item) {
  if (item.icon === 'more') {
    emit('open-menu')
  } else {
    navigateTo(item.path)
  }
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 lg:hidden">
    <div class="flex items-center justify-around h-16 px-2">
      <button
        v-for="item in navItems"
        :key="item.name"
        :class="[
          'flex flex-col items-center justify-center flex-1 h-full gap-1 cursor-pointer transition-colors',
          isActive(item.path) ? 'text-blue-600' : 'text-slate-500'
        ]"
        @click="handleClick(item)"
      >
        <!-- Home Icon -->
        <svg v-if="item.icon === 'home'" class="w-6 h-6" :fill="isActive(item.path) ? 'currentColor' : 'none'" :stroke="isActive(item.path) ? 'none' : 'currentColor'" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        
        <!-- Campaign Icon -->
        <svg v-else-if="item.icon === 'campaign'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        
        <!-- Review Icon -->
        <svg v-else-if="item.icon === 'review'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        
        <!-- Team/Members Icon -->
        <svg v-else-if="item.icon === 'team'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        
        <!-- More Icon -->
        <svg v-else-if="item.icon === 'more'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        
        <span class="text-xs font-medium">{{ item.name }}</span>
        
        <!-- Active indicator -->
        <div 
          v-if="isActive(item.path)" 
          class="absolute bottom-1 w-8 h-1 bg-blue-600 rounded-full"
        />
      </button>
    </div>
  </nav>
</template>

