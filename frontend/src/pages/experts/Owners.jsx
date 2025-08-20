import React from 'react';
import { Card, Table, Button, Tag, Avatar } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ExpertOwners = () => {
  const ownersData = [
    {
      key: '1',
      name: '김철수',
      farm: '청정농장',
      area: '하우스 A, B',
      experience: '15년',
      status: 'active',
      phone: '010-1234-5678',
      email: 'kim@farm.com'
    },
    {
      key: '2',
      name: '이영희',
      farm: '녹색농장',
      area: '하우스 C',
      experience: '8년',
      status: 'active',
      phone: '010-2345-6789',
      email: 'lee@farm.com'
    },
    {
      key: '3',
      name: '박민수',
      farm: '자연농장',
      area: '하우스 D',
      experience: '12년',
      status: 'inactive',
      phone: '010-3456-7890',
      email: 'park@farm.com'
    }
  ];

  const columns = [
    {
      title: '농장주',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar icon={<UserOutlined />} />
          {name}
        </div>
      )
    },
    { title: '농장명', dataIndex: 'farm', key: 'farm' },
    { title: '관리구역', dataIndex: 'area', key: 'area' },
    { title: '경력', dataIndex: 'experience', key: 'experience' },
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
        <h1>농장주 관리</h1>
        <Button type="primary">새 농장주 등록</Button>
      </div>
      
      <Card>
        <Table 
          dataSource={ownersData} 
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ExpertOwners; 