-- 스마트팜 데이터베이스 초기화 스크립트

-- 사용자 생성 (이미 docker-compose에서 생성됨)
-- CREATE USER smartfarm_user WITH PASSWORD 'smartfarm_password';

-- 데이터베이스 생성 (이미 docker-compose에서 생성됨)
-- CREATE DATABASE smartfarm OWNER smartfarm_user;

-- 권한 부여
GRANT ALL PRIVILEGES ON DATABASE smartfarm TO smartfarm_user;

-- 스마트팜 스키마 생성
CREATE SCHEMA IF NOT EXISTS smartfarm;

-- 기본 테이블들은 SQLAlchemy에서 자동 생성되므로 여기서는 스키마만 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA smartfarm GRANT ALL ON TABLES TO smartfarm_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA smartfarm GRANT ALL ON SEQUENCES TO smartfarm_user; 