import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select, 
  Typography,
  Divider,
  message,
  Space,
  Avatar,
  Upload,
  Tabs,
  InputNumber,
  Slider,
  Alert,
  Table,
  Tag,
  Modal,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  UploadOutlined,
  SaveOutlined,
  DatabaseOutlined,
  CloudOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminSettings = () => {
  const [form] = Form.useForm();
  const [systemForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  const handleSave = async (values) => {
    try {
      setLoading(true);
      console.log('관리자 설정 저장:', values);
      message.success('설정이 저장되었습니다.');
    } catch (error) {
      message.error('설정 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSave = async (values) => {
    try {
      setLoading(true);
      console.log('시스템 설정 저장:', values);
      message.success('시스템 설정이 저장되었습니다.');
    } catch (error) {
      message.error('시스템 설정 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 파일이 성공적으로 업로드되었습니다.`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 파일 업로드에 실패했습니다.`);
      }
    },
  };

  // 시스템 설정 데이터
  const systemConfigs = [
    { key: 'max_users', name: '최대 사용자 수', value: '100', type: 'number', description: '시스템에 등록할 수 있는 최대 사용자 수' },
    { key: 'session_timeout', name: '세션 타임아웃', value: '30', type: 'number', description: '사용자 세션 만료 시간 (분)' },
    { key: 'backup_interval', name: '백업 주기', value: '24', type: 'number', description: '자동 백업 실행 주기 (시간)' },
    { key: 'log_retention', name: '로그 보관 기간', value: '90', type: 'number', description: '시스템 로그 보관 기간 (일)' },
    { key: 'alert_email', name: '알림 이메일', value: 'admin@smartfarm.com', type: 'email', description: '시스템 알림을 받을 이메일 주소' },
    { key: 'maintenance_mode', name: '유지보수 모드', value: 'false', type: 'boolean', description: '시스템 유지보수 모드 활성화' },
    { key: 'debug_mode', name: '디버그 모드', value: 'false', type: 'boolean', description: '개발자 디버그 모드 활성화' },
    { key: 'api_rate_limit', name: 'API 요청 제한', value: '1000', type: 'number', description: '시간당 API 요청 제한 수' }
  ];

  const configColumns = [
    {
      title: '설정명',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: '현재 값',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => {
        if (record.type === 'boolean') {
          return <Tag color={value === 'true' ? 'green' : 'red'}>{value === 'true' ? '활성' : '비활성'}</Tag>;
        }
        return <Text>{value}</Text>;
      }
    },
    {
      title: '유형',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeColors = {
          'number': 'blue',
          'email': 'green',
          'boolean': 'orange',
          'string': 'purple'
        };
        return <Tag color={typeColors[type]}>{type}</Tag>;
      }
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
      render: (description) => <Text type="secondary">{description}</Text>
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditConfig(record)}
          >
            수정
          </Button>
        </Space>
      )
    }
  ];

  const handleEditConfig = (config) => {
    setEditingConfig(config);
    setConfigModalVisible(true);
  };

  const handleConfigSave = () => {
    message.success('설정이 업데이트되었습니다.');
    setConfigModalVisible(false);
    setEditingConfig(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>⚙️ 시스템 설정</Title>
        <Text type="secondary">시스템 관리자 계정 및 전체 시스템 설정을 관리하세요</Text>
      </div>

      <Tabs defaultActiveKey="profile">
        <Tabs.TabPane tab="프로필 설정" key="profile">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              name: '시스템 관리자',
              email: 'admin@smartfarm.com',
              phone: '010-0000-0000',
              department: 'IT 운영팀',
              position: '시스템 관리자',
              notifications: true,
              emailAlerts: true,
              smsAlerts: false,
              emergencyAlerts: true,
              systemAlerts: true,
              securityAlerts: true,
              language: 'ko',
              timezone: 'Asia/Seoul',
              theme: 'light'
            }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title={<Space><UserOutlined />개인 정보</Space>}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Avatar size={80} icon={<UserOutlined />} />
                    <div style={{ marginTop: '16px' }}>
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>프로필 사진 변경</Button>
                      </Upload>
                    </div>
                  </div>

                  <Form.Item
                    label="이름"
                    name="name"
                    rules={[{ required: true, message: '이름을 입력해주세요' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="이메일"
                    name="email"
                    rules={[
                      { required: true, message: '이메일을 입력해주세요' },
                      { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="전화번호"
                    name="phone"
                    rules={[{ required: true, message: '전화번호를 입력해주세요' }]}
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>

                  <Form.Item label="부서" name="department">
                    <Input />
                  </Form.Item>

                  <Form.Item label="직책" name="position">
                    <Input />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={<Space><SettingOutlined />환경 설정</Space>}>
                  <Form.Item label="언어" name="language">
                    <Select>
                      <Option value="ko">한국어</Option>
                      <Option value="en">English</Option>
                      <Option value="ja">日本語</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="시간대" name="timezone">
                    <Select>
                      <Option value="Asia/Seoul">서울 (GMT+9)</Option>
                      <Option value="UTC">UTC (GMT+0)</Option>
                      <Option value="America/New_York">뉴욕 (GMT-5)</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="테마" name="theme">
                    <Select>
                      <Option value="light">라이트</Option>
                      <Option value="dark">다크</Option>
                      <Option value="auto">자동</Option>
                    </Select>
                  </Form.Item>

                  <Divider />

                  <Form.Item 
                    label="전체 알림" 
                    name="notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item 
                    label="이메일 알림" 
                    name="emailAlerts"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item 
                    label="SMS 알림" 
                    name="smsAlerts"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item 
                    label="긴급 알림" 
                    name="emergencyAlerts"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item 
                    label="시스템 알림" 
                    name="systemAlerts"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item 
                    label="보안 알림" 
                    name="securityAlerts"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Card>
              </Col>
            </Row>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Space>
                <Button onClick={() => form.resetFields()}>
                  초기화
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  설정 저장
                </Button>
              </Space>
            </div>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="시스템 설정" key="system">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Alert
                message="시스템 설정 변경 주의"
                description="시스템 설정을 변경하면 전체 서비스에 영향을 줄 수 있습니다. 신중하게 변경해주세요."
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            </Col>
            
            <Col span={24}>
              <Card title="🔧 시스템 구성 설정">
                <Table
                  columns={configColumns}
                  dataSource={systemConfigs}
                  rowKey="key"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="보안 설정" key="security">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title={<Space><SecurityScanOutlined />비밀번호 변경</Space>}>
                <Form layout="vertical">
                  <Form.Item 
                    label="현재 비밀번호" 
                    name="currentPassword"
                    rules={[{ required: true, message: '현재 비밀번호를 입력해주세요' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  
                  <Form.Item 
                    label="새 비밀번호" 
                    name="newPassword"
                    rules={[
                      { required: true, message: '새 비밀번호를 입력해주세요' },
                      { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' }
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  
                  <Form.Item 
                    label="새 비밀번호 확인" 
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: '비밀번호를 다시 입력해주세요' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('비밀번호가 일치하지 않습니다'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  
                  <Button type="primary" htmlType="submit">
                    비밀번호 변경
                  </Button>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title={<Space><BellOutlined />보안 옵션</Space>}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>2단계 인증</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Switch defaultChecked />
                      <Text style={{ marginLeft: '8px' }}>활성화</Text>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <Text strong>로그인 알림</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Switch defaultChecked />
                      <Text style={{ marginLeft: '8px' }}>새 기기 로그인 시 알림</Text>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <Text strong>세션 관리</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text>자동 로그아웃: </Text>
                      <Select defaultValue="30" style={{ width: 120, marginLeft: '8px' }}>
                        <Option value="15">15분</Option>
                        <Option value="30">30분</Option>
                        <Option value="60">1시간</Option>
                        <Option value="120">2시간</Option>
                      </Select>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <Text strong>IP 접근 제한</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Switch />
                      <Text style={{ marginLeft: '8px' }}>특정 IP에서만 접근 허용</Text>
                    </div>
                  </div>

                  <Divider />

                  <Button type="primary" style={{ width: '100%' }}>
                    보안 설정 저장
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="데이터베이스" key="database">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card title={<Space><DatabaseOutlined />데이터베이스 상태</Space>}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>연결 상태: </Text>
                    <Tag color="green">정상</Tag>
                  </div>
                  <div>
                    <Text>데이터베이스 크기: </Text>
                    <Text strong>2.4GB</Text>
                  </div>
                  <div>
                    <Text>테이블 수: </Text>
                    <Text strong>24개</Text>
                  </div>
                  <div>
                    <Text>마지막 백업: </Text>
                    <Text>6시간 전</Text>
                  </div>
                  <div>
                    <Text>다음 백업: </Text>
                    <Text>18시간 후</Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="🔄 백업 설정">
                <Form layout="vertical">
                  <Form.Item label="자동 백업">
                    <Switch defaultChecked />
                  </Form.Item>
                  
                  <Form.Item label="백업 주기">
                    <Select defaultValue="daily">
                      <Option value="hourly">매시간</Option>
                      <Option value="daily">매일</Option>
                      <Option value="weekly">매주</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="백업 보관 기간">
                    <InputNumber 
                      defaultValue={30} 
                      min={1} 
                      max={365} 
                      addonAfter="일"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  
                  <Button type="primary" style={{ width: '100%' }}>
                    백업 설정 저장
                  </Button>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="🧹 데이터 정리">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button style={{ width: '100%' }}>
                    임시 파일 정리
                  </Button>
                  <Button style={{ width: '100%' }}>
                    오래된 로그 삭제
                  </Button>
                  <Button style={{ width: '100%' }}>
                    캐시 데이터 정리
                  </Button>
                  <Popconfirm
                    title="정말로 데이터베이스를 최적화하시겠습니까?"
                    onConfirm={() => message.success('데이터베이스 최적화가 완료되었습니다.')}
                    okText="예"
                    cancelText="아니오"
                  >
                    <Button type="primary" style={{ width: '100%' }}>
                      데이터베이스 최적화
                    </Button>
                  </Popconfirm>
                </Space>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      {/* 설정 수정 모달 */}
      <Modal
        title="시스템 설정 수정"
        open={configModalVisible}
        onOk={handleConfigSave}
        onCancel={() => {
          setConfigModalVisible(false);
          setEditingConfig(null);
        }}
      >
        {editingConfig && (
          <Form layout="vertical">
            <Form.Item label="설정명">
              <Input value={editingConfig.name} disabled />
            </Form.Item>
            
            <Form.Item label="현재 값">
              {editingConfig.type === 'boolean' ? (
                <Switch 
                  checked={editingConfig.value === 'true'}
                  checkedChildren="활성"
                  unCheckedChildren="비활성"
                />
              ) : editingConfig.type === 'number' ? (
                <InputNumber 
                  defaultValue={parseInt(editingConfig.value)}
                  style={{ width: '100%' }}
                />
              ) : (
                <Input defaultValue={editingConfig.value} />
              )}
            </Form.Item>
            
            <Form.Item label="설명">
              <TextArea 
                value={editingConfig.description} 
                disabled 
                rows={2}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminSettings;
