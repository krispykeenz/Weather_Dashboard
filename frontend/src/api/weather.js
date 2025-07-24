import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
})

export const weatherAPI = {
  async getCurrentWeather(lat = 40.7128, lon = -74.0060) {
    try {
      const response = await api.get('/weather/current', {
        params: { lat, lon }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching current weather:', error)
      throw error
    }
  },

  async getForecast(lat = 40.7128, lon = -74.0060) {
    try {
      const response = await api.get('/weather/forecast', {
        params: { lat, lon }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching forecast:', error)
      throw error
    }
  },

  async getAnalytics(lat = 40.7128, lon = -74.0060) {
    try {
      const response = await api.get('/weather/analytics', {
        params: { lat, lon }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  },

  async getCitiesWeather() {
    try {
      const response = await api.get('/weather/cities')
      return response.data
    } catch (error) {
      console.error('Error fetching cities weather:', error)
      throw error
    }
  },

  async healthCheck() {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }
}

export default weatherAPI
