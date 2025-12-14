import api from './api'

export const authService = {
  async login(credentials) {
    const { data } = await api.get('/users', {
      params: {
        username: credentials.username,
        password: credentials.password
      }
    })
    
    if (data.length > 0) {
      const user = data[0]
      const token = btoa(`${user.username}:${Date.now()}`)
      return { user, token }
    }
    
    throw new Error('Invalid credentials')
  },

  async getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

