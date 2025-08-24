import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Calendar, 
  Badge, 
  Modal, 
  List, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Progress, 
  Statistic,
  Row,
  Col,
  Alert,
  Tooltip,
  Spin,
  message,
  Descriptions,
  Timeline
} from 'antd';
import {
  CalendarOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  RobotOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  generateDailyActionSchedule,
  executeAction,
  updateActionStatus,
  calculateDayProgress,
  AUTOMATED_ACTIONS,
  AUTOMATION_LEVELS,
  ACTION_CATEGORY_COLORS,
  ACTION_PRIORITY_COLORS,
  DAY_STATUS_COLORS
} from '../../utils/actionCalendar';
import { GREENHOUSE_DATA } from '../../utils/greenhouseManager';

const { Title, Text } = Typography;

const ActionCalendar = () => {
  const { greenhouseId } = useParams();
  const navigate = useNavigate();
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [actionSchedule, setActionSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayActions, setSelectedDayActions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [executingActions, setExecutingActions] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (greenhouseId && GREENHOUSE_DATA[greenhouseId]) {
      const greenhouse = GREENHOUSE_DATA[greenhouseId];
      setSelectedGreenhouse(greenhouse);
      loadActionSchedule(greenhouseId);
    } else {
      navigate('/cultivation/greenhouse-overview');
    }
  }, [greenhouseId, navigate]);

  const loadActionSchedule = (greenhouseId) => {
    setLoading(true);
    try {
      const schedule = generateDailyActionSchedule(
        greenhouseId, 
        new Date().toISOString().split('T')[0], 
        30
      );
      setActionSchedule(schedule);
    } finally {
      setLoading(false);
    }
  };

  // 달력 날짜 셀 렌더링
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayData = actionSchedule.find(day => day.date === dateStr);
    
    if (!dayData) return null;

    const progress = calculateDayProgress(dayData.actions);
    const statusColor = DAY_STATUS_COLORS[dayData.status];

    return (
      <div style={{ fontSize: '11px', lineHeight: '1.2' }}>
        {/* 작업 개수 배지 */}
        <div style={{ marginBottom: '2px' }}>
          <Badge 
            count={dayData.totalActions} 
            size="small"
            style={{ backgroundColor: statusColor }}
          />
          {dayData.urgentActions > 0 && (
            <Badge 
              count={dayData.urgentActions} 
              size="small"
              style={{ backgroundColor: '#ff4d4f', marginLeft: '2px' }}
            />
          )}
        </div>
        
        {/* 진행률 */}
        <Progress 
          percent={progress} 
          size="small" 
          showInfo={false}
          strokeColor={progress === 100 ? '#52c41a' : '#1890ff'}
        />
        
        {/* 자동화율 */}
        <div style={{ color: '#666', fontSize: '9px', marginTop: '1px' }}>
          🤖 {dayData.automationRate}%
        </div>
      </div>
    );
  };

  // 날짜 선택 시 상세 모달 표시
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
      message.loading(`${action.name} 실행 중...`, 0);
      
      const result = await executeAction(action.id, greenhouseId);
      
      message.destroy();
      
      if (result.success) {
        message.success(`${action.name} 완료! (소요시간: ${result.duration}분)`);
        
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
      } else {
        message.error(`${action.name} 실행 실패: ${result.result}`);
      }
    } catch (error) {
      message.destroy();
      message.error(`작업 실행 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(action.id);
        return newSet;
      });
    }
  };

  // 작업 상태별 아이콘
  const getActionStatusIcon = (status) => {
    const iconMap = {
      pending: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      in_progress: <PlayCircleOutlined style={{ color: '#1890ff' }} />,
      completed: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      failed: <WarningOutlined style={{ color: '#ff4d4f' }} />
    };
    return iconMap[status] || iconMap.pending;
  };

  // 작업 상태별 텍스트
  const getActionStatusText = (status) => {
    const textMap = {
      pending: '대기',
      in_progress: '진행중',
      completed: '완료',
      failed: '실패'
    };
    return textMap[status] || '대기';
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={2}>
              <CalendarOutlined /> 
              {selectedGreenhouse ? `${selectedGreenhouse.name} 작업 달력` : '작업 달력'}
            </Title>
            <Space>
              <Text type="secondary">
                {selectedGreenhouse ? 
                  `${selectedGreenhouse.description} | 자동화 시스템 기반 작업 관리` :
                  '자동화 시스템 기반 작업 스케줄 관리'
                }
              </Text>
              {selectedGreenhouse && (
                <Tag color="blue">{selectedGreenhouse.cropName}</Tag>
              )}
            </Space>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => loadActionSchedule(greenhouseId)}
              loading={loading}
            >
              새로고침
            </Button>
            <Button 
              onClick={() => navigate('/cultivation/greenhouse-overview')}
            >
              하우스 목록
            </Button>
          </Space>
        </div>
      </div>

      {/* 작업 요약 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 작업 수"
              value={actionSchedule.reduce((sum, day) => sum + day.totalActions, 0)}
              suffix="개"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="긴급 작업"
              value={actionSchedule.reduce((sum, day) => sum + day.urgentActions, 0)}
              suffix="개"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="평균 자동화율"
              value={actionSchedule.length > 0 ? 
                Math.round(actionSchedule.reduce((sum, day) => sum + day.automationRate, 0) / actionSchedule.length) : 0}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="전체 진행률"
              value={actionSchedule.length > 0 ? 
                Math.round(actionSchedule.reduce((sum, day) => sum + calculateDayProgress(day.actions), 0) / actionSchedule.length) : 0}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 달력 */}
      <Card title="📅 작업 달력" loading={loading}>
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Tag color={DAY_STATUS_COLORS.light}>가벼운 작업일</Tag>
            <Tag color={DAY_STATUS_COLORS.normal}>보통 작업일</Tag>
            <Tag color={DAY_STATUS_COLORS.busy}>바쁜 작업일</Tag>
            <Tag color={DAY_STATUS_COLORS.critical}>긴급 작업일</Tag>
            <Text type="secondary">• 배지: 총 작업 수 / 긴급 작업 수</Text>
            <Text type="secondary">• 진행률: 작업 완료 정도</Text>
            <Text type="secondary">• 🤖: 자동화율</Text>
          </Space>
        </div>
        
        <Calendar
          dateCellRender={dateCellRender}
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
        width={800}
        footer={null}
      >
        {selectedDayActions.length > 0 ? (
          <div>
            {/* 하루 요약 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col span={8}>
                <Statistic
                  title="총 작업"
                  value={selectedDayActions.length}
                  suffix="개"
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="자동화율"
                  value={calculateAutomationRate(selectedDayActions)}
                  suffix="%"
                  valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="진행률"
                  value={calculateDayProgress(selectedDayActions)}
                  suffix="%"
                  valueStyle={{ fontSize: '16px', color: '#1890ff' }}
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
                          onClick={() => handleExecuteAction(action)}
                        >
                          반자동 실행
                        </Button>
                      )}
                      {action.automation === 'manual' && action.status === 'pending' && (
                        <Button
                          type="dashed"
                          size="small"
                          onClick={() => message.info('수동 작업은 현장에서 직접 수행해주세요')}
                        >
                          수동 작업
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
                        <Text strong style={{ color: ACTION_CATEGORY_COLORS[action.type] || '#1890ff' }}>
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

            {/* 일괄 실행 버튼 */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
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
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">이 날짜에는 예정된 작업이 없습니다.</Text>
          </div>
        )}
      </Modal>

      {/* 자동화 시스템 상태 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card title="🤖 자동화 시스템 상태">
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.keys(AUTOMATED_ACTIONS).slice(0, 6).map(actionKey => {
                const actionConfig = AUTOMATED_ACTIONS[actionKey];
                const isActive = Math.random() > 0.3; // 70% 확률로 활성 상태
                
                return (
                  <div key={actionKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <Text>{actionConfig.name}</Text>
                      <Tag color={ACTION_CATEGORY_COLORS[actionConfig.category]}>
                        {actionConfig.category}
                      </Tag>
                    </Space>
                    <Tag color={isActive ? 'success' : 'default'}>
                      {isActive ? '활성' : '대기'}
                    </Tag>
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📊 작업 통계 (이번 주)">
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Statistic
                  title="완료된 작업"
                  value={actionSchedule.slice(0, 7).reduce((sum, day) => 
                    sum + day.actions.filter(a => a.status === 'completed').length, 0
                  )}
                  suffix="개"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="대기 중 작업"
                  value={actionSchedule.slice(0, 7).reduce((sum, day) => 
                    sum + day.actions.filter(a => a.status === 'pending').length, 0
                  )}
                  suffix="개"
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="자동 실행률"
                  value={actionSchedule.slice(0, 7).length > 0 ? 
                    Math.round(actionSchedule.slice(0, 7).reduce((sum, day) => sum + day.automationRate, 0) / 7) : 0}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="평균 작업 시간"
                  value={actionSchedule.slice(0, 7).reduce((sum, day) => 
                    sum + (day.estimatedDuration?.hours || 0), 0
                  )}
                  suffix="시간"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 향후 7일간 중요 작업 미리보기 */}
      <Card title="📋 향후 7일간 주요 작업" style={{ marginTop: '16px' }}>
        <Timeline>
          {actionSchedule.slice(0, 7).map((day, index) => {
            const urgentActions = day.actions.filter(action => 
              action.priority === 'critical' || action.priority === 'high'
            );
            
            return (
              <Timeline.Item
                key={day.date}
                color={DAY_STATUS_COLORS[day.status]}
                dot={urgentActions.length > 0 ? <WarningOutlined /> : <CheckCircleOutlined />}
              >
                <div>
                  <Text strong>
                    {dayjs(day.date).format('MM월 DD일 (ddd)')}
                  </Text>
                  <Text style={{ marginLeft: '8px', color: '#666' }}>
                    총 {day.totalActions}개 작업
                  </Text>
                </div>
                {urgentActions.length > 0 && (
                  <div style={{ marginTop: '4px' }}>
                    {urgentActions.slice(0, 3).map(action => (
                      <Tag 
                        key={action.id}
                        color={ACTION_PRIORITY_COLORS[action.priority]}
                        style={{ marginBottom: '2px' }}
                      >
                        {action.name}
                      </Tag>
                    ))}
                    {urgentActions.length > 3 && (
                      <Text type="secondary">외 {urgentActions.length - 3}개</Text>
                    )}
                  </div>
                )}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>
    </div>
  );
};

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

const getActionStatusIcon = (status) => {
  const iconMap = {
    pending: <ClockCircleOutlined style={{ color: '#faad14' }} />,
    in_progress: <PlayCircleOutlined style={{ color: '#1890ff' }} />,
    completed: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    failed: <WarningOutlined style={{ color: '#ff4d4f' }} />
  };
  return iconMap[status] || iconMap.pending;
};

export default ActionCalendar;
