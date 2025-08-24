import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  List,
  Calendar,
  Badge,
  Modal,
  Tooltip,
  Progress,
  Statistic,
  Tabs,
  Select,
  DatePicker,
  message
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  RobotOutlined,
  BellOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getFilteredGreenhouses } from '../../utils/greenhouseManager';
import { 
  generateDailyActionSchedule,
  executeAction,
  ACTION_CATEGORY_COLORS,
  ACTION_PRIORITY_COLORS,
  DAY_STATUS_COLORS,
  AUTOMATED_ACTION_TYPES
} from '../../utils/actionCalendar';

const { Title, Text } = Typography;
const { Option } = Select;

const ManagerTasks = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('all');
  const [taskSchedule, setTaskSchedule] = useState([]);
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [executingTasks, setExecutingTasks] = useState(new Set());
  const [greenhouses, setGreenhouses] = useState([]);

  useEffect(() => {
    loadTaskData();
  }, [selectedDate, selectedGreenhouse]);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      
      // 담당 온실들 조회
      const assignedGreenhouses = getFilteredGreenhouses('manager', 'manager_kim');
      setGreenhouses(assignedGreenhouses);
      
      // 선택된 날짜 기준으로 30일간의 작업 스케줄 생성
      const schedule = [];
      const startDate = selectedDate.format('YYYY-MM-DD');
      
      const targetGreenhouses = selectedGreenhouse === 'all' 
        ? assignedGreenhouses 
        : assignedGreenhouses.filter(gh => gh.id === selectedGreenhouse);
      
      targetGreenhouses.forEach(greenhouse => {
        const greenhouseSchedule = generateDailyActionSchedule(greenhouse.id, startDate, 30);
        greenhouseSchedule.forEach(daySchedule => {
          const existingDay = schedule.find(day => day.date === daySchedule.date);
          if (existingDay) {
            existingDay.actions.push(...daySchedule.actions.map(action => ({
              ...action,
              greenhouse: greenhouse.name
            })));
            existingDay.totalActions += daySchedule.totalActions;
            existingDay.urgentActions += daySchedule.urgentActions;
          } else {
            schedule.push({
              ...daySchedule,
              actions: daySchedule.actions.map(action => ({
                ...action,
                greenhouse: greenhouse.name
              }))
            });
          }
        });
      });
      
      // 날짜순 정렬
      schedule.sort((a, b) => new Date(a.date) - new Date(b.date));
      setTaskSchedule(schedule);
      
      // 선택된 날짜의 작업들
      const selectedDateStr = selectedDate.format('YYYY-MM-DD');
      const dayTasks = schedule.find(day => day.date === selectedDateStr);
      setSelectedDayTasks(dayTasks?.actions || []);
      
    } catch (error) {
      console.error('작업 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = date.format('YYYY-MM-DD');
    const dayTasks = taskSchedule.find(day => day.date === dateStr);
    setSelectedDayTasks(dayTasks?.actions || []);
    setModalVisible(true);
  };

  const handleExecuteTask = async (taskId) => {
    try {
      setExecutingTasks(prev => new Set([...prev, taskId]));
      
      // 작업 실행 시뮬레이션
      await executeAction(taskId);
      
      // 작업 상태 업데이트
      const updatedTasks = selectedDayTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
          : task
      );
      setSelectedDayTasks(updatedTasks);
      
      message.success('작업이 완료되었습니다.');
    } catch (error) {
      message.error('작업 실행 중 오류가 발생했습니다.');
    } finally {
      setExecutingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // 달력 셀 렌더링
  const dateCellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;
    
    const dateStr = current.format('YYYY-MM-DD');
    const dayData = taskSchedule.find(day => day.date === dateStr);
    
    if (!dayData || dayData.totalActions === 0) return info.originNode;

    const statusColor = DAY_STATUS_COLORS[dayData.status] || '#1890ff';

    return (
      <div className="ant-picker-cell-inner ant-picker-calendar-date">
        <div className="ant-picker-calendar-date-value">{current.date()}</div>
        <div className="ant-picker-calendar-date-content">
          <div style={{ fontSize: '10px', lineHeight: '1.1' }}>
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
          </div>
        </div>
      </div>
    );
  };

  // 오늘 작업 통계
  const todayTasks = selectedDayTasks;
  const taskStats = {
    total: todayTasks.length,
    completed: todayTasks.filter(task => task.status === 'completed').length,
    pending: todayTasks.filter(task => task.status === 'pending').length,
    urgent: todayTasks.filter(task => task.priority === 'critical' || task.priority === 'high').length,
    automated: todayTasks.filter(task => AUTOMATED_ACTION_TYPES.includes(task.type)).length
  };

  const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>📋 작업 관리</Title>
        <Text type="secondary">담당 온실의 일정과 작업을 관리하세요</Text>
      </div>

      {/* 필터 및 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>온실 선택</Text>
              <Select
                style={{ width: '100%' }}
                value={selectedGreenhouse}
                onChange={setSelectedGreenhouse}
              >
                <Option value="all">전체 온실</Option>
                {greenhouses.map(greenhouse => (
                  <Option key={greenhouse.id} value={greenhouse.id}>
                    {greenhouse.name}
                  </Option>
                ))}
              </Select>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="총 작업"
                  value={taskStats.total}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="완료"
                  value={taskStats.completed}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="긴급"
                  value={taskStats.urgent}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="자동화"
                  value={taskStats.automated}
                  prefix={<RobotOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 진행률 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title={`${selectedDate.format('YYYY년 MM월 DD일')} 작업 진행률`}>
            <Progress 
              percent={completionRate} 
              strokeColor="#52c41a"
              format={() => `${taskStats.completed}/${taskStats.total} 완료`}
            />
            <div style={{ marginTop: '8px' }}>
              <Space>
                <Text type="secondary">완료: {taskStats.completed}개</Text>
                <Text type="secondary">대기: {taskStats.pending}개</Text>
                <Text type="secondary">긴급: {taskStats.urgent}개</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 작업 달력 */}
        <Col xs={24} lg={16}>
          <Card title="📅 작업 달력" loading={loading}>
            <Calendar
              cellRender={dateCellRender}
              onSelect={handleDateSelect}
              value={selectedDate}
            />
          </Card>
        </Col>

        {/* 선택된 날짜의 작업 목록 */}
        <Col xs={24} lg={8}>
          <Card 
            title={`${selectedDate.format('MM/DD')} 작업 목록`}
            extra={
              <Badge count={taskStats.total} showZero>
                <BellOutlined />
              </Badge>
            }
            loading={loading}
          >
            <List
              itemLayout="vertical"
              size="small"
              dataSource={todayTasks.slice(0, 8)}
              renderItem={task => (
                <List.Item
                  actions={[
                    <Button
                      key="execute"
                      type={task.status === 'completed' ? 'default' : 'primary'}
                      size="small"
                      icon={task.status === 'completed' ? <CheckCircleOutlined /> : <PlayCircleOutlined />}
                      loading={executingTasks.has(task.id)}
                      disabled={task.status === 'completed' || !AUTOMATED_ACTION_TYPES.includes(task.type)}
                      onClick={() => handleExecuteTask(task.id)}
                    >
                      {task.status === 'completed' ? '완료' : '실행'}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <span style={{ fontSize: '13px' }}>{task.name}</span>
                        <Tag 
                          size="small" 
                          color={ACTION_PRIORITY_COLORS[task.priority]}
                        >
                          {task.priority}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          {task.description}
                        </div>
                        <Space size="small">
                          <Tag size="small" color={ACTION_CATEGORY_COLORS[task.category]}>
                            {task.category}
                          </Tag>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {task.greenhouse}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {task.scheduledTime}
                          </Text>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            
            {todayTasks.length > 8 && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button type="link" onClick={() => setModalVisible(true)}>
                  전체 {todayTasks.length}개 작업 보기
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 작업 상세 모달 */}
      <Modal
        title={`${selectedDate.format('YYYY년 MM월 DD일')} 전체 작업`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedDayTasks}
          renderItem={task => (
            <List.Item
              actions={[
                <Button
                  key="execute"
                  type={task.status === 'completed' ? 'default' : 'primary'}
                  icon={task.status === 'completed' ? <CheckCircleOutlined /> : <RobotOutlined />}
                  loading={executingTasks.has(task.id)}
                  disabled={task.status === 'completed' || !AUTOMATED_ACTION_TYPES.includes(task.type)}
                  onClick={() => handleExecuteTask(task.id)}
                >
                  {task.status === 'completed' ? '완료됨' : '실행'}
                </Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <span>{task.name}</span>
                    <Tag color={ACTION_CATEGORY_COLORS[task.category]}>
                      {task.category}
                    </Tag>
                    <Tag color={ACTION_PRIORITY_COLORS[task.priority]}>
                      {task.priority}
                    </Tag>
                    {task.automation === 'full' && (
                      <Tag color="green">자동화</Tag>
                    )}
                  </Space>
                }
                description={
                  <div>
                    <div>{task.description}</div>
                    <div style={{ marginTop: '8px' }}>
                      <Space>
                        <Text type="secondary">🏠 {task.greenhouse}</Text>
                        <Text type="secondary">⏰ {task.scheduledTime}</Text>
                        <Text type="secondary">⏱️ {task.estimatedDuration}</Text>
                        {task.completedAt && (
                          <Text type="success">✅ {new Date(task.completedAt).toLocaleTimeString()}</Text>
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

export default ManagerTasks;
