<script setup>
defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'circle', 'rect', 'card'].includes(v)
  },
  width: {
    type: String,
    default: 'full'
  },
  height: {
    type: String,
    default: '4'
  },
  count: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div>
    <template v-if="type === 'text'">
      <div
        v-for="i in count"
        :key="i"
        :class="[
          'bg-slate-200 rounded animate-pulse',
          width === 'full' ? 'w-full' : `w-${width}`,
          `h-${height}`,
          i < count ? 'mb-2' : ''
        ]"
      />
    </template>

    <template v-else-if="type === 'circle'">
      <div
        :class="[
          'bg-slate-200 rounded-full animate-pulse',
          `w-${width}`,
          `h-${width}`
        ]"
      />
    </template>

    <template v-else-if="type === 'rect'">
      <div
        :class="[
          'bg-slate-200 rounded-lg animate-pulse',
          width === 'full' ? 'w-full' : `w-${width}`,
          `h-${height}`
        ]"
      />
    </template>

    <template v-else-if="type === 'card'">
      <div class="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-slate-200 rounded-full" />
          <div class="flex-1">
            <div class="h-4 bg-slate-200 rounded w-3/4 mb-2" />
            <div class="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-slate-200 rounded w-full" />
          <div class="h-3 bg-slate-200 rounded w-5/6" />
          <div class="h-3 bg-slate-200 rounded w-4/6" />
        </div>
      </div>
    </template>
  </div>
</template>

