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
  TimePicker,
  Slider
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  UploadOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const ManagerSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values) => {
    try {
      setLoading(true);
      // 설정 저장 로직
      console.log('설정 저장:', values);
      message.success('설정이 저장되었습니다.');
    } catch (error) {
      message.error('설정 저장에 실패했습니다.');
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

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>⚙️ 설정</Title>
        <Text type="secondary">재배관리자 계정 및 작업 환경 설정을 관리하세요</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          name: '김재배',
          email: 'kim@smartfarm.com',
          phone: '010-1234-5678',
          specialty: '토마토',
          experience: '8년',
          workStartTime: dayjs('06:00', 'HH:mm'),
          workEndTime: dayjs('18:00', 'HH:mm'),
          notifications: true,
          emailAlerts: true,
          smsAlerts: false,
          emergencyAlerts: true,
          taskReminders: true,
          environmentAlerts: true,
          harvestAlerts: true,
          language: 'ko',
          timezone: 'Asia/Seoul',
          tempUnit: 'celsius',
          autoRefresh: 30,
          alertThreshold: {
            temperature: [18, 28],
            humidity: [50, 80],
            soilMoisture: [40, 70]
          }
        }}
      >
        <Row gutter={[24, 24]}>
          {/* 프로필 설정 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><UserOutlined />프로필 설정</Space>}>
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
                <Input />
              </Form.Item>

              <Form.Item
                label="전화번호"
                name="phone"
                rules={[{ required: true, message: '전화번호를 입력해주세요' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="전문 분야" name="specialty">
                <Select>
                  <Option value="토마토">토마토</Option>
                  <Option value="오이">오이</Option>
                  <Option value="딸기">딸기</Option>
                  <Option value="파프리카">파프리카</Option>
                  <Option value="상추">상추</Option>
                </Select>
              </Form.Item>

              <Form.Item label="경력" name="experience">
                <Input placeholder="예: 8년" />
              </Form.Item>
            </Card>
          </Col>

          {/* 작업 환경 설정 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><ClockCircleOutlined />작업 환경 설정</Space>}>
              <Form.Item label="근무 시작 시간" name="workStartTime">
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="근무 종료 시간" name="workEndTime">
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="언어" name="language">
                <Select>
                  <Option value="ko">한국어</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>

              <Form.Item label="시간대" name="timezone">
                <Select>
                  <Option value="Asia/Seoul">서울 (GMT+9)</Option>
                  <Option value="UTC">UTC (GMT+0)</Option>
                </Select>
              </Form.Item>

              <Form.Item label="온도 단위" name="tempUnit">
                <Select>
                  <Option value="celsius">섭씨 (°C)</Option>
                  <Option value="fahrenheit">화씨 (°F)</Option>
                </Select>
              </Form.Item>

              <Form.Item label="자동 새로고침 간격 (초)" name="autoRefresh">
                <Select>
                  <Option value={10}>10초</Option>
                  <Option value={30}>30초</Option>
                  <Option value={60}>1분</Option>
                  <Option value={300}>5분</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* 알림 설정 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><BellOutlined />알림 설정</Space>}>
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
                label="긴급 상황 알림" 
                name="emergencyAlerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label="작업 리마인더" 
                name="taskReminders"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label="환경 이상 알림" 
                name="environmentAlerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label="수확 알림" 
                name="harvestAlerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          {/* 환경 임계값 설정 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><DashboardOutlined />환경 임계값 설정</Space>}>
              <div style={{ marginBottom: '24px' }}>
                <Text strong>온도 알림 범위 (°C)</Text>
                <Form.Item name={['alertThreshold', 'temperature']} style={{ marginTop: '8px' }}>
                  <Slider 
                    range 
                    min={0} 
                    max={40} 
                    marks={{
                      0: '0°C',
                      20: '20°C',
                      40: '40°C'
                    }}
                  />
                </Form.Item>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Text strong>습도 알림 범위 (%)</Text>
                <Form.Item name={['alertThreshold', 'humidity']} style={{ marginTop: '8px' }}>
                  <Slider 
                    range 
                    min={0} 
                    max={100} 
                    marks={{
                      0: '0%',
                      50: '50%',
                      100: '100%'
                    }}
                  />
                </Form.Item>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Text strong>토양 수분 알림 범위 (%)</Text>
                <Form.Item name={['alertThreshold', 'soilMoisture']} style={{ marginTop: '8px' }}>
                  <Slider 
                    range 
                    min={0} 
                    max={100} 
                    marks={{
                      0: '0%',
                      50: '50%',
                      100: '100%'
                    }}
                  />
                </Form.Item>
              </div>
            </Card>
          </Col>

          {/* 보안 설정 */}
          <Col xs={24}>
            <Card title={<Space><SecurityScanOutlined />보안 설정</Space>}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Form.Item label="현재 비밀번호" name="currentPassword">
                    <Input.Password placeholder="현재 비밀번호를 입력하세요" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="새 비밀번호" name="newPassword">
                    <Input.Password placeholder="새 비밀번호를 입력하세요" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item 
                    label="새 비밀번호 확인" 
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
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
                    <Input.Password placeholder="새 비밀번호를 다시 입력하세요" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    label="2단계 인증" 
                    name="twoFactorAuth"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item 
                    label="자동 로그아웃 (비활성 시)" 
                    name="autoLogout"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: 'center' }}>
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
    </div>
  );
};

export default ManagerSettings;
