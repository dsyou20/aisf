// 스마트팜 IoT 데이터 수집 서비스
import './index.html';

console.log('🌱 스마트팜 IoT 데이터 서비스가 시작되었습니다.');

// MQTT 클라이언트 설정 (실제 구현 시 사용)
class IoTDataCollector {
    constructor() {
        this.sensorData = {
            temperature: 0,
            humidity: 0,
            light: 0,
            soil: 0
        };
        this.isConnected = false;
    }

    // 센서 데이터 수집
    collectSensorData() {
        // 시뮬레이션된 센서 데이터
        this.sensorData = {
            temperature: (15 + Math.random() * 15).toFixed(1),
            humidity: (40 + Math.random() * 40).toFixed(0),
            light: Math.floor(Math.random() * 1000),
            soil: (20 + Math.random() * 70).toFixed(0)
        };
        
        console.log('센서 데이터 수집:', this.sensorData);
        return this.sensorData;
    }

    // 데이터 전송
    sendData(data) {
        // 실제 구현 시에는 API 서버로 데이터 전송
        console.log('데이터 전송:', data);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('lastSensorData', JSON.stringify(data));
        localStorage.setItem('lastUpdateTime', new Date().toISOString());
    }

    // 서비스 시작
    start() {
        console.log('IoT 데이터 수집 서비스 시작...');
        
        // 5초마다 데이터 수집 및 전송
        setInterval(() => {
            const data = this.collectSensorData();
            this.sendData(data);
        }, 5000);
        
        this.isConnected = true;
    }

    // 서비스 중지
    stop() {
        console.log('IoT 데이터 수집 서비스 중지...');
        this.isConnected = false;
    }
}

// 서비스 인스턴스 생성 및 시작
const iotCollector = new IoTDataCollector();
iotCollector.start();

// 페이지 언로드 시 서비스 정리
window.addEventListener('beforeunload', () => {
    iotCollector.stop();
});

export default iotCollector; 