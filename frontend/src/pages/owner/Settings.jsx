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
  Upload
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  UploadOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const OwnerSettings = () => {
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
        <Text type="secondary">농장주 계정 및 시스템 설정을 관리하세요</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          name: '김농장주',
          email: 'owner@smartfarm.com',
          phone: '010-1234-5678',
          notifications: true,
          emailAlerts: true,
          smsAlerts: false,
          language: 'ko',
          timezone: 'Asia/Seoul'
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

              <Form.Item label="농장 주소" name="address">
                <Input.TextArea rows={3} placeholder="농장 주소를 입력해주세요" />
              </Form.Item>
            </Card>
          </Col>

          {/* 시스템 설정 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><SettingOutlined />시스템 설정</Space>}>
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

              <Form.Item label="대시보드 새로고침 간격" name="refreshInterval">
                <Select defaultValue="30">
                  <Option value="10">10초</Option>
                  <Option value="30">30초</Option>
                  <Option value="60">1분</Option>
                  <Option value="300">5분</Option>
                </Select>
              </Form.Item>

              <Form.Item label="데이터 보관 기간" name="dataRetention">
                <Select defaultValue="365">
                  <Option value="90">3개월</Option>
                  <Option value="180">6개월</Option>
                  <Option value="365">1년</Option>
                  <Option value="730">2년</Option>
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
                initialValue={true}
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label="수확 알림" 
                name="harvestAlerts"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label="매출 리포트" 
                name="revenueReports"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          {/* 보안 설정 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><SecurityScanOutlined />보안 설정</Space>}>
              <Form.Item label="현재 비밀번호" name="currentPassword">
                <Input.Password placeholder="현재 비밀번호를 입력하세요" />
              </Form.Item>

              <Form.Item label="새 비밀번호" name="newPassword">
                <Input.Password placeholder="새 비밀번호를 입력하세요" />
              </Form.Item>

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

              <Form.Item 
                label="2단계 인증" 
                name="twoFactorAuth"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label="자동 로그아웃" 
                name="autoLogout"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
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

export default OwnerSettings;
