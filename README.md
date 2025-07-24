# Weather Analytics Dashboard

A comprehensive weather data visualization platform built with Vue.js, D3.js, Chart.js, Leaflet, Flask, and Python.

## Features

### 🌤️ Real-time Weather Data
- Current weather conditions for any location
- 5-day weather forecasts
- Major cities worldwide weather tracking
- Automatic location detection

### 📊 Advanced Analytics
- Temperature trend analysis with D3.js visualizations
- Humidity and pressure tracking
- Wind speed and direction analysis
- Weather pattern recognition

### 🗺️ Interactive Maps
- Global weather map with Leaflet
- City markers with weather information
- Temperature and humidity overlays
- Regional weather comparisons

### 📈 Data Visualizations
- **Chart.js**: Line charts, bar charts, pie charts, radar charts
- **D3.js**: Area charts, scatter plots, custom visualizations
- **Interactive elements**: Hover effects, tooltips, zoom functionality

## Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Chart.js** - Responsive charts and graphs
- **D3.js** - Data-driven document visualizations
- **Leaflet** - Interactive maps
- **Axios** - HTTP client for API calls

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Requests** - HTTP library for external API calls
- **Python-dotenv** - Environment variable management

### External APIs
- **OpenWeatherMap API** - Weather data source

## Project Structure

```
weather-dashboard/
├── backend/
│   ├── app/
│   ├── config/
│   ├── data/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherCard.vue
│   │   │   ├── ChartComponent.vue
│   │   │   ├── D3Chart.vue
│   │   │   └── WeatherMap.vue
│   │   ├── views/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Analytics.vue
│   │   │   └── Maps.vue
│   │   ├── api/
│   │   │   └── weather.js
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenWeatherMap API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenWeatherMap API key:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```

5. **Run the Flask server:**
   ```bash
   python app.py
   ```
   Server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:3000`

## API Endpoints

### Weather Data
- `GET /api/health` - Health check
- `GET /api/weather/current?lat={lat}&lon={lon}` - Current weather
- `GET /api/weather/forecast?lat={lat}&lon={lon}` - 5-day forecast
- `GET /api/weather/analytics?lat={lat}&lon={lon}` - Analytics data
- `GET /api/weather/cities` - Major cities weather

## Dashboard Features

### Main Dashboard
- **Current Weather Card**: Temperature, humidity, pressure, wind
- **Quick Stats**: Average temperature, humidity, wind, pressure
- **Weather Alerts**: Temperature warnings, humidity alerts, wind advisories
- **24-Hour Temperature Trend**: Line chart with Chart.js
- **Humidity & Pressure Bar Chart**: Comparative visualization
- **5-Day Forecast Cards**: Daily weather preview

### Analytics Page
- **Key Metrics**: Real-time weather indicators with change tracking
- **D3.js Visualizations**: 
  - Temperature trend area chart
  - Humidity vs pressure scatter plot
- **Chart.js Components**:
  - Wind speed analysis
  - Weather conditions distribution
- **Advanced Analytics**:
  - Temperature range progress bars
  - Humidity gauge with D3.js
  - Pressure trend indicators
- **Detailed Forecast Table**: Comprehensive weather data

### Maps Page
- **Interactive Leaflet Map**: Global weather visualization
- **City Weather Markers**: Custom icons with weather data
- **Temperature Comparison**: Bar chart for major cities
- **Weather Conditions**: Pie chart distribution
- **Regional Analysis**: D3.js scatter plot
- **Humidity Radar Chart**: Worldwide comparison
- **Statistics Table**: Comprehensive city weather data

## Customization

### Adding New Visualizations
1. Create new component in `frontend/src/components/`
2. Import and register in parent view
3. Add data processing logic
4. Style with CSS

### Adding New API Endpoints
1. Add route in `backend/app.py`
2. Implement data processing logic
3. Update frontend API service in `frontend/src/api/weather.js`

### Styling Customization
- Modify `frontend/src/style.css` for global styles
- Update component-specific styles in `.vue` files
- Colors and themes can be changed in CSS variables

## Environment Variables

### Backend (.env)
```
WEATHER_API_KEY=your_openweathermap_api_key
FLASK_ENV=development
FLASK_DEBUG=True
```

### OpenWeatherMap API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add to backend `.env` file

## Production Deployment

### Backend (Flask)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (Vue.js)
```bash
npm run build
# Serve dist/ folder with nginx or similar
```

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
MIT License - see LICENSE file for details

## Screenshots

### Dashboard View
- Real-time weather data with beautiful cards
- Interactive charts and forecasts
- Responsive design for all devices

### Analytics View
- Advanced D3.js visualizations
- Comprehensive weather analytics
- Detailed forecast tables

### Maps View
- Interactive global weather map
- City markers with weather info
- Regional comparisons and statistics
