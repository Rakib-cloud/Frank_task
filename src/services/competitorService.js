import api from './api'

export const competitorService = {
  async getAll(params = {}) {
    const { data } = await api.get('/competitors', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/competitors/${id}`)
    return data
  }
}
