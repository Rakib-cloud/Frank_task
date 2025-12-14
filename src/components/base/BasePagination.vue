<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisible: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:currentPage'])

const pages = computed(() => {
  const range = []
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisible / 2))
  const end = Math.min(props.totalPages, start + props.maxVisible - 1)
  
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  
  return range
})

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
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
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-1"
  >
    <!-- Previous Button -->
    <button
      :disabled="currentPage === 1"
      class="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      @click="prevPage"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- First Page -->
    <button
      v-if="pages[0] > 1"
      class="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
      @click="goToPage(1)"
    >
      1
    </button>

    <!-- Ellipsis -->
    <span
      v-if="pages[0] > 2"
      class="px-2 text-slate-400"
    >
      ...
    </span>

    <!-- Page Numbers -->
    <button
      v-for="page in pages"
      :key="page"
      :class="[
        'px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors',
        page === currentPage
          ? 'bg-primary-600 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      ]"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <!-- Ellipsis -->
    <span
      v-if="pages[pages.length - 1] < totalPages - 1"
      class="px-2 text-slate-400"
    >
      ...
    </span>

    <!-- Last Page -->
    <button
      v-if="pages[pages.length - 1] < totalPages"
      class="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
      @click="goToPage(totalPages)"
    >
      {{ totalPages }}
    </button>

    <!-- Next Button -->
    <button
      :disabled="currentPage === totalPages"
      class="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      @click="nextPage"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
</template>

