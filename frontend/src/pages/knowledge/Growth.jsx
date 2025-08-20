import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const KnowledgeGrowth = () => {
  const growthKnowledge = [
    {
      id: 1,
      title: '작물 생장 단계별 관리법',
      category: '생장관리',
      description: '발아기부터 수확기까지 각 단계별 최적 관리 방법을 정리했습니다.',
      tags: ['생장단계', '관리법', '최적화'],
      views: 1200,
      downloads: 95
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>생장 지식</h1>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={growthKnowledge}
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

export default KnowledgeGrowth; 