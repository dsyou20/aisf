/**
 * 다중 비닐하우스 관리 시스템
 * 여러 하우스의 환경 데이터와 관리 상태를 통합 관리
 */

// 비닐하우스 정보 정의
export const GREENHOUSE_DATA = {
  greenhouse_A: {
    id: 'greenhouse_A',
    name: '1번 하우스',
    description: '토마토 재배 전용 하우스',
    area: 500, // 평방미터
    crop: 'tomato',
    cropName: '토마토',
    plantingDate: '2024-01-15',
    currentWeek: 15,
    location: 'A구역',
    manager: '김재배',
    managerId: 'manager_kim',
    status: 'normal', // normal, warning, critical
    lastUpdate: new Date().toISOString(),
    sensors: {
      temperature: { current: 23.5, status: 'optimal', optimal: [18, 28] },
      humidity: { current: 68, status: 'optimal', optimal: [50, 80] },
      co2: { current: 450, status: 'optimal', optimal: [400, 600] },
      lightIntensity: { current: 28000, status: 'optimal', optimal: [20000, 40000] },
      soilMoisture: { current: 58, status: 'optimal', optimal: [40, 70] },
      soilPH: { current: 6.2, status: 'optimal', optimal: [5.5, 7.0] }
    },
    alerts: [
      { type: 'info', message: '정상 운영 중', time: '10분 전' }
    ],
    productivity: {
      currentYield: 85, // 목표 대비 %
      expectedHarvest: '2024-03-20',
      quality: 92,
      efficiency: 88
    }
  },

  greenhouse_B: {
    id: 'greenhouse_B',
    name: '2번 하우스',
    description: '딸기 재배 전용 하우스',
    area: 400,
    crop: 'strawberry',
    cropName: '딸기',
    plantingDate: '2024-02-01',
    currentWeek: 12,
    location: 'B구역',
    manager: '김재배',
    managerId: 'manager_kim', // 김재배 관리자가 2개 하우스 관리
    status: 'warning',
    lastUpdate: new Date().toISOString(),
    sensors: {
      temperature: { current: 26.8, status: 'high', optimal: [18, 28] },
      humidity: { current: 82, status: 'high', optimal: [50, 80] },
      co2: { current: 380, status: 'low', optimal: [400, 600] },
      lightIntensity: { current: 22000, status: 'optimal', optimal: [20000, 40000] },
      soilMoisture: { current: 45, status: 'low', optimal: [40, 70] },
      soilPH: { current: 6.5, status: 'optimal', optimal: [5.5, 7.0] }
    },
    alerts: [
      { type: 'warning', message: '온도 및 습도 주의', time: '5분 전' },
      { type: 'info', message: 'CO2 공급 필요', time: '15분 전' }
    ],
    productivity: {
      currentYield: 72,
      expectedHarvest: '2024-04-15',
      quality: 85,
      efficiency: 78
    }
  },

  greenhouse_C: {
    id: 'greenhouse_C',
    name: '3번 하우스',
    description: '딸기 신품종 시험 재배',
    area: 300,
    crop: 'strawberry_premium',
    cropName: '딸기 (프리미엄)',
    plantingDate: '2024-01-20',
    currentWeek: 18,
    location: 'C구역',
    manager: '박전문',
    managerId: 'manager_park',
    status: 'normal',
    lastUpdate: new Date().toISOString(),
    sensors: {
      temperature: { current: 21.2, status: 'optimal', optimal: [18, 28] },
      humidity: { current: 65, status: 'optimal', optimal: [50, 80] },
      co2: { current: 520, status: 'optimal', optimal: [400, 600] },
      lightIntensity: { current: 32000, status: 'optimal', optimal: [20000, 40000] },
      soilMoisture: { current: 62, status: 'optimal', optimal: [40, 70] },
      soilPH: { current: 6.1, status: 'optimal', optimal: [5.5, 7.0] }
    },
    alerts: [
      { type: 'success', message: '최적 환경 유지 중', time: '방금 전' }
    ],
    productivity: {
      currentYield: 95,
      expectedHarvest: '2024-03-25',
      quality: 98,
      efficiency: 94
    }
  },

  greenhouse_D: {
    id: 'greenhouse_D',
    name: '4번 하우스',
    description: '토마토 유기농 재배',
    area: 450,
    crop: 'tomato_organic',
    cropName: '토마토 (유기농)',
    plantingDate: '2024-01-10',
    currentWeek: 20,
    location: 'D구역',
    manager: '최유기',
    managerId: 'manager_choi',
    status: 'critical',
    lastUpdate: new Date().toISOString(),
    sensors: {
      temperature: { current: 18.5, status: 'low', optimal: [18, 28] },
      humidity: { current: 88, status: 'high', optimal: [50, 80] },
      co2: { current: 320, status: 'low', optimal: [400, 600] },
      lightIntensity: { current: 15000, status: 'low', optimal: [20000, 40000] },
      soilMoisture: { current: 75, status: 'high', optimal: [40, 70] },
      soilPH: { current: 5.8, status: 'low', optimal: [5.5, 7.0] }
    },
    alerts: [
      { type: 'error', message: '긴급: 온도 및 광량 부족', time: '2분 전' },
      { type: 'warning', message: '과습 상태 지속', time: '8분 전' },
      { type: 'warning', message: 'CO2 부족', time: '12분 전' }
    ],
    productivity: {
      currentYield: 45,
      expectedHarvest: '2024-04-10',
      quality: 65,
      efficiency: 52
    }
  },

  greenhouse_E: {
    id: 'greenhouse_E',
    name: '5번 하우스',
    description: '허브류 복합 재배',
    area: 200,
    crop: 'herbs',
    cropName: '허브류',
    plantingDate: '2024-02-10',
    currentWeek: 8,
    location: 'E구역',
    manager: '정허브',
    managerId: 'manager_jung',
    status: 'normal',
    lastUpdate: new Date().toISOString(),
    sensors: {
      temperature: { current: 24.1, status: 'optimal', optimal: [18, 28] },
      humidity: { current: 60, status: 'optimal', optimal: [50, 80] },
      co2: { current: 480, status: 'optimal', optimal: [400, 600] },
      lightIntensity: { current: 26000, status: 'optimal', optimal: [20000, 40000] },
      soilMoisture: { current: 52, status: 'optimal', optimal: [40, 70] },
      soilPH: { current: 6.4, status: 'optimal', optimal: [5.5, 7.0] }
    },
    alerts: [
      { type: 'info', message: '정상 운영 중', time: '5분 전' }
    ],
    productivity: {
      currentYield: 78,
      expectedHarvest: '2024-05-01',
      quality: 89,
      efficiency: 85
    }
  }
};

// 하우스 상태별 색상 정의
export const GREENHOUSE_STATUS_COLORS = {
  normal: '#52c41a',
  warning: '#faad14',
  critical: '#ff4d4f'
};

// 하우스 상태별 아이콘
export const GREENHOUSE_STATUS_ICONS = {
  normal: 'CheckCircleOutlined',
  warning: 'ExclamationCircleOutlined',
  critical: 'CloseCircleOutlined'
};

// 센서 상태별 색상
export const SENSOR_STATUS_COLORS = {
  optimal: '#52c41a',
  high: '#fa541c',
  low: '#1890ff',
  critical: '#ff4d4f'
};

/**
 * 하우스별 환경 데이터 생성
 */
export const generateGreenhouseEnvironmentData = (greenhouseId, days = 30) => {
  const greenhouse = GREENHOUSE_DATA[greenhouseId];
  if (!greenhouse) return [];

  const data = [];
  const baseDate = new Date();

  for (let day = days; day >= 0; day--) {
    const date = new Date(baseDate.getTime() - day * 24 * 60 * 60 * 1000);
    
    // 하우스별 특성 반영
    const cropMultiplier = getCropEnvironmentMultiplier(greenhouse.crop);
    const areaEffect = getAreaEffect(greenhouse.area);
    
    // 계절적 변화
    const seasonalEffect = getSeasonalEffect(date);
    
    // 일별 환경 데이터 생성
    const dayData = {
      date: date.toISOString().split('T')[0],
      greenhouse: greenhouse.name,
      temperature: greenhouse.sensors.temperature.current + 
                  (Math.sin(day * 0.1) * 3 + (Math.random() - 0.5) * 2) * cropMultiplier.temperature + seasonalEffect.temperature,
      humidity: greenhouse.sensors.humidity.current + 
               (Math.cos(day * 0.15) * 8 + (Math.random() - 0.5) * 5) * cropMultiplier.humidity + seasonalEffect.humidity,
      co2: greenhouse.sensors.co2.current + 
           (Math.sin(day * 0.2) * 50 + (Math.random() - 0.5) * 30) * cropMultiplier.co2,
      lightIntensity: greenhouse.sensors.lightIntensity.current * 
                     (0.8 + Math.random() * 0.4) * cropMultiplier.lightIntensity * seasonalEffect.lightIntensity,
      soilMoisture: greenhouse.sensors.soilMoisture.current + 
                   (Math.sin(day * 0.12) * 5 + (Math.random() - 0.5) * 3) * cropMultiplier.soilMoisture,
      soilPH: greenhouse.sensors.soilPH.current + (Math.random() - 0.5) * 0.2,
      
      // 생산성 지표
      productivity: greenhouse.productivity.currentYield + (Math.random() - 0.5) * 5,
      quality: greenhouse.productivity.quality + (Math.random() - 0.5) * 3,
      
      // 상태 평가
      status: evaluateEnvironmentStatus(greenhouse.sensors),
      alertCount: greenhouse.alerts.length
    };

    data.push(dayData);
  }

  return data.reverse(); // 오래된 날짜부터 정렬
};

/**
 * 작물별 환경 특성 계수
 */
const getCropEnvironmentMultiplier = (crop) => {
  const multipliers = {
    tomato: {
      temperature: 1.0,
      humidity: 1.0,
      co2: 1.2, // 토마토는 CO2를 많이 소비
      lightIntensity: 1.1,
      soilMoisture: 1.0
    },
    strawberry: {
      temperature: 0.9,
      humidity: 1.1, // 딸기는 습도에 민감
      co2: 1.0,
      lightIntensity: 0.9,
      soilMoisture: 1.1
    },
    strawberry_premium: {
      temperature: 0.95,
      humidity: 1.05,
      co2: 1.1,
      lightIntensity: 1.2, // 프리미엄 품종은 광량 요구도 높음
      soilMoisture: 1.0
    },
    tomato_organic: {
      temperature: 1.0,
      humidity: 1.2, // 유기농은 환경에 더 민감
      co2: 0.9,
      lightIntensity: 1.0,
      soilMoisture: 1.2
    },
    herbs: {
      temperature: 1.1,
      humidity: 0.8, // 허브는 건조한 환경 선호
      co2: 0.8,
      lightIntensity: 0.8,
      soilMoisture: 0.9
    }
  };

  return multipliers[crop] || multipliers.tomato;
};

/**
 * 면적 효과 계산
 */
const getAreaEffect = (area) => {
  // 큰 하우스일수록 환경 안정성 높음
  const stabilityFactor = Math.min(1.2, area / 500);
  return {
    stability: stabilityFactor,
    variationReduction: 1 / stabilityFactor
  };
};

/**
 * 계절 효과 계산
 */
const getSeasonalEffect = (date) => {
  const month = date.getMonth() + 1;
  
  if (month >= 3 && month <= 5) { // 봄
    return { temperature: 2, humidity: -5, lightIntensity: 1.1 };
  } else if (month >= 6 && month <= 8) { // 여름
    return { temperature: 5, humidity: 10, lightIntensity: 1.2 };
  } else if (month >= 9 && month <= 11) { // 가을
    return { temperature: -2, humidity: 5, lightIntensity: 0.9 };
  } else { // 겨울
    return { temperature: -5, humidity: -8, lightIntensity: 0.7 };
  }
};

/**
 * 환경 상태 평가
 */
const evaluateEnvironmentStatus = (sensors) => {
  let optimalCount = 0;
  let totalSensors = 0;

  Object.keys(sensors).forEach(sensor => {
    if (sensors[sensor].status === 'optimal') {
      optimalCount++;
    }
    totalSensors++;
  });

  const optimalRatio = optimalCount / totalSensors;
  
  if (optimalRatio >= 0.8) return 'normal';
  if (optimalRatio >= 0.6) return 'warning';
  return 'critical';
};

/**
 * 전체 하우스 요약 통계
 */
export const getGreenhouseSummaryStats = () => {
  const greenhouses = Object.values(GREENHOUSE_DATA);
  
  const stats = {
    total: greenhouses.length,
    normal: greenhouses.filter(g => g.status === 'normal').length,
    warning: greenhouses.filter(g => g.status === 'warning').length,
    critical: greenhouses.filter(g => g.status === 'critical').length,
    totalArea: greenhouses.reduce((sum, g) => sum + g.area, 0),
    avgProductivity: Math.round(greenhouses.reduce((sum, g) => sum + g.productivity.currentYield, 0) / greenhouses.length),
    avgQuality: Math.round(greenhouses.reduce((sum, g) => sum + g.productivity.quality, 0) / greenhouses.length),
    totalAlerts: greenhouses.reduce((sum, g) => sum + g.alerts.length, 0),
    crops: {
      tomato: greenhouses.filter(g => g.crop.includes('tomato')).length,
      strawberry: greenhouses.filter(g => g.crop.includes('strawberry')).length,
      herbs: greenhouses.filter(g => g.crop === 'herbs').length
    }
  };

  return stats;
};

/**
 * 하우스별 비교 데이터 생성
 */
export const generateGreenhouseComparisonData = () => {
  return Object.values(GREENHOUSE_DATA).map(greenhouse => ({
    name: greenhouse.name,
    id: greenhouse.id,
    crop: greenhouse.cropName,
    area: greenhouse.area,
    temperature: greenhouse.sensors.temperature.current,
    humidity: greenhouse.sensors.humidity.current,
    productivity: greenhouse.productivity.currentYield,
    quality: greenhouse.productivity.quality,
    efficiency: greenhouse.productivity.efficiency,
    status: greenhouse.status,
    alertCount: greenhouse.alerts.length,
    week: greenhouse.currentWeek,
    stage: getCurrentStageForWeek(greenhouse.currentWeek).stage
  }));
};

/**
 * 하우스별 환경 트렌드 데이터
 */
export const generateGreenhouseTrendData = (greenhouseId, days = 7) => {
  const greenhouse = GREENHOUSE_DATA[greenhouseId];
  if (!greenhouse) return [];

  const trendData = [];
  const baseDate = new Date();

  for (let day = days; day >= 0; day--) {
    const date = new Date(baseDate.getTime() - day * 24 * 60 * 60 * 1000);
    const hour = date.getHours();
    
    // 시간대별 패턴
    const isDay = hour >= 6 && hour <= 18;
    const tempVariation = isDay ? Math.sin((hour - 6) / 12 * Math.PI) * 3 : -2;
    const humidityVariation = isDay ? -5 : 8;
    
    trendData.push({
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0],
      greenhouse: greenhouse.name,
      temperature: greenhouse.sensors.temperature.current + tempVariation + (Math.random() - 0.5) * 2,
      humidity: greenhouse.sensors.humidity.current + humidityVariation + (Math.random() - 0.5) * 5,
      co2: greenhouse.sensors.co2.current + (isDay ? -30 : 50) + (Math.random() - 0.5) * 40,
      lightIntensity: isDay ? greenhouse.sensors.lightIntensity.current * (0.8 + Math.random() * 0.4) : 0,
      soilMoisture: greenhouse.sensors.soilMoisture.current + (Math.random() - 0.5) * 3
    });
  }

  return trendData;
};

/**
 * 하우스별 알림 생성
 */
export const generateGreenhouseAlerts = (greenhouseId) => {
  const greenhouse = GREENHOUSE_DATA[greenhouseId];
  if (!greenhouse) return [];

  const alerts = [...greenhouse.alerts];
  
  // 센서 상태 기반 추가 알림 생성
  Object.keys(greenhouse.sensors).forEach(sensor => {
    const sensorData = greenhouse.sensors[sensor];
    if (sensorData.status !== 'optimal') {
      alerts.push({
        type: sensorData.status === 'critical' ? 'error' : 'warning',
        message: `${sensor} ${sensorData.status === 'high' ? '높음' : '낮음'} (${sensorData.current})`,
        time: `${Math.floor(Math.random() * 30) + 1}분 전`,
        sensor: sensor
      });
    }
  });

  return alerts.sort((a, b) => {
    const priority = { error: 3, warning: 2, info: 1, success: 0 };
    return priority[b.type] - priority[a.type];
  });
};

/**
 * 하우스 성능 지표 계산
 */
export const calculateGreenhousePerformance = (greenhouseId) => {
  const greenhouse = GREENHOUSE_DATA[greenhouseId];
  if (!greenhouse) return null;

  const environmentScore = calculateEnvironmentScore(greenhouse.sensors);
  const productivityScore = greenhouse.productivity.currentYield;
  const qualityScore = greenhouse.productivity.quality;
  const efficiencyScore = greenhouse.productivity.efficiency;
  
  const overallScore = Math.round((environmentScore + productivityScore + qualityScore + efficiencyScore) / 4);

  return {
    overall: overallScore,
    environment: environmentScore,
    productivity: productivityScore,
    quality: qualityScore,
    efficiency: efficiencyScore,
    grade: getPerformanceGrade(overallScore),
    recommendations: generatePerformanceRecommendations(overallScore, greenhouse)
  };
};

/**
 * 환경 점수 계산
 */
const calculateEnvironmentScore = (sensors) => {
  let totalScore = 0;
  let sensorCount = 0;

  Object.keys(sensors).forEach(sensor => {
    const status = sensors[sensor].status;
    let score = 0;
    
    switch (status) {
      case 'optimal': score = 100; break;
      case 'high':
      case 'low': score = 70; break;
      case 'critical': score = 30; break;
      default: score = 50;
    }
    
    totalScore += score;
    sensorCount++;
  });

  return sensorCount > 0 ? Math.round(totalScore / sensorCount) : 0;
};

/**
 * 성능 등급 계산
 */
const getPerformanceGrade = (score) => {
  if (score >= 90) return { grade: 'A+', color: '#52c41a', description: '우수' };
  if (score >= 80) return { grade: 'A', color: '#73d13d', description: '양호' };
  if (score >= 70) return { grade: 'B', color: '#fadb14', description: '보통' };
  if (score >= 60) return { grade: 'C', color: '#fa8c16', description: '개선 필요' };
  return { grade: 'D', color: '#ff4d4f', description: '위험' };
};

/**
 * 성능 개선 추천사항
 */
const generatePerformanceRecommendations = (score, greenhouse) => {
  const recommendations = [];

  if (score < 70) {
    recommendations.push({
      type: 'urgent',
      title: '환경 개선 시급',
      description: `${greenhouse.name}의 환경 조건이 좋지 않습니다. 즉시 센서 점검과 환경 조절이 필요합니다.`
    });
  }

  if (greenhouse.productivity.currentYield < 70) {
    recommendations.push({
      type: 'productivity',
      title: '생산성 향상 필요',
      description: '목표 수확량 대비 달성률이 낮습니다. 영양 관리와 환경 최적화를 검토하세요.'
    });
  }

  if (greenhouse.alerts.filter(a => a.type === 'error').length > 0) {
    recommendations.push({
      type: 'maintenance',
      title: '긴급 점검 필요',
      description: '시설 점검과 즉시 조치가 필요한 문제가 발생했습니다.'
    });
  }

  return recommendations;
};

/**
 * 주차별 생육 단계 조회
 */
const getCurrentStageForWeek = (week) => {
  const strawberryStages = [
    { weeks: [1, 4], stage: '정식기' },
    { weeks: [5, 12], stage: '영양생장기' },
    { weeks: [13, 20], stage: '화아분화기' },
    { weeks: [21, 28], stage: '개화기' },
    { weeks: [29, 40], stage: '결실기' },
    { weeks: [41, 52], stage: '수확기' }
  ];

  return strawberryStages.find(stage => 
    week >= stage.weeks[0] && week <= stage.weeks[1]
  ) || strawberryStages[0];
};

/**
 * 하우스 간 성능 비교
 */
export const compareGreenhousePerformance = () => {
  const greenhouses = Object.values(GREENHOUSE_DATA);
  
  return greenhouses.map(greenhouse => {
    const performance = calculateGreenhousePerformance(greenhouse.id);
    return {
      ...greenhouse,
      performance
    };
  }).sort((a, b) => b.performance.overall - a.performance.overall);
};

/**
 * 사용자 권한별 하우스 필터링
 */
export const getGreenhousesByUserRole = (userRole, userId = null) => {
  const allGreenhouses = Object.values(GREENHOUSE_DATA);
  
  if (userRole === 'owner') {
    // 농장주는 모든 하우스 볼 수 있음
    return allGreenhouses;
  } else if (userRole === 'manager') {
    // 재배관리자는 본인이 관리하는 하우스만
    // 실제로는 userId로 필터링하지만, 데모를 위해 첫 번째 관리자로 가정
    const managerId = userId || 'manager_kim'; // 기본값으로 김재배 관리자
    return allGreenhouses.filter(greenhouse => greenhouse.managerId === managerId);
  } else {
    // 기타 권한은 빈 배열
    return [];
  }
};

/**
 * 관리자별 하우스 그룹핑 (농장주용)
 */
export const getGreenhousesByManager = () => {
  const allGreenhouses = Object.values(GREENHOUSE_DATA);
  const managerGroups = {};
  
  allGreenhouses.forEach(greenhouse => {
    const managerId = greenhouse.managerId;
    const managerName = greenhouse.manager;
    
    if (!managerGroups[managerId]) {
      managerGroups[managerId] = {
        managerId,
        managerName,
        greenhouses: [],
        totalArea: 0,
        avgProductivity: 0,
        alertCount: 0,
        status: 'normal' // normal, warning, critical
      };
    }
    
    managerGroups[managerId].greenhouses.push(greenhouse);
    managerGroups[managerId].totalArea += greenhouse.area;
    managerGroups[managerId].alertCount += greenhouse.alerts.length;
  });
  
  // 각 관리자별 통계 계산
  Object.keys(managerGroups).forEach(managerId => {
    const group = managerGroups[managerId];
    const greenhouses = group.greenhouses;
    
    // 평균 생산성 계산
    group.avgProductivity = Math.round(
      greenhouses.reduce((sum, g) => sum + g.productivity.currentYield, 0) / greenhouses.length
    );
    
    // 전체 상태 평가 (가장 심각한 상태로)
    const hasCritical = greenhouses.some(g => g.status === 'critical');
    const hasWarning = greenhouses.some(g => g.status === 'warning');
    
    if (hasCritical) {
      group.status = 'critical';
    } else if (hasWarning) {
      group.status = 'warning';
    } else {
      group.status = 'normal';
    }
  });
  
  return Object.values(managerGroups);
};

/**
 * 특정 관리자의 하우스 목록
 */
export const getGreenhousesForManager = (managerId) => {
  return Object.values(GREENHOUSE_DATA).filter(
    greenhouse => greenhouse.managerId === managerId
  );
};

/**
 * 관리자 정보 정의
 */
export const MANAGER_DATA = {
  manager_kim: {
    id: 'manager_kim',
    name: '김재배',
    email: 'kim@smartfarm.com',
    phone: '010-1234-5678',
    experience: '8년',
    specialty: '토마토 재배',
    certification: ['농업기술자', '스마트팜 전문가'],
    joinDate: '2020-03-15',
    performance: {
      rating: 4.8,
      managedGreenhouses: 1,
      avgProductivity: 85,
      successProjects: 15
    }
  },
  manager_lee: {
    id: 'manager_lee',
    name: '이관리',
    email: 'lee@smartfarm.com',
    phone: '010-2345-6789',
    experience: '5년',
    specialty: '딸기 재배',
    certification: ['농업기술자'],
    joinDate: '2021-06-01',
    performance: {
      rating: 4.2,
      managedGreenhouses: 1,
      avgProductivity: 72,
      successProjects: 8
    }
  },
  manager_park: {
    id: 'manager_park',
    name: '박전문',
    email: 'park@smartfarm.com',
    phone: '010-3456-7890',
    experience: '12년',
    specialty: '신품종 개발',
    certification: ['농업기술자', '스마트팜 전문가', '품종개발 전문가'],
    joinDate: '2019-01-10',
    performance: {
      rating: 4.9,
      managedGreenhouses: 1,
      avgProductivity: 95,
      successProjects: 25
    }
  },
  manager_choi: {
    id: 'manager_choi',
    name: '최유기',
    email: 'choi@smartfarm.com',
    phone: '010-4567-8901',
    experience: '6년',
    specialty: '유기농 재배',
    certification: ['유기농 기술자', '친환경 농업 전문가'],
    joinDate: '2020-09-01',
    performance: {
      rating: 3.8,
      managedGreenhouses: 1,
      avgProductivity: 45,
      successProjects: 5
    }
  },
  manager_jung: {
    id: 'manager_jung',
    name: '정허브',
    email: 'jung@smartfarm.com',
    phone: '010-5678-9012',
    experience: '4년',
    specialty: '허브 재배',
    certification: ['농업기술자'],
    joinDate: '2022-03-01',
    performance: {
      rating: 4.5,
      managedGreenhouses: 1,
      avgProductivity: 78,
      successProjects: 12
    }
  }
};

// 농장주용 필터링된 온실 데이터 조회
export const getFilteredGreenhouses = (userRole, userId = null) => {
  return getGreenhousesByUserRole(userRole, userId);
};

// 관리자별 성과 데이터
export const getManagerPerformance = () => {
  const managers = Object.values(MANAGER_DATA);
  return managers.map(manager => {
    const assignedGreenhouses = Object.values(GREENHOUSE_DATA).filter(gh => gh.managerId === manager.id);
    const totalEfficiency = assignedGreenhouses.reduce((sum, gh) => {
      const performance = calculateGreenhousePerformance(gh.id);
      return sum + performance.efficiency;
    }, 0);
    
    return {
      managerId: manager.id,
      managerName: manager.name,
      greenhouseCount: assignedGreenhouses.length,
      averageEfficiency: assignedGreenhouses.length > 0 ? totalEfficiency / assignedGreenhouses.length : 0,
      specialization: manager.specialty,
      experience: manager.experience
    };
  });
};

// 관리자별 온실 그룹화
export const groupGreenhousesByManager = (greenhouses) => {
  const grouped = {};
  
  greenhouses.forEach(greenhouse => {
    const managerId = greenhouse.managerId || 'unassigned';
    if (!grouped[managerId]) {
      grouped[managerId] = {
        manager: greenhouse.manager || '미배정',
        greenhouses: []
      };
    }
    grouped[managerId].greenhouses.push(greenhouse);
  });
  
  return grouped;
};
