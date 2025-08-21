import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';

// 재배 관리 페이지들
import Overview from './pages/cultivation/Overview';
import Status from './pages/cultivation/Status';
import Recommendation from './pages/cultivation/Recommendation';
import Execution from './pages/cultivation/Execution';

// 전문가 관리 페이지들
import Owners from './pages/experts/Owners';
import Specialists from './pages/experts/Specialists';

// 지식 관리 페이지들
import Basic from './pages/knowledge/Basic';
import Experience from './pages/knowledge/Experience';
import Environment from './pages/knowledge/Environment';
import Growth from './pages/knowledge/Growth';
import Disease from './pages/knowledge/Disease';
import KnowledgeRecommendation from './pages/knowledge/Recommendation';
import Control from './pages/knowledge/Control';

// 관리자 페이지들
import Users from './pages/admin/Users';
import AdminKnowledge from './pages/admin/Knowledge';

// 데이터 분석 페이지들
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
        
        {/* 사용자 타입별 대시보드 */}
        <Route path="/dashboard/:userType" element={<Dashboard />} />
        
        {/* 재배 관리 */}
        <Route path="/cultivation" element={<DashboardLayout />}>
          <Route path="overview" element={<Overview />} />
          <Route path="status" element={<Status />} />
          <Route path="recommendation" element={<Recommendation />} />
          <Route path="execution" element={<Execution />} />
        </Route>
        
        {/* 전문가 관리 */}
        <Route path="/experts" element={<DashboardLayout />}>
          <Route path="owners" element={<Owners />} />
          <Route path="specialists" element={<Specialists />} />
        </Route>
        
        {/* 지식 관리 */}
        <Route path="/knowledge" element={<DashboardLayout />}>
          <Route path="basic" element={<Basic />} />
          <Route path="experience" element={<Experience />} />
          <Route path="environment" element={<Environment />} />
          <Route path="growth" element={<Growth />} />
          <Route path="disease" element={<Disease />} />
          <Route path="recommendation" element={<KnowledgeRecommendation />} />
          <Route path="control" element={<Control />} />
        </Route>
        
        {/* 관리자 */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="users" element={<Users />} />
          <Route path="knowledge" element={<AdminKnowledge />} />
        </Route>
        
        {/* 데이터 분석 */}
        <Route path="/analytics" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AnalyticsDashboard />} />
          <Route path="explorer" element={<DataExplorer />} />
          <Route path="test" element={<TestPage />} />
        </Route>
        
        {/* 간단한 테스트 (레이아웃 없이) */}
        <Route path="/simple-test" element={<SimpleTest />} />
      </Routes>
    </Router>
  );
}

export default App; 