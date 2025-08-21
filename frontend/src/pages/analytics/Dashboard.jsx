import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker, 
  Tabs, 
  Button,
  Space,
  Typography,
  Spin
} from 'antd';
import {
  LineChart,
  Line,
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  DashboardOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  FARM_CODES, 
  exportToCSV 
} from '../../utils/dataProcessor';
import { 
  loadIntegratedData, 
  isUsingRealData,
  generateDataStatistics 
} from '../../utils/realDataProcessor';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFarms, setSelectedFarms] = useState(['PF_0021128', 'PF_0010052']);
  const [dateRange, setDateRange] = useState([
    dayjs('2020-01-01'),
    dayjs('2020-12-31')
  ]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [kpiData, setKpiData] = useState({});
  const [activeTab, setActiveTab] = useState('environment');

  // 데이터 로딩
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedFarms, dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      console.log('데이터 로딩 시작:', { selectedFarms, startDate, endDate });
      
      const data = await loadIntegratedData({
        farmCodes: selectedFarms,
        startDate,
        endDate,
        dataTypes: ['environment', 'growth', 'management', 'control'],
        interpolationMethod: 'linear',
        handleOutliers: true
      });
      
      console.log('로딩된 데이터:', data);
      console.log('실제 데이터 사용 여부:', isUsingRealData());
      
      // 데이터 통계 생성
      const stats = generateDataStatistics(data);
      console.log('데이터 통계:', stats);
      
      setAnalyticsData(data);
      calculateKPIs(data);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // KPI 계산
  const calculateKPIs = (data) => {
    let totalYield = 0;
    let totalRevenue = 0;
    let totalCost = 0;
    let avgTemperature = 0;
    let avgHumidity = 0;
    let healthScores = [];
    let farmCount = 0;

    Object.keys(data).forEach(farmCode => {
      const farmData = data[farmCode];
      farmCount++;

      // 경영 데이터 집계
      if (farmData.management && farmData.management.length > 0) {
        const lastManagementData = farmData.management[farmData.management.length - 1];
        totalYield += lastManagementData.cumulativeYield || 0;
        totalRevenue += lastManagementData.cumulativeRevenue || 0;
        totalCost += lastManagementData.cumulativeCost || 0;
      }

      // 환경 데이터 평균
      if (farmData.environment && farmData.environment.length > 0) {
        const envAvg = farmData.environment.reduce((acc, curr) => ({
          temperature: acc.temperature + curr.temperature,
          humidity: acc.humidity + curr.humidity
        }), { temperature: 0, humidity: 0 });
        
        avgTemperature += envAvg.temperature / farmData.environment.length;
        avgHumidity += envAvg.humidity / farmData.environment.length;
      }

      // 생육 데이터 건강도
      if (farmData.growth && farmData.growth.length > 0) {
        farmData.growth.forEach(g => healthScores.push(g.healthScore));
      }
    });

    const avgHealthScore = healthScores.length > 0 
      ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length 
      : 0;

    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    setKpiData({
      totalYield: Math.round(totalYield * 10) / 10,
      totalRevenue: Math.round(totalRevenue),
      totalCost: Math.round(totalCost),
      profit: Math.round(profit),
      profitMargin: Math.round(profitMargin * 10) / 10,
      avgTemperature: Math.round((avgTemperature / farmCount) * 10) / 10,
      avgHumidity: Math.round((avgHumidity / farmCount) * 10) / 10,
      avgHealthScore: Math.round(avgHealthScore * 10) / 10,
      activeFarms: farmCount
    });
  };

  // 환경 분석 컴포넌트
  const EnvironmentAnalysis = () => {
    const environmentChartData = [];
    
    // 시간별 환경 데이터 집계
    const timeMap = new Map();
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      if (farmData.environment) {
        farmData.environment.forEach(env => {
          const timeKey = env.date;
          if (!timeMap.has(timeKey)) {
            timeMap.set(timeKey, { 
              date: timeKey, 
              temperature: [], 
              humidity: [], 
              co2: [],
              farms: []
            });
          }
          const timeData = timeMap.get(timeKey);
          timeData.temperature.push(env.temperature);
          timeData.humidity.push(env.humidity);
          timeData.co2.push(env.co2);
          timeData.farms.push(FARM_CODES[farmCode].name);
        });
      }
    });

    // 일별 평균 계산
    Array.from(timeMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 30) // 최근 30일만 표시
      .forEach(timeData => {
        environmentChartData.push({
          date: timeData.date,
          temperature: Math.round(timeData.temperature.reduce((a, b) => a + b, 0) / timeData.temperature.length * 10) / 10,
          humidity: Math.round(timeData.humidity.reduce((a, b) => a + b, 0) / timeData.humidity.length * 10) / 10,
          co2: Math.round(timeData.co2.reduce((a, b) => a + b, 0) / timeData.co2.length)
        });
      });

    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="환경 데이터 트렌드">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={environmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="temp" orientation="left" />
                <YAxis yAxisId="co2" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ff7300" 
                  name="온도(°C)"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#387908" 
                  name="습도(%)"
                  strokeWidth={2}
                />
                <Bar 
                  yAxisId="co2"
                  dataKey="co2" 
                  fill="#8884d8" 
                  name="CO2(ppm)"
                  opacity={0.6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="농장별 환경 비교">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={getFarmEnvironmentComparison()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar 
                  dataKey="score" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="환경 최적화 현황">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="온도 최적화율"
                value={calculateOptimizationRate('temperature')}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
              <Statistic
                title="습도 최적화율"
                value={calculateOptimizationRate('humidity')}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="CO2 최적화율"
                value={calculateOptimizationRate('co2')}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    );
  };

  // 생육 분석 컴포넌트
  const GrowthAnalysis = () => {
    const growthChartData = [];
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      if (farmData.growth) {
        farmData.growth.forEach(growth => {
          growthChartData.push({
            ...growth,
            farmName: FARM_CODES[farmCode].name
          });
        });
      }
    });

    // 주차별 평균 생육 데이터
    const weeklyGrowthData = [];
    const weekMap = new Map();
    
    growthChartData.forEach(growth => {
      if (!weekMap.has(growth.week)) {
        weekMap.set(growth.week, {
          week: growth.week,
          plantHeight: [],
          leafLength: [],
          healthScore: []
        });
      }
      const weekData = weekMap.get(growth.week);
      weekData.plantHeight.push(growth.plantHeight);
      weekData.leafLength.push(growth.leafLength);
      weekData.healthScore.push(growth.healthScore);
    });

    Array.from(weekMap.values()).forEach(weekData => {
      weeklyGrowthData.push({
        week: `${weekData.week}주차`,
        plantHeight: Math.round(weekData.plantHeight.reduce((a, b) => a + b, 0) / weekData.plantHeight.length * 10) / 10,
        leafLength: Math.round(weekData.leafLength.reduce((a, b) => a + b, 0) / weekData.leafLength.length * 10) / 10,
        healthScore: Math.round(weekData.healthScore.reduce((a, b) => a + b, 0) / weekData.healthScore.length)
      });
    });

    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="생육 진행 추이">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={weeklyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="growth" orientation="left" />
                <YAxis yAxisId="health" orientation="right" />
                <Tooltip />
                <Legend />
                <Area 
                  yAxisId="growth"
                  type="monotone" 
                  dataKey="plantHeight" 
                  fill="#82ca9d" 
                  stroke="#82ca9d"
                  name="초장(cm)"
                  fillOpacity={0.6}
                />
                <Line 
                  yAxisId="growth"
                  type="monotone" 
                  dataKey="leafLength" 
                  stroke="#8884d8" 
                  name="엽장(cm)"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="health"
                  type="monotone" 
                  dataKey="healthScore" 
                  stroke="#ff7300" 
                  name="건강도(점)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="농장별 생육 현황">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getFarmGrowthComparison()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="farmName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgPlantHeight" fill="#8884d8" name="평균 초장(cm)" />
                <Bar dataKey="avgHealthScore" fill="#82ca9d" name="평균 건강도" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="생육 단계별 분포">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getGrowthStageDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff7300" name="농장 수" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    );
  };

  // 경영 분석 컴포넌트
  const ManagementAnalysis = () => {
    const managementChartData = [];
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      if (farmData.management) {
        farmData.management.forEach(mgmt => {
          managementChartData.push({
            ...mgmt,
            farmName: FARM_CODES[farmCode].name
          });
        });
      }
    });

    // 월별 수익 데이터
    const monthlyData = [];
    const monthMap = new Map();
    
    managementChartData.forEach(mgmt => {
      const month = mgmt.date.substring(0, 7); // YYYY-MM
      if (!monthMap.has(month)) {
        monthMap.set(month, {
          month,
          revenue: 0,
          cost: 0,
          yield: 0,
          count: 0
        });
      }
      const monthData = monthMap.get(month);
      monthData.revenue += mgmt.dailyRevenue || 0;
      monthData.cost += mgmt.dailyCost || 0;
      monthData.yield += mgmt.dailyYield || 0;
      monthData.count++;
    });

    Array.from(monthMap.values()).forEach(monthData => {
      monthlyData.push({
        month: monthData.month,
        revenue: Math.round(monthData.revenue),
        cost: Math.round(monthData.cost),
        profit: Math.round(monthData.revenue - monthData.cost),
        yield: Math.round(monthData.yield * 10) / 10
      });
    });

    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="월별 경영 성과">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="money" orientation="left" />
                <YAxis yAxisId="yield" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name.includes('수확량') ? `${value}kg` : `${value.toLocaleString()}원`,
                  name
                ]} />
                <Legend />
                <Bar 
                  yAxisId="money"
                  dataKey="revenue" 
                  fill="#52c41a" 
                  name="매출"
                />
                <Bar 
                  yAxisId="money"
                  dataKey="cost" 
                  fill="#ff4d4f" 
                  name="비용"
                />
                <Line 
                  yAxisId="yield"
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#1890ff" 
                  name="수확량(kg)"
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="농장별 수익성 비교">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getFarmProfitabilityComparison()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="farmName" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, '수익률']} />
                <Bar dataKey="profitMargin" fill="#722ed1" name="수익률(%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="투자 효율성 분석">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="평균 ROI"
                value={calculateAverageROI()}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#52c41a' }}
              />
              <Statistic
                title="kg당 평균 수익"
                value={calculateRevenuePerKg()}
                prefix="₩"
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="운영 효율성"
                value={calculateOperationalEfficiency()}
                suffix="/10"
                precision={1}
                valueStyle={{ color: '#722ed1' }}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    );
  };

  // 헬퍼 함수들
  const getFarmEnvironmentComparison = () => {
    return selectedFarms.map(farmCode => {
      const farmData = analyticsData[farmCode];
      if (!farmData || !farmData.environment) return null;
      
      const envData = farmData.environment;
      const avgTemp = envData.reduce((sum, d) => sum + d.temperature, 0) / envData.length;
      const avgHumidity = envData.reduce((sum, d) => sum + d.humidity, 0) / envData.length;
      const avgCO2 = envData.reduce((sum, d) => sum + d.co2, 0) / envData.length;
      
      return {
        farmName: FARM_CODES[farmCode].name,
        metric: '종합 점수',
        score: Math.round(((avgTemp/25 + avgHumidity/70 + avgCO2/600) / 3) * 100)
      };
    }).filter(Boolean);
  };

  const getFarmGrowthComparison = () => {
    return selectedFarms.map(farmCode => {
      const farmData = analyticsData[farmCode];
      if (!farmData || !farmData.growth) return null;
      
      const growthData = farmData.growth;
      const avgPlantHeight = growthData.reduce((sum, d) => sum + d.plantHeight, 0) / growthData.length;
      const avgHealthScore = growthData.reduce((sum, d) => sum + d.healthScore, 0) / growthData.length;
      
      return {
        farmName: FARM_CODES[farmCode].name,
        avgPlantHeight: Math.round(avgPlantHeight * 10) / 10,
        avgHealthScore: Math.round(avgHealthScore)
      };
    }).filter(Boolean);
  };

  const getFarmProfitabilityComparison = () => {
    return selectedFarms.map(farmCode => {
      const farmData = analyticsData[farmCode];
      if (!farmData || !farmData.management) return null;
      
      const mgmtData = farmData.management;
      const totalRevenue = mgmtData.reduce((sum, d) => sum + (d.dailyRevenue || 0), 0);
      const totalCost = mgmtData.reduce((sum, d) => sum + (d.dailyCost || 0), 0);
      const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
      
      return {
        farmName: FARM_CODES[farmCode].name,
        profitMargin: Math.round(profitMargin * 10) / 10
      };
    }).filter(Boolean);
  };

  const getGrowthStageDistribution = () => {
    const stageCount = {};
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      if (farmData.growth && farmData.growth.length > 0) {
        const latestGrowth = farmData.growth[farmData.growth.length - 1];
        const stage = latestGrowth.growthStage;
        stageCount[stage] = (stageCount[stage] || 0) + 1;
      }
    });
    
    return Object.keys(stageCount).map(stage => ({
      stage,
      count: stageCount[stage]
    }));
  };

  const calculateOptimizationRate = (metric) => {
    let totalCount = 0;
    let optimalCount = 0;
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      if (farmData.environment) {
        farmData.environment.forEach(env => {
          totalCount++;
          if (metric === 'temperature' && env.temperature >= 18 && env.temperature <= 25) {
            optimalCount++;
          } else if (metric === 'humidity' && env.humidity >= 60 && env.humidity <= 75) {
            optimalCount++;
          } else if (metric === 'co2' && env.co2 >= 400 && env.co2 <= 800) {
            optimalCount++;
          }
        });
      }
    });
    
    return totalCount > 0 ? Math.round((optimalCount / totalCount) * 100) : 0;
  };

  const calculateAverageROI = () => {
    let totalROI = 0;
    let farmCount = 0;
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      if (farmData.management && farmData.management.length > 0) {
        const lastData = farmData.management[farmData.management.length - 1];
        const roi = lastData.cumulativeRevenue > 0 
          ? (lastData.profit / lastData.cumulativeCost) * 100 
          : 0;
        totalROI += roi;
        farmCount++;
      }
    });
    
    return farmCount > 0 ? totalROI / farmCount : 0;
  };

  const calculateRevenuePerKg = () => {
    let totalRevenue = 0;
    let totalYield = 0;
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      if (farmData.management) {
        farmData.management.forEach(mgmt => {
          totalRevenue += mgmt.dailyRevenue || 0;
          totalYield += mgmt.dailyYield || 0;
        });
      }
    });
    
    return totalYield > 0 ? Math.round(totalRevenue / totalYield) : 0;
  };

  const calculateOperationalEfficiency = () => {
    // 환경 최적화율, 생육 건강도, 수익률을 종합한 효율성 점수
    const tempOptimal = calculateOptimizationRate('temperature') / 100;
    const humidityOptimal = calculateOptimizationRate('humidity') / 100;
    const avgHealth = kpiData.avgHealthScore / 100;
    const profitMargin = Math.max(0, Math.min(1, kpiData.profitMargin / 50)); // 50%를 만점으로
    
    return ((tempOptimal + humidityOptimal + avgHealth + profitMargin) / 4) * 10;
  };

  const handleExportData = () => {
    const exportData = [];
    
    Object.keys(analyticsData).forEach(farmCode => {
      const farmData = analyticsData[farmCode];
      const farmName = FARM_CODES[farmCode].name;
      
      // 환경 데이터 추가
      if (farmData.environment) {
        farmData.environment.forEach(env => {
          exportData.push({
            농장명: farmName,
            데이터타입: '환경',
            날짜: env.date,
            온도: env.temperature,
            습도: env.humidity,
            CO2: env.co2,
            조도: env.lightIntensity
          });
        });
      }
      
      // 생육 데이터 추가
      if (farmData.growth) {
        farmData.growth.forEach(growth => {
          exportData.push({
            농장명: farmName,
            데이터타입: '생육',
            날짜: growth.date,
            초장: growth.plantHeight,
            엽장: growth.leafLength,
            건강도: growth.healthScore,
            생육단계: growth.growthStage
          });
        });
      }
    });
    
    exportToCSV(exportData, `analytics_data_${dayjs().format('YYYY-MM-DD')}.csv`);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <DashboardOutlined /> 데이터 분석 대시보드
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text type="secondary">농장 데이터 통합 분석 및 시각화</Text>
          <div style={{ 
            padding: '4px 8px', 
            borderRadius: '4px', 
            backgroundColor: isUsingRealData() ? '#f6ffed' : '#fff7e6',
            border: `1px solid ${isUsingRealData() ? '#b7eb8f' : '#ffd591'}`
          }}>
            <Text style={{ 
              color: isUsingRealData() ? '#52c41a' : '#fa8c16',
              fontSize: '12px'
            }}>
              {isUsingRealData() ? '📊 실제 엑셀 데이터 + 보간' : '🔬 시뮬레이션 데이터'}
            </Text>
          </div>
        </div>
      </div>

      {/* 필터 영역 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>농장 선택</Text>
              <Select
                mode="multiple"
                placeholder="농장을 선택하세요"
                value={selectedFarms}
                onChange={setSelectedFarms}
                style={{ width: '100%' }}
              >
                {Object.keys(FARM_CODES).map(farmCode => (
                  <Option key={farmCode} value={farmCode}>
                    {FARM_CODES[farmCode].name} ({FARM_CODES[farmCode].region})
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>기간 선택</Text>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
              />
            </Space>
          </Col>
          
          <Col xs={24} sm={8}>
            <Space style={{ marginTop: '24px' }}>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                loading={loading}
                onClick={loadAnalyticsData}
              >
                데이터 새로고침
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleExportData}
              >
                데이터 내보내기
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>데이터를 분석하고 있습니다...</Text>
          </div>
        </div>
      ) : (
        <>
          {/* KPI 카드 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="총 수확량"
                  value={kpiData.totalYield}
                  suffix="kg"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="총 매출"
                  value={kpiData.totalRevenue}
                  prefix="₩"
                  formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="수익률"
                  value={kpiData.profitMargin}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: kpiData.profitMargin > 0 ? '#52c41a' : '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="평균 건강도"
                  value={kpiData.avgHealthScore}
                  suffix="점"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 분석 탭 */}
          <Card>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={[
                {
                  key: 'environment',
                  label: <span><LineChartOutlined />환경 분석</span>,
                  children: EnvironmentAnalysis()
                },
                {
                  key: 'growth',
                  label: <span><BarChartOutlined />생육 분석</span>,
                  children: GrowthAnalysis()
                },
                {
                  key: 'management',
                  label: <span><DashboardOutlined />경영 분석</span>,
                  children: ManagementAnalysis()
                }
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
