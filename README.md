# 스마트팜 AI재배관리 솔루션

AI 기술과 IoT를 활용한 혁신적인 스마트팜 재배 관리 시스템입니다.

## 🚀 주요 기능

### 재배 관리
- **전국 현황 관리**: 전국 스마트팜 현황 모니터링
- **재배 현황 관리**: 실시간 재배 상태 추적
- **재배 추천 관리**: AI 기반 재배 방법 추천
- **재배 실행 관리**: 자동화된 재배 프로세스 제어

### 재배전문가 관리
- **소유자 관리**: 농장 소유자 계정 및 권한 관리
- **전문가 관리**: 재배 전문가 계정 및 전문 분야 관리

### 재배 지식 관리
- **기본 지식 관리**: 재배 기본 원리 및 방법론
- **경험 지식 관리**: 전문가 경험 기반 노하우
- **환경 모델 학습 및 평가**: 환경 데이터 기반 AI 모델
- **생육 모델 학습 및 평가**: 작물 생육 예측 모델
- **병해 모델 학습 및 평가**: 병해 진단 및 예방 모델
- **재배 추천 학습 및 평가**: 맞춤형 재배 방법 추천
- **제어 관리 학습 및 평가**: 자동화 제어 시스템

## 🏗️ 기술 스택

### 백엔드
- **Python FastAPI**: 고성능 웹 API 프레임워크
- **PostgreSQL**: 관계형 데이터베이스
- **Redis**: 캐시 및 세션 저장소
- **SQLAlchemy**: ORM 및 데이터베이스 관리
- **Alembic**: 데이터베이스 마이그레이션

### 프론트엔드
- **React 18**: 사용자 인터페이스
- **Ant Design**: UI 컴포넌트 라이브러리
- **React Router**: 클라이언트 사이드 라우팅
- **Styled Components**: CSS-in-JS 스타일링
- **Recharts**: 데이터 시각화

### IoT 및 데이터
- **MQTT**: IoT 디바이스 통신
- **Parcel**: IoT 데이터 처리 및 번들링
- **Chart.js**: 실시간 데이터 차트

### 머신러닝
- **PyTorch**: 딥러닝 프레임워크
- **Scikit-learn**: 전통적 머신러닝
- **OpenCV**: 이미지 처리
- **Ultralytics**: YOLO 객체 감지

## 📁 프로젝트 구조

```
aisf2/
├── backend/                    # Python FastAPI 백엔드
├── frontend/                   # React 프론트엔드
├── iot-data/                   # IoT 데이터 관리 (Parcel)
├── docker/                     # Docker 설정
├── docker-compose.yml          # 전체 서비스 구성
└── README.md                   # 프로젝트 문서
```

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd aisf2

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 설정값 입력
```

### 2. Docker로 실행

```bash
# 모든 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스만 시작
docker-compose up -d backend frontend
```

### 3. 개발 환경에서 실행

#### 백엔드 실행
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

#### IoT 데이터 서비스 실행
```bash
cd iot-data
npm install
npm run dev
```

## 🌐 서비스 접속

- **메인 애플리케이션**: http://localhost:8080
- **API 문서**: http://localhost:8080/docs
- **IoT 대시보드**: http://localhost:8080/iot

## 🔧 주요 제약 사항

- **하우스 단위 관리**: 각 재배 하우스별로 독립적인 관리 및 모니터링
- **실시간 데이터**: IoT 센서를 통한 실시간 환경 데이터 수집
- **AI 기반 의사결정**: 머신러닝 모델을 활용한 지능형 재배 추천

## 📊 API 문서

FastAPI의 자동 생성 Swagger 문서를 통해 모든 API 엔드포인트를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 테스트

```bash
# 백엔드 테스트
cd backend
pytest

# 프론트엔드 테스트
cd frontend
npm test
```

## 📝 개발 가이드

### 코드 스타일
- **Python**: PEP 8 준수
- **JavaScript/React**: ESLint + Prettier
- **API**: RESTful API 설계 원칙

### 브랜치 전략
- `main`: 프로덕션 배포용
- `develop`: 개발 통합용
- `feature/*`: 기능 개발용
- `hotfix/*`: 긴급 수정용

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**스마트팜 AI재배관리 솔루션** - AI 기술로 농업의 미래를 만들어갑니다 🌱

