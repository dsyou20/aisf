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
  Divider,
  Select
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
  DollarOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
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
  generateGreenhouseTrendData,
  generateGreenhouseAlerts,
  calculateGreenhousePerformance,
  compareGreenhousePerformance,
  getGreenhousesByUserRole,
  getGreenhousesByManager
} from '../../utils/greenhouseManager';
import { IntegratedYieldRevenuePrediction } from '../../utils/yieldPrediction';

const { Title, Text } = Typography;
const { Option } = Select;

const GreenhouseOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [summaryStats, setSummaryStats] = useState({});
  const [comparisonData, setComparisonData] = useState([]);
  const [performanceRanking, setPerformanceRanking] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [userRole, setUserRole] = useState('manager'); // URL에서 추출하거나 컨텍스트에서 가져옴
  const [currentManagerId, setCurrentManagerId] = useState('manager_kim'); // 현재 로그인한 관리자 ID
  const [yieldPredictions, setYieldPredictions] = useState({});

  const predictionEngine = new IntegratedYieldRevenuePrediction();

  useEffect(() => {
    // URL에서 사용자 타입 추출
    const pathSegments = location.pathname.split('/');
    const dashboardIndex = pathSegments.findIndex(segment => segment === 'dashboard');
    if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
      const extractedUserRole = pathSegments[dashboardIndex + 1];
      setUserRole(extractedUserRole);
      
      // 농장주인 경우 관리자 ID 초기화
      if (extractedUserRole === 'owner') {
        setCurrentManagerId('all'); // 전체 표시용
      }
    }
    
    loadOverviewData();
  }, [location]);

  // 관리자 ID 변경 시 데이터 다시 로드
  useEffect(() => {
    if (userRole === 'manager') {
      loadOverviewData();
    }
  }, [currentManagerId, userRole]);

  const loadOverviewData = async () => {
    // 권한별 하우스 데이터 로드
    let filteredGreenhouses;
    
    if (userRole === 'owner') {
      // 농장주는 모든 하우스 표시
      filteredGreenhouses = Object.values(GREENHOUSE_DATA);
    } else {
      // 재배관리자는 본인 담당 하우스만
      filteredGreenhouses = getGreenhousesByUserRole(userRole, currentManagerId);
    }
    
    const stats = getGreenhouseSummaryStats();
    const comparison = generateGreenhouseComparisonData();
    const ranking = compareGreenhousePerformance();
    
    // 권한에 따라 데이터 필터링 (재배관리자만)
    let filteredComparison = comparison;
    let filteredRanking = ranking;
    
    if (userRole === 'manager') {
      filteredComparison = comparison.filter(greenhouse => 
        filteredGreenhouses.some(fg => fg.id === greenhouse.id)
      );
      filteredRanking = ranking.filter(greenhouse => 
        filteredGreenhouses.some(fg => fg.id === greenhouse.id)
      );
    }
    
    setSummaryStats(stats);
    setComparisonData(filteredComparison);
    setPerformanceRanking(filteredRanking);

    // 하우스별 수확량 및 수익 예측 로드
    const predictions = {};
    for (const greenhouse of filteredGreenhouses) {
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
    // 선택된 하우스의 상세 시뮬레이터로 이동
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
          <ExperimentOutlined /> 온실 관리 센터
          {userRole === 'manager' && (
            <Text style={{ fontSize: '16px', color: '#1890ff', marginLeft: '16px' }}>
              - {MANAGER_DATA[currentManagerId]?.name} 관리자
            </Text>
          )}
        </Title>
        <Text type="secondary">
          {userRole === 'owner' ? 
            '전체 비닐하우스 현황과 관리자별 성과를 한눈에 보고 개별 하우스를 선택하여 상세 관리할 수 있습니다' :
            '담당하고 있는 비닐하우스의 현황을 모니터링하고 상세 관리할 수 있습니다'
          }
        </Text>
      </div>

      {/* 전체 요약 통계 */}
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
              title="정상 운영"
              value={summaryStats.normal}
              suffix="개"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="예상 총 수확량"
              value={(() => {
                const totalYield = Object.values(yieldPredictions).reduce((sum, prediction) => {
                  return sum + (prediction?.summary?.expectedYield || 0);
                }, 0);
                return totalYield.toFixed(1);
              })()}
              suffix="kg"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="예상 총 매출"
              value={(() => {
                const totalRevenue = Object.values(yieldPredictions).reduce((sum, prediction) => {
                  return sum + (prediction?.summary?.expectedRevenue || 0);
                }, 0);
                return (totalRevenue / 100000000).toFixed(1);
              })()}
              suffix="억원"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 농장주용 관리자별 요약 */}
      {userRole === 'owner' && (
        <Card title="관리자별 현황" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            {getGreenhousesByManager().map(managerGroup => {
              const managerInfo = MANAGER_DATA[managerGroup.managerId];
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
                            {managerInfo?.specialty}
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
                      <div>
                        <Text strong>관리 하우스:</Text> {managerGroup.greenhouses.length}개
                        <Text strong style={{ marginLeft: '12px' }}>총 면적:</Text> {managerGroup.totalArea}㎡
                      </div>
                      <div>
                        <Text strong>평균 생산성:</Text> {managerGroup.avgProductivity}%
                        <Text strong style={{ marginLeft: '12px' }}>알림:</Text> {managerGroup.alertCount}건
                      </div>
                      <div>
                        <Text strong>경력:</Text> {managerInfo?.experience}
                        <Text strong style={{ marginLeft: '12px' }}>평점:</Text> ⭐ {managerInfo?.performance.rating}
                      </div>
                      
                      {/* 관리자별 예상 수익 */}
                      <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                        <Text strong style={{ fontSize: '12px' }}>예상 수익 (3개월)</Text>
                        <Row gutter={[4, 4]} style={{ marginTop: '4px' }}>
                          <Col span={12}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#52c41a' }}>
                                {(() => {
                                  const totalYield = managerGroup.greenhouses.reduce((sum, gh) => {
                                    const prediction = yieldPredictions[gh.id];
                                    return sum + (prediction?.summary?.expectedYield || 0);
                                  }, 0);
                                  return `${totalYield.toFixed(0)}kg`;
                                })()}
                              </div>
                              <div style={{ fontSize: '9px', color: '#666' }}>수확량</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1890ff' }}>
                                {(() => {
                                  const totalRevenue = managerGroup.greenhouses.reduce((sum, gh) => {
                                    const prediction = yieldPredictions[gh.id];
                                    return sum + (prediction?.summary?.expectedRevenue || 0);
                                  }, 0);
                                  return `${(totalRevenue / 1000000).toFixed(1)}M`;
                                })()}
                              </div>
                              <div style={{ fontSize: '9px', color: '#666' }}>매출</div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        {managerGroup.greenhouses.map(gh => (
                          <Tag 
                            key={gh.id}
                            color={GREENHOUSE_STATUS_COLORS[gh.status]}
                            style={{ marginBottom: '4px' }}
                          >
                            {gh.name}
                          </Tag>
                        ))}
                      </div>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* 하우스별 현황 카드 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {(userRole === 'owner' ? 
          Object.values(GREENHOUSE_DATA) : 
          getGreenhousesByUserRole(userRole, currentManagerId)
        ).map(greenhouse => {
          const performance = calculateGreenhousePerformance(greenhouse.id);
          const alerts = generateGreenhouseAlerts(greenhouse.id);
          const yieldPrediction = yieldPredictions[greenhouse.id];
          
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
                    {userRole === 'owner' && (
                      <Text strong style={{ marginLeft: '12px' }}>관리자: 
                        <Tag color="purple" style={{ marginLeft: '4px' }}>
                          {greenhouse.manager}
                        </Tag>
                      </Text>
                    )}
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

                  {/* 수확량 및 수익 예측 (모든 사용자) */}
                  {yieldPrediction && yieldPrediction.summary && (
                    <>
                      <Divider style={{ margin: '12px 0' }} />
                      <div>
                        <Text strong style={{ color: '#1890ff' }}>💰 수확량 및 수익 예측</Text>
                        <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                          <Col span={12}>
                            <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                                {yieldPrediction.summary?.expectedYield?.toFixed(1) || 0}kg
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>예상 수확량</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
                              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                                {yieldPrediction.summary?.expectedRevenue ? 
                                  `₩${(yieldPrediction.summary.expectedRevenue / 1000000).toFixed(1)}M` : '₩0M'}
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>예상 매출</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ 
                              textAlign: 'center', 
                              padding: '6px', 
                              backgroundColor: yieldPrediction.summary?.expectedProfit > 0 ? '#f6ffed' : '#fff2f0', 
                              borderRadius: '4px' 
                            }}>
                              <div style={{ 
                                fontSize: '14px', 
                                fontWeight: 'bold', 
                                color: yieldPrediction.summary?.expectedProfit > 0 ? '#52c41a' : '#ff4d4f' 
                              }}>
                                {yieldPrediction.summary?.expectedProfit ? 
                                  `₩${(yieldPrediction.summary.expectedProfit / 1000000).toFixed(1)}M` : '₩0M'}
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>예상 순수익</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f9f0ff', borderRadius: '4px' }}>
                              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#722ed1' }}>
                                {yieldPrediction.summary?.roi?.toFixed(1) || 0}%
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>ROI</div>
                            </div>
                          </Col>
                        </Row>
                        
                        {/* 예측 신뢰도 및 기간 */}
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <Space size="small">
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              📊 신뢰도: {yieldPrediction.summary?.confidence ? 
                                `${Math.round(yieldPrediction.summary.confidence * 100)}%` : '0%'}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              📅 3개월 예측
                            </Text>
                          </Space>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 최근 알림 */}
                  {alerts.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <Text strong>최근 알림</Text>
                      <div style={{ marginTop: '8px', maxHeight: '80px', overflowY: 'auto' }}>
                        {alerts.slice(0, 3).map((alert, index) => (
                          <div key={index} style={{ fontSize: '11px', marginBottom: '4px' }}>
                            <Tag 
                              color={alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'orange' : 'blue'}
                              size="small"
                            >
                              {alert.type === 'error' ? '긴급' : alert.type === 'warning' ? '주의' : '정보'}
                            </Tag>
                            <Text style={{ fontSize: '11px' }}>{alert.message}</Text>
                            <Text type="secondary" style={{ fontSize: '10px', marginLeft: '4px' }}>
                              ({alert.time})
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 성능 비교 차트 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="하우스별 생산성 비교">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="productivity" fill="#1890ff" name="수확률(%)" />
                <Bar dataKey="quality" fill="#52c41a" name="품질(점)" />
                <Bar dataKey="efficiency" fill="#722ed1" name="효율성(%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="환경 상태 비교">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ff4d4f" name="온도(°C)" strokeWidth={2} />
                <Line type="monotone" dataKey="humidity" stroke="#1890ff" name="습도(%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 성능 랭킹 */}
      <Card title="하우스 성능 랭킹" style={{ marginTop: '16px' }}>
        <List
          dataSource={performanceRanking}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  icon={<BarChartOutlined />}
                  onClick={() => handleGreenhouseSelect(item.id)}
                >
                  주차별 분석
                </Button>,
                <Button 
                  type="link" 
                  icon={<CalendarOutlined />}
                  onClick={() => handleGreenhouseSelect(item.id)}
                >
                  월간 달력
                </Button>,
                <Button 
                  type="link" 
                  icon={<BulbOutlined />}
                  onClick={() => handleGreenhouseSelect(item.id)}
                >
                  예측 분석
                </Button>,
                <Button 
                  type="link" 
                  icon={<ControlOutlined />}
                  onClick={() => handleGreenhouseSelect(item.id)}
                >
                  시나리오 시뮬레이션
                </Button>,
                <Button 
                  type="link" 
                  icon={<DollarOutlined />}
                  onClick={() => navigate('/cultivation/yield-prediction')}
                >
                  수익 예측
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ 
                      backgroundColor: item.performance.grade.color,
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text strong>{item.name}</Text>
                    <Tag color={item.performance.grade.color}>
                      {item.performance.grade.grade}등급
                    </Tag>
                    <Tag color="blue">{item.cropName}</Tag>
                    <Badge 
                      count={item.alerts.length} 
                      size="small"
                      style={{ backgroundColor: GREENHOUSE_STATUS_COLORS[item.status] }}
                    />
                  </Space>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text>면적: {item.area}㎡ | 재배주차: {item.currentWeek}주차 | 관리자: {item.manager}</Text>
                    </div>
                    <Row gutter={[16, 16]}>
                      <Col span={6}>
                        <Statistic
                          title="종합점수"
                          value={item.performance.overall}
                          suffix="점"
                          valueStyle={{ 
                            color: item.performance.grade.color,
                            fontSize: '14px'
                          }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="수확률"
                          value={item.productivity.currentYield}
                          suffix="%"
                          valueStyle={{ fontSize: '14px' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="품질"
                          value={item.productivity.quality}
                          suffix="점"
                          valueStyle={{ fontSize: '14px' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="효율성"
                          value={item.productivity.efficiency}
                          suffix="%"
                          valueStyle={{ fontSize: '14px' }}
                        />
                      </Col>
                    </Row>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 긴급 조치 필요 하우스 */}
      {summaryStats.critical > 0 && (
        <Alert
          message="긴급 조치 필요"
          description={`${summaryStats.critical}개 하우스에서 위험 상태가 감지되었습니다. 즉시 점검이 필요합니다.`}
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

      {/* 재배관리자 전환 (데모용) */}
      {userRole === 'manager' && (
        <Card title="관리자 전환 (데모용)" style={{ marginTop: '16px' }}>
          <Space>
            <Text strong>현재 관리자:</Text>
            <Select
              value={currentManagerId}
              onChange={setCurrentManagerId}
              style={{ width: 200 }}
            >
              {Object.keys(MANAGER_DATA).map(managerId => (
                <Option key={managerId} value={managerId}>
                  {MANAGER_DATA[managerId].name} ({MANAGER_DATA[managerId].specialty})
                </Option>
              ))}
            </Select>
            <Text type="secondary" style={{ marginLeft: '8px' }}>
              관리자를 변경하면 담당 하우스가 바뀝니다
            </Text>
          </Space>
        </Card>
      )}

      {/* 도움말 */}
      <Card title="사용 가이드" style={{ marginTop: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Space direction="vertical">
              <Text strong>📊 하우스별 상세 분석:</Text>
              <Text>• 각 하우스 카드의 "상세보기" 버튼 클릭</Text>
              <Text>• 주차별 환경 트렌드 분석</Text>
              <Text>• 월간 달력 형태 환경 표시</Text>
              <Text>• 7일간 환경 예측 및 작업 추천</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space direction="vertical">
              <Text strong>🎮 시나리오 시뮬레이션:</Text>
              <Text>• 15가지 다양한 상황별 시나리오</Text>
              <Text>• 문제상황 → 조치사항 → 예상결과</Text>
              <Text>• 가상 실행을 통한 사전 대응 훈련</Text>
              <Text>• 비용 효과 분석 및 최적 대응 방안</Text>
              {userRole === 'owner' && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <Text strong>👥 농장주 전용 기능:</Text>
                  <Text>• 전체 관리자별 성과 비교</Text>
                  <Text>• 관리자별 하우스 현황 요약</Text>
                  <Text>• 통합 성능 분석 및 랭킹</Text>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GreenhouseOverview;
