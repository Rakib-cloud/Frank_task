<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useUIStore } from '@/stores/ui'
import PageHeader from '@/components/base/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'

const {
  products,
  allProducts,
  categories,
  loading,
  totalPages,
  currentPage,
  searchQuery,
  selectedCategory,
  selectedStatus,
  fetchProducts,
  fetchCategories,
  setSearch,
  setCategory,
  setStatus,
  setSort,
  setPage,
  createProduct,
  updateProduct,
  deleteProduct
} = useProducts()

const uiStore = useUIStore()

// Local state
const localSearch = ref('')
const openMenuId = ref(null)
const sortField = ref('name')
const sortOrder = ref('asc')
const itemsPerPage = ref(10)

// Form state
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const currentProduct = ref(null)
const formData = ref({
  name: '',
  sku: '',
  category: '',
  price: '',
  stock: '',
  status: 'active',
  image: ''
})
const formErrors = ref({})
const formLoading = ref(false)

// Computed
const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Out of Stock', value: 'out_of_stock' },
  { label: 'Inactive', value: 'inactive' }
]

const categoryOptions = computed(() => [
  { label: 'All Categories', value: '' },
  ...categories.value.map(c => ({ label: c.name, value: c.value }))
])

const totalProducts = computed(() => allProducts.value.length)

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, totalProducts.value)
  return `${start}-${end} of ${totalProducts.value}`
})

// Debounced search
let searchTimeout = null
watch(localSearch, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    setSearch(val)
  }, 300)
})

// Methods
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

function handleSort(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  setSort(sortField.value, sortOrder.value)
}

function getSortIcon(field) {
  if (sortField.value !== field) return 'none'
  return sortOrder.value === 'asc' ? 'asc' : 'desc'
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-600 border-green-200'
    case 'out_of_stock':
      return 'bg-red-50 text-red-500 border-red-200'
    case 'inactive':
      return 'bg-slate-100 text-slate-500 border-slate-200'
    default:
      return 'bg-slate-100 text-slate-500 border-slate-200'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'active':
      return 'Active'
    case 'out_of_stock':
      return 'Out of Stock'
    case 'inactive':
      return 'Inactive'
    default:
      return status
  }
}

function getCategoryLabel(categoryValue) {
  const cat = categories.value.find(c => c.value === categoryValue)
  return cat ? cat.name : categoryValue
}

// Form methods
function openCreateModal() {
  isEditing.value = false
  currentProduct.value = null
  formData.value = {
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: ''
  }
  formErrors.value = {}
  showFormModal.value = true
}

function openEditModal(product) {
  closeMenu()
  isEditing.value = true
  currentProduct.value = product
  formData.value = {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price.toString(),
    stock: product.stock.toString(),
    status: product.status,
    image: product.image || ''
  }
  formErrors.value = {}
  showFormModal.value = true
}

function openDeleteConfirm(product) {
  closeMenu()
  currentProduct.value = product
  showDeleteModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  formData.value = {
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: ''
  }
  formErrors.value = {}
}

function closeDeleteModal() {
  showDeleteModal.value = false
  currentProduct.value = null
}

function validateForm() {
  const errors = {}
  
  if (!formData.value.name.trim()) {
    errors.name = 'Product name is required'
  }
  
  if (!formData.value.sku.trim()) {
    errors.sku = 'SKU is required'
  }
  
  if (!formData.value.category) {
    errors.category = 'Category is required'
  }
  
  if (!formData.value.price || isNaN(parseFloat(formData.value.price))) {
    errors.price = 'Valid price is required'
  }
  
  if (formData.value.stock === '' || isNaN(parseInt(formData.value.stock))) {
    errors.stock = 'Valid stock quantity is required'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  formLoading.value = true
  
  try {
    const productData = {
      name: formData.value.name.trim(),
      sku: formData.value.sku.trim(),
      category: formData.value.category,
      price: parseFloat(formData.value.price),
      stock: parseInt(formData.value.stock),
      status: formData.value.status,
      image: formData.value.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    }
    
    if (isEditing.value && currentProduct.value) {
      await updateProduct(currentProduct.value.id, productData)
    } else {
      await createProduct(productData)
    }
    
    closeFormModal()
    fetchProducts()
  } catch (e) {
    console.error('Failed to save product:', e)
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!currentProduct.value) return
  
  formLoading.value = true
  
  try {
    await deleteProduct(currentProduct.value.id)
    closeDeleteModal()
    fetchProducts()
  } catch (e) {
    console.error('Failed to delete product:', e)
  } finally {
    formLoading.value = false
  }
}

// Pagination
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    setPage(page)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    setPage(currentPage.value - 1)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    setPage(currentPage.value + 1)
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchProducts()
  fetchCategories()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<template>
  <div>
    <!-- Header -->
    <PageHeader title="Products">
      <template #actions>
        <BaseButton variant="primary" size="md" @click="openCreateModal">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Product
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Products Table Card -->
    <div class="bg-white rounded-xl border border-slate-200">
      <!-- Filters -->
      <div class="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="localSearch"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <!-- Category Filter -->
          <select
            :value="selectedCategory"
            @change="setCategory($event.target.value)"
            class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>

          <!-- Status Filter -->
          <select
            :value="selectedStatus"
            @change="setStatus($event.target.value)"
            class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div class="text-sm text-slate-500">
          {{ totalProducts }} products
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="px-5 py-3 text-left">
                <button 
                  class="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                  @click="handleSort('name')"
                >
                  Product
                  <svg v-if="getSortIcon('name') === 'asc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                  <svg v-else-if="getSortIcon('name') === 'desc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </th>
              <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">SKU</th>
              <th class="px-5 py-3 text-left">
                <button 
                  class="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                  @click="handleSort('category')"
                >
                  Category
                  <svg v-if="getSortIcon('category') === 'asc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                  <svg v-else-if="getSortIcon('category') === 'desc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </th>
              <th class="px-5 py-3 text-left">
                <button 
                  class="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                  @click="handleSort('price')"
                >
                  Price
                  <svg v-if="getSortIcon('price') === 'asc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                  <svg v-else-if="getSortIcon('price') === 'desc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </th>
              <th class="px-5 py-3 text-left">
                <button 
                  class="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                  @click="handleSort('stock')"
                >
                  Stock
                  <svg v-if="getSortIcon('stock') === 'asc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                  <svg v-else-if="getSortIcon('stock') === 'desc'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </th>
              <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="7" class="px-5 py-12 text-center text-slate-500">
                <div class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Loading products...
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-else-if="products.length === 0">
              <td colspan="7" class="px-5 py-12 text-center text-slate-500">
                <div class="flex flex-col items-center gap-2">
                  <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <p class="text-sm">No products found</p>
                  <BaseButton variant="primary" size="sm" @click="openCreateModal">Add Product</BaseButton>
                </div>
              </td>
            </tr>
            
            <!-- Product Rows -->
            <tr v-else v-for="product in products" :key="product.id" class="hover:bg-slate-50">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img 
                    :src="product.image" 
                    :alt="product.name"
                    class="w-10 h-10 rounded-lg object-cover bg-slate-100"
                  >
                  <div>
                    <p class="text-sm font-medium text-slate-900">{{ product.name }}</p>
                    <p class="text-xs text-slate-500">{{ formatDate(product.createdAt) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-sm text-slate-600 font-mono">{{ product.sku }}</td>
              <td class="px-5 py-4">
                <span class="text-sm text-slate-600">{{ getCategoryLabel(product.category) }}</span>
              </td>
              <td class="px-5 py-4 text-sm font-medium text-slate-900">{{ formatPrice(product.price) }}</td>
              <td class="px-5 py-4 text-sm text-slate-600">{{ product.stock }}</td>
              <td class="px-5 py-4">
                <span :class="['inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border', getStatusClass(product.status)]">
                  {{ getStatusLabel(product.status) }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="openEditModal(product)"
                    class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                  <button 
                    @click="openDeleteConfirm(product)"
                    class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                  
                  <!-- 3-dot Menu -->
                  <div class="relative">
                    <button 
                      @click="toggleMenu(product.id, $event)"
                      class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                      </svg>
                    </button>
                    
                    <!-- Dropdown -->
                    <div 
                      v-if="openMenuId === product.id"
                      class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
                    >
                      <button 
                        @click="openEditModal(product)"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View
                      </button>
                      <button 
                        @click="openEditModal(product)"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                        Edit
                      </button>
                      <button 
                        @click="openDeleteConfirm(product)"
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
        <span class="text-sm text-slate-500">{{ paginationInfo }}</span>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">Rows per page</span>
            <select 
              v-model="itemsPerPage"
              class="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
          <span class="text-sm text-slate-600">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
          <div class="flex items-center gap-1">
            <button 
              :disabled="currentPage <= 1"
              :class="['p-1.5 rounded', currentPage <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100']"
              @click="prevPage"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              :disabled="currentPage >= totalPages"
              :class="['p-1.5 rounded', currentPage >= totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100']"
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
    <BaseModal :show="showFormModal" :title="isEditing ? 'Edit Product' : 'Add New Product'" @close="closeFormModal">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Product Name *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Enter product name"
            :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.name ? 'border-red-500' : 'border-slate-300']"
          >
          <p v-if="formErrors.name" class="mt-1 text-xs text-red-500">{{ formErrors.name }}</p>
        </div>

        <!-- SKU -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">SKU *</label>
          <input
            v-model="formData.sku"
            type="text"
            placeholder="Enter SKU code"
            :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.sku ? 'border-red-500' : 'border-slate-300']"
          >
          <p v-if="formErrors.sku" class="mt-1 text-xs text-red-500">{{ formErrors.sku }}</p>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
          <select
            v-model="formData.category"
            :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.category ? 'border-red-500' : 'border-slate-300']"
          >
            <option value="">Select category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.value">{{ cat.name }}</option>
          </select>
          <p v-if="formErrors.category" class="mt-1 text-xs text-red-500">{{ formErrors.category }}</p>
        </div>

        <!-- Price & Stock -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Price *</label>
            <input
              v-model="formData.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.price ? 'border-red-500' : 'border-slate-300']"
            >
            <p v-if="formErrors.price" class="mt-1 text-xs text-red-500">{{ formErrors.price }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Stock *</label>
            <input
              v-model="formData.stock"
              type="number"
              min="0"
              placeholder="0"
              :class="['w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', formErrors.stock ? 'border-red-500' : 'border-slate-300']"
            >
            <p v-if="formErrors.stock" class="mt-1 text-xs text-red-500">{{ formErrors.stock }}</p>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select
            v-model="formData.status"
            class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Image URL -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Image URL</label>
          <input
            v-model="formData.image"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <BaseButton type="button" variant="outline" size="md" @click="closeFormModal">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" size="md" :loading="formLoading">
            {{ isEditing ? 'Update Product' : 'Create Product' }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="showDeleteModal" title="Delete Product" @close="closeDeleteModal">
      <div class="text-center py-4">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Are you sure?</h3>
        <p class="text-sm text-slate-500 mb-6">
          You are about to delete <strong>{{ currentProduct?.name }}</strong>. This action cannot be undone.
        </p>
        <div class="flex items-center justify-center gap-3">
          <BaseButton type="button" variant="outline" size="md" @click="closeDeleteModal">
            Cancel
          </BaseButton>
          <BaseButton type="button" variant="danger" size="md" :loading="formLoading" @click="handleDelete">
            Delete Product
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

