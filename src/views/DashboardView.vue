<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { dashboardService } from '@/services/dashboardService'
import { campaignService } from '@/services/campaignService'
import { competitorService } from '@/services/competitorService'
import BaseButton from '@/components/base/BaseButton.vue'
import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue'
import DashboardCampaignCard from '@/components/dashboard/DashboardCampaignCard.vue'
import DashboardTeamRanking from '@/components/dashboard/DashboardTeamRanking.vue'
import DashboardCompetitors from '@/components/dashboard/DashboardCompetitors.vue'

const { userName } = useAuth()

// State
const stats = ref(null)
const campaigns = ref([])
const teamRankings = ref([])
const competitors = ref([])
const loading = ref(true)
const activeTab = ref('all')

// Pagination
const campaignPage = ref(1)
const campaignPerPage = ref(3)

// Computed
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

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

const paginatedCampaigns = computed(() => {
  const start = (campaignPage.value - 1) * campaignPerPage.value
  const end = start + campaignPerPage.value
  return filteredCampaigns.value.slice(start, end)
})

const campaignTotalPages = computed(() => 
  Math.ceil(filteredCampaigns.value.length / campaignPerPage.value)
)

// Formatted values for stat cards
const totalReviewsValue = computed(() => 
  stats.value?.totalReviews?.toString().padStart(2, '0') || '00'
)

const averageRatingValue = computed(() => 
  stats.value?.averageRating || '0'
)

const activeMembersValue = computed(() => 
  stats.value?.activeMembers?.toLocaleString() || '0'
)

const totalCampaignsValue = computed(() => 
  stats.value?.totalCampaigns?.toLocaleString() || '0'
)

// Watchers
watch(activeTab, () => {
  campaignPage.value = 1
})

// Lifecycle
onMounted(async () => {
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

// Pagination methods
function prevCampaignPage() {
  if (campaignPage.value > 1) campaignPage.value--
}

function nextCampaignPage() {
  if (campaignPage.value < campaignTotalPages.value) campaignPage.value++
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl lg:text-2xl font-bold text-slate-900">{{ greeting }},</h1>
        <h1 class="text-xl lg:text-2xl font-bold text-slate-900">{{ userName }} 👋</h1>
      </div>
      <BaseButton variant="primary" size="md" class="shrink-0">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <span class="hidden sm:inline">Add Member</span>
        <span class="sm:hidden">Add</span>
      </BaseButton>
    </div>

    <!-- Stats Cards - 2 on mobile, 4 on large -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      <DashboardStatCard 
        title="Total reviews" 
        :value="totalReviewsValue" 
        icon="star"
      />
      <DashboardStatCard 
        title="Average rating" 
        :value="averageRatingValue" 
        icon="star"
        show-star
        show-calendar
      />
      <DashboardStatCard 
        title="Active Members" 
        :value="activeMembersValue" 
        icon="users"
        class="hidden lg:block"
      />
      <DashboardStatCard 
        title="Total Campaign" 
        :value="totalCampaignsValue" 
        icon="calendar"
        class="hidden lg:block"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
      <!-- My Campaigns Section -->
      <div class="xl:col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col lg:h-[580px]">
        <div class="p-4 lg:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900">My Campaigns</h2>
          <BaseButton variant="primary" size="md">
            <svg class="w-4 h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="hidden sm:inline">Create New Campaign</span>
            <span class="sm:hidden">Create</span>
          </BaseButton>
        </div>

        <!-- Tabs -->
        <div class="px-4 lg:px-5 border-b border-slate-100 overflow-x-auto">
          <div class="flex gap-4 lg:gap-6 -mb-px min-w-max">
            <button
              v-for="tab in campaignTabs"
              :key="tab.value"
              :class="[
                'flex items-center gap-1.5 lg:gap-2 py-3 text-xs lg:text-sm font-medium whitespace-nowrap border-b-2 cursor-pointer transition-colors',
                activeTab === tab.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              ]"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
              <span
                :class="[
                  'px-1.5 lg:px-2 py-0.5 text-xs rounded-md',
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
        <div class="flex-1 p-4 lg:p-5 space-y-3 lg:space-y-4 overflow-y-auto">
          <div v-if="paginatedCampaigns.length === 0" class="flex items-center justify-center h-full text-slate-400">
            No campaigns found
          </div>
          <DashboardCampaignCard
            v-for="campaign in paginatedCampaigns"
            :key="campaign.id"
            :campaign="campaign"
          />
        </div>

        <!-- Campaign Pagination -->
        <div class="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-500">{{ filteredCampaigns.length }} campaigns</span>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">{{ campaignPage }} / {{ campaignTotalPages || 1 }}</span>
            <button 
              :disabled="campaignPage <= 1"
              :class="['p-1 rounded', campaignPage <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
              @click="prevCampaignPage"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              :disabled="campaignPage >= campaignTotalPages"
              :class="['p-1 rounded', campaignPage >= campaignTotalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
              @click="nextCampaignPage"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Team Ranking Section -->
      <DashboardTeamRanking :team-rankings="teamRankings" />
    </div>

    <!-- Competitors Section -->
    <DashboardCompetitors :competitors="competitors" />
  </div>
</template>
