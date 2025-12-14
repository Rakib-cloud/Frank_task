<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="Review Management" 
      subtitle="Manage and respond to customer reviews"
    />

    <BaseEmptyState
      title="Review Management"
      description="This section will display all your reviews and allow you to manage and respond to them."
      icon="star"
      icon-color="blue"
    />
  </div>
</template>
