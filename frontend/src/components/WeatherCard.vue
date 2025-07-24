<template>
  <div class="card weather-card">
    <div class="weather-header">
      <div class="location">
        <h3>{{ weather.location?.name || 'Loading...' }}</h3>
        <p>{{ weather.location?.country }}</p>
      </div>
      <img 
        v-if="weather.current?.icon" 
        :src="`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`"
        :alt="weather.current.description"
        class="weather-icon"
      />
    </div>
    
    <div class="weather-main">
      <div class="temperature">
        <span class="temp-value">{{ Math.round(weather.current?.temperature || 0) }}°C</span>
        <span class="feels-like">Feels like {{ Math.round(weather.current?.feels_like || 0) }}°C</span>
      </div>
      <p class="description">{{ weather.current?.description || '' }}</p>
    </div>
    
    <div class="weather-details">
      <div class="detail-item">
        <span class="detail-label">Humidity</span>
        <span class="detail-value">{{ weather.current?.humidity || 0 }}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Pressure</span>
        <span class="detail-value">{{ weather.current?.pressure || 0 }} hPa</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Wind</span>
        <span class="detail-value">{{ weather.current?.wind_speed || 0 }} m/s</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Visibility</span>
        <span class="detail-value">{{ weather.current?.visibility || 0 }} km</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weather: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.weather-card {
  min-height: 280px;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.location h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.location p {
  color: #6b7280;
  font-size: 0.875rem;
}

.weather-main {
  margin-bottom: 1.5rem;
}

.temperature {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.temp-value {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.feels-like {
  color: #6b7280;
  font-size: 0.875rem;
}

.description {
  color: #374151;
  font-size: 1rem;
  text-transform: capitalize;
}

.weather-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-weight: 600;
  color: #1f2937;
}
</style>
