# 스마트팜 AI재배관리 솔루션 - 프로젝트 구조

```
aisf2/
├── backend/                    # Python FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI 앱 진입점
│   │   ├── config.py          # 설정 관리
│   │   ├── database.py        # ORB 데이터베이스 연결
│   │   ├── models/            # 데이터 모델
│   │   │   ├── __init__.py
│   │   │   ├── user.py        # 사용자 모델
│   │   │   ├── house.py       # 하우스 모델
│   │   │   ├── cultivation.py # 재배 모델
│   │   │   ├── iot_data.py    # IoT 데이터 모델
│   │   │   └── knowledge.py   # 지식 모델
│   │   ├── schemas/           # Pydantic 스키마
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── house.py
│   │   │   └── cultivation.py
│   │   ├── api/               # API 라우터
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py    # 인증 API
│   │   │   │   ├── users.py   # 사용자 관리
│   │   │   │   ├── houses.py  # 하우스 관리
│   │   │   │   ├── cultivation.py # 재배 관리
│   │   │   │   ├── iot.py     # IoT 데이터
│   │   │   │   └── knowledge.py # 지식 관리
│   │   ├── core/              # 핵심 기능
│   │   │   ├── __init__.py
│   │   │   ├── security.py    # 보안
│   │   │   ├── dependencies.py # 의존성
│   │   │   └── utils.py       # 유틸리티
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── cultivation_service.py
│   │   │   └── iot_service.py
│   │   └── ml/                # 머신러닝 모델
│   │       ├── __init__.py
│   │       ├── environment_model.py
│   │       ├── growth_model.py
│   │       ├── disease_model.py
│   │       └── recommendation_model.py
│   ├── requirements.txt        # Python 의존성
│   ├── alembic/               # 데이터베이스 마이그레이션
│   │   ├── versions/
│   │   ├── env.py
│   │   └── alembic.ini
│   └── tests/                 # 테스트
│       ├── __init__.py
│       ├── test_api/
│       └── test_services/
├── frontend/                   # React 프론트엔드
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/        # 재사용 가능한 컴포넌트
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Loading.jsx
│   │   │   ├── layout/
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Table.jsx
│   │   │       └── Chart.jsx
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── Home.jsx       # 프로젝트 소개 페이지
│   │   │   ├── Login.jsx      # 로그인
│   │   │   ├── Dashboard.jsx  # 대시보드
│   │   │   ├── cultivation/   # 재배 관리
│   │   │   │   ├── Overview.jsx      # 전국 현황
│   │   │   │   ├── Status.jsx        # 재배 현황
│   │   │   │   ├── Recommendation.jsx # 재배 추천
│   │   │   │   └── Execution.jsx     # 재배 실행
│   │   │   ├── experts/       # 재배전문가 관리
│   │   │   │   ├── Owners.jsx        # 소유자 관리
│   │   │   │   └── Specialists.jsx   # 전문가 관리
│   │   │   └── knowledge/     # 재배 지식 관리
│   │   │       ├── Basic.jsx         # 기본 지식
│   │   │       ├── Experience.jsx    # 경험 지식
│   │   │       ├── Environment.jsx   # 환경 모델
│   │   │       ├── Growth.jsx        # 생육 모델
│   │   │       ├── Disease.jsx       # 병해 모델
│   │   │       ├── Recommendation.jsx # 재배 추천 모델
│   │   │       └── Control.jsx       # 제어 관리 모델
│   │   ├── hooks/             # 커스텀 훅
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   └── useLocalStorage.js
│   │   ├── services/          # API 서비스
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── cultivationService.js
│   │   ├── utils/             # 유틸리티 함수
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validation.js
│   │   ├── styles/            # 스타일 파일
│   │   │   ├── global.css
│   │   │   ├── variables.css
│   │   │   └── components.css
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── routes.jsx
│   ├── package.json
│   └── README.md
├── iot-data/                   # IoT 데이터 관리 (Parcel)
│   ├── src/
│   │   ├── models/            # IoT 데이터 모델
│   │   │   ├── SensorData.js
│   │   │   ├── DeviceStatus.js
│   │   │   └── Alert.js
│   │   ├── services/          # IoT 서비스
│   │   │   ├── dataCollector.js
│   │   │   ├── dataProcessor.js
│   │   │   └── dataStorage.js
│   │   └── utils/             # IoT 유틸리티
│   │       ├── mqtt.js
│   │       └── validators.js
│   ├── package.json
│   └── README.md
├── docker/                     # Docker 설정
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│   └── nginx/
│       └── nginx.conf
├── docker-compose.yml          # 전체 서비스 구성
├── .env.example               # 환경 변수 예시
├── .gitignore
└── README.md                   # 프로젝트 메인 문서
```

## 주요 특징

### 1. 백엔드 (Python FastAPI)
- ORB 데이터베이스 연동
- Swagger API 문서 자동 생성
- JWT 기반 인증
- 머신러닝 모델 통합

### 2. 프론트엔드 (React)
- 프로젝트 소개 페이지 (첫 페이지)
- 체험하기 기능으로 서비스 진입
- 반응형 대시보드
- 모듈화된 컴포넌트 구조

### 3. IoT 데이터 관리 (Parcel)
- 센서 데이터 수집 및 처리
- 실시간 데이터 스트리밍
- 데이터 검증 및 저장

### 4. Docker 구성
- 각 서비스별 독립적인 컨테이너
- Nginx를 통한 프록시 설정
- 개발/운영 환경 분리 