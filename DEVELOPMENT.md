# 스마트팜 개발 가이드

## 🚀 빠른 시작

### 1. 전체 개발 환경 시작
```bash
# Windows
dev-start.bat

# 또는 수동으로
docker compose down
docker compose build frontend
docker compose up -d
```

### 2. 프론트엔드만 재시작 (Hot Reload)
```bash
# Windows
frontend-reload.bat

# 또는 수동으로
docker compose restart frontend
```

### 3. 프론트엔드 재빌드 (의존성 변경 시)
```bash
# Windows
frontend-rebuild.bat

# 또는 수동으로
docker compose stop frontend
docker compose build frontend
docker compose up -d frontend
```

## 🔥 Hot Reload 설정

프로젝트는 Hot Reload가 활성화되어 있어서 파일 변경 시 자동으로 반영됩니다:

### 지원되는 파일 변경
- ✅ React 컴포넌트 (.jsx, .js)
- ✅ CSS/SCSS 파일
- ✅ 이미지 파일
- ✅ 설정 파일

### Hot Reload가 작동하지 않을 때
1. **브라우저 새로고침**: `Ctrl + F5`
2. **컨테이너 재시작**: `frontend-reload.bat`
3. **컨테이너 재빌드**: `frontend-rebuild.bat`

## 📁 개발 디렉토리 구조

```
frontend/
├── src/
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── Home.jsx     # 홈페이지
│   │   ├── Dashboard.jsx # 대시보드
│   │   ├── cultivation/ # 재배 관리
│   │   ├── experts/     # 전문가 관리
│   │   ├── knowledge/   # 지식 관리
│   │   └── admin/       # 관리자 페이지
│   ├── components/      # 공통 컴포넌트
│   ├── styles/          # 스타일 파일
│   └── App.jsx          # 메인 앱
├── public/              # 정적 파일
└── package.json         # 의존성
```

## 🛠️ 개발 팁

### 1. 코드 변경 시
- 파일을 저장하면 자동으로 Hot Reload
- 브라우저에서 즉시 확인 가능
- 콘솔 로그로 변경 사항 확인

### 2. 새 페이지 추가 시
1. `src/pages/` 디렉토리에 새 컴포넌트 생성
2. `src/App.jsx`에 라우트 추가
3. 자동으로 Hot Reload 적용

### 3. 스타일 변경 시
- CSS/SCSS 파일 변경 시 즉시 반영
- Ant Design 컴포넌트 스타일 커스터마이징 가능

### 4. 디버깅
```bash
# 프론트엔드 로그 확인
docker compose logs -f frontend

# 백엔드 로그 확인
docker compose logs -f backend

# 전체 로그 확인
docker compose logs -f
```

## 🌐 접속 URL

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8000
- **IoT 대시보드**: http://localhost:3001
- **API 문서**: http://localhost:8000/docs

## 🔧 환경 변수

### 프론트엔드 환경 변수
```bash
REACT_APP_API_URL=http://localhost:8000
CHOKIDAR_USEPOLLING=true      # Hot Reload용
WATCHPACK_POLLING=true        # 파일 감시용
FAST_REFRESH=true             # Fast Refresh
```

## 📝 개발 체크리스트

- [ ] Hot Reload가 정상 작동하는지 확인
- [ ] 새 페이지 추가 시 라우팅이 정상인지 확인
- [ ] 스타일 변경이 즉시 반영되는지 확인
- [ ] 브라우저 콘솔에 에러가 없는지 확인
- [ ] 반응형 디자인이 정상인지 확인

## 🚨 문제 해결

### Hot Reload가 작동하지 않을 때
1. Docker Desktop이 실행 중인지 확인
2. 볼륨 마운트가 정상인지 확인
3. 컨테이너를 재시작

### 빌드 에러가 발생할 때
1. `node_modules` 삭제 후 재설치
2. Docker 이미지 재빌드
3. 캐시 삭제 후 재빌드

### 포트 충돌이 발생할 때
1. 사용 중인 포트 확인: `netstat -ano | findstr :3000`
2. 다른 프로세스 종료
3. 포트 변경 (docker-compose.yml 수정) 