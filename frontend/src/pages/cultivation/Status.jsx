import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  ExperimentOutlined, 
  DropboxOutlined, 
  SunOutlined, 
  CloudOutlined 
} from '@ant-design/icons';

const CultivationStatus = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>재배 현황</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="하우스 A - 토마토">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="온도"
                  value={25.6}
                  suffix="°C"
                  prefix={<ExperimentOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="습도"
                  value={68}
                  suffix="%"
                  prefix={<DropboxOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
            </Row>
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px' }}>생장 진행률</div>
              <Progress percent={85} status="active" />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="하우스 B - 딸기">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="온도"
                  value={23.2}
                  suffix="°C"
                  prefix={<ExperimentOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="습도"
                  value={72}
                  suffix="%"
                  prefix={<DropboxOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
            </Row>
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px' }}>생장 진행률</div>
              <Progress percent={45} status="active" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CultivationStatus; 