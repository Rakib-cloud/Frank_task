<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="Rewards" 
      subtitle="Manage rewards and incentives for your team"
    />

    <BaseEmptyState
      title="Rewards Center"
      description="Configure and distribute rewards to motivate your team members."
      icon="gift"
      icon-color="amber"
    />
  </div>
</template>
