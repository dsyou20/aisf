import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Statistic,
  Progress,
  Badge,
  Modal,
  Tooltip,
  Divider,
  Alert
} from 'antd';
import {
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  DollarOutlined,
  HomeOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  GREENHOUSE_DATA,
  GREENHOUSE_STATUS_COLORS,
  SENSOR_STATUS_COLORS,
  getFilteredGreenhouses
} from '../../utils/greenhouseManager';
import { predictGreenhouseYield } from '../../utils/yieldPrediction';
import GreenhouseSimulator from '../../components/shared/GreenhouseSimulator';

const { Title, Text } = Typography;

const ManagerGreenhouses = () => {
  const [loading, setLoading] = useState(true);
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [simulatorVisible, setSimulatorVisible] = useState(false);

  useEffect(() => {
    loadGreenhouseData();
  }, []);

  const loadGreenhouseData = async () => {
    try {
      setLoading(true);
      
      // 재배관리자에게 할당된 온실들만 조회 (예: manager_kim)
      const assignedGreenhouses = getFilteredGreenhouses('manager', 'manager_kim');
      
      // 각 온실의 수확량 예측 데이터 추가
      const greenhousesWithPrediction = assignedGreenhouses.map(greenhouse => {
        const prediction = predictGreenhouseYield(greenhouse.id);
        return {
          ...greenhouse,
          prediction
        };
      });
      
      setGreenhouses(greenhousesWithPrediction);
    } catch (error) {
      console.error('온실 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGreenhouseDetail = (greenhouse) => {
    setSelectedGreenhouse(greenhouse);
    setSimulatorVisible(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined style={{ color: GREENHOUSE_STATUS_COLORS.active }} />;
      case 'maintenance':
        return <ExclamationCircleOutlined style={{ color: GREENHOUSE_STATUS_COLORS.maintenance }} />;
      case 'inactive':
        return <CloseCircleOutlined style={{ color: GREENHOUSE_STATUS_COLORS.inactive }} />;
      default:
        return <WarningOutlined style={{ color: GREENHOUSE_STATUS_COLORS.warning }} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '정상 운영';
      case 'maintenance': return '점검 중';
      case 'inactive': return '비활성';
      default: return '상태 불명';
    }
  };

  const getSensorStatus = (current, optimal) => {
    // optimal이 배열이 아니거나 undefined인 경우 기본값 사용
    if (!optimal || !Array.isArray(optimal) || optimal.length < 2) {
      return { status: 'unknown', color: '#666' };
    }
    
    if (current >= optimal[0] && current <= optimal[1]) {
      return { status: 'good', color: '#52c41a' };
    } else if (current < optimal[0] * 0.8 || current > optimal[1] * 1.2) {
      return { status: 'critical', color: '#ff4d4f' };
    } else {
      return { status: 'warning', color: '#fa8c16' };
    }
  };

  // 전체 통계 계산
  const totalStats = {
    total: greenhouses.length,
    active: greenhouses.filter(g => g.status === 'active').length,
    maintenance: greenhouses.filter(g => g.status === 'maintenance').length,
    totalYield: greenhouses.reduce((sum, g) => sum + (g.prediction?.expectedYield || 0), 0),
    avgEfficiency: greenhouses.length > 0 ? 
      greenhouses.reduce((sum, g) => sum + (g.productivity?.efficiency || 0), 0) / greenhouses.length : 0
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>🏠 담당 온실 관리</Title>
        <Text type="secondary">담당하고 있는 온실들의 현황을 관리하고 모니터링하세요</Text>
      </div>

      {/* 전체 현황 요약 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="담당 온실 수"
              value={totalStats.total}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="정상 운영"
              value={totalStats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="예상 수확량"
              value={totalStats.totalYield}
              precision={1}
              suffix="kg"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="평균 효율성"
              value={totalStats.avgEfficiency}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
            <Progress 
              percent={totalStats.avgEfficiency} 
              showInfo={false}
              strokeColor="#722ed1"
            />
          </Card>
        </Col>
      </Row>

      {/* 성과 알림 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Alert
            message="오늘의 성과"
            description={`총 ${totalStats.total}개 온실 중 ${totalStats.active}개가 정상 운영 중입니다. 예상 수확량은 ${totalStats.totalYield.toFixed(1)}kg이며, 평균 효율성은 ${totalStats.avgEfficiency.toFixed(1)}%입니다.`}
            type="info"
            showIcon
            closable
          />
        </Col>
      </Row>

      {/* 온실 목록 */}
      <Row gutter={[16, 16]}>
        {greenhouses.map(greenhouse => (
          <Col xs={24} sm={12} lg={8} key={greenhouse.id}>
            <Card
              title={
                <Space>
                  {getStatusIcon(greenhouse.status)}
                  <span>{greenhouse.name}</span>
                  <Tag color={GREENHOUSE_STATUS_COLORS[greenhouse.status]}>
                    {getStatusText(greenhouse.status)}
                  </Tag>
                </Space>
              }
              extra={
                <Button 
                  type="primary" 
                  icon={<EyeOutlined />}
                  onClick={() => handleGreenhouseDetail(greenhouse)}
                >
                  상세관리
                </Button>
              }
              loading={loading}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* 기본 정보 */}
                <div>
                  <Text type="secondary">작물: </Text>
                  <Text strong>{greenhouse.crop}</Text>
                </div>
                <div>
                  <Text type="secondary">재배 주차: </Text>
                  <Text>{greenhouse.currentWeek || 15}주차</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* 환경 센서 상태 */}
                <div>
                  <Text strong style={{ marginBottom: '8px', display: 'block' }}>환경 상태</Text>
                  <Row gutter={8}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: getSensorStatus(
                            greenhouse.sensors?.temperature?.current || 0,
                            greenhouse.sensors?.temperature?.optimal
                          ).color
                        }}>
                          {greenhouse.sensors?.temperature?.current || 0}°C
                        </div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>온도</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: getSensorStatus(
                            greenhouse.sensors?.humidity?.current || 0,
                            greenhouse.sensors?.humidity?.optimal
                          ).color
                        }}>
                          {greenhouse.sensors?.humidity?.current || 0}%
                        </div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>습도</Text>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row gutter={8} style={{ marginTop: '8px' }}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          color: getSensorStatus(
                            greenhouse.sensors?.soilMoisture?.current || 0,
                            greenhouse.sensors?.soilMoisture?.optimal
                          ).color
                        }}>
                          {greenhouse.sensors?.soilMoisture?.current || 0}%
                        </div>
                        <Text type="secondary" style={{ fontSize: '10px' }}>토양수분</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          color: '#1890ff'
                        }}>
                          {greenhouse.sensors?.co2?.current || 0}ppm
                        </div>
                        <Text type="secondary" style={{ fontSize: '10px' }}>CO2</Text>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* 성과 지표 */}
                <div>
                  <Text strong style={{ marginBottom: '8px', display: 'block' }}>성과 지표</Text>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Statistic
                        title="효율성"
                        value={greenhouse.productivity?.efficiency || 0}
                        precision={1}
                        suffix="%"
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="예상수확"
                        value={greenhouse.prediction?.expectedYield || 0}
                        precision={1}
                        suffix="kg"
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Col>
                  </Row>
                </div>

                {/* 알림 */}
                {greenhouse.alerts && greenhouse.alerts.length > 0 && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div>
                      <Badge count={greenhouse.alerts.length} size="small">
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        <Text style={{ marginLeft: '8px' }}>주의사항 있음</Text>
                      </Badge>
                    </div>
                  </>
                )}

                {/* 작업 진행률 */}
                <div style={{ marginTop: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>오늘 작업 진행률</Text>
                  <Progress 
                    percent={Math.floor(Math.random() * 40) + 60} 
                    size="small"
                    strokeColor="#52c41a"
                  />
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 상세관리 모달 */}
      <Modal
        title={`${selectedGreenhouse?.name} 상세 관리`}
        open={simulatorVisible}
        onCancel={() => {
          setSimulatorVisible(false);
          setSelectedGreenhouse(null);
        }}
        width="90%"
        style={{ top: 20 }}
        footer={null}
        destroyOnClose
      >
        {selectedGreenhouse && (
          <GreenhouseSimulator 
            greenhouse={selectedGreenhouse}
            isModal={true}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManagerGreenhouses;
