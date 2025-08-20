import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table } from 'antd';
import { 
  ExperimentOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';

const CultivationOverview = () => {
  const cultivationData = [
    {
      key: '1',
      crop: '토마토',
      area: '하우스 A',
      stage: '결실기',
      progress: 85,
      status: '정상',
      startDate: '2024-01-01',
      expectedHarvest: '2024-03-15'
    },
    {
      key: '2',
      crop: '딸기',
      area: '하우스 B',
      stage: '생장기',
      progress: 45,
      status: '정상',
      startDate: '2024-01-15',
      expectedHarvest: '2024-04-01'
    },
    {
      key: '3',
      crop: '토마토',
      area: '하우스 C',
      stage: '발아기',
      progress: 15,
      status: '주의',
      startDate: '2024-01-20',
      expectedHarvest: '2024-02-28'
    }
  ];

  const columns = [
    { title: '작물', dataIndex: 'crop', key: 'crop' },
    { title: '재배구역', dataIndex: 'area', key: 'area' },
    { title: '생장단계', dataIndex: 'stage', key: 'stage' },
    { 
      title: '진행률', 
      dataIndex: 'progress', 
      key: 'progress',
      render: (progress) => <Progress percent={progress} size="small" />
    },
    { 
      title: '상태', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === '정상' ? '#52c41a' : status === '주의' ? '#faad14' : '#ff4d4f' 
        }}>
          {status}
        </span>
      )
    },
    { title: '재배시작일', dataIndex: 'startDate', key: 'startDate' },
    { title: '예상수확일', dataIndex: 'expectedHarvest', key: 'expectedHarvest' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>재배 개요</h1>
      
      {/* 전체 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="전체 재배구역"
              value={3}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="정상 작물"
              value={2}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="생장 중"
              value={2}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="주의 필요"
              value={1}
              prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 재배 현황 테이블 */}
      <Card title="재배 현황" style={{ marginBottom: '24px' }}>
        <Table 
          dataSource={cultivationData} 
          columns={columns}
          pagination={false}
        />
      </Card>

      {/* AI 권장사항 */}
      <Card title="AI 재배 권장사항">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="토마토 (하우스 A)">
              <ul>
                <li>온도: 현재 25°C (적정 22-28°C) - 정상</li>
                <li>습도: 현재 65% (적정 60-70%) - 정상</li>
                <li>관수: 오후 3시 예정</li>
                <li>비료: 내일 오전 9시 예정</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="딸기 (하우스 B)">
              <ul>
                <li>온도: 현재 23°C (적정 18-25°C) - 정상</li>
                <li>습도: 현재 70% (적정 60-70%) - 정상</li>
                <li>관수: 오후 2시 예정</li>
                <li>비료: 3일 후 예정</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CultivationOverview; 