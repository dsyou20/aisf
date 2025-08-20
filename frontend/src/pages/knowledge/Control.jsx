import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const KnowledgeControl = () => {
  const controlKnowledge = [
    {
      id: 1,
      title: '자동화 시스템 제어 매뉴얼',
      category: '시스템제어',
      description: '온도, 습도, 관수 등 자동화 시스템의 제어 방법과 설정 가이드입니다.',
      tags: ['자동화', '시스템', '제어'],
      views: 1800,
      downloads: 130
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>제어 지식</h1>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={controlKnowledge}
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
              <Tag color="cyan">{item.category}</Tag>
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

export default KnowledgeControl; 