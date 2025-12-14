<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import TheSidebarMobile from '@/components/layout/TheSidebarMobile.vue'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheBottomNav from '@/components/layout/TheBottomNav.vue'

const uiStore = useUIStore()

const sidebarCollapsed = computed(() => uiStore.sidebarCollapsed)

function openMobileMenu() {
  uiStore.toggleMobileSidebar()
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC]">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:block">
      <TheSidebar />
    </div>

    <!-- Mobile Sidebar (More menu) -->
    <TheSidebarMobile />

    <!-- Main Content -->
    <div 
      :class="[
        'min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      ]"
    >
      <TheHeader />
      
      <!-- Main content with bottom padding on mobile for bottom nav -->
      <main class="p-4 lg:p-5 pb-20 lg:pb-5">
        <router-view />
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <TheBottomNav @open-menu="openMobileMenu" />
  </div>
</template>
