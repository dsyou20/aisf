/**
 * 작업 중심 달력 시스템
 * 일별 필요 작업과 자동화 시스템 관리
 */

import { GREENHOUSE_DATA } from './greenhouseManager';
import { ENVIRONMENT_SENSORS } from './greenhouseSimulator';

// 자동화 작업 정의
export const AUTOMATED_ACTIONS = {
  // 환경 제어 작업
  temperature_control: {
    name: '온도 조절',
    category: '환경제어',
    description: '온실 내부 온도를 최적 범위로 자동 조절',
    methods: {
      heating: { name: '난방 가동', duration: '2-4시간', automation: 'full' },
      cooling: { name: '환기/냉각', duration: '1-3시간', automation: 'full' },
      ventilation: { name: '자동 환기', duration: '30분-2시간', automation: 'full' }
    },
    priority: 'high',
    frequency: '실시간'
  },

  humidity_control: {
    name: '습도 조절',
    category: '환경제어', 
    description: '온실 내부 습도를 최적 범위로 자동 조절',
    methods: {
      humidification: { name: '미스트 분무', duration: '15-30분', automation: 'full' },
      dehumidification: { name: '제습/환기', duration: '1-2시간', automation: 'full' }
    },
    priority: 'medium',
    frequency: '실시간'
  },

  irrigation: {
    name: '관수 작업',
    category: '수분관리',
    description: '토양 수분 센서 기반 자동 관수 시스템',
    methods: {
      drip_irrigation: { name: '점적 관수', duration: '20-40분', automation: 'full' },
      sprinkler: { name: '스프링클러', duration: '15-25분', automation: 'full' },
      fertigation: { name: '양액 관수', duration: '30-45분', automation: 'full' }
    },
    priority: 'high',
    frequency: '일 2-3회'
  },

  fertilization: {
    name: '시비 작업',
    category: '영양관리',
    description: '생육 단계별 맞춤 영양 공급',
    methods: {
      liquid_fertilizer: { name: '액비 공급', duration: '30분', automation: 'semi' },
      foliar_feeding: { name: '엽면 시비', duration: '45분', automation: 'semi' },
      soil_amendment: { name: '토양 개량', duration: '2시간', automation: 'manual' }
    },
    priority: 'medium',
    frequency: '주 1-2회'
  },

  pest_control: {
    name: '병해충 방제',
    category: '방제관리',
    description: 'AI 기반 병해충 조기 감지 및 자동 방제',
    methods: {
      bio_control: { name: '천적 곤충 방사', duration: '1시간', automation: 'semi' },
      spray_treatment: { name: '자동 방제 분무', duration: '30분', automation: 'full' },
      monitoring: { name: 'AI 모니터링', duration: '지속적', automation: 'full' }
    },
    priority: 'high',
    frequency: '주 1회'
  },

  harvesting: {
    name: '수확 작업',
    category: '수확관리',
    description: '성숙도 센서 기반 자동 수확 시스템',
    methods: {
      robot_harvest: { name: '로봇 수확', duration: '4-6시간', automation: 'full' },
      selective_harvest: { name: '선별 수확', duration: '2-3시간', automation: 'semi' },
      quality_sorting: { name: '품질 선별', duration: '1-2시간', automation: 'full' }
    },
    priority: 'critical',
    frequency: '수확기 매일'
  },

  pruning: {
    name: '정지 작업',
    category: '재배관리',
    description: '생육 최적화를 위한 자동 정지 시스템',
    methods: {
      auto_pruning: { name: '자동 정지', duration: '1-2시간', automation: 'semi' },
      leaf_removal: { name: '하엽 제거', duration: '30분-1시간', automation: 'semi' },
      flower_thinning: { name: '적화', duration: '45분', automation: 'manual' }
    },
    priority: 'medium',
    frequency: '주 1-2회'
  },

  monitoring: {
    name: '모니터링',
    category: '관찰기록',
    description: 'IoT 센서 및 AI 비전 기반 실시간 모니터링',
    methods: {
      sensor_monitoring: { name: '센서 데이터 수집', duration: '지속적', automation: 'full' },
      ai_vision: { name: 'AI 영상 분석', duration: '지속적', automation: 'full' },
      growth_tracking: { name: '생육 추적', duration: '30분', automation: 'semi' }
    },
    priority: 'low',
    frequency: '지속적'
  },

  maintenance: {
    name: '시설 점검',
    category: '시설관리',
    description: '온실 시설 및 장비 자동 점검 시스템',
    methods: {
      equipment_check: { name: '장비 자동 점검', duration: '1시간', automation: 'full' },
      sensor_calibration: { name: '센서 보정', duration: '30분', automation: 'semi' },
      system_backup: { name: '시스템 백업', duration: '15분', automation: 'full' }
    },
    priority: 'medium',
    frequency: '주 1회'
  }
};

// 작업 우선순위 점수
export const PRIORITY_SCORES = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

// 자동화 수준 정의
export const AUTOMATION_LEVELS = {
  full: { name: '완전 자동', color: '#52c41a', description: '버튼 클릭으로 즉시 실행' },
  semi: { name: '반자동', color: '#faad14', description: '일부 수동 개입 필요' },
  manual: { name: '수동', color: '#ff4d4f', description: '수동 작업 필요' }
};

/**
 * 일별 작업 스케줄 생성
 */
export const generateDailyActionSchedule = (greenhouseId, startDate, days = 30) => {
  const greenhouse = GREENHOUSE_DATA[greenhouseId];
  if (!greenhouse) return [];

  const schedule = [];
  const baseDate = new Date(startDate);

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(baseDate.getTime() + day * 24 * 60 * 60 * 1000);
    const dayActions = generateDayActions(greenhouse, currentDate, day);
    
    schedule.push({
      date: currentDate.toISOString().split('T')[0],
      dayOfWeek: currentDate.toLocaleDateString('ko-KR', { weekday: 'short' }),
      actions: dayActions,
      totalActions: dayActions.length,
      urgentActions: dayActions.filter(action => action.priority === 'critical' || action.priority === 'high').length,
      automationRate: calculateAutomationRate(dayActions),
      estimatedDuration: calculateTotalDuration(dayActions),
      status: getDayStatus(dayActions)
    });
  }

  return schedule;
};

/**
 * 특정 날짜의 작업 생성
 */
const generateDayActions = (greenhouse, date, dayIndex) => {
  const actions = [];
  const dayOfWeek = date.getDay(); // 0=일요일, 1=월요일...
  const hour = date.getHours();
  
  // 환경 기반 작업 (매일)
  actions.push(...generateEnvironmentActions(greenhouse, date));
  
  // 생육 단계별 작업
  actions.push(...generateGrowthStageActions(greenhouse, date, dayIndex));
  
  // 정기 작업 (요일별)
  actions.push(...generateRoutineActions(greenhouse, dayOfWeek, dayIndex));
  
  // 계절별 작업
  actions.push(...generateSeasonalActions(greenhouse, date));
  
  // 예방적 작업
  actions.push(...generatePreventiveActions(greenhouse, date, dayIndex));

  // 기본 작업 (모든 하우스에 항상 추가)
  actions.push(...generateBasicDailyActions(greenhouse, date, dayIndex));
  
  // 우선순위별 정렬
  return actions.sort((a, b) => PRIORITY_SCORES[b.priority] - PRIORITY_SCORES[a.priority]);
};

/**
 * 환경 기반 작업 생성
 */
const generateEnvironmentActions = (greenhouse, date) => {
  const actions = [];
  const sensors = greenhouse.sensors;

  // 온도 조절 (최적 범위가 아니거나 극값에 가까운 경우)
  if (sensors.temperature.status !== 'optimal' || Math.abs(sensors.temperature.current - 23) > 3) {
    const isHot = sensors.temperature.current > 25;
    actions.push({
      id: `temp_control_${date.toISOString().split('T')[0]}`,
      type: 'temperature_control',
      name: isHot ? '냉각 시스템 가동' : '난방 시스템 가동',
      description: `현재 온도 ${sensors.temperature.current}°C → 목표 22-25°C`,
      method: isHot ? AUTOMATED_ACTIONS.temperature_control.methods.cooling : AUTOMATED_ACTIONS.temperature_control.methods.heating,
      priority: Math.abs(sensors.temperature.current - 23.5) > 5 ? 'critical' : 'high',
      scheduledTime: '06:00',
      estimatedDuration: isHot ? '1-3시간' : '2-4시간',
      automation: 'full',
      status: 'pending',
      conditions: {
        current: sensors.temperature.current,
        target: '22-25°C',
        deviation: Math.abs(sensors.temperature.current - 23.5)
      }
    });
  }

  // 습도 조절 (최적 범위가 아니거나 극값에 가까운 경우)
  if (sensors.humidity.status !== 'optimal' || Math.abs(sensors.humidity.current - 67.5) > 10) {
    const isHigh = sensors.humidity.current > 75;
    actions.push({
      id: `humidity_control_${date.toISOString().split('T')[0]}`,
      type: 'humidity_control',
      name: isHigh ? '제습 시스템 가동' : '가습 시스템 가동',
      description: `현재 습도 ${sensors.humidity.current}% → 목표 60-75%`,
      method: isHigh ? AUTOMATED_ACTIONS.humidity_control.methods.dehumidification : AUTOMATED_ACTIONS.humidity_control.methods.humidification,
      priority: Math.abs(sensors.humidity.current - 67.5) > 15 ? 'high' : 'medium',
      scheduledTime: '07:00',
      estimatedDuration: '30분-2시간',
      automation: 'full',
      status: 'pending',
      conditions: {
        current: sensors.humidity.current,
        target: '60-75%',
        deviation: Math.abs(sensors.humidity.current - 67.5)
      }
    });
  }

  // 관수 작업 (토양 수분 기준 또는 정기 관수)
  const needsIrrigation = sensors.soilMoisture.status === 'low' || 
                         sensors.soilMoisture.current < 45 ||
                         date.getHours() === 8 || 
                         date.getHours() === 16;
  
  if (needsIrrigation) {
    actions.push({
      id: `irrigation_${date.toISOString().split('T')[0]}_${date.getHours()}`,
      type: 'irrigation',
      name: '자동 관수 시스템',
      description: `토양 수분 ${sensors.soilMoisture.current}% → 목표 55-65%`,
      method: AUTOMATED_ACTIONS.irrigation.methods.drip_irrigation,
      priority: sensors.soilMoisture.current < 30 ? 'critical' : 'high',
      scheduledTime: date.getHours() === 8 ? '08:00' : '16:00',
      estimatedDuration: '20-40분',
      automation: 'full',
      status: 'pending',
      conditions: {
        current: sensors.soilMoisture.current,
        target: '55-65%',
        weather: '맑음'
      }
    });
  }

  return actions;
};

/**
 * 생육 단계별 작업 생성
 */
const generateGrowthStageActions = (greenhouse, date, dayIndex) => {
  const actions = [];
  const currentWeek = greenhouse.currentWeek;
  const dayOfWeek = date.getDay();

  // 주차별 생육 단계 작업
  if (currentWeek >= 5 && currentWeek <= 12) { // 영양생장기
    if (dayOfWeek === 1) { // 월요일
      actions.push({
        id: `growth_monitoring_${date.toISOString().split('T')[0]}`,
        type: 'monitoring',
        name: '생육 상태 AI 분석',
        description: '영양생장기 주간 생육 상태 자동 측정 및 분석',
        method: AUTOMATED_ACTIONS.monitoring.methods.ai_vision,
        priority: 'medium',
        scheduledTime: '09:00',
        estimatedDuration: '30분',
        automation: 'full',
        status: 'pending'
      });
    }
  } else if (currentWeek >= 21 && currentWeek <= 28) { // 개화기
    if (dayOfWeek === 2 || dayOfWeek === 5) { // 화, 금요일
      actions.push({
        id: `pollination_${date.toISOString().split('T')[0]}`,
        type: 'pollination',
        name: '자동 수분 시스템',
        description: '로봇 수분기 및 진동 수분 시스템 가동',
        method: { name: '자동 수분', duration: '2시간', automation: 'full' },
        priority: 'high',
        scheduledTime: '10:00',
        estimatedDuration: '2시간',
        automation: 'full',
        status: 'pending'
      });
    }
  } else if (currentWeek >= 29) { // 결실기/수확기
    if (dayIndex % 2 === 0) { // 격일
      actions.push({
        id: `harvest_${date.toISOString().split('T')[0]}`,
        type: 'harvesting',
        name: '자동 수확 시스템',
        description: '성숙도 센서 기반 로봇 수확 및 품질 선별',
        method: AUTOMATED_ACTIONS.harvesting.methods.robot_harvest,
        priority: 'critical',
        scheduledTime: '06:00',
        estimatedDuration: '4-6시간',
        automation: 'full',
        status: 'pending',
        expectedYield: Math.round(50 + Math.random() * 100) // 예상 수확량 (kg)
      });
    }
  }

  return actions;
};

/**
 * 정기 작업 생성 (요일별)
 */
const generateRoutineActions = (greenhouse, dayOfWeek, dayIndex) => {
  const actions = [];

  // 월요일: 주간 점검
  if (dayOfWeek === 1) {
    actions.push({
      id: `weekly_inspection_${dayIndex}`,
      type: 'maintenance',
      name: '주간 시설 점검',
      description: '센서, 장비, 구조물 자동 점검 시스템',
      method: AUTOMATED_ACTIONS.maintenance.methods.equipment_check,
      priority: 'medium',
      scheduledTime: '14:00',
      estimatedDuration: '1시간',
      automation: 'full',
      status: 'pending'
    });
  }

  // 수요일: 영양 관리
  if (dayOfWeek === 3) {
    actions.push({
      id: `nutrition_management_${dayIndex}`,
      type: 'fertilization',
      name: '영양 상태 분석 및 시비',
      description: '토양 센서 기반 영양 상태 분석 후 자동 시비',
      method: AUTOMATED_ACTIONS.fertilization.methods.liquid_fertilizer,
      priority: 'medium',
      scheduledTime: '11:00',
      estimatedDuration: '30분',
      automation: 'semi',
      status: 'pending'
    });
  }

  // 금요일: 병해충 예방
  if (dayOfWeek === 5) {
    actions.push({
      id: `pest_prevention_${dayIndex}`,
      type: 'pest_control',
      name: 'AI 병해충 예방 시스템',
      description: 'AI 영상 분석을 통한 병해충 조기 감지 및 예방 조치',
      method: AUTOMATED_ACTIONS.pest_control.methods.monitoring,
      priority: 'medium',
      scheduledTime: '15:00',
      estimatedDuration: '지속적',
      automation: 'full',
      status: 'pending'
    });
  }

  return actions;
};

/**
 * 계절별 작업 생성
 */
const generateSeasonalActions = (greenhouse, date) => {
  const actions = [];
  const month = date.getMonth() + 1;

  // 겨울철 (12-2월): 보온 관리
  if (month === 12 || month === 1 || month === 2) {
    if (date.getDate() % 7 === 1) { // 주 1회
      actions.push({
        id: `winter_care_${date.toISOString().split('T')[0]}`,
        type: 'temperature_control',
        name: '겨울철 보온 시스템',
        description: '다층 보온커튼 자동 제어 및 난방 최적화',
        method: { name: '보온 시스템', duration: '지속적', automation: 'full' },
        priority: 'high',
        scheduledTime: '18:00',
        estimatedDuration: '지속적',
        automation: 'full',
        status: 'pending'
      });
    }
  }

  // 여름철 (6-8월): 냉각 관리
  if (month === 6 || month === 7 || month === 8) {
    if (date.getDate() % 3 === 1) { // 3일마다
      actions.push({
        id: `summer_cooling_${date.toISOString().split('T')[0]}`,
        type: 'temperature_control',
        name: '여름철 냉각 시스템',
        description: '차광막 자동 제어 및 증발 냉각 시스템',
        method: { name: '냉각 시스템', duration: '주간 지속', automation: 'full' },
        priority: 'high',
        scheduledTime: '05:00',
        estimatedDuration: '주간 지속',
        automation: 'full',
        status: 'pending'
      });
    }
  }

  return actions;
};

/**
 * 예방적 작업 생성
 */
const generatePreventiveActions = (greenhouse, date, dayIndex) => {
  const actions = [];

  // 병해 예방 (고온다습 조건 시)
  if (greenhouse.sensors.temperature.current > 24 && greenhouse.sensors.humidity.current > 80) {
    actions.push({
      id: `disease_prevention_${date.toISOString().split('T')[0]}`,
      type: 'pest_control',
      name: '병해 예방 자동 방제',
      description: '고온다습 조건으로 인한 곰팡이병 예방 자동 분무',
      method: AUTOMATED_ACTIONS.pest_control.methods.spray_treatment,
      priority: 'high',
      scheduledTime: '20:00',
      estimatedDuration: '30분',
      automation: 'full',
      status: 'pending',
      reason: '고온다습 조건 감지'
    });
  }

  // 스트레스 예방 (극한 환경 조건 시)
  const tempStress = Math.abs(greenhouse.sensors.temperature.current - 23) > 8;
  const moistureStress = greenhouse.sensors.soilMoisture.current < 25;
  
  if (tempStress || moistureStress) {
    actions.push({
      id: `stress_prevention_${date.toISOString().split('T')[0]}`,
      type: 'monitoring',
      name: '스트레스 완화 시스템',
      description: '환경 스트레스 감지 시 자동 완화 조치',
      method: { name: '스트레스 완화', duration: '2시간', automation: 'full' },
      priority: 'high',
      scheduledTime: '즉시',
      estimatedDuration: '2시간',
      automation: 'full',
      status: 'pending',
      reason: tempStress ? '온도 스트레스' : '수분 스트레스'
    });
  }

  return actions;
};

/**
 * 기본 일일 작업 생성 (모든 하우스 공통)
 */
const generateBasicDailyActions = (greenhouse, date, dayIndex) => {
  const actions = [];
  const hour = date.getHours();

  // 매일 기본 모니터링
  actions.push({
    id: `daily_monitoring_${date.toISOString().split('T')[0]}`,
    type: 'monitoring',
    name: '일일 환경 모니터링',
    description: 'IoT 센서 데이터 수집 및 AI 분석을 통한 환경 상태 점검',
    method: AUTOMATED_ACTIONS.monitoring.methods.sensor_monitoring,
    priority: 'low',
    scheduledTime: '08:00',
    estimatedDuration: '지속적',
    automation: 'full',
    status: 'pending'
  });

  // 매일 온도 체크 및 조절
  actions.push({
    id: `temp_check_${date.toISOString().split('T')[0]}`,
    type: 'temperature_control',
    name: '온도 자동 조절',
    description: `현재 온도 ${greenhouse.sensors?.temperature?.current || 22}°C 최적 범위 유지`,
    method: AUTOMATED_ACTIONS.temperature_control.methods.heating,
    priority: 'medium',
    scheduledTime: '06:00',
    estimatedDuration: '1시간',
    automation: 'full',
    status: 'pending',
    conditions: {
      current: greenhouse.sensors?.temperature?.current || 22,
      target: '22-25°C'
    }
  });

  // 매일 기본 관수 (오전)
  actions.push({
    id: `daily_irrigation_${date.toISOString().split('T')[0]}`,
    type: 'irrigation',
    name: '정기 관수',
    description: '토양 수분 센서 기반 자동 관수 시스템 가동',
    method: AUTOMATED_ACTIONS.irrigation.methods.drip_irrigation,
    priority: 'medium',
    scheduledTime: '08:00',
    estimatedDuration: '20-30분',
    automation: 'full',
    status: 'pending',
    conditions: {
      current: greenhouse.sensors?.soilMoisture?.current || 50,
      target: '55-65%',
      weather: '정상'
    }
  });

  // 주 2회 기본 점검 (월, 목요일)
  if (date.getDay() === 1 || date.getDay() === 4) {
    actions.push({
      id: `routine_check_${date.toISOString().split('T')[0]}`,
      type: 'maintenance',
      name: '정기 시설 점검',
      description: '온실 시설 및 자동화 장비 상태 점검',
      method: AUTOMATED_ACTIONS.maintenance.methods.equipment_check,
      priority: 'medium',
      scheduledTime: '14:00',
      estimatedDuration: '45분',
      automation: 'full',
      status: 'pending'
    });
  }

  // 생육 단계별 기본 작업
  const currentWeek = greenhouse.currentWeek || 15;
  
  if (currentWeek >= 5 && currentWeek <= 20) { // 생장기
    if (dayIndex % 3 === 0) { // 3일마다
      actions.push({
        id: `growth_care_${date.toISOString().split('T')[0]}`,
        type: 'pruning',
        name: '생육 관리',
        description: '신초 관리 및 생육 상태 최적화',
        method: AUTOMATED_ACTIONS.pruning.methods.auto_pruning,
        priority: 'medium',
        scheduledTime: '10:00',
        estimatedDuration: '1시간',
        automation: 'semi',
        status: 'pending'
      });
    }
  }

  if (currentWeek >= 25) { // 수확기
    if (dayIndex % 2 === 0) { // 격일
      actions.push({
        id: `harvest_check_${date.toISOString().split('T')[0]}`,
        type: 'harvesting',
        name: '수확 가능 과실 확인',
        description: '성숙도 센서를 통한 수확 대상 과실 자동 선별',
        method: AUTOMATED_ACTIONS.harvesting.methods.robot_harvest,
        priority: 'high',
        scheduledTime: '07:00',
        estimatedDuration: '2-3시간',
        automation: 'full',
        status: 'pending',
        expectedYield: Math.round(20 + Math.random() * 50) // 예상 수확량
      });
    }
  }

  // 작물별 특수 작업
  if (greenhouse.crop?.includes('strawberry')) {
    // 딸기 특수 관리
    if (dayIndex % 5 === 0) {
      actions.push({
        id: `strawberry_care_${date.toISOString().split('T')[0]}`,
        type: 'pruning',
        name: '딸기 런너 제거',
        description: '에너지 집중을 위한 불필요한 런너 자동 제거',
        method: { name: '자동 런너 제거', duration: '30분', automation: 'semi' },
        priority: 'medium',
        scheduledTime: '11:00',
        estimatedDuration: '30분',
        automation: 'semi',
        status: 'pending'
      });
    }
  }

  if (greenhouse.crop?.includes('tomato')) {
    // 토마토 특수 관리
    if (dayIndex % 7 === 0) {
      actions.push({
        id: `tomato_care_${date.toISOString().split('T')[0]}`,
        type: 'pruning',
        name: '토마토 곁순 제거',
        description: '주지 생장 집중을 위한 곁순 자동 제거',
        method: { name: '자동 곁순 제거', duration: '45분', automation: 'semi' },
        priority: 'medium',
        scheduledTime: '09:30',
        estimatedDuration: '45분',
        automation: 'semi',
        status: 'pending'
      });
    }
  }

  // 최소 1개 작업 보장
  if (actions.length === 0) {
    actions.push({
      id: `default_monitoring_${date.toISOString().split('T')[0]}`,
      type: 'monitoring',
      name: '기본 상태 점검',
      description: '온실 전반적인 상태 확인 및 데이터 수집',
      method: { name: '자동 상태 점검', duration: '15분', automation: 'full' },
      priority: 'low',
      scheduledTime: '12:00',
      estimatedDuration: '15분',
      automation: 'full',
      status: 'pending'
    });
  }

  return actions;
};

/**
 * 자동화율 계산
 */
const calculateAutomationRate = (actions) => {
  if (actions.length === 0) return 0;
  
  const automationScores = { full: 1, semi: 0.5, manual: 0 };
  const totalScore = actions.reduce((sum, action) => {
    return sum + (automationScores[action.automation] || 0);
  }, 0);
  
  return Math.round((totalScore / actions.length) * 100);
};

/**
 * 총 소요 시간 계산
 */
const calculateTotalDuration = (actions) => {
  let totalMinutes = 0;
  
  actions.forEach(action => {
    const duration = action.estimatedDuration;
    if (duration.includes('시간')) {
      const hours = parseFloat(duration.match(/\d+/)[0]);
      totalMinutes += hours * 60;
    } else if (duration.includes('분')) {
      const minutes = parseFloat(duration.match(/\d+/)[0]);
      totalMinutes += minutes;
    }
  });
  
  return {
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    display: totalMinutes > 60 ? 
      `${Math.floor(totalMinutes / 60)}시간 ${totalMinutes % 60}분` : 
      `${totalMinutes}분`
  };
};

/**
 * 하루 상태 평가
 */
const getDayStatus = (actions) => {
  const criticalCount = actions.filter(a => a.priority === 'critical').length;
  const highCount = actions.filter(a => a.priority === 'high').length;
  
  if (criticalCount > 0) return 'critical';
  if (highCount > 2) return 'busy';
  if (actions.length > 5) return 'normal';
  return 'light';
};

/**
 * 작업 실행 시뮬레이션
 */
export const executeAction = async (actionId, greenhouseId) => {
  // 실제 자동화 시스템 연동 시뮬레이션
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% 성공률
      
      resolve({
        actionId,
        greenhouseId,
        success,
        executedAt: new Date().toISOString(),
        duration: Math.round(Math.random() * 60 + 10), // 10-70분
        result: success ? 
          '작업이 성공적으로 완료되었습니다.' : 
          '작업 중 오류가 발생했습니다. 수동 확인이 필요합니다.',
        sensorChanges: success ? generateSensorChanges() : null
      });
    }, 2000 + Math.random() * 3000); // 2-5초 시뮬레이션
  });
};

/**
 * 센서 변화 시뮬레이션
 */
const generateSensorChanges = () => {
  return {
    temperature: (Math.random() - 0.5) * 2,
    humidity: (Math.random() - 0.5) * 5,
    soilMoisture: Math.random() * 10,
    co2: (Math.random() - 0.5) * 50
  };
};

/**
 * 작업 상태 업데이트
 */
export const updateActionStatus = (schedule, actionId, newStatus, result = null) => {
  return schedule.map(day => ({
    ...day,
    actions: day.actions.map(action => 
      action.id === actionId 
        ? { 
            ...action, 
            status: newStatus,
            executedAt: newStatus === 'completed' ? new Date().toISOString() : action.executedAt,
            result: result || action.result
          }
        : action
    )
  }));
};

/**
 * 일별 작업 진행률 계산
 */
export const calculateDayProgress = (dayActions) => {
  if (dayActions.length === 0) return 100;
  
  const completedCount = dayActions.filter(action => action.status === 'completed').length;
  const inProgressCount = dayActions.filter(action => action.status === 'in_progress').length;
  
  return Math.round(((completedCount + inProgressCount * 0.5) / dayActions.length) * 100);
};

/**
 * 작업 카테고리별 색상
 */
export const ACTION_CATEGORY_COLORS = {
  '환경제어': '#1890ff',
  '수분관리': '#13c2c2', 
  '영양관리': '#52c41a',
  '방제관리': '#fa541c',
  '수확관리': '#722ed1',
  '재배관리': '#faad14',
  '관찰기록': '#2f54eb',
  '시설관리': '#eb2f96'
};

/**
 * 작업 우선순위별 색상
 */
export const ACTION_PRIORITY_COLORS = {
  critical: '#ff4d4f',
  high: '#fa8c16', 
  medium: '#fadb14',
  low: '#52c41a'
};

/**
 * 하루 상태별 색상
 */
export const DAY_STATUS_COLORS = {
  critical: '#ff4d4f',
  busy: '#fa8c16',
  normal: '#1890ff', 
  light: '#52c41a'
};

/**
 * 자동화 가능한 작업 타입들 (배열)
 */
export const AUTOMATED_ACTION_TYPES = [
  'temperature_control',
  'humidity_control', 
  'irrigation',
  'monitoring',
  'harvesting',
  'maintenance',
  'fertilization',
  'pest_control',
  'pruning'
];
