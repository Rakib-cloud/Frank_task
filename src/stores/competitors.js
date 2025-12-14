import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { competitorService } from '@/services/competitorService'

export const useCompetitorStore = defineStore('competitors', () => {
  const competitors = ref([])
  const loading = ref(false)
  const error = ref(null)
  const sortBy = ref('marketShare')
  const sortOrder = ref('desc')

  const sortedCompetitors = computed(() => {
    return [...competitors.value].sort((a, b) => {
      const valA = a[sortBy.value]
      const valB = b[sortBy.value]

      if (sortOrder.value === 'asc') {
        return valA > valB ? 1 : -1
      } else {
        return valA < valB ? 1 : -1
      }
    })
  })

  async function fetchCompetitors() {
    loading.value = true
    error.value = null

    try {
      competitors.value = await competitorService.getAll()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function setSort(field, order = 'desc') {
    sortBy.value = field
    sortOrder.value = order
  }

  return {
    competitors,
    loading,
    error,
    sortBy,
    sortOrder,
    sortedCompetitors,
    fetchCompetitors,
    setSort
  }
})

