<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="Rewards" 
      subtitle="Manage rewards and incentives for your team"
    />

    <div class="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
        <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
        </svg>
      </div>
      <h2 class="text-lg font-medium text-slate-900 mb-2">Rewards Center</h2>
      <p class="text-slate-500 max-w-md mx-auto">
        Configure and distribute rewards to motivate your team members.
      </p>
    </div>
  </div>
</template>
