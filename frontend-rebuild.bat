@echo off
echo ========================================
echo 프론트엔드 재빌드 및 재시작
echo ========================================

echo.
echo 1. 프론트엔드 컨테이너 중지...
docker compose stop frontend

echo.
echo 2. 프론트엔드 컨테이너 재빌드...
docker compose build frontend

echo.
echo 3. 프론트엔드 컨테이너 시작...
docker compose up -d frontend

echo.
echo 4. 프론트엔드 로그 확인...
echo 프론트엔드: http://localhost:3000
echo.

docker compose logs -f frontend 