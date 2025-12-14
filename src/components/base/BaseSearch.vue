<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  debounce: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
let timeout = null

watch(internalValue, (newVal) => {
  if (timeout) clearTimeout(timeout)
  
  timeout = setTimeout(() => {
    emit('update:modelValue', newVal)
  }, props.debounce)
})

watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal
})

function clear() {
  internalValue.value = ''
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      v-model="internalValue"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
    >
    <button
      v-if="internalValue"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
      @click="clear"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

