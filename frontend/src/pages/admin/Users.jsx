import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Avatar,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  message,
  Popconfirm,
  Badge,
  Tooltip,
  Statistic
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { MANAGER_DATA } from '../../utils/greenhouseManager';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchText, filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // 기존 관리자 데이터를 사용자 형태로 변환
      const userList = [
        {
          id: 'admin_001',
          name: '시스템 관리자',
          email: 'admin@smartfarm.com',
          phone: '010-0000-0000',
          role: 'admin',
          status: 'active',
          joinDate: '2023-01-01',
          lastLogin: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
          permissions: ['all'],
          avatar: null
        },
        {
          id: 'owner_001',
          name: '농장주',
          email: 'owner@smartfarm.com',
          phone: '010-1111-1111',
          role: 'owner',
          status: 'active',
          joinDate: '2023-01-15',
          lastLogin: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm'),
          permissions: ['greenhouse_view', 'manager_view', 'analytics'],
          avatar: null
        },
        ...Object.values(MANAGER_DATA).map(manager => ({
          id: manager.id,
          name: manager.name,
          email: manager.email,
          phone: manager.phone,
          role: 'manager',
          status: 'active',
          joinDate: manager.joinDate,
          lastLogin: dayjs().subtract(Math.floor(Math.random() * 24), 'hour').format('YYYY-MM-DD HH:mm'),
          permissions: ['greenhouse_manage', 'task_execute'],
          avatar: null,
          specialty: manager.specialty,
          experience: manager.experience,
          performance: manager.performance
        }))
      ];
      
      setUsers(userList);
    } catch (error) {
      console.error('사용자 데이터 로딩 실패:', error);
      message.error('사용자 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    
    // 역할 필터
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    // 검색 필터
    if (searchText) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phone.includes(searchText)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
    setDetailModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      joinDate: dayjs(user.joinDate)
    });
    setModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      message.success('사용자가 삭제되었습니다.');
    } catch (error) {
      message.error('사용자 삭제에 실패했습니다.');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 수정
        const updatedUsers = users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values, joinDate: values.joinDate.format('YYYY-MM-DD') }
            : user
        );
        setUsers(updatedUsers);
        message.success('사용자 정보가 수정되었습니다.');
      } else {
        // 추가
        const newUser = {
          id: `user_${Date.now()}`,
          ...values,
          joinDate: values.joinDate.format('YYYY-MM-DD'),
          lastLogin: '-',
          status: 'active',
          permissions: getRolePermissions(values.role)
        };
        setUsers([...users, newUser]);
        message.success('새 사용자가 추가되었습니다.');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('사용자 저장 실패:', error);
    }
  };

  const getRolePermissions = (role) => {
    switch (role) {
      case 'admin': return ['all'];
      case 'owner': return ['greenhouse_view', 'manager_view', 'analytics'];
      case 'manager': return ['greenhouse_manage', 'task_execute'];
      default: return [];
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'owner': return 'gold';
      case 'manager': return 'blue';
      default: return 'default';
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return '시스템 관리자';
      case 'owner': return '농장주';
      case 'manager': return '재배관리자';
      default: return '사용자';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: '사용자',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            style={{ backgroundColor: getRoleColor(record.role) }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: '역할',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleName(role)}
        </Tag>
      ),
      filters: [
        { text: '시스템 관리자', value: 'admin' },
        { text: '농장주', value: 'owner' },
        { text: '재배관리자', value: 'manager' }
      ],
      onFilter: (value, record) => record.role === value
    },
    {
      title: '연락처',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          <span>{phone}</span>
        </Space>
      )
    },
    {
      title: '가입일',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <span>{date}</span>
        </Space>
      ),
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate)
    },
    {
      title: '최근 로그인',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin) => (
        <Text type="secondary">{lastLogin}</Text>
      )
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={status === 'active' ? '활성' : '비활성'}
        />
      )
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="상세보기">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="수정">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          {record.role !== 'admin' && (
            <Tooltip title="삭제">
              <Popconfirm
                title="이 사용자를 삭제하시겠습니까?"
                onConfirm={() => handleDeleteUser(record.id)}
                okText="삭제"
                cancelText="취소"
              >
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  size="small"
                  danger
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // 사용자 통계
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    owners: users.filter(u => u.role === 'owner').length,
    managers: users.filter(u => u.role === 'manager').length,
    active: users.filter(u => u.status === 'active').length,
    newThisMonth: users.filter(u => dayjs(u.joinDate).isAfter(dayjs().subtract(1, 'month'))).length
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>👥 사용자 관리</Title>
        <Text type="secondary">시스템 사용자들을 관리하고 권한을 설정하세요</Text>
      </div>

      {/* 사용자 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="전체 사용자"
              value={userStats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="관리자"
              value={userStats.admins}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="농장주"
              value={userStats.owners}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="재배관리자"
              value={userStats.managers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="활성 사용자"
              value={userStats.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="이번 달 신규"
              value={userStats.newThisMonth}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 필터 및 검색 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="이름, 이메일, 전화번호로 검색"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              style={{ width: '100%' }}
              value={filterRole}
              onChange={setFilterRole}
            >
              <Option value="all">전체 역할</Option>
              <Option value="admin">시스템 관리자</Option>
              <Option value="owner">농장주</Option>
              <Option value="manager">재배관리자</Option>
            </Select>
          </Col>
          <Col xs={24} sm={10} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddUser}
              >
                새 사용자 추가
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 사용자 테이블 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}명`
          }}
        />
      </Card>

      {/* 사용자 상세보기 모달 */}
      <Modal
        title="사용자 상세 정보"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setViewingUser(null);
        }}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setDetailModalVisible(false);
            handleEditUser(viewingUser);
          }}>
            수정
          </Button>,
          <Button key="close" onClick={() => {
            setDetailModalVisible(false);
            setViewingUser(null);
          }}>
            닫기
          </Button>
        ]}
        width={700}
      >
        {viewingUser && (
          <div>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                <Avatar 
                  size={80} 
                  src={viewingUser.avatar} 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: getRoleColor(viewingUser.role) }}
                />
                <div style={{ marginTop: '16px' }}>
                  <Title level={4} style={{ margin: 0 }}>{viewingUser.name}</Title>
                  <Tag color={getRoleColor(viewingUser.role)} style={{ marginTop: '8px' }}>
                    {getRoleName(viewingUser.role)}
                  </Tag>
                </div>
              </Col>
              
              <Col xs={24} sm={16}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <Text strong>기본 정보</Text>
                    <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <MailOutlined style={{ marginRight: '8px' }} />
                        <Text>{viewingUser.email}</Text>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <PhoneOutlined style={{ marginRight: '8px' }} />
                        <Text>{viewingUser.phone}</Text>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <CalendarOutlined style={{ marginRight: '8px' }} />
                        <Text>가입일: {viewingUser.joinDate}</Text>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Text>최근 로그인: {viewingUser.lastLogin}</Text>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Text strong>계정 상태</Text>
                    <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                      <Badge 
                        status={viewingUser.status === 'active' ? 'success' : 'error'} 
                        text={viewingUser.status === 'active' ? '활성' : '비활성'}
                      />
                    </div>
                  </div>

                  <div>
                    <Text strong>권한</Text>
                    <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                      <Space wrap>
                        {viewingUser.permissions?.map(permission => (
                          <Tag key={permission} color="blue">
                            {permission === 'all' ? '전체 권한' :
                             permission === 'greenhouse_view' ? '온실 조회' :
                             permission === 'manager_view' ? '관리자 조회' :
                             permission === 'analytics' ? '분석' :
                             permission === 'greenhouse_manage' ? '온실 관리' :
                             permission === 'task_execute' ? '작업 실행' :
                             permission}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>

                  {viewingUser.role === 'manager' && (
                    <div>
                      <Text strong>전문 정보</Text>
                      <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                        {viewingUser.specialty && (
                          <div style={{ marginBottom: '8px' }}>
                            <Text>전문 분야: </Text>
                            <Tag color="green">{viewingUser.specialty}</Tag>
                          </div>
                        )}
                        {viewingUser.experience && (
                          <div style={{ marginBottom: '8px' }}>
                            <Text>경력: {viewingUser.experience}</Text>
                          </div>
                        )}
                        {viewingUser.performance && (
                          <div style={{ marginBottom: '8px' }}>
                            <Text>평점: ⭐ {viewingUser.performance.rating?.toFixed(1)}</Text>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Space>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 사용자 추가/수정 모달 */}
      <Modal
        title={editingUser ? '사용자 수정' : '새 사용자 추가'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            joinDate: dayjs()
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="이름"
                name="name"
                rules={[{ required: true, message: '이름을 입력해주세요' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="역할"
                name="role"
                rules={[{ required: true, message: '역할을 선택해주세요' }]}
              >
                <Select>
                  <Option value="admin">시스템 관리자</Option>
                  <Option value="owner">농장주</Option>
                  <Option value="manager">재배관리자</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="이메일"
                name="email"
                rules={[
                  { required: true, message: '이메일을 입력해주세요' },
                  { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="전화번호"
                name="phone"
                rules={[{ required: true, message: '전화번호를 입력해주세요' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="가입일"
                name="joinDate"
                rules={[{ required: true, message: '가입일을 선택해주세요' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="상태"
                name="status"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="활성" 
                  unCheckedChildren="비활성"
                  checked={form.getFieldValue('status') === 'active'}
                  onChange={(checked) => form.setFieldsValue({ status: checked ? 'active' : 'inactive' })}
                />
              </Form.Item>
            </Col>
          </Row>

          {form.getFieldValue('role') === 'manager' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="전문 분야" name="specialty">
                  <Input placeholder="예: 토마토 재배" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="경력" name="experience">
                  <Input placeholder="예: 5년" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;