@echo off
echo ========================================
echo 스마트팜 AI재배관리 솔루션 시작
echo ========================================

echo.
echo 1. Docker 서비스 시작 중...
docker-compose up -d

echo.
echo 2. 서비스 상태 확인 중...
timeout /t 10 /nobreak >nul

echo.
echo 3. 서비스 상태:
docker-compose ps

echo.
echo ========================================
echo 서비스 접속 정보:
echo ========================================
echo 메인 애플리케이션: http://localhost:8080
echo API 문서: http://localhost:8080/docs
echo IoT 대시보드: http://localhost:8080/iot
echo ========================================

echo.
echo 모든 서비스가 시작되었습니다!
echo 브라우저에서 http://localhost:8080 으로 접속하세요.
echo.
pause 