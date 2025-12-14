<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { competitorService } from '@/services/competitorService'
import PageHeader from '@/components/base/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import DataTable from '@/components/base/DataTable.vue'

const allCompetitors = ref([])
const loading = ref(true)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref('')
const sortOrder = ref('asc')

// Table columns configuration
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'address', label: 'Address' },
  { key: 'rating', label: 'Average Rating', sortable: true },
  { key: 'totalReviews', label: 'Total Review', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Action' }
]

// Filtered competitors
const filteredCompetitors = computed(() => {
  let result = [...allCompetitors.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query)
    )
  }
  
  // Sorting
  if (sortBy.value) {
    result.sort((a, b) => {
      const valA = a[sortBy.value]
      const valB = b[sortBy.value]
      
      if (typeof valA === 'string') {
        return sortOrder.value === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA)
      }
      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    })
  }
  
  return result
})

// Paginated competitors
const paginatedCompetitors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCompetitors.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredCompetitors.value.length / itemsPerPage.value)
)

// Reset page when filters change
watch([searchQuery], () => {
  currentPage.value = 1
})

// Methods
async function fetchCompetitors() {
  loading.value = true
  try {
    allCompetitors.value = await competitorService.getAll()
  } catch (e) {
    console.error('Failed to fetch competitors:', e)
  } finally {
    loading.value = false
  }
}

function handleSort(key) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
}

onMounted(() => {
  fetchCompetitors()
})
</script>

<template>
  <div>
    <PageHeader 
      title="Competitor Analysis" 
      subtitle="Track and analyze your competitors"
    />

    <DataTable
      title="My competitors"
      :columns="columns"
      :data="paginatedCompetitors"
      :loading="loading"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="filteredCompetitors.length"
      :items-per-page="itemsPerPage"
      empty-text="No competitors found"
      @sort="handleSort"
      @update:current-page="currentPage = $event"
      @update:items-per-page="itemsPerPage = $event"
    >
      <!-- Header Filters -->
      <template #header>
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search for business" 
            class="w-56 pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <BaseButton variant="outline" size="md">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
          </svg>
          Filter
        </BaseButton>
      </template>

      <!-- Custom Cell: Rating -->
      <template #cell-rating="{ row }">
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-sm text-slate-700">{{ row.rating }}</span>
        </div>
      </template>

      <!-- Custom Cell: Status -->
      <template #cell-status="{ row }">
        <span :class="[
          'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md',
          row.statusType === 'positive' ? 'bg-green-50 text-green-600' : 
          row.statusType === 'negative' ? 'bg-red-50 text-red-500' : 
          'bg-slate-50 text-slate-500'
        ]">
          {{ row.status > 0 ? '+' : '' }}{{ row.status }}%
        </span>
      </template>

      <!-- Custom Cell: Actions -->
      <template #cell-actions="{ row }">
        <button class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium cursor-pointer transition-colors">
          View
        </button>
      </template>
    </DataTable>
  </div>
</template>
