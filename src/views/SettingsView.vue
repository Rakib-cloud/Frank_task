<script setup>
import PageHeader from '@/components/base/PageHeader.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
</script>

<template>
  <div>
    <PageHeader 
      title="Settings" 
      subtitle="Manage your account and preferences"
    />

    <BaseEmptyState
      title="Account Settings"
      description="Configure your profile, notifications, and application preferences."
      icon="settings"
      icon-color="slate"
    />
  </div>
</template>
