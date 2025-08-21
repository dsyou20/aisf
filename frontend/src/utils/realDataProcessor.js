/**
 * 실제 엑셀 데이터 처리 및 보간 통합 모듈
 */
import { FARM_CODES } from './dataProcessor';
import { 
  readExcelFile, 
  worksheetToJson, 
  parseEnvironmentData,
  parseGrowthData,
  parseManagementData,
  parseControlData,
  interpolateMultipleFields,
  analyzeDataQuality,
  detectAndHandleOutliers
} from './excelReader';

// 실제 엑셀 파일이 있는지 확인하고 없으면 가상 데이터 사용
let USE_REAL_DATA = false;

/**
 * 실제 엑셀 데이터 로딩 및 처리
 */
export const loadRealExcelData = async (filters = {}) => {
  const {
    farmCodes = Object.keys(FARM_CODES),
    startDate = '2020-01-01',
    endDate = '2021-12-31',
    dataTypes = ['environment', 'growth', 'management', 'control'],
    interpolationMethod = 'linear',
    handleOutliers = true
  } = filters;

  const result = {};
  
  for (const farmCode of farmCodes) {
    if (!FARM_CODES[farmCode]) continue;
    
    const farmInfo = FARM_CODES[farmCode];
    result[farmCode] = {};
    
    // 각 데이터 타입별로 처리
    for (const dataType of dataTypes) {
      try {
        const data = await loadAndProcessDataType(farmCode, farmInfo, dataType, {
          startDate,
          endDate,
          interpolationMethod,
          handleOutliers
        });
        
        result[farmCode][dataType] = data;
      } catch (error) {
        console.warn(`${farmCode}의 ${dataType} 데이터 로딩 실패:`, error);
        // 실패시 빈 배열 반환
        result[farmCode][dataType] = [];
      }
    }
  }
  
  return result;
};

/**
 * 특정 농장의 특정 데이터 타입 로딩 및 처리
 */
const loadAndProcessDataType = async (farmCode, farmInfo, dataType, options) => {
  const { startDate, endDate, interpolationMethod, handleOutliers } = options;
  
  // 실제 엑셀 파일 경로 생성
  const filePath = getExcelFilePath(farmCode, dataType);
  
  if (!filePath) {
    console.warn(`${farmCode}의 ${dataType} 파일 경로를 찾을 수 없습니다.`);
    return [];
  }
  
  // 엑셀 파일 읽기 시도
  const workbook = await readExcelFile(filePath);
  
  if (!workbook) {
    console.warn(`${farmCode}의 ${dataType} 엑셀 파일을 읽을 수 없습니다: ${filePath}`);
    return [];
  }
  
  // 첫 번째 시트 가져오기
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  if (!worksheet) {
    console.warn(`${farmCode}의 ${dataType} 워크시트를 찾을 수 없습니다.`);
    return [];
  }
  
  // 워크시트를 JSON으로 변환
  const rawData = worksheetToJson(worksheet, {
    header: 1, // 첫 번째 행을 헤더로 사용
    defval: null // 빈 셀은 null로
  });
  
  if (rawData.length === 0) {
    console.warn(`${farmCode}의 ${dataType} 데이터가 비어있습니다.`);
    return [];
  }
  
  // 데이터 타입별 파싱
  let parsedData = [];
  
  switch (dataType) {
    case 'environment':
      parsedData = parseEnvironmentData(rawData, farmCode, farmInfo);
      break;
    case 'growth':
      parsedData = parseGrowthData(rawData, farmCode, farmInfo);
      break;
    case 'management':
      parsedData = parseManagementData(rawData, farmCode, farmInfo);
      break;
    case 'control':
      parsedData = parseControlData(rawData, farmCode, farmInfo);
      break;
    default:
      console.warn(`알 수 없는 데이터 타입: ${dataType}`);
      return [];
  }
  
  // 날짜 범위 필터링
  const filteredData = filterByDateRange(parsedData, startDate, endDate);
  
  if (filteredData.length === 0) {
    console.warn(`${farmCode}의 ${dataType} 데이터가 날짜 범위 필터 후 비어있습니다.`);
    return [];
  }
  
  // 데이터 품질 분석
  const qualityAnalysis = analyzeDataQuality(filteredData, getFieldsForDataType(dataType));
  console.log(`${farmCode} ${dataType} 데이터 품질:`, qualityAnalysis);
  
  // 데이터 보간
  const interpolatedData = performInterpolation(filteredData, dataType, interpolationMethod);
  
  // 이상치 처리
  let finalData = interpolatedData;
  if (handleOutliers) {
    finalData = performOutlierHandling(interpolatedData, dataType);
  }
  
  // 날짜순 정렬
  finalData.sort((a, b) => {
    const dateA = new Date(a.datetime || a.date);
    const dateB = new Date(b.datetime || b.date);
    return dateA - dateB;
  });
  
  console.log(`${farmCode} ${dataType} 최종 데이터 개수: ${finalData.length}`);
  
  return finalData;
};

/**
 * 엑셀 파일 경로 생성
 */
const getExcelFilePath = (farmCode, dataType) => {
  // 실제 파일 경로 매핑
  const fileMapping = {
    'PF_0021128': {
      environment: '/api/excel/2020_딸기_대구_PF_0021128_01/시설원예_시간기준_환경정보_2025.08.21.xlsx',
      growth: '/api/excel/2020_딸기_대구_PF_0021128_01/시설원예_생육정보_2025.08.21.xlsx',
      management: '/api/excel/2020_딸기_대구_PF_0021128_01/시설원예_경영정보_출하량_2025.08.21.xlsx',
      control: '/api/excel/2020_딸기_대구_PF_0021128_01/시설원예_시간기준_제어정보_2025.08.21.xlsx'
    },
    'PF_0010052': {
      environment: '/api/excel/2020_딸기_전남_PF_0010052_01/시설원예_시간기준_환경정보_2025.08.21.xlsx',
      growth: '/api/excel/2020_딸기_전남_PF_0010052_01/시설원예_생육정보_2025.08.21.xlsx',
      management: '/api/excel/2020_딸기_전남_PF_0010052_01/시설원예_경영정보_출하량_2025.08.21.xlsx',
      control: '/api/excel/2020_딸기_전남_PF_0010052_01/시설원예_시간기준_제어정보_2025.08.21.xlsx'
    }
    // 다른 농장들도 추가...
  };
  
  return fileMapping[farmCode]?.[dataType] || null;
};

/**
 * 날짜 범위 필터링
 */
const filterByDateRange = (data, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return data.filter(item => {
    const itemDate = new Date(item.datetime || item.date);
    return itemDate >= start && itemDate <= end;
  });
};

/**
 * 데이터 타입별 필드 목록 반환
 */
const getFieldsForDataType = (dataType) => {
  const fieldMapping = {
    environment: ['temperature', 'humidity', 'co2', 'lightIntensity', 'soilMoisture', 'ph'],
    growth: ['plantHeight', 'leafLength', 'leafWidth', 'stemDiameter', 'fruitCount', 'fruitWeight', 'healthScore'],
    management: ['yieldAmount', 'revenue', 'cost', 'profit', 'pricePerKg', 'efficiency'],
    control: ['heatingSetpoint', 'ventilationRate']
  };
  
  return fieldMapping[dataType] || [];
};

/**
 * 데이터 보간 수행
 */
const performInterpolation = (data, dataType, method) => {
  const fields = getFieldsForDataType(dataType);
  const numericFields = fields.filter(field => 
    field !== 'growthStage' && !field.includes('Status')
  );
  
  return interpolateMultipleFields(data, numericFields, method);
};

/**
 * 이상치 처리 수행
 */
const performOutlierHandling = (data, dataType) => {
  const fields = getFieldsForDataType(dataType);
  const numericFields = fields.filter(field => 
    field !== 'growthStage' && !field.includes('Status')
  );
  
  let result = data;
  
  numericFields.forEach(field => {
    result = detectAndHandleOutliers(result, field, 'iqr', 'cap');
  });
  
  return result;
};

/**
 * 실제 데이터와 가상 데이터 통합 로더
 */
export const loadIntegratedData = async (filters = {}) => {
  try {
    // 실제 데이터 로딩 시도
    console.log('실제 엑셀 데이터 로딩 시도...');
    const realData = await loadRealExcelData(filters);
    
    // 실제 데이터가 있는지 확인
    const hasRealData = Object.values(realData).some(farmData => 
      Object.values(farmData).some(typeData => typeData.length > 0)
    );
    
    if (hasRealData) {
      console.log('실제 엑셀 데이터 사용');
      USE_REAL_DATA = true;
      return realData;
    } else {
      console.log('실제 엑셀 데이터가 없어 가상 데이터 사용');
      USE_REAL_DATA = false;
      // 가상 데이터 생성 (기존 함수 사용)
      const { generateIntegratedData } = await import('./dataProcessor');
      return generateIntegratedData(filters);
    }
  } catch (error) {
    console.error('데이터 로딩 중 오류 발생:', error);
    console.log('오류로 인해 가상 데이터 사용');
    USE_REAL_DATA = false;
    // 가상 데이터 생성 (기존 함수 사용)
    const { generateIntegratedData } = await import('./dataProcessor');
    return generateIntegratedData(filters);
  }
};

/**
 * 현재 사용 중인 데이터 타입 확인
 */
export const isUsingRealData = () => USE_REAL_DATA;

/**
 * 데이터 통계 정보 생성
 */
export const generateDataStatistics = (data) => {
  const stats = {
    totalRecords: 0,
    dataTypes: {},
    farms: {},
    dateRange: {
      start: null,
      end: null
    },
    dataQuality: {}
  };
  
  Object.keys(data).forEach(farmCode => {
    const farmData = data[farmCode];
    stats.farms[farmCode] = {
      name: FARM_CODES[farmCode]?.name || farmCode,
      totalRecords: 0,
      dataTypes: {}
    };
    
    Object.keys(farmData).forEach(dataType => {
      const typeData = farmData[dataType];
      const recordCount = typeData.length;
      
      stats.totalRecords += recordCount;
      stats.farms[farmCode].totalRecords += recordCount;
      stats.farms[farmCode].dataTypes[dataType] = recordCount;
      
      if (!stats.dataTypes[dataType]) {
        stats.dataTypes[dataType] = 0;
      }
      stats.dataTypes[dataType] += recordCount;
      
      // 날짜 범위 계산
      if (recordCount > 0) {
        const dates = typeData.map(item => new Date(item.datetime || item.date)).sort();
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        
        if (!stats.dateRange.start || firstDate < stats.dateRange.start) {
          stats.dateRange.start = firstDate;
        }
        if (!stats.dateRange.end || lastDate > stats.dateRange.end) {
          stats.dateRange.end = lastDate;
        }
      }
    });
  });
  
  return stats;
};

/**
 * 데이터 보간 보고서 생성
 */
export const generateInterpolationReport = (originalData, interpolatedData) => {
  const report = {
    summary: {
      originalRecords: 0,
      interpolatedRecords: 0,
      interpolationRate: 0
    },
    byField: {}
  };
  
  // 필드별 보간 통계 계산 로직
  // (구현 복잡도로 인해 기본 구조만 제공)
  
  return report;
};
