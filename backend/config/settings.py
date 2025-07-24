import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')
    WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
    
    # Flask settings
    DEBUG = False
    TESTING = False
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
    
    # Cache settings
    CACHE_TIMEOUT = 300  # 5 minutes
    
    # Rate limiting
    RATELIMIT_STORAGE_URL = 'memory://'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    ENV = 'production'
    
    # Production CORS origins - update with your domain
    CORS_ORIGINS = ['https://yourdomain.com']
    
    # Production rate limiting
    RATELIMIT_STORAGE_URL = 'redis://localhost:6379'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    WEATHER_API_KEY = 'test-api-key'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
