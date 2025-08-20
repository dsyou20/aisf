import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch,
  Typography,
  Row,
  Col,
  Statistic,
  Avatar,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@smartfarm.com',
      role: 'admin',
      name: '시스템 관리자',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      createdAt: '2024-01-01',
      permissions: ['all']
    },
    {
      id: 2,
      username: 'owner1',
      email: 'owner1@smartfarm.com',
      role: 'owner',
      name: '김농장주',
      status: 'active',
      lastLogin: '2024-01-15 13:45',
      createdAt: '2024-01-05',
      permissions: ['dashboard', 'reports', 'experts']
    },
    {
      id: 3,
      username: 'manager1',
      email: 'manager1@smartfarm.com',
      role: 'manager',
      name: '이재배관리자',
      status: 'active',
      lastLogin: '2024-01-15 12:20',
      createdAt: '2024-01-10',
      permissions: ['cultivation', 'monitoring', 'ai-recommendation']
    },
    {
      id: 4,
      username: 'manager2',
      email: 'manager2@smartfarm.com',
      role: 'manager',
      name: '박재배관리자',
      status: 'inactive',
      lastLogin: '2024-01-10 09:15',
      createdAt: '2024-01-12',
      permissions: ['cultivation', 'monitoring']
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const roleColors = {
    admin: '#722ed1',
    owner: '#52c41a',
    manager: '#1890ff'
  };

  const roleLabels = {
    admin: '관리자',
    owner: '농장주',
    manager: '재배관리자'
  };

  const statusColors = {
    active: 'success',
    inactive: 'default'
  };

  const statusLabels = {
    active: '활성',
    inactive: '비활성'
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      status: user.status === 'active'
    });
    setIsModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 수정
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { 
                ...user, 
                username: values.username,
                email: values.email,
                role: values.role,
                name: values.name,
                status: values.status ? 'active' : 'inactive'
              }
            : user
        ));
      } else {
        // 추가
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          username: values.username,
          email: values.email,
          role: values.role,
          name: values.name,
          status: values.status ? 'active' : 'inactive',
          lastLogin: '-',
          createdAt: new Date().toISOString().split('T')[0],
          permissions: []
        };
        setUsers([...users, newUser]);
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: '사용자',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: roleColors[record.role] }}
            icon={<UserOutlined />}
          />
          <div>
            <div><Text strong>{record.name}</Text></div>
            <div><Text type="secondary">{record.username}</Text></div>
          </div>
        </Space>
      )
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '역할',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={roleColors[role]}>
          {roleLabels[role]}
        </Tag>
      )
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {statusLabels[status]}
        </Tag>
      )
    },
    {
      title: '마지막 로그인',
      dataIndex: 'lastLogin',
      key: 'lastLogin'
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '작업',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="상태 변경">
            <Button
              type="text"
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record.id)}
            />
          </Tooltip>
          <Tooltip title="수정">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="사용자를 삭제하시겠습니까?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="삭제"
              cancelText="취소"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admin: users.filter(u => u.role === 'admin').length,
    owner: users.filter(u => u.role === 'owner').length,
    manager: users.filter(u => u.role === 'manager').length
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>사용자 관리</Title>
        <Text type="secondary">시스템 사용자 계정을 관리합니다.</Text>
      </div>

      {/* 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="총 사용자"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="활성 사용자"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="농장주"
              value={stats.owner}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="재배관리자"
              value={stats.manager}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 사용자 목록 */}
      <Card
        title="사용자 목록"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            사용자 추가
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}개`
          }}
        />
      </Card>

      {/* 사용자 추가/수정 모달 */}
      <Modal
        title={editingUser ? '사용자 수정' : '사용자 추가'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingUser ? '수정' : '추가'}
        cancelText="취소"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="사용자명"
                rules={[
                  { required: true, message: '사용자명을 입력하세요' },
                  { min: 3, message: '최소 3자 이상 입력하세요' }
                ]}
              >
                <Input placeholder="사용자명" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="실명"
                rules={[
                  { required: true, message: '실명을 입력하세요' }
                ]}
              >
                <Input placeholder="실명" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력하세요' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
            ]}
          >
            <Input placeholder="이메일" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="역할"
                rules={[
                  { required: true, message: '역할을 선택하세요' }
                ]}
              >
                <Select placeholder="역할 선택">
                  <Option value="admin">관리자</Option>
                  <Option value="owner">농장주</Option>
                  <Option value="manager">재배관리자</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="상태"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="활성" 
                  unCheckedChildren="비활성" 
                />
              </Form.Item>
            </Col>
          </Row>

          {!editingUser && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="비밀번호"
                  rules={[
                    { required: true, message: '비밀번호를 입력하세요' },
                    { min: 6, message: '최소 6자 이상 입력하세요' }
                  ]}
                >
                  <Input.Password placeholder="비밀번호" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="비밀번호 확인"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '비밀번호를 다시 입력하세요' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('비밀번호가 일치하지 않습니다'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="비밀번호 확인" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Users; 