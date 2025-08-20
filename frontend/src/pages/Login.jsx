import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled(Card)`
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  
  .ant-card-head-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
`;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 임시 로그인 로직 (실제로는 API 호출)
      if (values.username === 'admin' && values.password === 'admin') {
        message.success('로그인 성공!');
        navigate('/dashboard');
      } else {
        message.error('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      message.error('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        title="스마트팜 AI재배관리 솔루션"
        headStyle={{ borderBottom: 'none', paddingBottom: 0 }}
      >
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '아이디를 입력해주세요!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="아이디"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', height: '48px' }}
            >
              로그인
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', color: '#666' }}>
            <p>테스트 계정: admin / admin</p>
          </div>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 