<script setup>
import { computed } from 'vue'
import BaseTable from './BaseTable.vue'
import BaseCard from './BaseCard.vue'

const props = defineProps({
  // Table Props
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: 'asc'
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: 'No data available'
  },
  // Header Props
  title: {
    type: String,
    default: ''
  },
  // Pagination Props
  showPagination: {
    type: Boolean,
    default: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    default: 0
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [10, 20, 50]
  }
})

const emit = defineEmits([
  'sort',
  'row-click',
  'update:currentPage',
  'update:itemsPerPage'
])

const paginationInfo = computed(() => {
  const start = props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1
  const end = Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
  return `${start}-${end} of ${props.totalItems}`
})

function handleSort(key) {
  emit('sort', key)
}

function handleRowClick(payload) {
  emit('row-click', payload)
}

function prevPage() {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

function nextPage() {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

function updateItemsPerPage(event) {
  emit('update:itemsPerPage', Number(event.target.value))
  emit('update:currentPage', 1)
}
</script>

<template>
  <BaseCard padding="none">
    <!-- Header -->
    <div v-if="title || $slots.header || $slots.filters" class="p-5 border-b border-slate-100">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Title -->
        <div v-if="title || $slots['header-title']">
          <slot name="header-title">
            <h2 class="text-base font-semibold text-slate-900">{{ title }}</h2>
          </slot>
        </div>
        
        <!-- Filters Slot -->
        <div v-if="$slots.filters" class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <slot name="filters"/>
        </div>

        <!-- Header Actions -->
        <div v-if="$slots.header" class="flex items-center gap-3">
          <slot name="header"/>
        </div>
      </div>
    </div>

    <!-- Table -->
    <BaseTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :hoverable="hoverable"
      :empty-text="emptyText"
      @sort="handleSort"
      @row-click="handleRowClick"
    >
      <!-- Pass through all cell slots -->
      <template v-for="column in columns" :key="column.key" #[`cell-${column.key}`]="slotProps">
        <slot :name="`cell-${column.key}`" v-bind="slotProps">
          {{ slotProps.value }}
        </slot>
      </template>

      <!-- Empty action slot -->
      <template #empty-action>
        <slot name="empty-action"/>
      </template>
    </BaseTable>

    <!-- Pagination -->
    <div v-if="showPagination && !loading && data.length > 0" class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span class="text-sm text-slate-500">{{ paginationInfo }}</span>
      <div class="flex items-center gap-4">
        <!-- Items per page -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-500">Rows per page</span>
          <select 
            :value="itemsPerPage"
            class="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            @change="updateItemsPerPage"
          >
            <option v-for="opt in itemsPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        
        <!-- Page info -->
        <span class="text-sm text-slate-600">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
        
        <!-- Navigation -->
        <div class="flex items-center gap-1">
          <button 
            :disabled="currentPage <= 1"
            :class="['p-1.5 rounded', currentPage <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
            @click="prevPage"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            :disabled="currentPage >= totalPages"
            :class="['p-1.5 rounded', currentPage >= totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
            @click="nextPage"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Slot -->
    <slot name="footer"/>
  </BaseCard>
</template>

