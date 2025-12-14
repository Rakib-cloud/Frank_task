<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', 'full'].includes(v)
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl'
}

function closeModal() {
  if (props.closable) {
    emit('close')
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          @click="closeModal"
        />
        
        <!-- Modal Content -->
        <div
          :class="[
            'relative w-full bg-white rounded-xl shadow-2xl transform transition-all duration-300',
            sizeClasses[size]
          ]"
        >
          <!-- Header -->
          <div
            v-if="title || closable"
            class="flex items-center justify-between px-6 py-4 border-b border-slate-200"
          >
            <h3 class="text-lg font-semibold text-slate-900">
              {{ title }}
            </h3>
            <button
              v-if="closable"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              @click="closeModal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <slot />
          </div>
          
          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

