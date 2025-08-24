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
  Avatar
} from 'antd';
import {
  DollarOutlined,
  HomeOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined
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
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GREENHOUSE_DATA, getFilteredGreenhouses } from '../../utils/greenhouseManager';
import { predictFarmTotalRevenue } from '../../utils/yieldPrediction';

const { Title, Text } = Typography;

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalGreenhouses: 0,
    activeGreenhouses: 0,
    totalYield: 0,
    monthlyRevenue: [],
    greenhouseStatus: [],
    recentActivities: [],
    alerts: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 농장주는 모든 온실 데이터 조회
      const allGreenhouses = getFilteredGreenhouses('owner');
      const revenueData = predictFarmTotalRevenue(allGreenhouses);
      
      // 월별 수익 데이터 생성
      const monthlyRevenue = [];
      for (let i = 0; i < 12; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() - 11 + i);
        monthlyRevenue.push({
          month: month.toLocaleDateString('ko-KR', { month: 'short' }),
          revenue: Math.floor(Math.random() * 5000000) + 3000000,
          cost: Math.floor(Math.random() * 2000000) + 1000000
        });
      }

      // 온실별 상태 데이터
      const greenhouseStatus = allGreenhouses.map(greenhouse => ({
        name: greenhouse.name,
        status: greenhouse.status,
        efficiency: Math.floor(Math.random() * 30) + 70,
        yield: Math.floor(Math.random() * 500) + 200
      }));

      // 최근 활동
      const recentActivities = [
        { id: 1, type: 'harvest', message: '1번 온실 토마토 수확 완료', time: '2시간 전', user: '김관리자' },
        { id: 2, type: 'maintenance', message: '2번 온실 환기 시스템 점검', time: '4시간 전', user: '이관리자' },
        { id: 3, type: 'alert', message: '3번 온실 온도 이상 감지', time: '6시간 전', user: '시스템' },
        { id: 4, type: 'planting', message: '1번 온실 새 작물 파종', time: '1일 전', user: '김관리자' },
        { id: 5, type: 'revenue', message: '이번 주 매출 목표 달성', time: '2일 전', user: '시스템' }
      ];

      // 알림 데이터
      const alerts = [
        { id: 1, type: 'warning', message: '3번 온실 습도가 권장 범위를 벗어났습니다.', priority: 'high' },
        { id: 2, type: 'info', message: '이번 달 수익이 전월 대비 15% 증가했습니다.', priority: 'low' },
        { id: 3, type: 'success', message: '모든 온실의 자동화 시스템이 정상 작동 중입니다.', priority: 'low' }
      ];

      setDashboardData({
        totalRevenue: revenueData.totalRevenue,
        totalGreenhouses: allGreenhouses.length,
        activeGreenhouses: allGreenhouses.filter(g => g.status === 'active').length,
        totalYield: revenueData.totalYield,
        monthlyRevenue,
        greenhouseStatus,
        recentActivities,
        alerts
      });
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'harvest': return <TrophyOutlined style={{ color: '#52c41a' }} />;
      case 'maintenance': return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'alert': return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'planting': return <HomeOutlined style={{ color: '#722ed1' }} />;
      case 'revenue': return <DollarOutlined style={{ color: '#fa8c16' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const COLORS = ['#52c41a', '#1890ff', '#fa8c16', '#ff4d4f'];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>🏠 농장주 대시보드</Title>
        <Text type="secondary">농장 전체 현황을 한눈에 확인하세요</Text>
      </div>

      {/* KPI 카드들 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 수익"
              value={dashboardData.totalRevenue}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
              suffix="원"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="운영 온실"
              value={dashboardData.activeGreenhouses}
              suffix={`/ ${dashboardData.totalGreenhouses}`}
              valueStyle={{ color: '#1890ff' }}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 수확량"
              value={dashboardData.totalYield}
              precision={1}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<TrophyOutlined />}
              suffix="kg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="평균 효율성"
              value={85.4}
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
            <Progress percent={85.4} showInfo={false} strokeColor="#722ed1" />
          </Card>
        </Col>
      </Row>

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

      <Row gutter={[16, 16]}>
        {/* 월별 수익 차트 */}
        <Col xs={24} lg={16}>
          <Card title="📈 월별 수익 현황" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()}원`, '']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#52c41a" 
                  fill="#52c41a" 
                  name="수익"
                />
                <Area 
                  type="monotone" 
                  dataKey="cost" 
                  stackId="2"
                  stroke="#ff4d4f" 
                  fill="#ff4d4f" 
                  name="비용"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 온실별 효율성 */}
        <Col xs={24} lg={8}>
          <Card title="🏠 온실별 효율성" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.greenhouseStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 최근 활동 */}
        <Col xs={24} lg={12}>
          <Card title="📋 최근 활동" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={dashboardData.recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={item.message}
                    description={
                      <Space>
                        <Text type="secondary">{item.time}</Text>
                        <Tag>{item.user}</Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 온실 현황 요약 */}
        <Col xs={24} lg={12}>
          <Card title="🌱 온실 현황 요약" loading={loading}>
            <Row gutter={[16, 16]}>
              {dashboardData.greenhouseStatus.slice(0, 4).map((greenhouse, index) => (
                <Col span={12} key={greenhouse.name}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Space direction="vertical">
                      <Title level={5} style={{ margin: 0 }}>
                        {greenhouse.name}
                      </Title>
                      <Tag color={greenhouse.status === 'active' ? 'green' : 'orange'}>
                        {greenhouse.status === 'active' ? '운영중' : '점검중'}
                      </Tag>
                      <Statistic
                        value={greenhouse.efficiency}
                        suffix="%"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OwnerDashboard;
