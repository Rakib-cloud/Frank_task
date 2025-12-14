<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['update:activeTab'])
</script>

<template>
  <div class="border-b border-slate-200">
    <nav class="flex gap-4 -mb-px overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors',
          activeTab === tab.value
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        ]"
        @click="$emit('update:activeTab', tab.value)"
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined"
          :class="[
            'ml-2 px-2 py-0.5 rounded-full text-xs',
            activeTab === tab.value
              ? 'bg-primary-100 text-primary-600'
              : 'bg-slate-100 text-slate-600'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </nav>
  </div>
</template>

