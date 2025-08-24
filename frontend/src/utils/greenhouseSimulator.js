/**
 * 가상 온실 환경 시뮬레이터
 * 환경 데이터, 조치사항, 예측 알고리즘을 통합 관리
 */

// 온실 환경 센서 데이터 정의
export const ENVIRONMENT_SENSORS = {
  temperature: { 
    min: 5, max: 40, optimal: [18, 25], unit: '°C',
    description: '온실 내부 온도',
    criticalLow: 10, criticalHigh: 35
  },
  humidity: { 
    min: 30, max: 95, optimal: [60, 75], unit: '%',
    description: '상대 습도',
    criticalLow: 40, criticalHigh: 85
  },
  co2: { 
    min: 300, max: 1500, optimal: [400, 800], unit: 'ppm',
    description: '이산화탄소 농도',
    criticalLow: 350, criticalHigh: 1200
  },
  lightIntensity: { 
    min: 0, max: 50000, optimal: [20000, 40000], unit: 'lux',
    description: '광량',
    criticalLow: 15000, criticalHigh: 45000
  },
  soilMoisture: { 
    min: 20, max: 80, optimal: [40, 65], unit: '%',
    description: '토양 수분',
    criticalLow: 30, criticalHigh: 75
  },
  soilPH: { 
    min: 5.0, max: 8.0, optimal: [6.0, 6.8], unit: 'pH',
    description: '토양 산도',
    criticalLow: 5.5, criticalHigh: 7.5
  },
  soilTemperature: { 
    min: 10, max: 35, optimal: [15, 25], unit: '°C',
    description: '지온',
    criticalLow: 12, criticalHigh: 30
  },
  windSpeed: { 
    min: 0, max: 5, optimal: [0.5, 2.0], unit: 'm/s',
    description: '환기 풍속',
    criticalLow: 0.2, criticalHigh: 3.0
  }
};

// 작물 생육 단계 정의 (딸기 기준)
export const GROWTH_STAGES = {
  strawberry: [
    { 
      weeks: [1, 4], 
      stage: '정식기', 
      description: '묘 정식 및 활착',
      keyMetrics: ['soilMoisture', 'soilTemperature', 'humidity'],
      targetActions: ['정식', '활착관리', '토양조성']
    },
    { 
      weeks: [5, 12], 
      stage: '영양생장기', 
      description: '잎과 뿌리 발달',
      keyMetrics: ['temperature', 'lightIntensity', 'co2'],
      targetActions: ['관수관리', '온도관리', '병해예방', '엽면시비']
    },
    { 
      weeks: [13, 20], 
      stage: '화아분화기', 
      description: '꽃눈 형성',
      keyMetrics: ['temperature', 'lightIntensity'],
      targetActions: ['저온처리', '일장조절', '영양관리', '적심']
    },
    { 
      weeks: [21, 28], 
      stage: '개화기', 
      description: '개화 및 수분',
      keyMetrics: ['humidity', 'temperature', 'windSpeed'],
      targetActions: ['수분관리', '온도조절', '환기관리', '꽃솎기']
    },
    { 
      weeks: [29, 40], 
      stage: '결실기', 
      description: '과실 비대',
      keyMetrics: ['soilMoisture', 'temperature', 'lightIntensity'],
      targetActions: ['과실관리', '적과', '품질관리', '칼슘공급']
    },
    { 
      weeks: [41, 52], 
      stage: '수확기', 
      description: '수확 및 품질 유지',
      keyMetrics: ['humidity', 'temperature'],
      targetActions: ['수확', '품질선별', '저장관리', '다음기작준비']
    }
  ]
};

// 조치사항 매트릭스
export const ACTION_MATRIX = {
  temperature: {
    tooLow: { 
      action: 'heating', 
      description: '난방 시스템 가동',
      methods: ['온풍기 가동', '보온커튼 설치', '열펌프 운전'],
      urgency: 'high',
      duration: '2-4시간',
      cost: 'medium'
    },
    tooHigh: { 
      action: 'cooling', 
      description: '냉각 시스템 가동',
      methods: ['환기팬 가동', '차광막 설치', '미스트 분무', '지붕 환기창 개방'],
      urgency: 'high',
      duration: '1-3시간',
      cost: 'low'
    }
  },
  humidity: {
    tooLow: { 
      action: 'humidification', 
      description: '가습 실시',
      methods: ['미스트 분무', '젖은 수건 설치', '물 증발판 설치'],
      urgency: 'medium',
      duration: '30분-1시간',
      cost: 'low'
    },
    tooHigh: { 
      action: 'dehumidification', 
      description: '제습 실시',
      methods: ['환기 강화', '제습기 가동', '난방으로 습도 조절'],
      urgency: 'medium',
      duration: '1-2시간',
      cost: 'medium'
    }
  },
  soilMoisture: {
    tooLow: { 
      action: 'irrigation', 
      description: '관수 실시',
      methods: ['점적관수', '스프링클러', '저면관수'],
      urgency: 'high',
      duration: '15-30분',
      cost: 'low'
    },
    tooHigh: { 
      action: 'drainage', 
      description: '배수 및 건조',
      methods: ['배수로 개방', '환기 강화', '관수 중단'],
      urgency: 'medium',
      duration: '4-8시간',
      cost: 'low'
    }
  },
  lightIntensity: {
    tooLow: { 
      action: 'supplementalLighting', 
      description: '보광 실시',
      methods: ['LED 보광등', 'HPS 램프', '형광등'],
      urgency: 'low',
      duration: '4-8시간',
      cost: 'high'
    },
    tooHigh: { 
      action: 'shading', 
      description: '차광 실시',
      methods: ['차광막 설치', '차광도료 도포', '자연 차광'],
      urgency: 'medium',
      duration: '지속적',
      cost: 'medium'
    }
  },
  co2: {
    tooLow: { 
      action: 'co2Injection', 
      description: 'CO2 공급',
      methods: ['CO2 발생기', '드라이아이스', '연소식 CO2 공급'],
      urgency: 'low',
      duration: '2-4시간',
      cost: 'medium'
    }
  }
};

// 생육 예측 알고리즘
export const GROWTH_PREDICTION_ALGORITHM = {
  /**
   * 현재 환경 조건에서 7일 후 생육 상태 예측
   */
  predictGrowth: (currentEnvironment, currentGrowth, currentWeek) => {
    const stage = getCurrentGrowthStage(currentWeek);
    const environmentScore = calculateEnvironmentScore(currentEnvironment, stage);
    
    // 환경 점수에 따른 생육 예측
    const growthMultiplier = environmentScore / 100;
    
    return {
      predictedHeight: currentGrowth.plantHeight + (stage.expectedGrowth.height * growthMultiplier),
      predictedLeafCount: currentGrowth.leafCount + (stage.expectedGrowth.leaves * growthMultiplier),
      predictedHealthIndex: Math.min(100, currentGrowth.healthIndex + (environmentScore - 80)),
      confidenceLevel: calculateConfidence(environmentScore),
      recommendations: generateRecommendations(environmentScore, stage)
    };
  },

  /**
   * 환경 변화 예측 (기상 예보 + 현재 추세)
   */
  predictEnvironment: (currentEnvironment, weatherForecast, days = 7) => {
    const predictions = [];
    
    for (let day = 1; day <= days; day++) {
      const weather = weatherForecast[day - 1] || {};
      
      // 외부 기온 영향
      const tempInfluence = weather.temperature ? weather.temperature * 0.3 : 0;
      const humidityInfluence = weather.humidity ? weather.humidity * 0.2 : 0;
      
      // 계절적 트렌드
      const seasonalTrend = getSeasonalTrend(new Date(), day);
      
      predictions.push({
        date: addDays(new Date(), day),
        temperature: currentEnvironment.temperature + tempInfluence + seasonalTrend.temperature,
        humidity: currentEnvironment.humidity + humidityInfluence + seasonalTrend.humidity,
        lightIntensity: weather.cloudCover ? 
          currentEnvironment.lightIntensity * (1 - weather.cloudCover * 0.5) : 
          currentEnvironment.lightIntensity,
        confidence: calculateWeatherConfidence(day)
      });
    }
    
    return predictions;
  },

  /**
   * 필요 조치사항 예측
   */
  predictRequiredActions: (environmentPredictions, currentStage) => {
    const actionSchedule = [];
    
    environmentPredictions.forEach((prediction, index) => {
      const day = index + 1;
      const actions = [];
      
      // 각 환경 요소별 체크
      Object.keys(ENVIRONMENT_SENSORS).forEach(sensor => {
        const sensorData = ENVIRONMENT_SENSORS[sensor];
        const predictedValue = prediction[sensor];
        
        if (predictedValue < sensorData.optimal[0]) {
          actions.push({
            ...ACTION_MATRIX[sensor].tooLow,
            sensor,
            predictedValue,
            deviation: sensorData.optimal[0] - predictedValue,
            scheduledTime: `${day}일 후`
          });
        } else if (predictedValue > sensorData.optimal[1]) {
          actions.push({
            ...ACTION_MATRIX[sensor].tooHigh,
            sensor,
            predictedValue,
            deviation: predictedValue - sensorData.optimal[1],
            scheduledTime: `${day}일 후`
          });
        }
      });
      
      if (actions.length > 0) {
        actionSchedule.push({
          date: prediction.date,
          day: day,
          actions: actions.sort((a, b) => getUrgencyScore(b.urgency) - getUrgencyScore(a.urgency))
        });
      }
    });
    
    return actionSchedule;
  }
};

// 시뮬레이션 시나리오 정의
export const SIMULATION_SCENARIOS = {
  normal: {
    name: '정상 환경 시나리오',
    description: '이상적인 환경 조건에서의 생육',
    environmentModifier: { temperature: 0, humidity: 0, lightIntensity: 1.0 },
    expectedOutcome: '정상 생육, 예상 수확량 100%'
  },
  
  heatWave: {
    name: '폭염 시나리오',
    description: '연속 3일간 35°C 이상 고온',
    environmentModifier: { temperature: +10, humidity: -15, lightIntensity: 1.2 },
    expectedOutcome: '생육 지연, 수확량 15% 감소 예상',
    requiredActions: ['강제 환기', '차광 설치', '미스트 분무']
  },
  
  coldSnap: {
    name: '한파 시나리오',
    description: '연속 5일간 5°C 이하 저온',
    environmentModifier: { temperature: -8, humidity: +10, lightIntensity: 0.6 },
    expectedOutcome: '생육 정지, 동해 위험',
    requiredActions: ['난방 강화', '보온커튼', '온수 순환']
  },
  
  drought: {
    name: '가뭄 시나리오',
    description: '2주간 강수량 0mm, 토양 건조',
    environmentModifier: { soilMoisture: -25, humidity: -20 },
    expectedOutcome: '수분 스트레스, 수확량 20% 감소',
    requiredActions: ['집중 관수', '멀칭', '습도 관리']
  },
  
  disease: {
    name: '병해 발생 시나리오',
    description: '고온다습으로 인한 곰팡이병 발생',
    environmentModifier: { temperature: +5, humidity: +20 },
    expectedOutcome: '병해 확산, 수확량 30% 감소 위험',
    requiredActions: ['환기 강화', '제습', '방제 약제 살포']
  },
  
  optimal: {
    name: '최적화 시나리오',
    description: 'AI 최적 제어 시나리오',
    environmentModifier: { temperature: 0, humidity: 0, lightIntensity: 1.1 },
    expectedOutcome: '최적 생육, 수확량 120% 달성',
    requiredActions: ['정밀 환경 제어', '영양 관리', '생육 모니터링']
  }
};

// 헬퍼 함수들
const getCurrentGrowthStage = (week) => {
  const strawberryStages = GROWTH_STAGES.strawberry;
  return strawberryStages.find(stage => 
    week >= stage.weeks[0] && week <= stage.weeks[1]
  ) || strawberryStages[0];
};

const calculateEnvironmentScore = (environment, stage) => {
  let totalScore = 0;
  let metricCount = 0;
  
  stage.keyMetrics.forEach(metric => {
    const sensor = ENVIRONMENT_SENSORS[metric];
    const value = environment[metric];
    
    if (value >= sensor.optimal[0] && value <= sensor.optimal[1]) {
      totalScore += 100;
    } else if (value >= sensor.criticalLow && value <= sensor.criticalHigh) {
      // 최적 범위 밖이지만 허용 범위 내
      const deviation = Math.min(
        Math.abs(value - sensor.optimal[0]),
        Math.abs(value - sensor.optimal[1])
      );
      const maxDeviation = Math.max(
        sensor.optimal[0] - sensor.criticalLow,
        sensor.criticalHigh - sensor.optimal[1]
      );
      totalScore += Math.max(50, 100 - (deviation / maxDeviation) * 50);
    } else {
      // 위험 범위
      totalScore += 20;
    }
    metricCount++;
  });
  
  return metricCount > 0 ? totalScore / metricCount : 0;
};

const calculateConfidence = (environmentScore) => {
  if (environmentScore >= 90) return 'high';
  if (environmentScore >= 70) return 'medium';
  return 'low';
};

const generateRecommendations = (environmentScore, stage) => {
  const recommendations = [];
  
  if (environmentScore < 70) {
    recommendations.push({
      type: 'urgent',
      message: '환경 개선이 시급합니다',
      actions: stage.targetActions.slice(0, 2)
    });
  } else if (environmentScore < 85) {
    recommendations.push({
      type: 'caution',
      message: '환경 모니터링을 강화하세요',
      actions: stage.targetActions.slice(0, 3)
    });
  } else {
    recommendations.push({
      type: 'good',
      message: '현재 환경이 양호합니다',
      actions: ['현재 상태 유지', '정기 점검']
    });
  }
  
  return recommendations;
};

const getSeasonalTrend = (currentDate, daysAhead) => {
  const futureDate = addDays(currentDate, daysAhead);
  const month = futureDate.getMonth() + 1;
  
  // 계절별 온도/습도 트렌드
  if (month >= 3 && month <= 5) { // 봄
    return { temperature: 0.2 * daysAhead, humidity: -0.5 * daysAhead };
  } else if (month >= 6 && month <= 8) { // 여름
    return { temperature: 0.1 * daysAhead, humidity: 0.3 * daysAhead };
  } else if (month >= 9 && month <= 11) { // 가을
    return { temperature: -0.2 * daysAhead, humidity: 0.1 * daysAhead };
  } else { // 겨울
    return { temperature: -0.1 * daysAhead, humidity: -0.2 * daysAhead };
  }
};

const calculateWeatherConfidence = (daysAhead) => {
  // 예측 신뢰도는 날짜가 멀어질수록 감소
  return Math.max(0.5, 1 - (daysAhead * 0.1));
};

const getUrgencyScore = (urgency) => {
  const scores = { high: 3, medium: 2, low: 1 };
  return scores[urgency] || 0;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 가상 온실 시뮬레이션 실행
 */
export const runGreenhouseSimulation = (scenario, currentEnvironment, currentWeek) => {
  const selectedScenario = SIMULATION_SCENARIOS[scenario];
  if (!selectedScenario) return null;
  
  // 시나리오 적용된 환경 계산
  const modifiedEnvironment = { ...currentEnvironment };
  Object.keys(selectedScenario.environmentModifier).forEach(key => {
    const modifier = selectedScenario.environmentModifier[key];
    if (typeof modifier === 'number' && key !== 'lightIntensity') {
      modifiedEnvironment[key] = currentEnvironment[key] + modifier;
    } else if (key === 'lightIntensity') {
      modifiedEnvironment[key] = currentEnvironment[key] * modifier;
    }
  });
  
  // 7일간 예측 실행
  const predictions = GROWTH_PREDICTION_ALGORITHM.predictEnvironment(
    modifiedEnvironment, 
    generateMockWeatherForecast(), 
    7
  );
  
  const requiredActions = GROWTH_PREDICTION_ALGORITHM.predictRequiredActions(
    predictions, 
    getCurrentGrowthStage(currentWeek)
  );
  
  return {
    scenario: selectedScenario,
    modifiedEnvironment,
    predictions,
    requiredActions,
    summary: {
      totalActions: requiredActions.reduce((sum, day) => sum + day.actions.length, 0),
      urgentActions: requiredActions.reduce((sum, day) => 
        sum + day.actions.filter(a => a.urgency === 'high').length, 0
      ),
      estimatedCost: calculateTotalCost(requiredActions),
      expectedOutcome: selectedScenario.expectedOutcome
    }
  };
};

// 모의 기상 예보 데이터 생성
const generateMockWeatherForecast = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    temperature: 20 + Math.sin(i * 0.5) * 5 + (Math.random() - 0.5) * 4,
    humidity: 60 + Math.cos(i * 0.3) * 15 + (Math.random() - 0.5) * 10,
    cloudCover: Math.random() * 0.7,
    windSpeed: 1 + Math.random() * 2,
    precipitation: Math.random() < 0.3 ? Math.random() * 10 : 0
  }));
};

// 총 비용 계산
const calculateTotalCost = (actionSchedule) => {
  const costMap = { low: 5000, medium: 15000, high: 30000 };
  
  return actionSchedule.reduce((total, day) => {
    return total + day.actions.reduce((dayTotal, action) => {
      return dayTotal + (costMap[action.cost] || 0);
    }, 0);
  }, 0);
};

/**
 * 실시간 환경 모니터링 데이터 생성
 */
export const generateRealtimeEnvironmentData = (baseEnvironment, week) => {
  const now = new Date();
  const data = [];
  
  // 지난 24시간 데이터 생성
  for (let hour = 23; hour >= 0; hour--) {
    const timestamp = new Date(now.getTime() - hour * 60 * 60 * 1000);
    const hourOfDay = timestamp.getHours();
    const isDay = hourOfDay >= 6 && hourOfDay <= 18;
    
    // 시간대별 자연스러운 변화 패턴
    const tempVariation = isDay ? 
      Math.sin((hourOfDay - 6) / 12 * Math.PI) * 3 : -2;
    const humidityVariation = isDay ? -5 + Math.random() * 10 : 5 + Math.random() * 10;
    const lightVariation = isDay ? 
      Math.sin((hourOfDay - 6) / 12 * Math.PI) * 0.8 : 0;
    
    data.push({
      timestamp: timestamp.toISOString(),
      hour: hourOfDay,
      temperature: baseEnvironment.temperature + tempVariation + (Math.random() - 0.5) * 2,
      humidity: Math.max(30, Math.min(95, baseEnvironment.humidity + humidityVariation)),
      co2: baseEnvironment.co2 + (isDay ? -50 : 100) + (Math.random() - 0.5) * 50,
      lightIntensity: baseEnvironment.lightIntensity * lightVariation,
      soilMoisture: baseEnvironment.soilMoisture + (Math.random() - 0.5) * 3,
      soilPH: baseEnvironment.soilPH + (Math.random() - 0.5) * 0.2,
      windSpeed: baseEnvironment.windSpeed + (Math.random() - 0.5) * 0.5
    });
  }
  
  return data;
};

/**
 * 월간 환경 요약 데이터 생성
 */
export const generateMonthlyEnvironmentSummary = (year, month, baseEnvironment = {}) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthlyData = [];
  
  // 기본 환경 값 설정
  const defaultEnvironment = {
    temperature: { current: 22 },
    humidity: { current: 65 },
    co2: { current: 400 },
    light: { current: 300 }
  };
  
  // baseEnvironment 안전하게 처리
  const safeEnvironment = {
    temperature: baseEnvironment.temperature?.current || defaultEnvironment.temperature.current,
    humidity: baseEnvironment.humidity?.current || defaultEnvironment.humidity.current,
    co2: baseEnvironment.co2?.current || defaultEnvironment.co2.current,
    light: baseEnvironment.light?.current || defaultEnvironment.light.current
  };
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / 86400000);
    
    // 계절적 변화 패턴
    const seasonalTemp = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 10;
    const seasonalHumidity = Math.cos((dayOfYear / 365) * 2 * Math.PI) * 15;
    
    // 일별 랜덤 변화
    const dailyVariation = (Math.random() - 0.5) * 5;
    
    const dayData = {
      date: date.toISOString().split('T')[0],
      day: day,
      avgTemperature: safeEnvironment.temperature + seasonalTemp + dailyVariation,
      avgHumidity: Math.max(30, Math.min(95, safeEnvironment.humidity + seasonalHumidity - dailyVariation)),
      avgLightIntensity: safeEnvironment.light * (0.8 + Math.random() * 0.4),
      avgSoilMoisture: (baseEnvironment.soilMoisture?.current || 70) + (Math.random() - 0.5) * 10,
      
      // 환경 상태 평가
      status: 'normal', // normal, warning, critical
      requiredActions: [],
      weatherCondition: getRandomWeatherCondition()
    };
    
    // 환경 상태 평가 및 조치사항 결정
    dayData.status = evaluateDayEnvironmentStatus(dayData);
    dayData.requiredActions = generateDayActions(dayData);
    
    monthlyData.push(dayData);
  }
  
  return monthlyData;
};

// 헬퍼 함수들
const evaluateDayEnvironmentStatus = (dayData) => {
  const tempOk = dayData.avgTemperature >= 18 && dayData.avgTemperature <= 25;
  const humidityOk = dayData.avgHumidity >= 60 && dayData.avgHumidity <= 75;
  const soilOk = dayData.avgSoilMoisture >= 40 && dayData.avgSoilMoisture <= 65;
  
  const okCount = [tempOk, humidityOk, soilOk].filter(Boolean).length;
  
  if (okCount === 3) return 'optimal';
  if (okCount >= 2) return 'normal';
  if (okCount >= 1) return 'warning';
  return 'critical';
};

const generateDayActions = (dayData) => {
  const actions = [];
  
  if (dayData.avgTemperature < 18) {
    actions.push({ type: 'heating', priority: 'high', description: '난방 필요' });
  } else if (dayData.avgTemperature > 25) {
    actions.push({ type: 'cooling', priority: 'high', description: '냉각 필요' });
  }
  
  if (dayData.avgSoilMoisture < 40) {
    actions.push({ type: 'irrigation', priority: 'high', description: '관수 필요' });
  }
  
  if (dayData.avgHumidity > 80) {
    actions.push({ type: 'ventilation', priority: 'medium', description: '환기 필요' });
  }
  
  return actions;
};

const getRandomWeatherCondition = () => {
  const conditions = ['맑음', '구름조금', '구름많음', '흐림', '비', '눈'];
  const weights = [0.3, 0.25, 0.2, 0.15, 0.08, 0.02];
  
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < conditions.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return conditions[i];
    }
  }
  
  return conditions[0];
};

// 주차별 환경 데이터 생성
export const generateWeeklyEnvironmentData = (weeks = 16, baseSensors = {}) => {
  const weeklyData = [];
  
  // 기본 센서 값 설정
  const defaultSensors = {
    temperature: { current: 22 },
    humidity: { current: 65 },
    co2: { current: 400 },
    light: { current: 300 },
    soilMoisture: { current: 70 }
  };
  
  // baseSensors와 기본값 병합
  const sensors = {
    temperature: baseSensors.temperature || defaultSensors.temperature,
    humidity: baseSensors.humidity || defaultSensors.humidity,
    co2: baseSensors.co2 || defaultSensors.co2,
    light: baseSensors.light || defaultSensors.light,
    soilMoisture: baseSensors.soilMoisture || defaultSensors.soilMoisture
  };
  
  for (let week = 1; week <= weeks; week++) {
    const weekData = {
      week: `${week}주차`,
      temperature: (sensors.temperature?.current || 22) + (Math.random() - 0.5) * 4,
      humidity: (sensors.humidity?.current || 65) + (Math.random() - 0.5) * 10,
      co2: (sensors.co2?.current || 400) + (Math.random() - 0.5) * 100,
      light: (sensors.light?.current || 300) + (Math.random() - 0.5) * 200,
      soilMoisture: (sensors.soilMoisture?.current || 70) + (Math.random() - 0.5) * 10
    };
    
    weeklyData.push(weekData);
  }
  
  return weeklyData;
};
