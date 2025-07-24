<template>
  <div class="analytics">
    <div v-if="loading" class="loading">
      Loading analytics data...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <!-- Analytics Header -->
      <div class="analytics-header mb-6">
        <h2>Weather Analytics</h2>
        <div class="location-info">
          <span>📍 {{ currentWeather.location?.name }}, {{ currentWeather.location?.country }}</span>
          <span class="update-time">Updated: {{ lastUpdate }}</span>
        </div>
      </div>
      
      <!-- Key Metrics -->
      <div class="grid grid-4 mb-6">
        <div class="card metric-card">
          <div class="metric-icon">🌡️</div>
          <div class="metric-value">{{ Math.round(analytics.temperature_trend?.current || 0) }}°C</div>
          <div class="metric-label">Current Temperature</div>
          <div class="metric-change" :class="tempChangeClass">
            {{ tempChange }}
          </div>
        </div>
        
        <div class="card metric-card">
          <div class="metric-icon">💧</div>
          <div class="metric-value">{{ analytics.humidity_analysis?.current || 0 }}%</div>
          <div class="metric-label">Humidity</div>
          <div class="metric-change" :class="humidityChangeClass">
            {{ humidityChange }}
          </div>
        </div>
        
        <div class="card metric-card">
          <div class="metric-icon">🌬️</div>
          <div class="metric-value">{{ Math.round(analytics.wind_analysis?.current_speed || 0) }} m/s</div>
          <div class="metric-label">Wind Speed</div>
          <div class="metric-change" :class="windChangeClass">
            {{ windChange }}
          </div>
        </div>
        
        <div class="card metric-card">
          <div class="metric-icon">📊</div>
          <div class="metric-value">{{ Math.round(analytics.pressure_analysis?.current || 0) }}</div>
          <div class="metric-label">Pressure (hPa)</div>
          <div class="metric-change" :class="pressureChangeClass">
            {{ pressureChange }}
          </div>
        </div>
      </div>
      
      <!-- D3.js Charts -->
      <div class="grid grid-2 mb-6">
        <D3Chart
          title="Temperature Trend (24h)"
          :data="temperatureD3Data"
          chart-type="area"
        />
        
        <D3Chart
          title="Humidity vs Pressure"
          :data="humidityPressureD3Data"
          chart-type="scatter"
        />
      </div>
      
      <!-- Chart.js Visualizations -->
      <div class="grid grid-2 mb-6">
        <ChartComponent
          title="Wind Speed Analysis"
          type="line"
          :data="windSpeedChartData"
          :options="lineChartOptions"
        />
        
        <ChartComponent
          title="Weather Conditions Distribution"
          type="doughnut"
          :data="conditionsChartData"
          :options="doughnutOptions"
        />
      </div>
      
      <!-- Advanced Analytics -->
      <div class="grid grid-3 mb-6">
        <div class="card">
          <h3>Temperature Analysis</h3>
          <div class="analysis-content">
            <div class="analysis-row">
              <span>Current:</span>
              <span class="value">{{ Math.round(analytics.temperature_trend?.current || 0) }}°C</span>
            </div>
            <div class="analysis-row">
              <span>Forecast Min:</span>
              <span class="value">{{ Math.round(analytics.temperature_trend?.min_forecast || 0) }}°C</span>
            </div>
            <div class="analysis-row">
              <span>Forecast Max:</span>
              <span class="value">{{ Math.round(analytics.temperature_trend?.max_forecast || 0) }}°C</span>
            </div>
            <div class="analysis-row">
              <span>Forecast Avg:</span>
              <span class="value">{{ Math.round(analytics.temperature_trend?.avg_forecast || 0) }}°C</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: temperatureProgress + '%' }"></div>
            </div>
            <div class="progress-label">Temperature Range</div>
          </div>
        </div>
        
        <div class="card">
          <h3>Humidity Insights</h3>
          <div class="analysis-content">
            <div class="humidity-gauge">
              <div class="gauge-container">
                <div class="gauge-fill" :style="{ transform: `rotate(${humidityAngle}deg)` }"></div>
                <div class="gauge-center">
                  <div class="gauge-value">{{ analytics.humidity_analysis?.current || 0 }}%</div>
                </div>
              </div>
            </div>
            <div class="humidity-status" :class="humidityStatusClass">
              {{ humidityStatus }}
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3>Pressure Trends</h3>
          <div class="analysis-content">
            <ChartComponent
              title=""
              type="line"
              :data="pressureTrendData"
              :options="miniChartOptions"
            />
            <div class="trend-indicator">
              <span class="trend-icon" :class="pressureTrendClass">{{ pressureTrendIcon }}</span>
              <span>{{ pressureTrendText }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Weather Forecast Table -->
      <div class="card">
        <h3>Detailed Forecast</h3>
        <div class="forecast-table-container">
          <table class="forecast-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Weather</th>
                <th>Temperature</th>
                <th>Feels Like</th>
                <th>Humidity</th>
                <th>Wind</th>
                <th>Pressure</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailedForecast" :key="item.datetime">
                <td>{{ formatDateTime(item.datetime) }}</td>
                <td class="weather-cell">
                  <img :src="`https://openweathermap.org/img/wn/${item.icon}.png`" :alt="item.description">
                  <span>{{ item.description }}</span>
                </td>
                <td>{{ Math.round(item.temperature) }}°C</td>
                <td>{{ Math.round(item.feels_like) }}°C</td>
                <td>{{ item.humidity }}%</td>
                <td>{{ Math.round(item.wind_speed) }} m/s</td>
                <td>{{ Math.round(item.pressure) }} hPa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { weatherAPI } from '../api/weather.js'
import ChartComponent from '../components/ChartComponent.vue'
import D3Chart from '../components/D3Chart.vue'

export default {
  name: 'Analytics',
  components: {
    ChartComponent,
    D3Chart
  },
  data() {
    return {
      loading: true,
      error: null,
      currentWeather: {},
      forecast: {},
      analytics: {},
      lastUpdate: new Date().toLocaleTimeString()
    }
  },
  computed: {
    tempChange() {
      if (!this.analytics.temperature_trend) return 'No data'
      const current = this.analytics.temperature_trend.current
      const avg = this.analytics.temperature_trend.avg_forecast
      const diff = current - avg
      return diff > 0 ? `+${diff.toFixed(1)}°` : `${diff.toFixed(1)}°`
    },
    
    tempChangeClass() {
      if (!this.analytics.temperature_trend) return ''
      const diff = this.analytics.temperature_trend.current - this.analytics.temperature_trend.avg_forecast
      return diff > 0 ? 'positive' : 'negative'
    },
    
    humidityChange() {
      if (!this.analytics.humidity_analysis) return 'No data'
      const current = this.analytics.humidity_analysis.current
      const avg = this.analytics.humidity_analysis.avg_forecast
      const diff = current - avg
      return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`
    },
    
    humidityChangeClass() {
      if (!this.analytics.humidity_analysis) return ''
      const diff = this.analytics.humidity_analysis.current - this.analytics.humidity_analysis.avg_forecast
      return Math.abs(diff) > 10 ? (diff > 0 ? 'negative' : 'positive') : 'neutral'
    },
    
    windChange() {
      if (!this.analytics.wind_analysis) return 'No data'
      const current = this.analytics.wind_analysis.current_speed
      const avg = this.analytics.wind_analysis.avg_speed
      const diff = current - avg
      return diff > 0 ? `+${diff.toFixed(1)} m/s` : `${diff.toFixed(1)} m/s`
    },
    
    windChangeClass() {
      if (!this.analytics.wind_analysis) return ''
      const diff = this.analytics.wind_analysis.current_speed - this.analytics.wind_analysis.avg_speed
      return diff > 2 ? 'negative' : (diff < -2 ? 'positive' : 'neutral')
    },
    
    pressureChange() {
      if (!this.analytics.pressure_analysis) return 'No data'
      const current = this.analytics.pressure_analysis.current
      const avg = this.analytics.pressure_analysis.avg_forecast
      const diff = current - avg
      return diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`
    },
    
    pressureChangeClass() {
      if (!this.analytics.pressure_analysis) return ''
      const diff = this.analytics.pressure_analysis.current - this.analytics.pressure_analysis.avg_forecast
      return diff > 5 ? 'positive' : (diff < -5 ? 'negative' : 'neutral')
    },
    
    temperatureD3Data() {
      if (!this.analytics.temperature_trend?.hourly_data) return []
      
      return this.analytics.temperature_trend.hourly_data.map(item => ({
        time: item.time,
        value: item.temperature
      }))
    },
    
    humidityPressureD3Data() {
      if (!this.analytics.humidity_analysis?.trend || !this.analytics.pressure_analysis?.trend) return []
      
      const humidityTrend = this.analytics.humidity_analysis.trend
      const pressureTrend = this.analytics.pressure_analysis.trend
      
      return humidityTrend.map((humidity, index) => ({
        x: humidity,
        y: pressureTrend[index] || 0
      }))
    },
    
    windSpeedChartData() {
      if (!this.analytics.wind_analysis?.hourly_speeds) {
        return { labels: [], datasets: [] }
      }
      
      const speeds = this.analytics.wind_analysis.hourly_speeds
      
      return {
        labels: Array.from({ length: speeds.length }, (_, i) => `${i}:00`),
        datasets: [
          {
            label: 'Wind Speed (m/s)',
            data: speeds,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    },
    
    conditionsChartData() {
      // Mock data for weather conditions distribution
      return {
        labels: ['Clear', 'Cloudy', 'Rainy', 'Windy'],
        datasets: [
          {
            data: [30, 25, 20, 25],
            backgroundColor: [
              '#fbbf24',
              '#9ca3af',
              '#3b82f6',
              '#06b6d4'
            ],
            borderWidth: 0
          }
        ]
      }
    },
    
    pressureTrendData() {
      if (!this.analytics.pressure_analysis?.trend) {
        return { labels: [], datasets: [] }
      }
      
      const trend = this.analytics.pressure_analysis.trend.slice(0, 12)
      
      return {
        labels: Array.from({ length: trend.length }, (_, i) => `${i * 2}h`),
        datasets: [
          {
            label: 'Pressure',
            data: trend,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    },
    
    detailedForecast() {
      return this.forecast.forecast?.slice(0, 24) || []
    },
    
    temperatureProgress() {
      if (!this.analytics.temperature_trend) return 0
      const { min_forecast, max_forecast, current } = this.analytics.temperature_trend
      const range = max_forecast - min_forecast
      const position = current - min_forecast
      return range > 0 ? (position / range) * 100 : 50
    },
    
    humidityAngle() {
      const humidity = this.analytics.humidity_analysis?.current || 0
      return (humidity / 100) * 180 - 90 // -90 to 90 degrees
    },
    
    humidityStatus() {
      const humidity = this.analytics.humidity_analysis?.current || 0
      if (humidity < 30) return 'Low'
      if (humidity > 70) return 'High'
      return 'Optimal'
    },
    
    humidityStatusClass() {
      const humidity = this.analytics.humidity_analysis?.current || 0
      if (humidity < 30 || humidity > 70) return 'status-warning'
      return 'status-good'
    },
    
    pressureTrendIcon() {
      if (!this.analytics.pressure_analysis?.trend) return '→'
      const trend = this.analytics.pressure_analysis.trend
      const recent = trend.slice(-3)
      const isRising = recent[2] > recent[0]
      const isFalling = recent[2] < recent[0]
      
      if (isRising) return '↗'
      if (isFalling) return '↘'
      return '→'
    },
    
    pressureTrendText() {
      const icon = this.pressureTrendIcon
      if (icon === '↗') return 'Rising'
      if (icon === '↘') return 'Falling'
      return 'Stable'
    },
    
    pressureTrendClass() {
      const icon = this.pressureTrendIcon
      if (icon === '↗') return 'trend-up'
      if (icon === '↘') return 'trend-down'
      return 'trend-stable'
    },
    
    lineChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    },
    
    doughnutOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    },
    
    miniChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        }
      }
    }
  },
  async mounted() {
    await this.loadAnalyticsData()
  },
  methods: {
    async loadAnalyticsData() {
      try {
        this.loading = true
        this.error = null
        
        const coords = await this.getCurrentLocation()
        
        const [current, forecast, analytics] = await Promise.all([
          weatherAPI.getCurrentWeather(coords.lat, coords.lon),
          weatherAPI.getForecast(coords.lat, coords.lon),
          weatherAPI.getAnalytics(coords.lat, coords.lon)
        ])
        
        this.currentWeather = current
        this.forecast = forecast
        this.analytics = analytics
        this.lastUpdate = new Date().toLocaleTimeString()
        
      } catch (err) {
        this.error = 'Failed to load analytics data. Please try again.'
        console.error('Analytics data error:', err)
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
              resolve({ lat: 40.7128, lon: -74.0060 })
            }
          )
        } else {
          resolve({ lat: 40.7128, lon: -74.0060 })
        }
      })
    },
    
    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.analytics {
  padding: 2rem 0;
}

.analytics-header {
  text-align: center;
  margin-bottom: 2rem;
}

.analytics-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.location-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.metric-card {
  text-align: center;
  position: relative;
}

.metric-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.metric-label {
  color: #6b7280;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.metric-change {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

.metric-change.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.metric-change.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-change.neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.analysis-content {
  margin-top: 1rem;
}

.analysis-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.analysis-row:last-child {
  border-bottom: none;
}

.analysis-row .value {
  font-weight: 600;
  color: #1f2937;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s ease;
}

.progress-label {
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.humidity-gauge {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.gauge-container {
  position: relative;
  width: 120px;
  height: 60px;
  border: 3px solid #e5e7eb;
  border-bottom: none;
  border-radius: 120px 120px 0 0;
  overflow: hidden;
}

.gauge-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: conic-gradient(from 180deg, #ef4444, #f59e0b, #10b981, #3b82f6);
  transform-origin: center bottom;
  transition: transform 0.3s ease;
}

.gauge-center {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.gauge-value {
  font-weight: 700;
  font-size: 0.875rem;
  color: #1f2937;
}

.humidity-status {
  text-align: center;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.trend-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-weight: 600;
}

.trend-icon {
  font-size: 1.25rem;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.trend-stable {
  color: #6b7280;
}

.forecast-table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

.forecast-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.forecast-table th,
.forecast-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.forecast-table th {
  background: rgba(0, 0, 0, 0.02);
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.weather-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weather-cell img {
  width: 24px;
  height: 24px;
}

.weather-cell span {
  text-transform: capitalize;
}

.mb-6 {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .location-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .forecast-table {
    font-size: 0.75rem;
  }
  
  .forecast-table th,
  .forecast-table td {
    padding: 0.5rem;
  }
}
</style>
