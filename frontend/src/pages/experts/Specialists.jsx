import React from 'react';
import { Card, Table, Button, Tag, Avatar, Rate } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';

const ExpertSpecialists = () => {
  const specialistsData = [
    {
      key: '1',
      name: '박전문',
      specialty: '토마토 재배',
      experience: '20년',
      rating: 5,
      status: 'active',
      phone: '010-1111-2222',
      email: 'park@expert.com',
      consultationCount: 45
    },
    {
      key: '2',
      name: '김전문',
      specialty: '딸기 재배',
      experience: '15년',
      rating: 4,
      status: 'active',
      phone: '010-2222-3333',
      email: 'kim@expert.com',
      consultationCount: 32
    },
    {
      key: '3',
      name: '이전문',
      specialty: '토마토 재배',
      experience: '12년',
      rating: 4,
      status: 'inactive',
      phone: '010-3333-4444',
      email: 'lee@expert.com',
      consultationCount: 28
    }
  ];

  const columns = [
    {
      title: '전문가',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar icon={<UserOutlined />} />
          {name}
        </div>
      )
    },
    { title: '전문분야', dataIndex: 'specialty', key: 'specialty' },
    { title: '경력', dataIndex: 'experience', key: 'experience' },
    {
      title: '평점',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '활성' : '비활성'}
        </Tag>
      )
    },
    { title: '상담 횟수', dataIndex: 'consultationCount', key: 'consultationCount' },
    { title: '연락처', dataIndex: 'phone', key: 'phone' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    {
      title: '작업',
      key: 'actions',
      render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" size="small" icon={<EditOutlined />}>
            수정
          </Button>
          <Button danger size="small" icon={<DeleteOutlined />}>
            삭제
          </Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>전문가 관리</h1>
        <Button type="primary">새 전문가 등록</Button>
      </div>
      
      <Card>
        <Table 
          dataSource={specialistsData} 
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ExpertSpecialists; 