import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const KnowledgeRecommendation = () => {
  const recommendationKnowledge = [
    {
      id: 1,
      title: 'AI 기반 재배 권장사항 가이드',
      category: 'AI권장',
      description: 'AI 시스템이 제공하는 재배 권장사항의 해석과 적용 방법을 설명합니다.',
      tags: ['AI', '권장사항', '가이드'],
      views: 2000,
      downloads: 150
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>권장 지식</h1>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={recommendationKnowledge}
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
              <Tag color="purple">{item.category}</Tag>
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

export default KnowledgeRecommendation; 