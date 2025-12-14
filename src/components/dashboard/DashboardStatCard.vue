<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'star'
  },
  showStar: {
    type: Boolean,
    default: false
  },
  showCalendar: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-4 lg:p-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 lg:gap-3">
        <!-- Star Icon -->
        <svg v-if="icon === 'star'" class="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        
        <!-- Users Icon -->
        <svg v-else-if="icon === 'users'" class="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        
        <!-- Calendar Icon -->
        <svg v-else-if="icon === 'calendar'" class="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        
        <span class="text-xs lg:text-sm text-slate-500">{{ title }}</span>
      </div>
      
      <!-- Calendar action icon -->
      <svg v-if="showCalendar" class="hidden lg:block w-5 h-5 text-slate-300 cursor-pointer hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    </div>
    
    <p class="text-2xl lg:text-3xl font-bold text-slate-900 mt-2 lg:mt-3 flex items-center gap-1">
      <svg v-if="showStar" class="w-5 h-5 lg:w-6 lg:h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      {{ value }}
    </p>
  </div>
</template>

