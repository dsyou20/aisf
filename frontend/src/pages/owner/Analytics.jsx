import React from 'react';
import { Typography } from 'antd';
import AnalyticsDashboard from '../analytics/Dashboard';

const { Title } = Typography;

const OwnerAnalytics = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>📊 데이터 분석</Title>
      </div>
      <AnalyticsDashboard />
    </div>
  );
};

export default OwnerAnalytics;
