# 스마트팜 AI재배관리 솔루션 - 프로젝트 설정 가이드

## 📋 프로젝트 개요

이 프로젝트는 AI 기술과 IoT를 활용한 스마트팜 재배 관리 시스템입니다. 
요구사항에 따라 다음과 같이 구성되었습니다:

### ✅ 구현된 요구사항

1. **첫 페이지**: 프로젝트 소개 페이지 (`/`)
2. **체험하기**: 로그인 후 서비스 진입 가능
3. **주요 메뉴 구성**: 요구사항에 명시된 모든 메뉴 구현
4. **기술 스택**: React + FastAPI + PostgreSQL + IoT (Parcel)
5. **폴더 구조**: 백엔드/프론트엔드 분리 및 기능별 세분화

## 🏗️ 아키텍처 구성

### 전체 시스템 구조
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   IoT Data      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (Parcel)      │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Port: 5432    │
                    └─────────────────┘
```

## 🚀 빠른 시작 (3단계)

### 1단계: 환경 준비
```bash
# Docker Desktop 설치 확인
docker --version
docker-compose --version

# 프로젝트 클론 및 이동
git clone <repository-url>
cd aisf2
```

### 2단계: 환경 변수 설정
```bash
# 환경 변수 파일 복사 및 편집
cp env.example .env

# .env 파일에서 다음 값들을 실제 환경에 맞게 수정:
# - DATABASE_URL
# - SECRET_KEY
# - MQTT_BROKER
```

### 3단계: 서비스 시작
```bash
# Windows에서 간단하게 시작
start-project.bat

# 또는 수동으로 시작
docker-compose up -d
```

## 📁 상세 폴더 구조

### 백엔드 (`/backend`)
```
backend/
├── app/
│   ├── main.py              # FastAPI 앱 진입점
│   ├── config.py            # 설정 관리
│   ├── database.py          # 데이터베이스 연결
│   ├── models/              # SQLAlchemy 모델
│   │   ├── user.py          # 사용자 모델
│   │   ├── house.py         # 하우스 모델
│   │   ├── cultivation.py   # 재배 모델
│   │   ├── iot_data.py      # IoT 데이터 모델
│   │   └── knowledge.py     # 지식 모델
│   ├── schemas/             # Pydantic 스키마
│   ├── api/                 # API 라우터
│   │   └── v1/              # API 버전 1
│   │       ├── auth.py      # 인증 API
│   │       ├── users.py     # 사용자 관리
│   │       ├── houses.py    # 하우스 관리
│   │       ├── cultivation.py # 재배 관리
│   │       ├── iot.py       # IoT 데이터
│   │       └── knowledge.py # 지식 관리
│   ├── core/                # 핵심 기능
│   ├── services/            # 비즈니스 로직
│   └── ml/                  # 머신러닝 모델
├── requirements.txt          # Python 의존성
└── tests/                   # 테스트 코드
```

### 프론트엔드 (`/frontend`)
```
frontend/
├── public/
│   └── index.html           # 메인 HTML
├── src/
│   ├── components/          # 재사용 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   ├── layout/          # 레이아웃 컴포넌트
│   │   └── ui/              # UI 컴포넌트
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Home.jsx         # 프로젝트 소개 (첫 페이지)
│   │   ├── Login.jsx        # 로그인
│   │   ├── Dashboard.jsx    # 대시보드
│   │   ├── cultivation/     # 재배 관리
│   │   ├── experts/         # 재배전문가 관리
│   │   └── knowledge/       # 재배 지식 관리
│   ├── hooks/               # 커스텀 훅
│   ├── services/            # API 서비스
│   ├── utils/               # 유틸리티 함수
│   ├── styles/              # 스타일 파일
│   ├── App.jsx              # 메인 앱 컴포넌트
│   └── index.jsx            # 진입점
└── package.json             # Node.js 의존성
```

### IoT 데이터 (`/iot-data`)
```
iot-data/
├── src/
│   ├── models/              # IoT 데이터 모델
│   ├── services/            # IoT 서비스
│   └── utils/               # IoT 유틸리티
└── package.json             # Parcel 설정
```

## 🔧 주요 설정 파일

### Docker Compose (`docker-compose.yml`)
- **PostgreSQL**: 데이터베이스 (포트 5432)
- **Redis**: 캐시 및 세션 (포트 6379)
- **Backend**: FastAPI 서버 (포트 8000)
- **Frontend**: React 앱 (포트 3000)
- **IoT Collector**: IoT 데이터 수집 (포트 3001)
- **MQTT**: IoT 통신 브로커 (포트 1883)
- **Nginx**: 리버스 프록시 (포트 80, 443)

### 환경 변수 (`.env`)
```bash
# 핵심 설정
ENVIRONMENT=development
DATABASE_URL=postgresql://user:password@localhost:5432/smartfarm
SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379

# IoT 설정
MQTT_BROKER=localhost
MQTT_PORT=1883
```

## 🌐 서비스 접속 정보

| 서비스 | URL | 설명 |
|--------|-----|------|
| **메인 애플리케이션** | http://localhost:8080 | 통합 웹 애플리케이션 |
| **API 문서** | http://localhost:8080/docs | Swagger UI |
| **IoT 대시보드** | http://localhost:8080/iot | IoT 데이터 모니터링 |
| **데이터베이스** | localhost:5432 | PostgreSQL |
| **Redis** | localhost:6379 | 캐시 서버 |

## 🚀 개발 워크플로우

### 1. 개발 모드 실행
```bash
# 백엔드 개발 서버
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 프론트엔드 개발 서버
cd frontend
npm start

# IoT 데이터 서비스
cd iot-data
npm run dev
```

### 2. 프로덕션 빌드
```bash
# 프론트엔드 빌드
cd frontend
npm run build

# 백엔드 빌드
cd backend
pip install -r requirements.txt

# Docker 이미지 빌드
docker-compose build
```

## 🧪 테스트 및 검증

### API 테스트
```bash
# 백엔드 서버 상태 확인
curl http://localhost:8000/health

# Swagger 문서 확인
open http://localhost:8000/docs
```

### 프론트엔드 테스트
```bash
cd frontend
npm test
```

### 데이터베이스 연결 테스트
```bash
# PostgreSQL 연결 확인
docker exec -it smartfarm_postgres psql -U smartfarm_user -d smartfarm -c "SELECT 1;"
```

## 🔍 문제 해결

### 일반적인 문제들

1. **포트 충돌**
   ```bash
   # 사용 중인 포트 확인
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   ```

2. **Docker 컨테이너 문제**
   ```bash
   # 컨테이너 상태 확인
   docker-compose ps
   
   # 로그 확인
   docker-compose logs backend
   ```

3. **데이터베이스 연결 실패**
   ```bash
   # PostgreSQL 컨테이너 상태 확인
   docker exec -it smartfarm_postgres pg_isready
   ```

## 📚 추가 리소스

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [React 공식 문서](https://reactjs.org/docs/)
- [Ant Design 컴포넌트](https://ant.design/components/overview/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Docker Compose 가이드](https://docs.docker.com/compose/)

## 🤝 지원 및 문의

프로젝트 설정이나 실행 중 문제가 발생하면:
1. 이 문서의 문제 해결 섹션 확인
2. GitHub Issues에 문제 등록
3. 프로젝트 팀에 직접 문의

---

**스마트팜 AI재배관리 솔루션** - 성공적인 프로젝트 실행을 위한 완벽한 가이드 📖 