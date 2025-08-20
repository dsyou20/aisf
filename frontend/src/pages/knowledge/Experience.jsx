import React from 'react';
import { Card, List, Tag, Button, Avatar } from 'antd';
import { UserOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';

const KnowledgeExperience = () => {
  const experienceKnowledge = [
    {
      id: 1,
      title: '토마토 병해 예방 경험담',
      author: '김철수',
      experience: '15년',
      description: '15년간 토마토 재배하면서 겪은 병해 예방 노하우를 공유합니다.',
      tags: ['토마토', '병해예방', '경험담'],
      likes: 45,
      views: 320
    },
    {
      id: 2,
      title: '딸기 수확량 증대 비결',
      author: '이영희',
      experience: '8년',
      description: '딸기 재배 8년간 수확량을 30% 증대시킨 관리 방법을 소개합니다.',
      tags: ['딸기', '수확량', '관리법'],
      likes: 38,
      views: 280
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>경험 지식</h1>
      
      <List
        itemLayout="vertical"
        size="large"
        dataSource={experienceKnowledge}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button type="link" icon={<EyeOutlined />}>
                보기 ({item.views})
              </Button>,
              <Button type="link" icon={<LikeOutlined />}>
                좋아요 ({item.likes})
              </Button>
            ]}
            extra={
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Avatar icon={<UserOutlined />} size="small" />
                  <span>{item.author}</span>
                </div>
                <Tag color="orange">{item.experience} 경력</Tag>
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

export default KnowledgeExperience; 