@echo off
echo ========================================
echo 스마트팜 개발 모드 시작
echo ========================================

echo.
echo 1. 기존 컨테이너 정리...
docker compose down

echo.
echo 2. 프론트엔드 컨테이너만 재빌드...
docker compose build frontend

echo.
echo 3. 개발 모드로 서비스 시작...
docker compose up -d

echo.
echo 4. 로그 확인 (Ctrl+C로 종료)...
echo 프론트엔드: http://localhost:3000
echo 백엔드: http://localhost:8000
echo IoT 대시보드: http://localhost:3001
echo.

docker compose logs -f frontend 