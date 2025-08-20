import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const KnowledgeDisease = () => {
  const diseaseKnowledge = [
    {
      id: 1,
      title: '토마토 주요 병해 진단 및 치료법',
      category: '병해관리',
      description: '토마토에서 자주 발생하는 병해의 진단 방법과 치료법을 상세히 설명합니다.',
      tags: ['토마토', '병해', '진단', '치료'],
      views: 1500,
      downloads: 120
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>병해 지식</h1>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={diseaseKnowledge}
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
              <Tag color="red">{item.category}</Tag>
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

export default KnowledgeDisease; 