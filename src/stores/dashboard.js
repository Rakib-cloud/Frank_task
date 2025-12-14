import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '@/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref(null)
  const recentActivities = ref([])
  const teamRankings = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchStats() {
    loading.value = true
    error.value = null

    try {
      stats.value = await dashboardService.getStats()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchRecentActivities() {
    try {
      recentActivities.value = await dashboardService.getRecentActivities()
    } catch (e) {
      console.error('Failed to fetch activities:', e)
    }
  }

  async function fetchTeamRankings() {
    try {
      teamRankings.value = await dashboardService.getTeamRankings()
    } catch (e) {
      console.error('Failed to fetch team rankings:', e)
    }
  }

  async function fetchAll() {
    await Promise.all([
      fetchStats(),
      fetchRecentActivities(),
      fetchTeamRankings()
    ])
  }

  return {
    stats,
    recentActivities,
    teamRankings,
    loading,
    error,
    fetchStats,
    fetchRecentActivities,
    fetchTeamRankings,
    fetchAll
  }
})

