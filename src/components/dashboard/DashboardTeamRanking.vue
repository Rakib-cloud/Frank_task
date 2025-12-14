<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  teamRankings: {
    type: Array,
    required: true
  }
})

const teamPage = ref(1)
const teamPerPage = ref(5)
const teamSortBy = ref('reviews')

const sortedTeamRankings = computed(() => {
  const sorted = [...props.teamRankings]
  if (teamSortBy.value === 'reviews') {
    sorted.sort((a, b) => b.reviews - a.reviews)
  } else if (teamSortBy.value === 'rating') {
    sorted.sort((a, b) => b.rating - a.rating)
  } else if (teamSortBy.value === 'progress') {
    sorted.sort((a, b) => b.progress - a.progress)
  }
  return sorted
})

const paginatedTeamRankings = computed(() => {
  const start = (teamPage.value - 1) * teamPerPage.value
  const end = start + teamPerPage.value
  return sortedTeamRankings.value.slice(start, end)
})

const teamTotalPages = computed(() => 
  Math.ceil(sortedTeamRankings.value.length / teamPerPage.value)
)

watch(teamSortBy, () => {
  teamPage.value = 1
})

function getRankBadge(index) {
  const badges = ['🥇', '🥈', '🥉']
  const globalIndex = (teamPage.value - 1) * teamPerPage.value + index
  return badges[globalIndex] || ''
}

function prevTeamPage() {
  if (teamPage.value > 1) teamPage.value--
}

function nextTeamPage() {
  if (teamPage.value < teamTotalPages.value) teamPage.value++
}
</script>

<template>
  <div class="hidden lg:flex bg-white rounded-xl border border-slate-200 flex-col h-[580px]">
    <div class="p-5 border-b border-slate-100 flex items-center justify-between">
      <h2 class="text-base font-semibold text-slate-900">Team Ranking</h2>
      <select 
        v-model="teamSortBy"
        class="text-sm text-slate-500 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <option value="reviews">Number of reviews</option>
        <option value="rating">Rating</option>
        <option value="progress">Progress</option>
      </select>
    </div>

    <!-- Team Rankings with Scroll -->
    <div class="flex-1 p-4 space-y-2 overflow-y-auto">
      <div v-if="paginatedTeamRankings.length === 0" class="flex items-center justify-center h-full text-slate-400">
        No team members found
      </div>
      <div 
        v-for="(member, index) in paginatedTeamRankings" 
        :key="member.id" 
        class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
      >
        <div class="relative">
          <img :src="member.avatar" :alt="member.name" class="w-11 h-11 rounded-full">
          <span v-if="getRankBadge(index)" class="absolute -bottom-1 -right-1 text-lg">{{ getRankBadge(index) }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-900 truncate">{{ member.name }}</p>
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span class="text-xs text-slate-500">{{ member.rating > 0 ? member.rating : '-' }} ({{ member.reviews }} Reviews)</span>
          </div>
        </div>
        <div class="relative w-12 h-12 shrink-0">
          <svg class="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" stroke="#E2E8F0" stroke-width="3" fill="none"/>
            <circle cx="18" cy="18" r="15" stroke="#3B82F6" stroke-width="3" fill="none" :stroke-dasharray="`${member.progress * 0.942} 94.2`" stroke-linecap="round"/>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">{{ member.progress }}%</span>
        </div>
      </div>
    </div>

    <!-- Team Pagination -->
    <div class="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
      <span class="text-xs text-slate-500">
        {{ teamRankings.length }} members
      </span>
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-500">{{ teamPage }} / {{ teamTotalPages || 1 }}</span>
        <button 
          :disabled="teamPage <= 1"
          :class="['p-1 rounded', teamPage <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
          @click="prevTeamPage"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button 
          :disabled="teamPage >= teamTotalPages"
          :class="['p-1 rounded', teamPage >= teamTotalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
          @click="nextTeamPage"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

