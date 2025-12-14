import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)
  const activeModal = ref(null)
  const modalData = ref(null)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function collapseSidebar() {
    sidebarCollapsed.value = true
  }

  function expandSidebar() {
    sidebarCollapsed.value = false
  }

  function toggleMobileSidebar() {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false
  }

  function openModal(name, data = null) {
    activeModal.value = name
    modalData.value = data
  }

  function closeModal() {
    activeModal.value = null
    modalData.value = null
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    activeModal,
    modalData,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    openModal,
    closeModal
  }
})
