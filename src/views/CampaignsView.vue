<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { campaignService } from '@/services/campaignService'
import PageHeader from '@/components/base/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'

// State
const campaigns = ref([])
const loading = ref(true)
const activeTab = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Modal state
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const currentCampaign = ref(null)
const formLoading = ref(false)
const formErrors = ref({})

const formData = ref({
  name: '',
  status: 'upcoming',
  reward: '',
  rewardCount: 0,
  targetReviews: 10,
  startDate: '',
  endDate: ''
})

// Tabs configuration
const tabs = [
  { value: 'all', label: 'All Campaign' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archive', label: 'Archive' }
]

// Computed
const filteredByTab = computed(() => {
  if (activeTab.value === 'all') return campaigns.value
  return campaigns.value.filter(c => c.status === activeTab.value)
})

const filteredCampaigns = computed(() => {
  let result = filteredByTab.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.reward.toLowerCase().includes(query)
    )
  }
  
  return result
})

const paginatedCampaigns = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCampaigns.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredCampaigns.value.length / itemsPerPage.value)
)

const tabCounts = computed(() => {
  return tabs.map(tab => ({
    ...tab,
    count: tab.value === 'all' 
      ? campaigns.value.length 
      : campaigns.value.filter(c => c.status === tab.value).length
  }))
})

const paginationInfo = computed(() => {
  const total = filteredCampaigns.value.length
  const start = total === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, total)
  return `${start}-${end} of ${total}`
})

// Watch for filter changes to reset page
watch([activeTab, searchQuery], () => {
  currentPage.value = 1
})

// Methods
async function fetchCampaigns() {
  loading.value = true
  try {
    campaigns.value = await campaignService.getAll()
  } catch (e) {
    console.error('Failed to fetch campaigns:', e)
  } finally {
    loading.value = false
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'completed':
      return 'bg-green-50 text-green-600 border-green-200'
    case 'upcoming':
      return 'bg-amber-50 text-amber-600 border-amber-200'
    case 'archive':
      return 'bg-slate-100 text-slate-600 border-slate-200'
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

function getStatusLabel(status) {
  return status.replace('_', ' ')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// CRUD Methods
function openCreateModal() {
  isEditing.value = false
  currentCampaign.value = null
  formData.value = {
    name: '',
    status: 'upcoming',
    reward: '',
    rewardCount: 0,
    targetReviews: 10,
    startDate: '',
    endDate: ''
  }
  formErrors.value = {}
  showFormModal.value = true
}

function openEditModal(campaign) {
  isEditing.value = true
  currentCampaign.value = campaign
  formData.value = {
    name: campaign.name,
    status: campaign.status,
    reward: campaign.reward,
    rewardCount: campaign.rewardCount || 0,
    targetReviews: campaign.targetReviews,
    startDate: campaign.startDate,
    endDate: campaign.endDate || ''
  }
  formErrors.value = {}
  showFormModal.value = true
}

function openDeleteModal(campaign) {
  currentCampaign.value = campaign
  showDeleteModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  formData.value = {
    name: '',
    status: 'upcoming',
    reward: '',
    rewardCount: 0,
    targetReviews: 10,
    startDate: '',
    endDate: ''
  }
  formErrors.value = {}
}

function closeDeleteModal() {
  showDeleteModal.value = false
  currentCampaign.value = null
}

function validateForm() {
  const errors = {}
  
  if (!formData.value.name.trim()) {
    errors.name = 'Campaign name is required'
  }
  
  if (!formData.value.reward.trim()) {
    errors.reward = 'Reward is required'
  }
  
  if (!formData.value.startDate) {
    errors.startDate = 'Start date is required'
  }
  
  if (formData.value.targetReviews < 1) {
    errors.targetReviews = 'Target must be at least 1'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  formLoading.value = true
  
  try {
    const campaignData = {
      name: formData.value.name.trim(),
      status: formData.value.status,
      reward: formData.value.reward.trim(),
      rewardCount: parseInt(formData.value.rewardCount) || 0,
      targetReviews: parseInt(formData.value.targetReviews),
      currentReviews: isEditing.value ? currentCampaign.value.currentReviews : 0,
      progress: isEditing.value ? currentCampaign.value.progress : 0,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate || formData.value.startDate,
      daysLeft: calculateDaysLeft(formData.value.endDate || formData.value.startDate),
      topPerformer: isEditing.value ? currentCampaign.value.topPerformer : null
    }
    
    if (isEditing.value && currentCampaign.value) {
      await campaignService.update(currentCampaign.value.id, campaignData)
    } else {
      await campaignService.create(campaignData)
    }
    
    closeFormModal()
    await fetchCampaigns()
  } catch (e) {
    console.error('Failed to save campaign:', e)
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!currentCampaign.value) return
  
  formLoading.value = true
  
  try {
    await campaignService.delete(currentCampaign.value.id)
    closeDeleteModal()
    await fetchCampaigns()
  } catch (e) {
    console.error('Failed to delete campaign:', e)
  } finally {
    formLoading.value = false
  }
}

function calculateDaysLeft(endDate) {
  if (!endDate) return 0
  const end = new Date(endDate)
  const now = new Date()
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

// Pagination
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Lifecycle
onMounted(() => {
  fetchCampaigns()
})
</script>

<template>
  <div>
    <PageHeader 
      title="My Campaigns" 
      subtitle="Create and manage your marketing campaigns"
    >
      <template #actions>
        <BaseButton variant="primary" size="md" @click="openCreateModal">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create New Campaign
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Filters & Tabs -->
    <div class="bg-white rounded-xl border border-slate-200">
      <!-- Search & Filter Bar -->
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search campaigns..."
            class="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <div class="text-sm text-slate-500">
          {{ filteredCampaigns.length }} campaigns
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-4 border-b border-slate-100">
        <div class="flex gap-1 overflow-x-auto -mb-px">
          <button
            v-for="tab in tabCounts"
            :key="tab.value"
            :class="[
              'flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.value
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            ]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
            <span
              :class="[
                'px-1.5 py-0.5 text-xs rounded-full',
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

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center text-slate-500">
        <div class="flex items-center justify-center gap-2">
          <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Loading campaigns...
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedCampaigns.length === 0" class="p-8 text-center">
        <div class="flex flex-col items-center gap-2">
          <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="text-sm text-slate-500">No campaigns found</p>
          <BaseButton variant="primary" size="sm" @click="openCreateModal">Create Campaign</BaseButton>
        </div>
      </div>

      <!-- Campaign Cards -->
      <div v-else class="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="campaign in paginatedCampaigns"
          :key="campaign.id"
          class="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-slate-900 truncate">{{ campaign.name }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="flex items-center gap-1 text-sm">
                  <span class="text-lg">🎁</span>
                  <span class="text-slate-700 font-medium">{{ campaign.reward }}</span>
                </span>
                <span v-if="campaign.rewardCount" class="text-xs text-slate-400">
                  {{ campaign.rewardCount }} more
                </span>
              </div>
            </div>
            <span :class="['px-2.5 py-1 text-xs font-medium rounded-full border capitalize', getStatusClass(campaign.status)]">
              {{ getStatusLabel(campaign.status) }}
            </span>
          </div>

          <!-- Top Performer -->
          <div v-if="campaign.topPerformer" class="flex items-center gap-2 mb-3 text-sm">
            <span class="text-slate-500">Top:</span>
            <img :src="campaign.topPerformer.avatar" :alt="campaign.topPerformer.name" class="w-5 h-5 rounded-full">
            <span class="text-slate-700 font-medium">{{ campaign.topPerformer.name }}</span>
          </div>

          <!-- Progress -->
          <div class="flex items-center gap-3 mb-3">
            <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: `${campaign.progress}%` }"/>
            </div>
            <span class="text-xs font-medium text-slate-600 min-w-[60px] text-right">
              {{ campaign.currentReviews }}/{{ campaign.targetReviews }}
            </span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{{ formatDate(campaign.startDate) }}</span>
            <span v-if="campaign.daysLeft > 0" class="flex items-center gap-1">
              <span>📅</span> {{ campaign.daysLeft }} days left
            </span>
            <span v-else class="text-slate-400">Ended</span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              @click="openEditModal(campaign)"
              class="flex-1 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              @click="openDeleteModal(campaign)"
              class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && filteredCampaigns.length > 0" class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-sm text-slate-500">{{ paginationInfo }}</span>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">Per page</span>
            <select 
              v-model="itemsPerPage"
              class="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option :value="6">6</option>
              <option :value="12">12</option>
              <option :value="24">24</option>
            </select>
          </div>
          <span class="text-sm text-slate-600">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
          <div class="flex items-center gap-1">
            <button 
              :disabled="currentPage <= 1"
              :class="['p-1.5 rounded', currentPage <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
              @click="prevPage"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              :disabled="currentPage >= totalPages"
              :class="['p-1.5 rounded', currentPage >= totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 cursor-pointer']"
              @click="nextPage"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal :show="showFormModal" :title="isEditing ? 'Edit Campaign' : 'Create New Campaign'" @close="closeFormModal">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Campaign Name *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Enter campaign name"
            :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.name ? 'border-red-500' : 'border-slate-300']"
          >
          <p v-if="formErrors.name" class="mt-1 text-xs text-red-500">{{ formErrors.name }}</p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select
            v-model="formData.status"
            class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archive">Archive</option>
          </select>
        </div>

        <!-- Reward -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Reward *</label>
          <input
            v-model="formData.reward"
            type="text"
            placeholder="e.g., €50 Gift Card"
            :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.reward ? 'border-red-500' : 'border-slate-300']"
          >
          <p v-if="formErrors.reward" class="mt-1 text-xs text-red-500">{{ formErrors.reward }}</p>
        </div>

        <!-- Reward Count & Target -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Reward Count</label>
            <input
              v-model="formData.rewardCount"
              type="number"
              min="0"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Target Reviews *</label>
            <input
              v-model="formData.targetReviews"
              type="number"
              min="1"
              :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.targetReviews ? 'border-red-500' : 'border-slate-300']"
            >
            <p v-if="formErrors.targetReviews" class="mt-1 text-xs text-red-500">{{ formErrors.targetReviews }}</p>
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Start Date *</label>
            <input
              v-model="formData.startDate"
              type="date"
              :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.startDate ? 'border-red-500' : 'border-slate-300']"
            >
            <p v-if="formErrors.startDate" class="mt-1 text-xs text-red-500">{{ formErrors.startDate }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
            <input
              v-model="formData.endDate"
              type="date"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <BaseButton type="button" variant="outline" size="md" @click="closeFormModal">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" size="md" :loading="formLoading">
            {{ isEditing ? 'Update Campaign' : 'Create Campaign' }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="showDeleteModal" title="Delete Campaign" @close="closeDeleteModal">
      <div class="text-center py-4">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Are you sure?</h3>
        <p class="text-sm text-slate-500 mb-6">
          You are about to delete <strong>{{ currentCampaign?.name }}</strong>. This action cannot be undone.
        </p>
        <div class="flex items-center justify-center gap-3">
          <BaseButton type="button" variant="outline" size="md" @click="closeDeleteModal">
            Cancel
          </BaseButton>
          <BaseButton type="button" variant="danger" size="md" :loading="formLoading" @click="handleDelete">
            Delete Campaign
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
