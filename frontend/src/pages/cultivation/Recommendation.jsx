import React from 'react';
import { Card, Row, Col, List, Tag, Button } from 'antd';
import { 
  BulbOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';

const CultivationRecommendation = () => {
  const recommendations = [
    {
      id: 1,
      crop: '토마토',
      area: '하우스 A',
      type: '온도 조절',
      priority: 'high',
      description: '현재 온도가 25.6°C로 적정 범위 내에 있으나, 오후 2시경 28°C를 초과할 것으로 예상됩니다.',
      action: '오후 1시 30분부터 환기 시스템을 가동하여 온도를 26°C 이하로 유지하세요.',
      status: 'pending'
    },
    {
      id: 2,
      crop: '딸기',
      area: '하우스 B',
      type: '관수',
      priority: 'medium',
      description: '토양 수분이 65%로 적정 수준이지만, 내일 오전까지 강수 확률이 낮습니다.',
      action: '내일 오전 9시에 관수를 실시하여 토양 수분을 70%로 유지하세요.',
      status: 'pending'
    },
    {
      id: 3,
      crop: '토마토',
      area: '하우스 C',
      type: '비료',
      priority: 'low',
      description: '생장 단계에 따라 질소 비료가 필요합니다.',
      action: '3일 후 질소 비료를 1kg/10㎡ 비율로 시비하세요.',
      status: 'completed'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '보통';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>AI 재배 권장사항</h1>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={recommendations}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button type="primary" size="small">
                {item.status === 'completed' ? '완료됨' : '실행하기'}
              </Button>
            ]}
            extra={
              <div style={{ textAlign: 'right' }}>
                <Tag color={getPriorityColor(item.priority)}>
                  우선순위: {getPriorityText(item.priority)}
                </Tag>
                <br />
                <Tag color={item.status === 'completed' ? 'green' : 'blue'}>
                  {item.status === 'completed' ? '완료' : '대기'}
                </Tag>
              </div>
            }
          >
            <List.Item.Meta
              title={
                <div>
                  <BulbOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  {item.crop} ({item.area}) - {item.type}
                </div>
              }
              description={item.description}
            />
            <div style={{ marginTop: '16px' }}>
              <strong>권장 조치:</strong> {item.action}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CultivationRecommendation; 