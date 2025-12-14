import { computed, onMounted } from 'vue'
import { useCompetitorStore } from '@/stores/competitors'

export function useCompetitors() {
  const competitorStore = useCompetitorStore()

  const competitors = computed(() => competitorStore.sortedCompetitors)
  const loading = computed(() => competitorStore.loading)
  const error = computed(() => competitorStore.error)
  const sortBy = computed(() => competitorStore.sortBy)
  const sortOrder = computed(() => competitorStore.sortOrder)

  function fetchCompetitors() {
    return competitorStore.fetchCompetitors()
  }

  function setSort(field, order) {
    competitorStore.setSort(field, order)
  }

  onMounted(() => {
    if (competitorStore.competitors.length === 0) {
      fetchCompetitors()
    }
  })

  return {
    competitors,
    loading,
    error,
    sortBy,
    sortOrder,
    fetchCompetitors,
    setSort
  }
}

