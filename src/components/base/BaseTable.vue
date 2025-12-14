<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
    // Each column: { key: string, label: string, sortable?: boolean, width?: string, align?: 'left'|'center'|'right' }
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
    default: 'asc',
    validator: (v) => ['asc', 'desc'].includes(v)
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  striped: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'No data available'
  },
  emptyIcon: {
    type: String,
    default: 'table'
  },
  loadingRows: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['sort', 'row-click'])

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

function handleSort(column) {
  if (column.sortable) {
    emit('sort', column.key)
  }
}

function handleRowClick(row, index) {
  emit('row-click', { row, index })
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <!-- Table Header -->
      <thead>
        <tr class="bg-slate-50 border-b border-slate-100">
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-5 py-3 text-xs font-medium text-slate-500',
              alignClasses[column.align || 'left'],
              column.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : '',
              column.width || ''
            ]"
            @click="handleSort(column)"
          >
            <div :class="['flex items-center gap-1', column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : '']">
              {{ column.label }}
              <template v-if="column.sortable">
                <svg v-if="sortBy === column.key && sortOrder === 'asc'" class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                </svg>
                <svg v-else-if="sortBy === column.key && sortOrder === 'desc'" class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
                <svg v-else class="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </template>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Loading State -->
      <tbody v-if="loading">
        <tr v-for="i in loadingRows" :key="i" class="border-b border-slate-100">
          <td v-for="column in columns" :key="column.key" class="px-5 py-4">
            <div class="h-4 bg-slate-200 rounded animate-pulse"/>
          </td>
        </tr>
      </tbody>

      <!-- Data Rows -->
      <tbody v-else-if="data.length > 0" class="divide-y divide-slate-100">
        <tr
          v-for="(row, index) in data"
          :key="row.id || index"
          :class="[
            'transition-colors',
            hoverable ? 'hover:bg-slate-50 cursor-pointer' : '',
            striped && index % 2 === 1 ? 'bg-slate-25' : ''
          ]"
          @click="handleRowClick(row, index)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="['px-5 py-4 text-sm', alignClasses[column.align || 'left']]"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :index="index">
              <span class="text-slate-700">{{ row[column.key] }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="!loading && data.length === 0" class="py-12 text-center">
      <svg v-if="emptyIcon === 'table'" class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
      <svg v-else-if="emptyIcon === 'search'" class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <svg v-else class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
      <p class="text-sm text-slate-500">{{ emptyText }}</p>
      <slot name="empty-action"/>
    </div>
  </div>
</template>
