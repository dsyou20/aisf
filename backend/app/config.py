from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # 기본 설정
    APP_NAME: str = "스마트팜 AI재배관리 솔루션"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # 데이터베이스 설정
    DATABASE_URL: str = "postgresql://smartfarm_user:smartfarm_password@postgres:5432/smartfarm"
    
    # JWT 설정
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS 설정
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Redis 설정
    REDIS_URL: str = "redis://redis:6379"
    
    # IoT 설정
    MQTT_BROKER: str = "mqtt"
    MQTT_PORT: int = 1883
    MQTT_USERNAME: str = ""
    MQTT_PASSWORD: str = ""
    
    # 파일 업로드 설정
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # ML 모델 설정
    MODEL_PATH: str = "models"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 환경 변수에서 설정 로드
settings = Settings()

# 환경별 설정
if os.getenv("ENVIRONMENT") == "development":
    settings.DEBUG = True
    # Docker 환경에서는 환경 변수 사용
    if os.getenv("DATABASE_URL"):
        settings.DATABASE_URL = os.getenv("DATABASE_URL")
    if os.getenv("REDIS_URL"):
        settings.REDIS_URL = os.getenv("REDIS_URL")
elif os.getenv("ENVIRONMENT") == "production":
    settings.DEBUG = False
    settings.DATABASE_URL = os.getenv("DATABASE_URL")
    settings.SECRET_KEY = os.getenv("SECRET_KEY") 