import axios from 'axios'
import {
  demoAnalytics,
  demoCitiesWeather,
  demoCurrentWeather,
  demoForecast,
  demoHealth
} from '../demo/mockWeatherData.js'

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function cloneJson(value) {
  // Safe deep clone for plain JSON-like fixtures.
  return JSON.parse(JSON.stringify(value))
}

export const weatherAPI = {
  async getCurrentWeather(lat = 40.7128, lon = -74.0060) {
    if (isDemoMode) {
      await sleep(200)
      return cloneJson(demoCurrentWeather)
    }

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
    if (isDemoMode) {
      await sleep(250)
      return cloneJson(demoForecast)
    }

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
    if (isDemoMode) {
      await sleep(250)
      return cloneJson(demoAnalytics)
    }

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
    if (isDemoMode) {
      await sleep(200)
      return cloneJson(demoCitiesWeather)
    }

    try {
      const response = await api.get('/weather/cities')
      return response.data
    } catch (error) {
      console.error('Error fetching cities weather:', error)
      throw error
    }
  },

  async healthCheck() {
    if (isDemoMode) {
      return cloneJson(demoHealth)
    }

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
