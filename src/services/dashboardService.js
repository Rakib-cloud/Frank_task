import api from './api'

export const dashboardService = {
  async getStats() {
    const { data } = await api.get('/stats')
    return data
  },

  async getTeamRankings() {
    const { data } = await api.get('/teamRankings')
    return data
  }
}
