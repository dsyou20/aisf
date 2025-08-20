import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Button, 
  Space, 
  Typography,
  Menu,
  Dropdown,
  Badge,
  Tag,
  List,
  Timeline
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  BookOutlined,
  BarChartOutlined,
  ControlOutlined,
  BellOutlined,
  LogoutOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('overview');

  // 사용자 타입별 설정
  const userConfigs = {
    owner: {
      title: '농장주 대시보드',
      icon: <UserOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a',
      menus: [
        { key: 'overview', label: '재배 현황', icon: <DashboardOutlined /> },
        { key: 'tomato-cultivation', label: '토마토 재배력', icon: <ExperimentOutlined /> },
        { key: 'recommendation', label: '추천 관리', icon: <BookOutlined /> },
        { key: 'control', label: '제어 관리', icon: <ControlOutlined /> },
        { key: 'farmland', label: '농지 관리', icon: <ExperimentOutlined /> }
      ]
    },
    manager: {
      title: '재배관리자 대시보드',
      icon: <TeamOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
      menus: [
        { key: 'overview', label: '재배 현황', icon: <DashboardOutlined /> },
        { key: 'recommendation', label: '추천 관리', icon: <BookOutlined /> },
        { key: 'control', label: '제어 관리', icon: <ControlOutlined /> },
        { key: 'farmland', label: '농지 관리', icon: <ExperimentOutlined /> },
        { key: 'knowledge', label: '지식 관리', icon: <BookOutlined /> }
      ]
    },
    admin: {
      title: '관리자 대시보드',
      icon: <SettingOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1',
      menus: [
        { key: 'overview', label: '전체 현황', icon: <DashboardOutlined /> },
        { key: 'users', label: '사용자 관리', icon: <UserOutlined /> },
        { key: 'knowledge', label: '지식 관리', icon: <BookOutlined /> },
        { key: 'record-knowledge', label: '기록 지식', icon: <BookOutlined /> },
        { key: 'experience-knowledge', label: '경험 지식', icon: <ExperimentOutlined /> },
        { key: 'cultivation-recommendation', label: '재배 추천', icon: <BarChartOutlined /> },
        { key: 'control-recommendation', label: '제어 추천', icon: <ControlOutlined /> },
        { key: 'system', label: '시스템 설정', icon: <SettingOutlined /> }
      ]
    }
  };

  const config = userConfigs[userType] || userConfigs.owner;



  const handleMenuClick = (key) => {
    setSelectedMenu(key);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        프로필 설정
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        설정
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        로그아웃
      </Menu.Item>
    </Menu>
  );

  const renderRecommendation = () => {
    if (userType === 'owner') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>AI 재배 추천 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="토마토 재배 추천" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>온도 조절:</Text> 현재 24°C → 목표 22-25°C (적정)
                  </div>
                  <div>
                    <Text strong>습도 조절:</Text> 현재 70% → 목표 65-75% (적정)
                  </div>
                  <div>
                    <Text strong>관수:</Text> 내일 오전 9시 예정
                  </div>
                  <div>
                    <Text strong>비료:</Text> 3일 후 질소 비료 시비 권장
                  </div>
                  <Tag color="success">추천 정확도: 95%</Tag>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="딸기 재배 추천" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>온도 조절:</Text> 현재 22°C → 목표 18-25°C (적정)
                  </div>
                  <div>
                    <Text strong>습도 조절:</Text> 현재 65% → 목표 60-70% (적정)
                  </div>
                  <div>
                    <Text strong>관수:</Text> 오후 2시 예정
                  </div>
                  <div>
                    <Text strong>비료:</Text> 5일 후 인산 비료 시비 권장
                  </div>
                  <Tag color="success">추천 정확도: 92%</Tag>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else if (userType === 'manager') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>AI 재배 추천 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="토마토 (하우스 A) 추천" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>환기:</Text> 현재 CO2 450ppm → 환기 권장
                  </div>
                  <div>
                    <Text strong>관수:</Text> 토양 수분 75% → 적정 범위
                  </div>
                  <div>
                    <Text strong>병해 예방:</Text> 잿빛곰팡이병 예방 스프레이 권장
                  </div>
                  <div>
                    <Text strong>수확:</Text> 2주 후 첫 수확 예정
                  </div>
                  <Tag color="success">추천 정확도: 95%</Tag>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="딸기 (하우스 B) 추천" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>온도:</Text> 야간 온도 18°C로 조절 권장
                  </div>
                  <div>
                    <Text strong>습도:</Text> 현재 65% → 적정 범위
                  </div>
                  <div>
                    <Text strong>비료:</Text> 칼륨 비료 추가 시비 권장
                  </div>
                  <div>
                    <Text strong>수확:</Text> 3주 후 첫 수확 예정
                  </div>
                  <Tag color="success">추천 정확도: 92%</Tag>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderControl = () => {
    if (userType === 'owner' || userType === 'manager') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>환경 제어 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="하우스 A 제어 상태" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>온도 제어:</Text> <Tag color="success">자동</Tag> (22-25°C)
                  </div>
                  <div>
                    <Text strong>습도 제어:</Text> <Tag color="success">자동</Tag> (65-75%)
                  </div>
                  <div>
                    <Text strong>환기 시스템:</Text> <Tag color="success">자동</Tag> (CO2 기준)
                  </div>
                  <div>
                    <Text strong>관수 시스템:</Text> <Tag color="success">자동</Tag> (토양 수분 기준)
                  </div>
                  <Button type="primary" style={{ marginTop: '8px' }}>수동 제어</Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="하우스 B 제어 상태" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>온도 제어:</Text> <Tag color="success">자동</Tag> (18-25°C)
                  </div>
                  <div>
                    <Text strong>습도 제어:</Text> <Tag color="success">자동</Tag> (60-70%)
                  </div>
                  <div>
                    <Text strong>환기 시스템:</Text> <Tag color="success">자동</Tag> (CO2 기준)
                  </div>
                  <div>
                    <Text strong>관수 시스템:</Text> <Tag color="success">자동</Tag> (토양 수분 기준)
                  </div>
                  <Button type="primary" style={{ marginTop: '8px' }}>수동 제어</Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderFarmland = () => {
    if (userType === 'owner') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>내 농장 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="농장 A (본사)" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>위치:</Text> 경기도 성남시 분당구</div>
                  <div><Text strong>면적:</Text> 1,500㎡</div>
                  <div><Text strong>하우스 수:</Text> 3개</div>
                  <div><Text strong>재배 작물:</Text> 토마토, 딸기</div>
                  <div><Text strong>상태:</Text> <Tag color="success">정상 운영</Tag></div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="농장 B (분점)" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>위치:</Text> 경기도 용인시 기흥구</div>
                  <div><Text strong>면적:</Text> 1,200㎡</div>
                  <div><Text strong>하우스 수:</Text> 2개</div>
                  <div><Text strong>재배 작물:</Text> 딸기</div>
                  <div><Text strong>상태:</Text> <Tag color="success">정상 운영</Tag></div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else if (userType === 'manager') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>관리 농장 현황</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="하우스 A (토마토)" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>면적:</Text> 500㎡</div>
                  <div><Text strong>재배 작물:</Text> 토마토</div>
                  <div><Text strong>생장 단계:</Text> 결실기</div>
                  <div><Text strong>건강도:</Text> 95%</div>
                  <div><Text strong>상태:</Text> <Tag color="success">정상</Tag></div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="하우스 B (딸기)" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>면적:</Text> 500㎡</div>
                  <div><Text strong>재배 작물:</Text> 딸기</div>
                  <div><Text strong>생장 단계:</Text> 생장기</div>
                  <div><Text strong>건강도:</Text> 88%</div>
                  <div><Text strong>상태:</Text> <Tag color="success">정상</Tag></div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderKnowledge = () => {
    if (userType === 'manager') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>재배 지식 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="토마토 재배 지식" size="small">
                <List
                  size="small"
                  dataSource={[
                    '토마토 기본 재배법',
                    '병해 예방 및 치료',
                    '수확 시기 판단법',
                    '품질 향상 기법'
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="딸기 재배 지식" size="small">
                <List
                  size="small"
                  dataSource={[
                    '딸기 기본 재배법',
                    '병해 예방 및 치료',
                    '수확 시기 판단법',
                    '품질 향상 기법'
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else if (userType === 'admin') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>지식 관리 개요</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card title="기록 지식" size="small">
                <Statistic title="총 문서" value={15} />
                <Statistic title="조회수" value={1250} />
                <Text type="secondary">왼쪽 메뉴에서 '기록 지식'을 선택하여 상세 관리</Text>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="경험 지식" size="small">
                <Statistic title="총 경험담" value={8} />
                <Statistic title="검증 완료" value={5} />
                <Text type="secondary">왼쪽 메뉴에서 '경험 지식'을 선택하여 상세 관리</Text>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="추천 모델" size="small">
                <Statistic title="활성 모델" value={3} />
                <Statistic title="평균 정확도" value={92} suffix="%" />
                <Text type="secondary">왼쪽 메뉴에서 '재배 추천' 또는 '제어 추천'을 선택하여 상세 관리</Text>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderUsers = () => {
    if (userType === 'admin') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>사용자 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card title="농장주" size="small">
                <Statistic title="총 사용자" value={2} />
                <Statistic title="활성 사용자" value={2} />
                <Text type="secondary">시스템에서 관리 중</Text>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="재배관리자" size="small">
                <Statistic title="총 사용자" value={2} />
                <Statistic title="활성 사용자" value={1} />
                <Text type="secondary">시스템에서 관리 중</Text>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="관리자" size="small">
                <Statistic title="총 사용자" value={1} />
                <Statistic title="활성 사용자" value={1} />
                <Text type="secondary">시스템에서 관리 중</Text>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderRecordKnowledge = () => {
    if (userType === 'admin') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>기록 지식 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="토마토 재배 지식" size="small">
                <List
                  size="small"
                  dataSource={[
                    '토마토 기본 재배법 (조회수: 1,250)',
                    '토마토 병해 예방 매뉴얼 (조회수: 980)',
                    '토마토 수확 시기 판단법 (조회수: 756)',
                    '토마토 품질 향상 기법 (조회수: 634)'
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="딸기 재배 지식" size="small">
                <List
                  size="small"
                  dataSource={[
                    '딸기 기본 재배법 (조회수: 890)',
                    '딸기 병해 예방 매뉴얼 (조회수: 720)',
                    '딸기 수확 시기 판단법 (조회수: 645)',
                    '딸기 품질 향상 기법 (조회수: 523)'
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderExperienceKnowledge = () => {
    if (userType === 'admin') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>경험 지식 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="검증된 경험 지식" size="small">
                <List
                  size="small"
                  dataSource={[
                    '토마토 수확량 30% 증대 비결 (김영희, 15년 경력)',
                    '딸기 품질 향상 관리법 (이철수, 12년 경력)',
                    '에너지 효율 최적화 경험담 (박민수, 8년 경력)'
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                      <Tag color="success">검증됨</Tag>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="검토 대기 중" size="small">
                <List
                  size="small"
                  dataSource={[
                    '토마토 병해 치료 신기법 (최재배, 10년 경력)',
                    '딸기 수확 시기 예측법 (정관리, 7년 경력)'
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                      <Tag color="warning">검토 대기</Tag>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderCultivationRecommendation = () => {
    if (userType === 'admin') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>재배 추천 모델 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="토마토 재배 추천 모델" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>모델 정확도:</Text> 95%</div>
                  <div><Text strong>사용 횟수:</Text> 156회</div>
                  <div><Text strong>마지막 업데이트:</Text> 2024-01-15</div>
                  <div><Text strong>상태:</Text> <Tag color="success">활성</Tag></div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="딸기 재배 추천 모델" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>모델 정확도:</Text> 92%</div>
                  <div><Text strong>사용 횟수:</Text> 89회</div>
                  <div><Text strong>마지막 업데이트:</Text> 2024-01-10</div>
                  <div><Text strong>상태:</Text> <Tag color="success">활성</Tag></div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderControlRecommendation = () => {
    if (userType === 'admin') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>제어 추천 모델 관리</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="환경 제어 추천 모델" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>온도 제어 정확도:</Text> 98%</div>
                  <div><Text strong>습도 제어 정확도:</Text> 95%</div>
                  <div><Text strong>사용 횟수:</Text> 234회</div>
                  <div><Text strong>상태:</Text> <Tag color="success">활성</Tag></div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="비료 공급 추천 모델" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>모델 정확도:</Text> 88%</div>
                  <div><Text strong>사용 횟수:</Text> 67회</div>
                  <div><Text strong>마지막 업데이트:</Text> 2024-01-14</div>
                  <div><Text strong>상태:</Text> <Tag color="warning">테스트 중</Tag></div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderTomatoCultivation = () => {
    if (userType === 'owner') {
      return (
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>토마토 재배력 현황</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="하우스 A 토마토 재배 현황" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>재배 면적:</Text> 500㎡</div>
                  <div><Text strong>재배 품종:</Text> 대과 토마토</div>
                  <div><Text strong>재배 시작일:</Text> 2024-01-01</div>
                  <div><Text strong>예상 수확일:</Text> 2024-03-15</div>
                  <div><Text strong>현재 생장 단계:</Text> <Tag color="processing">결실기</Tag></div>
                  <div><Text strong>건강도:</Text> <Progress percent={95} size="small" /></div>
                  <div><Text strong>수확량 예상:</Text> 2,500kg</div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="환경 모니터링" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><Text strong>현재 온도:</Text> 24°C <Tag color="success">적정</Tag></div>
                  <div><Text strong>현재 습도:</Text> 70% <Tag color="success">적정</Tag></div>
                  <div><Text strong>CO2 농도:</Text> 450ppm <Tag color="success">적정</Tag></div>
                  <div><Text strong>토양 수분:</Text> 65% <Tag color="success">적정</Tag></div>
                  <div><Text strong>조명 강도:</Text> 45,000 lux <Tag color="success">적정</Tag></div>
                  <div><Text strong>마지막 업데이트:</Text> 2024-01-15 14:30</div>
                </Space>
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="재배 일정 및 관리 기록" size="small">
                <Timeline>
                  <Timeline.Item color="green">
                    <Text strong>2024-01-15</Text> - 질소 비료 시비 완료
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <Text strong>2024-01-14</Text> - 병해 예방 스프레이 처리
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>2024-01-12</Text> - 관수 시스템 점검 및 조정
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <Text strong>2024-01-10</Text> - 온도 제어 시스템 최적화
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>2024-01-08</Text> - 인산 비료 시비 완료
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => {
    if (userType === 'owner') {
      return (
        <Row gutter={[24, 24]}>
          {/* 목표 표시 */}
          <Col xs={24}>
            <Card title="🎯 재배 목표" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 수확량"
                      value={1500}
                      suffix="kg"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 수익"
                      value={5000000}
                      prefix="₩"
                      suffix="원"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 품질"
                      value={95}
                      suffix="%"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 효율성"
                      value={90}
                      suffix="%"
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 현재 현황 */}
          <Col xs={24}>
            <Card title="📊 현재 재배 현황">
              <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 수확량"
                      value={1200}
                      suffix="kg"
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <Progress percent={80} size="small" />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 수익"
                      value={4000000}
                      prefix="₩"
                      suffix="원"
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <Progress percent={80} size="small" />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 품질"
                      value={92}
                      suffix="%"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                    <Progress percent={92} size="small" />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 효율성"
                      value={85}
                      suffix="%"
                      valueStyle={{ color: '#722ed1' }}
                    />
                    <Progress percent={85} size="small" />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 작물별 현황 */}
          <Col xs={24}>
            <Card title="🌱 작물별 재배 현황">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card size="small" title="토마토 (하우스 A)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>목표: 800kg</div>
                        <div>현재: 650kg</div>
                        <Progress percent={81} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>생장 단계: 결실기</div>
                        <div>예상 수확: 2주 후</div>
                        <Tag color="success">정상</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card size="small" title="딸기 (하우스 B)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>목표: 700kg</div>
                        <div>현재: 550kg</div>
                        <Progress percent={79} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>생장 단계: 생장기</div>
                        <div>예상 수확: 3주 후</div>
                        <Tag color="success">정상</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      );
    } else if (userType === 'manager') {
      return (
        <Row gutter={[24, 24]}>
          {/* 목표 표시 */}
          <Col xs={24}>
            <Card title="🎯 관리 목표" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 생산량"
                      value={1500}
                      suffix="kg"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 품질"
                      value={95}
                      suffix="%"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 효율성"
                      value={90}
                      suffix="%"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 안정성"
                      value={98}
                      suffix="%"
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 현재 현황 */}
          <Col xs={24}>
            <Card title="📊 현재 재배 현황">
              <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 생산량"
                      value={1200}
                      suffix="kg"
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <Progress percent={80} size="small" />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 품질"
                      value={92}
                      suffix="%"
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <Progress percent={92} size="small" />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 효율성"
                      value={85}
                      suffix="%"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                    <Progress percent={85} size="small" />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="현재 안정성"
                      value={96}
                      suffix="%"
                      valueStyle={{ color: '#722ed1' }}
                    />
                    <Progress percent={96} size="small" />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 환경 모니터링 */}
          <Col xs={24}>
            <Card title="🌡️ 실시간 환경 모니터링">
              <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="평균 온도"
                      value={23.5}
                      suffix="°C"
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="success">적정 범위</Tag>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="평균 습도"
                      value={68}
                      suffix="%"
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="success">적정 범위</Tag>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="평균 CO2"
                      value={450}
                      suffix="ppm"
                      valueStyle={{ color: '#722ed1' }}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="success">적정 범위</Tag>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="토양 수분"
                      value={75}
                      suffix="%"
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="success">적정 범위</Tag>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 작물별 상세 현황 */}
          <Col xs={24}>
            <Card title="🌱 작물별 관리 현황">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card size="small" title="토마토 (하우스 A)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>생장 단계: 결실기</div>
                        <div>건강도: 95%</div>
                        <Progress percent={95} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>온도: 24°C</div>
                        <div>습도: 70%</div>
                        <Tag color="success">정상</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card size="small" title="딸기 (하우스 B)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>생장 단계: 생장기</div>
                        <div>건강도: 88%</div>
                        <Progress percent={88} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>온도: 22°C</div>
                        <div>습도: 65%</div>
                        <Tag color="success">정상</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      );
    } else if (userType === 'admin') {
      return (
        <Row gutter={[24, 24]}>
          {/* 목표 대비 달성 현황 */}
          <Col xs={24}>
            <Card title="🎯 목표 대비 달성 현황" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="전체 농장 목표"
                      value={10}
                      suffix="개"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="활성 농장"
                      value={8}
                      suffix="개"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="목표 달성률"
                      value={80}
                      suffix="%"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="평균 효율성"
                      value={85}
                      suffix="%"
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 농장주 활동 현황 */}
          <Col xs={24}>
            <Card title="👨‍🌾 농장주 재배관리 활동 현황">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card size="small" title="김농장주 (농장 A)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>목표 수확량: 1500kg</div>
                        <div>현재 수확량: 1200kg</div>
                        <Progress percent={80} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>활동 점수: 85점</div>
                        <div>최근 로그인: 오늘</div>
                        <Tag color="success">활성</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card size="small" title="이농장주 (농장 B)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>목표 수확량: 1200kg</div>
                        <div>현재 수확량: 950kg</div>
                        <Progress percent={79} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>활동 점수: 78점</div>
                        <div>최근 로그인: 어제</div>
                        <Tag color="success">활성</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 재배관리자 활동 현황 */}
          <Col xs={24}>
            <Card title="👨‍💼 재배관리자 활동 현황">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card size="small" title="박재배관리자 (농장 A)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>관리 작물: 토마토, 딸기</div>
                        <div>작물 건강도: 92%</div>
                        <Progress percent={92} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>활동 점수: 88점</div>
                        <div>최근 활동: 2시간 전</div>
                        <Tag color="success">활성</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card size="small" title="최재배관리자 (농장 B)">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <div>관리 작물: 딸기</div>
                        <div>작물 건강도: 85%</div>
                        <Progress percent={85} status="active" />
                      </Col>
                      <Col span={12}>
                        <div>활동 점수: 82점</div>
                        <div>최근 활동: 5시간 전</div>
                        <Tag color="success">활성</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 시스템 통계 */}
          <Col xs={24}>
            <Card title="📊 시스템 통계">
              <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="총 사용자"
                      value={12}
                      valueStyle={{ color: '#52c41a' }}
                      suffix="명"
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="시스템 가동률"
                      value={99.8}
                      precision={1}
                      valueStyle={{ color: '#1890ff' }}
                      suffix="%"
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="활성 센서"
                      value={24}
                      valueStyle={{ color: '#722ed1' }}
                      suffix="개"
                    />
                  </Card>
                </Col>
                <Col xs={12} lg={6}>
                  <Card size="small">
                    <Statistic
                      title="데이터베이스 크기"
                      value={2.4}
                      precision={1}
                      valueStyle={{ color: '#fa8c16' }}
                      suffix="GB"
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      );
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ 
        background: 'white', 
        padding: '16px 24px', 
        marginBottom: '24px', 
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            type="text" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
            style={{ marginRight: '16px' }}
          />
          <span style={{ marginRight: '16px' }}>{config.icon}</span>
          <Title level={4} style={{ margin: 0, color: config.color }}>
            {config.title}
          </Title>
        </div>
        
        <Space>
          <Badge count={5}>
            <Button type="text" icon={<BellOutlined />} />
          </Badge>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />}>
              {userType === 'owner' ? '농장주' : userType === 'manager' ? '재배관리자' : '관리자'}
            </Button>
          </Dropdown>
        </Space>
      </div>

      <Row gutter={24}>
        {/* 사이드바 메뉴 */}
        <Col xs={24} lg={6}>
          <Card style={{ marginBottom: '24px' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedMenu]}
              onClick={({ key }) => handleMenuClick(key)}
              style={{ border: 'none' }}
            >
              {config.menus.map(menu => (
                <Menu.Item key={menu.key} icon={menu.icon}>
                  {menu.label}
                </Menu.Item>
              ))}
            </Menu>
          </Card>
        </Col>

        {/* 메인 콘텐츠 */}
        <Col xs={24} lg={18}>
          {selectedMenu === 'overview' && renderOverview()}
          {selectedMenu === 'tomato-cultivation' && renderTomatoCultivation()}
          {selectedMenu === 'recommendation' && renderRecommendation()}
          {selectedMenu === 'control' && renderControl()}
          {selectedMenu === 'farmland' && renderFarmland()}
          {selectedMenu === 'knowledge' && renderKnowledge()}
          {selectedMenu === 'users' && renderUsers()}
          {selectedMenu === 'record-knowledge' && renderRecordKnowledge()}
          {selectedMenu === 'experience-knowledge' && renderExperienceKnowledge()}
          {selectedMenu === 'cultivation-recommendation' && renderCultivationRecommendation()}
          {selectedMenu === 'control-recommendation' && renderControlRecommendation()}
          {selectedMenu !== 'overview' && !['tomato-cultivation', 'recommendation', 'control', 'farmland', 'knowledge', 'users', 'record-knowledge', 'experience-knowledge', 'cultivation-recommendation', 'control-recommendation'].includes(selectedMenu) && (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Title level={3}>개발 중인 기능입니다</Title>
                <Text type="secondary">
                  {config.menus.find(m => m.key === selectedMenu)?.label} 기능은 현재 개발 중입니다.
                </Text>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 