/**
 * 수확량 및 수익 예측 시스템
 * 환경 데이터, 생육 상태, 시장 정보를 종합하여 예측
 */

import { GREENHOUSE_DATA } from './greenhouseManager';
import { ENVIRONMENT_SENSORS, GROWTH_STAGES } from './greenhouseSimulator';

// 작물별 수확량 예측 모델
export const CROP_YIELD_MODELS = {
  tomato: {
    name: '토마토',
    unit: 'kg/㎡',
    baseYieldPerSqm: 25, // 기본 수확량 (kg/㎡)
    growthCycle: 120, // 재배 기간 (일)
    harvestPeriod: 60, // 수확 기간 (일)
    peakWeeks: [20, 35], // 최대 수확 주차
    environmentFactors: {
      temperature: { optimal: [22, 25], weight: 0.25 },
      humidity: { optimal: [60, 70], weight: 0.15 },
      lightIntensity: { optimal: [25000, 35000], weight: 0.30 },
      co2: { optimal: [600, 800], weight: 0.20 },
      soilMoisture: { optimal: [50, 65], weight: 0.10 }
    },
    qualityFactors: {
      size: { large: 1.2, medium: 1.0, small: 0.7 },
      sugar: { high: 1.3, medium: 1.0, low: 0.8 },
      firmness: { firm: 1.1, medium: 1.0, soft: 0.9 }
    }
  },

  strawberry: {
    name: '딸기',
    unit: 'kg/㎡',
    baseYieldPerSqm: 4.5, // 기본 수확량 (kg/㎡)
    growthCycle: 180, // 재배 기간 (일)
    harvestPeriod: 120, // 수확 기간 (일)
    peakWeeks: [25, 40], // 최대 수확 주차
    environmentFactors: {
      temperature: { optimal: [18, 23], weight: 0.30 },
      humidity: { optimal: [65, 75], weight: 0.20 },
      lightIntensity: { optimal: [20000, 30000], weight: 0.25 },
      co2: { optimal: [400, 600], weight: 0.15 },
      soilMoisture: { optimal: [55, 70], weight: 0.10 }
    },
    qualityFactors: {
      size: { large: 1.4, medium: 1.0, small: 0.6 },
      sugar: { high: 1.5, medium: 1.0, low: 0.7 },
      firmness: { firm: 1.2, medium: 1.0, soft: 0.8 }
    }
  },

  strawberry_premium: {
    name: '딸기 (프리미엄)',
    unit: 'kg/㎡',
    baseYieldPerSqm: 3.8, // 수량은 적지만 고품질
    growthCycle: 200,
    harvestPeriod: 140,
    peakWeeks: [28, 45],
    environmentFactors: {
      temperature: { optimal: [19, 22], weight: 0.35 }, // 더 까다로운 조건
      humidity: { optimal: [60, 70], weight: 0.25 },
      lightIntensity: { optimal: [25000, 35000], weight: 0.25 },
      co2: { optimal: [500, 700], weight: 0.15 }
    },
    qualityFactors: {
      size: { large: 1.6, medium: 1.2, small: 0.5 },
      sugar: { high: 1.8, medium: 1.2, low: 0.6 },
      firmness: { firm: 1.4, medium: 1.0, soft: 0.7 }
    }
  },

  tomato_organic: {
    name: '토마토 (유기농)',
    unit: 'kg/㎡',
    baseYieldPerSqm: 18, // 유기농은 수량이 적음
    growthCycle: 140,
    harvestPeriod: 70,
    peakWeeks: [22, 38],
    environmentFactors: {
      temperature: { optimal: [20, 24], weight: 0.30 },
      humidity: { optimal: [55, 65], weight: 0.20 }, // 병해 예방을 위해 낮은 습도
      lightIntensity: { optimal: [20000, 30000], weight: 0.25 },
      co2: { optimal: [400, 600], weight: 0.15 },
      soilMoisture: { optimal: [45, 60], weight: 0.10 }
    },
    qualityFactors: {
      size: { large: 1.1, medium: 1.0, small: 0.8 },
      sugar: { high: 1.4, medium: 1.1, low: 0.9 },
      organic: { certified: 1.5, transition: 1.2, conventional: 1.0 }
    }
  },

  herbs: {
    name: '허브류',
    unit: 'kg/㎡',
    baseYieldPerSqm: 2.2,
    growthCycle: 90,
    harvestPeriod: 60,
    peakWeeks: [8, 20],
    environmentFactors: {
      temperature: { optimal: [20, 26], weight: 0.25 },
      humidity: { optimal: [50, 65], weight: 0.20 },
      lightIntensity: { optimal: [15000, 25000], weight: 0.30 },
      co2: { optimal: [400, 600], weight: 0.15 },
      soilMoisture: { optimal: [40, 55], weight: 0.10 }
    },
    qualityFactors: {
      aroma: { strong: 1.3, medium: 1.0, weak: 0.7 },
      freshness: { excellent: 1.2, good: 1.0, poor: 0.8 }
    }
  }
};

// 시장 가격 데이터 (월별 변동)
export const MARKET_PRICE_DATA = {
  tomato: {
    basePrice: 8000, // 기본 가격 (원/kg)
    monthlyMultiplier: {
      1: 1.4, 2: 1.5, 3: 1.3, 4: 1.1, 5: 0.9, 6: 0.8,
      7: 0.7, 8: 0.8, 9: 0.9, 10: 1.1, 11: 1.2, 12: 1.3
    },
    qualityPremium: {
      premium: 1.5,
      standard: 1.0,
      economy: 0.7
    },
    organicPremium: 1.8
  },

  strawberry: {
    basePrice: 15000,
    monthlyMultiplier: {
      1: 1.8, 2: 1.6, 3: 1.4, 4: 1.2, 5: 1.0, 6: 0.9,
      7: 0.8, 8: 0.9, 9: 1.0, 10: 1.1, 11: 1.3, 12: 1.5
    },
    qualityPremium: {
      premium: 2.0,
      standard: 1.0,
      economy: 0.6
    },
    premiumVariety: 2.5
  },

  herbs: {
    basePrice: 25000,
    monthlyMultiplier: {
      1: 1.2, 2: 1.3, 3: 1.4, 4: 1.5, 5: 1.3, 6: 1.1,
      7: 1.0, 8: 1.0, 9: 1.1, 10: 1.2, 11: 1.3, 12: 1.2
    },
    qualityPremium: {
      premium: 1.8,
      standard: 1.0,
      economy: 0.8
    }
  }
};

/**
 * 수확량 예측 엔진
 */
export class YieldPredictionEngine {
  constructor() {
    this.historicalData = [];
    this.weatherImpact = this.initializeWeatherImpact();
  }

  /**
   * 하우스별 수확량 예측
   */
  predictYield(greenhouseId, predictionPeriod = 90) {
    const greenhouse = GREENHOUSE_DATA[greenhouseId];
    if (!greenhouse) return null;

    const cropModel = this.getCropModel(greenhouse.crop);
    if (!cropModel) return null;

    // 현재 환경 점수 계산
    const environmentScore = this.calculateEnvironmentScore(greenhouse.sensors, cropModel);
    
    // 생육 단계별 수확량 예측
    const weeklyPredictions = this.generateWeeklyPredictions(
      greenhouse, 
      cropModel, 
      environmentScore, 
      predictionPeriod
    );

    // 총 예상 수확량 계산
    const totalYield = weeklyPredictions.reduce((sum, week) => sum + week.yieldAmount, 0);
    
    // 품질 등급별 분포 예측
    const qualityDistribution = this.predictQualityDistribution(environmentScore, cropModel);

    return {
      greenhouse: greenhouse,
      cropModel: cropModel,
      totalYield: Math.round(totalYield * 10) / 10,
      yieldPerSqm: Math.round((totalYield / greenhouse.area) * 10) / 10,
      weeklyPredictions: weeklyPredictions,
      qualityDistribution: qualityDistribution,
      environmentScore: environmentScore,
      confidenceLevel: this.calculateConfidence(environmentScore, greenhouse.currentWeek),
      harvestSchedule: this.generateHarvestSchedule(weeklyPredictions),
      riskFactors: this.identifyRiskFactors(greenhouse, environmentScore)
    };
  }

  /**
   * 작물 모델 조회
   */
  getCropModel(cropType) {
    return CROP_YIELD_MODELS[cropType] || CROP_YIELD_MODELS.tomato;
  }

  /**
   * 환경 점수 계산
   */
  calculateEnvironmentScore(sensors, cropModel) {
    let totalScore = 0;
    let totalWeight = 0;

    Object.keys(cropModel.environmentFactors).forEach(factor => {
      const factorConfig = cropModel.environmentFactors[factor];
      const sensorValue = sensors[factor]?.current;
      
      if (sensorValue !== undefined) {
        const optimalRange = factorConfig.optimal;
        const weight = factorConfig.weight;
        
        let score = 0;
        if (sensorValue >= optimalRange[0] && sensorValue <= optimalRange[1]) {
          score = 100; // 최적 범위
        } else {
          // 최적 범위에서 벗어난 정도에 따라 점수 감소
          const deviation = Math.min(
            Math.abs(sensorValue - optimalRange[0]),
            Math.abs(sensorValue - optimalRange[1])
          );
          const maxDeviation = Math.max(
            optimalRange[0] * 0.3,
            optimalRange[1] * 0.3
          );
          score = Math.max(0, 100 - (deviation / maxDeviation) * 100);
        }
        
        totalScore += score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  /**
   * 주차별 수확량 예측 생성
   */
  generateWeeklyPredictions(greenhouse, cropModel, environmentScore, predictionPeriod) {
    const predictions = [];
    const startWeek = greenhouse.currentWeek;
    const endWeek = Math.min(52, startWeek + Math.ceil(predictionPeriod / 7));

    for (let week = startWeek; week <= endWeek; week++) {
      const weekPrediction = this.predictWeeklyYield(
        week, 
        greenhouse, 
        cropModel, 
        environmentScore
      );
      predictions.push(weekPrediction);
    }

    return predictions;
  }

  /**
   * 주간 수확량 예측
   */
  predictWeeklyYield(week, greenhouse, cropModel, environmentScore) {
    // 생육 단계별 수확량 곡선
    const harvestCurve = this.getHarvestCurve(week, cropModel);
    
    // 환경 영향 계수
    const environmentMultiplier = environmentScore / 100;
    
    // 계절적 영향
    const seasonalMultiplier = this.getSeasonalMultiplier(week);
    
    // 기본 주간 수확량 계산
    const baseWeeklyYield = (cropModel.baseYieldPerSqm * greenhouse.area) / 
                           (cropModel.harvestPeriod / 7); // 수확 기간을 주 단위로 나눔
    
    // 최종 수확량 = 기본량 × 수확곡선 × 환경영향 × 계절영향
    const weeklyYield = baseWeeklyYield * harvestCurve * environmentMultiplier * seasonalMultiplier;
    
    // 무작위 변동 (±10%)
    const randomVariation = 0.9 + (Math.random() * 0.2);
    
    return {
      week: week,
      date: this.getDateFromWeek(week),
      yieldAmount: Math.max(0, weeklyYield * randomVariation),
      harvestCurve: harvestCurve,
      environmentMultiplier: environmentMultiplier,
      seasonalMultiplier: seasonalMultiplier,
      stage: this.getGrowthStage(week),
      confidence: this.calculateWeeklyConfidence(week, environmentScore)
    };
  }

  /**
   * 수확 곡선 계산 (생육 주차별)
   */
  getHarvestCurve(week, cropModel) {
    const peakStart = cropModel.peakWeeks[0];
    const peakEnd = cropModel.peakWeeks[1];
    
    if (week < peakStart - 5) {
      return 0; // 수확 전
    } else if (week < peakStart) {
      // 수확 시작 (점진적 증가)
      return (week - (peakStart - 5)) / 5 * 0.3;
    } else if (week >= peakStart && week <= peakEnd) {
      // 최대 수확 기간 (종 모양 곡선)
      const progress = (week - peakStart) / (peakEnd - peakStart);
      return 0.3 + 0.7 * Math.sin(progress * Math.PI);
    } else if (week < peakEnd + 8) {
      // 수확 감소 (점진적 감소)
      return Math.max(0.1, 1 - ((week - peakEnd) / 8) * 0.9);
    } else {
      return 0; // 수확 종료
    }
  }

  /**
   * 계절적 영향 계수
   */
  getSeasonalMultiplier(week) {
    const month = Math.ceil(week / 4.33); // 주차를 월로 변환 (대략)
    
    // 계절별 수확량 영향
    const seasonalEffects = {
      1: 0.9, 2: 0.95, 3: 1.1, 4: 1.2, 5: 1.3, 6: 1.1,
      7: 0.9, 8: 0.8, 9: 0.9, 10: 1.0, 11: 1.1, 12: 1.0
    };
    
    return seasonalEffects[month] || 1.0;
  }

  /**
   * 품질 분포 예측
   */
  predictQualityDistribution(environmentScore, cropModel) {
    let premiumRatio = 0.3;
    let standardRatio = 0.5;
    let economyRatio = 0.2;

    // 환경 점수에 따른 품질 분포 조정
    if (environmentScore >= 90) {
      premiumRatio = 0.6;
      standardRatio = 0.35;
      economyRatio = 0.05;
    } else if (environmentScore >= 80) {
      premiumRatio = 0.45;
      standardRatio = 0.45;
      economyRatio = 0.1;
    } else if (environmentScore >= 70) {
      premiumRatio = 0.25;
      standardRatio = 0.55;
      economyRatio = 0.2;
    } else {
      premiumRatio = 0.1;
      standardRatio = 0.4;
      economyRatio = 0.5;
    }

    return {
      premium: Math.round(premiumRatio * 100),
      standard: Math.round(standardRatio * 100),
      economy: Math.round(economyRatio * 100)
    };
  }

  /**
   * 수확 일정 생성
   */
  generateHarvestSchedule(weeklyPredictions) {
    return weeklyPredictions
      .filter(week => week.yieldAmount > 0)
      .map(week => ({
        week: week.week,
        date: week.date,
        yieldAmount: Math.round(week.yieldAmount * 10) / 10,
        stage: week.stage,
        workload: this.calculateHarvestWorkload(week.yieldAmount),
        laborCost: this.calculateLaborCost(week.yieldAmount)
      }));
  }

  /**
   * 위험 요소 식별
   */
  identifyRiskFactors(greenhouse, environmentScore) {
    const risks = [];

    if (environmentScore < 70) {
      risks.push({
        type: 'environment',
        severity: 'high',
        description: '환경 조건 불량으로 수확량 감소 위험',
        impact: '예상 수확량 20-30% 감소'
      });
    }

    // 센서별 위험 요소 확인
    Object.keys(greenhouse.sensors).forEach(sensor => {
      const sensorData = greenhouse.sensors[sensor];
      if (sensorData.status === 'critical') {
        risks.push({
          type: 'sensor',
          severity: 'critical',
          description: `${sensor} 센서 위험 수준`,
          impact: '즉시 조치 필요, 작물 손실 위험'
        });
      }
    });

    // 생육 단계별 위험 요소
    const currentStage = this.getGrowthStage(greenhouse.currentWeek);
    if (currentStage === '개화기' && greenhouse.sensors.humidity?.current > 80) {
      risks.push({
        type: 'disease',
        severity: 'medium',
        description: '개화기 고습으로 인한 병해 위험',
        impact: '수분 불량 및 과실 품질 저하'
      });
    }

    return risks;
  }

  /**
   * 예측 신뢰도 계산
   */
  calculateConfidence(environmentScore, currentWeek) {
    let confidence = 0.8; // 기본 신뢰도

    // 환경 점수에 따른 신뢰도
    if (environmentScore >= 90) confidence += 0.15;
    else if (environmentScore >= 80) confidence += 0.1;
    else if (environmentScore >= 70) confidence += 0.05;
    else confidence -= 0.1;

    // 생육 단계에 따른 신뢰도 (수확기에 가까울수록 높음)
    if (currentWeek >= 30) confidence += 0.1;
    else if (currentWeek >= 20) confidence += 0.05;
    else if (currentWeek < 10) confidence -= 0.05;

    return Math.max(0.5, Math.min(0.95, confidence));
  }

  /**
   * 주간 예측 신뢰도
   */
  calculateWeeklyConfidence(week, environmentScore) {
    const baseConfidence = this.calculateConfidence(environmentScore, week);
    const weekDistance = Math.abs(week - new Date().getTime() / (7 * 24 * 60 * 60 * 1000));
    
    // 미래로 갈수록 신뢰도 감소
    return Math.max(0.3, baseConfidence - (weekDistance * 0.02));
  }

  /**
   * 수확 작업량 계산
   */
  calculateHarvestWorkload(yieldAmount) {
    // kg당 수확 시간 (분)
    const harvestTimePerKg = 8; // 평균 8분/kg
    const totalMinutes = yieldAmount * harvestTimePerKg;
    
    return {
      totalMinutes: Math.round(totalMinutes),
      hours: Math.round(totalMinutes / 60 * 10) / 10,
      workers: Math.ceil(totalMinutes / 480), // 8시간 기준 필요 인력
      difficulty: yieldAmount > 50 ? 'high' : yieldAmount > 20 ? 'medium' : 'low'
    };
  }

  /**
   * 인건비 계산
   */
  calculateLaborCost(yieldAmount) {
    const hourlyWage = 15000; // 시간당 임금
    const workload = this.calculateHarvestWorkload(yieldAmount);
    
    return {
      harvestCost: Math.round(workload.hours * hourlyWage),
      packagingCost: Math.round(yieldAmount * 500), // kg당 포장비
      totalLaborCost: Math.round((workload.hours * hourlyWage) + (yieldAmount * 500))
    };
  }

  /**
   * 생육 단계 조회
   */
  getGrowthStage(week) {
    const stages = ['정식기', '영양생장기', '화아분화기', '개화기', '결실기', '수확기'];
    const stageWeeks = [4, 12, 20, 28, 40, 52];
    
    for (let i = 0; i < stageWeeks.length; i++) {
      if (week <= stageWeeks[i]) {
        return stages[i];
      }
    }
    return stages[stages.length - 1];
  }

  /**
   * 주차를 날짜로 변환
   */
  getDateFromWeek(week) {
    const baseDate = new Date('2024-01-01'); // 재배 시작일 기준
    const targetDate = new Date(baseDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
    return targetDate.toISOString().split('T')[0];
  }

  /**
   * 기상 영향 초기화
   */
  initializeWeatherImpact() {
    return {
      drought: { yieldImpact: -0.3, qualityImpact: -0.2 },
      flood: { yieldImpact: -0.4, qualityImpact: -0.3 },
      heatwave: { yieldImpact: -0.2, qualityImpact: -0.4 },
      coldsnap: { yieldImpact: -0.5, qualityImpact: -0.1 },
      normal: { yieldImpact: 0, qualityImpact: 0 }
    };
  }
}

/**
 * 수익 예측 엔진
 */
export class RevenuePredictionEngine {
  constructor() {
    this.marketTrends = this.initializeMarketTrends();
    this.costStructure = this.initializeCostStructure();
  }

  /**
   * 하우스별 수익 예측
   */
  predictRevenue(yieldPrediction) {
    if (!yieldPrediction) return null;

    const greenhouse = yieldPrediction.greenhouse;
    const cropType = this.getCropTypeForPrice(greenhouse.crop);
    const priceData = MARKET_PRICE_DATA[cropType];

    // 월별 수익 예측
    const monthlyRevenue = this.calculateMonthlyRevenue(
      yieldPrediction.weeklyPredictions,
      yieldPrediction.qualityDistribution,
      priceData
    );

    // 비용 계산
    const costs = this.calculateTotalCosts(greenhouse, yieldPrediction);

    // 순수익 계산
    const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
    const totalCosts = costs.totalCost;
    const netProfit = totalRevenue - totalCosts;

    return {
      totalRevenue: Math.round(totalRevenue),
      totalCosts: Math.round(totalCosts),
      netProfit: Math.round(netProfit),
      profitMargin: totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100 * 10) / 10 : 0,
      monthlyRevenue: monthlyRevenue,
      costBreakdown: costs,
      roi: costs.totalCost > 0 ? Math.round((netProfit / costs.totalCost) * 100 * 10) / 10 : 0,
      breakEvenPoint: this.calculateBreakEvenPoint(costs, priceData),
      riskAdjustedProfit: this.calculateRiskAdjustedProfit(netProfit, yieldPrediction.riskFactors)
    };
  }

  /**
   * 월별 수익 계산
   */
  calculateMonthlyRevenue(weeklyPredictions, qualityDistribution, priceData) {
    const monthlyData = {};

    weeklyPredictions.forEach(week => {
      if (week.yieldAmount <= 0) return;

      const month = Math.ceil(week.week / 4.33);
      const monthKey = `2024-${month.toString().padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          totalYield: 0,
          revenue: 0,
          avgPrice: 0
        };
      }

      // 월별 가격 적용
      const monthlyMultiplier = priceData.monthlyMultiplier[month] || 1.0;
      const basePrice = priceData.basePrice * monthlyMultiplier;

      // 품질별 가격 계산
      const premiumPrice = basePrice * priceData.qualityPremium.premium;
      const standardPrice = basePrice * priceData.qualityPremium.standard;
      const economyPrice = basePrice * priceData.qualityPremium.economy;

      // 품질 분포에 따른 가중 평균 가격
      const avgPrice = (
        premiumPrice * (qualityDistribution.premium / 100) +
        standardPrice * (qualityDistribution.standard / 100) +
        economyPrice * (qualityDistribution.economy / 100)
      );

      const weeklyRevenue = week.yieldAmount * avgPrice;

      monthlyData[monthKey].totalYield += week.yieldAmount;
      monthlyData[monthKey].revenue += weeklyRevenue;
      monthlyData[monthKey].avgPrice = avgPrice;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * 총 비용 계산
   */
  calculateTotalCosts(greenhouse, yieldPrediction) {
    const area = greenhouse.area;
    const predictionPeriod = yieldPrediction.weeklyPredictions.length;

    // 고정비 (월별)
    const fixedCosts = {
      facilityMaintenance: area * 2000, // ㎡당 시설 유지비
      insurance: area * 500, // ㎡당 보험료
      utilities: area * 3000, // ㎡당 전기/수도료
      labor: 2000000 // 월 기본 인건비
    };

    // 변동비 (수확량 기준)
    const totalYield = yieldPrediction.totalYield;
    const variableCosts = {
      seeds: area * 5000, // ㎡당 종묘비
      fertilizer: totalYield * 800, // kg당 비료비
      pesticide: area * 8000, // ㎡당 방제비
      packaging: totalYield * 500, // kg당 포장비
      transportation: totalYield * 300, // kg당 운송비
      harvestLabor: yieldPrediction.harvestSchedule.reduce((sum, schedule) => 
        sum + schedule.laborCost.totalLaborCost, 0)
    };

    const monthlyFixedCost = Object.values(fixedCosts).reduce((sum, cost) => sum + cost, 0);
    const totalFixedCost = monthlyFixedCost * (predictionPeriod / 4); // 주를 월로 변환
    const totalVariableCost = Object.values(variableCosts).reduce((sum, cost) => sum + cost, 0);

    return {
      fixedCosts: fixedCosts,
      variableCosts: variableCosts,
      totalFixedCost: Math.round(totalFixedCost),
      totalVariableCost: Math.round(totalVariableCost),
      totalCost: Math.round(totalFixedCost + totalVariableCost),
      costPerKg: totalYield > 0 ? Math.round((totalFixedCost + totalVariableCost) / totalYield) : 0
    };
  }

  /**
   * 손익분기점 계산
   */
  calculateBreakEvenPoint(costs, priceData) {
    const avgPrice = priceData.basePrice * 1.2; // 평균 판매가
    const breakEvenYield = costs.totalCost / avgPrice;
    
    return {
      yieldAmount: Math.round(breakEvenYield * 10) / 10,
      revenue: costs.totalCost,
      description: `${Math.round(breakEvenYield)}kg 이상 수확 시 손익분기점 달성`
    };
  }

  /**
   * 위험 조정 수익 계산
   */
  calculateRiskAdjustedProfit(netProfit, riskFactors) {
    let riskDiscount = 1.0;

    riskFactors.forEach(risk => {
      switch (risk.severity) {
        case 'critical':
          riskDiscount *= 0.7; // 30% 할인
          break;
        case 'high':
          riskDiscount *= 0.85; // 15% 할인
          break;
        case 'medium':
          riskDiscount *= 0.95; // 5% 할인
          break;
      }
    });

    return {
      adjustedProfit: Math.round(netProfit * riskDiscount),
      riskDiscount: Math.round((1 - riskDiscount) * 100),
      confidence: riskDiscount > 0.9 ? 'high' : riskDiscount > 0.8 ? 'medium' : 'low'
    };
  }

  /**
   * 가격용 작물 타입 변환
   */
  getCropTypeForPrice(crop) {
    if (crop.includes('tomato')) return 'tomato';
    if (crop.includes('strawberry')) return 'strawberry';
    if (crop.includes('herbs')) return 'herbs';
    return 'tomato';
  }

  /**
   * 시장 트렌드 초기화
   */
  initializeMarketTrends() {
    return {
      tomato: { trend: 'stable', volatility: 0.15 },
      strawberry: { trend: 'increasing', volatility: 0.25 },
      herbs: { trend: 'increasing', volatility: 0.20 }
    };
  }

  /**
   * 비용 구조 초기화
   */
  initializeCostStructure() {
    return {
      laborRatio: 0.4, // 총 비용 중 인건비 비율
      materialRatio: 0.3, // 자재비 비율
      utilityRatio: 0.2, // 유지비 비율
      otherRatio: 0.1 // 기타 비용 비율
    };
  }
}

/**
 * 통합 예측 시스템
 */
export class IntegratedYieldRevenuePrediction {
  constructor() {
    this.yieldEngine = new YieldPredictionEngine();
    this.revenueEngine = new RevenuePredictionEngine();
  }

  /**
   * 하우스별 종합 예측
   */
  generateCompletePrediction(greenhouseId) {
    // 수확량 예측
    const yieldPrediction = this.yieldEngine.predictYield(greenhouseId);
    if (!yieldPrediction) return null;

    // 수익 예측
    const revenuePrediction = this.revenueEngine.predictRevenue(yieldPrediction);

    // 시나리오별 예측
    const scenarios = this.generateScenarioPredictions(greenhouseId);

    return {
      greenhouse: yieldPrediction.greenhouse,
      yield: yieldPrediction,
      revenue: revenuePrediction,
      scenarios: scenarios,
      summary: {
        expectedYield: yieldPrediction.totalYield,
        expectedRevenue: revenuePrediction.totalRevenue,
        expectedProfit: revenuePrediction.netProfit,
        profitMargin: revenuePrediction.profitMargin,
        roi: revenuePrediction.roi,
        confidence: yieldPrediction.confidenceLevel,
        riskLevel: this.assessOverallRisk(yieldPrediction.riskFactors)
      }
    };
  }

  /**
   * 시나리오별 예측
   */
  generateScenarioPredictions(greenhouseId) {
    const scenarios = ['optimistic', 'realistic', 'pessimistic'];
    const predictions = {};

    scenarios.forEach(scenario => {
      const modifier = this.getScenarioModifier(scenario);
      const basePrediction = this.yieldEngine.predictYield(greenhouseId);
      
      if (basePrediction) {
        // 시나리오별 수정된 예측
        const modifiedYield = basePrediction.totalYield * modifier.yieldMultiplier;
        const modifiedRevenue = this.revenueEngine.predictRevenue({
          ...basePrediction,
          totalYield: modifiedYield
        });

        predictions[scenario] = {
          name: scenario === 'optimistic' ? '낙관적' : scenario === 'realistic' ? '현실적' : '비관적',
          yieldAmount: Math.round(modifiedYield * 10) / 10,
          revenue: modifiedRevenue ? Math.round(modifiedRevenue.totalRevenue) : 0,
          profit: modifiedRevenue ? Math.round(modifiedRevenue.netProfit) : 0,
          probability: modifier.probability,
          description: modifier.description
        };
      }
    });

    return predictions;
  }

  /**
   * 시나리오별 수정 계수
   */
  getScenarioModifier(scenario) {
    const modifiers = {
      optimistic: {
        yieldMultiplier: 1.25,
        probability: 0.2,
        description: '모든 조건이 최적일 때의 예상 수확량'
      },
      realistic: {
        yieldMultiplier: 1.0,
        probability: 0.6,
        description: '현재 조건이 유지될 때의 예상 수확량'
      },
      pessimistic: {
        yieldMultiplier: 0.75,
        probability: 0.2,
        description: '불리한 조건이 발생할 때의 예상 수확량'
      }
    };

    return modifiers[scenario] || modifiers.realistic;
  }

  /**
   * 전체 위험도 평가
   */
  assessOverallRisk(riskFactors) {
    if (riskFactors.length === 0) return 'low';
    
    const hasCritical = riskFactors.some(risk => risk.severity === 'critical');
    const hasHigh = riskFactors.some(risk => risk.severity === 'high');
    
    if (hasCritical) return 'critical';
    if (hasHigh) return 'high';
    if (riskFactors.length > 2) return 'medium';
    return 'low';
  }
}

/**
 * 전체 농장 수익 예측 (농장주용)
 */
export const predictFarmTotalRevenue = () => {
  const predictionEngine = new IntegratedYieldRevenuePrediction();
  const farmPredictions = {};
  let totalYield = 0;
  let totalRevenue = 0;
  let totalProfit = 0;

  Object.keys(GREENHOUSE_DATA).forEach(greenhouseId => {
    const prediction = predictionEngine.generateCompletePrediction(greenhouseId);
    if (prediction) {
      farmPredictions[greenhouseId] = prediction;
      totalYield += prediction.summary.expectedYield;
      totalRevenue += prediction.summary.expectedRevenue;
      totalProfit += prediction.summary.expectedProfit;
    }
  });

  return {
    farmPredictions: farmPredictions,
    farmSummary: {
      totalYield: Math.round(totalYield * 10) / 10,
      totalRevenue: Math.round(totalRevenue),
      totalProfit: Math.round(totalProfit),
      avgProfitMargin: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100 * 10) / 10 : 0,
      bestPerforming: findBestPerformingGreenhouse(farmPredictions),
      worstPerforming: findWorstPerformingGreenhouse(farmPredictions)
    }
  };
};

/**
 * 최고/최저 성과 하우스 찾기
 */
export const findBestPerformingGreenhouse = (predictions) => {
  let bestGreenhouse = null;
  let bestROI = -Infinity;

  Object.keys(predictions).forEach(greenhouseId => {
    const prediction = predictions[greenhouseId];
    if (prediction.revenue.roi > bestROI) {
      bestROI = prediction.revenue.roi;
      bestGreenhouse = {
        id: greenhouseId,
        name: prediction.greenhouse.name,
        roi: bestROI,
        profit: prediction.summary.expectedProfit
      };
    }
  });

  return bestGreenhouse;
};

export const findWorstPerformingGreenhouse = (predictions) => {
  let worstGreenhouse = null;
  let worstROI = Infinity;

  Object.keys(predictions).forEach(greenhouseId => {
    const prediction = predictions[greenhouseId];
    if (prediction.revenue.roi < worstROI) {
      worstROI = prediction.revenue.roi;
      worstGreenhouse = {
        id: greenhouseId,
        name: prediction.greenhouse.name,
        roi: worstROI,
        profit: prediction.summary.expectedProfit
      };
    }
  });

  return worstGreenhouse;
};

// 개별 온실 수확량 예측
export const predictGreenhouseYield = (greenhouseId) => {
  const yieldEngine = new YieldPredictionEngine();
  const revenueEngine = new RevenuePredictionEngine();
  
  // 기본 예측 데이터 생성
  const baseYield = Math.floor(Math.random() * 500) + 300; // 300-800kg
  const baseRevenue = Math.floor(Math.random() * 3000000) + 2000000; // 200만-500만원
  
  return {
    expectedYield: baseYield,
    expectedRevenue: baseRevenue,
    quality: Math.floor(Math.random() * 20) + 80, // 80-100점
    harvestDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // 30일 내
    confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
  };
};
