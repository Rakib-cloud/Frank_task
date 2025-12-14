<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import TheSidebarMobile from '@/components/layout/TheSidebarMobile.vue'
import TheHeader from '@/components/layout/TheHeader.vue'

const uiStore = useUIStore()

const sidebarCollapsed = computed(() => uiStore.sidebarCollapsed)
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC]">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:block">
      <TheSidebar />
    </div>

    <!-- Mobile Sidebar -->
    <TheSidebarMobile />

    <!-- Main Content -->
    <div 
      :class="[
        'min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      ]"
    >
      <TheHeader />
      
      <main class="p-5">
        <router-view />
      </main>
    </div>
  </div>
</template>
