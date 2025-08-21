/**
 * 엑셀 데이터 처리 및 보간 유틸리티
 */

// 농장 코드 매핑
export const FARM_CODES = {
  'PF_0006021': { name: '충북농장', region: '충북', year: 2021 },
  'PF_0022103': { name: '전북농장A', region: '전북', year: 2021 },
  'PF_0020733': { name: '전북농장B', region: '전북', year: [2020, 2021] },
  'PF_0020729': { name: '전북농장C', region: '전북', year: [2020, 2021] },
  'PF_0001306': { name: '전남농장A', region: '전남', year: 2021 },
  'PF_0001065': { name: '전남농장B', region: '전남', year: 2021 },
  'PF_0010052': { name: '전남농장C', region: '전남', year: 2020 },
  'PF_0021128': { name: '대구농장', region: '대구', year: 2020 }
};

// 데이터 타입별 스키마
export const DATA_SCHEMAS = {
  environment: {
    temperature: { unit: '°C', range: [10, 35], optimal: [18, 25] },
    humidity: { unit: '%', range: [30, 90], optimal: [60, 75] },
    co2: { unit: 'ppm', range: [300, 1200], optimal: [400, 800] },
    lightIntensity: { unit: 'lux', range: [0, 50000], optimal: [20000, 40000] },
    soilMoisture: { unit: '%', range: [20, 80], optimal: [40, 60] },
    ph: { unit: 'pH', range: [5.5, 7.5], optimal: [6.0, 6.8] }
  },
  growth: {
    plantHeight: { unit: 'cm', range: [5, 100] },
    leafLength: { unit: 'cm', range: [3, 25] },
    leafWidth: { unit: 'cm', range: [2, 15] },
    stemDiameter: { unit: 'mm', range: [3, 15] },
    fruitCount: { unit: '개', range: [0, 50] },
    fruitWeight: { unit: 'g', range: [5, 30] },
    healthScore: { unit: '점', range: [0, 100] }
  },
  management: {
    yieldAmount: { unit: 'kg', range: [0, 1000] },
    revenue: { unit: '원', range: [0, 5000000] },
    cost: { unit: '원', range: [0, 2000000] },
    profit: { unit: '원', range: [-500000, 3000000] },
    efficiency: { unit: '%', range: [0, 100] }
  },
  control: {
    heatingStatus: { unit: 'boolean', values: [0, 1] },
    ventilationStatus: { unit: 'boolean', values: [0, 1] },
    irrigationStatus: { unit: 'boolean', values: [0, 1] },
    lightingStatus: { unit: 'boolean', values: [0, 1] },
    heatingSetpoint: { unit: '°C', range: [15, 30] },
    ventilationRate: { unit: '%', range: [0, 100] }
  }
};

/**
 * 날짜 범위 생성 (데이터 보간용)
 */
export const generateDateRange = (startDate, endDate, interval = 'hour') => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(new Date(current));
    
    if (interval === 'hour') {
      current.setHours(current.getHours() + 1);
    } else if (interval === 'day') {
      current.setDate(current.getDate() + 1);
    } else if (interval === 'week') {
      current.setDate(current.getDate() + 7);
    }
  }
  
  return dates;
};

/**
 * 환경 데이터 보간 생성
 */
export const generateEnvironmentData = (farmCode, startDate, endDate) => {
  const dates = generateDateRange(startDate, endDate, 'hour');
  const farmInfo = FARM_CODES[farmCode];
  
  return dates.map(date => {
    // 시간대별 패턴 적용
    const hour = date.getHours();
    const isDay = hour >= 6 && hour <= 18;
    const season = getSeason(date);
    
    // 기본 온도 패턴 (계절별, 시간대별)
    let baseTemp = season === 'winter' ? 18 : season === 'summer' ? 25 : 22;
    const tempVariation = isDay ? Math.sin((hour - 6) / 12 * Math.PI) * 3 : -2;
    const temperature = baseTemp + tempVariation + (Math.random() - 0.5) * 2;
    
    // 습도 (온도와 반비례 관계)
    const humidity = Math.max(50, Math.min(85, 80 - (temperature - 20) * 1.5 + (Math.random() - 0.5) * 10));
    
    // CO2 (낮에는 낮고, 밤에는 높음)
    const co2 = isDay ? 400 + Math.random() * 100 : 500 + Math.random() * 200;
    
    // 조도 (일출/일몰 패턴)
    let lightIntensity = 0;
    if (isDay) {
      const dayProgress = (hour - 6) / 12;
      lightIntensity = Math.sin(dayProgress * Math.PI) * 40000 * (0.8 + Math.random() * 0.4);
    }
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      datetime: date.toISOString(),
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0],
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      co2: Math.round(co2),
      lightIntensity: Math.round(lightIntensity),
      soilMoisture: Math.round((50 + (Math.random() - 0.5) * 20) * 10) / 10,
      ph: Math.round((6.3 + (Math.random() - 0.5) * 0.6) * 10) / 10
    };
  });
};

/**
 * 생육 데이터 보간 생성
 */
export const generateGrowthData = (farmCode, startDate, endDate) => {
  const dates = generateDateRange(startDate, endDate, 'week');
  const farmInfo = FARM_CODES[farmCode];
  
  return dates.map((date, index) => {
    // 생장 곡선 적용 (S-curve)
    const weeksPassed = index;
    const maxWeeks = dates.length;
    const growthProgress = 1 / (1 + Math.exp(-0.3 * (weeksPassed - maxWeeks/2)));
    
    // 기본 생육 데이터
    const plantHeight = 10 + growthProgress * 80 + (Math.random() - 0.5) * 5;
    const leafLength = 5 + growthProgress * 18 + (Math.random() - 0.5) * 2;
    const leafWidth = 3 + growthProgress * 10 + (Math.random() - 0.5) * 1;
    const stemDiameter = 3 + growthProgress * 10 + (Math.random() - 0.5) * 1;
    
    // 결실기 이후 과실 데이터
    const fruitCount = weeksPassed > maxWeeks * 0.6 ? Math.round(growthProgress * 30 + Math.random() * 10) : 0;
    const fruitWeight = fruitCount > 0 ? 15 + Math.random() * 10 : 0;
    
    // 건강도 (환경 조건에 따라 변동)
    const healthScore = Math.max(70, Math.min(100, 85 + (Math.random() - 0.5) * 20));
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      date: date.toISOString().split('T')[0],
      week: weeksPassed + 1,
      plantHeight: Math.round(plantHeight * 10) / 10,
      leafLength: Math.round(leafLength * 10) / 10,
      leafWidth: Math.round(leafWidth * 10) / 10,
      stemDiameter: Math.round(stemDiameter * 10) / 10,
      fruitCount,
      fruitWeight: Math.round(fruitWeight * 10) / 10,
      healthScore: Math.round(healthScore),
      growthStage: getGrowthStage(weeksPassed, maxWeeks)
    };
  });
};

/**
 * 경영 데이터 보간 생성
 */
export const generateManagementData = (farmCode, startDate, endDate) => {
  const dates = generateDateRange(startDate, endDate, 'day');
  const farmInfo = FARM_CODES[farmCode];
  
  let cumulativeYield = 0;
  let cumulativeRevenue = 0;
  let cumulativeCost = 0;
  
  return dates.map((date, index) => {
    // 일일 수확량 (계절별 패턴)
    const season = getSeason(date);
    const seasonMultiplier = season === 'winter' ? 0.7 : season === 'summer' ? 1.3 : 1.0;
    const dailyYield = Math.max(0, (5 + Math.random() * 15) * seasonMultiplier);
    
    // 가격 변동 (시장 가격 시뮬레이션)
    const basePrice = 8000; // 딸기 kg당 기본 가격
    const priceVariation = 1 + (Math.random() - 0.5) * 0.3; // ±15% 변동
    const dailyPrice = basePrice * priceVariation;
    
    // 일일 수익
    const dailyRevenue = dailyYield * dailyPrice;
    
    // 일일 비용 (고정비 + 변동비)
    const fixedCost = 50000; // 일일 고정비
    const variableCost = dailyYield * 2000; // kg당 변동비
    const dailyCost = (fixedCost + variableCost) / 30; // 월 기준을 일 기준으로
    
    // 누적 데이터
    cumulativeYield += dailyYield;
    cumulativeRevenue += dailyRevenue;
    cumulativeCost += dailyCost;
    
    const profit = cumulativeRevenue - cumulativeCost;
    const efficiency = cumulativeRevenue > 0 ? (profit / cumulativeRevenue) * 100 : 0;
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      date: date.toISOString().split('T')[0],
      dailyYield: Math.round(dailyYield * 10) / 10,
      cumulativeYield: Math.round(cumulativeYield * 10) / 10,
      dailyRevenue: Math.round(dailyRevenue),
      cumulativeRevenue: Math.round(cumulativeRevenue),
      dailyCost: Math.round(dailyCost),
      cumulativeCost: Math.round(cumulativeCost),
      profit: Math.round(profit),
      efficiency: Math.round(efficiency * 10) / 10,
      pricePerKg: Math.round(dailyPrice)
    };
  });
};

/**
 * 제어 데이터 보간 생성
 */
export const generateControlData = (farmCode, startDate, endDate) => {
  const dates = generateDateRange(startDate, endDate, 'hour');
  const farmInfo = FARM_CODES[farmCode];
  
  return dates.map(date => {
    const hour = date.getHours();
    const isDay = hour >= 6 && hour <= 18;
    const season = getSeason(date);
    
    // 난방 제어 (겨울철, 야간에 주로 가동)
    const heatingStatus = season === 'winter' && (!isDay || Math.random() < 0.3) ? 1 : 0;
    const heatingSetpoint = season === 'winter' ? 20 + Math.random() * 5 : 18;
    
    // 환기 제어 (주간, 여름철에 주로 가동)
    const ventilationStatus = (isDay && Math.random() < 0.7) || (season === 'summer' && Math.random() < 0.9) ? 1 : 0;
    const ventilationRate = ventilationStatus ? 30 + Math.random() * 50 : 0;
    
    // 관수 제어 (정해진 시간에 가동)
    const irrigationStatus = [6, 12, 18].includes(hour) && Math.random() < 0.8 ? 1 : 0;
    
    // 조명 제어 (겨울철 보광용)
    const lightingStatus = season === 'winter' && [5, 6, 17, 18, 19].includes(hour) ? 1 : 0;
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      datetime: date.toISOString(),
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0],
      heatingStatus,
      ventilationStatus,
      irrigationStatus,
      lightingStatus,
      heatingSetpoint: Math.round(heatingSetpoint * 10) / 10,
      ventilationRate: Math.round(ventilationRate),
      irrigationDuration: irrigationStatus ? 15 + Math.random() * 30 : 0, // 분 단위
      lightingIntensity: lightingStatus ? 15000 + Math.random() * 10000 : 0
    };
  });
};

/**
 * 통합 데이터 생성
 */
export const generateIntegratedData = (filters = {}) => {
  const {
    farmCodes = Object.keys(FARM_CODES),
    startDate = '2020-01-01',
    endDate = '2021-12-31',
    dataTypes = ['environment', 'growth', 'management', 'control']
  } = filters;
  
  const result = {};
  
  farmCodes.forEach(farmCode => {
    if (!FARM_CODES[farmCode]) return;
    
    result[farmCode] = {};
    
    if (dataTypes.includes('environment')) {
      result[farmCode].environment = generateEnvironmentData(farmCode, startDate, endDate);
    }
    
    if (dataTypes.includes('growth')) {
      result[farmCode].growth = generateGrowthData(farmCode, startDate, endDate);
    }
    
    if (dataTypes.includes('management')) {
      result[farmCode].management = generateManagementData(farmCode, startDate, endDate);
    }
    
    if (dataTypes.includes('control')) {
      result[farmCode].control = generateControlData(farmCode, startDate, endDate);
    }
  });
  
  return result;
};

/**
 * 상관관계 계산
 */
export const calculateCorrelation = (data, xField, yField) => {
  const validData = data.filter(d => 
    d[xField] !== null && d[xField] !== undefined &&
    d[yField] !== null && d[yField] !== undefined
  );
  
  if (validData.length < 2) return 0;
  
  const xMean = validData.reduce((sum, d) => sum + d[xField], 0) / validData.length;
  const yMean = validData.reduce((sum, d) => sum + d[yField], 0) / validData.length;
  
  let numerator = 0;
  let xSumSq = 0;
  let ySumSq = 0;
  
  validData.forEach(d => {
    const xDiff = d[xField] - xMean;
    const yDiff = d[yField] - yMean;
    numerator += xDiff * yDiff;
    xSumSq += xDiff * xDiff;
    ySumSq += yDiff * yDiff;
  });
  
  const denominator = Math.sqrt(xSumSq * ySumSq);
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * 헬퍼 함수들
 */
const getSeason = (date) => {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

const getGrowthStage = (week, totalWeeks) => {
  const progress = week / totalWeeks;
  if (progress < 0.2) return '발아기';
  if (progress < 0.4) return '생장기';
  if (progress < 0.6) return '개화기';
  if (progress < 0.8) return '결실기';
  return '수확기';
};

/**
 * 데이터 내보내기 (CSV 형식)
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
