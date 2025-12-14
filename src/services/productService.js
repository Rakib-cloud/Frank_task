import api from './api'

export const productService = {
  async getAll(params = {}) {
    const { data } = await api.get('/products', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  async create(product) {
    const { data } = await api.post('/products', {
      ...product,
      createdAt: new Date().toISOString().split('T')[0]
    })
    return data
  },

  async update(id, product) {
    const { data } = await api.patch(`/products/${id}`, product)
    return data
  },

  async delete(id) {
    await api.delete(`/products/${id}`)
  },

  async getCategories() {
    const { data } = await api.get('/categories')
    return data
  }
}

