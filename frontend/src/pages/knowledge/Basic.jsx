import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { BookOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const KnowledgeBasic = () => {
  const basicKnowledge = [
    {
      id: 1,
      title: '토마토 재배 기본 가이드',
      category: '토마토',
      level: '초급',
      description: '토마토 재배를 위한 기본적인 환경 설정과 관리 방법을 다룹니다.',
      tags: ['토마토', '기본', '환경설정'],
      views: 1250,
      downloads: 89
    },
    {
      id: 2,
      title: '딸기 재배 핵심 포인트',
      category: '딸기',
      level: '초급',
      description: '딸기 재배 시 주의해야 할 핵심 관리 포인트들을 정리했습니다.',
      tags: ['딸기', '관리', '주의사항'],
      views: 980,
      downloads: 67
    },
    {
      id: 3,
      title: '토마토 재배 기초',
      category: '토마토',
      level: '초급',
      description: '토마토 재배의 기본 원리와 실습 방법을 단계별로 설명합니다.',
      tags: ['토마토', '기초', '실습'],
      views: 756,
      downloads: 45
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>기본 지식</h1>
        <Button type="primary" icon={<BookOutlined />}>새 지식 등록</Button>
      </div>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={basicKnowledge}
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
              <div style={{ textAlign: 'right' }}>
                <Tag color="blue">{item.category}</Tag>
                <br />
                <Tag color="green">{item.level}</Tag>
              </div>
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

export default KnowledgeBasic; 