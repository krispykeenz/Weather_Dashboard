<template>
  <div class="dashboard">
    <div v-if="loading" class="loading">
      Loading weather data...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <!-- Current Weather Overview -->
      <div class="grid grid-3 mb-6">
        <WeatherCard :weather="currentWeather" />
        
        <div class="card">
          <h3>Quick Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="metric-value">{{ Math.round(analytics.temperature_trend?.avg_forecast || 0) }}°C</div>
              <div class="metric-label">Avg Temperature</div>
            </div>
            <div class="stat-item">
              <div class="metric-value">{{ Math.round(analytics.humidity_analysis?.avg_forecast || 0) }}%</div>
              <div class="metric-label">Avg Humidity</div>
            </div>
            <div class="stat-item">
              <div class="metric-value">{{ Math.round(analytics.wind_analysis?.avg_speed || 0) }}</div>
              <div class="metric-label">Avg Wind (m/s)</div>
            </div>
            <div class="stat-item">
              <div class="metric-value">{{ Math.round(analytics.pressure_analysis?.avg_forecast || 0) }}</div>
              <div class="metric-label">Pressure (hPa)</div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3>Weather Alerts</h3>
          <div class="alerts">
            <div 
              v-for="alert in weatherAlerts" 
              :key="alert.type"
              :class="['alert', `alert-${alert.level}`]"
            >
              <span class="alert-icon">{{ alert.icon }}</span>
              <div>
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-message">{{ alert.message }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="grid grid-2 mb-6">
        <ChartComponent
          title="24-Hour Temperature Trend"
          :data="temperatureChartData"
          :options="chartOptions"
        />
        
        <ChartComponent
          title="Humidity & Pressure"
          type="bar"
          :data="humidityPressureData"
          :options="barChartOptions"
        />
      </div>
      
      <!-- Forecast Cards -->
      <div class="card">
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">
          <div 
            v-for="day in dailyForecast" 
            :key="day.date"
            class="forecast-card"
          >
            <div class="forecast-date">{{ formatDate(day.date) }}</div>
            <img 
              :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
              :alt="day.description"
              class="forecast-icon"
            />
            <div class="forecast-temps">
              <span class="temp-high">{{ Math.round(day.high) }}°</span>
              <span class="temp-low">{{ Math.round(day.low) }}°</span>
            </div>
            <div class="forecast-desc">{{ day.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { weatherAPI } from '../api/weather.js'
import WeatherCard from '../components/WeatherCard.vue'
import ChartComponent from '../components/ChartComponent.vue'

export default {
  name: 'Dashboard',
  components: {
    WeatherCard,
    ChartComponent
  },
  data() {
    return {
      loading: true,
      error: null,
      currentWeather: {},
      forecast: {},
      analytics: {},
      refreshInterval: null
    }
  },
  computed: {
    weatherAlerts() {
      const alerts = []
      
      if (this.currentWeather.current) {
        const temp = this.currentWeather.current.temperature
        const humidity = this.currentWeather.current.humidity
        const windSpeed = this.currentWeather.current.wind_speed
        
        if (temp > 35) {
          alerts.push({
            type: 'heat',
            level: 'danger',
            icon: '🌡️',
            title: 'Heat Warning',
            message: 'Very high temperature detected'
          })
        } else if (temp < 0) {
          alerts.push({
            type: 'cold',
            level: 'warning',
            icon: '❄️',
            title: 'Freeze Warning',
            message: 'Freezing temperature detected'
          })
        }
        
        if (humidity > 80) {
          alerts.push({
            type: 'humidity',
            level: 'warning',
            icon: '💧',
            title: 'High Humidity',
            message: 'Humidity levels above 80%'
          })
        }
        
        if (windSpeed > 15) {
          alerts.push({
            type: 'wind',
            level: 'warning',
            icon: '💨',
            title: 'Strong Winds',
            message: 'Wind speeds above 15 m/s'
          })
        }
      }
      
      if (alerts.length === 0) {
        alerts.push({
          type: 'normal',
          level: 'good',
          icon: '✅',
          title: 'All Clear',
          message: 'No weather warnings'
        })
      }
      
      return alerts
    },
    
    temperatureChartData() {
      if (!this.analytics.temperature_trend?.hourly_data) {
        return { labels: [], datasets: [] }
      }
      
      const data = this.analytics.temperature_trend.hourly_data
      
      return {
        labels: data.map(item => {
          const date = new Date(item.time)
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: data.map(item => item.temperature),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    },
    
    humidityPressureData() {
      if (!this.analytics.humidity_analysis || !this.analytics.pressure_analysis) {
        return { labels: [], datasets: [] }
      }
      
      return {
        labels: ['Current', 'Forecast Average'],
        datasets: [
          {
            label: 'Humidity (%)',
            data: [
              this.analytics.humidity_analysis.current,
              this.analytics.humidity_analysis.avg_forecast
            ],
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: '#10b981',
            borderWidth: 1
          },
          {
            label: 'Pressure (hPa)',
            data: [
              this.analytics.pressure_analysis.current / 10, // Scale down for visualization
              this.analytics.pressure_analysis.avg_forecast / 10
            ],
            backgroundColor: 'rgba(245, 158, 11, 0.6)',
            borderColor: '#f59e0b',
            borderWidth: 1
          }
        ]
      }
    },
    
    dailyForecast() {
      if (!this.forecast.forecast) return []
      
      const dailyData = {}
      
      this.forecast.forecast.forEach(item => {
        const date = new Date(item.datetime).toDateString()
        
        if (!dailyData[date]) {
          dailyData[date] = {
            date: date,
            temps: [],
            descriptions: [],
            icons: []
          }
        }
        
        dailyData[date].temps.push(item.temperature)
        dailyData[date].descriptions.push(item.description)
        dailyData[date].icons.push(item.icon)
      })
      
      return Object.values(dailyData).slice(0, 5).map(day => ({
        date: day.date,
        high: Math.max(...day.temps),
        low: Math.min(...day.temps),
        description: day.descriptions[0],
        icon: day.icons[0]
      }))
    },
    
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        }
      }
    },
    
    barChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  },
  async mounted() {
    await this.loadWeatherData()
    this.startAutoRefresh()
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async loadWeatherData() {
      try {
        this.loading = true
        this.error = null
        
        // Get user's location or use default
        const coords = await this.getCurrentLocation()
        
        // Load all weather data
        const [current, forecast, analytics] = await Promise.all([
          weatherAPI.getCurrentWeather(coords.lat, coords.lon),
          weatherAPI.getForecast(coords.lat, coords.lon),
          weatherAPI.getAnalytics(coords.lat, coords.lon)
        ])
        
        this.currentWeather = current
        this.forecast = forecast
        this.analytics = analytics
        
      } catch (err) {
        this.error = 'Failed to load weather data. Please try again.'
        console.error('Weather data error:', err)
      } finally {
        this.loading = false
      }
    },
    
    async getCurrentLocation() {
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              })
            },
            () => {
              // Default to New York if geolocation fails
              resolve({ lat: 40.7128, lon: -74.0060 })
            }
          )
        } else {
          resolve({ lat: 40.7128, lon: -74.0060 })
        }
      })
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    
    startAutoRefresh() {
      // Refresh data every 10 minutes
      this.refreshInterval = setInterval(() => {
        this.loadWeatherData()
      }, 10 * 60 * 1000)
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

.mb-6 {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.alerts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
}

.alert-good {
  border-left: 4px solid #10b981;
}

.alert-warning {
  border-left: 4px solid #f59e0b;
}

.alert-danger {
  border-left: 4px solid #ef4444;
}

.alert-icon {
  font-size: 1.25rem;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.875rem;
  color: #6b7280;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.forecast-card {
  text-align: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.forecast-date {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.forecast-icon {
  width: 48px;
  height: 48px;
  margin: 0.5rem 0;
}

.forecast-temps {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.temp-high {
  font-weight: 600;
  color: #1f2937;
}

.temp-low {
  color: #6b7280;
}

.forecast-desc {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
}
</style>
