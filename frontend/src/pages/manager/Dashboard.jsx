import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Space,
  Timeline,
  Alert,
  Tag,
  List,
  Avatar,
  Badge,
  Calendar,
  Tooltip
} from 'antd';
import {
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  TrophyOutlined,
  CalendarOutlined,
  DashboardOutlined
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
  ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import { getFilteredGreenhouses } from '../../utils/greenhouseManager';
import { generateDailyActionSchedule } from '../../utils/actionCalendar';

const { Title, Text } = Typography;

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    assignedGreenhouses: [],
    todayTasks: [],
    weeklyPerformance: [],
    recentActivities: [],
    alerts: [],
    environmentData: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 재배관리자에게 할당된 온실들 조회 (예: manager_kim)
      const assignedGreenhouses = getFilteredGreenhouses('manager', 'manager_kim');
      
      // 오늘의 작업 목록 생성
      const todayTasks = [];
      const today = new Date().toISOString().split('T')[0];
      
      assignedGreenhouses.forEach(greenhouse => {
        const schedule = generateDailyActionSchedule(greenhouse.id, today, 1);
        if (schedule.length > 0) {
          todayTasks.push(...schedule[0].actions.slice(0, 5)); // 상위 5개 작업만
        }
      });

      // 주간 성과 데이터 생성
      const weeklyPerformance = [];
      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day');
        weeklyPerformance.push({
          date: date.format('MM/DD'),
          completedTasks: Math.floor(Math.random() * 15) + 10,
          efficiency: Math.floor(Math.random() * 20) + 75,
          issues: Math.floor(Math.random() * 3)
        });
      }

      // 환경 데이터 (최근 24시간)
      const environmentData = [];
      for (let i = 23; i >= 0; i--) {
        const hour = dayjs().subtract(i, 'hour');
        environmentData.push({
          time: hour.format('HH:mm'),
          temperature: 22 + Math.sin(i * 0.3) * 3 + (Math.random() - 0.5) * 2,
          humidity: 65 + Math.cos(i * 0.2) * 10 + (Math.random() - 0.5) * 5,
          soilMoisture: 60 + (Math.random() - 0.5) * 10
        });
      }

      // 최근 활동
      const recentActivities = [
        { id: 1, type: 'task', message: '1번 온실 온도 조절 완료', time: '30분 전', status: 'completed' },
        { id: 2, type: 'alert', message: '2번 온실 습도 이상 감지', time: '1시간 전', status: 'warning' },
        { id: 3, type: 'task', message: '정기 관수 시스템 점검', time: '2시간 전', status: 'completed' },
        { id: 4, type: 'harvest', message: '1번 온실 토마토 수확 (45kg)', time: '3시간 전', status: 'completed' },
        { id: 5, type: 'maintenance', message: '환기 시스템 필터 교체', time: '4시간 전', status: 'completed' }
      ];

      // 알림
      const alerts = [
        { id: 1, type: 'warning', message: '2번 온실 습도가 권장 범위를 초과했습니다.', priority: 'high' },
        { id: 2, type: 'info', message: '오늘 예정된 작업 12개 중 8개 완료되었습니다.', priority: 'low' },
        { id: 3, type: 'success', message: '1번 온실 환경이 최적 상태를 유지하고 있습니다.', priority: 'low' }
      ];

      setDashboardData({
        assignedGreenhouses,
        todayTasks,
        weeklyPerformance,
        recentActivities,
        alerts,
        environmentData
      });
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'alert': return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'harvest': return <TrophyOutlined style={{ color: '#fa8c16' }} />;
      case 'maintenance': return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#ff4d4f';
      case 'high': return '#fa8c16';
      case 'medium': return '#1890ff';
      case 'low': return '#52c41a';
      default: return '#666';
    }
  };

  // 오늘 작업 통계
  const todayTasks = dashboardData.todayTasks || [];
  const todayStats = {
    total: todayTasks.length,
    completed: todayTasks.filter(task => task.status === 'completed').length,
    pending: todayTasks.filter(task => task.status === 'pending').length,
    urgent: todayTasks.filter(task => task.priority === 'critical' || task.priority === 'high').length
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>👨‍🌾 재배관리자 대시보드</Title>
        <Text type="secondary">담당 온실의 현황과 오늘의 작업을 확인하세요</Text>
      </div>

      {/* 알림 */}
      {dashboardData.alerts.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {dashboardData.alerts.map(alert => (
                <Alert
                  key={alert.id}
                  message={alert.message}
                  type={alert.type}
                  showIcon
                  closable
                />
              ))}
            </Space>
          </Col>
        </Row>
      )}

      {/* KPI 카드들 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="담당 온실"
              value={dashboardData.assignedGreenhouses.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="개"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="오늘 작업"
              value={todayStats.completed}
              suffix={`/ ${todayStats.total}`}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress 
              percent={todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0} 
              showInfo={false} 
              strokeColor="#52c41a" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="긴급 작업"
              value={todayStats.urgent}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
              suffix="개"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="평균 효율성"
              value={87.5}
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
            <Progress percent={87.5} showInfo={false} strokeColor="#722ed1" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 주간 성과 차트 */}
        <Col xs={24} lg={16}>
          <Card title="📈 주간 작업 성과" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="completedTasks" 
                  stackId="1"
                  stroke="#52c41a" 
                  fill="#52c41a" 
                  name="완료 작업"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#1890ff" 
                  name="효율성 (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 오늘의 작업 목록 */}
        <Col xs={24} lg={8}>
          <Card title="📋 오늘의 작업" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={todayTasks.slice(0, 6)}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot={item.priority === 'critical' || item.priority === 'high'}
                        color={getTaskPriorityColor(item.priority)}
                      >
                        <Avatar 
                          size="small" 
                          style={{ 
                            backgroundColor: getTaskPriorityColor(item.priority),
                            fontSize: '12px'
                          }}
                        >
                          {item.name.charAt(0)}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <Tooltip title={item.description}>
                        <span style={{ fontSize: '13px' }}>
                          {item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
                        </span>
                      </Tooltip>
                    }
                    description={
                      <Space>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {item.scheduledTime}
                        </Text>
                        <Tag 
                          size="small" 
                          color={item.status === 'completed' ? 'green' : 'blue'}
                        >
                          {item.status === 'completed' ? '완료' : '대기'}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 환경 모니터링 */}
        <Col xs={24} lg={12}>
          <Card title="🌡️ 실시간 환경 모니터링" loading={loading}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.environmentData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="temp" orientation="left" />
                <YAxis yAxisId="humidity" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Line 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ff4d4f" 
                  name="온도 (°C)"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="humidity"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#1890ff" 
                  name="습도 (%)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 최근 활동 */}
        <Col xs={24} lg={12}>
          <Card title="📝 최근 활동" loading={loading}>
            <Timeline
              items={dashboardData.recentActivities.map(activity => ({
                dot: getActivityIcon(activity.type),
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{activity.message}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {activity.time}
                    </Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboard;
