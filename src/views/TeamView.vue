<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { teamService } from '@/services/teamService'
import PageHeader from '@/components/base/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'

// State
const teamMembers = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')
const sortBy = ref('reviews')
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Modal state
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const currentMember = ref(null)
const formLoading = ref(false)
const formErrors = ref({})

const formData = ref({
  name: '',
  email: '',
  role: 'Reviewer',
  department: 'Sales',
  rating: 0,
  reviews: 0,
  progress: 0,
  status: 'active'
})

// Options
const departments = ['Sales', 'Marketing', 'Support']
const roles = ['Junior Reviewer', 'Reviewer', 'Senior Reviewer', 'Team Lead']
const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]
const departmentOptions = computed(() => [
  { label: 'All Departments', value: '' },
  ...departments.map(d => ({ label: d, value: d }))
])
const sortOptions = [
  { label: 'Reviews (High to Low)', value: 'reviews' },
  { label: 'Rating (High to Low)', value: 'rating' },
  { label: 'Progress (High to Low)', value: 'progress' },
  { label: 'Name (A-Z)', value: 'name' }
]

// Computed
const filteredMembers = computed(() => {
  let result = [...teamMembers.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query)
    )
  }
  
  // Department filter
  if (selectedDepartment.value) {
    result = result.filter(m => m.department === selectedDepartment.value)
  }
  
  // Status filter
  if (selectedStatus.value) {
    result = result.filter(m => m.status === selectedStatus.value)
  }
  
  // Sorting
  result.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    }
    return b[sortBy.value] - a[sortBy.value]
  })
  
  return result
})

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMembers.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredMembers.value.length / itemsPerPage.value)
)

const paginationInfo = computed(() => {
  const total = filteredMembers.value.length
  const start = total === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, total)
  return `${start}-${end} of ${total}`
})

// Watch for filter changes to reset page
watch([searchQuery, selectedDepartment, selectedStatus, sortBy], () => {
  currentPage.value = 1
})

// Methods
async function fetchTeamMembers() {
  loading.value = true
  try {
    teamMembers.value = await teamService.getAll()
  } catch (e) {
    console.error('Failed to fetch team members:', e)
  } finally {
    loading.value = false
  }
}

function getRankBadge(index) {
  const badges = ['🥇', '🥈', '🥉']
  return badges[index] || `#${index + 1}`
}

function getStatusClass(status) {
  return status === 'active' 
    ? 'bg-green-50 text-green-600 border-green-200' 
    : 'bg-slate-100 text-slate-500 border-slate-200'
}

function generateAvatar(name) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
}

// CRUD Methods
function openCreateModal() {
  isEditing.value = false
  currentMember.value = null
  formData.value = {
    name: '',
    email: '',
    role: 'Reviewer',
    department: 'Sales',
    rating: 0,
    reviews: 0,
    progress: 0,
    status: 'active'
  }
  formErrors.value = {}
  showFormModal.value = true
}

function openEditModal(member) {
  isEditing.value = true
  currentMember.value = member
  formData.value = {
    name: member.name,
    email: member.email,
    role: member.role,
    department: member.department,
    rating: member.rating,
    reviews: member.reviews,
    progress: member.progress,
    status: member.status
  }
  formErrors.value = {}
  showFormModal.value = true
}

function openDeleteModal(member) {
  currentMember.value = member
  showDeleteModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  formData.value = {
    name: '',
    email: '',
    role: 'Reviewer',
    department: 'Sales',
    rating: 0,
    reviews: 0,
    progress: 0,
    status: 'active'
  }
  formErrors.value = {}
}

function closeDeleteModal() {
  showDeleteModal.value = false
  currentMember.value = null
}

function validateForm() {
  const errors = {}
  
  if (!formData.value.name.trim()) {
    errors.name = 'Name is required'
  }
  
  if (!formData.value.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.email = 'Invalid email format'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  formLoading.value = true
  
  try {
    const memberData = {
      name: formData.value.name.trim(),
      email: formData.value.email.trim(),
      role: formData.value.role,
      department: formData.value.department,
      rating: parseFloat(formData.value.rating) || 0,
      reviews: parseInt(formData.value.reviews) || 0,
      progress: parseInt(formData.value.progress) || 0,
      status: formData.value.status,
      avatar: isEditing.value ? currentMember.value.avatar : generateAvatar(formData.value.name),
      joinedAt: isEditing.value ? currentMember.value.joinedAt : new Date().toISOString().split('T')[0]
    }
    
    if (isEditing.value && currentMember.value) {
      await teamService.update(currentMember.value.id, memberData)
    } else {
      await teamService.create(memberData)
    }
    
    closeFormModal()
    await fetchTeamMembers()
  } catch (e) {
    console.error('Failed to save member:', e)
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!currentMember.value) return
  
  formLoading.value = true
  
  try {
    await teamService.delete(currentMember.value.id)
    closeDeleteModal()
    await fetchTeamMembers()
  } catch (e) {
    console.error('Failed to delete member:', e)
  } finally {
    formLoading.value = false
  }
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
  fetchTeamMembers()
})
</script>

<template>
  <div>
    <PageHeader 
      title="Team Members" 
      subtitle="Manage your team and view performance"
    >
      <template #actions>
        <BaseButton variant="primary" size="md" @click="openCreateModal">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Member
        </BaseButton>
      </template>
    </PageHeader>

    <div class="bg-white rounded-xl border border-slate-200">
      <!-- Filters -->
      <div class="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search members..."
              class="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <!-- Department Filter -->
          <select
            v-model="selectedDepartment"
            class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option v-for="opt in departmentOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="selectedStatus"
            class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <!-- Sort -->
          <select
            v-model="sortBy"
            class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          
          <span class="text-sm text-slate-500">{{ filteredMembers.length }} members</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center text-slate-500">
        <div class="flex items-center justify-center gap-2">
          <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Loading team members...
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedMembers.length === 0" class="p-8 text-center">
        <div class="flex flex-col items-center gap-2">
          <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <p class="text-sm text-slate-500">No team members found</p>
          <BaseButton variant="primary" size="sm" @click="openCreateModal">Add Member</BaseButton>
        </div>
      </div>

      <!-- Team Members List -->
      <div v-else class="divide-y divide-slate-100">
        <div
          v-for="(member, index) in paginatedMembers"
          :key="member.id"
          class="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
        >
          <!-- Rank -->
          <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            <span v-if="index < 3 && currentPage === 1 && !searchQuery && !selectedDepartment && !selectedStatus">
              {{ getRankBadge(index) }}
            </span>
            <span v-else>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
          </div>

          <!-- Avatar -->
          <img :src="member.avatar" :alt="member.name" class="w-12 h-12 rounded-full flex-shrink-0">

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-semibold text-slate-900 truncate">{{ member.name }}</p>
              <span :class="['px-2 py-0.5 text-xs font-medium rounded-full border', getStatusClass(member.status)]">
                {{ member.status }}
              </span>
            </div>
            <p class="text-sm text-slate-500 truncate">{{ member.email }}</p>
            <div class="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span class="px-2 py-0.5 bg-slate-100 rounded">{{ member.role }}</span>
              <span>{{ member.department }}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="hidden sm:flex items-center gap-6">
            <div class="text-center">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-sm font-semibold text-slate-900">{{ member.rating > 0 ? member.rating.toFixed(1) : '-' }}</span>
              </div>
              <p class="text-xs text-slate-500">Rating</p>
            </div>
            <div class="text-center">
              <p class="text-sm font-semibold text-slate-900">{{ member.reviews }}</p>
              <p class="text-xs text-slate-500">Reviews</p>
            </div>
          </div>

          <!-- Progress Circle -->
          <div class="relative w-12 h-12 flex-shrink-0">
            <svg class="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" stroke="#E2E8F0" stroke-width="3" fill="none"/>
              <circle 
                cx="18" 
                cy="18" 
                r="15" 
                stroke="#3B82F6" 
                stroke-width="3" 
                fill="none" 
                :stroke-dasharray="`${member.progress * 0.942} 94.2`" 
                stroke-linecap="round"
              />
            </svg>
            <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">
              {{ member.progress }}%
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              @click="openEditModal(member)"
              class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
              title="Edit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </button>
            <button
              @click="openDeleteModal(member)"
              class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
              title="Delete"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && filteredMembers.length > 0" class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-sm text-slate-500">{{ paginationInfo }}</span>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">Per page</span>
            <select 
              v-model="itemsPerPage"
              class="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
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
    <BaseModal :show="showFormModal" :title="isEditing ? 'Edit Team Member' : 'Add New Member'" @close="closeFormModal">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Enter full name"
            :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.name ? 'border-red-500' : 'border-slate-300']"
          >
          <p v-if="formErrors.name" class="mt-1 text-xs text-red-500">{{ formErrors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="email@example.com"
            :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.email ? 'border-red-500' : 'border-slate-300']"
          >
          <p v-if="formErrors.email" class="mt-1 text-xs text-red-500">{{ formErrors.email }}</p>
        </div>

        <!-- Role & Department -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <select
              v-model="formData.role"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
            <select
              v-model="formData.department"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
        </div>

        <!-- Rating & Reviews -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Rating</label>
            <input
              v-model="formData.rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Reviews</label>
            <input
              v-model="formData.reviews"
              type="number"
              min="0"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- Progress & Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Progress (%)</label>
            <input
              v-model="formData.progress"
              type="number"
              min="0"
              max="100"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              v-model="formData.status"
              class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <BaseButton type="button" variant="outline" size="md" @click="closeFormModal">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" size="md" :loading="formLoading">
            {{ isEditing ? 'Update Member' : 'Add Member' }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="showDeleteModal" title="Delete Team Member" @close="closeDeleteModal">
      <div class="text-center py-4">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Are you sure?</h3>
        <p class="text-sm text-slate-500 mb-6">
          You are about to remove <strong>{{ currentMember?.name }}</strong> from the team. This action cannot be undone.
        </p>
        <div class="flex items-center justify-center gap-3">
          <BaseButton type="button" variant="outline" size="md" @click="closeDeleteModal">
            Cancel
          </BaseButton>
          <BaseButton type="button" variant="danger" size="md" :loading="formLoading" @click="handleDelete">
            Remove Member
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
