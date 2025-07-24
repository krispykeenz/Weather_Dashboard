<template>
  <div class="maps">
    <div v-if="loading" class="loading">
      Loading map data...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <!-- Maps Header -->
      <div class="maps-header mb-6">
        <h2>Global Weather Map</h2>
        <div class="map-controls">
          <button 
            @click="refreshMapData" 
            :disabled="refreshing"
            class="refresh-btn"
          >
            {{ refreshing ? 'Refreshing...' : '🔄 Refresh' }}
          </button>
          <button 
            @click="fitToMarkers"
            class="fit-btn"
          >
            🌍 Fit All
          </button>
        </div>
      </div>
      
      <!-- Main Weather Map -->
      <div class="grid grid-1 mb-6">
        <WeatherMap
          ref="mainMap"
          title="Global Weather Conditions"
          :cities="citiesData"
          :center="[20, 0]"
          :zoom="2"
        />
      </div>
      
      <!-- Cities Weather Grid -->
      <div class="grid grid-3 mb-6">
        <div class="card">
          <h3>Major Cities</h3>
          <div class="cities-list">
            <div 
              v-for="city in citiesData" 
              :key="city.name"
              class="city-item"
              @click="focusOnCity(city)"
            >
              <div class="city-info">
                <div class="city-name">{{ city.name }}</div>
                <div class="city-temp">{{ Math.round(city.temperature) }}°C</div>
              </div>
              <div class="city-details">
                <img 
                  :src="`https://openweathermap.org/img/wn/${city.icon}.png`"
                  :alt="city.description"
                  class="city-icon"
                />
                <div class="city-desc">{{ city.description }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3>Temperature Map</h3>
          <div class="temperature-map">
            <ChartComponent
              title=""
              type="bar"
              :data="temperatureMapData"
              :options="temperatureMapOptions"
            />
          </div>
        </div>
        
        <div class="card">
          <h3>Weather Conditions</h3>
          <div class="conditions-chart">
            <ChartComponent
              title=""
              type="pie"
              :data="conditionsData"
              :options="pieOptions"
            />
          </div>
        </div>
      </div>
      
      <!-- Regional Analysis -->
      <div class="grid grid-2 mb-6">
        <div class="card">
          <h3>Regional Temperature Comparison</h3>
          <D3Chart
            title=""
            :data="regionalTempData"
            chart-type="scatter"
          />
        </div>
        
        <div class="card">
          <h3>Humidity Levels Worldwide</h3>
          <ChartComponent
            title=""
            type="radar"
            :data="humidityRadarData"
            :options="radarOptions"
          />
        </div>
      </div>
      
      <!-- Weather Statistics Table -->
      <div class="card">
        <h3>Global Weather Statistics</h3>
        <div class="stats-table-container">
          <table class="stats-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Pressure</th>
                <th>Wind Speed</th>
                <th>Conditions</th>
                <th>Local Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="city in citiesData" :key="city.name">
                <td class="city-cell">
                  <span class="city-flag">{{ getCityFlag(city.name) }}</span>
                  <span>{{ city.name }}</span>
                </td>
                <td>
                  <span class="temp-value" :class="getTempClass(city.temperature)">
                    {{ Math.round(city.temperature) }}°C
                  </span>
                </td>
                <td>
                  <div class="humidity-bar">
                    <div 
                      class="humidity-fill" 
                      :style="{ width: city.humidity + '%' }"
                    ></div>
                    <span class="humidity-text">{{ city.humidity }}%</span>
                  </div>
                </td>
                <td>{{ Math.round(city.pressure) }} hPa</td>
                <td>{{ Math.round(city.wind_speed) }} m/s</td>
                <td class="weather-conditions">
                  <img 
                    :src="`https://openweathermap.org/img/wn/${city.icon}.png`"
                    :alt="city.description"
                    class="condition-icon"
                  />
                  <span>{{ city.description }}</span>
                </td>
                <td>{{ getLocalTime(city) }}</td>
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
import WeatherMap from '../components/WeatherMap.vue'
import ChartComponent from '../components/ChartComponent.vue'
import D3Chart from '../components/D3Chart.vue'

export default {
  name: 'Maps',
  components: {
    WeatherMap,
    ChartComponent,
    D3Chart
  },
  data() {
    return {
      loading: true,
      error: null,
      citiesData: [],
      refreshing: false
    }
  },
  computed: {
    temperatureMapData() {
      if (!this.citiesData.length) return { labels: [], datasets: [] }
      
      return {
        labels: this.citiesData.map(city => city.name),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: this.citiesData.map(city => city.temperature),
            backgroundColor: this.citiesData.map(city => this.getTemperatureColor(city.temperature)),
            borderColor: '#1f2937',
            borderWidth: 1
          }
        ]
      }
    },
    
    conditionsData() {
      if (!this.citiesData.length) return { labels: [], datasets: [] }
      
      const conditions = {}
      this.citiesData.forEach(city => {
        const condition = city.description.split(' ')[0] // First word
        conditions[condition] = (conditions[condition] || 0) + 1
      })
      
      return {
        labels: Object.keys(conditions),
        datasets: [
          {
            data: Object.values(conditions),
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6',
              '#06b6d4'
            ]
          }
        ]
      }
    },
    
    regionalTempData() {
      return this.citiesData.map((city, index) => ({
        x: city.humidity,
        y: city.temperature
      }))
    },
    
    humidityRadarData() {
      if (!this.citiesData.length) return { labels: [], datasets: [] }
      
      return {
        labels: this.citiesData.map(city => city.name),
        datasets: [
          {
            label: 'Humidity (%)',
            data: this.citiesData.map(city => city.humidity),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2
          }
        ]
      }
    },
    
    temperatureMapOptions() {
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
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          }
        }
      }
    },
    
    pieOptions() {
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
    
    radarOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    }
  },
  async mounted() {
    await this.loadMapData()
  },
  methods: {
    async loadMapData() {
      try {
        this.loading = true
        this.error = null
        
        const citiesWeather = await weatherAPI.getCitiesWeather()
        this.citiesData = citiesWeather.cities || []
        
      } catch (err) {
        this.error = 'Failed to load map data. Please try again.'
        console.error('Map data error:', err)
      } finally {
        this.loading = false
      }
    },
    
    async refreshMapData() {
      this.refreshing = true
      await this.loadMapData()
      this.refreshing = false
    },
    
    focusOnCity(city) {
      if (this.$refs.mainMap && this.$refs.mainMap.map) {
        this.$refs.mainMap.map.setView([city.lat, city.lon], 8)
      }
    },
    
    fitToMarkers() {
      if (this.$refs.mainMap) {
        this.$refs.mainMap.fitBounds()
      }
    },
    
    getTemperatureColor(temp) {
      if (temp < 0) return '#3b82f6'      // Blue for freezing
      if (temp < 10) return '#06b6d4'     // Cyan for cold
      if (temp < 20) return '#10b981'     // Green for cool
      if (temp < 30) return '#f59e0b'     // Yellow for warm
      return '#ef4444'                     // Red for hot
    },
    
    getTempClass(temp) {
      if (temp < 0) return 'temp-freezing'
      if (temp < 10) return 'temp-cold'
      if (temp < 20) return 'temp-cool'
      if (temp < 30) return 'temp-warm'
      return 'temp-hot'
    },
    
    getCityFlag(cityName) {
      const flags = {
        'New York': '🇺🇸',
        'London': '🇬🇧',
        'Tokyo': '🇯🇵',
        'Sydney': '🇦🇺',
        'Paris': '🇫🇷',
        'Moscow': '🇷🇺',
        'Dubai': '🇦🇪',
        'Singapore': '🇸🇬'
      }
      return flags[cityName] || '🌍'
    },
    
    getLocalTime(city) {
      // This is a simplified approach - in a real app, you'd use timezone data
      const timezones = {
        'New York': -5,
        'London': 0,
        'Tokyo': 9,
        'Sydney': 11,
        'Paris': 1,
        'Moscow': 3,
        'Dubai': 4,
        'Singapore': 8
      }
      
      const offset = timezones[city.name] || 0
      const now = new Date()
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
      const cityTime = new Date(utc + (offset * 3600000))
      
      return cityTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }
}
</script>

<style scoped>
.maps {
  padding: 2rem 0;
}

.maps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.maps-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.map-controls {
  display: flex;
  gap: 1rem;
}

.refresh-btn,
.fit-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-btn:hover,
.fit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cities-list {
  max-height: 300px;
  overflow-y: auto;
}

.city-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.3s;
}

.city-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.city-info {
  display: flex;
  flex-direction: column;
}

.city-name {
  font-weight: 600;
  color: #1f2937;
}

.city-temp {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}

.city-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.city-icon {
  width: 32px;
  height: 32px;
}

.city-desc {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
}

.temperature-map,
.conditions-chart {
  height: 250px;
}

.stats-table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.stats-table th,
.stats-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.stats-table th {
  background: rgba(0, 0, 0, 0.02);
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.city-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.city-flag {
  font-size: 1.25rem;
}

.temp-value {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.temp-freezing {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.temp-cold {
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.temp-cool {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.temp-warm {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.temp-hot {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.humidity-bar {
  position: relative;
  width: 80px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.humidity-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s ease;
}

.humidity-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.weather-conditions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.condition-icon {
  width: 24px;
  height: 24px;
}

.weather-conditions span {
  text-transform: capitalize;
}

.mb-6 {
  margin-bottom: 2rem;
}

.grid-1 {
  grid-template-columns: 1fr;
}

@media (max-width: 768px) {
  .maps-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .map-controls {
    justify-content: center;
  }
  
  .stats-table {
    font-size: 0.75rem;
  }
  
  .stats-table th,
  .stats-table td {
    padding: 0.5rem;
  }
  
  .humidity-bar {
    width: 60px;
    height: 16px;
  }
  
  .humidity-text {
    font-size: 0.625rem;
  }
}
</style>
