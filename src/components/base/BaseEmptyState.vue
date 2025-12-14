<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'default'
  },
  iconColor: {
    type: String,
    default: 'blue',
    validator: (v) => ['blue', 'green', 'amber', 'red', 'purple', 'slate'].includes(v)
  }
})

const colorClasses = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-500' },
  green: { bg: 'bg-green-50', text: 'text-green-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-500' },
  red: { bg: 'bg-red-50', text: 'text-red-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-500' }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-12 text-center">
    <!-- Icon Container -->
    <div :class="['w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center', colorClasses[iconColor].bg]">
      <slot name="icon">
        <!-- Default Icon -->
        <svg v-if="icon === 'default'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <!-- Star Icon -->
        <svg v-else-if="icon === 'star'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        <!-- Gift Icon -->
        <svg v-else-if="icon === 'gift'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
        </svg>
        <!-- Credit Card Icon -->
        <svg v-else-if="icon === 'card'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
        <!-- Globe Icon -->
        <svg v-else-if="icon === 'globe'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
        <!-- Settings Icon -->
        <svg v-else-if="icon === 'settings'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <!-- Users Icon -->
        <svg v-else-if="icon === 'users'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        <!-- Calendar Icon -->
        <svg v-else-if="icon === 'calendar'" :class="['w-8 h-8', colorClasses[iconColor].text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </slot>
    </div>

    <!-- Title -->
    <h2 class="text-lg font-medium text-slate-900 mb-2">{{ title }}</h2>

    <!-- Description -->
    <p v-if="description" class="text-slate-500 max-w-md mx-auto">
      {{ description }}
    </p>

    <!-- Action Slot -->
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>

