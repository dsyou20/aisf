@echo off
echo ========================================
echo 프론트엔드 빠른 재시작
echo ========================================

echo.
echo 1. 프론트엔드 컨테이너만 재시작...
docker compose restart frontend

echo.
echo 2. 프론트엔드 로그 확인...
echo 프론트엔드: http://localhost:3000
echo.

docker compose logs -f frontend 