import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Tag, 
  Statistic,
  Progress,
  Badge,
  List,
  Avatar,
  Tooltip,
  Divider
} from 'antd';
import {
  ExperimentOutlined,
  EyeOutlined,
  SettingOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  CalendarOutlined,
  BulbOutlined,
  ControlOutlined,
  DollarOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  GREENHOUSE_DATA,
  GREENHOUSE_STATUS_COLORS,
  SENSOR_STATUS_COLORS,
  MANAGER_DATA,
  getGreenhouseSummaryStats,
  generateGreenhouseComparisonData,
  generateGreenhouseAlerts,
  calculateGreenhousePerformance,
  compareGreenhousePerformance,
  getGreenhousesByManager
} from '../../utils/greenhouseManager';
import { IntegratedYieldRevenuePrediction, predictFarmTotalRevenue } from '../../utils/yieldPrediction';

const { Title, Text } = Typography;

const OwnerGreenhouseOverview = () => {
  const navigate = useNavigate();
  const [summaryStats, setSummaryStats] = useState({});
  const [comparisonData, setComparisonData] = useState([]);
  const [performanceRanking, setPerformanceRanking] = useState([]);
  const [yieldPredictions, setYieldPredictions] = useState({});
  const [farmTotalPrediction, setFarmTotalPrediction] = useState(null);
  const [managerGroups, setManagerGroups] = useState([]);

  const predictionEngine = new IntegratedYieldRevenuePrediction();

  useEffect(() => {
    loadOwnerData();
  }, []);

  const loadOwnerData = async () => {
    // 전체 농장 통계
    const stats = getGreenhouseSummaryStats();
    const comparison = generateGreenhouseComparisonData();
    const ranking = compareGreenhousePerformance();
    const managers = getGreenhousesByManager();
    
    setSummaryStats(stats);
    setComparisonData(comparison);
    setPerformanceRanking(ranking);
    setManagerGroups(managers);

    // 전체 농장 수익 예측
    const farmPrediction = predictFarmTotalRevenue();
    setFarmTotalPrediction(farmPrediction);

    // 모든 하우스 수익 예측 로드
    const predictions = {};
    for (const greenhouse of Object.values(GREENHOUSE_DATA)) {
      try {
        const prediction = predictionEngine.generateCompletePrediction(greenhouse.id);
        if (prediction) {
          predictions[greenhouse.id] = prediction;
        }
      } catch (error) {
        console.error(`${greenhouse.id} 예측 실패:`, error);
      }
    }
    setYieldPredictions(predictions);
  };

  const handleGreenhouseSelect = (greenhouseId) => {
    navigate(`/cultivation/simulator/${greenhouseId}`);
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      normal: <CheckCircleOutlined style={{ color: GREENHOUSE_STATUS_COLORS.normal }} />,
      warning: <ExclamationCircleOutlined style={{ color: GREENHOUSE_STATUS_COLORS.warning }} />,
      critical: <CloseCircleOutlined style={{ color: GREENHOUSE_STATUS_COLORS.critical }} />
    };
    return iconMap[status] || iconMap.normal;
  };

  const getStatusText = (status) => {
    const textMap = {
      normal: '정상',
      warning: '주의',
      critical: '위험'
    };
    return textMap[status] || '알 수 없음';
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <ExperimentOutlined /> 전체 농장 관리 센터
        </Title>
        <Text type="secondary">
          소유하고 있는 모든 비닐하우스의 현황과 수익성을 통합 관리합니다
        </Text>
      </div>

      {/* 전체 농장 요약 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="전체 하우스"
              value={summaryStats.total}
              suffix="개"
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="예상 총 수확량"
              value={farmTotalPrediction?.farmSummary?.totalYield?.toFixed(1) || 0}
              suffix="kg"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="예상 총 매출"
              value={farmTotalPrediction?.farmSummary?.totalRevenue ? 
                (farmTotalPrediction.farmSummary.totalRevenue / 100000000).toFixed(1) : 0}
              suffix="억원"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="예상 총 순수익"
              value={farmTotalPrediction?.farmSummary?.totalProfit ? 
                (farmTotalPrediction.farmSummary.totalProfit / 100000000).toFixed(1) : 0}
              suffix="억원"
              valueStyle={{ 
                color: farmTotalPrediction?.farmSummary?.totalProfit > 0 ? '#52c41a' : '#ff4d4f' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 관리자별 성과 요약 */}
      <Card title="👥 관리자별 성과 현황" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {managerGroups.map(managerGroup => {
            const managerInfo = MANAGER_DATA[managerGroup.managerId];
            
            // 관리자별 수익 합계 계산
            const managerTotalYield = managerGroup.greenhouses.reduce((sum, gh) => {
              const prediction = yieldPredictions[gh.id];
              return sum + (prediction?.summary?.expectedYield || 0);
            }, 0);
            
            const managerTotalRevenue = managerGroup.greenhouses.reduce((sum, gh) => {
              const prediction = yieldPredictions[gh.id];
              return sum + (prediction?.summary?.expectedRevenue || 0);
            }, 0);
            
            const managerTotalProfit = managerGroup.greenhouses.reduce((sum, gh) => {
              const prediction = yieldPredictions[gh.id];
              return sum + (prediction?.summary?.expectedProfit || 0);
            }, 0);

            return (
              <Col xs={24} sm={12} lg={8} key={managerGroup.managerId}>
                <Card 
                  size="small"
                  title={
                    <Space>
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {managerGroup.managerName[0]}
                      </Avatar>
                      <div>
                        <div>{managerGroup.managerName}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {managerInfo?.specialty} • {managerInfo?.experience}
                        </Text>
                      </div>
                    </Space>
                  }
                  style={{
                    borderColor: GREENHOUSE_STATUS_COLORS[managerGroup.status],
                    borderWidth: '1px'
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {/* 기본 정보 */}
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <Text strong>관리 하우스:</Text> {managerGroup.greenhouses.length}개
                      </Col>
                      <Col span={12}>
                        <Text strong>총 면적:</Text> {managerGroup.totalArea}㎡
                      </Col>
                      <Col span={12}>
                        <Text strong>평균 생산성:</Text> {managerGroup.avgProductivity}%
                      </Col>
                      <Col span={12}>
                        <Text strong>평점:</Text> ⭐ {managerInfo?.performance.rating}
                      </Col>
                    </Row>

                    <Divider style={{ margin: '8px 0' }} />

                    {/* 수익 예측 정보 */}
                    <div>
                      <Text strong style={{ color: '#1890ff' }}>💰 예상 수익 (3개월)</Text>
                      <Row gutter={[4, 4]} style={{ marginTop: '8px' }}>
                        <Col span={12}>
                          <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                              {managerTotalYield.toFixed(1)}kg
                            </div>
                            <div style={{ fontSize: '9px', color: '#666' }}>수확량</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                              ₩{(managerTotalRevenue / 1000000).toFixed(1)}M
                            </div>
                            <div style={{ fontSize: '9px', color: '#666' }}>매출</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '6px', 
                            backgroundColor: managerTotalProfit > 0 ? '#f6ffed' : '#fff2f0', 
                            borderRadius: '4px' 
                          }}>
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: 'bold', 
                              color: managerTotalProfit > 0 ? '#52c41a' : '#ff4d4f' 
                            }}>
                              ₩{(managerTotalProfit / 1000000).toFixed(1)}M
                            </div>
                            <div style={{ fontSize: '9px', color: '#666' }}>순수익</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f9f0ff', borderRadius: '4px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#722ed1' }}>
                              {managerTotalRevenue > 0 ? ((managerTotalProfit / managerTotalRevenue) * 100).toFixed(1) : 0}%
                            </div>
                            <div style={{ fontSize: '9px', color: '#666' }}>수익률</div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    {/* 담당 하우스 태그 */}
                    <div>
                      <Text strong style={{ fontSize: '12px' }}>담당 하우스:</Text>
                      <div style={{ marginTop: '4px' }}>
                        {managerGroup.greenhouses.map(gh => (
                          <Tag 
                            key={gh.id}
                            color={GREENHOUSE_STATUS_COLORS[gh.status]}
                            style={{ marginBottom: '4px', cursor: 'pointer' }}
                            onClick={() => handleGreenhouseSelect(gh.id)}
                          >
                            {gh.name} ({gh.cropName})
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* 전체 하우스 상세 현황 */}
      <Card title="🏠 전체 하우스 상세 현황" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {Object.values(GREENHOUSE_DATA).map(greenhouse => {
            const performance = calculateGreenhousePerformance(greenhouse.id);
            const alerts = generateGreenhouseAlerts(greenhouse.id);
            const yieldPrediction = yieldPredictions[greenhouse.id];
            const managerInfo = MANAGER_DATA[greenhouse.managerId];
            
            return (
              <Col xs={24} sm={12} lg={8} key={greenhouse.id}>
                <Card
                  hoverable
                  title={
                    <Space>
                      {getStatusIcon(greenhouse.status)}
                      <Text strong>{greenhouse.name}</Text>
                      <Tag color={GREENHOUSE_STATUS_COLORS[greenhouse.status]}>
                        {getStatusText(greenhouse.status)}
                      </Tag>
                    </Space>
                  }
                  extra={
                    <Space>
                      <Badge count={alerts.length} size="small">
                        <Button 
                          type="primary" 
                          icon={<EyeOutlined />}
                          onClick={() => handleGreenhouseSelect(greenhouse.id)}
                          size="small"
                        >
                          상세관리
                        </Button>
                      </Badge>
                      <Button 
                        type="default" 
                        icon={<DollarOutlined />}
                        onClick={() => navigate('/cultivation/yield-prediction')}
                        size="small"
                      >
                        수익예측
                      </Button>
                    </Space>
                  }
                  style={{ 
                    borderColor: GREENHOUSE_STATUS_COLORS[greenhouse.status],
                    borderWidth: '2px'
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {/* 기본 정보 */}
                    <div>
                      <Text strong>작물:</Text> <Tag color="blue">{greenhouse.cropName}</Tag>
                      <Text strong style={{ marginLeft: '12px' }}>면적:</Text> {greenhouse.area}㎡
                    </div>
                    <div>
                      <Text strong>재배 주차:</Text> {greenhouse.currentWeek}주차
                      <Text strong style={{ marginLeft: '12px' }}>관리자: 
                        <Tag color="purple" style={{ marginLeft: '4px' }}>
                          {greenhouse.manager}
                        </Tag>
                      </Text>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    {/* 환경 상태 */}
                    <div>
                      <Text strong>환경 상태</Text>
                      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                        <Col span={12}>
                          <div style={{ fontSize: '12px' }}>
                            <Text>온도: </Text>
                            <Text style={{ color: SENSOR_STATUS_COLORS[greenhouse.sensors.temperature.status] }}>
                              {greenhouse.sensors.temperature.current}°C
                            </Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: '12px' }}>
                            <Text>습도: </Text>
                            <Text style={{ color: SENSOR_STATUS_COLORS[greenhouse.sensors.humidity.status] }}>
                              {greenhouse.sensors.humidity.current}%
                            </Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: '12px' }}>
                            <Text>CO2: </Text>
                            <Text style={{ color: SENSOR_STATUS_COLORS[greenhouse.sensors.co2.status] }}>
                              {greenhouse.sensors.co2.current}ppm
                            </Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: '12px' }}>
                            <Text>토양수분: </Text>
                            <Text style={{ color: SENSOR_STATUS_COLORS[greenhouse.sensors.soilMoisture.status] }}>
                              {greenhouse.sensors.soilMoisture.current}%
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    {/* 생산성 지표 */}
                    <div>
                      <Text strong>생산성 지표</Text>
                      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                              {greenhouse.productivity.currentYield}%
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>수확률</div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                              {greenhouse.productivity.quality}점
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>품질</div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>
                              {greenhouse.productivity.efficiency}%
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>효율성</div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    {/* 수확량 및 수익 예측 */}
                    {yieldPrediction && yieldPrediction.summary && (
                      <div>
                        <Text strong style={{ color: '#1890ff' }}>💰 수확량 및 수익 예측 (3개월)</Text>
                        <Row gutter={[6, 6]} style={{ marginTop: '8px' }}>
                          <Col span={12}>
                            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                                {yieldPrediction.summary.expectedYield?.toFixed(1) || 0}kg
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>예상 수확량</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                                ₩{(yieldPrediction.summary.expectedRevenue / 1000000).toFixed(1)}M
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>예상 매출</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ 
                              textAlign: 'center', 
                              padding: '8px', 
                              backgroundColor: yieldPrediction.summary.expectedProfit > 0 ? '#f6ffed' : '#fff2f0', 
                              borderRadius: '4px' 
                            }}>
                              <div style={{ 
                                fontSize: '16px', 
                                fontWeight: 'bold', 
                                color: yieldPrediction.summary.expectedProfit > 0 ? '#52c41a' : '#ff4d4f' 
                              }}>
                                ₩{(yieldPrediction.summary.expectedProfit / 1000000).toFixed(1)}M
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>예상 순수익</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9f0ff', borderRadius: '4px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>
                                {yieldPrediction.summary.roi?.toFixed(1) || 0}%
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>ROI</div>
                            </div>
                          </Col>
                        </Row>
                        
                        {/* 예측 신뢰도 */}
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            📊 신뢰도: {yieldPrediction.summary.confidence ? 
                              `${Math.round(yieldPrediction.summary.confidence * 100)}%` : '0%'}
                          </Text>
                        </div>
                      </div>
                    )}

                    {/* 최근 알림 */}
                    {alerts.length > 0 && (
                      <>
                        <Divider style={{ margin: '12px 0' }} />
                        <div>
                          <Text strong>최근 알림</Text>
                          <div style={{ marginTop: '8px', maxHeight: '60px', overflowY: 'auto' }}>
                            {alerts.slice(0, 2).map((alert, index) => (
                              <div key={index} style={{ fontSize: '11px', marginBottom: '4px' }}>
                                <Tag 
                                  color={alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'orange' : 'blue'}
                                  size="small"
                                >
                                  {alert.type === 'error' ? '긴급' : alert.type === 'warning' ? '주의' : '정보'}
                                </Tag>
                                <Text style={{ fontSize: '11px' }}>{alert.message}</Text>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* 수익성 분석 차트 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="하우스별 수익성 비교">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={Object.keys(yieldPredictions).map(greenhouseId => {
                const prediction = yieldPredictions[greenhouseId];
                const greenhouse = GREENHOUSE_DATA[greenhouseId];
                return {
                  name: greenhouse.name,
                  expectedYield: prediction?.summary?.expectedYield || 0,
                  expectedRevenue: (prediction?.summary?.expectedRevenue || 0) / 1000000,
                  expectedProfit: (prediction?.summary?.expectedProfit || 0) / 1000000,
                  roi: prediction?.summary?.roi || 0
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip 
                  formatter={(value, name) => [
                    name.includes('수확량') ? `${value.toFixed(1)}kg` : 
                    name.includes('ROI') ? `${value.toFixed(1)}%` : `₩${value.toFixed(1)}M`,
                    name
                  ]}
                />
                <Legend />
                <Bar dataKey="expectedRevenue" fill="#1890ff" name="예상 매출(M원)" />
                <Bar dataKey="expectedProfit" fill="#52c41a" name="예상 순수익(M원)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="관리자별 성과 비교">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={managerGroups.map(managerGroup => {
                const managerTotalRevenue = managerGroup.greenhouses.reduce((sum, gh) => {
                  const prediction = yieldPredictions[gh.id];
                  return sum + (prediction?.summary?.expectedRevenue || 0);
                }, 0);
                
                const managerTotalProfit = managerGroup.greenhouses.reduce((sum, gh) => {
                  const prediction = yieldPredictions[gh.id];
                  return sum + (prediction?.summary?.expectedProfit || 0);
                }, 0);

                return {
                  name: managerGroup.managerName,
                  revenue: managerTotalRevenue / 1000000,
                  profit: managerTotalProfit / 1000000,
                  productivity: managerGroup.avgProductivity
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip 
                  formatter={(value, name) => [
                    name.includes('생산성') ? `${value}%` : `₩${value.toFixed(1)}M`,
                    name
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#1890ff" name="예상 매출(M원)" />
                <Bar dataKey="profit" fill="#52c41a" name="예상 순수익(M원)" />
                <Bar dataKey="productivity" fill="#722ed1" name="평균 생산성(%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 긴급 조치 필요 알림 */}
      {summaryStats.critical > 0 && (
        <Alert
          message="긴급 조치 필요"
          description={`${summaryStats.critical}개 하우스에서 위험 상태가 감지되었습니다. 해당 관리자와 즉시 협의가 필요합니다.`}
          type="error"
          showIcon
          style={{ marginTop: '16px' }}
          action={
            <Button 
              size="small" 
              danger
              onClick={() => {
                const criticalGreenhouse = Object.values(GREENHOUSE_DATA).find(g => g.status === 'critical');
                if (criticalGreenhouse) {
                  handleGreenhouseSelect(criticalGreenhouse.id);
                }
              }}
            >
              긴급 점검
            </Button>
          }
        />
      )}

      {/* 농장주 전용 도움말 */}
      <Card title="농장주 전용 기능 가이드" style={{ marginTop: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Space direction="vertical">
              <Text strong>🏠 전체 농장 관리:</Text>
              <Text>• 5개 하우스 통합 현황 모니터링</Text>
              <Text>• 각 하우스별 수익성 분석</Text>
              <Text>• 관리자별 성과 비교</Text>
              <Text>• 전체 농장 수익 예측</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space direction="vertical">
              <Text strong>👥 관리자 성과 관리:</Text>
              <Text>• 관리자별 담당 하우스 현황</Text>
              <Text>• 개별 관리자 수익 기여도</Text>
              <Text>• 관리자별 생산성 비교</Text>
              <Text>• 성과 기반 관리자 평가</Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OwnerGreenhouseOverview;
