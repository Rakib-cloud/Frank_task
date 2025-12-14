<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="Plan & Billings" 
      subtitle="Manage your subscription and payment methods"
    />

    <div class="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
        <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
      </div>
      <h2 class="text-lg font-medium text-slate-900 mb-2">Billing & Subscription</h2>
      <p class="text-slate-500 max-w-md mx-auto">
        View your current plan, manage payments, and upgrade your subscription.
      </p>
    </div>
  </div>
</template>
