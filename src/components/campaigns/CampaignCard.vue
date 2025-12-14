<script setup>
import { computed } from 'vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
})

const statusConfig = {
  active: { variant: 'success', label: 'Active' },
  scheduled: { variant: 'info', label: 'Scheduled' },
  completed: { variant: 'default', label: 'Completed' },
  paused: { variant: 'warning', label: 'Paused' }
}

const status = computed(() => statusConfig[props.campaign.status] || statusConfig.active)

const budgetProgress = computed(() => {
  return (props.campaign.spent / props.campaign.budget) * 100
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-900">{{ campaign.name }}</h3>
        <p class="text-sm text-slate-500 mt-1">
          {{ formatDate(campaign.startDate) }} - {{ formatDate(campaign.endDate) }}
        </p>
      </div>
      <BaseBadge :variant="status.variant">
        {{ status.label }}
      </BaseBadge>
    </div>

    <!-- Budget Progress -->
    <div class="mb-6">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="text-slate-500">Budget</span>
        <span class="font-medium text-slate-900">
          {{ formatCurrency(campaign.spent) }} / {{ formatCurrency(campaign.budget) }}
        </span>
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="[
            budgetProgress > 90 ? 'bg-red-500' :
            budgetProgress > 70 ? 'bg-amber-500' :
            'bg-primary-500'
          ]"
          :style="{ width: `${Math.min(budgetProgress, 100)}%` }"
        />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center p-3 rounded-lg bg-slate-50">
        <p class="text-2xl font-bold text-slate-900">{{ formatNumber(campaign.impressions) }}</p>
        <p class="text-xs text-slate-500 mt-1">Impressions</p>
      </div>
      <div class="text-center p-3 rounded-lg bg-slate-50">
        <p class="text-2xl font-bold text-slate-900">{{ formatNumber(campaign.clicks) }}</p>
        <p class="text-xs text-slate-500 mt-1">Clicks</p>
      </div>
      <div class="text-center p-3 rounded-lg bg-slate-50">
        <p class="text-2xl font-bold text-slate-900">{{ formatNumber(campaign.conversions) }}</p>
        <p class="text-xs text-slate-500 mt-1">Conversions</p>
      </div>
      <div class="text-center p-3 rounded-lg bg-green-50">
        <p class="text-2xl font-bold text-green-600">{{ campaign.roi }}%</p>
        <p class="text-xs text-slate-500 mt-1">ROI</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 pt-4 border-t border-slate-100">
      <button class="flex-1 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
        View Details
      </button>
      <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

