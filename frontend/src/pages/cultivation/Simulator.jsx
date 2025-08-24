import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Tabs, 
  Select, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Tag, 
  Timeline,
  Statistic,
  Progress,
  Modal,
  Descriptions,
  Calendar,
  Badge,
  Tooltip,
  Spin,
  List,
  message
} from 'antd';
import {
  ExperimentOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
  CalendarOutlined,
  BarChartOutlined,
  BulbOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RobotOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import dayjs from 'dayjs';
import { 
  ENVIRONMENT_SENSORS,
  GROWTH_STAGES,
  generateRealtimeEnvironmentData,
  generateMonthlyEnvironmentSummary,
  runGreenhouseSimulation
} from '../../utils/greenhouseSimulator';
import { 
  DETAILED_SIMULATION_SCENARIOS,
  SCENARIO_COLORS,
  DIFFICULTY_COLORS,
  COST_COLORS
} from '../../utils/detailedScenarios';
import { IntegratedPredictionSystem } from '../../utils/predictionEngine';
import { GREENHOUSE_DATA } from '../../utils/greenhouseManager';
import { 
  generateDailyActionSchedule,
  executeAction,
  updateActionStatus,
  calculateDayProgress,
  ACTION_CATEGORY_COLORS,
  ACTION_PRIORITY_COLORS,
  DAY_STATUS_COLORS,
  AUTOMATION_LEVELS,
  AUTOMATED_ACTIONS
} from '../../utils/actionCalendar';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const GreenhouseSimulator = () => {
  const { greenhouseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('action_calendar');
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(15);
  const [currentEnvironment, setCurrentEnvironment] = useState({});
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);

  // 선택된 하우스 정보 로드
  useEffect(() => {
    if (greenhouseId && GREENHOUSE_DATA[greenhouseId]) {
      const greenhouse = GREENHOUSE_DATA[greenhouseId];
      setSelectedGreenhouse(greenhouse);
      setCurrentWeek(greenhouse.currentWeek);
      
      // 센서 데이터를 환경 데이터로 변환
      const environment = {};
      Object.keys(greenhouse.sensors).forEach(sensor => {
        environment[sensor] = greenhouse.sensors[sensor].current;
      });
      setCurrentEnvironment(environment);
    } else if (greenhouseId) {
      // 잘못된 하우스 ID인 경우 오버뷰로 리다이렉트
      navigate('/cultivation/greenhouse-overview');
    }
  }, [greenhouseId, navigate]);
  
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [predictionResults, setPredictionResults] = useState(null);
  const [scenarioResults, setScenarioResults] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [actionSchedule, setActionSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayActions, setSelectedDayActions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [executingActions, setExecutingActions] = useState(new Set());

  const predictionEngine = new IntegratedPredictionSystem();

  // 초기 데이터 로딩
  useEffect(() => {
    loadInitialData();
  }, [currentWeek]);

  // 예측 실행
  useEffect(() => {
    if (currentEnvironment && currentWeek) {
      runPrediction();
    }
  }, [currentEnvironment, currentWeek]);

  const loadInitialData = () => {
    setLoading(true);
    try {
      // 주차별 데이터 생성 (지난 4주 + 현재 주)
      const weeklyEnvironmentData = [];
      for (let week = currentWeek - 4; week <= currentWeek; week++) {
        const weekData = generateRealtimeEnvironmentData(currentEnvironment, week);
        const avgData = calculateWeeklyAverage(weekData);
        weeklyEnvironmentData.push({
          week: `${week}주차`,
          weekNumber: week,
          ...avgData,
          stage: getCurrentStage(week).stage
        });
      }
      setWeeklyData(weeklyEnvironmentData);

      // 월간 데이터 생성
      const year = selectedMonth.year();
      const month = selectedMonth.month() + 1;
      const monthlyEnvironmentData = generateMonthlyEnvironmentSummary(year, month, currentEnvironment);
      setMonthlyData(monthlyEnvironmentData);

      // 작업 스케줄 생성
      if (selectedGreenhouse) {
        setScheduleLoading(true);
        
        // 약간의 지연을 추가하여 로딩 상태를 보여줌
        setTimeout(() => {
          const schedule = generateDailyActionSchedule(
            selectedGreenhouse.id, 
            new Date().toISOString().split('T')[0], 
            30
          );
          setActionSchedule(schedule);
          setScheduleLoading(false);
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    try {
      const currentState = {
        environment: currentEnvironment,
        week: currentWeek,
        growthStage: getCurrentStage(currentWeek).stage
      };

      const results = predictionEngine.runComprehensivePrediction(currentState, {
        weatherForecast: 'normal',
        externalTemperature: 20
      });

      setPredictionResults(results);
    } catch (error) {
      console.error('예측 실행 오류:', error);
    }
  };

  const runScenarioSimulation = async () => {
    setSimulationRunning(true);
    try {
      const results = runGreenhouseSimulation(selectedScenario, currentEnvironment, currentWeek);
      setScenarioResults(results);
      
      // 시나리오 적용된 환경으로 예측 재실행
      const modifiedState = {
        environment: results.modifiedEnvironment,
        week: currentWeek,
        growthStage: getCurrentStage(currentWeek).stage
      };
      
      const predictionResults = predictionEngine.runComprehensivePrediction(modifiedState);
      setPredictionResults(predictionResults);
    } finally {
      setSimulationRunning(false);
    }
  };

  // 주차별 환경 모니터링 탭
  const WeeklyEnvironmentTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="주차별 환경 트렌드">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="temp" orientation="left" />
                <YAxis yAxisId="humidity" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Area 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="temperature" 
                  fill="#ff7875" 
                  stroke="#ff4d4f"
                  name="온도(°C)"
                  fillOpacity={0.3}
                />
                <Line 
                  yAxisId="humidity"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#1890ff" 
                  name="습도(%)"
                  strokeWidth={2}
                />
                <Bar 
                  yAxisId="temp"
                  dataKey="lightIntensity" 
                  fill="#fadb14" 
                  name="광량(×1000 lux)"
                  opacity={0.6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="현재 환경 상태" size="small">
            <Row gutter={[8, 8]}>
              {Object.keys(ENVIRONMENT_SENSORS).map(sensor => {
                const sensorData = ENVIRONMENT_SENSORS[sensor];
                const currentValue = currentEnvironment[sensor];
                const isOptimal = currentValue >= sensorData.optimal[0] && currentValue <= sensorData.optimal[1];
                
                return (
                  <Col span={12} key={sensor}>
                    <Statistic
                      title={sensorData.description}
                      value={currentValue}
                      suffix={sensorData.unit}
                      valueStyle={{ 
                        color: isOptimal ? '#52c41a' : '#fa541c',
                        fontSize: '16px'
                      }}
                    />
                    <Progress 
                      percent={((currentValue - sensorData.min) / (sensorData.max - sensorData.min)) * 100}
                      strokeColor={isOptimal ? '#52c41a' : '#fa541c'}
                      size="small"
                      showInfo={false}
                    />
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="생육 단계 정보" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="현재 주차">{currentWeek}주차</Descriptions.Item>
              <Descriptions.Item label="생육 단계">
                <Tag color="blue">{getCurrentStage(currentWeek).stage}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="단계 설명">
                {getCurrentStage(currentWeek).description}
              </Descriptions.Item>
              <Descriptions.Item label="주요 관리 포인트">
                {getCurrentStage(currentWeek).targetActions.slice(0, 3).join(', ')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 작업 달력 탭 (기존 월간 달력 교체)
  const ActionCalendarTab = () => {
    // 달력 날짜 셀 렌더링 (작업 중심)
    const dateCellRender = (current, info) => {
      // info.type이 'date'일 때만 처리
      if (info.type !== 'date') return info.originNode;
      
      const dateStr = current.format('YYYY-MM-DD');
      const dayData = actionSchedule.find(day => day.date === dateStr);
      
      if (!dayData) return info.originNode;

      const progress = calculateDayProgress(dayData.actions);
      const statusColor = DAY_STATUS_COLORS[dayData.status];

      return (
        <div className="ant-picker-cell-inner ant-picker-calendar-date">
          <div className="ant-picker-calendar-date-value">{current.date()}</div>
          <div className="ant-picker-calendar-date-content">
            <div style={{ fontSize: '10px', lineHeight: '1.1' }}>
              {/* 주요 작업 표시 */}
              <div style={{ marginBottom: '2px', fontWeight: 'bold', color: statusColor }}>
                {dayData.actions.slice(0, 2).map(action => (
                  <div key={action.id} style={{ fontSize: '9px', marginBottom: '1px' }}>
                    {action.name.length > 8 ? action.name.substring(0, 8) + '...' : action.name}
                  </div>
                ))}
              </div>
              
              {/* 작업 개수 및 상태 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge 
                  count={dayData.totalActions} 
                  size="small"
                  style={{ backgroundColor: statusColor }}
                />
                {dayData.urgentActions > 0 && (
                  <Badge 
                    count={dayData.urgentActions} 
                    size="small"
                    style={{ backgroundColor: '#ff4d4f' }}
                  />
                )}
              </div>
              
              {/* 진행률 바 */}
              <div style={{ marginTop: '2px' }}>
                <div style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: progress === 100 ? '#52c41a' : '#1890ff',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
              
              {/* 환경 정보 (작게) */}
              <div style={{ fontSize: '8px', color: '#999', marginTop: '1px' }}>
                🌡️{Math.round(selectedGreenhouse?.sensors?.temperature?.current || 22)}° 
                💧{Math.round(selectedGreenhouse?.sensors?.humidity?.current || 68)}%
              </div>
            </div>
          </div>
        </div>
      );
    };

    // 날짜 선택 시 작업 상세 모달
    const onDateSelect = (value) => {
      const dateStr = value.format('YYYY-MM-DD');
      const dayData = actionSchedule.find(day => day.date === dateStr);
      
      if (dayData) {
        setSelectedDate(value);
        setSelectedDayActions(dayData.actions);
        setModalVisible(true);
      }
    };

    // 작업 실행
    const handleExecuteAction = async (action) => {
      if (executingActions.has(action.id)) return;

      setExecutingActions(prev => new Set([...prev, action.id]));
      
      try {
        const result = await executeAction(action.id, selectedGreenhouse?.id);
        
        if (result.success) {
          // 작업 상태 업데이트
          const updatedSchedule = updateActionStatus(
            actionSchedule, 
            action.id, 
            'completed', 
            result.result
          );
          setActionSchedule(updatedSchedule);
          
          // 모달의 액션 리스트도 업데이트
          setSelectedDayActions(prev => 
            prev.map(a => 
              a.id === action.id 
                ? { ...a, status: 'completed', result: result.result }
                : a
            )
          );
        }
      } finally {
        setExecutingActions(prev => {
          const newSet = new Set(prev);
          newSet.delete(action.id);
          return newSet;
        });
      }
    };

    if (scheduleLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
            🌱 작업 스케줄을 생성하고 있습니다...
          </div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#999' }}>
            잠시만 기다려주세요
          </div>
        </div>
      );
    }

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Statistic
              title="이번 주 총 작업"
              value={actionSchedule.slice(0, 7).reduce((sum, day) => sum + day.totalActions, 0)}
              suffix="개"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="긴급 작업"
              value={actionSchedule.slice(0, 7).reduce((sum, day) => sum + day.urgentActions, 0)}
              suffix="개"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="자동화율"
              value={actionSchedule.slice(0, 7).length > 0 ? 
                Math.round(actionSchedule.slice(0, 7).reduce((sum, day) => sum + day.automationRate, 0) / 7) : 0}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>

        <Card title="📅 작업 중심 달력">
          <div style={{ marginBottom: '16px' }}>
            <Space wrap>
              <Tag color={DAY_STATUS_COLORS.light}>가벼운 작업일</Tag>
              <Tag color={DAY_STATUS_COLORS.normal}>보통 작업일</Tag>
              <Tag color={DAY_STATUS_COLORS.busy}>바쁜 작업일</Tag>
              <Tag color={DAY_STATUS_COLORS.critical}>긴급 작업일</Tag>
            </Space>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                • 주요 작업명 표시 • 배지: 총 작업 수 / 긴급 작업 수 • 진행률 바 • 환경 정보 (온도/습도)
              </Text>
            </div>
          </div>
          
          <Calendar
            cellRender={dateCellRender}
            onSelect={onDateSelect}
          />
        </Card>

        {/* 작업 상세 모달 */}
        <Modal
          title={
            <Space>
              <CalendarOutlined />
              {selectedDate?.format('YYYY년 MM월 DD일 (ddd)')} 작업 목록
              <Tag color={selectedDayActions.length > 0 ? DAY_STATUS_COLORS[getDayStatus(selectedDayActions)] : 'default'}>
                {selectedDayActions.length}개 작업
              </Tag>
            </Space>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={900}
          footer={
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<RobotOutlined />}
                  onClick={() => {
                    const autoActions = selectedDayActions.filter(
                      action => action.automation === 'full' && action.status === 'pending'
                    );
                    autoActions.forEach(action => handleExecuteAction(action));
                  }}
                  disabled={!selectedDayActions.some(action => 
                    action.automation === 'full' && action.status === 'pending'
                  )}
                >
                  모든 자동 작업 실행
                </Button>
                <Button
                  onClick={() => {
                    const semiActions = selectedDayActions.filter(
                      action => action.automation === 'semi' && action.status === 'pending'
                    );
                    semiActions.forEach(action => handleExecuteAction(action));
                  }}
                  disabled={!selectedDayActions.some(action => 
                    action.automation === 'semi' && action.status === 'pending'
                  )}
                >
                  반자동 작업 실행
                </Button>
              </Space>
            </div>
          }
        >
          {selectedDayActions.length > 0 ? (
            <div>
              {/* 하루 요약 */}
              <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={6}>
                  <Statistic
                    title="총 작업"
                    value={selectedDayActions.length}
                    suffix="개"
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="자동화율"
                    value={calculateAutomationRate(selectedDayActions)}
                    suffix="%"
                    valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="진행률"
                    value={calculateDayProgress(selectedDayActions)}
                    suffix="%"
                    valueStyle={{ fontSize: '16px', color: '#1890ff' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="예상 소요시간"
                    value={calculateTotalDuration(selectedDayActions).display}
                    valueStyle={{ fontSize: '14px', color: '#722ed1' }}
                  />
                </Col>
              </Row>

              {/* 작업 리스트 */}
              <List
                dataSource={selectedDayActions}
                renderItem={(action) => (
                  <List.Item
                    key={action.id}
                    actions={[
                      <Space key="actions">
                        {action.automation === 'full' && action.status === 'pending' && (
                          <Button
                            type="primary"
                            icon={<RobotOutlined />}
                            size="small"
                            loading={executingActions.has(action.id)}
                            onClick={() => handleExecuteAction(action)}
                          >
                            자동 실행
                          </Button>
                        )}
                        {action.automation === 'semi' && action.status === 'pending' && (
                          <Button
                            type="default"
                            icon={<SettingOutlined />}
                            size="small"
                            loading={executingActions.has(action.id)}
                            onClick={() => handleExecuteAction(action)}
                          >
                            반자동 실행
                          </Button>
                        )}
                        {action.status === 'completed' && (
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            완료
                          </Tag>
                        )}
                      </Space>
                    ]}
                    style={{
                      borderLeft: `4px solid ${ACTION_PRIORITY_COLORS[action.priority]}`,
                      paddingLeft: '12px',
                      marginBottom: '8px',
                      backgroundColor: action.status === 'completed' ? '#f6ffed' : '#fafafa'
                    }}
                  >
                    <List.Item.Meta
                      avatar={getActionStatusIcon(action.status)}
                      title={
                        <Space>
                          <Text strong style={{ color: ACTION_CATEGORY_COLORS[AUTOMATED_ACTIONS[action.type]?.category] || '#1890ff' }}>
                            {action.name}
                          </Text>
                          <Tag color={ACTION_PRIORITY_COLORS[action.priority]}>
                            {action.priority === 'critical' ? '긴급' : 
                             action.priority === 'high' ? '높음' : 
                             action.priority === 'medium' ? '보통' : '낮음'}
                          </Tag>
                          <Tag color={AUTOMATION_LEVELS[action.automation].color}>
                            {AUTOMATION_LEVELS[action.automation].name}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '4px' }}>
                            <Text>{action.description}</Text>
                          </div>
                          <Space size="small">
                            <Text type="secondary">🕐 {action.scheduledTime}</Text>
                            <Text type="secondary">⏱️ {action.estimatedDuration}</Text>
                            {action.method && (
                              <Text type="secondary">🔧 {action.method.name}</Text>
                            )}
                          </Space>
                          
                          {/* 조건 정보 */}
                          {action.conditions && (
                            <div style={{ marginTop: '8px', fontSize: '12px' }}>
                              <Text type="secondary">
                                현재: {action.conditions.current} → 목표: {action.conditions.target}
                              </Text>
                            </div>
                          )}
                          
                          {/* 실행 결과 */}
                          {action.result && (
                            <Alert
                              message={action.result}
                              type={action.status === 'completed' ? 'success' : 'error'}
                              size="small"
                              style={{ marginTop: '8px' }}
                            />
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">이 날짜에는 예정된 작업이 없습니다.</Text>
            </div>
          )}
        </Modal>
      </div>
    );
  };

  // 예측 및 추천 탭
  const PredictionTab = () => (
    <div>
      {predictionResults && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="예측 신뢰도"
                  value={predictionResults.analysis.summary.avgConfidence}
                  suffix="%"
                  valueStyle={{ color: predictionResults.analysis.summary.avgConfidence > 80 ? '#52c41a' : '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="예상 작업 수"
                  value={predictionResults.analysis.summary.totalActions}
                  suffix="개"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="예상 비용"
                  value={predictionResults.analysis.summary.totalCost}
                  prefix="₩"
                  formatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="위험 일수"
                  value={predictionResults.analysis.summary.criticalDays}
                  suffix="일"
                  valueStyle={{ color: predictionResults.analysis.summary.criticalDays > 2 ? '#ff4d4f' : '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Card title="7일간 환경 예측">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictionResults.environmentPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => dayjs(value).format('MM/DD')} />
                    <YAxis yAxisId="temp" orientation="left" />
                    <YAxis yAxisId="humidity" orientation="right" />
                    <RechartsTooltip 
                      labelFormatter={(value) => dayjs(value).format('MM월 DD일')}
                      formatter={(value, name) => [
                        `${value}${name.includes('온도') ? '°C' : name.includes('습도') ? '%' : ''}`,
                        name
                      ]}
                    />
                    <Legend />
                    <Line 
                      yAxisId="temp"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ff4d4f" 
                      name="예측 온도"
                      strokeWidth={2}
                      dot={{ fill: '#ff4d4f', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      yAxisId="humidity"
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#1890ff" 
                      name="예측 습도"
                      strokeWidth={2}
                      dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card title="추천사항" size="small">
                {predictionResults.recommendations.map((rec, index) => (
                  <Alert
                    key={index}
                    message={rec.title}
                    description={rec.description}
                    type={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}
                    style={{ marginBottom: '8px' }}
                    showIcon
                  />
                ))}
              </Card>

              <Card title="위험 평가" size="small" style={{ marginTop: '16px' }}>
                {predictionResults.riskAssessment.map((risk, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <Tag color={risk.level === 'critical' ? 'red' : risk.level === 'high' ? 'orange' : 'blue'}>
                      {risk.level === 'critical' ? '심각' : risk.level === 'high' ? '높음' : '보통'}
                    </Tag>
                    <Text>{risk.impact}</Text>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>

          <Card title="일별 작업 스케줄" style={{ marginTop: '16px' }}>
            <Timeline>
              {predictionResults.actionSchedule.map((daySchedule, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    daySchedule.actions.some(a => a.urgency === 'critical') ? 
                    <WarningOutlined style={{ color: '#ff4d4f' }} /> :
                    daySchedule.actions.some(a => a.urgency === 'high') ?
                    <ClockCircleOutlined style={{ color: '#faad14' }} /> :
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  }
                  color={
                    daySchedule.actions.some(a => a.urgency === 'critical') ? 'red' :
                    daySchedule.actions.some(a => a.urgency === 'high') ? 'orange' : 'green'
                  }
                >
                  <div>
                    <Text strong>{dayjs(daySchedule.date).format('MM월 DD일 (ddd)')}</Text>
                    <Text type="secondary" style={{ marginLeft: '8px' }}>
                      신뢰도: {Math.round(daySchedule.confidence * 100)}%
                    </Text>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    {daySchedule.actions.map((action, actionIndex) => (
                      <div key={actionIndex} style={{ marginBottom: '4px' }}>
                        <Tag color={action.urgency === 'critical' ? 'red' : action.urgency === 'high' ? 'orange' : 'blue'}>
                          {action.urgency === 'critical' ? '긴급' : action.urgency === 'high' ? '높음' : '보통'}
                        </Tag>
                        <Text>{action.description}</Text>
                        <Text type="secondary" style={{ marginLeft: '8px' }}>
                          ({action.estimatedDuration}, ₩{action.estimatedCost?.toLocaleString()})
                        </Text>
                      </div>
                    ))}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </>
      )}
    </div>
  );

  // 시나리오 시뮬레이션 탭
  const ScenarioSimulationTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="시나리오 선택">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>시나리오 선택</Text>
                  <Select
                    value={selectedScenario}
                    onChange={setSelectedScenario}
                    style={{ width: '100%' }}
                    placeholder="시나리오를 선택하세요"
                  >
                    {Object.keys(DETAILED_SIMULATION_SCENARIOS).map(key => {
                      const scenario = DETAILED_SIMULATION_SCENARIOS[key];
                      return (
                        <Option key={key} value={key}>
                          <Space>
                            <Tag color={SCENARIO_COLORS[scenario.category]}>
                              {scenario.category}
                            </Tag>
                            {scenario.name}
                          </Space>
                        </Option>
                      );
                    })}
                  </Select>
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>현재 주차</Text>
                  <Select
                    value={currentWeek}
                    onChange={setCurrentWeek}
                    style={{ width: '100%' }}
                  >
                    {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                      <Option key={week} value={week}>
                        {week}주차 - {getCurrentStage(week).stage}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
            </Row>

            <div style={{ marginTop: '16px' }}>
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />}
                loading={simulationRunning}
                onClick={runScenarioSimulation}
                size="large"
              >
                시뮬레이션 실행
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {selectedScenario && DETAILED_SIMULATION_SCENARIOS[selectedScenario] && (
            <Card title="선택된 시나리오" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Tag color={SCENARIO_COLORS[DETAILED_SIMULATION_SCENARIOS[selectedScenario].category]}>
                    {DETAILED_SIMULATION_SCENARIOS[selectedScenario].category}
                  </Tag>
                </div>
                <div>
                  <Text strong>난이도: </Text>
                  <Tag color={DIFFICULTY_COLORS[DETAILED_SIMULATION_SCENARIOS[selectedScenario].difficulty]}>
                    {DETAILED_SIMULATION_SCENARIOS[selectedScenario].difficulty === 'easy' ? '쉬움' :
                     DETAILED_SIMULATION_SCENARIOS[selectedScenario].difficulty === 'medium' ? '보통' :
                     DETAILED_SIMULATION_SCENARIOS[selectedScenario].difficulty === 'hard' ? '어려움' : '매우 어려움'}
                  </Tag>
                </div>
                <div>
                  <Text strong>예상 비용: </Text>
                  <Tag color={COST_COLORS[DETAILED_SIMULATION_SCENARIOS[selectedScenario].cost]}>
                    {DETAILED_SIMULATION_SCENARIOS[selectedScenario].cost === 'low' ? '낮음' :
                     DETAILED_SIMULATION_SCENARIOS[selectedScenario].cost === 'medium' ? '보통' :
                     DETAILED_SIMULATION_SCENARIOS[selectedScenario].cost === 'high' ? '높음' : '매우 높음'}
                  </Tag>
                </div>
                <div>
                  <Text strong>소요 기간: </Text>
                  <Text>{DETAILED_SIMULATION_SCENARIOS[selectedScenario].duration}</Text>
                </div>
              </Space>
            </Card>
          )}
        </Col>
      </Row>

      {/* 시나리오 미리보기 */}
      {selectedScenario && DETAILED_SIMULATION_SCENARIOS[selectedScenario] && !scenarioResults && (
        <Card title="시나리오 미리보기" style={{ marginTop: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Alert
                message="문제 상황"
                description={
                  <div style={{ fontSize: '13px', lineHeight: '1.6', marginTop: '8px' }}>
                    {DETAILED_SIMULATION_SCENARIOS[selectedScenario].description.problem}
                  </div>
                }
                type="warning"
                showIcon
                style={{ marginBottom: '12px' }}
              />
            </Col>
            <Col span={24}>
              <Alert
                message="주요 조치사항"
                description={
                  <div style={{ fontSize: '13px', lineHeight: '1.6', marginTop: '8px' }}>
                    {DETAILED_SIMULATION_SCENARIOS[selectedScenario].description.actions.substring(0, 200)}...
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: '12px' }}
              />
            </Col>
            <Col span={24}>
              <Alert
                message="예상 결과"
                description={
                  <div style={{ fontSize: '13px', lineHeight: '1.6', marginTop: '8px' }}>
                    {DETAILED_SIMULATION_SCENARIOS[selectedScenario].description.expectedResults.substring(0, 200)}...
                  </div>
                }
                type="success"
                showIcon
              />
            </Col>
          </Row>
        </Card>
      )}

      {scenarioResults && (
        <div>
          {/* 시나리오 개요 */}
          <Card 
            title={
              <Space>
                <ExperimentOutlined />
                시뮬레이션 결과: {scenarioResults.scenario.name}
                <Tag color={SCENARIO_COLORS[scenarioResults.scenario.category]}>
                  {scenarioResults.scenario.category}
                </Tag>
              </Space>
            }
            style={{ marginBottom: '16px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Statistic
                  title="총 조치사항"
                  value={scenarioResults.summary.totalActions}
                  suffix="개"
                  prefix={<BulbOutlined />}
                />
              </Col>
              <Col xs={24} lg={8}>
                <Statistic
                  title="긴급 조치"
                  value={scenarioResults.summary.urgentActions}
                  suffix="개"
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: scenarioResults.summary.urgentActions > 0 ? '#ff4d4f' : '#52c41a' }}
                />
              </Col>
              <Col xs={24} lg={8}>
                <Statistic
                  title="예상 비용"
                  value={scenarioResults.summary.estimatedCost}
                  prefix="₩"
                  formatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
              </Col>
            </Row>
          </Card>

          {/* 상세 설명 */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card 
                title={
                  <Space>
                    <WarningOutlined style={{ color: '#ff4d4f' }} />
                    <Text strong style={{ fontSize: '16px' }}>문제 상황</Text>
                  </Space>
                }
                size="default"
                style={{ marginBottom: '16px' }}
                headStyle={{ backgroundColor: '#fff2f0', borderBottom: '2px solid #ffccc7' }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.8', 
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '6px',
                  border: '1px solid #f0f0f0'
                }}>
                  <Paragraph style={{ margin: 0, textAlign: 'justify' }}>
                    {scenarioResults.scenario.description.problem}
                  </Paragraph>
                </div>
              </Card>
            </Col>

            <Col span={24}>
              <Card 
                title={
                  <Space>
                    <BulbOutlined style={{ color: '#1890ff' }} />
                    <Text strong style={{ fontSize: '16px' }}>조치사항</Text>
                  </Space>
                }
                size="default"
                style={{ marginBottom: '16px' }}
                headStyle={{ backgroundColor: '#f0f5ff', borderBottom: '2px solid #adc6ff' }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.8', 
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '6px',
                  border: '1px solid #f0f0f0'
                }}>
                  <Paragraph style={{ margin: 0, textAlign: 'justify' }}>
                    {scenarioResults.scenario.description.actions}
                  </Paragraph>
                </div>
              </Card>
            </Col>

            <Col span={24}>
              <Card 
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text strong style={{ fontSize: '16px' }}>예상 결과</Text>
                  </Space>
                }
                size="default"
                headStyle={{ backgroundColor: '#f6ffed', borderBottom: '2px solid #b7eb8f' }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.8', 
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '6px',
                  border: '1px solid #f0f0f0'
                }}>
                  <Paragraph style={{ margin: 0, textAlign: 'justify' }}>
                    {scenarioResults.scenario.description.expectedResults}
                  </Paragraph>
                </div>

                {/* 추가 정보 */}
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0f2f5', borderRadius: '6px' }}>
                      <Text strong>소요 기간</Text>
                      <div style={{ fontSize: '16px', color: '#1890ff', marginTop: '4px' }}>
                        {scenarioResults.scenario.duration}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0f2f5', borderRadius: '6px' }}>
                      <Text strong>난이도</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Tag color={DIFFICULTY_COLORS[scenarioResults.scenario.difficulty]} style={{ fontSize: '14px' }}>
                          {scenarioResults.scenario.difficulty === 'easy' ? '쉬움' :
                           scenarioResults.scenario.difficulty === 'medium' ? '보통' :
                           scenarioResults.scenario.difficulty === 'hard' ? '어려움' : '매우 어려움'}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0f2f5', borderRadius: '6px' }}>
                      <Text strong>비용 수준</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Tag color={COST_COLORS[scenarioResults.scenario.cost]} style={{ fontSize: '14px' }}>
                          {scenarioResults.scenario.cost === 'low' ? '낮음' :
                           scenarioResults.scenario.cost === 'medium' ? '보통' :
                           scenarioResults.scenario.cost === 'high' ? '높음' : '매우 높음'}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );

  // 헬퍼 함수들
  const getDayStatus = (actions) => {
    const criticalCount = actions.filter(a => a.priority === 'critical').length;
    const highCount = actions.filter(a => a.priority === 'high').length;
    
    if (criticalCount > 0) return 'critical';
    if (highCount > 2) return 'busy';
    if (actions.length > 5) return 'normal';
    return 'light';
  };

  const calculateAutomationRate = (actions) => {
    if (actions.length === 0) return 0;
    
    const automationScores = { full: 1, semi: 0.5, manual: 0 };
    const totalScore = actions.reduce((sum, action) => {
      return sum + (automationScores[action.automation] || 0);
    }, 0);
    
    return Math.round((totalScore / actions.length) * 100);
  };

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

  const getActionStatusIcon = (status) => {
    const iconMap = {
      pending: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      in_progress: <PlayCircleOutlined style={{ color: '#1890ff' }} />,
      completed: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      failed: <WarningOutlined style={{ color: '#ff4d4f' }} />
    };
    return iconMap[status] || iconMap.pending;
  };

  const getCurrentStage = (week) => {
    const strawberryStages = GROWTH_STAGES.strawberry;
    return strawberryStages.find(stage => 
      week >= stage.weeks[0] && week <= stage.weeks[1]
    ) || strawberryStages[0];
  };

  const calculateWeeklyAverage = (weekData) => {
    if (!weekData || weekData.length === 0) return {};
    
    const avg = {};
    const fields = ['temperature', 'humidity', 'co2', 'lightIntensity', 'soilMoisture'];
    
    fields.forEach(field => {
      const values = weekData.map(d => d[field]).filter(v => v !== null && v !== undefined);
      avg[field] = values.length > 0 ? 
        Math.round(values.reduce((sum, val) => sum + val, 0) / values.length * 10) / 10 : 0;
    });
    
    return avg;
  };

  const showDayDetails = (dayData) => {
    Modal.info({
      title: `${dayjs(dayData.date).format('MM월 DD일')} 상세 정보`,
      width: 600,
      content: (
        <div>
          <Descriptions column={2} size="small" style={{ marginBottom: '16px' }}>
            <Descriptions.Item label="평균 온도">{dayData.avgTemperature.toFixed(1)}°C</Descriptions.Item>
            <Descriptions.Item label="평균 습도">{dayData.avgHumidity.toFixed(1)}%</Descriptions.Item>
            <Descriptions.Item label="평균 광량">{dayData.avgLightIntensity.toFixed(0)} lux</Descriptions.Item>
            <Descriptions.Item label="토양 수분">{dayData.avgSoilMoisture.toFixed(1)}%</Descriptions.Item>
            <Descriptions.Item label="날씨">{dayData.weatherCondition}</Descriptions.Item>
            <Descriptions.Item label="환경 상태">
              <Tag color={dayData.status === 'optimal' ? 'green' : dayData.status === 'normal' ? 'blue' : dayData.status === 'warning' ? 'orange' : 'red'}>
                {dayData.status === 'optimal' ? '최적' : dayData.status === 'normal' ? '정상' : dayData.status === 'warning' ? '주의' : '위험'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
          
          {dayData.requiredActions.length > 0 && (
            <div>
              <Text strong>필요 조치사항:</Text>
              <ul style={{ marginTop: '8px' }}>
                {dayData.requiredActions.map((action, index) => (
                  <li key={index}>
                    <Tag color={action.priority === 'high' ? 'red' : 'blue'}>
                      {action.priority === 'high' ? '높음' : '보통'}
                    </Tag>
                    {action.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={2}>
              <ExperimentOutlined /> 
              {selectedGreenhouse ? `${selectedGreenhouse.name} 환경 시뮬레이터` : '온실 환경 시뮬레이터'}
            </Title>
            <Space>
              <Text type="secondary">
                {selectedGreenhouse ? 
                  `${selectedGreenhouse.description} | ${selectedGreenhouse.area}㎡ | ${selectedGreenhouse.currentWeek}주차` :
                  '가상 온실 환경에서 다양한 시나리오를 시뮬레이션하고 미래 작업을 예측합니다'
                }
              </Text>
              {selectedGreenhouse && (
                <Tag color="blue">{selectedGreenhouse.cropName}</Tag>
              )}
            </Space>
          </div>
          <Button 
            onClick={() => navigate('/cultivation/greenhouse-overview')}
            icon={<BarChartOutlined />}
          >
            전체 하우스 보기
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'action_calendar',
            label: <span><CalendarOutlined />작업 달력</span>,
            children: <ActionCalendarTab />
          },
          {
            key: 'weekly',
            label: <span><BarChartOutlined />주차별 모니터링</span>,
            children: <WeeklyEnvironmentTab />
          },
          {
            key: 'prediction',
            label: <span><BulbOutlined />예측 및 추천</span>,
            children: <PredictionTab />
          },
          {
            key: 'scenario',
            label: <span><SettingOutlined />시나리오 시뮬레이션</span>,
            children: <ScenarioSimulationTab />
          }
        ]}
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>데이터를 생성하고 있습니다...</Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreenhouseSimulator;
