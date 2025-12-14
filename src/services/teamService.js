import api from './api'

export const teamService = {
  async getAll(params = {}) {
    const { data } = await api.get('/teamRankings', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/teamRankings/${id}`)
    return data
  },

  async create(member) {
    const { data } = await api.post('/teamRankings', {
      ...member,
      createdAt: new Date().toISOString().split('T')[0]
    })
    return data
  },

  async update(id, member) {
    const { data } = await api.patch(`/teamRankings/${id}`, member)
    return data
  },

  async delete(id) {
    await api.delete(`/teamRankings/${id}`)
  }
}

