<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useUIStore } from '@/stores/ui'
import PageHeader from '@/components/base/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import DataTable from '@/components/base/DataTable.vue'

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

// Table columns
const columns = [
  { key: 'product', label: 'Product', sortable: true },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

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

function handleSort(key) {
  // Map 'product' back to 'name' for sorting
  const actualKey = key === 'product' ? 'name' : key
  if (sortField.value === actualKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = actualKey
    sortOrder.value = 'asc'
  }
  setSort(sortField.value, sortOrder.value)
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
function handlePageChange(page) {
  if (page >= 1 && page <= totalPages.value) {
    setPage(page)
  }
}

function handleItemsPerPageChange(newValue) {
  itemsPerPage.value = newValue
  setPage(1)
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

    <!-- Products DataTable -->
    <DataTable
      :columns="columns"
      :data="products"
      :loading="loading"
      :sort-by="sortField === 'name' ? 'product' : sortField"
      :sort-order="sortOrder"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalProducts"
      :items-per-page="itemsPerPage"
      :hoverable="false"
      empty-text="No products found"
      @sort="handleSort"
      @update:current-page="handlePageChange"
      @update:items-per-page="handleItemsPerPageChange"
    >
      <!-- Filters -->
      <template #filters>
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
      </template>

      <template #header>
        <span class="text-sm text-slate-500">{{ totalProducts }} products</span>
      </template>

      <!-- Custom Cell: Product -->
      <template #cell-product="{ row }">
        <div class="flex items-center gap-3">
          <img 
            :src="row.image" 
            :alt="row.name"
            class="w-10 h-10 rounded-lg object-cover bg-slate-100"
          >
          <div>
            <p class="text-sm font-medium text-slate-900">{{ row.name }}</p>
            <p class="text-xs text-slate-500">{{ formatDate(row.createdAt) }}</p>
          </div>
        </div>
      </template>

      <!-- Custom Cell: SKU -->
      <template #cell-sku="{ row }">
        <span class="text-sm text-slate-600 font-mono">{{ row.sku }}</span>
      </template>

      <!-- Custom Cell: Category -->
      <template #cell-category="{ row }">
        <span class="text-sm text-slate-600">{{ getCategoryLabel(row.category) }}</span>
      </template>

      <!-- Custom Cell: Price -->
      <template #cell-price="{ row }">
        <span class="text-sm font-medium text-slate-900">{{ formatPrice(row.price) }}</span>
      </template>

      <!-- Custom Cell: Stock -->
      <template #cell-stock="{ row }">
        <span class="text-sm text-slate-600">{{ row.stock }}</span>
      </template>

      <!-- Custom Cell: Status -->
      <template #cell-status="{ row }">
        <span :class="['inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border', getStatusClass(row.status)]">
          {{ getStatusLabel(row.status) }}
        </span>
      </template>

      <!-- Custom Cell: Actions -->
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button 
            @click.stop="openEditModal(row)"
            class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </button>
          <button 
            @click.stop="openDeleteConfirm(row)"
            class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
          
          <!-- 3-dot Menu -->
          <div class="relative">
            <button 
              @click.stop="toggleMenu(row.id, $event)"
              class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            
            <!-- Dropdown -->
            <div 
              v-if="openMenuId === row.id"
              class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
            >
              <button 
                @click.stop="openEditModal(row)"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                View
              </button>
              <button 
                @click.stop="openEditModal(row)"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Edit
              </button>
              <button 
                @click.stop="openDeleteConfirm(row)"
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
      </template>

      <!-- Empty Action -->
      <template #empty-action>
        <BaseButton variant="primary" size="sm" class="mt-3" @click="openCreateModal">Add Product</BaseButton>
      </template>
    </DataTable>

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
