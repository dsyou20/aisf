import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space,
  Statistic,
  Table,
  Tag,
  Select,
  DatePicker,
  Button,
  Tabs,
  Progress,
  Alert
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  DollarOutlined,
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  DownloadOutlined,
  PrinterOutlined
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
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import dayjs from 'dayjs';
import { GREENHOUSE_DATA, MANAGER_DATA } from '../../utils/greenhouseManager';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    revenueAnalysis: [],
    performanceAnalysis: [],
    cropAnalysis: [],
    managerAnalysis: [],
    trendAnalysis: [],
    comparisonData: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedDateRange, setSelectedDateRange] = useState([
    dayjs().subtract(6, 'month'),
    dayjs()
  ]);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedDateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // 전체 개요
      const allGreenhouses = Object.values(GREENHOUSE_DATA);
      const allManagers = Object.values(MANAGER_DATA);
      
      const overview = {
        totalRevenue: 45000000,
        totalYield: 2850,
        avgEfficiency: allGreenhouses.reduce((sum, gh) => sum + (gh.productivity?.efficiency || 0), 0) / allGreenhouses.length,
        activeGreenhouses: allGreenhouses.filter(gh => gh.status === 'normal').length,
        totalGreenhouses: allGreenhouses.length,
        totalManagers: allManagers.length,
        growthRate: 12.5,
        profitMargin: 28.3
      };

      // 매출 분석 (월별)
      const revenueAnalysis = [];
      for (let i = 11; i >= 0; i--) {
        const month = dayjs().subtract(i, 'month');
        revenueAnalysis.push({
          month: month.format('YYYY-MM'),
          monthName: month.format('MM월'),
          revenue: Math.floor(Math.random() * 8000000) + 37000000,
          cost: Math.floor(Math.random() * 5000000) + 25000000,
          profit: 0, // 계산 후 설정
          yield: Math.floor(Math.random() * 300) + 2200,
          efficiency: Math.floor(Math.random() * 10) + 85
        });
      }
      
      // 수익 계산
      revenueAnalysis.forEach(item => {
        item.profit = item.revenue - item.cost;
      });

      // 성과 분석 (온실별)
      const performanceAnalysis = allGreenhouses.map(greenhouse => ({
        name: greenhouse.name,
        efficiency: greenhouse.productivity?.efficiency || 0,
        yield: Math.floor(Math.random() * 200) + 300,
        revenue: Math.floor(Math.random() * 3000000) + 5000000,
        quality: greenhouse.productivity?.quality || 0,
        manager: greenhouse.manager,
        crop: greenhouse.cropName,
        area: greenhouse.area
      }));

      // 작물별 분석
      const cropTypes = ['토마토', '딸기', '파프리카', '허브류'];
      const cropAnalysis = cropTypes.map(crop => {
        const cropGreenhouses = allGreenhouses.filter(gh => gh.cropName.includes(crop));
        return {
          crop: crop,
          count: cropGreenhouses.length,
          totalYield: Math.floor(Math.random() * 800) + 600,
          avgEfficiency: cropGreenhouses.length > 0 
            ? cropGreenhouses.reduce((sum, gh) => sum + (gh.productivity?.efficiency || 0), 0) / cropGreenhouses.length
            : 0,
          revenue: Math.floor(Math.random() * 15000000) + 8000000,
          marketShare: Math.floor(Math.random() * 30) + 15
        };
      });

      // 관리자별 분석
      const managerAnalysis = allManagers.map(manager => {
        const assignedGreenhouses = allGreenhouses.filter(gh => gh.managerId === manager.id);
        const avgEfficiency = assignedGreenhouses.length > 0 
          ? assignedGreenhouses.reduce((sum, gh) => sum + (gh.productivity?.efficiency || 0), 0) / assignedGreenhouses.length
          : 0;
        
        return {
          name: manager.name,
          greenhouseCount: assignedGreenhouses.length,
          efficiency: Math.round(avgEfficiency),
          totalYield: Math.floor(Math.random() * 500) + 400,
          revenue: Math.floor(Math.random() * 8000000) + 6000000,
          experience: manager.experience,
          specialty: manager.specialty,
          rating: manager.performance?.rating || 0
        };
      });

      // 트렌드 분석 (주간)
      const trendAnalysis = [];
      for (let i = 11; i >= 0; i--) {
        const week = dayjs().subtract(i, 'week');
        trendAnalysis.push({
          week: week.format('MM/DD'),
          temperature: Math.floor(Math.random() * 8) + 20,
          humidity: Math.floor(Math.random() * 20) + 60,
          yield: Math.floor(Math.random() * 50) + 180,
          efficiency: Math.floor(Math.random() * 15) + 80,
          issues: Math.floor(Math.random() * 5)
        });
      }

      // 비교 분석 데이터
      const comparisonData = [
        { category: '수확량', current: 2850, target: 3000, lastYear: 2650 },
        { category: '효율성', current: overview.avgEfficiency, target: 90, lastYear: 82 },
        { category: '매출', current: 45000000, target: 50000000, lastYear: 38000000 },
        { category: '품질점수', current: 88, target: 90, lastYear: 85 },
        { category: '고객만족도', current: 92, target: 95, lastYear: 89 }
      ];

      setAnalyticsData({
        overview,
        revenueAnalysis,
        performanceAnalysis,
        cropAnalysis,
        managerAnalysis,
        trendAnalysis,
        comparisonData
      });
    } catch (error) {
      console.error('분석 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const performanceColumns = [
    {
      title: '온실',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: '작물',
      dataIndex: 'crop',
      key: 'crop',
      render: (crop) => <Tag color="green">{crop}</Tag>
    },
    {
      title: '관리자',
      dataIndex: 'manager',
      key: 'manager'
    },
    {
      title: '면적',
      dataIndex: 'area',
      key: 'area',
      render: (area) => `${area}㎡`
    },
    {
      title: '효율성',
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
      title: '수확량',
      dataIndex: 'yield',
      key: 'yield',
      render: (yield_val) => `${yield_val}kg`,
      sorter: (a, b) => a.yield - b.yield
    },
    {
      title: '매출',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${(revenue / 10000).toFixed(0)}만원`,
      sorter: (a, b) => a.revenue - b.revenue
    }
  ];

  const managerColumns = [
    {
      title: '관리자',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <UserOutlined />
          <Text strong>{name}</Text>
        </Space>
      )
    },
    {
      title: '담당 온실',
      dataIndex: 'greenhouseCount',
      key: 'greenhouseCount',
      render: (count) => `${count}개`
    },
    {
      title: '전문분야',
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
      title: '총 수확량',
      dataIndex: 'totalYield',
      key: 'totalYield',
      render: (yield_val) => `${yield_val}kg`,
      sorter: (a, b) => a.totalYield - b.totalYield
    },
    {
      title: '평점',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `⭐ ${rating.toFixed(1)}`,
      sorter: (a, b) => a.rating - b.rating
    }
  ];

  const COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2'];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>📊 전체 분석</Title>
        <Text type="secondary">농장 전체의 성과와 트렌드를 종합적으로 분석하세요</Text>
      </div>

      {/* 필터 및 내보내기 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Space>
              <Text>기간:</Text>
              <Select value={selectedPeriod} onChange={setSelectedPeriod}>
                <Option value="weekly">주간</Option>
                <Option value="monthly">월간</Option>
                <Option value="yearly">연간</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<DownloadOutlined />}>
                데이터 내보내기
              </Button>
              <Button icon={<PrinterOutlined />}>
                보고서 출력
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 주요 KPI */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="총 매출"
              value={analyticsData.overview.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) => `${(value / 10000).toFixed(0)}만원`}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="success">+{analyticsData.overview.growthRate}%</Text>
              <Text type="secondary"> 전월 대비</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="총 수확량"
              value={analyticsData.overview.totalYield}
              suffix="kg"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="평균 효율성"
              value={analyticsData.overview.avgEfficiency}
              precision={1}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <Progress 
              percent={analyticsData.overview.avgEfficiency} 
              showInfo={false}
              strokeColor="#fa8c16"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="활성 온실"
              value={analyticsData.overview.activeGreenhouses}
              suffix={`/ ${analyticsData.overview.totalGreenhouses}`}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="수익률"
              value={analyticsData.overview.profitMargin}
              precision={1}
              suffix="%"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="관리자 수"
              value={analyticsData.overview.totalManagers}
              suffix="명"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 성과 알림 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Alert
            message="이번 달 목표 달성률 90%"
            description={`총 매출 ${(analyticsData.overview.totalRevenue / 10000).toFixed(0)}만원으로 목표의 90%를 달성했습니다. 평균 효율성은 ${analyticsData.overview.avgEfficiency?.toFixed(1)}%로 우수한 성과를 보이고 있습니다.`}
            type="success"
            showIcon
            closable
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="revenue">
        <Tabs.TabPane tab="매출 분석" key="revenue">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="📈 매출 및 수익 추이" loading={loading}>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={analyticsData.revenueAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => {
                      if (name.includes('매출') || name.includes('비용') || name.includes('수익')) {
                        return [`${(value / 10000).toFixed(0)}만원`, name];
                      }
                      return [value, name];
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#1890ff" name="매출" />
                    <Bar yAxisId="left" dataKey="cost" fill="#ff4d4f" name="비용" />
                    <Line yAxisId="left" type="monotone" dataKey="profit" stroke="#52c41a" strokeWidth={3} name="수익" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#722ed1" strokeWidth={2} name="효율성 (%)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="🥕 작물별 매출 분포" loading={loading}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={analyticsData.cropAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ crop, percent }) => `${crop} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.cropAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${(value / 10000).toFixed(0)}만원`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="성과 분석" key="performance">
          <Card title="🏆 온실별 성과 분석" loading={loading}>
            <Table
              columns={performanceColumns}
              dataSource={analyticsData.performanceAnalysis}
              rowKey="name"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="관리자 분석" key="managers">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="👥 관리자별 성과" loading={loading}>
                <Table
                  columns={managerColumns}
                  dataSource={analyticsData.managerAnalysis}
                  rowKey="name"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="📊 관리자 효율성 분포" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.managerAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="트렌드 분석" key="trends">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="📈 주간 트렌드 분석" loading={loading}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.trendAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="yield" stroke="#52c41a" name="수확량 (kg)" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#1890ff" name="효율성 (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ff4d4f" name="평균 온도 (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="🎯 목표 대비 성과" loading={loading}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {analyticsData.comparisonData.map((item, index) => (
                    <div key={index} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Text strong>{item.category}</Text>
                        <Text>{typeof item.current === 'number' && item.current > 1000000 
                          ? `${(item.current / 10000).toFixed(0)}만원` 
                          : `${item.current}${item.category.includes('효율성') || item.category.includes('점수') || item.category.includes('만족도') ? '%' : item.category.includes('수확량') ? 'kg' : ''}`}
                        </Text>
                      </div>
                      <Progress 
                        percent={typeof item.current === 'number' && item.target > 0 ? (item.current / item.target) * 100 : 0}
                        strokeColor={item.current >= item.target ? '#52c41a' : '#fa8c16'}
                        format={() => `${((item.current / item.target) * 100).toFixed(0)}%`}
                      />
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        목표: {typeof item.target === 'number' && item.target > 1000000 
                          ? `${(item.target / 10000).toFixed(0)}만원` 
                          : `${item.target}${item.category.includes('효율성') || item.category.includes('점수') || item.category.includes('만족도') ? '%' : item.category.includes('수확량') ? 'kg' : ''}`}
                        {' | '}
                        작년: {typeof item.lastYear === 'number' && item.lastYear > 1000000 
                          ? `${(item.lastYear / 10000).toFixed(0)}만원` 
                          : `${item.lastYear}${item.category.includes('효율성') || item.category.includes('점수') || item.category.includes('만족도') ? '%' : item.category.includes('수확량') ? 'kg' : ''}`}
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
