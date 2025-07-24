<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
import L from 'leaflet'

export default {
  name: 'WeatherMap',
  props: {
    title: {
      type: String,
      default: 'Weather Map'
    },
    cities: {
      type: Array,
      default: () => []
    },
    center: {
      type: Array,
      default: () => [40.7128, -74.0060]
    },
    zoom: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      map: null,
      markers: []
    }
  },
  watch: {
    cities: {
      handler() {
        this.updateMarkers()
      },
      deep: true
    }
  },
  mounted() {
    this.initMap()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    initMap() {
      // Initialize the map
      this.map = L.map(this.$refs.mapContainer, {
        zoomControl: true,
        attributionControl: true
      }).setView(this.center, this.zoom)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map)

      // Add weather overlay (you can replace this with a weather tile service)
      // Example: precipitation layer from OpenWeatherMap
      // L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', {
      //   attribution: 'Weather data © OpenWeatherMap',
      //   opacity: 0.6
      // }).addTo(this.map)

      this.updateMarkers()
    },

    updateMarkers() {
      // Clear existing markers
      this.markers.forEach(marker => {
        this.map.removeLayer(marker)
      })
      this.markers = []

      // Add new markers
      this.cities.forEach(city => {
        const marker = this.createWeatherMarker(city)
        if (marker) {
          marker.addTo(this.map)
          this.markers.push(marker)
        }
      })
    },

    createWeatherMarker(city) {
      if (!city.lat || !city.lon) return null

      // Create custom icon based on weather condition
      const iconHtml = `
        <div class="weather-marker">
          <div class="marker-temp">${Math.round(city.temperature)}°</div>
          <div class="marker-icon">
            <img src="https://openweathermap.org/img/wn/${city.icon}@2x.png" alt="${city.description}">
          </div>
        </div>
      `

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-weather-marker',
        iconSize: [60, 80],
        iconAnchor: [30, 80],
        popupAnchor: [0, -80]
      })

      // Create popup content
      const popupContent = `
        <div class="weather-popup">
          <h4>${city.name}</h4>
          <div class="popup-weather">
            <img src="https://openweathermap.org/img/wn/${city.icon}@2x.png" alt="${city.description}">
            <div class="popup-details">
              <div class="popup-temp">${Math.round(city.temperature)}°C</div>
              <div class="popup-desc">${city.description}</div>
              <div class="popup-stats">
                <div>Humidity: ${city.humidity}%</div>
                <div>Wind: ${city.wind_speed} m/s</div>
                <div>Pressure: ${city.pressure} hPa</div>
              </div>
            </div>
          </div>
        </div>
      `

      return L.marker([city.lat, city.lon], { icon: customIcon })
        .bindPopup(popupContent)
    },

    fitBounds() {
      if (this.cities.length > 0) {
        const group = new L.featureGroup(this.markers)
        this.map.fitBounds(group.getBounds().pad(0.1))
      }
    }
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.map-container {
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.custom-weather-marker) {
  background: none;
  border: none;
}

:deep(.weather-marker) {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #3b82f6;
  min-width: 60px;
}

:deep(.marker-temp) {
  font-weight: bold;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
}

:deep(.marker-icon img) {
  width: 32px;
  height: 32px;
}

:deep(.weather-popup) {
  min-width: 200px;
}

:deep(.weather-popup h4) {
  margin: 0 0 10px 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

:deep(.popup-weather) {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.popup-weather img) {
  width: 50px;
  height: 50px;
}

:deep(.popup-temp) {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

:deep(.popup-desc) {
  color: #6b7280;
  text-transform: capitalize;
  margin-bottom: 8px;
}

:deep(.popup-stats) {
  font-size: 12px;
  color: #6b7280;
}

:deep(.popup-stats div) {
  margin-bottom: 2px;
}
</style>
