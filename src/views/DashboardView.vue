<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { dashboardService } from '@/services/dashboardService'
import { campaignService } from '@/services/campaignService'
import { competitorService } from '@/services/competitorService'
import PageHeader from '@/components/base/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { userName } = useAuth()

const stats = ref(null)
const campaigns = ref([])
const teamRankings = ref([])
const competitors = ref([])
const loading = ref(true)
const activeTab = ref('all')
const openMenuId = ref(null)

function toggleMenu(id, event) {
  event.stopPropagation()
  openMenuId.value = openMenuId.value === id ? null : id
}

function closeMenu() {
  openMenuId.value = null
}

function handleClickOutside() {
  openMenuId.value = null
}

const campaignTabs = computed(() => [
  { value: 'all', label: 'All Campaign', count: campaigns.value.length },
  { value: 'upcoming', label: 'Upcoming', count: campaigns.value.filter(c => c.status === 'upcoming').length },
  { value: 'in_progress', label: 'In Progress', count: campaigns.value.filter(c => c.status === 'in_progress').length },
  { value: 'completed', label: 'Completed', count: campaigns.value.filter(c => c.status === 'completed').length },
  { value: 'archive', label: 'Archive', count: campaigns.value.filter(c => c.status === 'archive').length }
])

const filteredCampaigns = computed(() => {
  if (activeTab.value === 'all') return campaigns.value
  return campaigns.value.filter(c => c.status === activeTab.value)
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  try {
    const [statsData, campaignsData, teamData, competitorsData] = await Promise.all([
      dashboardService.getStats(),
      campaignService.getAll(),
      dashboardService.getTeamRankings(),
      competitorService.getAll()
    ])
    stats.value = statsData
    campaigns.value = campaignsData
    teamRankings.value = teamData
    competitors.value = competitorsData
  } catch (e) {
    console.error('Failed to load dashboard:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Header -->
    <PageHeader :title="`${greeting}, ${userName} 👋`">
      <template #actions>
        <BaseButton variant="primary" size="md">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Member
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Reviews -->
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <span class="text-sm text-slate-500">Total Reviews</span>
        </div>
        <p class="text-3xl font-bold text-slate-900 mt-3">{{ stats?.totalReviews?.toString().padStart(2, '0') || '00' }}</p>
      </div>

      <!-- Average Rating -->
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <span class="text-sm text-slate-500">Average Rating</span>
        </div>
        <p class="text-3xl font-bold text-slate-900 mt-3 flex items-center gap-1">
          <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ stats?.averageRating?.toString().padStart(2, '0') || '00' }}
        </p>
      </div>

      <!-- Active Members -->
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <span class="text-sm text-slate-500">Active Members</span>
        </div>
        <p class="text-3xl font-bold text-slate-900 mt-3">{{ stats?.activeMembers?.toString().padStart(2, '0') || '00' }}</p>
      </div>

      <!-- Total Campaign -->
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="text-sm text-slate-500">Total Campaign</span>
        </div>
        <p class="text-3xl font-bold text-slate-900 mt-3">{{ stats?.totalCampaigns?.toString().padStart(2, '0') || '00' }}</p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
      <!-- My Campaigns Section -->
      <div class="xl:col-span-2 bg-white rounded-xl border border-slate-200">
        <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 class="text-base font-semibold text-slate-900">My Campaigns</h2>
          <BaseButton variant="primary" size="md">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Create New Campaign
          </BaseButton>
        </div>

        <!-- Tabs -->
        <div class="px-5 border-b border-slate-100">
          <div class="flex gap-6 overflow-x-auto -mb-px">
            <button
              v-for="tab in campaignTabs"
              :key="tab.value"
              :class="[
                'flex items-center gap-2 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                activeTab === tab.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              ]"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
              <span
                :class="[
                  'px-2 py-0.5 text-xs rounded-md',
                  activeTab === tab.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-500'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Campaign Cards -->
        <div class="p-5 space-y-4 max-h-[420px] overflow-y-auto">
          <div
            v-for="campaign in filteredCampaigns"
            :key="campaign.id"
            class="p-4 border border-slate-200 rounded-xl"
          >
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-semibold text-slate-900">{{ campaign.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  In progress
                </span>
                <button class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
                <button class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Reward -->
            <div class="flex items-center gap-2 mb-4">
              <span class="flex items-center gap-1.5 text-sm">
                <span class="text-lg">🎁</span>
                <span class="font-medium text-slate-900">{{ campaign.reward }}</span>
              </span>
              <span v-if="campaign.rewardCount" class="text-xs text-slate-400">{{ campaign.rewardCount }} more reward</span>
            </div>

            <!-- Top Performer & Progress -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="text-sm text-slate-500">Top Performer</span>
                <div v-if="campaign.topPerformer" class="flex items-center gap-2">
                  <span class="text-lg">👆</span>
                  <img :src="campaign.topPerformer.avatar" :alt="campaign.topPerformer.name" class="w-6 h-6 rounded-full">
                  <span class="text-sm font-medium text-slate-700">{{ campaign.topPerformer.name }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{{ campaign.progress }}%</span>
                <span class="text-sm text-slate-600">
                  <span class="font-semibold">{{ campaign.currentReviews.toString().padStart(2, '0') }}</span>/{{ campaign.targetReviews }} Reviews
                </span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="h-2 bg-blue-100 rounded-full overflow-hidden mb-4">
              <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: `${campaign.progress}%` }"/>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between text-sm text-slate-500">
              <span>Start Date: <span class="text-slate-700">{{ formatDate(campaign.startDate) }}</span></span>
              <span class="flex items-center gap-1.5">
                <span class="text-base">📅</span>
                {{ campaign.daysLeft }} Days left
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Ranking Section -->
      <div class="bg-white rounded-xl border border-slate-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900">Team Ranking</h2>
          <button class="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            Number of reviews
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        <div class="p-4 space-y-2">
          <div v-for="member in teamRankings" :key="member.id" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="relative">
              <img :src="member.avatar" :alt="member.name" class="w-11 h-11 rounded-full">
              <span class="absolute -bottom-1 -right-1 text-lg">🥇</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-900">{{ member.name }}</p>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-xs text-slate-500">{{ member.rating > 0 ? member.rating : '' }} ({{ member.reviews }} Reviews)</span>
              </div>
            </div>
            <div class="relative w-12 h-12">
              <svg class="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" stroke="#E2E8F0" stroke-width="3" fill="none"/>
                <circle cx="18" cy="18" r="15" stroke="#3B82F6" stroke-width="3" fill="none" :stroke-dasharray="`${member.progress * 0.942} 94.2`" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">{{ member.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Competitors Section -->
    <div class="bg-white rounded-xl border border-slate-200">
      <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                  <!-- View Button -->
                  <button class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors">View</button>
                  
                  <!-- 3-dot Menu -->
                  <div class="relative">
                    <button 
                      @click="toggleMenu(competitor.id, $event)"
                      class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                      </svg>
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div 
                      v-if="openMenuId === competitor.id"
                      class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
                    >
                      <button 
                        @click="closeMenu()"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View
                      </button>
                      <button 
                        @click="closeMenu()"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                        Edit
                      </button>
                      <button 
                        @click="closeMenu()"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
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
      <div class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            <button class="p-1.5 text-slate-300" disabled><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
            <button class="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
