import React, { useState, useEffect } from 'react';
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
  BulbOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import dayjs from 'dayjs';
import {
  generateWeeklyEnvironmentData,
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
  AUTOMATED_ACTION_TYPES
} from '../../utils/actionCalendar';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const GreenhouseSimulator = ({ greenhouse, isModal = false }) => {
  const [loading, setLoading] = useState(false);
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
    if (greenhouse) {
      loadSimulatorData();
    }
  }, [greenhouse]);

  const loadSimulatorData = async () => {
    try {
      setLoading(true);
      
      const selectedGreenhouse = GREENHOUSE_DATA[greenhouse.id] || greenhouse;
      
      // 센서 데이터 안전하게 접근
      const sensors = selectedGreenhouse?.sensors || greenhouse?.sensors || {};
      
      // 주차별 환경 데이터 생성
      const weeklyEnvironmentData = generateWeeklyEnvironmentData(16, sensors);
      setWeeklyData(weeklyEnvironmentData);

      // 월별 환경 데이터 생성
      const year = selectedMonth.year();
      const month = selectedMonth.month() + 1;
      const monthlyEnvironmentData = generateMonthlyEnvironmentSummary(year, month, sensors);
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

  // 예측 및 추천 실행
  const runPrediction = async () => {
    try {
      setLoading(true);
      const currentEnvironment = greenhouse?.sensors || {};
      const predictions = await predictionEngine.generatePredictions(currentEnvironment);
      setPredictionResults(predictions);
      message.success('예측 분석이 완료되었습니다.');
    } catch (error) {
      message.error('예측 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 시나리오 시뮬레이션 실행
  const runScenarioSimulation = async (scenarioKey) => {
    try {
      setLoading(true);
      const scenario = DETAILED_SIMULATION_SCENARIOS[scenarioKey];
      const results = await runGreenhouseSimulation(scenario, greenhouse?.sensors || {});
      setScenarioResults({ scenario, results });
      message.success(`${scenario.title} 시나리오 시뮬레이션이 완료되었습니다.`);
    } catch (error) {
      message.error('시나리오 시뮬레이션 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 작업 달력 탭
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
                  borderRadius: '2px'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: statusColor,
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // 날짜 선택 처리
    const onDateSelect = (date) => {
      const dateStr = date.format('YYYY-MM-DD');
      const dayData = actionSchedule.find(day => day.date === dateStr);
      
      if (dayData) {
        setSelectedDate(date);
        setSelectedDayActions(dayData.actions);
        setModalVisible(true);
      }
    };

    // 작업 실행
    const handleExecuteAction = async (actionId) => {
      try {
        setExecutingActions(prev => new Set([...prev, actionId]));
        
        // 실제 작업 실행 로직 (시뮬레이션)
        await executeAction(actionId);
        
        // 작업 상태 업데이트
        const updatedActions = selectedDayActions.map(action => 
          action.id === actionId 
            ? { ...action, status: 'completed', completedAt: new Date().toISOString() }
            : action
        );
        setSelectedDayActions(updatedActions);
        
        // 전체 스케줄 업데이트
        const updatedSchedule = actionSchedule.map(day => {
          if (day.date === selectedDate.format('YYYY-MM-DD')) {
            return {
              ...day,
              actions: updatedActions,
              completedActions: updatedActions.filter(a => a.status === 'completed').length
            };
          }
          return day;
        });
        setActionSchedule(updatedSchedule);
        
        message.success('작업이 완료되었습니다.');
      } catch (error) {
        message.error('작업 실행 중 오류가 발생했습니다.');
      } finally {
        setExecutingActions(prev => {
          const newSet = new Set(prev);
          newSet.delete(actionId);
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
              <Tag color={DAY_STATUS_COLORS.critical}>집중 관리일</Tag>
            </Space>
          </div>
          
          <Calendar
            cellRender={dateCellRender}
            onSelect={onDateSelect}
          />
        </Card>

        {/* 작업 상세 모달 */}
        <Modal
          title={`${selectedDate?.format('YYYY년 MM월 DD일')} 작업 목록`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={null}
        >
          <List
            dataSource={selectedDayActions}
            renderItem={action => (
              <List.Item
                actions={[
                  <Button
                    key="execute"
                    type={action.status === 'completed' ? 'default' : 'primary'}
                    icon={action.status === 'completed' ? <CheckCircleOutlined /> : <RobotOutlined />}
                    loading={executingActions.has(action.id)}
                    disabled={action.status === 'completed' || !AUTOMATED_ACTION_TYPES.includes(action.type)}
                    onClick={() => handleExecuteAction(action.id)}
                  >
                    {action.status === 'completed' ? '완료됨' : '수행'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{action.name}</span>
                      <Tag color={ACTION_CATEGORY_COLORS[action.category]}>
                        {action.category}
                      </Tag>
                      <Tag color={ACTION_PRIORITY_COLORS[action.priority]}>
                        {action.priority}
                      </Tag>
                      {action.automation === 'full' && (
                        <Tag color="green">자동화</Tag>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <div>{action.description}</div>
                      <div style={{ marginTop: '8px' }}>
                        <Space>
                          <Text type="secondary">⏰ {action.scheduledTime}</Text>
                          <Text type="secondary">⏱️ {action.estimatedDuration}</Text>
                          {action.completedAt && (
                            <Text type="success">✅ {new Date(action.completedAt).toLocaleTimeString()}</Text>
                          )}
                        </Space>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Modal>
      </div>
    );
  };

  const tabItems = [
    {
      key: 'calendar',
      label: '📅 작업 달력',
      children: <ActionCalendarTab />
    },
    {
      key: 'monitoring',
      label: '📊 주차별 모니터링',
      children: (
        <Card title="주차별 환경 모니터링" loading={loading}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="temp" orientation="left" />
              <YAxis yAxisId="humidity" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#ff4d4f" name="온도 (°C)" />
              <Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="#1890ff" name="습도 (%)" />
              <Line yAxisId="temp" type="monotone" dataKey="co2" stroke="#52c41a" name="CO2 (ppm)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )
    },
    {
      key: 'prediction',
      label: '🔮 예측 및 추천',
      children: (
        <div>
          <Card title="AI 예측 분석" style={{ marginBottom: '16px' }}>
            <Space style={{ marginBottom: '16px' }}>
              <Button 
                type="primary" 
                icon={<ThunderboltOutlined />}
                onClick={runPrediction}
                loading={loading}
              >
                예측 실행
              </Button>
            </Space>
            
            {predictionResults && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Alert
                    message="예측 결과"
                    description={predictionResults.summary}
                    type="info"
                    showIcon
                  />
                </Col>
              </Row>
            )}
          </Card>
        </div>
      )
    },
    {
      key: 'scenario',
      label: '🎯 시나리오 시뮬레이션',
      children: (
        <div>
          <Card title="시나리오 선택" style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="시나리오를 선택하세요"
                  onChange={runScenarioSimulation}
                >
                  {Object.keys(DETAILED_SIMULATION_SCENARIOS).map(key => {
                    const scenario = DETAILED_SIMULATION_SCENARIOS[key];
                    return (
                      <Option key={key} value={key}>
                        <Space>
                          <Tag color={SCENARIO_COLORS[scenario.category]}>
                            {scenario.category}
                          </Tag>
                          <span>{scenario.title}</span>
                        </Space>
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          </Card>

          {scenarioResults && (
            <Card title={`시나리오: ${scenarioResults.scenario.title}`}>
              <Descriptions column={2}>
                <Descriptions.Item label="카테고리">
                  <Tag color={SCENARIO_COLORS[scenarioResults.scenario.category]}>
                    {scenarioResults.scenario.category}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="난이도">
                  <Tag color={DIFFICULTY_COLORS[scenarioResults.scenario.difficulty]}>
                    {scenarioResults.scenario.difficulty}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="예상 비용">
                  <Tag color={COST_COLORS[scenarioResults.scenario.cost]}>
                    {scenarioResults.scenario.cost}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="소요 시간">
                  {scenarioResults.scenario.duration}
                </Descriptions.Item>
              </Descriptions>
              
              <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong style={{ color: '#ff4d4f' }}>🚨 문제 상황:</Text>
                  <Paragraph style={{ marginTop: '8px', marginLeft: '16px' }}>
                    {scenarioResults.scenario.description?.problem || '문제 상황 정보가 없습니다.'}
                  </Paragraph>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <Text strong style={{ color: '#1890ff' }}>🔧 조치 사항:</Text>
                  <Paragraph style={{ marginTop: '8px', marginLeft: '16px' }}>
                    {scenarioResults.scenario.description?.actions || '조치 사항 정보가 없습니다.'}
                  </Paragraph>
                </div>
                
                <div>
                  <Text strong style={{ color: '#52c41a' }}>📈 예상 결과:</Text>
                  <Paragraph style={{ marginTop: '8px', marginLeft: '16px' }}>
                    {scenarioResults.scenario.description?.expectedResults || '예상 결과 정보가 없습니다.'}
                  </Paragraph>
                </div>
              </div>
            </Card>
          )}
        </div>
      )
    }
  ];

  if (!greenhouse) {
    return <div>온실 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: isModal ? 0 : '24px' }}>
      {!isModal && (
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            🏠 {greenhouse.name} 상세 관리
          </Title>
          <Text type="secondary">온실의 상세 환경 및 작업 관리</Text>
        </div>
      )}

      <Tabs items={tabItems} />
    </div>
  );
};

export default GreenhouseSimulator;
