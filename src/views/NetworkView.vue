<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="My Network" 
      subtitle="Connect and collaborate with your network"
    />

    <BaseEmptyState
      title="Network Connections"
      description="Build and manage your professional network connections."
      icon="globe"
      icon-color="purple"
    />
  </div>
</template>
