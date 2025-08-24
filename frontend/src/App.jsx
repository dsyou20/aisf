import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

// 역할별 레이아웃
import OwnerLayout from './components/layout/OwnerLayout';
import ManagerLayout from './components/layout/ManagerLayout';
import AdminLayout from './components/layout/AdminLayout';

// 농장주 페이지들
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerGreenhouses from './pages/owner/Greenhouses';
import OwnerYieldPrediction from './pages/owner/YieldPrediction';
import OwnerAnalytics from './pages/owner/Analytics';
import OwnerSettings from './pages/owner/Settings';

// 재배관리자 페이지들
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerGreenhouses from './pages/manager/Greenhouses';
import ManagerTasks from './pages/manager/Tasks';
import ManagerPerformance from './pages/manager/Performance';
import ManagerSettings from './pages/manager/Settings';

// 관리자 페이지들
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminSystem from './pages/admin/System';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';

// 데이터 분석 페이지들 (기존 유지)
import AnalyticsDashboard from './pages/analytics/Dashboard';
import DataExplorer from './pages/analytics/Explorer';
import TestPage from './pages/analytics/Test';
import SimpleTest from './pages/analytics/SimpleTest';

import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 홈페이지 */}
        <Route path="/" element={<Home />} />
        
        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
        
        {/* 농장주 전용 페이지 */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerGreenhouses />} /> {/* 기본: 온실 관리 */}
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="greenhouses" element={<OwnerGreenhouses />} />
          <Route path="yield-prediction" element={<OwnerYieldPrediction />} />
          <Route path="analytics" element={<OwnerAnalytics />} />
          <Route path="settings" element={<OwnerSettings />} />
        </Route>
        
        {/* 재배관리자 전용 페이지 */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerGreenhouses />} /> {/* 기본: 담당 온실 */}
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="greenhouses" element={<ManagerGreenhouses />} />
          <Route path="tasks" element={<ManagerTasks />} />
          <Route path="performance" element={<ManagerPerformance />} />
          <Route path="settings" element={<ManagerSettings />} />
        </Route>
        
        {/* 관리자 전용 페이지 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> {/* 기본: 대시보드 */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="system" element={<AdminSystem />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* 기존 데이터 분석 페이지들 (임시 유지) */}
        <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
        <Route path="/analytics/explorer" element={<DataExplorer />} />
        <Route path="/analytics/test" element={<TestPage />} />
        
        {/* 간단한 테스트 (레이아웃 없이) */}
        <Route path="/simple-test" element={<SimpleTest />} />
      </Routes>
    </Router>
  );
}

export default App;