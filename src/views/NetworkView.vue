<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="My Network" 
      subtitle="Connect and collaborate with your network"
    />

    <div class="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
        <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
      </div>
      <h2 class="text-lg font-medium text-slate-900 mb-2">Network Connections</h2>
      <p class="text-slate-500 max-w-md mx-auto">
        Build and manage your professional network connections.
      </p>
    </div>
  </div>
</template>
