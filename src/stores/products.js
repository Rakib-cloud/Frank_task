import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/productService'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentProduct = ref(null)

  // Filters and Pagination
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedStatus = ref('')
  const sortBy = ref('name')
  const sortOrder = ref('asc')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const filteredProducts = computed(() => {
    let result = [...products.value]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory.value) {
      result = result.filter(p => p.category === selectedCategory.value)
    }

    // Status filter
    if (selectedStatus.value) {
      result = result.filter(p => p.status === selectedStatus.value)
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortBy.value]
      let valB = b[sortBy.value]

      if (typeof valA === 'string') {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }

      if (sortOrder.value === 'asc') {
        return valA > valB ? 1 : -1
      } else {
        return valA < valB ? 1 : -1
      }
    })

    return result
  })

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProducts.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredProducts.value.length / itemsPerPage.value)
  )

  async function fetchProducts() {
    loading.value = true
    error.value = null
    
    try {
      products.value = await productService.getAll()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await productService.getCategories()
    } catch (e) {
      console.error('Failed to fetch categories:', e)
    }
  }

  async function createProduct(product) {
    loading.value = true
    error.value = null

    try {
      const newProduct = await productService.create(product)
      products.value.push(newProduct)
      return newProduct
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id, product) {
    loading.value = true
    error.value = null

    try {
      const updated = await productService.update(id, product)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id) {
    loading.value = true
    error.value = null

    try {
      await productService.delete(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function setSearch(query) {
    searchQuery.value = query
    currentPage.value = 1
  }

  function setCategory(category) {
    selectedCategory.value = category
    currentPage.value = 1
  }

  function setStatus(status) {
    selectedStatus.value = status
    currentPage.value = 1
  }

  function setSort(field, order = 'asc') {
    sortBy.value = field
    sortOrder.value = order
  }

  function setPage(page) {
    currentPage.value = page
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = ''
    selectedStatus.value = ''
    sortBy.value = 'name'
    sortOrder.value = 'asc'
    currentPage.value = 1
  }

  return {
    products,
    categories,
    loading,
    error,
    currentProduct,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    filteredProducts,
    paginatedProducts,
    totalPages,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    setSearch,
    setCategory,
    setStatus,
    setSort,
    setPage,
    resetFilters
  }
})

