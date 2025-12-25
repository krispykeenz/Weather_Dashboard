// DEMO MODE FIXTURES
// This file is ONLY used when VITE_DEMO_MODE === 'true'.
// It lets the real frontend run without the backend, while keeping the same UI.
// Remove safely if you ever deploy the full stack.

const nowIso = new Date().toISOString()

function hoursFromNowIso(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

function buildForecastList() {
  // Roughly 3-hour intervals for ~5 days (40 points)
  const points = []
  const baseTemp = 18

  for (let i = 0; i < 40; i++) {
    const t = baseTemp + Math.sin(i / 3) * 4 + (i % 5 === 0 ? 1.5 : 0)
    const icons = ['01d', '02d', '03d', '04d', '10d', '09d']
    const descriptions = ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'light rain', 'shower rain']
    const idx = i % icons.length

    points.push({
      datetime: hoursFromNowIso(i * 3),
      temperature: Number(t.toFixed(1)),
      feels_like: Number((t - 0.8).toFixed(1)),
      humidity: 55 + (i % 12),
      wind_speed: Number((3.5 + (i % 5) * 0.6).toFixed(1)),
      pressure: 1012 + (i % 7),
      description: descriptions[idx],
      icon: icons[idx]
    })
  }

  return points
}

export const demoCurrentWeather = {
  location: {
    name: 'New York',
    country: 'US'
  },
  current: {
    temperature: 21.3,
    feels_like: 20.5,
    humidity: 62,
    pressure: 1013,
    wind_speed: 4.8,
    visibility: 10,
    description: 'few clouds',
    icon: '02d',
    updated_at: nowIso
  }
}

export const demoForecast = {
  location: {
    name: 'New York',
    country: 'US'
  },
  forecast: buildForecastList(),
  updated_at: nowIso
}

export const demoAnalytics = {
  location: {
    name: 'New York',
    country: 'US'
  },
  temperature_trend: {
    current: 21.3,
    min_forecast: 14.2,
    max_forecast: 26.8,
    avg_forecast: 19.6,
    hourly_data: Array.from({ length: 24 }, (_, i) => ({
      time: hoursFromNowIso(i),
      temperature: Number((18 + Math.sin(i / 3) * 4 + (i % 6 === 0 ? 1.2 : 0)).toFixed(1))
    }))
  },
  humidity_analysis: {
    current: 62,
    avg_forecast: 58,
    trend: Array.from({ length: 24 }, (_, i) => 50 + ((i * 3) % 30))
  },
  wind_analysis: {
    current_speed: 4.8,
    avg_speed: 4.1,
    hourly_speeds: Array.from({ length: 24 }, (_, i) => Number((3.2 + (i % 7) * 0.4).toFixed(1)))
  },
  pressure_analysis: {
    current: 1013,
    avg_forecast: 1011,
    trend: Array.from({ length: 24 }, (_, i) => 1008 + ((i % 8) * 1.2))
  },
  updated_at: nowIso
}

export const demoCitiesWeather = {
  cities: [
    {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      temperature: 21.3,
      humidity: 62,
      pressure: 1013,
      wind_speed: 4.8,
      description: 'few clouds',
      icon: '02d'
    },
    {
      name: 'London',
      lat: 51.5072,
      lon: -0.1276,
      temperature: 16.8,
      humidity: 71,
      pressure: 1016,
      wind_speed: 5.4,
      description: 'broken clouds',
      icon: '04d'
    },
    {
      name: 'Tokyo',
      lat: 35.6762,
      lon: 139.6503,
      temperature: 24.1,
      humidity: 58,
      pressure: 1009,
      wind_speed: 3.7,
      description: 'clear sky',
      icon: '01d'
    },
    {
      name: 'Sydney',
      lat: -33.8688,
      lon: 151.2093,
      temperature: 19.4,
      humidity: 55,
      pressure: 1018,
      wind_speed: 6.2,
      description: 'light rain',
      icon: '10d'
    },
    {
      name: 'Paris',
      lat: 48.8566,
      lon: 2.3522,
      temperature: 17.9,
      humidity: 65,
      pressure: 1014,
      wind_speed: 4.1,
      description: 'scattered clouds',
      icon: '03d'
    },
    {
      name: 'Moscow',
      lat: 55.7558,
      lon: 37.6173,
      temperature: 9.6,
      humidity: 74,
      pressure: 1020,
      wind_speed: 5.9,
      description: 'overcast clouds',
      icon: '04d'
    },
    {
      name: 'Dubai',
      lat: 25.2048,
      lon: 55.2708,
      temperature: 32.2,
      humidity: 41,
      pressure: 1006,
      wind_speed: 3.3,
      description: 'clear sky',
      icon: '01d'
    },
    {
      name: 'Singapore',
      lat: 1.3521,
      lon: 103.8198,
      temperature: 29.1,
      humidity: 76,
      pressure: 1008,
      wind_speed: 2.9,
      description: 'shower rain',
      icon: '09d'
    }
  ],
  updated_at: nowIso
}

export const demoHealth = {
  status: 'ok',
  demo: true,
  timestamp: nowIso
}
