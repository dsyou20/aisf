import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Space, Divider } from 'antd';
import { 
  HomeOutlined, 
  ExperimentOutlined, 
  RobotOutlined, 
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  BookOutlined,
  BarChartOutlined,
  DashboardOutlined,
  ControlOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState(null);

  const userTypes = [
    {
      key: 'owner',
      title: '농장주',
      icon: <UserOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      description: '농장의 전체적인 운영과 수익 관리를 담당합니다.',
      features: [
        '농장 전체 현황 대시보드',
        '수익성 분석 및 리포트',
        '전문가 상담 관리',
        '농장 운영 계획 수립'
      ],
      color: '#52c41a'
    },
    {
      key: 'manager',
      title: '재배관리자',
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      description: '일일 재배 관리와 작물 생육 관리를 담당합니다.',
      features: [
        '실시간 재배 현황 모니터링',
        'AI 재배 권장사항 확인',
        '환경 제어 시스템 관리',
        '작물 생육 데이터 분석'
      ],
      color: '#1890ff'
    },
    {
      key: 'admin',
      title: '관리자',
      icon: <SettingOutlined style={{ fontSize: '48px', color: '#722ed1' }} />,
      description: '시스템 전체 설정과 사용자 관리를 담당합니다.',
      features: [
        '사용자 계정 관리',
        '시스템 설정 및 구성',
        '데이터베이스 관리',
        '시스템 모니터링'
      ],
      color: '#722ed1'
    }
  ];

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
  };

  const handleEnter = () => {
    if (selectedUserType) {
      navigate(`/${selectedUserType}`);
    }
  };

  const handleBack = () => {
    setSelectedUserType(null);
  };

  if (selectedUserType) {
    const userType = userTypes.find(type => type.key === selectedUserType);
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Button 
            type="link" 
            onClick={handleBack}
            style={{ marginBottom: '16px' }}
          >
            ← 뒤로 가기
          </Button>
          <Title level={2}>{userType.title} 모드</Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            {userType.description}
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title="주요 기능" 
              style={{ borderColor: userType.color }}
              headStyle={{ borderColor: userType.color }}
            >
              <ul style={{ fontSize: '16px', lineHeight: '2' }}>
                {userType.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title="시스템 정보" 
              style={{ borderColor: userType.color }}
              headStyle={{ borderColor: userType.color }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <strong>현재 시간:</strong> {new Date().toLocaleString('ko-KR')}
                </div>
                <div>
                  <strong>시스템 상태:</strong> <span style={{ color: '#52c41a' }}>정상</span>
                </div>
                <div>
                  <strong>연결된 센서:</strong> 24개
                </div>
                <div>
                  <strong>활성 하우스:</strong> 3개
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleEnter}
            style={{ 
              backgroundColor: userType.color, 
              borderColor: userType.color,
              height: '48px',
              fontSize: '18px',
              padding: '0 32px'
            }}
          >
            {userType.title} 모드로 입장
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          스마트팜 AI 재배 관리 시스템
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
          AI 기술을 활용한 지능형 농작물 재배 관리 솔루션
        </Paragraph>
        
        <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '32px' }}>
          <Col>
            <Space>
              <ExperimentOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <span>실시간 모니터링</span>
            </Space>
          </Col>
          <Col>
            <Space>
              <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <span>AI 재배 권장</span>
            </Space>
          </Col>
          <Col>
            <Space>
              <BarChartOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
              <span>데이터 분석</span>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider />

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={3}>사용자 유형을 선택해주세요</Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          귀하의 역할에 맞는 모드를 선택하여 시스템을 이용하세요
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {userTypes.map((userType) => (
          <Col xs={24} lg={8} key={userType.key}>
            <Card
              hoverable
              style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                borderColor: userType.color,
                transition: 'all 0.3s'
              }}
              onClick={() => handleUserTypeSelect(userType.key)}
              bodyStyle={{ padding: '32px 24px' }}
            >
              <div style={{ marginBottom: '24px' }}>
                {userType.icon}
              </div>
              <Title level={3} style={{ color: userType.color, marginBottom: '16px' }}>
                {userType.title}
              </Title>
              <Paragraph style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                {userType.description}
              </Paragraph>
              <Button 
                type="primary" 
                style={{ 
                  backgroundColor: userType.color, 
                  borderColor: userType.color 
                }}
              >
                선택하기
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
        <Col xs={24} lg={8}>
          <Card size="small" title="실시간 모니터링">
            <ul>
              <li>온도, 습도, CO2 실시간 측정</li>
              <li>토양 수분 및 pH 모니터링</li>
              <li>작물 생육 상태 추적</li>
              <li>알림 및 경고 시스템</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card size="small" title="AI 재배 권장">
            <ul>
              <li>기상 데이터 기반 예측</li>
              <li>최적 재배 조건 제안</li>
              <li>병해 예방 권장사항</li>
              <li>수확 시기 최적화</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card size="small" title="자동화 제어">
            <ul>
              <li>환경 제어 시스템 자동화</li>
              <li>관수 및 비료 공급 제어</li>
              <li>온도 및 환기 자동 조절</li>
              <li>에너지 효율 최적화</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 