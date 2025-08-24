import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DashboardOutlined,
  ExperimentOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/cultivation/greenhouse-overview',
      icon: <DashboardOutlined />,
      label: '대시보드',
    },
    {
      key: 'cultivation',
      icon: <ExperimentOutlined />,
      label: '재배 관리',
      children: [
        { key: '/cultivation/overview', label: '재배 개요' },
        { key: '/cultivation/status', label: '재배 현황' },
        { key: '/cultivation/recommendation', label: 'AI 권장사항' },
        { key: '/cultivation/execution', label: '재배 실행' },
        { key: '/cultivation/yield-prediction', label: '수확량 예측' },
      ],
    },
    {
      key: 'experts',
      icon: <TeamOutlined />,
      label: '재배전문가',
      children: [
        { key: '/experts/owners', label: '농장주 관리' },
        { key: '/experts/specialists', label: '전문가 관리' },
      ],
    },
    {
      key: 'knowledge',
      icon: <BookOutlined />,
      label: '재배 지식',
      children: [
        { key: '/knowledge/basic', label: '기본 지식' },
        { key: '/knowledge/experience', label: '경험 지식' },
        { key: '/knowledge/environment', label: '환경 지식' },
        { key: '/knowledge/growth', label: '생장 지식' },
        { key: '/knowledge/disease', label: '병해 지식' },
        { key: '/knowledge/recommendation', label: '권장 지식' },
        { key: '/knowledge/control', label: '제어 지식' },
      ],
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '데이터 분석',
      children: [
        { key: '/analytics/dashboard', label: '분석 대시보드' },
        { key: '/analytics/explorer', label: '데이터 탐색기' },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '프로필',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '로그아웃',
      onClick: () => {
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <StyledLayout>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <Logo 
          style={{ 
            padding: '16px', 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {collapsed ? 'SF' : '스마트팜'}
        </Logo>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <StyledHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Button
              type="text"
              icon={<DashboardOutlined />}
              onClick={() => navigate('/')}
              style={{ fontSize: '16px', marginLeft: '8px' }}
              title="홈으로 돌아가기"
            >
              홈
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar icon={<UserOutlined />} />
                <span>관리자</span>
              </div>
            </Dropdown>
          </div>
        </StyledHeader>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default DashboardLayout; 