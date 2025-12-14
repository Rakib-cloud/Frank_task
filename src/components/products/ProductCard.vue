<script setup>
import { computed } from 'vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'view'])

const statusConfig = {
  active: { variant: 'success', label: 'Active' },
  out_of_stock: { variant: 'danger', label: 'Out of Stock' },
  inactive: { variant: 'default', label: 'Inactive' }
}

const status = computed(() => statusConfig[props.product.status] || statusConfig.active)

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
    <!-- Product Image -->
    <div class="relative mb-4">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-40 object-cover rounded-lg bg-slate-100"
      >
      <div class="absolute top-2 right-2">
        <BaseBadge :variant="status.variant">
          {{ status.label }}
        </BaseBadge>
      </div>
    </div>

    <!-- Product Info -->
    <div class="mb-4">
      <h3 class="text-base font-semibold text-slate-900 mb-1 line-clamp-1">{{ product.name }}</h3>
      <p class="text-xs text-slate-500 font-mono">{{ product.sku }}</p>
    </div>

    <!-- Price & Stock -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-lg font-bold text-slate-900">{{ formatPrice(product.price) }}</p>
        <p class="text-xs text-slate-500">Price</p>
      </div>
      <div class="text-right">
        <p class="text-lg font-bold" :class="product.stock > 0 ? 'text-slate-900' : 'text-red-500'">
          {{ product.stock }}
        </p>
        <p class="text-xs text-slate-500">In Stock</p>
      </div>
    </div>

    <!-- Category & Date -->
    <div class="flex items-center justify-between text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
      <span class="px-2 py-1 bg-slate-100 rounded-md capitalize">{{ product.category }}</span>
      <span>{{ formatDate(product.createdAt) }}</span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button
        class="flex-1 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
        @click="emit('view', product)"
      >
        View
      </button>
      <button
        class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit"
        @click="emit('edit', product)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
        </svg>
      </button>
      <button
        class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete"
        @click="emit('delete', product)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

