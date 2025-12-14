import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

export function useDashboard() {
  const dashboardStore = useDashboardStore()

  const stats = computed(() => dashboardStore.stats)
  const recentActivities = computed(() => dashboardStore.recentActivities)
  const teamRankings = computed(() => dashboardStore.teamRankings)
  const loading = computed(() => dashboardStore.loading)
  const error = computed(() => dashboardStore.error)

  function fetchAll() {
    return dashboardStore.fetchAll()
  }

  onMounted(() => {
    if (!dashboardStore.stats) {
      fetchAll()
    }
  })

  return {
    stats,
    recentActivities,
    teamRankings,
    loading,
    error,
    fetchAll
  }
}

