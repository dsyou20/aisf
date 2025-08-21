/**
 * 실제 엑셀 데이터 읽기 및 보간 처리
 */
import * as XLSX from 'xlsx';

// 엑셀 파일 경로 매핑 (실제 서버에서는 API로 처리)
const EXCEL_FILES = {
  // 2020년 데이터
  'PF_0021128_2020_environment': '/resources/2020_딸기_대구_PF_0021128_01/시설원예_시간기준_환경정보_2025.08.21.xlsx',
  'PF_0021128_2020_growth': '/resources/2020_딸기_대구_PF_0021128_01/시설원예_생육정보_2025.08.21.xlsx',
  'PF_0021128_2020_management': '/resources/2020_딸기_대구_PF_0021128_01/시설원예_경영정보_출하량_2025.08.21.xlsx',
  'PF_0021128_2020_control': '/resources/2020_딸기_대구_PF_0021128_01/시설원예_시간기준_제어정보_2025.08.21.xlsx',
  
  'PF_0010052_2020_environment': '/resources/2020_딸기_전남_PF_0010052_01/시설원예_시간기준_환경정보_2025.08.21.xlsx',
  'PF_0010052_2020_growth': '/resources/2020_딸기_전남_PF_0010052_01/시설원예_생육정보_2025.08.21.xlsx',
  'PF_0010052_2020_management': '/resources/2020_딸기_전남_PF_0010052_01/시설원예_경영정보_출하량_2025.08.21.xlsx',
  'PF_0010052_2020_control': '/resources/2020_딸기_전남_PF_0010052_01/시설원예_시간기준_제어정보_2025.08.21.xlsx',
  
  // 2021년 데이터 등...
};

/**
 * 엑셀 파일 읽기 (브라우저 환경에서는 fetch 사용)
 */
export const readExcelFile = async (filePath) => {
  try {
    // 실제 환경에서는 API 엔드포인트로 요청
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    return workbook;
  } catch (error) {
    console.warn(`엑셀 파일 읽기 실패: ${filePath}`, error);
    return null;
  }
};

/**
 * 워크시트를 JSON으로 변환
 */
export const worksheetToJson = (worksheet, options = {}) => {
  if (!worksheet) return [];
  
  const {
    header = 1,
    range,
    defval = null,
    blankrows = true
  } = options;
  
  return XLSX.utils.sheet_to_json(worksheet, {
    header,
    range,
    defval,
    blankrows
  });
};

/**
 * 환경 데이터 파싱 및 정제
 */
export const parseEnvironmentData = (rawData, farmCode, farmInfo) => {
  if (!rawData || rawData.length === 0) return [];
  
  return rawData.map(row => {
    // 엑셀 컬럼명은 실제 파일에 따라 조정 필요
    const datetime = parseExcelDate(row['일시'] || row['날짜'] || row['Date'] || row['DateTime']);
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      datetime: datetime ? datetime.toISOString() : null,
      date: datetime ? datetime.toISOString().split('T')[0] : null,
      time: datetime ? datetime.toTimeString().split(' ')[0] : null,
      temperature: parseFloat(row['온도'] || row['Temperature'] || row['내부온도']) || null,
      humidity: parseFloat(row['습도'] || row['Humidity'] || row['내부습도']) || null,
      co2: parseFloat(row['CO2'] || row['이산화탄소'] || row['CO2농도']) || null,
      lightIntensity: parseFloat(row['조도'] || row['광량'] || row['Light']) || null,
      soilMoisture: parseFloat(row['토양수분'] || row['SoilMoisture']) || null,
      ph: parseFloat(row['pH'] || row['산도']) || null
    };
  }).filter(item => item.datetime); // 유효한 날짜가 있는 데이터만
};

/**
 * 생육 데이터 파싱 및 정제
 */
export const parseGrowthData = (rawData, farmCode, farmInfo) => {
  if (!rawData || rawData.length === 0) return [];
  
  return rawData.map(row => {
    const date = parseExcelDate(row['조사일'] || row['날짜'] || row['Date']);
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      date: date ? date.toISOString().split('T')[0] : null,
      plantHeight: parseFloat(row['초장'] || row['PlantHeight'] || row['식물높이']) || null,
      leafLength: parseFloat(row['엽장'] || row['LeafLength'] || row['잎길이']) || null,
      leafWidth: parseFloat(row['엽폭'] || row['LeafWidth'] || row['잎너비']) || null,
      stemDiameter: parseFloat(row['경경'] || row['StemDiameter'] || row['줄기직경']) || null,
      fruitCount: parseInt(row['과실수'] || row['FruitCount'] || row['열매수']) || null,
      fruitWeight: parseFloat(row['과중'] || row['FruitWeight'] || row['열매무게']) || null,
      healthScore: parseFloat(row['건강도'] || row['HealthScore']) || null,
      growthStage: row['생육단계'] || row['GrowthStage'] || '알 수 없음'
    };
  }).filter(item => item.date);
};

/**
 * 경영 데이터 파싱 및 정제
 */
export const parseManagementData = (rawData, farmCode, farmInfo) => {
  if (!rawData || rawData.length === 0) return [];
  
  return rawData.map(row => {
    const date = parseExcelDate(row['출하일'] || row['날짜'] || row['Date']);
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      date: date ? date.toISOString().split('T')[0] : null,
      yieldAmount: parseFloat(row['출하량'] || row['수확량'] || row['YieldAmount']) || null,
      revenue: parseFloat(row['매출'] || row['Revenue'] || row['판매금액']) || null,
      cost: parseFloat(row['비용'] || row['Cost'] || row['생산비용']) || null,
      profit: parseFloat(row['수익'] || row['Profit'] || row['순수익']) || null,
      pricePerKg: parseFloat(row['단가'] || row['PricePerKg'] || row['kg당가격']) || null,
      efficiency: parseFloat(row['효율성'] || row['Efficiency']) || null
    };
  }).filter(item => item.date);
};

/**
 * 제어 데이터 파싱 및 정제
 */
export const parseControlData = (rawData, farmCode, farmInfo) => {
  if (!rawData || rawData.length === 0) return [];
  
  return rawData.map(row => {
    const datetime = parseExcelDate(row['일시'] || row['날짜'] || row['Date'] || row['DateTime']);
    
    return {
      farmCode,
      farmName: farmInfo.name,
      region: farmInfo.region,
      datetime: datetime ? datetime.toISOString() : null,
      date: datetime ? datetime.toISOString().split('T')[0] : null,
      time: datetime ? datetime.toTimeString().split(' ')[0] : null,
      heatingStatus: parseBooleanValue(row['난방상태'] || row['HeatingStatus']),
      ventilationStatus: parseBooleanValue(row['환기상태'] || row['VentilationStatus']),
      irrigationStatus: parseBooleanValue(row['관수상태'] || row['IrrigationStatus']),
      lightingStatus: parseBooleanValue(row['조명상태'] || row['LightingStatus']),
      heatingSetpoint: parseFloat(row['난방설정온도'] || row['HeatingSetpoint']) || null,
      ventilationRate: parseFloat(row['환기율'] || row['VentilationRate']) || null
    };
  }).filter(item => item.datetime);
};

/**
 * 엑셀 날짜 파싱
 */
const parseExcelDate = (dateValue) => {
  if (!dateValue) return null;
  
  // 엑셀 시리얼 날짜인 경우
  if (typeof dateValue === 'number') {
    return XLSX.SSF.parse_date_code(dateValue);
  }
  
  // 문자열 날짜인 경우
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  // Date 객체인 경우
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  return null;
};

/**
 * 불린 값 파싱
 */
const parseBooleanValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === '1' || lower === 'on' || lower === '켜짐';
  }
  return false;
};

/**
 * 데이터 보간 (Linear Interpolation)
 */
export const interpolateData = (data, field, method = 'linear') => {
  if (!data || data.length === 0) return data;
  
  const result = [...data];
  
  // null 값의 인덱스 찾기
  const nullIndices = [];
  result.forEach((item, index) => {
    if (item[field] === null || item[field] === undefined) {
      nullIndices.push(index);
    }
  });
  
  if (nullIndices.length === 0) return result;
  
  // 선형 보간
  if (method === 'linear') {
    nullIndices.forEach(nullIndex => {
      const prevValidIndex = findPreviousValidIndex(result, nullIndex, field);
      const nextValidIndex = findNextValidIndex(result, nullIndex, field);
      
      if (prevValidIndex !== -1 && nextValidIndex !== -1) {
        const prevValue = result[prevValidIndex][field];
        const nextValue = result[nextValidIndex][field];
        const ratio = (nullIndex - prevValidIndex) / (nextValidIndex - prevValidIndex);
        
        result[nullIndex][field] = prevValue + (nextValue - prevValue) * ratio;
      } else if (prevValidIndex !== -1) {
        // 앞의 값으로 채우기
        result[nullIndex][field] = result[prevValidIndex][field];
      } else if (nextValidIndex !== -1) {
        // 뒤의 값으로 채우기
        result[nullIndex][field] = result[nextValidIndex][field];
      }
    });
  }
  
  // 이동 평균 보간
  else if (method === 'moving_average') {
    const windowSize = 5; // 이동 평균 윈도우 크기
    
    nullIndices.forEach(nullIndex => {
      const values = [];
      const start = Math.max(0, nullIndex - Math.floor(windowSize / 2));
      const end = Math.min(result.length, nullIndex + Math.floor(windowSize / 2) + 1);
      
      for (let i = start; i < end; i++) {
        if (i !== nullIndex && result[i][field] !== null && result[i][field] !== undefined) {
          values.push(result[i][field]);
        }
      }
      
      if (values.length > 0) {
        result[nullIndex][field] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });
  }
  
  return result;
};

/**
 * 이전 유효한 값의 인덱스 찾기
 */
const findPreviousValidIndex = (data, currentIndex, field) => {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (data[i][field] !== null && data[i][field] !== undefined) {
      return i;
    }
  }
  return -1;
};

/**
 * 다음 유효한 값의 인덱스 찾기
 */
const findNextValidIndex = (data, currentIndex, field) => {
  for (let i = currentIndex + 1; i < data.length; i++) {
    if (data[i][field] !== null && data[i][field] !== undefined) {
      return i;
    }
  }
  return -1;
};

/**
 * 다중 필드 보간
 */
export const interpolateMultipleFields = (data, fields, method = 'linear') => {
  let result = data;
  
  fields.forEach(field => {
    result = interpolateData(result, field, method);
  });
  
  return result;
};

/**
 * 데이터 품질 분석
 */
export const analyzeDataQuality = (data, fields) => {
  if (!data || data.length === 0) return {};
  
  const analysis = {};
  
  fields.forEach(field => {
    const values = data.map(item => item[field]).filter(val => val !== null && val !== undefined);
    const totalCount = data.length;
    const validCount = values.length;
    const missingCount = totalCount - validCount;
    const missingRate = (missingCount / totalCount) * 100;
    
    analysis[field] = {
      totalCount,
      validCount,
      missingCount,
      missingRate: Math.round(missingRate * 100) / 100,
      completeness: Math.round(((validCount / totalCount) * 100) * 100) / 100
    };
  });
  
  return analysis;
};

/**
 * 이상치 탐지 및 처리
 */
export const detectAndHandleOutliers = (data, field, method = 'iqr', action = 'flag') => {
  const values = data.map(item => item[field]).filter(val => val !== null && val !== undefined);
  if (values.length === 0) return data;
  
  let outlierIndices = [];
  
  if (method === 'iqr') {
    // IQR 방법
    values.sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    data.forEach((item, index) => {
      const value = item[field];
      if (value !== null && value !== undefined && (value < lowerBound || value > upperBound)) {
        outlierIndices.push(index);
      }
    });
  }
  
  // 이상치 처리
  const result = [...data];
  if (action === 'remove') {
    // 이상치 제거
    return result.filter((_, index) => !outlierIndices.includes(index));
  } else if (action === 'cap') {
    // 이상치 캡핑
    const median = values[Math.floor(values.length / 2)];
    outlierIndices.forEach(index => {
      result[index][field] = median;
    });
  } else if (action === 'flag') {
    // 이상치 플래그만 추가
    outlierIndices.forEach(index => {
      result[index][`${field}_outlier`] = true;
    });
  }
  
  return result;
};
