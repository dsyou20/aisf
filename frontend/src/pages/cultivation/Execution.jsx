import React from 'react';
import { Card, Row, Col, Button, List, Tag, Progress } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  StopOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const CultivationExecution = () => {
  const executionTasks = [
    {
      id: 1,
      name: '온도 조절 시스템',
      status: 'running',
      progress: 75,
      description: '하우스 A 온도 조절 중',
      startTime: '14:30',
      estimatedEnd: '15:00'
    },
    {
      id: 2,
      name: '관수 시스템',
      status: 'pending',
      progress: 0,
      description: '하우스 B 딸기 관수 예정',
      startTime: '15:00',
      estimatedEnd: '15:30'
    },
    {
      id: 3,
      name: '비료 공급 시스템',
      status: 'completed',
      progress: 100,
      description: '하우스 C 토마토 비료 공급 완료',
      startTime: '09:00',
      estimatedEnd: '09:15'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'blue';
      case 'pending': return 'orange';
      case 'completed': return 'green';
      case 'stopped': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'running': return '실행 중';
      case 'pending': return '대기 중';
      case 'completed': return '완료';
      case 'stopped': return '중지됨';
      default: return '알 수 없음';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>재배 실행</h1>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="시스템 제어">
            <Row gutter={[16, 16]}>
              <Col>
                <Button type="primary" icon={<PlayCircleOutlined />} size="large">
                  전체 시작
                </Button>
              </Col>
              <Col>
                <Button icon={<PauseCircleOutlined />} size="large">
                  일시정지
                </Button>
              </Col>
              <Col>
                <Button danger icon={<StopOutlined />} size="large">
                  전체 중지
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={executionTasks}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              item.status === 'running' ? (
                <Button icon={<PauseCircleOutlined />}>일시정지</Button>
              ) : item.status === 'pending' ? (
                <Button type="primary" icon={<PlayCircleOutlined />}>시작</Button>
              ) : (
                <Button disabled icon={<CheckCircleOutlined />}>완료</Button>
              )
            ]}
            extra={
              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <Tag color={getStatusColor(item.status)}>
                  {getStatusText(item.status)}
                </Tag>
                <br />
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  {item.startTime} - {item.estimatedEnd}
                </div>
              </div>
            }
          >
            <List.Item.Meta
              title={item.name}
              description={item.description}
            />
            <div style={{ marginTop: '16px' }}>
              <Progress 
                percent={item.progress} 
                status={item.status === 'completed' ? 'success' : 'active'}
                size="small"
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CultivationExecution; 