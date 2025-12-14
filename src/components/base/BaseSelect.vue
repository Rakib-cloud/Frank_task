<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const selectValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-slate-700 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    <div class="relative">
      <select
        v-model="selectValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full rounded-lg border bg-white px-4 py-2.5 pr-10 appearance-none cursor-pointer transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-danger-500' : 'border-slate-300',
          disabled ? 'bg-slate-50 cursor-not-allowed' : ''
        ]"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value ?? option"
          :value="option.value ?? option"
        >
          {{ option.label ?? option }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-danger-500">
      {{ error }}
    </p>
  </div>
</template>

