import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Space, Dropdown, Avatar } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에서 선택된 메뉴 키 추출
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/users')) return 'users';
    if (path.includes('/system')) return 'system';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard'; // 기본값
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '대시보드',
      onClick: () => navigate('/admin/dashboard')
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '사용자 관리',
      onClick: () => navigate('/admin/users')
    },
    {
      key: 'system',
      icon: <DatabaseOutlined />,
      label: '시스템 관리',
      onClick: () => navigate('/admin/system')
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '전체 분석',
      onClick: () => navigate('/admin/analytics')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '설정',
      onClick: () => navigate('/admin/settings')
    }
  ];

  const handleMenuClick = ({ key }) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem && menuItem.onClick) {
      menuItem.onClick();
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        프로필 설정
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        계정 설정
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />} 
        onClick={() => navigate('/')}
      >
        로그아웃
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledLayout>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        width={250}
        style={{
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '8px'
        }}>
          {!collapsed && (
            <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
              ⚙️ 시스템 관리자
            </Title>
          )}
          {collapsed && (
            <div style={{ fontSize: '24px' }}>⚙️</div>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <StyledHeader>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            
            <LogoSection onClick={handleLogoClick}>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                스마트팜 AI 시스템
              </Title>
            </LogoSection>
          </Space>

          <Space>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>관리자</span>
              </Space>
            </Dropdown>
          </Space>
        </StyledHeader>
        
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout;
