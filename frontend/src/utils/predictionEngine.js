/**
 * 생육 환경 예측 및 의사결정 엔진
 * 미래 환경 변화 예측과 선제적 조치사항 추천
 */

import { ENVIRONMENT_SENSORS, GROWTH_STAGES } from './greenhouseSimulator';
import { DETAILED_SIMULATION_SCENARIOS } from './detailedScenarios';

/**
 * 미래 환경 예측 엔진
 */
export class EnvironmentPredictionEngine {
  constructor() {
    this.historicalData = [];
    this.weatherPatterns = this.initializeWeatherPatterns();
    this.seasonalTrends = this.initializeSeasonalTrends();
  }

  /**
   * 7일간 환경 예측
   */
  predict7DayEnvironment(currentEnvironment, externalFactors = {}) {
    const predictions = [];
    const baseDate = new Date();

    for (let day = 1; day <= 7; day++) {
      const futureDate = new Date(baseDate.getTime() + day * 24 * 60 * 60 * 1000);
      const prediction = this.predictSingleDay(currentEnvironment, futureDate, day, externalFactors);
      predictions.push(prediction);
    }

    return predictions;
  }

  /**
   * 단일 날짜 환경 예측
   */
  predictSingleDay(baseEnvironment, targetDate, daysAhead, externalFactors) {
    const seasonalEffect = this.calculateSeasonalEffect(targetDate);
    const weatherEffect = this.calculateWeatherEffect(daysAhead, externalFactors);
    const trendEffect = this.calculateTrendEffect(daysAhead);
    const randomVariation = this.calculateRandomVariation(daysAhead);

    return {
      date: targetDate.toISOString().split('T')[0],
      daysAhead,
      temperature: this.applyPredictionFactors(
        baseEnvironment.temperature,
        [seasonalEffect.temperature, weatherEffect.temperature, trendEffect.temperature, randomVariation.temperature]
      ),
      humidity: this.applyPredictionFactors(
        baseEnvironment.humidity,
        [seasonalEffect.humidity, weatherEffect.humidity, trendEffect.humidity, randomVariation.humidity]
      ),
      lightIntensity: this.applyPredictionFactors(
        baseEnvironment.lightIntensity,
        [seasonalEffect.lightIntensity, weatherEffect.lightIntensity, trendEffect.lightIntensity, randomVariation.lightIntensity]
      ),
      soilMoisture: this.applyPredictionFactors(
        baseEnvironment.soilMoisture,
        [seasonalEffect.soilMoisture, weatherEffect.soilMoisture, trendEffect.soilMoisture, randomVariation.soilMoisture]
      ),
      co2: this.applyPredictionFactors(
        baseEnvironment.co2,
        [seasonalEffect.co2, weatherEffect.co2, trendEffect.co2, randomVariation.co2]
      ),
      confidence: Math.max(0.3, 0.95 - (daysAhead * 0.1)), // 예측 신뢰도
      weatherCondition: weatherEffect.condition
    };
  }

  /**
   * 계절적 영향 계산
   */
  calculateSeasonalEffect(date) {
    const month = date.getMonth() + 1;
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    
    // 계절별 기본 패턴
    const tempCycle = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 8;
    const humidityCycle = Math.cos((dayOfYear / 365) * 2 * Math.PI) * 10;
    const lightCycle = Math.sin((dayOfYear / 365) * 2 * Math.PI + Math.PI/2) * 0.3;

    return {
      temperature: tempCycle,
      humidity: humidityCycle,
      lightIntensity: 1 + lightCycle,
      soilMoisture: month >= 6 && month <= 8 ? -5 : 3, // 여름철 증발량 증가
      co2: month >= 11 || month <= 2 ? 50 : -30 // 겨울철 환기 감소로 CO2 증가
    };
  }

  /**
   * 기상 영향 계산
   */
  calculateWeatherEffect(daysAhead, externalFactors) {
    const { 
      weatherForecast = 'normal',
      externalTemperature = 20,
      precipitation = 0,
      windSpeed = 2,
      cloudCover = 0.3
    } = externalFactors;

    let tempEffect = 0;
    let humidityEffect = 0;
    let lightEffect = 1;
    let soilMoistureEffect = 0;
    let co2Effect = 0;
    let condition = '맑음';

    switch (weatherForecast) {
      case 'sunny':
        tempEffect = 2;
        humidityEffect = -5;
        lightEffect = 1.2;
        condition = '맑음';
        break;
      case 'cloudy':
        tempEffect = -1;
        humidityEffect = 5;
        lightEffect = 0.6;
        condition = '흐림';
        break;
      case 'rainy':
        tempEffect = -3;
        humidityEffect = 15;
        lightEffect = 0.4;
        soilMoistureEffect = 10;
        condition = '비';
        break;
      case 'storm':
        tempEffect = -5;
        humidityEffect = 25;
        lightEffect = 0.3;
        soilMoistureEffect = 20;
        co2Effect = -100;
        condition = '폭풍';
        break;
      default:
        condition = '보통';
    }

    // 외부 온도 영향 (온실은 외부 온도의 30% 영향)
    tempEffect += (externalTemperature - 20) * 0.3;

    return {
      temperature: tempEffect,
      humidity: humidityEffect,
      lightIntensity: lightEffect,
      soilMoisture: soilMoistureEffect,
      co2: co2Effect,
      condition
    };
  }

  /**
   * 트렌드 영향 계산 (연속적 변화)
   */
  calculateTrendEffect(daysAhead) {
    // 시간이 지날수록 누적되는 변화
    return {
      temperature: 0.1 * daysAhead,
      humidity: -0.2 * daysAhead,
      lightIntensity: 1 + (0.01 * daysAhead),
      soilMoisture: -0.5 * daysAhead,
      co2: 5 * daysAhead
    };
  }

  /**
   * 랜덤 변동 계산
   */
  calculateRandomVariation(daysAhead) {
    const uncertainty = Math.min(0.3, 0.05 * daysAhead); // 예측 불확실성
    
    return {
      temperature: (Math.random() - 0.5) * 4 * uncertainty,
      humidity: (Math.random() - 0.5) * 10 * uncertainty,
      lightIntensity: 1 + (Math.random() - 0.5) * 0.2 * uncertainty,
      soilMoisture: (Math.random() - 0.5) * 8 * uncertainty,
      co2: (Math.random() - 0.5) * 100 * uncertainty
    };
  }

  /**
   * 예측 인자들을 종합하여 최종 값 계산
   */
  applyPredictionFactors(baseValue, factors) {
    let result = baseValue;
    
    factors.forEach(factor => {
      if (typeof factor === 'number') {
        result += factor;
      } else if (typeof factor === 'object' && factor.multiplier) {
        result *= factor.multiplier;
      }
    });

    return Math.round(result * 10) / 10;
  }

  /**
   * 기상 패턴 초기화
   */
  initializeWeatherPatterns() {
    return {
      spring: { temp: [15, 25], humidity: [50, 70], precipitation: 0.3 },
      summer: { temp: [25, 35], humidity: [60, 80], precipitation: 0.4 },
      autumn: { temp: [10, 20], humidity: [55, 75], precipitation: 0.2 },
      winter: { temp: [0, 10], humidity: [45, 65], precipitation: 0.1 }
    };
  }

  /**
   * 계절 트렌드 초기화
   */
  initializeSeasonalTrends() {
    return {
      temperatureAmplitude: 15, // 연간 온도 변화폭
      humidityAmplitude: 20,    // 연간 습도 변화폭
      lightAmplitude: 0.4       // 연간 광량 변화폭
    };
  }
}

/**
 * 작업 예측 및 스케줄링 엔진
 */
export class ActionPredictionEngine {
  constructor() {
    this.actionHistory = [];
    this.cropCalendar = this.initializeCropCalendar();
  }

  /**
   * 미래 필요 작업 예측
   */
  predictFutureActions(environmentPredictions, currentWeek, currentGrowthStage) {
    const actionSchedule = [];

    environmentPredictions.forEach((prediction, index) => {
      const day = index + 1;
      const actions = [];

      // 환경 기반 즉시 조치사항
      const environmentActions = this.analyzeEnvironmentActions(prediction);
      
      // 생육 단계 기반 정기 작업
      const stageActions = this.analyzeStageActions(currentWeek + Math.floor(day / 7), day);
      
      // 예방적 조치사항
      const preventiveActions = this.analyzePreventiveActions(prediction, day);

      actions.push(...environmentActions, ...stageActions, ...preventiveActions);

      if (actions.length > 0) {
        actionSchedule.push({
          date: prediction.date,
          day: day,
          confidence: prediction.confidence,
          actions: this.prioritizeActions(actions),
          totalCost: this.calculateDayCost(actions),
          workload: this.calculateWorkload(actions)
        });
      }
    });

    return actionSchedule;
  }

  /**
   * 환경 조건 기반 조치사항 분석
   */
  analyzeEnvironmentActions(prediction) {
    const actions = [];

    Object.keys(ENVIRONMENT_SENSORS).forEach(sensor => {
      const sensorData = ENVIRONMENT_SENSORS[sensor];
      const value = prediction[sensor];
      
      if (!value) return;

      if (value < sensorData.optimal[0]) {
        actions.push({
          type: 'environment',
          sensor: sensor,
          issue: 'below_optimal',
          description: `${sensorData.description}이 최적 범위보다 낮습니다 (${value}${sensorData.unit})`,
          action: this.getActionForLowValue(sensor),
          urgency: value < sensorData.criticalLow ? 'critical' : 'high',
          estimatedDuration: this.getActionDuration(sensor, 'low'),
          estimatedCost: this.getActionCost(sensor, 'low')
        });
      } else if (value > sensorData.optimal[1]) {
        actions.push({
          type: 'environment',
          sensor: sensor,
          issue: 'above_optimal',
          description: `${sensorData.description}이 최적 범위보다 높습니다 (${value}${sensorData.unit})`,
          action: this.getActionForHighValue(sensor),
          urgency: value > sensorData.criticalHigh ? 'critical' : 'high',
          estimatedDuration: this.getActionDuration(sensor, 'high'),
          estimatedCost: this.getActionCost(sensor, 'high')
        });
      }
    });

    return actions;
  }

  /**
   * 생육 단계 기반 정기 작업 분석
   */
  analyzeStageActions(week, day) {
    const actions = [];
    const stage = this.getCurrentStageByWeek(week);
    
    if (!stage) return actions;

    // 주간 정기 작업
    if (day % 7 === 1) { // 매주 월요일
      actions.push({
        type: 'routine',
        category: 'weekly_inspection',
        description: `${stage.stage} 단계 주간 점검`,
        action: '생육 상태 관찰 및 기록',
        urgency: 'low',
        estimatedDuration: '30분',
        estimatedCost: 0
      });
    }

    // 생육 단계별 특수 작업
    stage.targetActions.forEach(targetAction => {
      const scheduledAction = this.getScheduledAction(targetAction, week, day);
      if (scheduledAction) {
        actions.push(scheduledAction);
      }
    });

    return actions;
  }

  /**
   * 예방적 조치사항 분석
   */
  analyzePreventiveActions(prediction, day) {
    const actions = [];

    // 병해충 예방
    if (prediction.humidity > 80 && prediction.temperature > 20) {
      actions.push({
        type: 'preventive',
        category: 'disease_prevention',
        description: '고온다습 조건으로 곰팡이병 발생 위험 증가',
        action: '예방적 환기 강화 및 방제제 살포 준비',
        urgency: 'medium',
        estimatedDuration: '1시간',
        estimatedCost: 15000
      });
    }

    // 스트레스 예방
    if (Math.abs(prediction.temperature - 22) > 5) {
      actions.push({
        type: 'preventive',
        category: 'stress_prevention',
        description: '온도 스트레스 예방 필요',
        action: '온도 제어 시스템 점검 및 대비',
        urgency: 'medium',
        estimatedDuration: '45분',
        estimatedCost: 5000
      });
    }

    return actions;
  }

  /**
   * 작업 우선순위 결정
   */
  prioritizeActions(actions) {
    const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    return actions.sort((a, b) => {
      // 1차: 긴급도
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      
      // 2차: 비용 효율성 (낮은 비용 우선)
      return a.estimatedCost - b.estimatedCost;
    });
  }

  /**
   * 낮은 값에 대한 조치사항
   */
  getActionForLowValue(sensor) {
    const actionMap = {
      temperature: '난방 시스템 가동',
      humidity: '가습기 운전 또는 미스트 분무',
      soilMoisture: '관수 실시',
      lightIntensity: 'LED 보광등 가동',
      co2: 'CO2 발생기 가동',
      soilPH: '석회 시용으로 pH 상승',
      windSpeed: '환기팬 가동'
    };
    return actionMap[sensor] || '전문가 상담';
  }

  /**
   * 높은 값에 대한 조치사항
   */
  getActionForHighValue(sensor) {
    const actionMap = {
      temperature: '환기 강화 또는 차광막 설치',
      humidity: '제습기 가동 또는 환기 강화',
      soilMoisture: '배수 개선 및 관수 중단',
      lightIntensity: '차광막 설치',
      co2: '환기 강화로 CO2 배출',
      soilPH: '황산 처리로 pH 하강',
      windSpeed: '환기 조절'
    };
    return actionMap[sensor] || '전문가 상담';
  }

  /**
   * 작업 소요 시간 추정
   */
  getActionDuration(sensor, direction) {
    const durationMap = {
      temperature: { low: '2-4시간', high: '1-3시간' },
      humidity: { low: '30분-1시간', high: '1-2시간' },
      soilMoisture: { low: '15-30분', high: '4-8시간' },
      lightIntensity: { low: '즉시', high: '30분' },
      co2: { low: '즉시', high: '30분' }
    };
    return durationMap[sensor]?.[direction] || '1시간';
  }

  /**
   * 작업 비용 추정
   */
  getActionCost(sensor, direction) {
    const costMap = {
      temperature: { low: 25000, high: 8000 },
      humidity: { low: 5000, high: 12000 },
      soilMoisture: { low: 3000, high: 2000 },
      lightIntensity: { low: 20000, high: 5000 },
      co2: { low: 15000, high: 3000 }
    };
    return costMap[sensor]?.[direction] || 10000;
  }

  /**
   * 현재 주차의 생육 단계 조회
   */
  getCurrentStageByWeek(week) {
    const strawberryStages = GROWTH_STAGES.strawberry;
    return strawberryStages.find(stage => 
      week >= stage.weeks[0] && week <= stage.weeks[1]
    );
  }

  /**
   * 예정된 작업 조회
   */
  getScheduledAction(targetAction, week, day) {
    const actionSchedule = {
      '정식': { weeks: [1], description: '딸기 묘 정식 작업' },
      '활착관리': { weeks: [1, 2], description: '정식 후 활착 관리' },
      '관수관리': { weeks: [5, 12], frequency: 'daily', description: '영양생장기 관수 관리' },
      '온도관리': { weeks: [5, 28], frequency: 'continuous', description: '최적 온도 유지' },
      '병해예방': { weeks: [8, 40], frequency: 'weekly', description: '병해충 예방 점검' },
      '저온처리': { weeks: [13, 16], description: '화아분화 촉진을 위한 저온 처리' },
      '수분관리': { weeks: [21, 28], description: '개화기 수분 관리' },
      '과실관리': { weeks: [29, 40], frequency: 'daily', description: '과실 솎기 및 관리' },
      '수확': { weeks: [35, 52], frequency: 'daily', description: '성숙 과실 수확' }
    };

    const schedule = actionSchedule[targetAction];
    if (!schedule) return null;

    const isInWeekRange = schedule.weeks.length === 1 ? 
      week === schedule.weeks[0] : 
      week >= schedule.weeks[0] && week <= schedule.weeks[1];

    if (!isInWeekRange) return null;

    const shouldExecute = schedule.frequency === 'daily' || 
                         (schedule.frequency === 'weekly' && day % 7 === 1) ||
                         (schedule.frequency === 'continuous') ||
                         (!schedule.frequency && day === 1);

    if (!shouldExecute) return null;

    return {
      type: 'scheduled',
      category: targetAction,
      description: schedule.description,
      action: `${targetAction} 실시`,
      urgency: 'medium',
      estimatedDuration: this.getTaskDuration(targetAction),
      estimatedCost: this.getTaskCost(targetAction)
    };
  }

  /**
   * 작업별 소요 시간
   */
  getTaskDuration(task) {
    const durations = {
      '정식': '4-6시간',
      '활착관리': '30분',
      '관수관리': '20분',
      '온도관리': '지속적',
      '병해예방': '1시간',
      '저온처리': '지속적',
      '수분관리': '2시간',
      '과실관리': '2-3시간',
      '수확': '3-4시간'
    };
    return durations[task] || '1시간';
  }

  /**
   * 작업별 비용
   */
  getTaskCost(task) {
    const costs = {
      '정식': 50000,
      '활착관리': 5000,
      '관수관리': 3000,
      '온도관리': 15000,
      '병해예방': 20000,
      '저온처리': 10000,
      '수분관리': 8000,
      '과실관리': 12000,
      '수확': 25000
    };
    return costs[task] || 10000;
  }

  /**
   * 일일 총 비용 계산
   */
  calculateDayCost(actions) {
    return actions.reduce((total, action) => total + (action.estimatedCost || 0), 0);
  }

  /**
   * 일일 작업량 계산
   */
  calculateWorkload(actions) {
    const workloadMap = { 
      '즉시': 0.1, 
      '15-30분': 0.5, 
      '30분': 0.5, 
      '1시간': 1, 
      '2시간': 2, 
      '3-4시간': 3.5,
      '지속적': 0.2 
    };
    
    return actions.reduce((total, action) => {
      const duration = action.estimatedDuration;
      return total + (workloadMap[duration] || 1);
    }, 0);
  }

  /**
   * 작물 달력 초기화
   */
  initializeCropCalendar() {
    return {
      strawberry: {
        planting: { month: 9, description: '딸기 정식 시기' },
        flowering: { month: [11, 12, 1, 2], description: '개화 시기' },
        harvest: { month: [12, 1, 2, 3, 4, 5], description: '수확 시기' },
        maintenance: { month: [6, 7, 8], description: '휴작 및 시설 정비' }
      }
    };
  }
}

/**
 * 통합 예측 시스템
 */
export class IntegratedPredictionSystem {
  constructor() {
    this.environmentEngine = new EnvironmentPredictionEngine();
    this.actionEngine = new ActionPredictionEngine();
  }

  /**
   * 종합 예측 실행
   */
  runComprehensivePrediction(currentState, externalFactors = {}) {
    const {
      environment: currentEnvironment,
      week: currentWeek,
      growthStage: currentGrowthStage
    } = currentState;

    // 환경 예측
    const environmentPredictions = this.environmentEngine.predict7DayEnvironment(
      currentEnvironment, 
      externalFactors
    );

    // 작업 예측
    const actionSchedule = this.actionEngine.predictFutureActions(
      environmentPredictions,
      currentWeek,
      currentGrowthStage
    );

    // 종합 분석
    const analysis = this.generateComprehensiveAnalysis(
      environmentPredictions,
      actionSchedule
    );

    return {
      environmentPredictions,
      actionSchedule,
      analysis,
      recommendations: this.generateRecommendations(analysis),
      riskAssessment: this.assessRisks(environmentPredictions, actionSchedule)
    };
  }

  /**
   * 종합 분석 생성
   */
  generateComprehensiveAnalysis(environmentPredictions, actionSchedule) {
    const totalActions = actionSchedule.reduce((sum, day) => sum + day.actions.length, 0);
    const totalCost = actionSchedule.reduce((sum, day) => sum + day.totalCost, 0);
    const avgConfidence = environmentPredictions.reduce((sum, pred) => sum + pred.confidence, 0) / environmentPredictions.length;
    
    const criticalDays = actionSchedule.filter(day => 
      day.actions.some(action => action.urgency === 'critical')
    ).length;

    return {
      summary: {
        totalActions,
        totalCost,
        avgConfidence: Math.round(avgConfidence * 100),
        criticalDays,
        workloadPeak: Math.max(...actionSchedule.map(day => day.workload))
      },
      trends: {
        temperatureTrend: this.calculateTrend(environmentPredictions, 'temperature'),
        humidityTrend: this.calculateTrend(environmentPredictions, 'humidity'),
        riskTrend: this.calculateRiskTrend(actionSchedule)
      }
    };
  }

  /**
   * 추천사항 생성
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.summary.criticalDays > 2) {
      recommendations.push({
        type: 'urgent',
        title: '긴급 대응 체계 구축 필요',
        description: `향후 7일 중 ${analysis.summary.criticalDays}일에 긴급 조치가 필요합니다. 비상 대응 계획을 수립하고 필요 자재를 미리 준비하세요.`,
        priority: 'high'
      });
    }

    if (analysis.summary.totalCost > 100000) {
      recommendations.push({
        type: 'economic',
        title: '비용 최적화 검토 필요',
        description: `예상 관리 비용이 ${analysis.summary.totalCost.toLocaleString()}원으로 높습니다. 작업 우선순위를 재검토하여 비용 효율적인 방안을 모색하세요.`,
        priority: 'medium'
      });
    }

    if (analysis.summary.avgConfidence < 70) {
      recommendations.push({
        type: 'monitoring',
        title: '모니터링 강화 필요',
        description: `예측 신뢰도가 ${analysis.summary.avgConfidence}%로 낮습니다. 환경 센서 점검과 실시간 모니터링을 강화하여 예측 정확도를 높이세요.`,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * 위험도 평가
   */
  assessRisks(environmentPredictions, actionSchedule) {
    const risks = [];

    // 환경 위험도
    environmentPredictions.forEach((prediction, index) => {
      const extremeConditions = this.identifyExtremeConditions(prediction);
      if (extremeConditions.length > 0) {
        risks.push({
          day: index + 1,
          date: prediction.date,
          type: 'environment',
          level: this.calculateRiskLevel(extremeConditions),
          conditions: extremeConditions,
          impact: '생육 저해 및 수확량 감소 위험'
        });
      }
    });

    // 작업 부하 위험도
    const highWorkloadDays = actionSchedule.filter(day => day.workload > 6);
    if (highWorkloadDays.length > 0) {
      risks.push({
        type: 'workload',
        level: 'medium',
        days: highWorkloadDays.map(day => day.day),
        impact: '과도한 작업량으로 인한 관리 품질 저하 위험'
      });
    }

    return risks;
  }

  /**
   * 극한 조건 식별
   */
  identifyExtremeConditions(prediction) {
    const extremes = [];

    Object.keys(ENVIRONMENT_SENSORS).forEach(sensor => {
      const sensorData = ENVIRONMENT_SENSORS[sensor];
      const value = prediction[sensor];
      
      if (!value) return;

      if (value < sensorData.criticalLow) {
        extremes.push({
          sensor,
          value,
          condition: 'critically_low',
          description: `${sensorData.description} 위험 수준 (${value}${sensorData.unit})`
        });
      } else if (value > sensorData.criticalHigh) {
        extremes.push({
          sensor,
          value,
          condition: 'critically_high',
          description: `${sensorData.description} 위험 수준 (${value}${sensorData.unit})`
        });
      }
    });

    return extremes;
  }

  /**
   * 위험 수준 계산
   */
  calculateRiskLevel(extremeConditions) {
    if (extremeConditions.length >= 3) return 'critical';
    if (extremeConditions.length >= 2) return 'high';
    if (extremeConditions.length >= 1) return 'medium';
    return 'low';
  }

  /**
   * 트렌드 계산
   */
  calculateTrend(predictions, field) {
    if (predictions.length < 2) return 'stable';
    
    const firstValue = predictions[0][field];
    const lastValue = predictions[predictions.length - 1][field];
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }

  /**
   * 위험 트렌드 계산
   */
  calculateRiskTrend(actionSchedule) {
    const riskScores = actionSchedule.map(day => {
      const criticalCount = day.actions.filter(a => a.urgency === 'critical').length;
      const highCount = day.actions.filter(a => a.urgency === 'high').length;
      return criticalCount * 3 + highCount * 2;
    });

    if (riskScores.length < 2) return 'stable';
    
    const trend = riskScores[riskScores.length - 1] - riskScores[0];
    if (trend > 2) return 'increasing';
    if (trend < -2) return 'decreasing';
    return 'stable';
  }
}
