from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenWeatherMap API configuration
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY', 'your_api_key_here')
WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

def get_weather_data(lat, lon):
    """Fetch current weather data for given coordinates"""
    url = f"{WEATHER_BASE_URL}/weather"
    params = {
        'lat': lat,
        'lon': lon,
        'appid': WEATHER_API_KEY,
        'units': 'metric'
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}

def get_forecast_data(lat, lon):
    """Fetch 5-day forecast data for given coordinates"""
    url = f"{WEATHER_BASE_URL}/forecast"
    params = {
        'lat': lat,
        'lon': lon,
        'appid': WEATHER_API_KEY,
        'units': 'metric'
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/weather/current')
def current_weather():
    """Get current weather for specified coordinates"""
    lat = request.args.get('lat', default=40.7128, type=float)  # Default: NYC
    lon = request.args.get('lon', default=-74.0060, type=float)
    
    weather_data = get_weather_data(lat, lon)
    
    if 'error' in weather_data:
        return jsonify({'error': weather_data['error']}), 500
    
    # Format response for frontend
    formatted_data = {
        'location': {
            'name': weather_data['name'],
            'country': weather_data['sys']['country'],
            'lat': lat,
            'lon': lon
        },
        'current': {
            'temperature': weather_data['main']['temp'],
            'feels_like': weather_data['main']['feels_like'],
            'humidity': weather_data['main']['humidity'],
            'pressure': weather_data['main']['pressure'],
            'visibility': weather_data.get('visibility', 0) / 1000,  # Convert to km
            'wind_speed': weather_data['wind']['speed'],
            'wind_direction': weather_data['wind'].get('deg', 0),
            'cloudiness': weather_data['clouds']['all'],
            'description': weather_data['weather'][0]['description'],
            'icon': weather_data['weather'][0]['icon'],
            'timestamp': datetime.now().isoformat()
        }
    }
    
    return jsonify(formatted_data)

@app.route('/api/weather/forecast')
def weather_forecast():
    """Get 5-day weather forecast for specified coordinates"""
    lat = request.args.get('lat', default=40.7128, type=float)
    lon = request.args.get('lon', default=-74.0060, type=float)
    
    forecast_data = get_forecast_data(lat, lon)
    
    if 'error' in forecast_data:
        return jsonify({'error': forecast_data['error']}), 500
    
    # Format forecast data
    formatted_forecast = []
    for item in forecast_data['list']:
        formatted_forecast.append({
            'datetime': item['dt_txt'],
            'temperature': item['main']['temp'],
            'feels_like': item['main']['feels_like'],
            'humidity': item['main']['humidity'],
            'pressure': item['main']['pressure'],
            'wind_speed': item['wind']['speed'],
            'wind_direction': item['wind'].get('deg', 0),
            'cloudiness': item['clouds']['all'],
            'description': item['weather'][0]['description'],
            'icon': item['weather'][0]['icon'],
            'precipitation': item.get('rain', {}).get('3h', 0) + item.get('snow', {}).get('3h', 0)
        })
    
    response_data = {
        'location': {
            'name': forecast_data['city']['name'],
            'country': forecast_data['city']['country'],
            'lat': lat,
            'lon': lon
        },
        'forecast': formatted_forecast
    }
    
    return jsonify(response_data)

@app.route('/api/weather/analytics')
def weather_analytics():
    """Generate analytics data for dashboard visualizations"""
    lat = request.args.get('lat', default=40.7128, type=float)
    lon = request.args.get('lon', default=-74.0060, type=float)
    
    # Get current and forecast data
    current = get_weather_data(lat, lon)
    forecast = get_forecast_data(lat, lon)
    
    if 'error' in current or 'error' in forecast:
        return jsonify({'error': 'Failed to fetch weather data'}), 500
    
    # Calculate analytics
    temps = [item['main']['temp'] for item in forecast['list'][:40]]  # 5 days of data
    humidity_data = [item['main']['humidity'] for item in forecast['list'][:40]]
    pressure_data = [item['main']['pressure'] for item in forecast['list'][:40]]
    wind_speeds = [item['wind']['speed'] for item in forecast['list'][:40]]
    
    analytics = {
        'temperature_trend': {
            'current': current['main']['temp'],
            'min_forecast': min(temps),
            'max_forecast': max(temps),
            'avg_forecast': sum(temps) / len(temps),
            'hourly_data': [
                {
                    'time': forecast['list'][i]['dt_txt'],
                    'temperature': forecast['list'][i]['main']['temp']
                }
                for i in range(min(24, len(forecast['list'])))  # 24 hours
            ]
        },
        'humidity_analysis': {
            'current': current['main']['humidity'],
            'avg_forecast': sum(humidity_data) / len(humidity_data),
            'trend': humidity_data[:24]  # 24 hours
        },
        'pressure_analysis': {
            'current': current['main']['pressure'],
            'avg_forecast': sum(pressure_data) / len(pressure_data),
            'trend': pressure_data[:24]
        },
        'wind_analysis': {
            'current_speed': current['wind']['speed'],
            'current_direction': current['wind'].get('deg', 0),
            'avg_speed': sum(wind_speeds) / len(wind_speeds),
            'max_speed': max(wind_speeds),
            'hourly_speeds': wind_speeds[:24]
        }
    }
    
    return jsonify(analytics)

@app.route('/api/weather/cities')
def major_cities_weather():
    """Get weather data for major cities worldwide"""
    cities = [
        {'name': 'New York', 'lat': 40.7128, 'lon': -74.0060},
        {'name': 'London', 'lat': 51.5074, 'lon': -0.1278},
        {'name': 'Tokyo', 'lat': 35.6762, 'lon': 139.6503},
        {'name': 'Sydney', 'lat': -33.8688, 'lon': 151.2093},
        {'name': 'Paris', 'lat': 48.8566, 'lon': 2.3522},
        {'name': 'Moscow', 'lat': 55.7558, 'lon': 37.6173},
        {'name': 'Dubai', 'lat': 25.2048, 'lon': 55.2708},
        {'name': 'Singapore', 'lat': 1.3521, 'lon': 103.8198}
    ]
    
    cities_data = []
    for city in cities:
        weather_data = get_weather_data(city['lat'], city['lon'])
        if 'error' not in weather_data:
            cities_data.append({
                'name': city['name'],
                'lat': city['lat'],
                'lon': city['lon'],
                'temperature': weather_data['main']['temp'],
                'humidity': weather_data['main']['humidity'],
                'pressure': weather_data['main']['pressure'],
                'wind_speed': weather_data['wind']['speed'],
                'description': weather_data['weather'][0]['description'],
                'icon': weather_data['weather'][0]['icon']
            })
    
    return jsonify({'cities': cities_data})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
