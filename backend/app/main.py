from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base
from app.api.v1 import auth, users, houses, cultivation, iot, knowledge

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 데이터베이스 테이블 생성 (선택적)
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ 데이터베이스 테이블 생성 완료")
    except Exception as e:
        print(f"⚠️ 데이터베이스 연결 실패 (개발 모드로 계속 진행): {e}")
    yield

app = FastAPI(
    title="스마트팜 AI재배관리 솔루션",
    description="AI 기반 스마트팜 재배 관리 시스템",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(auth.router, prefix="/api/v1", tags=["인증"])
app.include_router(users.router, prefix="/api/v1", tags=["사용자 관리"])
app.include_router(houses.router, prefix="/api/v1", tags=["하우스 관리"])
app.include_router(cultivation.router, prefix="/api/v1", tags=["재배 관리"])
app.include_router(iot.router, prefix="/api/v1", tags=["IoT 데이터"])
app.include_router(knowledge.router, prefix="/api/v1", tags=["지식 관리"])

@app.get("/")
async def root():
    return {
        "message": "스마트팜 AI재배관리 솔루션 API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 