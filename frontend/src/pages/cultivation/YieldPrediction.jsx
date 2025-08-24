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
  Statistic,
  Progress,
  Table,
  Tag,
  Alert,
  Timeline,
  Descriptions,
  Divider
} from 'antd';
import {
  DollarOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  LineChartOutlined
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
import { 
  IntegratedYieldRevenuePrediction,
  predictFarmTotalRevenue,
  CROP_YIELD_MODELS,
  MARKET_PRICE_DATA
} from '../../utils/yieldPrediction';
import { GREENHOUSE_DATA } from '../../utils/greenhouseManager';

const { Title, Text } = Typography;
const { Option } = Select;

const YieldPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('greenhouse_A');
  const [predictionPeriod, setPredictionPeriod] = useState(90); // 90일 예측
  const [activeTab, setActiveTab] = useState('yield');
  const [predictions, setPredictions] = useState({});
  const [farmTotal, setFarmTotal] = useState(null);

  const predictionEngine = new IntegratedYieldRevenuePrediction();

  useEffect(() => {
    loadPredictions();
  }, [selectedGreenhouse, predictionPeriod]);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      // 개별 하우스 예측
      const prediction = predictionEngine.generateCompletePrediction(selectedGreenhouse);
      setPredictions(prediction);

      // 전체 농장 예측 (농장주용)
      const farmPrediction = predictFarmTotalRevenue();
      setFarmTotal(farmPrediction);
    } finally {
      setLoading(false);
    }
  };

  // 수확량 예측 탭
  const YieldPredictionTab = () => (
    <div>
      {predictions && predictions.summary && (
        <>
          {/* 예측 요약 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="예상 총 수확량"
                  value={predictions.summary?.expectedYield || 0}
                  suffix="kg"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="㎡당 수확량"
                  value={predictions.yield?.yieldPerSqm || 0}
                  suffix="kg/㎡"
                  precision={1}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="예측 신뢰도"
                  value={Math.round((predictions.summary?.confidence || 0) * 100)}
                  suffix="%"
                  valueStyle={{ 
                    color: predictions.summary.confidence > 0.8 ? '#52c41a' : 
                           predictions.summary.confidence > 0.6 ? '#faad14' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="환경 점수"
                  value={predictions.yield.environmentScore}
                  suffix="점"
                  valueStyle={{ 
                    color: predictions.yield.environmentScore >= 80 ? '#52c41a' : 
                           predictions.yield.environmentScore >= 60 ? '#faad14' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* 주차별 수확량 예측 차트 */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="주차별 수확량 예측">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={predictions.yield.weeklyPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="week" 
                      tickFormatter={(value) => `${value}주차`}
                    />
                    <YAxis />
                    <RechartsTooltip 
                      labelFormatter={(value) => `${value}주차`}
                      formatter={(value, name) => [`${value.toFixed(1)}kg`, name]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="yieldAmount" 
                      stroke="#52c41a" 
                      fill="#52c41a"
                      fillOpacity={0.6}
                      name="예상 수확량(kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* 품질 분포 및 수확 일정 */}
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} lg={12}>
              <Card title="품질 등급별 분포 예측">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: '프리미엄', value: predictions.yield.qualityDistribution.premium, color: '#52c41a' },
                        { name: '표준', value: predictions.yield.qualityDistribution.standard, color: '#1890ff' },
                        { name: '이코노미', value: predictions.yield.qualityDistribution.economy, color: '#faad14' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      <Cell fill="#52c41a" />
                      <Cell fill="#1890ff" />
                      <Cell fill="#faad14" />
                    </Pie>
                    <RechartsTooltip formatter={(value) => [`${value}%`, '비율']} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="수확 일정" size="small">
                <Timeline size="small">
                  {predictions.yield.harvestSchedule.slice(0, 8).map((schedule, index) => (
                    <Timeline.Item
                      key={index}
                      color={schedule.yieldAmount > 20 ? 'green' : schedule.yieldAmount > 10 ? 'blue' : 'orange'}
                    >
                      <div>
                        <Text strong>{dayjs(schedule.date).format('MM월 DD일')}</Text>
                        <Text style={{ marginLeft: '8px' }}>({schedule.week}주차)</Text>
                      </div>
                      <div>
                        <Text>예상 수확량: {schedule.yieldAmount.toFixed(1)}kg</Text>
                      </div>
                      <div>
                        <Text type="secondary">
                          작업시간: {schedule.workload.hours}시간, 
                          인력: {schedule.workload.workers}명
                        </Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          </Row>

          {/* 위험 요소 */}
          {predictions.yield.riskFactors.length > 0 && (
            <Card title="위험 요소 분석" style={{ marginTop: '16px' }}>
              <Row gutter={[16, 16]}>
                {predictions.yield.riskFactors.map((risk, index) => (
                  <Col xs={24} sm={12} lg={8} key={index}>
                    <Alert
                      message={risk.description}
                      description={risk.impact}
                      type={risk.severity === 'critical' ? 'error' : risk.severity === 'high' ? 'warning' : 'info'}
                      showIcon
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </>
      )}
    </div>
  );

  // 수익 예측 탭
  const RevenuePredictionTab = () => (
    <div>
      {predictions && predictions.revenue && predictions.summary && (
        <>
          {/* 수익 요약 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="예상 총 매출"
                  value={predictions.summary.expectedRevenue}
                  prefix="₩"
                  formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="예상 순수익"
                  value={predictions.summary.expectedProfit}
                  prefix="₩"
                  formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  valueStyle={{ 
                    color: predictions.summary.expectedProfit > 0 ? '#52c41a' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="수익률"
                  value={predictions.summary.profitMargin}
                  suffix="%"
                  precision={1}
                  valueStyle={{ 
                    color: predictions.summary.profitMargin > 20 ? '#52c41a' : 
                           predictions.summary.profitMargin > 10 ? '#faad14' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="투자 수익률 (ROI)"
                  value={predictions.summary.roi}
                  suffix="%"
                  precision={1}
                  valueStyle={{ 
                    color: predictions.summary.roi > 30 ? '#52c41a' : 
                           predictions.summary.roi > 15 ? '#faad14' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* 월별 수익 예측 차트 */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="월별 수익 예측">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={predictions.revenue.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => dayjs(value).format('MM월')}
                    />
                    <YAxis />
                    <RechartsTooltip 
                      labelFormatter={(value) => dayjs(value).format('YYYY년 MM월')}
                      formatter={(value, name) => [
                        name.includes('수확량') ? `${value.toFixed(1)}kg` : `₩${value.toLocaleString()}`,
                        name
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#1890ff" name="월별 매출" />
                    <Line type="monotone" dataKey="totalYield" stroke="#52c41a" name="누적 수확량(kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* 비용 분석 */}
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} lg={12}>
              <Card title="비용 구조 분석">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="총 비용">
                    ₩{predictions.revenue.totalCosts.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="고정비">
                    ₩{predictions.revenue.costBreakdown.totalFixedCost.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="변동비">
                    ₩{predictions.revenue.costBreakdown.totalVariableCost.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="kg당 생산비">
                    ₩{predictions.revenue.costBreakdown.costPerKg.toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div>
                  <Text strong>주요 비용 항목:</Text>
                  <div style={{ marginTop: '8px' }}>
                    {Object.keys(predictions.revenue.costBreakdown.fixedCosts).map(cost => (
                      <div key={cost} style={{ marginBottom: '4px' }}>
                        <Text>{cost}: </Text>
                        <Text strong>₩{predictions.revenue.costBreakdown.fixedCosts[cost].toLocaleString()}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="손익분기점 분석">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Statistic
                    title="손익분기 수확량"
                    value={predictions.revenue.breakEvenPoint.yieldAmount}
                    suffix="kg"
                    valueStyle={{ color: '#722ed1' }}
                  />
                  <Progress 
                    percent={Math.min(100, (predictions.summary.expectedYield / predictions.revenue.breakEvenPoint.yieldAmount) * 100)}
                    strokeColor={
                      predictions.summary.expectedYield >= predictions.revenue.breakEvenPoint.yieldAmount ? 
                      '#52c41a' : '#ff4d4f'
                    }
                  />
                  <Text type="secondary">
                    {predictions.revenue.breakEvenPoint.description}
                  </Text>
                  
                  <Divider />
                  
                  <div>
                    <Text strong>위험 조정 수익:</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Statistic
                        title="조정 후 순수익"
                        value={predictions.revenue.riskAdjustedProfit.adjustedProfit}
                        prefix="₩"
                        formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        valueStyle={{ color: '#fa8c16' }}
                      />
                      <Text type="secondary">
                        위험 할인율: {predictions.revenue.riskAdjustedProfit.riskDiscount}%
                      </Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );

  // 시나리오 비교 탭
  const ScenarioComparisonTab = () => (
    <div>
      {predictions && predictions.scenarios && (
        <>
          <Alert
            message="시나리오별 예측"
            description="다양한 조건에서의 수확량과 수익을 비교하여 위험을 평가하고 대응 전략을 수립하세요."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Row gutter={[16, 16]}>
            {Object.keys(predictions.scenarios).map(scenarioKey => {
              const scenario = predictions.scenarios[scenarioKey];
              return (
                <Col xs={24} lg={8} key={scenarioKey}>
                  <Card 
                    title={scenario.name}
                    size="small"
                    style={{
                      borderColor: scenarioKey === 'optimistic' ? '#52c41a' : 
                                   scenarioKey === 'realistic' ? '#1890ff' : '#ff4d4f',
                      borderWidth: '2px'
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>발생 확률: </Text>
                        <Tag color={scenarioKey === 'realistic' ? 'blue' : 'default'}>
                          {Math.round(scenario.probability * 100)}%
                        </Tag>
                      </div>
                      
                      <Statistic
                        title="예상 수확량"
                        value={scenario.yieldAmount}
                        suffix="kg"
                        valueStyle={{ fontSize: '16px' }}
                      />
                      
                      <Statistic
                        title="예상 매출"
                        value={scenario.revenue}
                        prefix="₩"
                        formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        valueStyle={{ fontSize: '16px' }}
                      />
                      
                      <Statistic
                        title="예상 순수익"
                        value={scenario.profit}
                        prefix="₩"
                        formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        valueStyle={{ 
                          fontSize: '16px',
                          color: scenario.profit > 0 ? '#52c41a' : '#ff4d4f'
                        }}
                      />
                      
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {scenario.description}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </div>
  );

  // 전체 농장 예측 탭 (농장주용)
  const FarmTotalTab = () => (
    <div>
      {farmTotal && (
        <>
          {/* 전체 농장 요약 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="전체 예상 수확량"
                  value={farmTotal.farmSummary.totalYield}
                  suffix="kg"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="전체 예상 매출"
                  value={farmTotal.farmSummary.totalRevenue}
                  prefix="₩"
                  formatter={(value) => `${(value / 100000000).toFixed(1)}억`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="전체 예상 순수익"
                  value={farmTotal.farmSummary.totalProfit}
                  prefix="₩"
                  formatter={(value) => `${(value / 100000000).toFixed(1)}억`}
                  valueStyle={{ 
                    color: farmTotal.farmSummary.totalProfit > 0 ? '#52c41a' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="평균 수익률"
                  value={farmTotal.farmSummary.avgProfitMargin}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 하우스별 성과 비교 */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="하우스별 수익성 비교">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={Object.keys(farmTotal.farmPredictions).map(greenhouseId => {
                      const prediction = farmTotal.farmPredictions[greenhouseId];
                      return {
                        name: prediction.greenhouse.name,
                        yield: prediction.summary.expectedYield,
                        revenue: prediction.summary.expectedRevenue / 1000000, // 백만원 단위
                        profit: prediction.summary.expectedProfit / 1000000,
                        roi: prediction.summary.roi
                      };
                    })}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="money" orientation="left" />
                    <YAxis yAxisId="roi" orientation="right" />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name.includes('ROI') ? `${value}%` : 
                        name.includes('수확량') ? `${value}kg` : `${value}M원`,
                        name
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="money" dataKey="revenue" fill="#1890ff" name="매출(M원)" />
                    <Bar yAxisId="money" dataKey="profit" fill="#52c41a" name="순수익(M원)" />
                    <Line yAxisId="roi" type="monotone" dataKey="roi" stroke="#722ed1" name="ROI(%)" strokeWidth={3} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* 최고/최저 성과 하우스 */}
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} lg={12}>
              <Card 
                title="최고 성과 하우스" 
                style={{ borderColor: '#52c41a', borderWidth: '2px' }}
              >
                {farmTotal.farmSummary.bestPerforming && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '18px' }}>
                      {farmTotal.farmSummary.bestPerforming.name}
                    </Text>
                    <Statistic
                      title="ROI"
                      value={farmTotal.farmSummary.bestPerforming.roi}
                      suffix="%"
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <Statistic
                      title="예상 순수익"
                      value={farmTotal.farmSummary.bestPerforming.profit}
                      prefix="₩"
                      formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Space>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                title="개선 필요 하우스" 
                style={{ borderColor: '#ff4d4f', borderWidth: '2px' }}
              >
                {farmTotal.farmSummary.worstPerforming && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '18px' }}>
                      {farmTotal.farmSummary.worstPerforming.name}
                    </Text>
                    <Statistic
                      title="ROI"
                      value={farmTotal.farmSummary.worstPerforming.roi}
                      suffix="%"
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                    <Statistic
                      title="예상 순수익"
                      value={farmTotal.farmSummary.worstPerforming.profit}
                      prefix="₩"
                      formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                    <Alert
                      message="개선 권장사항"
                      description="환경 조건 개선과 관리 방식 최적화를 통해 수익성을 향상시킬 수 있습니다."
                      type="warning"
                      showIcon
                      style={{ marginTop: '12px' }}
                    />
                  </Space>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <DollarOutlined /> 수확량 및 수익 예측
        </Title>
        <Text type="secondary">
          환경 데이터와 생육 상태를 분석하여 수확량과 수익을 예측합니다
        </Text>
      </div>

      {/* 필터 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>하우스 선택</Text>
              <Select
                value={selectedGreenhouse}
                onChange={setSelectedGreenhouse}
                style={{ width: '100%' }}
              >
                {Object.keys(GREENHOUSE_DATA).map(greenhouseId => {
                  const greenhouse = GREENHOUSE_DATA[greenhouseId];
                  return (
                    <Option key={greenhouseId} value={greenhouseId}>
                      {greenhouse.name} ({greenhouse.cropName})
                    </Option>
                  );
                })}
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>예측 기간</Text>
              <Select
                value={predictionPeriod}
                onChange={setPredictionPeriod}
                style={{ width: '100%' }}
              >
                <Option value={30}>1개월</Option>
                <Option value={60}>2개월</Option>
                <Option value={90}>3개월</Option>
                <Option value={180}>6개월</Option>
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} sm={8}>
            <Space style={{ marginTop: '24px' }}>
              <Button 
                type="primary" 
                icon={<LineChartOutlined />}
                loading={loading}
                onClick={loadPredictions}
              >
                예측 업데이트
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 로딩 상태 */}
      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>데이터를 분석하고 예측을 생성하고 있습니다...</div>
          </div>
        </Card>
      )}

      {/* 데이터 없음 상태 */}
      {!loading && (!predictions || !predictions.summary) && (
        <Card>
          <Alert
            message="예측 데이터 없음"
            description="선택된 하우스의 예측 데이터를 생성할 수 없습니다. 하우스를 다시 선택하거나 예측을 업데이트해보세요."
            type="warning"
            showIcon
            action={
              <Button onClick={loadPredictions}>
                다시 시도
              </Button>
            }
          />
        </Card>
      )}

      {/* 예측 결과 탭 */}
      {!loading && predictions && predictions.summary && (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'yield',
              label: <span><TrophyOutlined />수확량 예측</span>,
              children: <YieldPredictionTab />
            },
            {
              key: 'revenue',
              label: <span><DollarOutlined />수익 예측</span>,
              children: <RevenuePredictionTab />
            },
            {
              key: 'scenarios',
              label: <span><BarChartOutlined />시나리오 비교</span>,
              children: <ScenarioComparisonTab />
            },
            {
              key: 'farm_total',
              label: <span><RiseOutlined />전체 농장 (농장주용)</span>,
              children: <FarmTotalTab />
            }
          ]}
        />
      )}
    </div>
  );
};

export default YieldPrediction;
