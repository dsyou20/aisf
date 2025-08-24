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
  HomeOutlined
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
  getFilteredGreenhouses,
  getManagerPerformance,
  groupGreenhousesByManager
} from '../../utils/greenhouseManager';
import { predictGreenhouseYield } from '../../utils/yieldPrediction';
import GreenhouseSimulator from '../../components/shared/GreenhouseSimulator';

const { Title, Text } = Typography;

const OwnerGreenhouses = () => {
  const [loading, setLoading] = useState(true);
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [simulatorVisible, setSimulatorVisible] = useState(false);
  const [managerStats, setManagerStats] = useState([]);

  useEffect(() => {
    loadGreenhouseData();
  }, []);

  const loadGreenhouseData = async () => {
    try {
      setLoading(true);
      
      // 농장주는 모든 온실 데이터 조회
      const allGreenhouses = getFilteredGreenhouses('owner');
      
      // 각 온실의 수확량 예측 데이터 추가
      const greenhousesWithPrediction = allGreenhouses.map(greenhouse => {
        const prediction = predictGreenhouseYield(greenhouse.id);
        return {
          ...greenhouse,
          prediction
        };
      });
      
      // 관리자별 성과 데이터
      const managerPerformance = getManagerPerformance();
      
      setGreenhouses(greenhousesWithPrediction);
      setManagerStats(managerPerformance);
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

  // 전체 통계 계산
  const totalStats = {
    total: greenhouses.length,
    active: greenhouses.filter(g => g.status === 'active').length,
    maintenance: greenhouses.filter(g => g.status === 'maintenance').length,
    totalYield: greenhouses.reduce((sum, g) => sum + (g.prediction?.expectedYield || 0), 0),
    totalRevenue: greenhouses.reduce((sum, g) => sum + (g.prediction?.expectedRevenue || 0), 0)
  };

  // 관리자별 그룹화
  const groupedByManager = groupGreenhousesByManager(greenhouses);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>🏠 온실 관리</Title>
        <Text type="secondary">모든 온실의 현황을 관리하고 성과를 분석하세요</Text>
      </div>

      {/* 전체 현황 요약 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 온실 수"
              value={totalStats.total}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="운영 중"
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
              title="예상 수익"
              value={totalStats.totalRevenue}
              precision={0}
              suffix="원"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 관리자별 성과 */}
      <Card title="👥 관리자별 성과" style={{ marginBottom: '24px' }} loading={loading}>
        <Row gutter={[16, 16]}>
          {managerStats.map(manager => (
            <Col xs={24} sm={12} lg={8} key={manager.managerId}>
              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>{manager.managerName}</Text>
                    <Tag color="blue">{manager.greenhouseCount}개 온실</Tag>
                  </div>
                  <Statistic
                    title="평균 효율성"
                    value={manager.averageEfficiency}
                    precision={1}
                    suffix="%"
                    valueStyle={{ fontSize: '16px' }}
                  />
                  <Progress 
                    percent={manager.averageEfficiency} 
                    showInfo={false}
                    strokeColor={manager.averageEfficiency >= 80 ? '#52c41a' : '#fa8c16'}
                  />
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

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
                  상세보기
                </Button>
              }
              loading={loading}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* 기본 정보 */}
                <div>
                  <Text type="secondary">관리자: </Text>
                  <Text strong>{greenhouse.manager}</Text>
                </div>
                <div>
                  <Text type="secondary">작물: </Text>
                  <Text>{greenhouse.crop}</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* 환경 센서 상태 */}
                <div>
                  <Text strong style={{ marginBottom: '8px', display: 'block' }}>환경 상태</Text>
                  <Row gutter={8}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                          {greenhouse.sensors.temperature.current}°C
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>온도</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                          {greenhouse.sensors.humidity.current}%
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>습도</Text>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* 성과 지표 */}
                <div>
                  <Text strong style={{ marginBottom: '8px', display: 'block' }}>성과 예측</Text>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Statistic
                        title="예상 수확량"
                        value={greenhouse.prediction?.expectedYield || 0}
                        precision={1}
                        suffix="kg"
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="예상 수익"
                        value={greenhouse.prediction?.expectedRevenue || 0}
                        precision={0}
                        suffix="원"
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
                        <Text style={{ marginLeft: '8px' }}>알림 있음</Text>
                      </Badge>
                    </div>
                  </>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 상세보기 모달 */}
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

export default OwnerGreenhouses;
