# Quick Setup Guide

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- OpenWeatherMap API key (free at https://openweathermap.org/api)

## One-Command Setup
```bash
npm run setup
```

## Manual Setup

### 1. Install Dependencies
```bash
# Install both backend and frontend dependencies
npm run install-all
```

### 2. Configure API Key
```bash
# Copy environment file
cp backend/.env.example backend/.env

# Edit the .env file and add your API key:
# WEATHER_API_KEY=your_openweathermap_api_key_here
```

### 3. Start Development Servers
```bash
# Start both backend and frontend simultaneously
npm run dev
```

**OR start them separately:**

```bash
# Terminal 1 - Backend (Flask)
npm run dev-backend

# Terminal 2 - Frontend (Vue.js)
npm run dev-frontend
```

## Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Verification
1. Open http://localhost:3000
2. Allow location access when prompted (or it will default to New York)
3. You should see weather data loading on the dashboard

## Troubleshooting

### Common Issues

**"Failed to load weather data"**
- Check your API key in `backend/.env`
- Verify you have internet connection
- Check browser console for specific errors

**Frontend not loading**
- Make sure you're on http://localhost:3000
- Check if frontend dependencies installed correctly: `cd frontend && npm install`

**Backend API errors**
- Verify Flask server is running on port 5000
- Check Python dependencies: `cd backend && pip install -r requirements.txt`
- Make sure you activated the virtual environment

**Port conflicts**
- Frontend (3000): Edit `frontend/vite.config.js`
- Backend (5000): Edit `backend/app.py`

### API Key Setup
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Generate an API key
4. Add it to `backend/.env`:
   ```
   WEATHER_API_KEY=your_actual_api_key_here
   ```

## Next Steps
- Explore the Dashboard, Analytics, and Maps pages
- Customize visualizations in the components
- Add new weather metrics or cities
- Deploy to production when ready

## Production Build
```bash
# Build frontend for production
npm run build

# The built files will be in frontend/dist/
```
