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
  Tabs,
  Select,
  DatePicker,
  Alert
} from 'antd';
import {
  TrophyOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DollarOutlined,
  CalendarOutlined,
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
import { getFilteredGreenhouses } from '../../utils/greenhouseManager';
import { predictGreenhouseYield } from '../../utils/yieldPrediction';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManagerPerformance = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    summary: {},
    monthlyPerformance: [],
    greenhouseComparison: [],
    taskEfficiency: [],
    skillAssessment: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedRange, setSelectedRange] = useState([dayjs().subtract(3, 'month'), dayjs()]);

  useEffect(() => {
    loadPerformanceData();
  }, [selectedPeriod, selectedRange]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      
      // 담당 온실들 조회
      const assignedGreenhouses = getFilteredGreenhouses('manager', 'manager_kim');
      
      // 전체 성과 요약
      const totalYield = assignedGreenhouses.reduce((sum, gh) => {
        const prediction = predictGreenhouseYield(gh.id);
        return sum + (prediction.expectedYield || 0);
      }, 0);
      
      const avgEfficiency = assignedGreenhouses.reduce((sum, gh) => 
        sum + (gh.productivity?.efficiency || 0), 0) / assignedGreenhouses.length;
      
      const summary = {
        totalGreenhouses: assignedGreenhouses.length,
        totalYield: totalYield,
        avgEfficiency: avgEfficiency,
        completedTasks: 156,
        onTimeRate: 94.5,
        qualityScore: 88.7
      };

      // 월별 성과 데이터
      const monthlyPerformance = [];
      for (let i = 11; i >= 0; i--) {
        const month = dayjs().subtract(i, 'month');
        monthlyPerformance.push({
          month: month.format('YYYY-MM'),
          monthName: month.format('MM월'),
          yield: Math.floor(Math.random() * 200) + 300,
          efficiency: Math.floor(Math.random() * 15) + 80,
          completedTasks: Math.floor(Math.random() * 30) + 40,
          qualityScore: Math.floor(Math.random() * 10) + 85
        });
      }

      // 온실별 비교
      const greenhouseComparison = assignedGreenhouses.map(greenhouse => {
        const prediction = predictGreenhouseYield(greenhouse.id);
        return {
          name: greenhouse.name,
          yield: prediction.expectedYield || 0,
          efficiency: greenhouse.productivity?.efficiency || 0,
          quality: Math.floor(Math.random() * 15) + 80,
          tasks: Math.floor(Math.random() * 20) + 30
        };
      });

      // 작업 효율성 데이터
      const taskEfficiency = [
        { category: '환경제어', completed: 45, total: 48, efficiency: 93.8 },
        { category: '관수', completed: 32, total: 35, efficiency: 91.4 },
        { category: '모니터링', completed: 28, total: 28, efficiency: 100 },
        { category: '수확', completed: 15, total: 18, efficiency: 83.3 },
        { category: '시설관리', completed: 22, total: 25, efficiency: 88.0 },
        { category: '병해충방제', completed: 8, total: 10, efficiency: 80.0 }
      ];

      // 기술 평가 (레이더 차트용)
      const skillAssessment = [
        { skill: '환경관리', score: 92, maxScore: 100 },
        { skill: '작물관리', score: 88, maxScore: 100 },
        { skill: '기술활용', score: 85, maxScore: 100 },
        { skill: '문제해결', score: 90, maxScore: 100 },
        { skill: '효율성', score: 87, maxScore: 100 },
        { skill: '품질관리', score: 89, maxScore: 100 }
      ];

      setPerformanceData({
        summary,
        monthlyPerformance,
        greenhouseComparison,
        taskEfficiency,
        skillAssessment
      });
    } catch (error) {
      console.error('성과 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const taskColumns = [
    {
      title: '작업 카테고리',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '완료/전체',
      key: 'completion',
      render: (_, record) => `${record.completed}/${record.total}`
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
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>📊 성과 분석</Title>
        <Text type="secondary">나의 재배 관리 성과를 분석하고 개선점을 찾아보세요</Text>
      </div>

      {/* 성과 요약 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="담당 온실"
              value={performanceData.summary.totalGreenhouses}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="개"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="총 수확량"
              value={performanceData.summary.totalYield}
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="kg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="평균 효율성"
              value={performanceData.summary.avgEfficiency}
              precision={1}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="완료 작업"
              value={performanceData.summary.completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="개"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="정시 완료율"
              value={performanceData.summary.onTimeRate}
              precision={1}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="품질 점수"
              value={performanceData.summary.qualityScore}
              precision={1}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#eb2f96' }}
              suffix="점"
            />
          </Card>
        </Col>
      </Row>

      {/* 성과 등급 알림 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Alert
            message="우수한 성과를 보이고 있습니다! 🎉"
            description={`평균 효율성 ${performanceData.summary.avgEfficiency?.toFixed(1)}%, 정시 완료율 ${performanceData.summary.onTimeRate}%로 목표를 초과 달성했습니다. 특히 환경 관리와 작물 관리 분야에서 뛰어난 성과를 보이고 있습니다.`}
            type="success"
            showIcon
            closable
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="monthly">
        <Tabs.TabPane tab="월별 성과" key="monthly">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="📈 월별 성과 추이" loading={loading}>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={performanceData.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="yield" 
                      stackId="1"
                      stroke="#52c41a" 
                      fill="#52c41a" 
                      fillOpacity={0.6}
                      name="수확량 (kg)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#1890ff" 
                      strokeWidth={3}
                      name="효율성 (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="🎯 기술 역량 평가" loading={loading}>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={performanceData.skillAssessment}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="현재 점수"
                      dataKey="score"
                      stroke="#1890ff"
                      fill="#1890ff"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="온실별 비교" key="greenhouse">
          <Card title="🏠 담당 온실별 성과 비교" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData.greenhouseComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="yield" fill="#52c41a" name="수확량 (kg)" />
                <Bar yAxisId="right" dataKey="efficiency" fill="#1890ff" name="효율성 (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="작업 효율성" key="tasks">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="📋 작업 카테고리별 효율성" loading={loading}>
                <Table
                  columns={taskColumns}
                  dataSource={performanceData.taskEfficiency}
                  rowKey="category"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="📊 작업 완료율" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={performanceData.taskEfficiency}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="category" width={80} />
                    <Tooltip formatter={(value) => [`${value}%`, '효율성']} />
                    <Bar 
                      dataKey="efficiency" 
                      fill="#1890ff"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="개선 제안" key="improvement">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="💡 개선 제안사항">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Alert
                    message="병해충 방제 효율성 개선"
                    description="현재 80%의 효율성을 보이고 있습니다. AI 모니터링 시스템을 더 적극적으로 활용하여 90% 이상 달성을 목표로 하세요."
                    type="warning"
                    showIcon
                  />
                  <Alert
                    message="수확 작업 최적화"
                    description="수확 효율성이 83.3%입니다. 로봇 수확 시스템의 센서 캘리브레이션을 점검하여 효율성을 높일 수 있습니다."
                    type="info"
                    showIcon
                  />
                  <Alert
                    message="우수한 환경 관리"
                    description="환경 제어 분야에서 93.8%의 높은 효율성을 보이고 있습니다. 이 노하우를 다른 작업 영역에도 적용해보세요."
                    type="success"
                    showIcon
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="🎯 목표 설정">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>이번 달 목표</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text>전체 효율성: </Text>
                      <Progress percent={92} target={95} strokeColor="#52c41a" />
                      <Text type="secondary">목표: 95%</Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>수확량 목표</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text>월 수확량: </Text>
                      <Progress percent={87} target={100} strokeColor="#1890ff" />
                      <Text type="secondary">목표: 500kg</Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>품질 점수</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text>품질 관리: </Text>
                      <Progress percent={89} target={90} strokeColor="#722ed1" />
                      <Text type="secondary">목표: 90점</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ManagerPerformance;
