<script setup>
defineProps({
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
  }
})

defineEmits(['sort'])
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-slate-200">
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider',
              column.sortable ? 'cursor-pointer hover:text-slate-700' : '',
              column.width ? column.width : ''
            ]"
            @click="column.sortable && $emit('sort', column.key)"
          >
            <div class="flex items-center gap-1">
              {{ column.label }}
              <span v-if="column.sortable && sortBy === column.key" class="text-primary-600">
                <svg v-if="sortOrder === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr
          v-for="(row, index) in data"
          :key="row.id || index"
          class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-sm text-slate-700"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="i in 5" :key="i" class="border-b border-slate-100">
          <td v-for="column in columns" :key="column.key" class="px-4 py-3">
            <div class="h-4 bg-slate-200 rounded animate-pulse" />
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="!loading && data.length === 0"
      class="py-12 text-center text-slate-500"
    >
      <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p>No data available</p>
    </div>
  </div>
</template>

