# 🚀 8080 포트 통합 가이드

## 📋 포트 통합 개요

모든 서비스를 **8080 포트 하나로 통합**하여 사용자 경험을 단순화했습니다.

## 🌐 새로운 접속 구조

### 이전 구조 (여러 포트)
```
프론트엔드: http://localhost:3000
백엔드 API: http://localhost:8000  
IoT 대시보드: http://localhost:3001
```

### 새로운 구조 (8080 포트 통합)
```
메인 애플리케이션: http://localhost:8080
API 문서: http://localhost:8080/docs
IoT 대시보드: http://localhost:8080/iot
```

## 🔧 Nginx 프록시 설정

### 라우팅 규칙

| 경로 | 대상 서비스 | 설명 |
|------|-------------|------|
| `/` | Frontend (React) | 메인 웹 애플리케이션 |
| `/api/*` | Backend (FastAPI) | REST API 서버 |
| `/iot/*` | IoT Dashboard | IoT 데이터 모니터링 |
| `/uploads/*` | Backend | 업로드된 파일 |
| `/health` | Backend | 헬스 체크 |

### Nginx 설정 파일 위치
```
docker/nginx/nginx.conf
```

## 🚀 서비스 시작 및 접속

### 1. 서비스 시작
```bash
# Docker Compose로 모든 서비스 시작
docker-compose up -d

# 또는 Windows 배치 파일 사용
start-project.bat
```

### 2. 접속 확인
```bash
# 메인 애플리케이션
http://localhost:8080

# API 문서 (Swagger)
http://localhost:8080/docs

# IoT 대시보드
http://localhost:8080/iot

# 헬스 체크
http://localhost:8080/health
```

## 🔍 포트 통합의 장점

### ✅ 사용자 편의성
- **하나의 포트**: 8080만 기억하면 됨
- **단순한 URL**: 복잡한 포트 번호 불필요
- **통합된 경험**: 모든 서비스가 하나의 도메인에서 제공

### ✅ 관리 편의성
- **방화벽 설정**: 8080 포트만 열면 됨
- **프록시 설정**: 단일 포인트에서 모든 트래픽 관리
- **로드 밸런싱**: 향후 확장 시 용이

### ✅ 보안성
- **중앙화된 보안**: Nginx에서 보안 헤더 통합 관리
- **CORS 설정**: API 접근 제어 중앙화
- **SSL/TLS**: 향후 HTTPS 적용 시 단일 인증서로 관리

## 🏗️ 내부 아키텍처

### 컨테이너 간 통신
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Frontend      │    │   Backend       │
│   Port: 8080    │◄──►│   Port: 3000    │◄──►│   Port: 8000    │
│   (Proxy)       │    │   (React)       │    │   (FastAPI)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   IoT Dashboard │
                    │   Port: 3001    │
                    └─────────────────┘
```

### 외부 접속 흐름
```
사용자 브라우저 → localhost:8080 → Nginx → 각 서비스로 라우팅
```

## 🔧 개발 환경 설정

### 프론트엔드 개발 시
```bash
cd frontend
npm start
# React는 여전히 3000 포트에서 실행
# 하지만 프록시는 8080으로 설정됨
```

### 백엔드 개발 시
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# FastAPI는 여전히 8000 포트에서 실행
# 하지만 Nginx가 8080으로 프록시
```

### IoT 서비스 개발 시
```bash
cd iot-data
npm run dev
# IoT 서비스는 여전히 3001 포트에서 실행
# 하지만 Nginx가 8080/iot로 프록시
```

## 🚨 주의사항

### 1. 포트 충돌 방지
- 8080 포트가 다른 서비스에서 사용 중인지 확인
- Windows에서 `netstat -ano | findstr :8080` 명령으로 확인

### 2. 개발 시 프록시 설정
- 프론트엔드의 `package.json`에서 `proxy` 설정이 8080을 가리키도록 수정
- 백엔드 API 호출 시 상대 경로 사용 권장

### 3. 환경 변수 설정
- `.env` 파일에서 `API_BASE_URL`을 `http://localhost:8080`으로 설정
- `FRONTEND_URL`도 `http://localhost:8080`으로 설정

## 🔍 문제 해결

### Nginx 컨테이너 로그 확인
```bash
docker-compose logs nginx
```

### 특정 서비스 로그 확인
```bash
docker-compose logs frontend
docker-compose logs backend
docker-compose logs iot-collector
```

### 포트 사용 확인
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

## 📚 추가 리소스

- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Docker Compose 네트워킹](https://docs.docker.com/compose/networking/)
- [프록시 서버 설정 가이드](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

---

**8080 포트 통합**으로 더욱 간단하고 효율적인 서비스 제공이 가능합니다! 🎯 