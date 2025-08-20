import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { EnvironmentOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const KnowledgeEnvironment = () => {
  const environmentKnowledge = [
    {
      id: 1,
      title: '온도 관리 최적화 가이드',
      category: '온도관리',
      description: '작물별 최적 온도 설정과 관리 방법을 상세히 설명합니다.',
      tags: ['온도', '최적화', '관리'],
      views: 890,
      downloads: 67
    },
    {
      id: 2,
      title: '습도 조절 시스템 운영법',
      category: '습도관리',
      description: '습도 조절 시스템의 효율적인 운영 방법과 주의사항을 다룹니다.',
      tags: ['습도', '시스템', '운영'],
      views: 756,
      downloads: 54
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>환경 지식</h1>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={environmentKnowledge}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button type="link" icon={<EyeOutlined />}>
                보기 ({item.views})
              </Button>,
              <Button type="link" icon={<DownloadOutlined />}>
                다운로드 ({item.downloads})
              </Button>
            ]}
            extra={
              <Tag color="blue">{item.category}</Tag>
            }
          >
            <List.Item.Meta
              title={item.title}
              description={item.description}
            />
            <div style={{ marginTop: '8px' }}>
              {item.tags.map(tag => (
                <Tag key={tag} style={{ marginBottom: '4px' }}>{tag}</Tag>
              ))}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default KnowledgeEnvironment; 