import api from './api'

export const campaignService = {
  async getAll(params = {}) {
    const { data } = await api.get('/campaigns', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/campaigns/${id}`)
    return data
  },

  async create(campaign) {
    const { data } = await api.post('/campaigns', campaign)
    return data
  },

  async update(id, campaign) {
    const { data } = await api.patch(`/campaigns/${id}`, campaign)
    return data
  },

  async delete(id) {
    await api.delete(`/campaigns/${id}`)
  }
}

