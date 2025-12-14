<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="Plan & Billings" 
      subtitle="Manage your subscription and payment methods"
    />

    <BaseEmptyState
      title="Billing & Subscription"
      description="View your current plan, manage payments, and upgrade your subscription."
      icon="card"
      icon-color="green"
    />
  </div>
</template>
