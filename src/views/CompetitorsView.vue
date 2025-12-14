<script setup>
import { ref, onMounted } from 'vue'
import { competitorService } from '@/services/competitorService'
import PageHeader from '@/components/base/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const competitors = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    competitors.value = await competitorService.getAll()
  } catch (e) {
    console.error('Failed to fetch competitors:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <PageHeader 
      title="Competitor Analysis" 
      subtitle="Track and analyze your competitors"
    />

    <div class="bg-white rounded-xl border border-slate-200">
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-base font-semibold text-slate-900">My competitors</h2>
        <div class="flex items-center gap-3">
          <div class="relative">
            <input type="text" placeholder="Search for business" class="w-56 pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <BaseButton variant="outline" size="sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
            </svg>
            Filter
          </BaseButton>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50">
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500">Address</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500">Average Rating</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500">Total Review</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="competitor in competitors" :key="competitor.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ competitor.name }}</td>
              <td class="px-4 py-3 text-sm text-slate-500">{{ competitor.address }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-sm">{{ competitor.rating }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-slate-700">{{ competitor.totalReviews }}</td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center gap-1 text-sm font-medium', competitor.statusType === 'positive' ? 'text-green-600' : competitor.statusType === 'negative' ? 'text-red-500' : 'text-slate-500']">
                  {{ competitor.status > 0 ? '+' : '' }}{{ competitor.status }}%
                </span>
              </td>
              <td class="px-4 py-3">
                <button class="text-sm text-blue-500 hover:text-blue-600 font-medium">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
