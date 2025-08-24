import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Space,
  Table,
  Tag,
  Progress,
  Alert,
  List,
  Avatar,
  Badge,
  Tooltip,
  Button
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import { GREENHOUSE_DATA, MANAGER_DATA } from '../../utils/greenhouseManager';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    systemStats: {},
    userStats: {},
    performanceData: [],
    recentActivities: [],
    systemAlerts: [],
    revenueData: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 전체 시스템 통계
      const allGreenhouses = Object.values(GREENHOUSE_DATA);
      const allManagers = Object.values(MANAGER_DATA);
      
      const systemStats = {
        totalGreenhouses: allGreenhouses.length,
        activeGreenhouses: allGreenhouses.filter(gh => gh.status === 'normal').length,
        totalManagers: allManagers.length,
        totalUsers: allManagers.length + 1, // 관리자 + 재배관리자들
        totalRevenue: 45000000, // 월 총 매출
        avgEfficiency: allGreenhouses.reduce((sum, gh) => sum + (gh.productivity?.efficiency || 0), 0) / allGreenhouses.length
      };

      // 사용자 통계
      const userStats = {
        owners: 1,
        managers: allManagers.length,
        admins: 1,
        activeUsers: allManagers.length + 1,
        newUsersThisMonth: 2
      };

      // 성과 데이터 (최근 12개월)
      const performanceData = [];
      for (let i = 11; i >= 0; i--) {
        const month = dayjs().subtract(i, 'month');
        performanceData.push({
          month: month.format('MM월'),
          revenue: Math.floor(Math.random() * 10000000) + 35000000,
          yield: Math.floor(Math.random() * 500) + 2000,
          efficiency: Math.floor(Math.random() * 10) + 85,
          users: Math.floor(Math.random() * 3) + allManagers.length
        });
      }

      // 매출 데이터 (작물별)
      const revenueData = [
        { name: '토마토', value: 18000000, color: '#ff4d4f' },
        { name: '딸기', value: 15000000, color: '#52c41a' },
        { name: '파프리카', value: 8000000, color: '#1890ff' },
        { name: '허브류', value: 4000000, color: '#722ed1' }
      ];

      // 최근 활동
      const recentActivities = [
        { id: 1, type: 'user', message: '새로운 재배관리자 "정허브"가 등록되었습니다', time: '30분 전', user: '정허브' },
        { id: 2, type: 'system', message: '시스템 백업이 완료되었습니다', time: '1시간 전', user: 'System' },
        { id: 3, type: 'alert', message: '4번 온실에서 긴급 알림이 발생했습니다', time: '2시간 전', user: '최유기' },
        { id: 4, type: 'performance', message: '이번 달 전체 효율성이 목표를 달성했습니다', time: '3시간 전', user: 'System' },
        { id: 5, type: 'revenue', message: '월 매출 목표 90% 달성', time: '4시간 전', user: 'System' }
      ];

      // 시스템 알림
      const systemAlerts = [
        { id: 1, type: 'warning', message: '4번 온실의 환경 상태가 위험 수준입니다', priority: 'high', time: '2시간 전' },
        { id: 2, type: 'info', message: '시스템 업데이트가 예정되어 있습니다 (2024-04-15)', priority: 'medium', time: '1일 전' },
        { id: 3, type: 'success', message: '전체 시스템 성능이 우수합니다', priority: 'low', time: '2일 전' }
      ];

      setDashboardData({
        systemStats,
        userStats,
        performanceData,
        recentActivities,
        systemAlerts,
        revenueData
      });
    } catch (error) {
      console.error('관리자 대시보드 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <UserOutlined style={{ color: '#1890ff' }} />;
      case 'system': return <SettingOutlined style={{ color: '#52c41a' }} />;
      case 'alert': return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'performance': return <TrophyOutlined style={{ color: '#fa8c16' }} />;
      case 'revenue': return <DollarOutlined style={{ color: '#722ed1' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return '#ff4d4f';
      case 'info': return '#1890ff';
      case 'success': return '#52c41a';
      default: return '#666';
    }
  };

  // 관리자별 성과 테이블 컬럼
  const managerColumns = [
    {
      title: '관리자',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '담당 온실',
      dataIndex: 'greenhouseCount',
      key: 'greenhouseCount',
      render: (count) => <Badge count={count} showZero color="#1890ff" />
    },
    {
      title: '평균 효율성',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value) => (
        <Space>
          <Progress 
            percent={value} 
            size="small" 
            strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#fa8c16' : '#ff4d4f'}
          />
          <Text>{value}%</Text>
        </Space>
      ),
      sorter: (a, b) => a.efficiency - b.efficiency
    },
    {
      title: '전문 분야',
      dataIndex: 'specialty',
      key: 'specialty',
      render: (specialty) => <Tag color="blue">{specialty}</Tag>
    },
    {
      title: '경력',
      dataIndex: 'experience',
      key: 'experience'
    },
    {
      title: '작업',
      key: 'action',
      render: () => (
        <Button type="link" icon={<EyeOutlined />}>
          상세보기
        </Button>
      )
    }
  ];

  // 관리자 데이터 변환
  const managerTableData = Object.values(MANAGER_DATA).map(manager => {
    const assignedGreenhouses = Object.values(GREENHOUSE_DATA).filter(gh => gh.managerId === manager.id);
    const avgEfficiency = assignedGreenhouses.length > 0 
      ? assignedGreenhouses.reduce((sum, gh) => sum + (gh.productivity?.efficiency || 0), 0) / assignedGreenhouses.length
      : 0;
    
    return {
      key: manager.id,
      name: manager.name,
      greenhouseCount: assignedGreenhouses.length,
      efficiency: Math.round(avgEfficiency),
      specialty: manager.specialty,
      experience: manager.experience
    };
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>🔧 시스템 관리자 대시보드</Title>
        <Text type="secondary">전체 스마트팜 시스템의 현황과 성과를 모니터링하세요</Text>
      </div>

      {/* 시스템 알림 */}
      {dashboardData.systemAlerts.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {dashboardData.systemAlerts.slice(0, 2).map(alert => (
                <Alert
                  key={alert.id}
                  message={alert.message}
                  type={alert.type}
                  showIcon
                  closable
                  action={
                    <Button size="small" type="link">
                      자세히 보기
                    </Button>
                  }
                />
              ))}
            </Space>
          </Col>
        </Row>
      )}

      {/* 주요 KPI */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="전체 온실"
              value={dashboardData.systemStats.totalGreenhouses}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="개"
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                정상: {dashboardData.systemStats.activeGreenhouses}개
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="전체 사용자"
              value={dashboardData.systemStats.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="명"
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                관리자: {dashboardData.systemStats.totalManagers}명
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="월 총 매출"
              value={dashboardData.systemStats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `${(value / 10000).toFixed(0)}만원`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="평균 효율성"
              value={dashboardData.systemStats.avgEfficiency}
              precision={1}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
            <Progress 
              percent={dashboardData.systemStats.avgEfficiency} 
              showInfo={false}
              strokeColor="#722ed1"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="시스템 상태"
              value="정상"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">가동률: 99.8%</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="이번 달 신규"
              value={dashboardData.userStats.newUsersThisMonth}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#13c2c2' }}
              suffix="명"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 시스템 성과 차트 */}
        <Col xs={24} lg={16}>
          <Card title="📈 시스템 성과 추이" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={dashboardData.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#1890ff" 
                  fill="#1890ff" 
                  fillOpacity={0.6}
                  name="매출 (만원)"
                  formatter={(value) => `${(value / 10000).toFixed(0)}만원`}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#52c41a" 
                  strokeWidth={3}
                  name="효율성 (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 작물별 매출 분포 */}
        <Col xs={24} lg={8}>
          <Card title="🥕 작물별 매출 분포" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dashboardData.revenueData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `${(value / 10000).toFixed(0)}만원`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 관리자 성과 테이블 */}
        <Col xs={24} lg={16}>
          <Card title="👥 재배관리자 성과" loading={loading}>
            <Table
              columns={managerColumns}
              dataSource={managerTableData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 최근 활동 */}
        <Col xs={24} lg={8}>
          <Card title="📝 최근 시스템 활동" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={dashboardData.recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={
                      <div style={{ fontSize: '13px' }}>
                        {item.message}
                      </div>
                    }
                    description={
                      <Space>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {item.time}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          by {item.user}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
