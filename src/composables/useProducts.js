import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useUIStore } from '@/stores/ui'

export function useProducts() {
  const productStore = useProductStore()
  const uiStore = useUIStore()

  const products = computed(() => productStore.paginatedProducts)
  const allProducts = computed(() => productStore.products)
  const categories = computed(() => productStore.categories)
  const loading = computed(() => productStore.loading)
  const error = computed(() => productStore.error)
  const totalPages = computed(() => productStore.totalPages)
  const currentPage = computed(() => productStore.currentPage)
  const searchQuery = computed(() => productStore.searchQuery)
  const selectedCategory = computed(() => productStore.selectedCategory)
  const selectedStatus = computed(() => productStore.selectedStatus)

  function fetchProducts() {
    return productStore.fetchProducts()
  }

  function fetchCategories() {
    return productStore.fetchCategories()
  }

  function setSearch(query) {
    productStore.setSearch(query)
  }

  function setCategory(category) {
    productStore.setCategory(category)
  }

  function setStatus(status) {
    productStore.setStatus(status)
  }

  function setSort(field, order) {
    productStore.setSort(field, order)
  }

  function setPage(page) {
    productStore.setPage(page)
  }

  function resetFilters() {
    productStore.resetFilters()
  }

  async function createProduct(product) {
    const result = await productStore.createProduct(product)
    uiStore.closeModal()
    return result
  }

  async function updateProduct(id, product) {
    const result = await productStore.updateProduct(id, product)
    uiStore.closeModal()
    return result
  }

  async function deleteProduct(id) {
    await productStore.deleteProduct(id)
  }

  function openCreateModal() {
    uiStore.openModal('product-form', null)
  }

  function openEditModal(product) {
    uiStore.openModal('product-form', product)
  }

  function openDeleteModal(product) {
    uiStore.openModal('product-delete', product)
  }

  onMounted(() => {
    if (productStore.products.length === 0) {
      fetchProducts()
      fetchCategories()
    }
  })

  return {
    products,
    allProducts,
    categories,
    loading,
    error,
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
    resetFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    openCreateModal,
    openEditModal,
    openDeleteModal
  }
}

