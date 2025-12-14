<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps({
  competitors: {
    type: Array,
    required: true
  }
})

const openMenuId = ref(null)

function toggleMenu(id, event) {
  event.stopPropagation()
  openMenuId.value = openMenuId.value === id ? null : id
}

function closeMenu() {
  openMenuId.value = null
}
</script>

<template>
  <div class="hidden lg:block bg-white rounded-xl border border-slate-200">
    <div class="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
      <h2 class="text-base font-semibold text-slate-900">My competitors</h2>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input type="text" placeholder="Search for business" class="w-56 pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <BaseButton variant="outline" size="md">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
          </svg>
          Filter
        </BaseButton>
      </div>
    </div>
    
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Name</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Address</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Average Rating</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Total Review</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Status</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="competitor in competitors" :key="competitor.id" class="hover:bg-slate-50">
            <td class="px-5 py-4 text-sm font-medium text-slate-900">{{ competitor.name }}</td>
            <td class="px-5 py-4 text-sm text-slate-500">{{ competitor.address }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-sm">{{ competitor.rating }}</span>
              </div>
            </td>
            <td class="px-5 py-4 text-sm text-slate-700">{{ competitor.totalReviews }}</td>
            <td class="px-5 py-4">
              <span :class="['inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md', competitor.statusType === 'positive' ? 'bg-green-50 text-green-600' : competitor.statusType === 'negative' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500']">
                {{ competitor.status > 0 ? '+' : '' }}{{ competitor.status }}%
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <button class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium cursor-pointer transition-colors">View</button>
                
                <div class="relative">
                  <button 
                    @click="toggleMenu(competitor.id, $event)"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </button>
                  
                  <div 
                    v-if="openMenuId === competitor.id"
                    class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
                  >
                    <button 
                      @click="closeMenu()"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      View
                    </button>
                    <button 
                      @click="closeMenu()"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                      Edit
                    </button>
                    <button 
                      @click="closeMenu()"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
      <span class="text-sm text-slate-500">1 of 100 row(s) selected.</span>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-500">Rows per page</span>
          <select class="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <option>10</option>
            <option>20</option>
          </select>
        </div>
        <span class="text-sm text-slate-600">Page 1 of 10</span>
        <div class="flex items-center gap-1">
          <button class="p-1.5 text-slate-300 cursor-not-allowed" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button class="p-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

