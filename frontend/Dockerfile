FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 환경 변수 설정 (개발 모드)
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV FAST_REFRESH=true

# 애플리케이션 실행 (개발 모드)
CMD ["npm", "start"] 