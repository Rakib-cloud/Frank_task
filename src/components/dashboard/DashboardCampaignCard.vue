<script setup>
defineProps({
  campaign: {
    type: Object,
    required: true
  }
})

function getStatusClass(status) {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'completed':
      return 'bg-green-50 text-green-600 border-green-200'
    case 'upcoming':
      return 'bg-amber-50 text-amber-600 border-amber-200'
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

function getStatusLabel(status) {
  return status?.replace('_', ' ') || status
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="p-3 lg:p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
    <!-- Header with name and status -->
    <div class="flex items-start justify-between mb-2 lg:mb-3">
      <h3 class="font-semibold text-slate-900 text-sm lg:text-base">{{ campaign.name }}</h3>
      <div class="flex items-center gap-1 lg:gap-2">
        <span :class="['px-2 lg:px-3 py-0.5 lg:py-1 text-xs font-medium rounded-full border capitalize', getStatusClass(campaign.status)]">
          {{ getStatusLabel(campaign.status) }}
        </span>
        <button class="p-1 lg:p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-pointer">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Reward -->
    <div class="flex items-center gap-2 mb-3 lg:mb-4">
      <span class="flex items-center gap-1.5 text-sm">
        <span class="text-base lg:text-lg">🎁</span>
        <span class="font-medium text-slate-900">{{ campaign.reward }}</span>
      </span>
      <span v-if="campaign.rewardCount" class="text-xs text-slate-400">{{ campaign.rewardCount }} more reward</span>
    </div>

    <!-- Top Performer -->
    <div class="flex items-center gap-2 mb-3">
      <div v-if="campaign.topPerformer" class="flex items-center gap-2">
        <span class="text-base">🏅</span>
        <img :src="campaign.topPerformer.avatar" :alt="campaign.topPerformer.name" class="w-5 h-5 lg:w-6 lg:h-6 rounded-full">
        <span class="text-xs lg:text-sm font-medium text-slate-700">{{ campaign.topPerformer.name }}</span>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{{ campaign.progress }}%</span>
        <span class="text-xs lg:text-sm text-slate-600">
          <span class="font-semibold">{{ campaign.currentReviews?.toString().padStart(2, '0') || '00' }}</span>/{{ campaign.targetReviews }} Reviews
        </span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="h-1.5 lg:h-2 bg-blue-100 rounded-full overflow-hidden mb-3 lg:mb-4">
      <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: `${campaign.progress}%` }"/>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs lg:text-sm text-slate-500">
      <span>Start Date: <span class="text-slate-700">{{ formatDate(campaign.startDate) }}</span></span>
      <span class="flex items-center gap-1">
        <span class="text-sm lg:text-base">📅</span>
        {{ campaign.daysLeft }} Days left
      </span>
    </div>
  </div>
</template>

