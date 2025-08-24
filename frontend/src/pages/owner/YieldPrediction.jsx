import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space,
  Statistic,
  Progress,
  Table,
  Tag,
  Alert,
  Tabs,
  Select,
  DatePicker,
  Button,
  Spin
} from 'antd';
import {
  DollarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
  DownloadOutlined
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
import dayjs from 'dayjs';
import { getFilteredGreenhouses } from '../../utils/greenhouseManager';
import { 
  predictGreenhouseYield, 
  predictFarmTotalRevenue,
  findBestPerformingGreenhouse,
  findWorstPerformingGreenhouse 
} from '../../utils/yieldPrediction';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OwnerYieldPrediction = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedRange, setSelectedRange] = useState([dayjs(), dayjs().add(3, 'month')]);

  useEffect(() => {
    loadPredictionData();
  }, [selectedPeriod, selectedRange]);

  const loadPredictionData = async () => {
    try {
      setLoading(true);
      console.log('수확량 예측 데이터 로딩 시작...');
      
      // 모든 온실 데이터 조회
      const allGreenhouses = getFilteredGreenhouses('owner');
      console.log('온실 데이터:', allGreenhouses);
      
      // 농장 전체 수익 예측
      const farmRevenue = predictFarmTotalRevenue();
      console.log('농장 수익 예측:', farmRevenue);
      
      // 온실별 예측 데이터
      const greenhousePredictions = allGreenhouses.map(greenhouse => {
        const prediction = predictGreenhouseYield(greenhouse.id);
        return {
          ...greenhouse,
          ...prediction
        };
      });
      console.log('온실별 예측:', greenhousePredictions);

      // 간단한 최고/최저 성과 온실 계산
      let bestGreenhouse = null;
      let worstGreenhouse = null;
      
      if (greenhousePredictions.length > 0) {
        bestGreenhouse = greenhousePredictions.reduce((best, current) => 
          (current.expectedRevenue || 0) > (best.expectedRevenue || 0) ? current : best
        );
        
        worstGreenhouse = greenhousePredictions.reduce((worst, current) => 
          (current.expectedRevenue || 0) < (worst.expectedRevenue || 0) ? current : worst
        );
      }

      // 월별 예측 데이터 생성
      const monthlyData = [];
      for (let i = 0; i < 12; i++) {
        const month = dayjs().add(i, 'month');
        monthlyData.push({
          month: month.format('YYYY-MM'),
          monthName: month.format('MM월'),
          expectedYield: Math.floor(Math.random() * 500) + 800,
          expectedRevenue: Math.floor(Math.random() * 3000000) + 5000000,
          optimisticRevenue: Math.floor(Math.random() * 1000000) + 6000000,
          pessimisticRevenue: Math.floor(Math.random() * 2000000) + 3000000
        });
      }

      // 주간 예측 데이터
      const weeklyData = [];
      for (let i = 0; i < 16; i++) {
        const week = dayjs().add(i, 'week');
        weeklyData.push({
          week: `${week.format('MM/DD')}주`,
          yield: Math.floor(Math.random() * 100) + 150,
          quality: Math.floor(Math.random() * 20) + 80
        });
      }

      // 시나리오별 비교 데이터
      const scenarioData = [
        { 
          name: '낙관적', 
          revenue: farmRevenue?.optimistic || 8000000, 
          yield: (farmRevenue?.totalYield || 1000) * 1.2, 
          color: '#52c41a' 
        },
        { 
          name: '현실적', 
          revenue: farmRevenue?.realistic || 6000000, 
          yield: farmRevenue?.totalYield || 1000, 
          color: '#1890ff' 
        },
        { 
          name: '비관적', 
          revenue: farmRevenue?.pessimistic || 4000000, 
          yield: (farmRevenue?.totalYield || 1000) * 0.8, 
          color: '#ff4d4f' 
        }
      ];

      const predictionData = {
        summary: farmRevenue,
        greenhouses: greenhousePredictions,
        bestGreenhouse,
        worstGreenhouse,
        monthlyData,
        weeklyData,
        scenarioData
      };
      
      console.log('예측 데이터 로딩 완료:', predictionData);
      setPredictions(predictionData);
    } catch (error) {
      console.error('예측 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '온실명',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          <Tag color={record.status === 'active' ? 'green' : 'orange'}>
            {record.status === 'active' ? '운영중' : '점검중'}
          </Tag>
        </Space>
      )
    },
    {
      title: '관리자',
      dataIndex: 'manager',
      key: 'manager'
    },
    {
      title: '예상 수확량',
      dataIndex: 'expectedYield',
      key: 'expectedYield',
      render: (value) => `${value?.toFixed(1) || 0} kg`,
      sorter: (a, b) => (a.expectedYield || 0) - (b.expectedYield || 0)
    },
    {
      title: '예상 수익',
      dataIndex: 'expectedRevenue',
      key: 'expectedRevenue',
      render: (value) => `${(value || 0).toLocaleString()} 원`,
      sorter: (a, b) => (a.expectedRevenue || 0) - (b.expectedRevenue || 0)
    },
    {
      title: '수익성',
      key: 'profitability',
      render: (_, record) => {
        const profitability = ((record.expectedRevenue || 0) / 1000000).toFixed(1);
        const color = profitability >= 2 ? '#52c41a' : profitability >= 1 ? '#fa8c16' : '#ff4d4f';
        return <Tag color={color}>{profitability}M</Tag>;
      },
      sorter: (a, b) => (a.expectedRevenue || 0) - (b.expectedRevenue || 0)
    }
  ];

  const COLORS = ['#52c41a', '#1890ff', '#ff4d4f'];

  if (loading || !predictions) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          📈 수확량 및 수익 예측 데이터를 분석하고 있습니다...
        </div>
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#999' }}>
          잠시만 기다려주세요
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>📈 수확량 및 수익 예측</Title>
        <Text type="secondary">AI 기반 농장 전체 수익성 분석 및 예측</Text>
      </div>

      {/* 전체 요약 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 예상 수확량"
              value={predictions.summary?.totalYield || 0}
              precision={1}
              suffix="kg"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 예상 수익"
              value={predictions.summary?.totalRevenue || 0}
              precision={0}
              suffix="원"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="평균 수익률"
              value={85.4}
              precision={1}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="ROI"
              value={234}
              precision={0}
              suffix="%"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 최고/최저 성과 온실 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12}>
          <Alert
            message="최고 성과 온실"
            description={
              <Space direction="vertical">
                <Text strong>{predictions.bestGreenhouse?.name}</Text>
                <Text>예상 수익: {(predictions.bestGreenhouse?.expectedRevenue || 0).toLocaleString()}원</Text>
              </Space>
            }
            type="success"
            showIcon
          />
        </Col>
        <Col xs={24} sm={12}>
          <Alert
            message="개선 필요 온실"
            description={
              <Space direction="vertical">
                <Text strong>{predictions.worstGreenhouse?.name}</Text>
                <Text>예상 수익: {(predictions.worstGreenhouse?.expectedRevenue || 0).toLocaleString()}원</Text>
              </Space>
            }
            type="warning"
            showIcon
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="monthly">
        <Tabs.TabPane tab="월별 예측" key="monthly">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="📊 월별 수익 예측" loading={loading}>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={predictions.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()}원`, '']} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="optimisticRevenue" 
                      stackId="1"
                      stroke="#52c41a" 
                      fill="#52c41a" 
                      fillOpacity={0.3}
                      name="낙관적 예측"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expectedRevenue" 
                      stackId="2"
                      stroke="#1890ff" 
                      fill="#1890ff" 
                      name="현실적 예측"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pessimisticRevenue" 
                      stackId="3"
                      stroke="#ff4d4f" 
                      fill="#ff4d4f" 
                      fillOpacity={0.3}
                      name="비관적 예측"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="🎯 시나리오별 비교" loading={loading}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={predictions.scenarioData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ name, value }) => `${name}: ${(value/1000000).toFixed(1)}M`}
                    >
                      {predictions.scenarioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toLocaleString()}원`, '예상 수익']} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="주간 수확량" key="weekly">
          <Card title="🌱 주간 수확량 예측" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={predictions.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="yield" fill="#52c41a" name="수확량 (kg)" />
                <Line yAxisId="right" type="monotone" dataKey="quality" stroke="#1890ff" name="품질 점수" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="온실별 상세" key="detailed">
          <Card 
            title="🏠 온실별 예측 상세" 
            loading={loading}
            extra={
              <Button icon={<DownloadOutlined />}>
                Excel 다운로드
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={predictions.greenhouses}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default OwnerYieldPrediction;
