<script setup>
defineProps({
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl border border-slate-200 shadow-sm',
      paddingClasses[padding],
      hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''
    ]"
  >
    <slot />
  </div>
</template>

